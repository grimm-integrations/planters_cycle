/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::model::error::ErrorCode;
use crate::prisma::{user, PrismaClient};
use actix_web::web;
use chrono::Utc;
use prisma_client_rust::or;

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

pub async fn edit_user_by_id(
    id: &str,
    data: &web::Data<PrismaClient>,
    user: crate::route::users::UserUpdateData,
) -> Result<user::Data, ErrorCode> {
    match data
        .user()
        .update_unchecked(
            user::id::equals(id.to_string()),
            user.to_params()
        )
        .exec()
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
    {
        Ok(u) => Ok(u),
        Err(e) => Err(e),
    }
}
