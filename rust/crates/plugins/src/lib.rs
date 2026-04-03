use serde::{Deserialize, Serialize};
use async_trait::async_trait;

#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(tag = "type", rename_all = "SCREAMING_SNAKE_CASE")]
pub enum HookEvent {
    PreToolUse { 
        tool: String, 
        agent_id: String,
        input: serde_json::Value 
    },
    PostToolUse { 
        tool: String, 
        output: String 
    },
    PostToolUseFailure { 
        tool: String, 
        error: String 
    },
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct HookRunResult {
    pub allow: bool,
    pub message: Option<String>,
}

#[async_trait]
pub trait HookRunner: Send + Sync {
    /// Executes the hook for the given event, potentially mutating it in-place.
    async fn run(&self, event: &mut HookEvent) -> anyhow::Result<HookRunResult>;
}

pub struct PluginManager {
    guards: Vec<Box<dyn HookRunner>>,
}

impl PluginManager {
    pub fn new() -> Self {
        Self { guards: Vec::new() }
    }

    pub fn register(&mut self, guard: Box<dyn HookRunner>) {
        self.guards.push(guard);
    }

    /// Runs the event through the entire interceptor pipeline.
    /// Short-circuits and returns `allow: false` if any guard rejects it.
    /// Mutates the event in-place (e.g., for redaction).
    pub async fn run(&self, event: &mut HookEvent) -> anyhow::Result<HookRunResult> {
        for guard in &self.guards {
            let result = guard.run(event).await?;
            if !result.allow {
                return Ok(result); // Block hit: short-circuit pipeline
            }
        }
        Ok(HookRunResult { allow: true, message: None })
    }
}

/// The Zap Swarm Security SafeExecutor Guard.
/// Prevents command injection and destructive bash routines.
pub struct ZssSafeExecutorGuard;

#[async_trait]
impl HookRunner for ZssSafeExecutorGuard {
    async fn run(&self, event: &mut HookEvent) -> anyhow::Result<HookRunResult> {
        if let HookEvent::PreToolUse { tool, input, .. } = event {
            if tool == "run_command" {
                if let Some(cmd) = input.get("CommandLine").and_then(|v| v.as_str()) {
                    let cmd_lower = cmd.to_lowercase();
                    
                    // ZSS-1: Block destructive patterns and shell piping
                    let forbidden_patterns = [
                        "rm -rf", "mkfs", "chmod -r", "chown -r", "wget", "curl", 
                        ">", "<", "|", "&&", ";",
                    ];

                    for pattern in forbidden_patterns.iter() {
                        if cmd_lower.contains(pattern) {
                            return Ok(HookRunResult {
                                allow: false,
                                message: Some(format!(
                                    "[ZAP_SECURITY_VIOLATION] Destructive capability or shell piping detected ('{}'). Request rejected by ZssSafeExecutorGuard. Refactor your command.",
                                    pattern
                                )),
                            });
                        }
                    }
                }
            }
        }
        // Allow if no rules were violated
        Ok(HookRunResult { allow: true, message: None })
    }
}

/// ZSS Token Budget Guard (Ironclad Phase 2)
/// Blocks tool execution if the agent has exhausted their token quota.
pub struct ZssTokenBudgetGuard;

#[async_trait]
impl HookRunner for ZssTokenBudgetGuard {
    async fn run(&self, event: &mut HookEvent) -> anyhow::Result<HookRunResult> {
        if let HookEvent::PreToolUse { agent_id, .. } = event {
            // MOCK LOGIC for Postgres Quota check. If agent-4 reaches hard limit.
            if agent_id == "agent-403" {
                return Ok(HookRunResult {
                    allow: false,
                    message: Some("BUDGET_EXHAUSTED: You have exhausted your ZAP Swarm token budget for this cycle.".to_string()),
                });
            }
        }
        Ok(HookRunResult { allow: true, message: None })
    }
}

/// ZSS Input Validaton Guard
/// Checks maximum sizes.
pub struct ZssInputValidationGuard;

#[async_trait]
impl HookRunner for ZssInputValidationGuard {
    async fn run(&self, event: &mut HookEvent) -> anyhow::Result<HookRunResult> {
        if let HookEvent::PreToolUse { input, .. } = event {
            let input_str = serde_json::to_string(input)?;
            if input_str.len() > 2000 {
                return Ok(HookRunResult {
                    allow: false,
                    message: Some(format!("ZSS_VALIDATION_ERROR: Tool input payload length ({}) exceeded Ironclad max width (2000).", input_str.len())),
                });
            }
        }
        Ok(HookRunResult { allow: true, message: None })
    }
}

/// The Zap Swarm Security Log Redaction Guard.
/// Scans tool outputs before they return to the agent or get persisted, scrubbing sensitive data.
pub struct ZssLogRedactionGuard;

#[async_trait]
impl HookRunner for ZssLogRedactionGuard {
    async fn run(&self, event: &mut HookEvent) -> anyhow::Result<HookRunResult> {
        match event {
            HookEvent::PostToolUse { output, .. } => {
                if output.contains("zss-omega-") || output.contains("postgresql://") || output.contains("4hzbdE8cI3sbYYa5") {
                    *output = output.replace("zss-omega-delta-99-super-secret-key-2026", "[ZSS_REDACTED]");
                    *output = output.replace("4hzbdE8cI3sbYYa5", "[ZSS_REDACTED]");
                }
            }
            HookEvent::PostToolUseFailure { error, .. } => {
                *error = error.replace("4hzbdE8cI3sbYYa5", "[ZSS_REDACTED]");
            }
            _ => {}
        }
        Ok(HookRunResult { allow: true, message: None })
    }
}
