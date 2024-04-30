/*
 * Copyright (c) Johannes Grimm 2024.
 */

//! `SeaORM` Entity. Generated by sea-orm-codegen 0.12.15

use sea_orm::entity::prelude::*;
use serde::{Deserialize, Serialize};

#[derive(Clone, Debug, PartialEq, DeriveEntityModel, Eq, Serialize, Deserialize)]
#[sea_orm(table_name = "genetic")]
pub struct Model {
    #[sea_orm(primary_key)]
    pub id: i32,
    pub name: String,
}

#[derive(Copy, Clone, Debug, EnumIter, DeriveRelation)]
pub enum Relation {
    #[sea_orm(has_many = "super::plant::Entity")]
    Plant,
}

impl Related<super::plant::Entity> for Entity {
    fn to() -> RelationDef {
        Relation::Plant.def()
    }
}

impl ActiveModelBehavior for ActiveModel {}
