/*
 * Copyright (c) Johannes Grimm 2024.
 */

 use crate::{
  model::dto::Genetic,
  prisma::{genetic, PrismaClient},
};
use actix_web::{delete, get, post, web, HttpResponse, Responder};

#[allow(dead_code)]
pub fn genetic_controller_init(cfg: &mut actix_web::web::ServiceConfig) {
  cfg.service(
      web::scope("/genetics")
          .service(get_genetics)
          .service(get_genetic_by_id)
          .service(create_genetic)
          .service(delete_genetic)
          .service(edit_genetic),
  );
}

#[get("")]
async fn get_genetics(data: web::Data<PrismaClient>) -> impl Responder {
  let genetics = data.genetic().find_many(vec![]).exec().await.unwrap();
  HttpResponse::Ok().json(genetics)
}

#[get("/{id}")]
async fn get_genetic_by_id(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
  let genetic = data
      .genetic()
      .find_unique(genetic::id::equals(id.into_inner()))
      .exec()
      .await
      .unwrap();
  HttpResponse::Ok().json(genetic.unwrap())
}

#[post("")]
async fn create_genetic(data: web::Data<PrismaClient>, body: web::Json<Genetic>) -> impl Responder {
  let body = body.into_inner();
  let genetic = data
      .genetic()
      .create(
          body.name.unwrap(),
          body.flower_days.unwrap(),
          vec![],
      )
      .exec()
      .await
      .unwrap();
  HttpResponse::Ok().json(genetic)
}

#[post("/{id}")]
async fn edit_genetic(
  data: web::Data<PrismaClient>,
  id: web::Path<String>,
  body: web::Json<Genetic>,
) -> impl Responder {
  let genetic = data
      .genetic()
      .update_unchecked(
          genetic::id::equals(id.into_inner()),
          body.into_inner().to_params(),
      )
      .exec()
      .await
      .unwrap();
  HttpResponse::Ok().json(genetic)
}

#[delete("/{id}")]
async fn delete_genetic(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
  match data
      .genetic()
      .delete(genetic::id::equals(id.into_inner()))
      .exec()
      .await
  {
      Err(_) => HttpResponse::NotFound().body("Genetic not found"),
      Ok(genetic) => HttpResponse::Ok().json(genetic),
  }
}
