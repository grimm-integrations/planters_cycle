use ::entity::genetic;
use actix_http::{Request, StatusCode};
use actix_web::{
    dev::{Service, ServiceResponse},
    http, test,
    web::{self, Data},
    App,
};
use serde::{Deserialize, Serialize};
use service::sea_orm::*;

mod common;

#[derive(Debug, Serialize, Deserialize, Clone)]
pub struct GeneticDto {
    pub id: i32,
    pub name: String,
}

pub fn prepare_mock_db() -> (DatabaseConnection, Vec<genetic::Model>, Vec<genetic::Model>) {
    let page1 = vec![genetic::Model {
        id: 1,
        name: "Genetic A".to_owned(),
    }];

    let page2 = vec![
        genetic::Model {
            id: 1,
            name: "Genetic A".to_owned(),
        },
        genetic::Model {
            id: 2,
            name: "Genetic B".to_owned(),
        },
        genetic::Model {
            id: 3,
            name: "Genetic C".to_owned(),
        },
    ];

    let mockdb = MockDatabase::new(DatabaseBackend::Postgres)
        .append_query_results([page1.clone(), page2.clone()])
        .append_exec_results([
            MockExecResult {
                last_insert_id: 1,
                rows_affected: 1,
            },
            MockExecResult {
                last_insert_id: 3,
                rows_affected: 3,
            },
        ])
        .into_connection();

    (mockdb, page1, page2)
}

async fn init_service(
    db: Data<DatabaseConnection>,
) -> impl Service<Request, Response = ServiceResponse, Error = actix_web::Error> {
    test::init_service(
        App::new()
            .app_data(db)
            .service(web::scope("/api").configure(::api::controller::init)),
    )
    .await
}

#[actix_web::test]
async fn get_genetic() {
    let mock_data = prepare_mock_db();
    let db = web::Data::new(mock_data.0);
    let mut app = init_service(db).await;

    for g in mock_data.1 {
        let req = test::TestRequest::get()
            .uri(&format!("/api/genetic/{}", g.id))
            .to_request();
        let resp = test::call_service(&mut app, req).await;
        assert_eq!(resp.status(), http::StatusCode::OK);
        let resp: GeneticDto = test::read_body_json(resp).await;
        assert_eq!(resp.id, g.id);
        assert_eq!(resp.name, g.name);
    }
}

#[actix_web::test]
async fn get_genetic_not_found() {
    let mock_data = prepare_mock_db();
    let db = web::Data::new(mock_data.0);
    let mut app = init_service(db).await;

    let req = test::TestRequest::get()
        .uri("/api/genetic/999")
        .to_request();
    let resp = test::call_service(&mut app, req).await;
    assert_eq!(resp.status(), http::StatusCode::NOT_FOUND);
}