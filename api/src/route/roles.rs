/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::prisma::{role, PrismaClient};
use actix_web::{delete, get, post, web, HttpResponse, Responder};

#[allow(dead_code)]
pub fn role_controller_init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(
        web::scope("/roles")
            .service(get_roles)
            .service(get_role_by_id)
            .service(create_role)
            .service(delete_role)
            .service(edit_role),
    );
}

#[get("")]
async fn get_roles(data: web::Data<PrismaClient>) -> impl Responder {
    let roles = data.role().find_many(vec![]).exec().await.unwrap();
    HttpResponse::Ok().json(roles)
}

#[get("/{id}")]
async fn get_role_by_id(data: web::Data<PrismaClient>, id: web::Path<i32>) -> impl Responder {
    let role = data
        .role()
        .find_unique(role::id::equals(id.into_inner()))
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().json(role.unwrap())
}

#[post("")]
async fn create_role(data: web::Data<PrismaClient>, body: web::Json<role::Data>) -> impl Responder {
    let body = body.into_inner();
    let role = data
        .role()
        .create(
            body.name,
            vec![role::is_default::set(body.is_default)],
        )
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().json(role)
}

#[post("/{id}")]
async fn edit_role(
    data: web::Data<PrismaClient>,
    id: web::Path<i32>,
    body: web::Json<role::Data>,
) -> impl Responder {
    let role = data
        .role()
        .update(
            role::id::equals(id.into_inner()),
            vec![role::name::set(body.into_inner().name)],
        )
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().json(role)
}

#[delete("/{id}")]
async fn delete_role(data: web::Data<PrismaClient>, id: web::Path<i32>) -> impl Responder {
    match data
        .role()
        .delete(role::id::equals(id.into_inner()))
        .exec()
        .await
    {
        Err(_) => HttpResponse::NotFound().body("Role not found"),
        Ok(role) => HttpResponse::Ok().json(role),
    }
}
