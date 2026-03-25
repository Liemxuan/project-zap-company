# BLAST-012: Test-Time Recursive Thinking (TRT) Integration

## 1. The Core Objective

We are integrating the structural capabilities of Test-Time Recursive Thinking (TRT) directly into the ZAP-OS infrastructure. The goal is to force our background agents, Omni Router, and validation scripts to recursively critique and correct their own errors *before* presenting failures or half-baked logic to the user (Zeus).

---

## 2. Omni Router (The Cognitive Pipeline)

**Target File:** `src/runtime/engine/omni_router.ts`

**Current State:** The Omni Router executes payloads linearly based on theme and model tier, stopping as soon as a 200 HTTP code is returned regardless of content accuracy.
**TRT Implementation:**

- We introduce a `reflexions` integer into `OmniPayload` (activated for `intent: 'REASONING'` or `C_PRECISION`).
- Instead of returning the first response directly, if `reflexions > 0`, the router runs a hidden fast loop:
    1. **Generate Phase:** Model produces initial solution.
    2. **Reflect Phase:** We inject the output back into the model along with the prompt: *"Let's solve this problem. Analyze the reference solution carefully, find mistakes or reasoning flaws... Give me an [Error Report] and an improved [Summary]."*
    3. **Return:** Only the final, logically-audited response is returned to the client layer.
- *Impact:* Substantial reduction in hallucinated code logic or bad pipeline calls at the cost of slight latency.

---

## 3. Ralph Loop (The Verifier / Watchdog)

**Target File:** `src/scripts/ralph_verify.ts` and related validation systems.

**Current State:** `ralph_verify.ts` blindly checks versions and database connections and throws fatal errors if anything breaks.
**TRT Implementation:**

- Transform Ralph from a static script into an active recursive verification agent.
- When an environmental configuration or code test fails, Ralph captures the error `stderr` or stack trace.
- Ralph then uses TRT to inject the context into a self-analysis loop:
  *"The previous state failed due to error {ERR_DUMP}. Analyze why the test environment crashed, generate an [Error Report], and provide the correct action to resolve."*
- *Impact:* Ralph becomes capable of auto-fixing broken `.env` files, locked ports, or misconfigured schemas by looping until the system stabilizes.

---

## 4. Claude & Agent Workforce (The Persona Team)

**Target Files:** `src/runtime/serialized_lane.ts` / OpenRouter Agent Handlers

**Current State:** Claude models execute long-context coding requests. If they fail mid-pipeline, the human must step in and correct the logic.
**TRT Implementation:**

- We arm Claude agents with a dedicated `Mistakes Database` (a small vector or document store within MongoDB).
- Whenever Claude encounters a compilation error or logical bug in generation, it runs the **Select & Reflect** cycle.
- The error is logged into `{knowledge_text}` as a strict *"Wrong Answer List/Mistakes"* context block.
- On the next generation attempt (or when handing the context to another agent), the system forcibly injects this contextual `knowledge_text` so the team *cannot* attempt the previously failed method.
- *Impact:* Agents accumulate session-based intelligence "without external reward models" as proved by the TRT research architecture.

---

## 5. DLQ Worker (The Safety Net)

**Target File:** `src/cron/dlq_worker.ts`

**Current State:** Periodically grabs pending Dead Letters and simply runs `executeSerializedLane` blind a second time (often failing again for the exact same reason).
**TRT Implementation:**

- When a job drops into the DLQ, we extract `lastError`.
- We modify the DLQ worker to intercept the payload and wrap the system prompt with the TRT cognitive prefix:
  *"This is a complex problem. Oh the reference solution has one reasoning flaw! I will solve it from scratch first and challenge the reference solution's assumptions against this failure constraint..."*
- We inject the `lastError` directly into the worker's retry payload.
- *Impact:* DLQs rarely fail twice. The background process learns *why* it died before trying again.

---

## Execution Plan

1. Ensure the DB schemas support caching the `{knowledge_text}` error iterations (specifically for agent workflows).
2. Refactor `omni_router.ts` `generateOmniContent` to handle the `n_reflexions` recursive loop natively.
3. Update `.agent` workflows and validation scripts, wrapping them in error-catching loops that trigger TRT auto-critique instead of hard-failing to CLI.
