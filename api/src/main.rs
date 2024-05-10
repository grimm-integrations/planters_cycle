/*
 * Copyright (c) Johannes Grimm 2024.
 */

use std::{env, net::TcpListener};

use actix_web::{Result};
use prisma_client_rust::NewClientError;

use prisma::PrismaClient;

use crate::server::run;

mod model;
#[allow(warnings, unused)]
mod prisma;
mod route;
mod server;
mod service;

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
