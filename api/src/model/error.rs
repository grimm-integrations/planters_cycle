/*
 * Copyright (c) Johannes Grimm 2024.
 */

use actix_web::http::StatusCode;
use actix_web::HttpResponse;
use serde::{Deserialize, Serialize};
use serde_json::json;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub enum ErrorCode {
    #[doc = "User not found"]
    AUTH001,
    #[doc = "Wrong password"]
    AUTH002,

    #[doc = "Internal server error"]
    INTERNAL001,
}

#[doc = "Application error model"]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub code: ErrorCode,
}

impl ErrorResponse {
    #[doc = "Create new error response"]
    pub fn new(code: ErrorCode) -> Self {
        Self { code }
    }

    #[doc = "Mapping error responses to status codes"]
    pub fn build(code: ErrorCode) -> HttpResponse {
        match code {
            ErrorCode::AUTH001 => HttpResponse::NotFound(),
            ErrorCode::AUTH002 => HttpResponse::Unauthorized(),
            _ => HttpResponse::build(StatusCode::from_u16(418).unwrap()),
        }
        .json(json!(ErrorResponse::new(code)))
    }
}
