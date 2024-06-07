/*
 * Copyright (c) Johannes Grimm 2024.
 */

use std::{env, net::TcpListener};

use actix_web::Result;
use prisma_client_rust::NewClientError;

use prisma::PrismaClient;

use crate::server::run;

mod middleware;
mod model;
#[allow(warnings, unused)]
mod prisma;
mod route;
mod server;
mod service;
mod tests;

#[tokio::main]
async fn main() -> Result<(), std::io::Error> {
    // Prepare database connection
    let data: Result<PrismaClient, NewClientError> = PrismaClient::_builder().build().await;
    let data = data.unwrap();

    // enable logging
    env_logger::init_from_env(env_logger::Env::default().default_filter_or("debug"));
    env::set_var("RUST_BACKTRACE", "1");
    env::set_var("RUST_LOG", "actix_web=debug");

    let listener = TcpListener::bind("127.0.0.1:8004").expect("Failed to bind address");

    run(listener, data).await?.await?;

    Ok(())
}
