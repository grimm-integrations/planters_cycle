/*
 * Copyright (c) Johannes Grimm 2024.
 */

pub mod auth {
    use serde::Deserialize;
    use crate::prisma::user;

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
