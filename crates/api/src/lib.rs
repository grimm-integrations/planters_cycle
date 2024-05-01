/*
 * Copyright (c) Johannes Grimm 2024.
 */

use std::env;
use std::fmt::Debug;

use actix_web::{get, middleware, web, App, HttpRequest, HttpResponse, HttpServer, Result};
use listenfd::ListenFd;
use service::sea_orm::{ConnectionTrait, Database, DatabaseConnection, DbBackend, Statement};

use migration::{Migrator, MigratorTrait, SchemaManager};

mod controller;

#[derive(Debug, Clone)]
struct AppState {
    conn: DatabaseConnection,
}

pub fn add(left: usize, right: usize) -> usize {
    left + right
}

#[get("/")]
async fn index(req: HttpRequest) -> &'static str {
    println!("REQ: {:?}", req);
    "Hello world!\r\n"
}

#[get("/show/{id}")]
async fn user_detail(path: web::Path<(u32,)>) -> HttpResponse {
    HttpResponse::Ok().body(format!("User detail: {}", path.into_inner().0))
}

async fn not_found(_data: web::Data<AppState>, _request: HttpRequest) -> Result<HttpResponse> {
    Ok(HttpResponse::NotFound().body("Not Found"))
}

#[tokio::main]
async fn start() -> std::io::Result<()> {
    env::set_var("RUST_LOG", "debug");
    tracing_subscriber::fmt::init();

    println!("Hello World from the api crate!");
    dotenvy::dotenv().ok();

    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let db_name = env::var("DATABASE_NAME").expect("DATABASE_NAME is not set in .env file");

    let host = env::var("HOST").expect("HOST is not set in .env file");
    let port = env::var("PORT").expect("PORT is not set in .env file");

    let server_url = format!("{host}:{port}");

    let db = Database::connect(&db_url)
        .await
        .expect("Database connection failed");

    let db = match db.get_database_backend() {
        DbBackend::MySql => {
            db.execute(Statement::from_string(
                db.get_database_backend(),
                format!("CREATE DATABASE IF NOT EXISTS `{}`", db_name),
            ))
            .await
            .expect("Could not create database");
            let db_url = format!("{}/{}", db_url, db_name);
            Database::connect(&db_url)
                .await
                .expect("Could not open database connection.")
        }
        DbBackend::Postgres => {
            let _res = db
                .execute(Statement::from_string(
                    db.get_database_backend(),
                    format!("CREATE DATABASE {db_name}"),
                ))
                .await;
            let db_url = format!("{}/{}", db_url, db_name);
            Database::connect(&db_url)
                .await
                .expect("Could not open database connection.")
        }
        DbBackend::Sqlite => {
            let db_url = format!("{}/{}", db_url, db_name);
            Database::connect(&db_url)
                .await
                .expect("Could not open database connection.")
        }
    };

    let schema_manager = SchemaManager::new(&db);
    Migrator::up(&db, None)
        .await
        .expect("Could not run database migrations.");

    assert!(schema_manager.has_table("post").await.is_ok());

    println!("Hello World from the api crate!");

    let state = AppState { conn: db };

    let mut listenfd = ListenFd::from_env();
    let mut server = HttpServer::new(move || {
        App::new()
            .app_data(web::Data::new(state.clone()))
            .wrap(middleware::Logger::default())
            .default_service(web::route().to(not_found))
            .service(index)
            .service(
                web::scope("/api")
                    .configure(controller::init)
                    .service(user_detail),
            )
    });

    println!("Starting server at {server_url}");

    server = match listenfd.take_tcp_listener(0)? {
        Some(listener) => server.listen(listener)?,
        None => server.bind(&server_url)?,
    };

    server.run().await?;

    Ok(())
}

pub fn main() {
    let result = start();
    if let Some(err) = result.err() {
        println!("Error: {err}");
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn it_works() {
        let result = add(2, 2);
        assert_eq!(result, 4);
    }
}
