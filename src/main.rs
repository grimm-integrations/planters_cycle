use actix_web::{get, web, App, HttpRequest, HttpResponse, HttpServer};

#[get("/")]
async fn index(req: HttpRequest) -> &'static str {
    println!("REQ: {:?}", req);
    "Hello world!\r\n"
}

#[get("/show/{id}")]
async fn user_detail(path: web::Path<(u32,)>) -> HttpResponse {
    HttpResponse::Ok().body(format!("User detail: {}", path.into_inner().0))
}

#[tokio::main]
async fn main() -> std::io::Result<()> {
    println!("Hello, world!");

    HttpServer::new(|| {
        App::new()
            .service(index)
            .service(web::scope("/api").service(user_detail))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
