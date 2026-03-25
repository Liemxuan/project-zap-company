# B.L.A.S.T. Document: Gateway Redundancy & Model Optimization Strategy

## Overview
This document analyzes the current state of Gateway Resiliency in the Olympus & Merchant Gateway System and proposes a comprehensive strategy for **Redundancy Registration Models** and **Dynamic Model Optimization**. The goal is to ensure 99.99% uptime for AI actions (no dropped messages) and cost/latency efficiency by matching the right model to the right job.

## 1. Current State Analysis
Based on `blast-004-gateway-resiliency.md` and `src/gateway/intercept.ts`, the system currently has:
- **Fallback Mechanism:** Arbitrage layer (`src/arbitrage.ts`) fails over from OpenRouter to Native Google Gemini API on 403/Limits.
- **Context Preservation:** Solved the "Amnesia" problem by safely sanitizing proprietary OpenAI payload schemas and stripping `[Tool: ___]` prefixes from DB history.
- **Agent Routing:** `intercept.ts` routes messages based on user profiles (`agentType`: ASSISTED vs. AUTONOMOUS).

### Current Weaknesses:
1. **Static Fallbacks:** The fallback is hardcoded (OpenRouter -> Google Gemini). It lacks a dynamic registry of redundant paths.
2. **Missing Job-to-Model Matching:** `intercept.ts` binds a single `defaultModel` to a user. It doesn't dynamically swap models based on the *complexity* of the payload.
3. **No Retries/Dead Letter Queue:** If both primary and fallback fail, the message is dropped or returns a generic error.

---

## 2. Proposed architecture: Redundancy Registration & Optimization

### A. The "Hydra" Redundancy Registration Model
Instead of a single fallback, the system needs a configurable registry of redundancy tiers.

**Schema Update (`SYS_OS_global_models`):**
Models should be registered not just as available, but assigned to "Tiers" and "Capabilities".
```json
{
  "model_id": "anthropic/claude-3-opus",
  "provider": "openrouter",
  "tier": 1, // Primary, highest cost, highest logic
  "capabilities": ["reasoning", "coding", "omni-tooling"],
  "fallback_chain": ["google/gemini-1.5-pro", "openai/gpt-4o-mini"]
}
```

**Implementation in Gateway (`src/arbitrage.ts`):**
1. Read the `fallback_chain` from the registry.
2. Attempt Primary. If failure (429, 500, 403), seamlessly loop through the `fallback_chain` array.
3. Apply the payload sanitization (from BLAST-004) to *every* step in the chain.

### B. Dynamic Model Optimization (Right-Sizing Tasks)
Not every task needs `gpt-4o`. We optimize by injecting a routing heuristic before LLM execution.

**The "Sorting Hat" Middleware:**
Inside `executeSerializedLane` (or before it in `intercept.ts`):
1. **Task Classification (Fast LLM/Heuristics):** Analyze the `msg.payload`.
   - *Example:* "What is my balance?" -> Requires DB lookup, low logic. -> Route to `tier: 3` (e.g., `gemini-1.5-flash`).
   - *Example:* "Write a detailed financial projection based on these 5 records." -> High logic. -> Route to `tier: 1` (e.g., `claude-3-5-sonnet`).
2. **Override/BYOK Bypass:** If the Merchant provided their own key (`BYOK`), skip cost-optimization and use their defined `defaultModel`, as the platform isn't paying for it.

### C. The Dead-Letter Queue (DLQ) for Zero-Drop Guarantee
If *all* models in the redundancy chain fail (e.g., global internet routing issue):
1. **Catch:** The Arbitrage layer must catch the total failure.
2. **Store:** Push the `IncomingMessage` object (User, Tenant, Payload, History) into a MongoDB collection: `SYS_OS_dead_letters`.
3. **Acknowledge:** Return a safe visual response to the user via Telegram: *"The network is experiencing heavy turbulence. Your request has been saved and will process shortly."*
4. **Retry CRON:** A background worker (SysAdmin level) attempts to process the `SYS_OS_dead_letters` every 3 minutes.

---

## 3. Implementation Blueprint

### Step 1: Update MongoDB Schemas
- Enhance the `GET /api/models` sync logic to include `tier` and `fallback_chain`.
- Update `[tenant]_SYS_OS_users` to allow overriding optimization settings (force Tier 1 for VIPs).

### Step 2: Arbitrage Engine Loop Refactor
Modify the `arbitrage` logic to loop dynamically over an array of fallback models rather than a hardcoded `if/else`.

### Step 3: Implement Zero-Drop Queues
Define a new MongoDB collection for pending/failed jobs and write the `CRON` re-processor.

---
**Review & Next Steps:** Please review this proposed Redundancy and Optimization structure. If approved, I can draft the exact code modifications for the `arbitrage` and `intercept` layers.
