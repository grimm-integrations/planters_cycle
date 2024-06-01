/*
 * Copyright (c) Johannes Grimm 2024.
 */

#[cfg(test)]
mod tests {
    use actix_web::{http::StatusCode, test, web};

    use super::super::{init_app_entry, init_app_state};
    use crate::server::{index, not_found};

    #[actix_rt::test]
    async fn test_index_ok_and_message() {
        let app_data = init_app_state().await;

        let app = test::init_service(
            init_app_entry()
                .app_data(app_data)
                .service(index)
                .default_service(web::route().to(not_found)),
        )
        .await;

        let req = test::TestRequest::get().uri("/").to_request();
        let resp = test::call_and_read_body(&app, req).await;
        assert_eq!(resp, "Hello anonymous, session: 0");
    }

    #[actix_rt::test]
    async fn test_index_fail() {
        let app_data = init_app_state().await;

        let app = test::init_service(
            init_app_entry()
                .app_data(app_data)
                .service(index)
                .default_service(web::route().to(not_found)),
        )
        .await;

        let req = test::TestRequest::post().uri("/").to_request();
        let resp = test::call_service(&app, req).await;
        assert!(resp.status().is_client_error());
    }

    #[actix_rt::test]
    async fn test_not_found() {
        let app_data = init_app_state().await;

        let app = test::init_service(
            init_app_entry()
                .app_data(app_data)
                .service(index)
                .default_service(web::route().to(not_found)),
        )
        .await;

        let req = test::TestRequest::post().uri("/not-a_valid").to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::NOT_FOUND);
    }
}
