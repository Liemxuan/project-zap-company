use axum::{
    extract::{Path, State},
    response::{sse::Event, Sse},
    routing::{delete, get, put},
    Json, Router,
};
use anyhow::Result;
use fred::prelude::*;
use futures::stream::Stream;
use serde::Deserialize;
use std::{convert::Infallible, sync::Arc};
use tokio_stream::{wrappers::BroadcastStream, StreamExt};
use tracing::{info, Level};
use tracing_subscriber::FmtSubscriber;

#[derive(Clone)]
struct AppState {
    redis: RedisClient,
    pg: sqlx::PgPool,
}

#[tokio::main]
async fn main() -> Result<()> {
    // Initialize tracing
    let subscriber = FmtSubscriber::builder()
        .with_max_level(Level::INFO)
        .finish();
    tracing::subscriber::set_global_default(subscriber)?;

    // Redis setup
    let redis_url = std::env::var("REDIS_URL").unwrap_or_else(|_| "redis://127.0.0.1:6379".to_string());
    let config = RedisConfig::from_url(&redis_url)?;
    let redis = Builder::default().set_config(config).build()?;
    redis.init().await?;

    // PostgreSQL setup
    let db_url = std::env::var("DATABASE_URL").unwrap_or_else(|_| "postgres://localhost:5432/zap".to_string());
    let pg = sqlx::PgPool::connect(&db_url).await?;

    let state = Arc::new(AppState { redis, pg });

    let cors = tower_http::cors::CorsLayer::permissive();

    let app = Router::new()
        .route("/api/v1/stream/ticks", get(stream_ticks))
        .route("/api/v1/jobs/:id/priority", put(update_priority))
        .route("/api/v1/jobs/:id", delete(kill_job))
        .layer(cors)
        .with_state(state);

    let addr = "0.0.0.0:3999";
    let listener = tokio::net::TcpListener::bind(addr).await?;
    info!("ZAP Swarm Gateway active at {} - Master Harness (3999) Live.", addr);
    axum::serve(listener, app).await?;

    Ok(())
}

async fn stream_ticks(
    State(state): State<Arc<AppState>>,
) -> Sse<impl Stream<Item = Result<Event, Infallible>>> {
    let mut message_stream = BroadcastStream::new(state.redis.message_rx());
    state.redis.subscribe("zap:ticks").await.unwrap();
    
    let stream = async_stream::stream! {
        while let Some(Ok(msg)) = message_stream.next().await {
            if let Some(content) = msg.value.as_string() {
                yield Ok(Event::default().data(content));
            }
        }
    };

    Sse::new(stream).keep_alive(axum::response::sse::KeepAlive::new())
}

#[derive(Deserialize)]
struct PriorityUpdate {
    priority: f64,
}

async fn update_priority(
    Path(id): Path<String>,
    State(state): State<Arc<AppState>>,
    Json(payload): Json<PriorityUpdate>,
) -> Json<serde_json::Value> {
    let _: () = state.redis.zadd("zap:jobs:scheduled", None, None, false, false, (payload.priority, id)).await.unwrap();
    Json(serde_json::json!({ "status": "updated" }))
}

async fn kill_job(
    Path(id): Path<String>,
    State(state): State<Arc<AppState>>,
) -> Json<serde_json::Value> {
    let _: () = state.redis.zrem("zap:jobs:scheduled", id).await.unwrap();
    Json(serde_json::json!({ "status": "killed" }))
}
