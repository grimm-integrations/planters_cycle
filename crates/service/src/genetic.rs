/*
 * Copyright (c) Johannes Grimm 2024.
 */

use sea_orm::*;

use crate::MyError;
use ::entity::{genetic, genetic::Entity as Genetic};

pub struct GeneticService;

impl GeneticService {
    pub async fn find_genetic_by_id(db: &DbConn, id: i32) -> Result<genetic::Model, MyError> {
        Genetic::find_by_id(id)
            .one(db)
            .await
            .map_err(MyError::DbErr)?
            .ok_or("Genetic not found".into())
            .map_err(MyError::NotFound)
    }

    pub async fn create_genetic(
        db: &DbConn,
        genetic_info: genetic::Model,
    ) -> Result<genetic::Model, MyError> {
        let genetic = genetic::ActiveModel {
            name: Set(genetic_info.name.to_owned()),
            ..Default::default()
        };

        let genetic = genetic.insert(db).await?;

        Ok(genetic)
    }

    pub async fn find_genetics_in_page(
        db: &DatabaseConnection,
        page: u64,
        genetics_per_page: u64,
    ) -> Result<(Vec<genetic::Model>, u64), MyError> {
        // Setup paginator
        let paginator = Genetic::find()
            .order_by_asc(genetic::Column::Id)
            .paginate(db, genetics_per_page);
        let num_pages = paginator.num_pages().await?;

        // Fetch paginated posts
        paginator
            .fetch_page(page - 1)
            .await
            .map(|p| (p, num_pages))
            .map_err(MyError::DbErr)
    }

    pub async fn delete_genetic_by_id(db: &DbConn, id: i32) -> Result<bool, MyError> {
        let genetic = Genetic::delete_by_id(id).exec(db).await?;
        Ok(genetic.rows_affected > 0)
    }

    pub async fn edit_genetic(
        db: &DbConn,
        id: i32,
        genetic_info: genetic::Model,
    ) -> Result<genetic::Model, MyError> {
        let genetic = genetic::ActiveModel {
            id: Set(id),
            name: Set(genetic_info.name.to_owned()),
            ..Default::default()
        };
        let genetic = genetic.update(db).await?;
        Ok(genetic)
    }
}
