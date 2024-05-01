/*
 * Copyright (c) Johannes Grimm 2024.
 */
use actix_web::{get, put, web, Error, HttpRequest, HttpResponse};
use serde::{Deserialize, Serialize};
use service::GeneticService;

use crate::AppState;

#[derive(Deserialize, Serialize)]
struct GeneticRequest {
    name: String,
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/genetic")
            .service(list_genetics)
            .service(get_genetic)
            .service(create_genetic),
    );
}

#[put("/")]
async fn create_genetic(
    data: web::Data<AppState>,
    _request: HttpRequest,
    genetic: web::Form<::entity::genetic::Model>,
) -> Result<HttpResponse, Error> {
    match GeneticService::create_genetic(&data.conn, genetic.into_inner()).await {
        Ok(genetic) => {
            return Ok(HttpResponse::Ok()
                .content_type("application/json")
                .body(format!("{:?}", genetic)))
        }
        Err(e) => {
            eprintln!("Failed to create genetic: {:?}", e);
            return Ok(HttpResponse::BadRequest().body("Failed to create genetic"));
        }
    }
    /*let genetic = GeneticService::create_genetic(&data.conn, genetic.into_inner())
        .await
        .expect("Could not create Genetic");

    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(format!("{:?}", genetic)))*/
}

#[get("/{user_id}")]
async fn get_genetic(
    data: web::Data<AppState>,
    _request: HttpRequest,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let user_id = path.into_inner();
    let genetic = GeneticService::find_genetic_by_id(&data.conn, user_id)
        .await
        .expect("Could not find Genetic");

    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(format!("{:?}", genetic.unwrap())))
}

#[get("/")]
pub async fn list_genetics(
    data: web::Data<AppState>,
    _request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let genetics = GeneticService::find_genetics_in_page(&data.conn, 1, 10)
        .await
        .expect("Could not find Genetics in Page");

    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .body(format!("{:?}", genetics.0)))
}
