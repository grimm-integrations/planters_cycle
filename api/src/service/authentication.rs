/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::model::dto::auth::LoginRequest;
use crate::model::error::ErrorCode;
use crate::model::error::ErrorCode::AUTH001;
use crate::prisma;
use crate::prisma::{user, PrismaClient};
use actix_web::web;

pub async fn login_user(
    login_request: LoginRequest,
    data: web::Data<PrismaClient>,
) -> Result<String, ErrorCode> {
    let user: Option<prisma::user::Data> = match data
        .user()
        .find_unique(user::id::equals(login_request.identifier.clone()))
        .exec()
        .await
    {
        Ok(usr) => usr,
        Err(e) => return Err(e),
    };

    if (user.is_none()) {
        return Err(AUTH001);
    }
}
