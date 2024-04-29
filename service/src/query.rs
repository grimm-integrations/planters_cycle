/*
 * Copyright (c) Johannes Grimm 2024.
 */

use sea_orm::*;

// use ::entity::{post, post::Entity as Post};

pub struct Query;

impl Query {
    /*    pub async fn find_post_by_id(db: &DbConn, id: i32) -> Result<Option<post::Model>, DbErr> {
        Post::find_by_id(id).one(db).await
    }

    pub async fn find_pasts_in_page(
        db: &DbConn,
        page: u64,
        posts_per_page: u64,
    ) -> Result<(Vec<post::Model>, u64), DbErr> {
        let paginator = Post::find()
            .order_by_asc(post::Column::Id)
            .paginate(db, posts_per_page);
        let num_pages = paginator.num_pages().await?;

        // fetch paginated posts
        paginator.fetch_page(page - 1).await.map(|p| (p, num_pages))
    }*/
}
