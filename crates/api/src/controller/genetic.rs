/*
 * Copyright (c) Johannes Grimm 2024.
 */
use actix_web::{delete, get, post, put, web, Error, HttpResponse};
use serde::{Deserialize, Serialize};
use service::sea_orm::DatabaseConnection;
use service::GeneticService;

#[derive(Deserialize, Serialize)]
struct GeneticRequest {
    name: String,
}

pub fn init(cfg: &mut web::ServiceConfig) {
    cfg.service(
        web::scope("/genetic")
            .service(list_genetics)
            .service(get_genetic)
            .service(edit_genetic)
            .service(create_genetic)
            .service(delete_genetic),
    );
}

/// Creates a new genetic entity.
///
/// This function takes a database connection and a genetic model as parameters. It calls the `create_genetic` method of the `GeneticService` to create a new genetic entity in the database. If the creation is successful, it returns the new genetic entity wrapped in an `Ok(HttpResponse::Ok())`.
///
/// # Arguments
///
/// * `conn` - A `web::Data<DatabaseConnection>` instance representing the database connection.
/// * `genetic` - A `web::Json<::entity::genetic::Model>` instance representing the new genetic entity to create.
///
/// # Returns
///
/// A `Result<HttpResponse, Error>`. If the creation is successful, this will be `Ok(HttpResponse::Ok().json(new_genetic))`.
///
/// # Example
///
/// ```rust,no_run
/// use actix_web::{web, HttpResponse, Error};
/// use service::DatabaseConnection;
/// use entity::genetic::Model as GeneticModel;
///
/// #[put("/")]
/// async fn create_genetic(
///     conn: web::Data<DatabaseConnection>,
///     genetic: web::Json<GeneticModel>,
/// ) -> Result<HttpResponse, Error> {
///     let new_genetic = GeneticService::create_genetic(&conn, genetic.into_inner()).await?;
///     Ok(HttpResponse::Ok().json(new_genetic))
/// }
/// ```
#[put("/")]
async fn create_genetic(
    conn: web::Data<DatabaseConnection>,
    genetic: web::Json<::entity::genetic::Model>,
) -> Result<HttpResponse, Error> {
    let new_genetic = GeneticService::create_genetic(&conn, genetic.into_inner()).await?;
    Ok(HttpResponse::Ok().json(new_genetic))
}

/// Retrieves a genetic entity by its ID.
///
/// # Arguments
///
/// * `conn` - A `web::Data<DatabaseConnection>` instance representing the database connection.
/// * `path` - A `web::Path<i32>` instance representing the ID of the genetic entity to retrieve.
///
/// # Returns
///
/// A `Result<HttpResponse, Error>`. If a genetic entity with the given ID is found, this will be `Ok(HttpResponse::Ok().json(genetic))`. If no such entity is found, this will be `Ok(HttpResponse::NotFound().finish())`.
///
/// # Example
///
/// ```rust,no_run
/// use actix_web::{web, App, HttpResponse, Error};
/// use service::DatabaseConnection;
///
/// #[actix_web::get("/{user_id}")]
/// async fn get_genetic(
///     conn: web::Data<DatabaseConnection>,
///     path: web::Path<i32>,
/// ) -> Result<HttpResponse, Error> {
///     match GeneticService::find_genetic_by_id(&conn, *path).await {
///         Ok(genetic) => Ok(HttpResponse::Ok().json(genetic)),
///         Err(_) => Ok(HttpResponse::NotFound().finish()),
///     }
/// }
/// ```
#[get("/{user_id}")]
async fn get_genetic(
    conn: web::Data<DatabaseConnection>,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    match GeneticService::find_genetic_by_id(&conn, *path).await {
        Ok(genetic) => Ok(HttpResponse::Ok().json(genetic)),
        Err(_) => Ok(HttpResponse::NotFound().finish()),
    }
}

/// Lists all genetic entities.
///
/// # Arguments
///
/// * `conn` - A `web::Data<DatabaseConnection>` instance representing the database connection.
///
/// # Returns
///
/// A `Result<HttpResponse, Error>`. This will be `Ok(HttpResponse::Ok().json(genetics.0))`.
///
/// # Example
///
/// ```rust,no_run
/// #[actix_web::get("/")]
/// pub async fn list_genetics(conn: web::Data<DatabaseConnection>) -> Result<HttpResponse, Error> {
///     let genetics = GeneticService::find_genetics_in_page(&conn, 1, 10).await?;
///     Ok(HttpResponse::Ok().json(genetics.0))
/// }
/// ```
#[get("/")]
pub async fn list_genetics(conn: web::Data<DatabaseConnection>) -> Result<HttpResponse, Error> {
    let genetics = GeneticService::find_genetics_in_page(&conn, 1, 10).await?;
    Ok(HttpResponse::Ok().json(genetics.0))
}

/// Deletes a genetic entity by its ID.
///
/// # Arguments
///
/// * `conn` - A `web::Data<DatabaseConnection>` instance representing the database connection.
/// * `id` - A `web::Path<i32>` instance representing the ID of the genetic entity to delete.
///
/// # Returns
///
/// A `Result<HttpResponse, Error>`. This will be `Ok(HttpResponse::Ok().finish())`.
///
/// # Example
///
/// ```rust,no_run
/// #[actix_web::delete("/{user_id}")]
/// pub async fn delete_genetic(
///     conn: web::Data<DatabaseConnection>,
///     id: web::Path<i32>,
/// ) -> Result<HttpResponse, Error> {
///     let _ = GeneticService::delete_genetic_by_id(&conn, *id).await?;
///     Ok(HttpResponse::Ok().finish())
/// }
/// ```
#[delete("/{user_id}")]
pub async fn delete_genetic(
    conn: web::Data<DatabaseConnection>,
    id: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let _ = GeneticService::delete_genetic_by_id(&conn, *id).await?;
    Ok(HttpResponse::Ok().finish())
}

/// Edits an existing genetic entity.
///
/// This function takes a database connection, an ID, and a genetic model as parameters. It calls the `edit_genetic` method of the `GeneticService` to update the genetic entity in the database with the given ID. If the update is successful, it returns the updated genetic entity wrapped in an `Ok(HttpResponse::Ok())`.
///
/// # Arguments
///
/// * `conn` - A `web::Data<DatabaseConnection>` instance representing the database connection.
/// * `id` - A `web::Path<i32>` instance representing the ID of the genetic entity to update.
/// * `genetic_info` - A `web::Json<::entity::genetic::Model>` instance representing the new information to update the genetic entity with.
///
/// # Returns
///
/// A `Result<HttpResponse, Error>`. If the update is successful, this will be `Ok(HttpResponse::Ok().json(updated_genetic))`.
///
/// # Example
///
/// ```rust,no_run
/// use actix_web::{web, HttpResponse, Error};
/// use service::DatabaseConnection;
/// use entity::genetic::Model as GeneticModel;
///
/// #[post("/{user_id}")]
/// pub async fn edit_genetic(
///     conn: web::Data<DatabaseConnection>,
///     id: web::Path<i32>,
///     genetic_info: web::Json<GeneticModel>,
/// ) -> Result<HttpResponse, Error> {
///     let genetic = genetic_info.into_inner();
///     let updated_genetic = GeneticService::edit_genetic(&conn, *id, genetic).await?;
///     Ok(HttpResponse::Ok().json(updated_genetic))
/// }
/// ```
#[post("/{user_id}")]
pub async fn edit_genetic(
    conn: web::Data<DatabaseConnection>,
    id: web::Path<i32>,
    genetic_info: web::Json<::entity::genetic::Model>,
) -> Result<HttpResponse, Error> {
    let genetic = genetic_info.into_inner();
    let updated_genetic = GeneticService::edit_genetic(&conn, *id, genetic).await?;
    Ok(HttpResponse::Ok().json(updated_genetic))
}
