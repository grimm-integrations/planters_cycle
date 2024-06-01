/*
 * Copyright (c) Johannes Grimm 2024.
 */

#[cfg(test)]
mod tests {

    use actix_web::{test, web};

    use super::super::{init_app_entry, init_app_state};
    use crate::{
        model::dto::auth::{LoginRequest, RegisterRequest},
        prisma::{user, PrismaClient},
        server::get_config,
    };

    const PATH: &str = "/api/auth";

    #[actix_rt::test]
    async fn test_register_user() {
        let (client, mock) = PrismaClient::_mock();

        mock.expect(
            client
                .user()
                .find_first(vec![user::display_name::equals("dev".to_owned())]),
            None,
        )
        .await;

        let app_data = web::Data::new(client);
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

    #[actix_rt::test]
    async fn test_login_user() {
        todo!("Fix the login test");

        let app_data = init_app_state().await;
        let app =
            test::init_service(init_app_entry().app_data(app_data).configure(get_config)).await;

        let login_request = LoginRequest {
            identifier: "test".to_owned(),
            password: "test".to_owned(),
        };

        let url = format!("{}/login", PATH);
        let req = test::TestRequest::post()
            .uri(&url)
            .set_json(login_request)
            .to_request();
        let resp = test::call_service(&app, req).await;
        let mut cookies = resp.response().cookies();
        let cookie = cookies.next().unwrap();
        assert_eq!(cookie.name(), "plnt_test");
        assert!(!cookie.value().is_empty());

        let data: crate::prisma::user::Data = test::try_read_body_json(resp).await.unwrap();
        assert_eq!(data.display_name, "test");
        assert_eq!(data.email, "dev@dev.com");
    }
}
