#[allow(warnings, unused)]
mod prisma;

use std::env;

use serde::{Deserialize, Serialize};
use actix_identity::{Identity, IdentityMiddleware};
use actix_session::{config::PersistentSession, storage::RedisActorSessionStore, Session, SessionMiddleware};
use actix_web::{cookie::time::Duration, delete, error, get, middleware, post, web, App, HttpMessage, HttpRequest, HttpResponse, HttpServer, Responder, Result};
use prisma::PrismaClient;
use prisma_client_rust::NewClientError;

use prisma::user;

#[get("/users")]
async fn get_users(data: web::Data<PrismaClient>) -> impl Responder {
    let users = data.user().find_many(vec![]).exec().await.unwrap();
    HttpResponse::Ok().json(users)
}

#[get("/users/{id}")]
async fn get_user_by_id(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    let user = data
        .user()
        .find_unique(user::id::equals(id.to_string()))
        .exec()
        .await
        .unwrap();
    HttpResponse::Ok().json(user.unwrap())
}

user::partial_unchecked!(UserUpdateData { display_name });

#[post("/users")]
async fn create_user(
    data: web::Data<PrismaClient>,
    body: web::Json<UserUpdateData>,
) -> impl Responder {
    let user = data
        .user()
        .create(body.display_name.as_ref().unwrap().to_string(), vec![])
        .exec()
        .await
        .unwrap();

    HttpResponse::Ok().json(user)
}

#[delete("/users/{id}")]
async fn delete_user(data: web::Data<PrismaClient>, id: web::Path<String>) -> impl Responder {
    match data
        .user()
        .delete(user::id::equals(id.to_string()))
        .exec()
        .await
    {
        Err(_) => {
            return HttpResponse::NotFound().body("User not found");
        }
        Ok(usr) => {
            return HttpResponse::Ok().json(usr);
        }
    }
}

#[allow(dead_code)]
async fn not_found() -> HttpResponse {
    HttpResponse::NotFound().body("Not Found")
}

#[derive(Serialize, Deserialize, Debug, PartialEq, Eq)]
pub struct IndexResponse {
    user_id: Option<String>,
    counter: i32,
}

#[derive(Deserialize)]
struct IdentityLog {
    user_id: String,
}

#[post("/login")]
async fn login(user_id: web::Json<IdentityLog>, req: HttpRequest, session: Session) -> Result<HttpResponse> {
    let id = user_id.into_inner().user_id;
    session.insert("user_id", &id)?;
    session.renew();

    let counter: i32 = session
        .get::<i32>("counter")
        .unwrap_or(Some(0))
        .unwrap_or(0);

    Identity::login(&req.extensions(), id.clone()).unwrap();

    Ok(HttpResponse::Ok().json(IndexResponse {
        user_id: Some(id),
        counter,
    }))
}

#[post("/logout")]
async fn logout(session: Session, ident: Identity) -> Result<String> {
    ident.logout();
    let id: Option<String> = session.get("user_id")?;
    if let Some(id) = id {
        session.purge();
        Ok(format!("Logged out: {id}"))
    } else {
        Ok("Could not log out anonymous user".into())
    }
}

#[get("/")]
async fn index(identity: Option<Identity>, session: Session) -> Result<impl Responder> {

    // let user_id: Option<String> = session.get::<String>("user_id").unwrap();
    let counter: i32 = session
        .get::<i32>("counter")
        .unwrap_or(Some(0))
        .unwrap_or(0);

    let id = match identity.map(|id| id.id()) {
        None => "anonymous".to_owned(),
        Some(Ok(id)) => id,
        Some(Err(err)) => return Err(error::ErrorInternalServerError(err))
    };

    Ok(HttpResponse::Ok().body(format!("Hello {id}, session: {counter}")))
}

#[get("/do_something")]
async fn do_something(session: Session) -> Result<HttpResponse> {
    let user_id: Option<String> = session.get::<String>("user_id").unwrap();
    let counter: i32 = session
        .get::<i32>("counter")
        .unwrap_or(Some(0))
        .map_or(1, |inner| inner + 1);
    session.insert("counter", counter)?;

    Ok(HttpResponse::Ok().json(IndexResponse { user_id, counter }))
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    let client: Result<PrismaClient, NewClientError> = PrismaClient::_builder().build().await;

    let client = client.unwrap();

    env_logger::init_from_env(env_logger::Env::default().default_filter_or("info"));
    env::set_var("RUST_LOG", "actix_web=debug");
    let data = web::Data::new(client);

    let priv_key = actix_web::cookie::Key::generate();

    HttpServer::new(move || {
        App::new()
            .wrap(IdentityMiddleware::default())
            .wrap(
                SessionMiddleware::builder(
                    RedisActorSessionStore::new("127.0.0.1:6379"),
                    priv_key.clone(),
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
            .service(get_users)
            .service(get_user_by_id)
            .service(create_user)
            .service(delete_user)
    })
    .bind(("127.0.0.1", 3001))?
    .run()
    .await?;

    Ok(())
}
