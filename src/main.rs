#[allow(warnings, unused)]
mod prisma;

use std::env;

use actix_web::{delete, get, middleware, post, web, App, HttpResponse, HttpServer, Responder};
use prisma::PrismaClient;
use prisma_client_rust::NewClientError;

use prisma::user;

#[get("/users")]
async fn get_users(data: web::Data<PrismaClient>) -> impl Responder {
    let users = data.user().find_many(vec![]).exec().await.unwrap();
    HttpResponse::Ok().json(users)
}

#[get("/users/{id}")]
async fn get_user_by_id(
    data: web::Data<PrismaClient>,
    id: web::Path<String>,
) -> impl Responder {
    let user = data
        .user()
        .find_unique(user::id::equals(id.to_string()))
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().json(user.unwrap())
}

user::partial_unchecked!(UserUpdateData {
    display_name
});

#[post("/users")]
async fn create_user(
    data: web::Data<PrismaClient>,
    body: web::Json<UserUpdateData>,
) -> impl Responder {
    let user = data
        .user()
        .create(body.display_name.as_ref().unwrap().to_string(), vec![])
        .exec()
        .await
        .unwrap();

    HttpResponse::Ok().json(user)
}

#[delete("/users/{id}")]
async fn delete_user(
    data: web::Data<PrismaClient>,
    id: web::Path<String>,
) -> impl Responder {
    match data.user().delete(user::id::equals(id.to_string())).exec().await {
        Err(_) => {
            return HttpResponse::NotFound().body("User not found");
        }
        Ok(usr) => {
            return HttpResponse::Ok().json(usr);
        }
    }
}
    
#[allow(dead_code)]
async fn not_found() -> HttpResponse {
    HttpResponse::NotFound().body("Not Found")
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let client: Result<PrismaClient, NewClientError> = PrismaClient::_builder().build().await;

    let client = client.unwrap();

    env::set_var("RUST_LOG", "actix_web=debug");
    let data = web::Data::new(client);

    HttpServer::new(move || {
        App::new()
            .wrap(middleware::Logger::default())
            .app_data(data.clone())
            .default_service(web::route().to(not_found))
            .service(get_users)
            .service(get_user_by_id)
            .service(create_user)
            .service(delete_user)
    })
    .bind(("127.0.0.1", 3001))?
    .run()
    .await?;

    Ok(())
}
