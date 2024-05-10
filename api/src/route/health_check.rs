/*
 * Copyright (c) Johannes Grimm 2024.
 */

use actix_web::{get, HttpResponse, Responder};

#[tracing::instrument(name = "Checking the application health")]
#[get("/health_check")]
pub async fn health_check() -> impl Responder {
    HttpResponse::Ok().finish()
}
