/*
 * Copyright (c) Johannes Grimm 2024.
 */

// use ::entity::post;
use sea_orm::*;

#[cfg(feature = "mock")]
pub fn prepare_mock_db() -> DatabaseConnection {
    MockDatabase::new(DatabaseBackend::Postgres)
        /*.append_query_results([[post::Model {
            id: 1,
            title: "Title A".to_owned(),
            text: "Text A".to_owned(),
        }]])*/
        .append_exec_results([MockExecResult {
            last_insert_id: 6,
            rows_affected: 1,
        }])
        .into_connection()
}
