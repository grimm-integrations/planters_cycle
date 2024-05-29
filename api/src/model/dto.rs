/*
 * Copyright (c) Johannes Grimm 2024.
 */

pub mod auth {
    use serde::{Deserialize, Serialize};

    #[doc = "User Login"]
    #[derive(Serialize, Debug, Deserialize)]
    pub struct LoginRequest {
        pub identifier: String,
        pub password: String,
    }

    #[doc = "User Register"]
    #[derive(Serialize, Debug, Deserialize)]
    pub struct RegisterRequest {
        #[serde(rename = "displayName")]
        pub display_name: String,
        #[serde(rename = "email")]
        pub email: String,
        #[serde(rename = "password")]
        pub password: String,
    }
}

crate::prisma::role::partial_unchecked!(Role { name });
