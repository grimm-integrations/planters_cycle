/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::model::dto::auth::{LoginRequest, RegisterRequest};
use crate::model::error::ErrorResponse;
use crate::prisma::PrismaClient;
use crate::service::authentication::{login_user, register_user};

use actix_identity::Identity;
use actix_web::web::Json;
use actix_web::{post, web, HttpMessage, HttpRequest, HttpResponse, Responder};

#[allow(dead_code)]
pub fn auth_controller_init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/auth").service(login).service(logout));
}

#[post("/login")]
async fn login(
    body: Json<LoginRequest>,
    req: HttpRequest,
    data: web::Data<PrismaClient>,
) -> impl Responder {
    let login_result = login_user(body.into_inner(), data).await;
    match login_result {
        Ok(user) => {
            Identity::login(&req.extensions(), user.id.clone()).unwrap();
            HttpResponse::Ok().finish()
        }
        Err(e) => ErrorResponse::build(e),
    }
}

#[post("/logout")]
async fn logout(ident: Identity) -> impl Responder {
    ident.logout();
    HttpResponse::Ok().finish()
}

#[post("/register")]
async fn register(body: Json<RegisterRequest>, data: web::Data<PrismaClient>) -> impl Responder {
    let register_result = register_user(body.into_inner(), data).await;
    match register_result { 
        Ok(user) => {
            // Identity::login(&req.extensions(), user.id.clone()).unwrap();
            HttpResponse::Ok().json(user)
        }
        Err(e) => ErrorResponse::build(e),
    }
}
