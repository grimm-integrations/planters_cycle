use std::{env, net::TcpListener};

use actix_identity::Identity;
use actix_session::Session;
use actix_web::{error, get, post, web, HttpMessage, HttpRequest, HttpResponse, Responder, Result};
use prisma_client_rust::NewClientError;
use serde::{Deserialize, Serialize};

use prisma::PrismaClient;

use crate::server::run;

#[allow(warnings, unused)]
mod prisma;
mod route;
mod server;

#[allow(dead_code)]
async fn not_found() -> HttpResponse {
    HttpResponse::NotFound().body("Not Found")
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct IndexResponse {
    user_id: Option<String>,
    counter: i32,
}

#[derive(Deserialize)]
struct IdentityLog {
    user_id: String,
}

#[post("/login")]
async fn login(
    user_id: web::Json<IdentityLog>,
    req: HttpRequest,
    session: Session,
) -> Result<HttpResponse> {
    let id = user_id.into_inner().user_id;
    let counter: i32 = session
        .get::<i32>("counter")
        .unwrap_or(Some(0))
        .unwrap_or(0);

    Identity::login(&req.extensions(), id.clone()).unwrap();

    Ok(HttpResponse::Ok().json(IndexResponse {
        user_id: Some(id),
        counter,
    }))
}

#[post("/logout")]
async fn logout(ident: Identity) -> Result<String> {
    ident.logout();
    Ok("logged out".to_owned())
}

#[get("/")]
async fn index(identity: Option<Identity>, session: Session) -> Result<impl Responder> {
    // let user_id: Option<String> = session.get::<String>("user_id").unwrap();
    let counter: i32 = session
        .get::<i32>("counter")
        .unwrap_or(Some(0))
        .unwrap_or(0);

    let id = match identity.map(|id| id.id()) {
        None => "anonymous".to_owned(),
        Some(Ok(id)) => id,
        Some(Err(err)) => return Err(error::ErrorInternalServerError(err)),
    };

    Ok(HttpResponse::Ok().body(format!("Hello {id}, session: {counter}")))
}

#[get("/do_something")]
async fn do_something(session: Session) -> Result<HttpResponse> {
    let user_id: Option<String> = session.get::<String>("user_id").unwrap();
    let counter: i32 = session
        .get::<i32>("counter")
        .unwrap_or(Some(0))
        .map_or(1, |inner| inner + 1);
    session.insert("counter", counter)?;

    Ok(HttpResponse::Ok().json(IndexResponse { user_id, counter }))
}

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    let data: Result<PrismaClient, NewClientError> = PrismaClient::_builder().build().await;

    let data = data.unwrap();

    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));
    env::set_var("RUST_LOG", "actix_web=debug");

    let listener = TcpListener::bind("127.0.0.1:8004").expect("Failed to bind address");

    run(listener, data).await?.await?;

    Ok(())
}
