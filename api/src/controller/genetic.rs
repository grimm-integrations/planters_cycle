/*
 * Copyright (c) Johannes Grimm 2024.
 */
use actix_web::{get, web, Error, HttpRequest, HttpResponse};
use sea_orm::*;

use ::entity::{genetic, genetic::Entity as Genetic};
use service::sea_orm::{EntityTrait, QueryOrder};
use service::Query;

use crate::AppState;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/genetic").service(list_genetics));
}

#[get("/")]
pub async fn list_genetics(
    data: web::Data<AppState>,
    request: HttpRequest,
) -> Result<HttpResponse, Error> {
    let genetics = Query::find_genetics_in_page(&data.conn, 1, 10)
        .await
        .expect("Could not find Genetics in Page");

    Ok(HttpResponse::Ok()
        .content_type("text/html")
        .body(format!("{:?}", genetics.0)))
}
