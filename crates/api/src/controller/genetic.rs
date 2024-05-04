/*
 * Copyright (c) Johannes Grimm 2024.
 */
use actix_web::{delete, get, post, put, web, Error, HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};
use service::sea_orm::DatabaseConnection;
use service::GeneticService;

#[derive(Deserialize, Serialize)]
struct GeneticRequest {
    name: String,
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/genetic")
            .service(list_genetics)
            .service(get_genetic)
            .service(edit_genetic)
            .service(create_genetic)
            .service(delete_genetic),
    );
}

#[put("/")]
async fn create_genetic(
    conn: web::Data<DatabaseConnection>,
    genetic: web::Json<::entity::genetic::Model>,
) -> Result<HttpResponse, Error> {
    let new_genetic = GeneticService::create_genetic(&conn, genetic.into_inner()).await?;
    Ok(HttpResponse::Ok().json(new_genetic))
}

#[get("/{user_id}")]
async fn get_genetic(
    conn: web::Data<DatabaseConnection>,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    match GeneticService::find_genetic_by_id(&conn, *path).await {
        Ok(genetic) => Ok(HttpResponse::Ok().json(genetic)),
        Err(_) => Ok(HttpResponse::NotFound().finish()),
    }
}

#[get("/")]
pub async fn list_genetics(conn: web::Data<DatabaseConnection>) -> Result<HttpResponse, Error> {
    let genetics = GeneticService::find_genetics_in_page(&conn, 1, 10).await?;
    Ok(HttpResponse::Ok().json(genetics.0))
}

#[delete("/{user_id}")]
pub async fn delete_genetic(
    conn: web::Data<DatabaseConnection>,
    id: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let _ = GeneticService::delete_genetic_by_id(&conn, *id).await?;
    Ok(HttpResponse::Ok().finish())
}

#[post("/{user_id}")]
pub async fn edit_genetic(
    conn: web::Data<DatabaseConnection>,
    id: web::Path<i32>,
    genetic_info: web::Json<::entity::genetic::Model>,
) -> Result<HttpResponse, Error> {
    let genetic = genetic_info.into_inner();
    let updated_genetic = GeneticService::edit_genetic(&conn, *id, genetic).await?;
    Ok(HttpResponse::Ok().json(updated_genetic))
}
