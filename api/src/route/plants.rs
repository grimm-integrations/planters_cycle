/*
 * Copyright (c) Johannes Grimm 2024.
 */

 use crate::{
  model::dto::Plant,
  prisma::{plant, PrismaClient},
};
use actix_web::{delete, get, post, web, HttpResponse, Responder};

#[allow(dead_code)]
pub fn plant_controller_init(cfg: &mut actix_web::web::ServiceConfig) {
  cfg.service(
      web::scope("/plants")
          .service(get_plants)
          .service(get_plant_by_id)
          .service(create_plant)
          .service(delete_plant)
          .service(edit_plant),
  );
}

#[get("")]
async fn get_plants(data: web::Data<PrismaClient>) -> impl Responder {
  let plants = data.plant().find_many(vec![]).exec().await.unwrap();
  HttpResponse::Ok().json(plants)
}

#[get("/{id}")]
async fn get_plant_by_id(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
  let plant = data
      .plant()
      .find_unique(plant::id::equals(id.into_inner()))
      .exec()
      .await
      .unwrap();
  HttpResponse::Ok().json(plant.unwrap())
}

#[post("")]
async fn create_plant(data: web::Data<PrismaClient>, body: web::Json<Plant>) -> impl Responder {
  let body = body.into_inner();
  let plant = data
      .plant()
      .create_unchecked(
          body.name.unwrap(),
          body.genetic_id.unwrap(),
          vec![],
      )
      .exec()
      .await
      .unwrap();
  HttpResponse::Ok().json(plant)
}

#[post("/{id}")]
async fn edit_plant(
  data: web::Data<PrismaClient>,
  id: web::Path<String>,
  body: web::Json<Plant>,
) -> impl Responder {
  let plant = data
      .plant()
      .update_unchecked(
          plant::id::equals(id.into_inner()),
          body.into_inner().to_params(),
      )
      .exec()
      .await
      .unwrap();
  HttpResponse::Ok().json(plant)
}

#[delete("/{id}")]
async fn delete_plant(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
  match data
      .plant()
      .delete(plant::id::equals(id.into_inner()))
      .exec()
      .await
  {
      Err(_) => HttpResponse::NotFound().body("Plant not found"),
      Ok(plant) => HttpResponse::Ok().json(plant),
  }
}
