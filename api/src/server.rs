use crate::prisma::PrismaClient;
use crate::route::health_check::health_check;
use crate::route::users::user_controller_init;
use crate::{do_something, index, login, logout, not_found};
use actix_identity::IdentityMiddleware;
use actix_session::config::PersistentSession;
use actix_session::storage::RedisActorSessionStore;
use actix_session::SessionMiddleware;
use actix_web::cookie::time::Duration;
use actix_web::dev::Server;
use actix_web::web::{scope, ServiceConfig};
use actix_web::{middleware, web, App, HttpServer};
use std::net::TcpListener;

#[doc = "Setup the service served by the application."]
fn get_config(conf: &mut ServiceConfig) {
    conf.service(
        scope("/api")
            .service(health_check)
            .configure(user_controller_init),
    );
}

#[doc = "Create the server instance."]
pub async fn run(tcp_listener: TcpListener, data: PrismaClient) -> Result<Server, std::io::Error> {
    let data = web::Data::new(data);
    let private_key = actix_web::cookie::Key::generate();
    let server = HttpServer::new(move || {
        App::new()
            .wrap(IdentityMiddleware::default())
            .wrap(
                SessionMiddleware::builder(
                    RedisActorSessionStore::new("127.0.0.1:6379"),
                    private_key.clone(),
                )
                .cookie_name("plnt_auth".to_owned())
                // .cookie_secure(secure) // Requires HTTPS
                .session_lifecycle(PersistentSession::default().session_ttl(Duration::hours(24)))
                .build(),
            )
            .wrap(middleware::NormalizePath::trim())
            .wrap(middleware::Logger::default())
            .app_data(data.clone())
            .default_service(web::route().to(not_found))
            .service(index)
            .service(do_something)
            .service(login)
            .service(logout)
    })
    .listen(tcp_listener)?
    .run();

    Ok(server)
}
