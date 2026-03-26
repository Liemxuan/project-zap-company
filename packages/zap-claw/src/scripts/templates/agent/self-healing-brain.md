<!-- 
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: {{HUD_ID}}
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->

# 🧠 The Autonomic Nervous System: Self-Healing Logic

**Target System:** {{SYSTEM_TYPE}}

## 1. The Core Directive

This agent is equipped with a self-healing autonomic loop. When a critical failure occurs (e.g., API 403, Syntax Error, Token Exhaustion), the agent **MUST NOT** immediately crash or halt execution. It must attempt to diagnose and self-patch the issue before escalating to `{{PRIMARY_USER}}`.

## 2. Error Ingestion Protocol

When the executor loop catches an exception (via `stderr` or HTTP response):

1. **Halt Immediate Execution:** Pause the current `TASK_PLAN.md`.
2. **Inject Error:** The raw error stack trace must be injected into the context as an isolated `system` or `user` message.
3. **Trigger RCA (Root Cause Analysis):** The agent will analyze the stack trace using the Deep Brain (`{{PRIMARY_MODEL}}`).

## 3. The Self-Patching Matrix

Based on the RCA, the agent must execute one of the following remediation paths:

### A. Authentication / 403 / 401

- **Cause:** Invalid API Key, Rate Limit, or missing OAuth token.
- **Action:**
  1. Check `.env` for valid credentials.
  2. If missing, retrieve from the designated Secret Vault.
  3. If rate-limited, apply exponential backoff (e.g., sleep 5s, 10s, 30s).
- **Fallback:** Switch to secondary API endpoint if documented in `skills-manifest.md`.

### B. Syntax / Compilation Error

- **Cause:** Hallucinated code structure, missing imports, or incorrect variable scopes.
- **Action:**
  1. Use the `view_file` tool to re-read the failing script.
  2. Use the `replace_file_content` tool to patch the specific lines causing the compilation failure.
  3. Re-execute the script.

### C. Context Length Exceeded (Token Bloat)

- **Cause:** The conversation history or injected `memory.md` facts exceed the LLM context window.
- **Action:**
  1. Trigger the Titan Memory Engine (TME) compactor.
  2. Summarize older conversation turns.
  3. Flush low-priority semantic facts from the prompt.

## 4. The Circuit Breaker (HITL Escalation)

The agent is permitted a maximum of **3 consecutive self-healing attempts** for the same error.

- If the 3rd attempt fails, the Circuit Breaker trips.
- The agent must output `[AUTONOMIC FAILURE - AWAITING HITL]` and halt all execution.
- It must generate a concise Post-Mortem summarizing what failed and what 3 patches it attempted, delivering this directly to `{{PRIMARY_USER}}`.
