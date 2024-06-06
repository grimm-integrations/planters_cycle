/*
 * Copyright (c) Johannes Grimm 2024.
 */

use crate::prisma::{plant, genetic, role};

pub mod auth {
    use serde::{Deserialize, Serialize};

    #[doc = "User Login"]
    #[derive(Serialize, Debug, Deserialize)]
    pub struct LoginRequest {
        pub identifier: String,
        pub password: String,
    }

    #[doc = "User Register Model"]
    #[derive(Serialize, Debug, Deserialize)]
    pub struct RegisterRequest {
        #[serde(rename = "displayName")]
        pub display_name: String,
        #[serde(rename = "email")]
        pub email: String,
        #[serde(rename = "password")]
        pub password: String,
        pub roles: Option<Vec<RoleRegisterRequest>>,
    }

    #[doc = "Roles Register Model"]
    #[derive(Serialize, Debug, Deserialize)]
    pub struct RoleRegisterRequest {
        #[serde(rename = "roleId")]
        pub role_id: i32,
        #[serde(rename = "assignedAt")]
        pub assigned_at:
            ::prisma_client_rust::chrono::DateTime<::prisma_client_rust::chrono::FixedOffset>,
        #[serde(rename = "assignedBy")]
        pub assigned_by: String,
    }
}

role::partial_unchecked!(Role{
    name
    is_default
});

genetic::partial_unchecked!(Genetic{
    name
    flower_days
});

plant::partial_unchecked!(Plant{
    name
    genetic_id
});