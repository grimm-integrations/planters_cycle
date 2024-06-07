/*
* Copyright (c) Johannes Grimm 2024.
*/

use actix_web::web;

use crate::{
    model::{dto::Genetic, error::ErrorCode},
    prisma::{genetic, PrismaClient},
};

pub async fn get_genetics(data: &web::Data<PrismaClient>) -> Result<Vec<genetic::Data>, ErrorCode> {
    match data.genetic().find_many(vec![]).exec().await {
        Ok(genetics) => Ok(genetics),
        Err(e) => Err(e.into()),
    }
}

pub async fn get_genetic_by_id(
    data: &web::Data<PrismaClient>,
    id: String,
) -> Result<genetic::Data, ErrorCode> {
    match data
        .genetic()
        .find_unique(genetic::id::equals(id))
        .exec()
        .await
    {
        Ok(genetic) => Ok(genetic.unwrap()),
        Err(e) => Err(e.into()),
    }
}

pub async fn create_genetic(
    data: &web::Data<PrismaClient>,
    genetic: Genetic,
) -> Result<genetic::Data, ErrorCode> {
    if genetic.name.is_none() {
        return Err(ErrorCode::BADREQUEST("Name is required".to_string()));
    }
    if genetic.flower_days.is_none() {
        return Err(ErrorCode::BADREQUEST("Flower days is required".to_string()));
    }

    match data
        .genetic()
        .create(genetic.name.unwrap(), genetic.flower_days.unwrap(), vec![])
        .exec()
        .await
    {
        Ok(genetic) => Ok(genetic),
        Err(e) => return Err(e.into()),
    }
}

pub async fn edit_genetic(
    data: &web::Data<PrismaClient>,
    id: String,
    genetic: Genetic,
) -> Result<genetic::Data, ErrorCode> {
    match data
        .genetic()
        .update_unchecked(genetic::id::equals(id), genetic.to_params())
        .exec()
        .await
    {
        Ok(genetic) => Ok(genetic),
        Err(e) => Err(e.into()),
    }
}

pub async fn delete_genetic(data: &web::Data<PrismaClient>, id: String) -> Result<(), ErrorCode> {
    match data.genetic().delete(genetic::id::equals(id)).exec().await {
        Ok(_) => Ok(()),
        Err(e) => Err(e.into()),
    }
}

#[allow(dead_code)]
pub async fn check_genetic_name(
    data: &web::Data<PrismaClient>,
    name: String,
) -> Result<bool, ErrorCode> {
    match data
        .genetic()
        .count(vec![genetic::name::equals(name)])
        .exec()
        .await
    {
        Ok(found) => Ok(found > 0),
        Err(e) => Err(e.into()),
    }
}
