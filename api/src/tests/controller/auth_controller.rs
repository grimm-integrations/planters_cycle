#[cfg(test)]
mod tests {
    use actix_web::test;

    use super::super::{init_app_entry, init_app_state};
    use crate::{model::dto::auth::RegisterRequest, server::get_config};

    const PATH: &str = "/api/auth";

    #[actix_rt::test]
    async fn test_register_user() {
        let app_data = init_app_state().await;
        let app =
            test::init_service(init_app_entry().app_data(app_data).configure(get_config)).await;

        let register_request = RegisterRequest {
            display_name: "dev".to_owned(),
            email: "dev@dev.com".to_owned(),
            password: "dev".to_owned(),
        };

        let url = format!("{}/register", PATH);
        let req = test::TestRequest::post()
            .uri(&url)
            .set_json(register_request)
            .to_request();
        let resp: crate::prisma::user::Data = test::call_and_read_body_json(&app, req).await;
        assert_eq!(resp.display_name, "dev");
        assert_eq!(resp.email, "dev@dev.com");
    }
}