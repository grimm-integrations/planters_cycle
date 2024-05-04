/*
 * Copyright (c) Johannes Grimm 2024.
 */

#[allow(unused_imports)]
pub use genetic::*;
#[allow(unused_imports)]
pub use plant::*;
pub mod genetic;
pub mod plant;

pub fn init(cfg: &mut actix_web::web::ServiceConfig) {
    cfg.configure(plant::init);
    cfg.configure(genetic::init);
}
