/*
 * Copyright (c) Johannes Grimm 2024.
 */

use sea_orm::*;

use ::entity::{genetic, genetic::Entity as Genetic};
use ::entity::{post, post::Entity as Post};

pub struct Query;

impl Query {
    pub async fn find_post_by_id(db: &DbConn, id: i32) -> Result<Option<post::Model>, DbErr> {
        Post::find_by_id(id).one(db).await
    }

    /// If ok, returns (post models, num pages).
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
