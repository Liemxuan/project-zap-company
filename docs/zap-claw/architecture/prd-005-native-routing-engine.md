# PRD-005: Olympus Native Routing Engine (MVP)

**Status:** Draft | **Author:** Tommy | **Date:** 2026-03-30
**Strategic Alignment:** PRJ-016 (OpenClaw Independence)
**Architecture Reference:** SLA-STRAT-20260223 (Olympus vs OpenClaws)

## 1. Executive Summary
Olympus is replacing the external OpenClaw dependency with a native Next.js/Express message routing and orchestration tier inside the `zap-claw` package. The system strictly isolates tenants, unifies the 3-Tier Entity Typology, and enforces determinism via Omni-Queue concurrency lanes.

## 2. Core Functional Requirements (MVP Boundaries)
* **Goal:** A robust runtime to parse, queue, route, and respond to incoming channel requests (Telegram/Web) natively.
* **Non-Goal:** Multi-modal processing, AGI generalizations, or implementing non-core channels (Zalo/WhatsApp) in Phase 1.

### 2.1 The Request Lifecycle (Sequence Diagram)
1. **Ingest Webhook:** `app.post('/api/webhooks/telegram')` receives payload JSON.
2. **Session Hydration:** Request hits the `SessionManager`. 
   - Looks up `SYS_OS_active_sessions` by `chatId` (and optionally `message_thread_id`).
   - If missing/closed (timeout > 4 hrs), generates a new `sessionId`.
3. **Queue Ingestion (Serialized Lane):** Payload is enqueued into the tenant-specific `[TENANT]_SYS_OS_job_queue` via OmniQueue.
4. **Execution Loop (Agentic Processing):**
   - Background worker dequeues task.
   - Core `AgentLoop` pulls historical context (`SYS_CLAW_memory`) bound by `sessionId`.
   - LLM generation and internal tool execution run natively.
5. **Response Dispatch:** Final output pushed back via Axios to the Telegram API (or pushed via SSE for Web Clients).
6. **Db Sync:** Output written to MongoDB `interactions` list to close the historical loop.

## 3. Persistent Threaded Memory Schema
OpenClaw's failing point was its inability to persist thread identifiers across the Telegram adapter. We solve this natively in MongoDB.

**Collection:** `SYS_OS_active_sessions`
```typescript
interface SessionData {
  _id: ObjectId;
  sessionId: string; // Unique SES-XXXX
  tenantId: string; // Enforces strict mathematical isolation
  chatId: number; // Universal Channel Identifier (e.g. Telegram ID)
  threadId?: number; // *Critical:* Solves the OpenClaw limitation for subagent_spawning
  parentSessionId?: string; // ACP back-link for sub-agent tracking
  lastActive: Date;
  status: "ACTIVE" | "COMPACTING" | "CLOSED";
}
```

## 4. Native ACP (Agent Client Protocol) Specification
To bypass external HTTP calls, Olympus agents (Jerry, Spike) must invoke sub-agents at the Node.js runtime level.

### 4.1 Invocation Mechanics
Instead of firing a webhook to trigger another agent, the system exposes an internal `spawnSubAgent` method.
```typescript
// Sub-agent is spun up sharing the same memory pointer and thread binding.
const subAgentJob = await spawnSubAgent({
  agentSlug: "spike",
  mode: "session", // Replaces restricted mode="run"
  parentSessionId: currentSession.sessionId,
  threadId: currentSession.threadId,
  payload: "Extract this React component."
});
```

### 4.2 The Thread Binding Fix
By injecting the Telegram `message.message_thread_id` directly into the `SessionData.threadId` column upon webhook ingest, the entire OmniQueue and AgentLoop inherently filter history and append outputs precisely to that specific Telegram sub-thread. Sub-agents spun up on that thread simply inherit the `threadId` parameter, achieving seamless, persistent multi-agent conversational awareness.

## 5. Next Steps
* **Zeus Approval:** Require sign-off on MVP boundaries.
* **Execution Handoff:** `{A2A:PING} -> Jerry -> Scaffold src/runtime/router/webhooks.ts and native_acp.ts`
