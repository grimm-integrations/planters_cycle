/*
 * Copyright (c) Johannes Grimm 2024.
 */
use actix_web::{HttpResponse, ResponseError};
use derive_more::{Display, From};
use sea_orm::DbErr;

#[derive(Display, From, Debug)]
pub enum MyError {
    NotFound(String),
    DbErr(DbErr),
}

impl std::error::Error for MyError {}

impl ResponseError for MyError {
    fn error_response(&self) -> HttpResponse {
        match self {
            MyError::NotFound(error) => HttpResponse::NotFound().finish(),
            MyError::DbErr(DbErr::RecordNotFound(err)) => HttpResponse::NotFound().finish(),
            MyError::DbErr(err) => HttpResponse::InternalServerError().finish(),
        }
    }
}
