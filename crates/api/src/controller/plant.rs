/*
 * Copyright (c) Johannes Grimm 2024.
 */

use actix_web::{get, web, HttpRequest, HttpResponse};

use crate::AppState;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/plant").service(list_plants));
}

#[get("/")]
pub async fn list_plants(_data: web::Data<AppState>, _request: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().body(format!("Hello from sub mod"))
}