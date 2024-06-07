/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::{
    middleware::auth::verify_token,
    model::{dto::Genetic, error::ErrorResponse},
    prisma::PrismaClient,
    service,
};
use actix_web::{delete, get, guard, patch, post, web, HttpResponse, Responder};

#[allow(dead_code)]
pub fn genetic_controller_init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(
        web::scope("/genetics")
            .guard(guard::fn_guard(verify_token))
            .service(get_genetics)
            .service(get_genetic_by_id)
            .service(create_genetic)
            .service(delete_genetic)
            .service(edit_genetic),
    );
}

#[get("")]
async fn get_genetics(data: web::Data<PrismaClient>) -> impl Responder {
    match service::genetic::get_genetics(&data).await {
        Ok(genetics) => HttpResponse::Ok().json(genetics),
        Err(e) => ErrorResponse::build(e),
    }
}

#[get("/{id}")]
async fn get_genetic_by_id(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    match service::genetic::get_genetic_by_id(&data, id.into_inner()).await {
        Ok(genetics) => HttpResponse::Ok().json(genetics),
        Err(e) => ErrorResponse::build(e),
    }
}

#[post("")]
async fn create_genetic(data: web::Data<PrismaClient>, body: web::Json<Genetic>) -> impl Responder {
    match service::genetic::create_genetic(&data, body.into_inner()).await {
        Ok(genetics) => HttpResponse::Created().json(genetics),
        Err(e) => ErrorResponse::build(e),
    }
}

#[patch("/{id}")]
async fn edit_genetic(
    data: web::Data<PrismaClient>,
    id: web::Path<String>,
    body: web::Json<Genetic>,
) -> impl Responder {
    match service::genetic::edit_genetic(&data, id.into_inner(), body.into_inner()).await {
        Ok(genetics) => HttpResponse::Ok().json(genetics),
        Err(e) => ErrorResponse::build(e),
    }
}

#[delete("/{id}")]
async fn delete_genetic(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    match service::genetic::delete_genetic(&data, id.into_inner()).await {
        Ok(genetics) => HttpResponse::Ok().json(genetics),
        Err(e) => ErrorResponse::build(e),
    }
}
