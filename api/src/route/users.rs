/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::prisma::{user, PrismaClient};
use actix_web::{delete, get, post, web, HttpResponse, Responder};

#[allow(dead_code)]
pub fn user_controller_init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(
        web::scope("/users")
            .service(get_users)
            .service(get_user_by_id)
            .service(create_user)
            .service(delete_user),
    );
}

#[get("/users")]
async fn get_users(data: web::Data<PrismaClient>) -> impl Responder {
    let users = data.user().find_many(vec![]).exec().await.unwrap();
    HttpResponse::Ok().json(users)
}

#[get("/users/{id}")]
async fn get_user_by_id(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    let user = data
        .user()
        .find_unique(user::id::equals(id.to_string()))
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().json(user.unwrap())
}

user::partial_unchecked!(UserUpdateData { display_name });

#[post("/users")]
async fn create_user(
    data: web::Data<PrismaClient>,
    body: web::Json<UserUpdateData>,
) -> impl Responder {
    let user = data
        .user()
        .create(
            body.display_name.as_ref().unwrap().to_string(),
            "".to_owned(),
            "".to_owned(),
            vec![],
        )
        .exec()
        .await
        .unwrap();

    HttpResponse::Ok().json(user)
}

#[delete("/users/{id}")]
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
