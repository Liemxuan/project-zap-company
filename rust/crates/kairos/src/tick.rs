use serde::{Deserialize, Serialize};
use uuid::Uuid;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SwarmJob {
    pub id: Uuid,
    pub agent_id: String,
    pub payload: serde_json::Value,
    pub scheduled_at: i64,
}

pub struct TickRegistry {
    pub redis_url: String,
}

impl TickRegistry {
    pub fn new(redis_url: String) -> Self {
        Self { redis_url }
    }

    /// Placeholder for Redis ZSET polling
    pub async fn poll_next_available(&self) -> anyhow::Result<Vec<SwarmJob>> {
        // TODO: Implement fred/redis ZRANGEBYCORE -inf <now>
        Ok(vec![])
    }
}
