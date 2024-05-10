pub mod auth {
    use serde::Deserialize;

    #[doc = "User Login"]
    #[derive(Debug, Deserialize)]
    pub struct LoginRequest {
        pub identifier: String,
        pub password: String,
    }
}
