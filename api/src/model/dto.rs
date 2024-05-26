/*
 * Copyright (c) Johannes Grimm 2024.
 */

pub mod auth {
    use crate::prisma::user;
    use serde::Deserialize;

    #[doc = "User Login"]
    #[derive(Debug, Deserialize)]
    pub struct LoginRequest {
        pub identifier: String,
        pub password: String,
    }

    user::partial_unchecked!(RegisterRequest {
        display_name
        email
        password
    });
}

crate::prisma::role::partial_unchecked!(Role { name });
