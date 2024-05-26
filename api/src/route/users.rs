/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::{
    model::dto::auth::RegisterRequest,
    prisma::{user, PrismaClient},
    service::{authentication::register_user, user::edit_user_by_id},
};
use actix_web::{delete, get, post, web, HttpResponse, Responder};

pub fn user_controller_init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(
        web::scope("/users")
            .service(get_users)
            .service(get_user_by_id)
            .service(create_user)
            .service(delete_user)
            .service(edit_user),
    );
}

#[get("")]
async fn get_users(data: web::Data<PrismaClient>) -> impl Responder {
    let users = data
        .user()
        .find_many(vec![])
        .select(user::select!({
            id
            display_name
            email
            last_login
            created_at
            roles
        }))
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().json(users)
}

#[get("/{id}")]
async fn get_user_by_id(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    let user = data
        .user()
        .find_unique(user::id::equals(id.to_string()))
        .select(user::select!({
            id
            display_name
            email
            last_login
            created_at
            roles
        }))
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().json(user.unwrap())
}

#[post("")]
async fn create_user(
    data: web::Data<PrismaClient>,
    body: web::Json<RegisterRequest>,
) -> impl Responder {
    let register_result = register_user(body.into_inner(), data).await;
    match register_result {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(_) => HttpResponse::BadRequest().finish(),
    }
}

user::partial_unchecked!(UserUpdateData { display_name email password });
#[post("/{id}")]
async fn edit_user(
    data: web::Data<PrismaClient>,
    id: web::Path<String>,
    body: web::Json<UserUpdateData>,
) -> impl Responder {
    match edit_user_by_id(&id.to_string(), &data, body.into_inner()).await {
        Err(_) => HttpResponse::NotFound().body("User not found"),
        Ok(usr) => HttpResponse::Ok().json(usr),
    }
}

#[delete("/{id}")]
async fn delete_user(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    match data
        .user()
        .delete(user::id::equals(id.to_string()))
        .exec()
        .await
    {
        Err(_) => HttpResponse::NotFound().body("User not found"),
        Ok(usr) => HttpResponse::Ok().json(usr),
    }
}
