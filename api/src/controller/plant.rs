/*
 * Copyright (c) Johannes Grimm 2024.
 */

use actix_web::{get, HttpRequest, HttpResponse, web};

use crate::AppState;

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(web::scope("/plant").service(list));
}

#[get("/")]
pub async fn list(data: web::Data<AppState>, request: HttpRequest) -> HttpResponse {
    HttpResponse::Ok().body(format!("Hello from sub mod"))
}
