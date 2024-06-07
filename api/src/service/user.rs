/*
 * Copyright (c) Johannes Grimm 2024.
 */

use std::collections::HashSet;

use crate::model::dto::auth::{RegisterRequest, RoleRegisterRequest};
use crate::model::error::ErrorCode;
use crate::prisma::{role, user, users_in_roles, PrismaClient};
use actix_web::web;
use chrono::Utc;
use prisma_client_rust::or;

use super::authentication::{change_password, register_user};

pub async fn find_by_identifier(
    identifier: &str,
    data: &web::Data<PrismaClient>,
) -> Result<Option<user::Data>, ErrorCode> {
    data.user()
        .find_first(vec![or![
            user::display_name::equals(identifier.to_string()),
            user::email::equals(identifier.to_string()),
        ]])
        .exec()
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
}

pub async fn update_last_login(id: &str, data: &web::Data<PrismaClient>) -> Result<(), ErrorCode> {
    match data
        .user()
        .update(
            user::id::equals(id.to_string()),
            vec![user::last_login::set(Some(Utc::now().fixed_offset()))],
        )
        .exec()
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
    {
        Ok(_) => Ok(()),
        Err(e) => Err(e),
    }
}

pub async fn create_new_user(
    assigner_id: String,
    user: RegisterRequest,
    data: &web::Data<PrismaClient>,
) -> Result<user::Data, ErrorCode> {
    let new_user = match register_user(&user, data).await {
        Ok(u) => u,
        Err(e) => return Err(e),
    };

    let mut user_roles = user.roles.unwrap_or_default();

    let default_roles = match data
        .role()
        .find_many(vec![role::is_default::equals(true)])
        .exec()
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
    {
        Ok(r) => r,
        Err(e) => return Err(e),
    };

    if !default_roles.is_empty() {
        for item in default_roles {
            user_roles.push(RoleRegisterRequest {
                role_id: item.id,
                assigned_at: Utc::now().fixed_offset(),
                assigned_by: assigner_id.to_owned(),
            })
        }
    }

    if !user_roles.is_empty() {
        for item in user_roles {
            match data
                .users_in_roles()
                .create_unchecked(
                    new_user.id.to_owned(),
                    item.role_id,
                    item.assigned_by,
                    vec![],
                )
                .exec()
                .await
                .map_err(|_| ErrorCode::INTERNAL001)
            {
                Ok(_) => (),
                Err(e) => return Err(e),
            }
        }
    }
    match data
        .user()
        .find_unique(user::id::equals(new_user.id))
        .exec()
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
    {
        Ok(u) => Ok(u.unwrap()),
        Err(e) => Err(e),
    }
}

user::partial_unchecked!(UserUpdateData { display_name email });
pub async fn edit_user_by_id(
    id: &str,
    data: &web::Data<PrismaClient>,
    user: user::Data,
    assigner_id: String,
) -> Result<user::Data, ErrorCode> {
    let mut user: user::Data = user.clone();

    if !user.password.is_empty() {
        match change_password(id, &user.password.clone(), data).await {
            Ok(pw) => {
                user.password = pw;
            }
            Err(e) => return Err(e),
        }
    }

    let user_roles = user.roles.unwrap_or_default();

    if !user_roles.is_empty() {
        let org_user_roles = match data
            .user()
            .find_unique(user::id::equals(id.to_string()))
            .with(user::roles::fetch(vec![]))
            .select(user::select!({ roles }))
            .exec()
            .await
            .map_err(|_| ErrorCode::INTERNAL001)
        {
            Ok(u) => u.unwrap().roles,
            Err(e) => return Err(e),
        };

        let previous_items: HashSet<i32> = org_user_roles.iter().map(|x| x.role_id).collect();
        let added_roles: Vec<users_in_roles::Data> = user_roles
            .clone()
            .into_iter()
            .filter(|item| !previous_items.contains(&item.role_id))
            .collect();

        let previous_items: HashSet<i32> = user_roles.iter().map(|x| x.role_id).collect();
        let deleted_roles: Vec<users_in_roles::Data> = org_user_roles
            .into_iter()
            .filter(|item| !previous_items.contains(&item.role_id))
            .collect();

        for item in added_roles {
            match data
                .users_in_roles()
                .create_unchecked(item.user_id, item.role_id, assigner_id.to_owned(), vec![])
                .exec()
                .await
                .map_err(|_| ErrorCode::INTERNAL001)
            {
                Ok(_) => (),
                Err(e) => return Err(e),
            }
        }

        for item in deleted_roles {
            match data
                .users_in_roles()
                .delete(users_in_roles::user_id_role_id(item.user_id, item.role_id))
                .exec()
                .await
                .map_err(|_| ErrorCode::INTERNAL001)
            {
                Ok(_) => (),
                Err(e) => return Err(e),
            }
        }
    }

    let user = UserUpdateData {
        display_name: Some(user.display_name),
        email: Some(user.email),
    };

    match data
        .user()
        .update_unchecked(user::id::equals(id.to_string()), user.to_params())
        .exec()
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
    {
        Ok(u) => Ok(u),
        Err(e) => Err(e),
    }
}
