use axum::{
    body::Body,
    extract::Request,
    response::IntoResponse,
    routing::{get, post},
    Router,
};
use bytes::Bytes;
use futures::StreamExt;
use reqwest::{Client, header};
use std::net::SocketAddr;
use tokio::sync::mpsc;
use tokio_stream::wrappers::ReceiverStream;
use tower_http::cors::CorsLayer;
use zap_gateway::{sse::SseParser, types::StreamEvent};

#[tokio::main]
async fn main() {
    dotenvy::from_path("/Users/zap/Workspace/olympus/packages/zap-claw/.env").ok();
    
    let app = Router::new()
        .route("/health", get(|| async { "ZAP Gateway Proxy Online" }))
        .route("/proxy/claude", post(proxy_claude_stream))
        .route("/proxy/gemini/*path", post(proxy_gemini_stream))
        .layer(CorsLayer::permissive());

    let addr = SocketAddr::from(([0, 0, 0, 0], 3901));
    println!("🚀 ZAP Gateway Proxy listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

async fn proxy_claude_stream(req: Request) -> impl IntoResponse {
    let api_key = std::env::var("ANTHROPIC_API_KEY").unwrap_or_default();
    
    // Forward the POST body strictly to anthropic
    let body_bytes = match axum::body::to_bytes(req.into_body(), usize::MAX).await {
        Ok(b) => b,
        Err(_) => return axum::response::Response::builder()
            .status(400)
            .body(Body::empty())
            .unwrap()
    };

    let client = Client::new();
    let res_result = client
        .post("https://api.anthropic.com/v1/messages")
        .header("x-api-key", api_key)
        .header("anthropic-version", "2023-06-01")
        .header("content-type", "application/json")
        .body(body_bytes)
        .send()
        .await;

    let res = match res_result {
        Ok(r) => r,
        Err(e) => {
            println!("Reqwest error: {}", e);
            return axum::response::Response::builder()
                .status(502)
                .body(Body::empty())
                .unwrap()
        }
    };

    if !res.status().is_success() {
        let status = res.status();
        let error_body = res.text().await.unwrap_or_default();
        println!("Anthropic Error {}: {}", status, error_body);
        return axum::response::Response::builder()
            .status(status)
            .body(Body::from(error_body))
            .unwrap();
    }

    let mut upstream_stream = res.bytes_stream();
    let (tx, rx) = mpsc::channel::<Result<Bytes, std::io::Error>>(100);

    tokio::spawn(async move {
        let mut parser = SseParser::new();
        
        while let Some(chunk_result) = upstream_stream.next().await {
            if let Ok(chunk) = chunk_result {
                // Here is the magic: We push raw bytes to our buffer!
                // It safely handles TCP chunk splits without dropping \n\n
                if let Ok(events) = parser.push(&chunk) {
                    for event in events {
                        // Re-serialize strictly to avoid broken JSON EOFs
                        let payload = serde_json::to_string(&event).unwrap();
                        let formatted = format!("event: {}\ndata: {}\n\n", get_event_name(&event), payload);
                        if tx.send(Ok(Bytes::from(formatted))).await.is_err() {
                            break;
                        }
                    }
                }
            }
        }
    });

    axum::response::Response::builder()
        .header(header::CONTENT_TYPE, "text/event-stream")
        .header(header::CACHE_CONTROL, "no-cache")
        .header(header::CONNECTION, "keep-alive")
        .body(Body::from_stream(ReceiverStream::new(rx)))
        .unwrap()
}

fn get_event_name(event: &StreamEvent) -> &'static str {
    match event {
        StreamEvent::MessageStart(_) => "message_start",
        StreamEvent::ContentBlockStart(_) => "content_block_start",
        StreamEvent::ContentBlockDelta(_) => "content_block_delta",
        StreamEvent::ContentBlockStop(_) => "content_block_stop",
        StreamEvent::MessageDelta(_) => "message_delta",
        StreamEvent::MessageStop(_) => "message_stop",
    }
}

async fn proxy_gemini_stream(req: Request) -> impl IntoResponse {
    // RESOLUTION: Prioritize the incoming client key to enable the 105-key Matrix rotation
    let api_key = req.headers().get("x-goog-api-key")
        .and_then(|h| h.to_str().ok())
        .map(|s| s.to_string())
        .unwrap_or_else(|| {
            std::env::var("GEMINI_API_KEY")
                .or_else(|_| std::env::var("GOOGLE_API_KEY"))
                .unwrap_or_default()
        });
    
    // Extract full path and query
    let uri = req.uri().path_and_query().map(|x| x.as_str()).unwrap_or("");
    let mut target_path = if uri.starts_with("/proxy/gemini/") {
        uri["/proxy/gemini/".len()..].to_string()
    } else {
        uri.to_string()
    };
    
    // RESOLUTION: Use v1 stable for the Gemini 2.0/2.5 series (PRD-102)
    if target_path.starts_with("models/") {
        target_path = format!("v1/{}", target_path);
    }
    
    let target_url = format!("https://generativelanguage.googleapis.com/{}", target_path);
    println!("[Gateway] Forwarding Matrix request to: {}", target_url);

    // Forward the POST body strictly to google
    let body_bytes = match axum::body::to_bytes(req.into_body(), usize::MAX).await {
        Ok(b) => b,
        Err(_) => return axum::response::Response::builder()
            .status(400)
            .body(Body::empty())
            .unwrap()
    };

    let client = Client::new();
    let res_result = client
        .post(&target_url)
        .header("x-goog-api-key", api_key)
        .header("content-type", "application/json")
        .body(body_bytes)
        .send()
        .await;

    let res = match res_result {
        Ok(r) => r,
        Err(e) => {
            println!("Reqwest error: {}", e);
            return axum::response::Response::builder()
                .status(502)
                .body(Body::empty())
                .unwrap()
        }
    };

    if !res.status().is_success() {
        let status = res.status();
        let error_body = res.text().await.unwrap_or_default();
        println!("Gemini Error {}: {}", status, error_body);
        return axum::response::Response::builder()
            .status(status)
            .body(Body::from(error_body))
            .unwrap();
    }

    let mut upstream_stream = res.bytes_stream();
    let (tx, rx) = mpsc::channel::<Result<Bytes, std::io::Error>>(100);

    tokio::spawn(async move {
        // Generic SSE parser that yields strings split by \n\n
        let mut buffer = Vec::new();
        while let Some(chunk_result) = upstream_stream.next().await {
            if let Ok(chunk) = chunk_result {
                buffer.extend_from_slice(&chunk);
                while let Some(separator) = buffer.windows(2).position(|window| window == b"\n\n") {
                    let frame: Vec<u8> = buffer.drain(..separator + 2).collect();
                    if tx.send(Ok(Bytes::from(frame))).await.is_err() {
                        return;
                    }
                }
            }
        }
        if !buffer.is_empty() {
            let _ = tx.send(Ok(Bytes::from(buffer))).await;
        }
    });

    axum::response::Response::builder()
        .header(header::CONTENT_TYPE, "text/event-stream")
        .header(header::CACHE_CONTROL, "no-cache")
        .header(header::CONNECTION, "keep-alive")
        .body(Body::from_stream(ReceiverStream::new(rx)))
        .unwrap()
}
