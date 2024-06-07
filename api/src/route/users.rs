/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::{
    middleware::auth::verify_token,
    model::dto::auth::RegisterRequest,
    prisma::{user, users_in_roles, PrismaClient},
    service::user::{create_new_user, edit_user_by_id},
};
use actix_identity::Identity;
use actix_web::{delete, get, guard, post, web, HttpResponse, Responder};
use prisma_client_rust::or;
use serde::Deserialize;

pub fn user_controller_init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.service(
        web::scope("/users")
            .guard(guard::fn_guard(verify_token))
            .service(count_users)
            .service(get_users)
            .service(get_user_by_id)
            .service(create_user)
            .service(delete_user)
            .service(edit_user),
    );
}

#[derive(Debug, Deserialize)]
struct UserSearchQuery {
    query: String,
}
#[post("/count")]
async fn count_users(
    data: web::Data<PrismaClient>,
    query: web::Query<UserSearchQuery>,
) -> impl Responder {
    let users = data
        .user()
        .count(vec![or![
            user::display_name::contains(query.query.clone()),
            user::email::contains(query.query.clone())
        ]])
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().body(users.to_string())
}

#[get("")]
async fn get_users(
    data: web::Data<PrismaClient>,
    query: web::Query<UserSearchQuery>,
) -> impl Responder {
    let users = data
        .user()
        .find_many(vec![or![
            user::display_name::contains(query.query.clone()),
            user::email::contains(query.query.clone())
        ]])
        .with(user::roles::fetch(vec![]).with(users_in_roles::role::fetch()))
        .select(user::select!({
            id
            display_name
            email
            last_login
            created_at
            roles(vec![]): select {
                user_id
                role
                role_id
                assigned_at
                assigned_by
            }
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

    match user {
        Some(user) => HttpResponse::Ok().json(user),
        None => HttpResponse::NotFound().body("User not found"),
    }
}

#[post("")]
async fn create_user(
    identity: Option<Identity>,
    data: web::Data<PrismaClient>,
    body: web::Json<RegisterRequest>,
) -> impl Responder {
    let ident_id: String = match identity.map(|id| id.id()) {
        None => "anonymous".to_owned(),
        Some(Ok(id)) => id,
        Some(Err(_)) => return HttpResponse::InternalServerError().finish(),
    };
    let register_result = create_new_user(ident_id, body.into_inner(), &data).await;
    match register_result {
        Ok(user) => HttpResponse::Ok().json(user),
        Err(_) => HttpResponse::BadRequest().finish(),
    }
}

#[post("/{id}")]
async fn edit_user(
    identity: Option<Identity>,
    data: web::Data<PrismaClient>,
    id: web::Path<String>,
    body: web::Json<user::Data>,
) -> impl Responder {
    let ident_id = match identity.map(|id| id.id()) {
        None => "anonymous".to_owned(),
        Some(Ok(id)) => id,
        Some(Err(_)) => return HttpResponse::InternalServerError().finish(),
    };
    match edit_user_by_id(&id.to_string(), &data, body.into_inner(), ident_id).await {
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
