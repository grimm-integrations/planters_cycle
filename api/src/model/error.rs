/*
 * Copyright (c) Johannes Grimm 2024.
 */

use actix_web::HttpResponse;
use prisma_client_rust::{prisma_errors::query_engine::RecordNotFound, QueryError};
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

    #[doc = "Database error"]
    DATABASE001(String),

    #[doc = "Database entry not found"]
    DATABASE002,

    #[doc = "Bad request"]
    BADREQUEST(String),

    #[doc = "Unknown error"]
    UNKNOWN,
}

#[doc = "Application error model"]
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct ErrorResponse {
    pub code: ErrorCode,
}

impl ErrorResponse {
    #[allow(dead_code)]
    #[doc = "Create new error response"]
    pub fn new(code: ErrorCode) -> Self {
        Self { code }
    }

    #[allow(dead_code)]
    #[doc = "Mapping error responses to status codes"]
    pub fn build(code: ErrorCode) -> HttpResponse {
        match code {
            ErrorCode::AUTH001 => HttpResponse::NotFound(),
            ErrorCode::AUTH002 => HttpResponse::Unauthorized(),
            ErrorCode::INTERNAL001 => HttpResponse::InternalServerError(),
            ErrorCode::DATABASE001(_) => HttpResponse::InternalServerError(),
            ErrorCode::DATABASE002 => HttpResponse::NotFound(),
            ErrorCode::BADREQUEST(_) => HttpResponse::BadRequest(),
            ErrorCode::UNKNOWN => HttpResponse::ImATeapot(),
        }
        .json(json!(ErrorResponse::new(code)))
    }
}

impl From<QueryError> for ErrorCode {
    fn from(error: QueryError) -> Self {
        if error.is_prisma_error::<RecordNotFound>() {
            return ErrorCode::DATABASE002;
        }
        ErrorCode::DATABASE001(error.to_string())
    }
}
