# PRD-005: Olympus Native Routing Engine (MVP)

**Project:** PRJ-016 (OpenClaw Independence)
**Author:** Tommy / ZAP CSO
**Status:** DRAFT -> HANDOFF TO JERRY
**Date:** 2026-04-01

## 1. Objective
Build an internal, zero-dependency message routing engine for ZAP-Claw, decoupling us entirely from the external OpenClaw framework. This MVP focuses on establishing a hardened, multi-tenant gateway that parses incoming webhooks, resolves agent assignments via a deterministic matrix, and initiates the execution DAG.

## 2. Core Operational Sequence
The Native Router must execute the following pipeline in strict order:

1. **Ingress (The Gateway):** 
   - Receives raw payloads via Next.js Edge functions (e.g., `/api/webhooks/telegram`).
   - Immediately validates HMAC/Signature to drop spoofed traffic.
2. **The Filter (Mention-Only Gate):**
   - For public groups/teams, drops all messages that do not explicitly `@mention` the bot or match an active thread ID.
3. **Dispatch Resolution (The Matrix):**
   - Queries the MongoDB `SYS_OS_bindings` registry to resolve the correct `agentId`.
   - Resolution order: Exact Peer ID -> Parent Thread ID -> Role Match -> Platform Boundary -> Default Catch-all.
4. **Context Construction (Paranoid Multi-Tenancy):**
   - Injects rigid environmental context (`ChatType`, `GroupMembers`).
   - Isolates session memory using composite keys: `tenantId:provider:channel:threadId`.
5. **Job Enqueue (Execution DAG):**
   - Pushes the verified message to `[tenantId]_SYS_OS_job_queue` as a `PENDING` job for the AgentLoop to consume.

## 3. Database Schema Requirements (MongoDB)

### Collection: `SYS_OS_active_sessions`
Tracks active conversational threads and context isolation.
- `_id`: ObjectId
- `tenantId`: String (e.g., "OLYMPUS_SWARM")
- `sessionKey`: String (Format: `provider:channelId:threadId`)
- `assignedAgentId`: String
- `sandboxMode`: Boolean (True if triggered in a public group context)
- `lastActive`: Date

### Collection: `SYS_OS_bindings`
The deterministic lookup table replacing OpenClaw's routing config.
- `_id`: ObjectId
- `tenantId`: String
- `platform`: String ("telegram", "discord", "api")
- `peerId`: String (Optional - Exact Match)
- `parentThreadId`: String (Optional)
- `agentId`: String (The target agent assigned)
- `priority`: Number (0-100, highest wins)

## 4. Native ACP (Agent Context Protocol) Specification
To solve the OpenClaw "thread binding" limitation, Olympus will enforce strict Thread-Level Keys. 

- Sub-agents spawned by Jerry or Spike will *not* share the parent's generic channel session.
- When an agent delegates to a sub-agent, the Native Router creates a unique `subThreadId` (e.g., `telegram:-100123:msg_456:sub_789`).
- The sub-agent's context window is strictly bound to this new `subThreadId` key, preventing memory bleed.
- Upon completion, the router merges the sub-agent's final output back into the parent thread context.

## 5. Security & Isolation Constraints (CSO Mandate)
- **Zero Hallucination:** Agents invoked in a group must have access to a dynamically generated `GroupRoster` to prevent misidentifying speakers.
- **Fail-Closed:** If the router cannot deterministically resolve an `agentId` matching the `tenantId`, it must drop the payload and log a Dead Letter Queue (DLQ) event. No blind routing.
- **No Generic AGI:** We are not building a generic language router. The engine routes strictly to predefined DLT Job Queues.

## Next Action
**{A2A:PING -> JERRY}** 
PRD-005 is finalized. Team Hydra is authorized to begin scaffolding `src/runtime/router` in the `zap-claw` package based on these specifications. Validate your initial database models before wiring the Next.js webhook receivers.
