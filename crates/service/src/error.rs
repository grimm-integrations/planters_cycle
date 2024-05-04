
#[derive(Display, From, Debug)]
pub enum MyError {
    NotFound(String),
    DbErr(DbErr),
}

impl std::error::Error for MyError {}

impl ResponseError for MyError {
    fn error_response(&self) -> HttpResponse {
        match self {
            MyError::NotFound(error) => {
                HttpResponse::NotFound().finish()
            },
            MyError::DbErr(err) => HttpResponse::InternalServerError().finish(),
        }
    }
}