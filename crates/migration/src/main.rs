/*
 * Copyright (c) Johannes Grimm 2024.
 */

use sea_orm_migration::prelude::*;

#[async_std::main]
async fn main() {
    cli::run_cli(migration::Migrator).await;
}
