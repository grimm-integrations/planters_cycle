use migration::{Migrator, MigratorTrait};
use service::sea_orm::DatabaseConnection;

pub async fn init_app_state() -> DatabaseConnection {
    let config = api::get_config().await;
    let db = api::create_database_connection(&config.db_url, &config.db_name).await;
    Migrator::reset(&db).await.unwrap();
    Migrator::up(&db, None).await.unwrap();
    db
}
