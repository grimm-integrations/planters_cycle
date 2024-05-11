/*
 * Copyright (c) Johannes Grimm 2024.
 */


use std::future::Future;
use std::pin::Pin;

use actix_identity::Identity;
use actix_web::dev::Payload;
use actix_web::error::ErrorUnauthorized;
use actix_web::{web, FromRequest, HttpRequest};

use crate::prisma::{user, PrismaClient};

impl FromRequest for user::Data {
    type Error = actix_web::Error;
    type Future = Pin<Box<dyn Future<Output = Result<Self, Self::Error>>>>;

    fn from_request(req: &HttpRequest, payload: &mut Payload) -> Self::Future {
        // Clone early to get a "static" reference for later use in async block 
        let req_clone = HttpRequest::clone(req);
        let i = Identity::from_request(req, payload).into_inner();

        let user_id = i.map(|i| i.id().unwrap());

        Box::pin(async move {
            let data: &web::Data<PrismaClient> = req_clone
                .app_data::<web::Data<PrismaClient>>()
                .unwrap();
            if let Ok(usr_id) = user_id {
                let res = data
                    .user()
                    .find_unique(user::id::equals(usr_id))
                    .exec()
                    .await;
                Ok(res.unwrap().unwrap().clone())
            } else {
                Err(ErrorUnauthorized(""))
            }
        })
    }
}
