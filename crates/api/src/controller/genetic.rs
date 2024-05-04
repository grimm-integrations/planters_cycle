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
    _request: HttpRequest,
    genetic: web::Json<::entity::genetic::Model>,
) -> Result<HttpResponse, Error> {
    match GeneticService::create_genetic(&conn, genetic.name.to_owned()).await {
        Ok(genetic) => return Ok(HttpResponse::Ok().json(genetic)),
        Err(e) => {
            eprintln!("Failed to create genetic: {:?}", e);
            return Ok(HttpResponse::BadRequest().body(e.to_string()));
        }
    }
}

#[get("/{user_id}")]
async fn get_genetic(
    conn: web::Data<DatabaseConnection>,
    _request: HttpRequest,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let g = GeneticService::find_genetic_by_id(&conn, path.into_inner()).await.unwrap();
    Ok(HttpResponse::Ok().json(g))
    /* match GeneticService::find_genetic_by_id(&conn, path.into_inner()).await {
        Ok(genetic) => return Ok(HttpResponse::Ok().json(genetic)),
        Err(e) => {
            return Error(eprintln!("Failed to get genetic: {:?}", e));
        }
    
    } */
}

#[get("/")]
pub async fn list_genetics(
    conn: web::Data<DatabaseConnection>,
    _request: HttpRequest,
) -> Result<HttpResponse, Error> {
    match GeneticService::find_genetics_in_page(&conn, 1, 10).await {
        Ok(genetics) => return Ok(HttpResponse::Ok().json(genetics.0)),
        Err(e) => {
            eprintln!("Failed to list genetics: {:?}", e);
            return Ok(HttpResponse::BadRequest().body("Failed to list genetics"));
        }
    }
}

#[delete("/{user_id}")]
pub async fn delete_genetic(
    conn: web::Data<DatabaseConnection>,
    _request: HttpRequest,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    match GeneticService::delete_genetic_by_id(&conn, path.into_inner()).await {
        Ok(_) => return Ok(HttpResponse::Ok().finish()),
        Err(e) => {
            if e.to_string().contains("not found") {
                return Ok(HttpResponse::NotFound().finish());
            }
            eprintln!("Failed to delete genetic: {:?}", e);
            return Ok(HttpResponse::BadRequest().body(e.to_string()));
        }
    }
}

#[post("/{user_id}")]
pub async fn edit_genetic(
    conn: web::Data<DatabaseConnection>,
    _request: HttpRequest,
    path: web::Path<i32>,
    genetic: web::Json<::entity::genetic::Model>,
) -> Result<HttpResponse, Error> {
    match GeneticService::edit_genetic(&conn, path.into_inner(), genetic.into_inner()).await {
        Ok(genetic) => {
            return Ok(HttpResponse::Ok().json(genetic));
        }
        Err(e) => {
            if e.to_string().contains("not found") {
                return Ok(HttpResponse::NotFound().finish());
            }
            eprintln!("Failed to edit genetic: {:?}", e);
            return Ok(HttpResponse::BadRequest().body(e.to_string()));
        }
    }
}
