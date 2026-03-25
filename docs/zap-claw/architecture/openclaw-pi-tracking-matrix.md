# OpenClaw Architecture vs. Olympus Native Engine (Tracking Matrix)

**Status:** Living Document | **Last Updated:** 2026-03-06
**Purpose:** As requested by Zeus, this matrix cross-references the official OpenClaw Pi Integration architecture against our proprietary Olympus Native Engine (PRJ-016). Tommy will use this to plan the ongoing feature roadmap for Team Hydra.

## 1. Core Integration Flow

OpenClaw uses an embedded runner (`runEmbeddedPiAgent()`) utilizing `@mariozechner/pi-coding-agent`.

| OpenClaw Feature | Olympus Implementation | Status | ZAP Improvement | Skills Deployed | Dependencies / Licensing | Source |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **Session Creation** (`createAgentSession`) | `SessionManager` (`session.ts`) | 🟢 DONE | **Database-backed.** Replaced file-based `.jsonl` with strict, multi-tenant MongoDB `SYS_CLAW_sessions`. Native `threadId` sub-agent binding. | `database-design`, `nodejs-best-practices` | `mongoose`, `mongodb` (MIT/SSPL) | [Pi Core Flow](https://docs.openclaw.ai/pi#core-integration-flow) |
| **Event Subscription** | `OmniQueue` hooks | 🔴 PENDING | **Scalability.** Moving from local EventEmitter to Redis/BullMQ-backed OmniQueue for distributed agent processing. | `server-management`, `api-patterns` | `bullmq`, `redis` (MIT/BSD) | [Pi Subscriptions](https://docs.openclaw.ai/pi#3-event-subscription) |

## 2. Tool Architecture

OpenClaw replaces internal `pi` coding tools with custom overrides (e.g., swapping `bash` for `exec/process` for strict sandboxing) and filters via `splitSdkTools()`.

| OpenClaw Feature | Olympus Implementation | Status | ZAP Improvement | Skills Deployed | Dependencies / Licensing | Source |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **Tool Definition Adapter** | Spike / The Armory | 🟡 WIP | **Dynamic Injection.** BLAST-018 handles JIT skill injection instead of statically loading all tools. | `agent-skill-evaluator`, `clean-code` | Internal ZAP Skills (Proprietary) | [Tool Architecture](https://docs.openclaw.ai/pi#tool-architecture) |
| **Sandbox Overrides** | ZAP Sandbox Bypass | 🟢 DONE | **OS-Level Bypass.** EPERM fixes and `sandbox-exec` mappings integrated directly into the `zap-run` execution layer, bypassing node-level limits. | `zap-sandbox-bypass`, `server-management` | `macOS sandbox-exec` (Native) | [Sandbox Pipeline](https://docs.openclaw.ai/pi#tool-pipeline) |

## 3. Session Management

OpenClaw manages history via file caching and compaction (`compactEmbeddedPiSessionDirect()`).

| OpenClaw Feature | Olympus Implementation | Status | ZAP Improvement | Skills Deployed | Dependencies / Licensing | Source |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **History Limiting** | The "Rule of 500" | 🟡 WIP | **Intelligent Truncation.** Established the compaction theory. Moving to inline hooks during DB append to trigger token summarization proactively. | `database-design`, `systematic-debugging` | `mongoose` (MIT) | [History Limiting](https://docs.openclaw.ai/pi#history-limiting) |
| **Context Pruning** | `SYS_CLAW_sessions` | 🟡 WIP | **Aggressive SNR.** Database mapping complete. Building a system to truncate the `messages[]` array aggressively to maintain the signal-to-noise ratio. | `clean-code`, `api-patterns` | None (Native TS) | [Session Management](https://docs.openclaw.ai/pi#session-management) |

## 4. Authentication & Model Resolution

OpenClaw uses rotated auth profiles (`advanceAuthProfile()`) and failovers based on API error sniffing.

| OpenClaw Feature | Olympus Implementation | Status | ZAP Improvement | Skills Deployed | Dependencies / Licensing | Source |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **Auth Profiles & Rotation** | `ModelAndBillingKeys` | 🔴 PENDING | **Financial Strictness.** Migrating our exact billing architecture natively. Securely cycling keys locally based purely on the `TenantId`. | `database-design`, `nodejs-best-practices` | `dotenv`, `crypto` (Native) | [Auth Profiles](https://docs.openclaw.ai/pi#auth-profiles) |
| **Failover Handling** | Not Started | 🔴 PENDING | **Resilience.** Logic to catch generic API failure limits and throw a `FailoverError`, subsequently rotating to a backup model string automatically. | `systematic-debugging`, `api-patterns` | None (Native TS) | [Model Failover](https://docs.openclaw.ai/pi#failover) |

## 5. Streaming & Block Replies

OpenClaw uses `EmbeddedBlockChunker` and tag stripping (`<think>` / `<final>`).

| OpenClaw Feature | Olympus Implementation | Status | ZAP Improvement | Skills Deployed | Dependencies / Licensing | Source |
| :--- | :--- | :---: | :--- | :--- | :--- | :--- |
| **Think/Final Tag Stripping** | OpenRouter `<think>` support | 🔴 PENDING | **Clean War Rooms.** Intercepting LLM streams to regex strip `<think>` tags, hiding reasoning steps from human War Rooms unless explicitly requested via `/hud`. | `clean-code`, `ui-ux-pro-max-skill` | None (Regex) | [Tag Stripping](https://docs.openclaw.ai/pi#thinkingfinal-tag-stripping) |
| **Reply Directives** | `[[media:url]]` parser | 🔴 PENDING | **Native Attachments.** Building a regex parser in our Telegram adapter inbound formatting to cleanly extract and send media bundles. | `api-patterns` | `node-telegram-bot-api` (MIT) | [Reply Directives](https://docs.openclaw.ai/pi#reply-directives) |

---

## Tommy's Next Recommended Actions (The PRD Backlog)

1. **Event Subscription (Queue Integration):** Tie the `session.ts` MongoDB history appending directly into the `OmniQueue` worker execution (PRD-006).
2. **Compaction triggers:** Automate the "Rule of 500" truncation within the DB level.
3. **Tag Stripping Middleware:** Keep the War Rooms clean by scrubbing deep thought processing out of the Telegram messages before hitting the new Channel Adapter.
