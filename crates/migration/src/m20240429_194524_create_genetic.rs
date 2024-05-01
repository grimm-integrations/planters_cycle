/*
 * Copyright (c) Johannes Grimm 2024.
 */

use sea_orm_migration::prelude::*;
use sea_orm_migration::schema::{pk_auto, string};

#[derive(DeriveMigrationName)]
pub struct Migration;

#[async_trait::async_trait]
impl MigrationTrait for Migration {
    async fn up(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .create_table(
                Table::create()
                    .table(Genetic::Table)
                    .if_not_exists()
                    .col(pk_auto(Genetic::Id))
                    .col(string(Genetic::Name))
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Genetic::Table).to_owned())
            .await?;

        Ok(())
    }
}

#[derive(DeriveIden)]
pub enum Genetic {
    Table,
    Id,
    Name,
}
