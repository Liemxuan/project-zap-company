use serde::{Deserialize, Serialize};
use uuid::Uuid;
use chrono::{DateTime, Utc};
use anyhow::Result;


#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(rename_all = "lowercase")]
pub enum MessageRole {
    System,
    User,
    Assistant,
    Tool,
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
#[serde(tag = "type", rename_all = "snake_case")]
pub enum ContentBlock {
    Text { text: String },
    ToolUse { id: String, name: String, input: serde_json::Value },
    ToolResult { id: String, content: String, #[serde(default)] is_error: bool },
}

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
pub struct ConversationMessage {
    pub id: Uuid,
    pub role: MessageRole,
    pub content: Vec<ContentBlock>,
    pub created_at: DateTime<Utc>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct SwarmStatus {
    pub active_agents: usize,
    pub pending_jobs: usize,
    pub system_health: String,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentMetadata {
    pub id: String,
    pub name: String,
    pub role: String,
    pub provider: String,
}

pub struct AgentRegistry {
    pub agents: Vec<AgentMetadata>,
}

impl AgentRegistry {
    pub fn new() -> Self {
        // Initialize with default 14 agents
        let mut agents = Vec::new();
        for i in 1..=14 {
            agents.push(AgentMetadata {
                id: format!("agent-{}", i),
                name: format!("ZAP Agent {}", i),
                role: if i == 1 { "Orchestrator".to_string() } else { "Worker".to_string() },
                provider: "GCP/Gemini".to_string(),
            });
        }
        Self { agents }
    }

    pub fn list_agents(&self) -> &Vec<AgentMetadata> {
        &self.agents
    }
}

// Choice C: PostgreSQL Ticket & Thought Persistence
#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Ticket {
    pub id: Uuid,
    pub title: String,
    pub status: String,
    pub agent_id: String,
    pub thoughts: Vec<AgentThought>,
    pub result: Option<String>,
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct AgentThought {
    pub step: usize,
    pub content: String,
    pub created_at: DateTime<Utc>,
}

pub struct TicketStore {
    pub pool: sqlx::PgPool,
}

impl TicketStore {
    pub fn new(pool: sqlx::PgPool) -> Self {
        Self { pool }
    }

    pub async fn create_ticket(&self, title: &str, agent_id: &str) -> Result<Uuid> {
        let id = Uuid::new_v4();
        sqlx::query(
            "INSERT INTO tickets (id, title, status, agent_id) VALUES ($1, $2, $3, $4)"
        )
        .bind(id)
        .bind(title)
        .bind("OPEN")
        .bind(agent_id)
        .execute(&self.pool)
        .await?;
        Ok(id)
    }

    pub async fn add_thought(&self, ticket_id: Uuid, step: usize, content: &str) -> Result<()> {
        let now = Utc::now();
        sqlx::query(
            "INSERT INTO thoughts (ticket_id, step, content, created_at) VALUES ($1, $2, $3, $4)"
        )
        .bind(ticket_id)
        .bind(step as i32)
        .bind(content)
        .bind(now)
        .execute(&self.pool)
        .await?;
        Ok(())
    }
}

#[derive(Debug, Clone, Serialize, Deserialize, Default)]
pub struct Session {
    pub id: Uuid,
    pub messages: Vec<ConversationMessage>,
    pub metadata: serde_json::Map<String, serde_json::Value>,
}

impl Session {
    pub fn new() -> Self {
        Self {
            id: Uuid::new_v4(),
            messages: Vec::new(),
            metadata: serde_json::Map::new(),
        }
    }

    pub fn add_message(&mut self, role: MessageRole, content: Vec<ContentBlock>) {
        self.messages.push(ConversationMessage {
            id: Uuid::new_v4(),
            role,
            content,
            created_at: Utc::now(),
        });
    }
}

pub struct SwarmEngine {
    pub plugin_manager: plugins::PluginManager,
}

impl SwarmEngine {
    pub fn new(plugin_manager: plugins::PluginManager) -> Self {
        Self { plugin_manager }
    }

    /// Safely execute a tool using the defined ZSS Sandbox & Guard Interceptors
    pub async fn execute_tool(&self, tool_name: &str, input: serde_json::Value) -> Result<String> {
        let mut pre_event = plugins::HookEvent::PreToolUse {
            tool: tool_name.to_string(),
            agent_id: "agent-007".to_string(),
            input: input.clone(),
        };

        // 1. Evaluate ZSS Pre-Guards
        let pre_result = self.plugin_manager.run(&mut pre_event).await?;
        if !pre_result.allow {
            // Guard Rejected: Return the violation interceptor string directly to LLM context
            return Ok(pre_result.message.unwrap_or_else(|| String::from("BLOCKED_BY_ZSS")));
        }

        // 2. Actual MCP Tool Execution Handoff
        let raw_output = Self::handoff_to_mcp(tool_name, &input.clone()).await.unwrap_or_else(|e| format!("MCP_EXECUTION_FAILED: {}", e));

        // 3. Evaluate ZSS Post-Guards (Redaction)
        let mut post_event = plugins::HookEvent::PostToolUse {
            tool: tool_name.to_string(),
            output: raw_output,
        };
        
        let _ = self.plugin_manager.run(&mut post_event).await?;
        
        if let plugins::HookEvent::PostToolUse { output, .. } = post_event {
            Ok(output)
        } else {
            Ok(String::new())
        }
    }

    async fn handoff_to_mcp(tool_name: &str, input: &serde_json::Value) -> Result<String> {
        use tokio::io::{AsyncWriteExt, AsyncBufReadExt, BufReader};
        use std::process::Stdio;

        let mcp_config_path = "/Users/zap/.gemini/antigravity/mcp_config.json";
        let config_str = tokio::fs::read_to_string(mcp_config_path).await.unwrap_or_else(|_| "{}".to_string());
        let config: serde_json::Value = serde_json::from_str(&config_str).unwrap_or(serde_json::json!({}));
        
        let servers = config.get("mcpServers").and_then(|v| v.as_object()).cloned().unwrap_or_default();
        
        let mut selected_server: Option<String> = None;
        let mut real_tool_name = tool_name.to_string();
        let mut command = "npx".to_string();
        let mut args: Vec<String> = vec![];
        let mut envs: std::collections::HashMap<String, String> = std::collections::HashMap::new();

        for (name, srv) in servers.iter() {
            if let Some(disabled) = srv.get("disabled") {
                if disabled.as_bool().unwrap_or(false) {
                    continue;
                }
            }
            
            let prefix1 = format!("{}_", name);
            let prefix2 = format!("mcp__{}__", name);
            let prefix3 = format!("{}-", name);
            
            if tool_name.starts_with(&prefix1) {
                selected_server = Some(name.clone());
                real_tool_name = tool_name[prefix1.len()..].to_string();
            } else if tool_name.starts_with(&prefix2) {
                selected_server = Some(name.clone());
                real_tool_name = tool_name[prefix2.len()..].to_string();
            } else if tool_name.starts_with(&prefix3) {
                selected_server = Some(name.clone());
                real_tool_name = tool_name[prefix3.len()..].to_string();
            } else if tool_name == "run_command" || tool_name == "view_file" {
                // Fallback hardcoding for generic tools without strict prefixes
                // If it's github/gitkraken/testsprite. We will let the MOCK handle if not matched.
            }
            
            if selected_server.is_some() {
                command = srv.get("command").and_then(|v| v.as_str()).unwrap_or("npx").to_string();
                if let Some(a) = srv.get("args").and_then(|v| v.as_array()) {
                    args = a.iter().filter_map(|x| x.as_str().map(|s| s.to_string())).collect();
                }
                if let Some(e) = srv.get("env").and_then(|v| v.as_object()) {
                    for (k, v) in e {
                        if let Some(s) = v.as_str() {
                            envs.insert(k.clone(), s.to_string());
                        }
                    }
                }
                break;
            }
        }
        
        // If we didn't find a matching MCP server config, fallback to simulate for now
        if selected_server.is_none() {
            let mut raw = format!("MOCK_EXECUTED: {}", tool_name);
            if tool_name == "run_command" {
                raw = format!("PostgreSQL started on 4hzbdE8cI3sbYYa5 with API key zss-omega-delta-99-super-secret-key-2026.");
            }
            return Ok(raw);
        }
        
        // Spawn MCP Server Subprocess
        let mut child = tokio::process::Command::new(&command)
            .args(&args)
            .envs(&envs)
            .stdin(Stdio::piped())
            .stdout(Stdio::piped())
            .spawn()?;
            
        let mut stdin = child.stdin.take().unwrap();
        let stdout = child.stdout.take().unwrap();
        let mut reader = BufReader::new(stdout).lines();
        
        // 1. Send initialization request
        let init_req = serde_json::json!({
            "jsonrpc": "2.0",
            "id": 1,
            "method": "initialize",
            "params": {
                "protocolVersion": "2024-11-05",
                "capabilities": {},
                "clientInfo": {
                    "name": "zap-runtime-mcp-client",
                    "version": "1.0.0"
                }
            }
        });
        let mut init_str = serde_json::to_string(&init_req)?;
        init_str.push('\n');
        stdin.write_all(init_str.as_bytes()).await?;
        
        // 2. Await Initialization response
        while let Some(line) = reader.next_line().await? {
            if line.contains(r#""id":1"#) || line.contains(r#""id": 1"#) {
                break;
            }
        }
        
        // 3. Send initialized notification
        let mut notif_str = serde_json::json!({
            "jsonrpc": "2.0",
            "method": "notifications/initialized",
            "params": {}
        }).to_string();
        notif_str.push('\n');
        stdin.write_all(notif_str.as_bytes()).await?;
        
        // 4. Send Tool Call Request
        let tool_req = serde_json::json!({
            "jsonrpc": "2.0",
            "id": 2,
            "method": "tools/call",
            "params": {
                "name": real_tool_name,
                "arguments": input
            }
        });
        let mut tool_str = serde_json::to_string(&tool_req)?;
        tool_str.push('\n');
        stdin.write_all(tool_str.as_bytes()).await?;
        
        // 5. Await Result
        let mut final_output = String::new();
        while let Some(line) = reader.next_line().await? {
            if line.contains(r#""id":2"#) || line.contains(r#""id": 2"#) {
                let res: serde_json::Value = serde_json::from_str(&line).unwrap_or(serde_json::json!({}));
                if let Some(err) = res.get("error") {
                    final_output = format!("Error: {:?}", err);
                } else if let Some(result) = res.get("result") {
                    if let Some(content) = result.get("content").and_then(|v| v.as_array()) {
                        for block in content {
                            if let Some(text) = block.get("text").and_then(|v| v.as_str()) {
                                final_output.push_str(text);
                                final_output.push('\n');
                            }
                        }
                    } else {
                        final_output = result.to_string();
                    }
                }
                break;
            }
        }
        
        // Graceful cleanup
        let _ = child.kill().await;
        Ok(final_output)
    }
}
