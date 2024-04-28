use actix_web::{get, web, App, HttpRequest, HttpResponse, HttpServer};
use dotenvy::dotenv;
use sea_orm::{ConnectionTrait, Database, DbBackend, DbErr, Statement};
use std::env;

#[get("/")]
async fn index(req: HttpRequest) -> &'static str {
    println!("REQ: {:?}", req);
    "Hello world!\r\n"
}

#[get("/show/{id}")]
async fn user_detail(path: web::Path<(u32,)>) -> HttpResponse {
    HttpResponse::Ok().body(format!("User detail: {}", path.into_inner().0))
}

#[tokio::main]
async fn start() -> std::io::Result<()> {
    std::env::set_var("RUST_LOG", "debug");
    tracing_subscriber::fmt::init();

    dotenv().ok();
    let db_url = env::var("DATABASE_URL").expect("DATABASE_URL is not set in .env file");
    let db_name = env::var("DATABASE_NAME").expect("DATABASE_NAME is not set in .env file");
    let host = env::var("HOST").expect("HOST is not set in .env file");
    let port = env::var("PORT").expect("PORT is not set in .env file");
    let server_url = format!("{host}:{port}");

    // establish connection to database
    let connection = Database::connect(&db_url)
        .await
        .expect("Could not connect to database server");
    //const res = await client.query(`SELECT datname FROM pg_catalog.pg_database WHERE datname = '${DB_NAME}'`);
    let res = connection.execute(Statement::from_string(
        connection.get_database_backend(),
        format!("SELECT datname FROM pg_catalog.pg_database WHERE datname = {db_name}"),
    ))
        .await;
    match res.err() {
        None => {}
        Some(_) => {
            // create database
            connection.execute(Statement::from_string(
                connection.get_database_backend(),
                format!("CREATE DATABASE {db_name}"),
            ))
                .await
                .expect("Could not create database");
        }
    }

    let db_url = format!("{}/{}", db_url, db_name);
    let connection = Database::connect(&db_url)
        .await
        .expect("Could not connect to database");

    Migrator::up(&connection, None)
        .await
        .expect("Could not apply migrations");

    println!("Hello, world!");

    HttpServer::new(|| {
        App::new()
            .service(index)
            .service(web::scope("/api").service(user_detail))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}

pub fn main() {
    let result = start();

    if let Some(err) = result.err() {
        println!("Error: {err}");
    }
}
