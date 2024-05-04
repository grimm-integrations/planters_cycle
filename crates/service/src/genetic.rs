/*
 * Copyright (c) Johannes Grimm 2024.
 */

use sea_orm::*;

use ::entity::{genetic, genetic::Entity as Genetic};

pub struct GeneticService;

impl GeneticService {
    pub async fn find_genetic_by_id(db: &DbConn, id: i32) -> Result<genetic::Model, MyError> {
        match Genetic::find_by_id(id).one(db).await {
            Ok(result) => match result {
                Some(result) => Ok(result),
                None => Err(DbErr::RecordNotFound(id.to_string())),
            },
            Err(e) => Err(e),
        }
    }

    pub async fn create_genetic(db: &DbConn, name: String) -> Result<genetic::Model, DbErr> {
        let res = genetic::ActiveModel {
            name: Set(name.to_owned()),
            ..Default::default()
        }
        .save(db)
        .await;
        match res {
            Ok(gen) => match gen.try_into_model() {
                Ok(gen) => Ok(gen),
                Err(e) => Err(e),
            },
            Err(e) => Err(e),
        }
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

    pub async fn delete_genetic_by_id(db: &DbConn, id: i32) -> Result<DeleteResult, DbErr> {
        match Genetic::delete_by_id(id).exec(db).await {
            Ok(result) => {
                if result.rows_affected == 0 {
                    return Err(DbErr::RecordNotFound(id.to_string()));
                }
                Ok(result)
            }
            Err(e) => Err(e),
        }
    }

    pub async fn edit_genetic(
        db: &DbConn,
        id: i32,
        model: genetic::Model,
    ) -> Result<genetic::Model, DbErr> {
        let gen = match Genetic::find_by_id(id).one(db).await {
            Ok(gen) => gen,
            Err(e) => return Err(e),
        };

        let mut gen: genetic::ActiveModel = match gen {
            Some(gen) => gen.into(),
            None => return Err(DbErr::RecordNotFound(id.to_string())),
        };
        gen.name = Set(model.name.to_owned());
        gen.update(db).await
    }
}
