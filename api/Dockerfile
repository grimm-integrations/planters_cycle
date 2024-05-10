# Build stage
FROM rust:latest as builder
WORKDIR /app

ARG DATABASE_URL
ARG DATABASE_NAME
ARG HOST
ARG PORT

ENV DATABASE_URL=$DATABASE_URL
ENV DATABASE_NAME=$DATABASE_NAME
ENV HOST=$HOST
ENV PORT=$PORT

COPY . .
RUN cargo build --release

# Production stage
FROM debian:buster-slim
WORKDIR /usr/local/bin
COPY --from=builder /app/target/release/core .
CMD ["./core"]