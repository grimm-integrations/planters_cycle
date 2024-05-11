/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::model::dto::auth::{LoginRequest, RegisterRequest};
use crate::model::error::ErrorCode;
use crate::model::error::ErrorCode::{AUTH001, AUTH002};
use crate::prisma::{user, PrismaClient};
use crate::service::user::{find_by_identifier, update_last_login};
use actix_web::web;
use argon2::password_hash::rand_core::OsRng;
use argon2::password_hash::SaltString;
use argon2::{Argon2, PasswordHash, PasswordHasher, PasswordVerifier};

pub async fn login_user(
    login_request: LoginRequest,
    data: web::Data<PrismaClient>,
) -> Result<user::Data, ErrorCode> {
    let user: Option<user::Data> = match find_by_identifier(&login_request.identifier, &data).await
    {
        Ok(usr) => usr,
        Err(e) => return Err(e),
    };

    if user.is_none() {
        return Err(AUTH001);
    }

    let valid_password: bool = user.to_owned().map_or(false, |usr| {
        let hash: PasswordHash = PasswordHash::new(&usr.password).unwrap();
        Argon2::default()
            .verify_password(login_request.password.as_bytes(), &hash)
            .map_or(false, |_| true)
    });

    if !valid_password {
        return Err(AUTH002);
    }

    let user = user.unwrap();

    match update_last_login(&user.id, &data).await {
        Ok(_) => Ok(user.clone()),
        Err(e) => Err(e),
    }
}

pub async fn register_user(
    register_request: RegisterRequest,
    data: web::Data<PrismaClient>,
) -> Result<user::Data, ErrorCode> {
    let salt: SaltString = SaltString::generate(&mut OsRng);
    let hashed_password =
        Argon2::default().hash_password(register_request.password.unwrap().as_bytes(), &salt);

    let user = data
        .user()
        .create(
            register_request.display_name.unwrap(),
            register_request.email.unwrap(),
            hashed_password.unwrap().hash.unwrap().to_string(),
            vec![],
        )
        .exec()
        .await
        .unwrap();

    Ok(user)
}
