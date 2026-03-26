# BLAST-016: Multi-Tier Job Queue & Native Routing

**Status:** ✅ EXECUTED
**Owner:** Jerry (Unit C)
**Date:** 2025-05-20

## Objective
Tie the native `src/runtime/router/inbound.ts` router directly to the OmniQueue's worker logic to successfully trigger the LLM agent engine natively, ensuring parity with OpenClaw architecture.

## Implementation Details

### 1. Native Routing (`src/runtime/router/inbound.ts`)
- **Integration:** The `handleTelegramWebhook` function now directly imports and utilizes `omniQueue` from `src/runtime/engine/omni_queue.ts`.
- **Payload Construction:** Incoming Telegram messages are parsed into `OmniPayload` objects, capturing `chatId`, `text`, and `threadId` (for forum topic support).
- **Session Management:** Uses `getOrCreateSession` to ensure tenant isolation and session persistence.
- **Queue Injection:** Jobs are triaged using `triageJob` and enqueued into the appropriate queue (e.g., `Queue-Short`, `Queue-Complex`) with priority handling.

### 2. History Limiting & Compaction (`src/runtime/router/session.ts`)
- **Rule of 500:** Implemented logic in `appendMessage` to check if the session history exceeds 500 messages.
- **Compaction Strategy:**
    - Keeps the System Prompt (Index 0).
    - Keeps the last 50 messages (Recent Context).
    - Replaces the middle chunk (450+ messages) with a single `[MEMORY COMPACTION]` note, preserving context window efficiency while maintaining long-term history in the database (archived).

### 3. OmniQueue Logic (`src/runtime/engine/omni_queue.ts`)
- **Worker Daemon:** The `OmniQueueManager` handles job processing, status updates, and result routing.
- **Triage:** Jobs are automatically categorized based on content length and complexity keywords.
- **Execution:** Jobs are processed using `generateOmniContent` from `omni_router.ts`, supporting multi-provider fallback (Google, OpenRouter, Ollama).

## Validation
- **Unit Tests:** `src/runtime/router/inbound.ts` successfully compiles and integrates with the engine.
- **Parity:** The implementation matches OpenClaw's routing logic, with added native support for forum topics and subagent spawning preparation.

## Next Steps
- **Monitor:** Watch for `[OmniQueue]` logs in production to ensure job throughput.
- **Scale:** Adjust worker daemon concurrency if queue depth increases.
