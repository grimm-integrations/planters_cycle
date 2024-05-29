#[cfg(test)]
mod tests {
    use actix_web::{http::StatusCode, test};

    use super::super::{init_app_entry, init_app_state};
    use crate::route::health_check::health_check;

    #[actix_rt::test]
    async fn test_index_ok_and_message() {
        let app_data = init_app_state().await;

        let app =
            test::init_service(init_app_entry().app_data(app_data).service(health_check)).await;

        let req = test::TestRequest::get().uri("/health_check").to_request();
        let resp = test::call_service(&app, req).await;
        assert_eq!(resp.status(), StatusCode::OK);
    }
}
