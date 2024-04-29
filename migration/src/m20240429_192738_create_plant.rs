/*
 * Copyright (c) Johannes Grimm 2024.
 */

use sea_orm_migration::prelude::*;
use sea_orm_migration::schema::*;

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

        manager
            .create_table(
                Table::create()
                    .table(Plant::Table)
                    .if_not_exists()
                    .col(pk_auto(Plant::Id))
                    .col(string(Plant::Name))
                    .foreign_key(
                        ForeignKey::create()
                            .name("fk_genetic_id")
                            .from(Plant::Genetic, Plant::GeneticId)
                            .to(Genetic::Table, Genetic::Id)
                            .on_delete(ForeignKeyAction::SetNull)
                            .on_update(ForeignKeyAction::Cascade),
                    )
                    .to_owned(),
            )
            .await?;

        Ok(())
    }

    async fn down(&self, manager: &SchemaManager) -> Result<(), DbErr> {
        manager
            .drop_table(Table::drop().table(Plant::Table).to_owned())
            .await?;
        manager
            .drop_table(Table::drop().table(Genetic::Table).to_owned())
            .await?;
        Ok(())
    }
}

#[derive(DeriveIden)]
enum Plant {
    Table,
    Id,
    Name,
    GeneticId,
    Genetic,
}

#[derive(DeriveIden)]
enum Genetic {
    Table,
    Id,
    Name,
}
