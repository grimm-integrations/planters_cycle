/*
 * Copyright (c) Johannes Grimm 2024.
 */

pub use plant::*;

pub mod plant;

pub fn init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.configure(plant::init);
}
