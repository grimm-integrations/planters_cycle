# Build stage
FROM rust:latest as builder
WORKDIR /app

ARG DATABASE_URL
ARG SECRET

ENV DATABASE_URL=$DATABASE_URL
ENV SECRET=$SECRET

COPY . .
RUN cargo build --release

# Production stage
FROM debian:buster-slim

RUN apt-get update -y \
      && apt install -y --no-install-recommends openssl ca-certificates \
      && apt-get autoremove -y \
      && apt-get clean -y \
      && rm -rf /var/lib/apt/lists/*

WORKDIR /usr/local/bin
COPY --from=builder /app/target/release/planters_cycle .

EXPOSE 8004

CMD ["./planters_cycle"]