use crate::prisma::PrismaClient;

mod controller;

async fn get_prisma_client() -> PrismaClient {
    PrismaClient::_builder().build().await.unwrap()
}
