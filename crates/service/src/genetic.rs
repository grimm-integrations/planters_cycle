/*
 * Copyright (c) Johannes Grimm 2024.
 */

use sea_orm::*;

use ::entity::{genetic, genetic::Entity as Genetic};

pub struct GeneticService;

impl GeneticService {
    pub async fn find_genetic_by_id(db: &DbConn, id: i32) -> Result<Option<genetic::Model>, DbErr> {
        Genetic::find_by_id(id).one(db).await
    }

    pub async fn create_genetic(
        db: &DbConn,
        form_data: genetic::Model,
    ) -> Result<genetic::ActiveModel, DbErr> {
        genetic::ActiveModel {
            name: Set(form_data.name.to_owned()),
            ..Default::default()
        }
        .save(db)
        .await
    }

    pub async fn find_genetics_in_page(
        db: &DatabaseConnection,
        page: u64,
        genetics_per_page: u64,
    ) -> Result<(Vec<genetic::Model>, u64), DbErr> {
        // Setup paginator
        let paginator = Genetic::find()
            .order_by_asc(genetic::Column::Id)
            .paginate(db, genetics_per_page);
        let num_pages = paginator.num_pages().await?;

        // Fetch paginated posts
        paginator.fetch_page(page - 1).await.map(|p| (p, num_pages))
    }
}
