use crate::prisma::PrismaClient;

mod controller;

async fn get_prisma_client() -> PrismaClient {
    let data: Result<PrismaClient, prisma_client_rust::NewClientError> =
        PrismaClient::_builder().build().await;
    let data = data.unwrap();
    data
}
