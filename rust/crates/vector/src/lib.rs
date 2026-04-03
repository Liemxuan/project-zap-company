use serde::{Deserialize, Serialize};
use reqwest::Client;
use anyhow::Result;
use chrono::{DateTime, Utc};

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct VectorId(String);

#[derive(Debug, Clone)]
pub struct VectorClient {
    client: Client,
    base_url: String,
}

impl VectorClient {
    pub fn new(base_url: Option<String>) -> Self {
        Self {
            client: Client::new(),
            base_url: base_url.unwrap_or_else(|| "http://localhost:8000".to_string()),
        }
    }

    /// Heartbeat for ChromaDB health check
    pub async fn heartbeat(&self) -> Result<bool> {
        let url = format!("{}/api/v1/heartbeat", self.base_url);
        let resp = self.client.get(url).send().await?;
        Ok(resp.status().is_success())
    }

    /// List existing collections (Integration check)
    pub async fn list_collections(&self) -> Result<Vec<serde_json::Value>> {
        let url = format!("{}/api/v1/collections", self.base_url);
        let resp = self.client.get(url).send().await?;
        let collections: Vec<serde_json::Value> = resp.json().await?;
        Ok(collections)
    }

    /// Create a new collection
    pub async fn create_collection(&self, name: &str) -> Result<String> {
        let url = format!("{}/api/v1/collections", self.base_url);
        let payload = serde_json::json!({ "name": name, "get_or_create": true });
        let resp = self.client.post(url).json(&payload).send().await?;
        let json: serde_json::Value = resp.json().await?;
        Ok(json["id"].as_str().unwrap_or_default().to_string())
    }

    /// Add chunks to a collection (Batch)
    pub async fn add_documents(&self, collection_id: &str, ids: Vec<String>, documents: Vec<String>, metadatas: Vec<serde_json::Value>) -> Result<()> {
        let url = format!("{}/api/v1/collections/{}/add", self.base_url, collection_id);
        let payload = serde_json::json!({
            "ids": ids,
            "documents": documents,
            "metadatas": metadatas,
        });
        self.client.post(url).json(&payload).send().await?;
        Ok(())
    }
}

pub struct CodebaseIndexer {
    vector_client: VectorClient,
}

impl CodebaseIndexer {
    pub fn new(vector_client: VectorClient) -> Self {
        Self { vector_client }
    }

    pub async fn index_directory(&self, path: &str, collection_name: &str) -> Result<()> {
        let collection_id = self.vector_client.create_collection(collection_name).await?;
        
        for entry in walkdir::WalkDir::new(path).into_iter().filter_map(|e| e.ok()) {
            if entry.file_type().is_file() {
                let file_path = entry.path().to_string_lossy().to_string();
                if file_path.ends_with(".rs") || file_path.ends_with(".md") {
                    let content = std::fs::read_to_string(entry.path())?;
                    // Simple chunking per file for v1
                    let id = format!("file_{}", uuid::Uuid::new_v4());
                    let metadata = serde_json::json!({ "path": file_path });
                    
                    self.vector_client.add_documents(
                        &collection_id,
                        vec![id],
                        vec![content],
                        vec![metadata]
                    ).await?;
                }
            }
        }
        Ok(())
    }
}
