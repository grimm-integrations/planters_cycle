/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::model::error::ErrorCode;
use crate::prisma;
use crate::prisma::{user, PrismaClient};
use actix_web::web;
use prisma_client_rust::or;

pub async fn find_by_identifier(
    identifier: &str,
    data: web::Data<PrismaClient>,
) -> Result<Option<prisma::user::Data>, ErrorCode> {
    data.user()
        .find_first(vec![or![
            user::display_name::equals(identifier.to_string()),
            user::email::equals(identifier.to_string()),
        ]])
        .exec()
        .await
        .map_err(|_| ErrorCode::INTERNAL001)
}
