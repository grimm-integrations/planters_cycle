/*
 * Copyright (c) Johannes Grimm 2024.
 */

use actix_web::web;

use crate::{
    model::{dto::Plant, error::ErrorCode},
    prisma::{plant, plant_history, PrismaClient},
};

pub async fn generate_plant_name(
    data: &web::Data<PrismaClient>,
    id: String,
) -> Result<String, ErrorCode> {
    let c = match data
        .plant()
        .count(vec![plant::genetic_id::equals(id)])
        .exec()
        .await
    {
        Ok(g) => g,
        Err(e) => return Err(e.into()),
    };

    Ok(format!("{:X}", c + 1))
}

pub async fn get_plants(data: &web::Data<PrismaClient>) -> Result<Vec<plant::Data>, ErrorCode> {
    match data
        .plant()
        .find_many(vec![])
        .with(plant::genetic::fetch())
        .exec()
        .await
    {
        Ok(plants) => Ok(plants),
        Err(e) => Err(e.into()),
    }
}

pub async fn get_plant_by_id(
    data: &web::Data<PrismaClient>,
    id: String,
) -> Result<plant::Data, ErrorCode> {
    match data
        .plant()
        .find_unique(plant::id::equals(id))
        .with(plant::genetic::fetch())
        .with(plant::plant_history::fetch(vec![]).with(plant_history::user::fetch()))
        .exec()
        .await
    {
        Ok(plant) => match plant {
            Some(plant) => Ok(plant),
            None => Err(ErrorCode::DATABASE002),
        },
        Err(e) => Err(e.into()),
    }
}

pub async fn create_plant(
    data: &web::Data<PrismaClient>,
    plant: Plant,
) -> Result<plant::Data, ErrorCode> {
    if plant.name.is_none() {
        return Err(ErrorCode::BADREQUEST("Name is required".to_string()));
    }
    if plant.genetic_id.is_none() {
        return Err(ErrorCode::BADREQUEST("Genetic ID is required".to_string()));
    }

    match data
        .plant()
        .create_unchecked(plant.name.unwrap(), plant.genetic_id.unwrap(), vec![])
        .exec()
        .await
    {
        Ok(plant) => Ok(plant),
        Err(e) => return Err(e.into()),
    }
}

pub async fn edit_plant(
    data: &web::Data<PrismaClient>,
    id: String,
    plant: Plant,
) -> Result<plant::Data, ErrorCode> {
    match data
        .plant()
        .update_unchecked(plant::id::equals(id), plant.to_params())
        .exec()
        .await
    {
        Ok(plant) => Ok(plant),
        Err(e) => Err(e.into()),
    }
}

pub async fn delete_plant(data: &web::Data<PrismaClient>, id: String) -> Result<(), ErrorCode> {
    match data.plant().delete(plant::id::equals(id)).exec().await {
        Ok(_) => Ok(()),
        Err(e) => Err(e.into()),
    }
}
