---
type: SOP
id: SOP-013-AGENT_API_ALLOCATION
title: Olympus Agent API Allocation & Gateway Billing
area: Cloud Infrastructure
version: 1.0.0
last_updated: "2026-03-04"
author: ZAP Security
---

# SOP-013: Olympus Agent API Allocation & Gateway Billing

## 1. Purpose

This SOP documents the API key allocations, designated projects, and isolated billing architecture for the OmniRouter. It standardizes the rules for Agent-specific execution and fallback mechanisms to the global Olympus Gateway.

## 2. Scope

Applies to all ZAP-OS / Olympus deployed AI Agents (e.g., Jerry, Spike) and the core `omni_router.ts` infrastructure interacting with LLM providers (Google, OpenRouter, Anthropic, Ollama).

## 3. The Isolated Agent architecture

Agents operate independently to prevent bottlenecking or maxing out rate limits on global keys.

1. **Self-Sufficient**: Agents bring their own `PRIMARY` and `BACKUP` credentials.
2. **Context Routing**: The `omni_router.ts` reads the intent (FAST_CHAT vs REASONING) and maps it to the corresponding Provider / Pillar.
3. **Gateway Fallback**: If an Agent fails to provide a valid key or their dedicated token pool is exhausted, the Agent is fallback-routed through the **Olympus Gateway**, incurring a metered tracking charge (currently set to `$0.10` per completion).

## 4. Current API Key Allocations & projects

*Security Note: Keys are redacted to their final 5 characters. Full keys are maintained in secure ENV storage.*

### JERRY (Chief of Staff & Builder)

| Function | Service Account | Google Project ID | Associated ENV Tag | Key Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Reasoning** | `tomtranzap@gmail.com` | `projects/452732576570` (Prime Ultra) | `JERRY_PRIMARY_API_KEY` | `...MqVPQ` |
| **Backup Fallback** | `tom6573637618@gmail.com` | `projects/726292956983` (Agent Project) | `JERRY_BACKUP_API_KEY` | `...j50A` |
| **Visual Gen (Gold Banana)**| `tom6573637618@gmail.com` | `projects/726292956983` (Agent Project) | `JERRY_IMAGE_API_KEY` | `...hF088` |

### SPIKE (Analyst)

| Function | Service Account | Google Project ID | Associated ENV Tag | Key Reference |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Reasoning** | `tomtranzap@gmail.com` | `projects/452732576570` (Prime Ultra) | `SPIKE_PRIMARY_API_KEY` | `...cfdveY` |
| **Backup Fallback** | `tom6573637618@gmail.com` | `projects/726292956983` (Agent Project) | `SPIKE_BACKUP_API_KEY` | `...fUAOIY` |
| **Visual Gen (Gold Banana)**| `tom6573637618@gmail.com` | `projects/726292956983` (Agent Project) | `SPIKE_IMAGE_API_KEY` | `...hF088` |

## 5. Gateway Metering (The "Charge")

If `omni_router.ts` detects that an Agent is lacking isolated keys or defaults to:
`attemptApiKey = liveKeys["PRECISION_GATEWAY"]`
`attemptApiKey = liveKeys["CODE_WORKFORCE"]`
`attemptApiKey = liveKeys["FRONTIER_BRIDGE"]`

The payload injects a `gatewayCharge: 0.10` tracking variable. This is pushed asynchronously to the MongoDB cluster under `SYS_OS_arbiter_metrics`.

## 6. Telemetry Data Structure

Olympus tracks all agent requests to build cost-accounting and workforce efficiency data.
The MongoDB `SYS_OS_arbiter_metrics` record stores:

```json
{
    "timestamp": "ISODate()",
    "botName": "Jerry",
    "pillar": "GOOGLE",
    "modelId": "gemini-3.1-pro-preview",
    "tokens": {
        "prompt": 12040, 
        "completion": 810, 
        "total": 12850, 
        "cached": 0 
    },
    "intent": "REASONING",
    "gatewayCharge": 0.10,
    "status": "SUCCESS"
}
```

The data can be aggregated later to say:
*"Jerry completed 40 tasks. 30 used his isolated Primary Key (Cost: $0.00 to Olympus). 10 fell back to the Olympus Gateway (Cost: $1.00 assigned back to Jira / User Budget)."*
