/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::{
    middleware::auth::verify_token,
    model::{dto::Plant, error::ErrorResponse},
    prisma::PrismaClient,
    service,
};
use actix_web::{delete, get, guard, post, web, HttpResponse, Responder};

#[allow(dead_code)]
pub fn plant_controller_init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(
        web::scope("/plants")
            .guard(guard::fn_guard(verify_token))
            .service(get_plants)
            .service(get_plant_by_id)
            .service(create_plant)
            .service(delete_plant)
          .service(edit_plant),
    );
}

#[get("")]
async fn get_plants(data: web::Data<PrismaClient>) -> impl Responder {
    match service::plant::get_plants(&data).await {
        Ok(genetics) => HttpResponse::Ok().json(genetics),
        Err(e) => ErrorResponse::build(e),
    }
}

#[get("/{id}")]
async fn get_plant_by_id(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    match service::plant::get_plant_by_id(&data, id.into_inner()).await {
        Ok(plant) => HttpResponse::Ok().json(plant),
        Err(e) => ErrorResponse::build(e),
    }
}

#[post("")]
async fn create_plant(data: web::Data<PrismaClient>, body: web::Json<Plant>) -> impl Responder {
    match service::plant::create_plant(&data, body.into_inner()).await {
        Ok(plant) => HttpResponse::Created().json(plant),
        Err(e) => ErrorResponse::build(e),
    }
}

#[post("/{id}")]
async fn edit_plant(
    data: web::Data<PrismaClient>,
    id: web::Path<String>,
    body: web::Json<Plant>,
) -> impl Responder {
    match service::plant::edit_plant(&data, id.into_inner(), body.into_inner()).await {
        Ok(plant) => HttpResponse::Ok().json(plant),
        Err(e) => ErrorResponse::build(e),
    }
}

#[delete("/{id}")]
async fn delete_plant(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    match service::plant::delete_plant(&data, id.into_inner()).await {
        Ok(_) => HttpResponse::Ok().finish(),
        Err(e) => ErrorResponse::build(e),
    }
}
