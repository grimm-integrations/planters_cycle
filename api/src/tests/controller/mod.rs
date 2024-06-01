/*
 * Copyright (c) Johannes Grimm 2024.
 */

use actix_http::Request;
use actix_identity::IdentityMiddleware;
use actix_session::{
    config::PersistentSession, storage::RedisActorSessionStore, SessionMiddleware,
};
use actix_web::{
    cookie::time::Duration,
    dev::{Service, ServiceFactory, ServiceRequest, ServiceResponse},
    test, web, App, Error,
};

use crate::{model::dto::auth::LoginRequest, prisma::PrismaClient};

use super::get_prisma_client;

pub(crate) mod auth_controller;
pub(crate) mod health_controller;
pub(crate) mod index_controller;

#[allow(dead_code)]
async fn init_app_state() -> web::Data<PrismaClient> {
    web::Data::new(get_prisma_client().await)
}

#[allow(dead_code)]
fn init_app_entry() -> App<
    impl ServiceFactory<
        ServiceRequest,
        Config = (),
        Response = ServiceResponse,
        Error = actix_web::Error,
        InitError = (),
    >,
> {
    App::new().wrap(IdentityMiddleware::default()).wrap(
        SessionMiddleware::builder(
            RedisActorSessionStore::new("127.0.0.1:6379"),
            actix_web::cookie::Key::from("Wg5iPpQstNgAcOSc7keT8F5uKkqAxGnd1T6kOMvi3llVzSF6Dg8OLLuxbuEKpHrcIo9BJKz3PZTAJvFOVZcfKQ==".as_bytes())
                .clone(),
        )
        .cookie_name("plnt_test".to_owned())
        // .cookie_secure(secure) // Requires HTTPS
        .session_lifecycle(PersistentSession::default().session_ttl(Duration::hours(24)))
        .build(),
    )
}

#[allow(dead_code)]
pub async fn login(
    app: &impl Service<Request, Response = ServiceResponse, Error = Error>,
) -> ServiceResponse {
    let login_request = LoginRequest {
        identifier: "test".to_owned(),
        password: "test".to_owned(),
    };

    test::call_service(
        &app,
        test::TestRequest::post()
            .uri("/api/auth/login")
            .set_json(login_request)
            .to_request(),
    )
    .await
}
