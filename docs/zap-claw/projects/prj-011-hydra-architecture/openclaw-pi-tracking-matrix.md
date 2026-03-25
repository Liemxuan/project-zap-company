# PI Tracking Matrix: OpenClaw vs. ZAP-OS Native Router

**Project:** PRJ-016 (OpenClaw Independence)
**Status:** DRAFT (Handoff to Tommy & Jerry for BLAST Pre-Planning)
**Date:** March 6, 2026

## 1. Executive Summary

Zeus has requested building a native Olympus routing engine to achieve total OpenClaw independence for enterprise setups. This matrix cross-references the official [OpenClaw Gateway Architecture](https://docs.openclaw.ai/concepts/architecture) with our current internal Hydra routing specs (`inbound.ts`, `omni_queue.ts`, `prd-005`, `blast-016`) to identify parity gaps and optimization paths before launching the next BLAST.

---

## 2. Core Architecture Comparison

| Feature/Concept | OpenClaw Gateway Architecture | Olympus Native Router (ZAP-OS) |
| :--- | :--- | :--- |
| **Topology** | Single long-lived WebSocket Daemon (`127.0.0.1:18789`). | Decentralized HTTP Webhooks + Polling MongoDB Queue. |
| **Communication** | Pure WebSocket API (Push & Subscribe). | HTTP `POST` Webhooks (e.g., Telegram) mapped to `OmniQueue`. |
| **Data Validation** | Strict inbound frame validation via JSON Schema. | Internal TypeScript interfaces (`OmniPayload`); missing edge Zod validation. |
| **Event Streaming** | Emits push events (`agent`, `chat`, `health`, `presence`). | Polling-based daemon (`intervalMs = 2000`) checking for `PENDING` jobs. |
| **Nested Threading**| Does not natively support nested sub-agent thread spawning well. | **Solves this natively** via `threadId` capture in `inbound.ts`. |
| **Frontend UI** | Hosted in-daemon at `/__openclaw__/canvas/` & `/a2ui/`. | Leverages Next.js App Router for UI; decoupled from the queue. |
| **Queue Execution** | Direct function triggers via WS payload processing. | **Multi-Tier Job Queue** (Short/Long/Complex) via MongoDB. |

---

## 3. Critical Gaps & Areas of Improvement (Task List for Tommy & Jerry)

Before launching the next BLAST, **Tommy (Architect)** and **Jerry (Build Orchestrator)** must review and integrate the following improvements to our specs:

### 1. Upgrade the Data Validation Boundary (Strict Schemas)

- **Current State:** `inbound.ts` blindly casts webhook payloads to interfaces.
- **Tommy's Action:** Introduce strict JSON Schema or Zod validation at the Express boundary (mirroring OpenClaw's strict frame validation) *before* pushing anything to the `OmniQueue`.

### 2. Transition from Polling to Event-Driven Push (Latency Reduction)

- **Current State:** `omni_queue.ts` uses a `while(true)` loop sleeping for `2000ms` between DB queries.
- **Jerry's Action:** This is acceptable for deep tasks, but too slow for "Queue-Voice" or "Queue-Text-Fast" tasks. Implement MongoDB Change Streams or a localized Redis PubSub channel so the worker daemon is triggered instantly upon an insert, achieving true OpenClaw WS-level chat latency.

### 3. Implement the WebSocket Signaling Layer

- **Current State:** We are entirely HTTP/Webhook driven.
- **Tommy's Action:** To support OpenClaw's "Node" architecture (connecting Mac/iOS headlessly) and "WebChat" push updates without polling, we must stand up a generic WebSocket server inside the ZAP-OS backend mirroring the OpenClaw WS API for real-time `status` and `tick` events.

### 4. Agent UI (Canvas) Sandboxing

- **Current State:** OpenClaw proxies their canvas out of `/canvas/`.
- **Jerry's Action:** We need to confirm how the ZAP-OS Next.js frontend will render un-sanitized agent output (e.g., dynamic tools). We should dedicate a `next.config.js` proxy route or an `iframe` sandbox for `AgentCanvas` rendering locally to achieve parity.

---

## 4. Conclusion

We have superior nested-threading and asynchronous heavy-job queue management (`BLAST-016`). However, OpenClaw has superior inbound latency and data typing boundaries due to its WS Daemon architecture. Tommy and Jerry must integrate the 4 action items above into `.agent/skills` and `prd-005` to build a best-of-both-worlds Router.
