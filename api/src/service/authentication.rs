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
        let hash = PasswordHash::new(&usr.password);
        let hash = match hash {
            Ok(h) => Some(h),
            Err(e) => {
                println!("Error: {:?}", e);
                None
            }
        };
        let hash = hash.unwrap();
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
    let pw = register_request.password.unwrap();
    let pw = pw.as_bytes();
    let hashed_password = Argon2::default()
        .hash_password(&pw, &salt)
        .unwrap()
        .to_string();

    let parsed_hash = PasswordHash::new(&hashed_password).unwrap();
    let verify_password = Argon2::default()
        .verify_password(&pw, &parsed_hash)
        .map_or(false, |_| true);

    assert!(verify_password, "Password verification failed");

    let user = data
        .user()
        .create(
            register_request.display_name.unwrap(),
            register_request.email.unwrap(),
            hashed_password,
            vec![],
        )
        .exec()
        .await
        .unwrap();

    Ok(user)
}

pub async fn change_password(
    user_id: &str,
    new_password: &str,
    data: &web::Data<PrismaClient>,
) -> Result<String, ErrorCode> {
    let salt: SaltString = SaltString::generate(&mut OsRng);
    let pw = new_password.as_bytes();
    let hashed_password = Argon2::default()
        .hash_password(&pw, &salt)
        .unwrap()
        .to_string();

    let parsed_hash = PasswordHash::new(&hashed_password).unwrap();
    let verify_password = Argon2::default()
        .verify_password(&pw, &parsed_hash)
        .map_or(false, |_| true);

    assert!(verify_password, "Password verification failed");

    data.user()
        .update(
            user::id::equals(user_id.to_string()),
            vec![user::password::set(hashed_password.clone())],
        )
        .exec()
        .await
        .unwrap();

    Ok(hashed_password)
}
