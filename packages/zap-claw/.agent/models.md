<!-- 
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: HUD-MM3A94YR-6100
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->

# ⚡ MODELS: LLM Connection & Routing

**Target System:** OLYMPUS

## 1. Connection Strategy

- **Default (Zapclaw Gateway):** By default, the agent passes all inference requests through the centralized Zapclaw Omni-Router. This utilizes our pre-warmed prompt caches and load-balances across OpenRouter APIs for maximum token efficiency.
- **BYOK (Bring Your Own Key):** The merchant may override the gateway by providing a custom `OPENROUTER_API_KEY` or `OPENAI_API_KEY` in their local `.env`. If detected, the agent routes directly, bypassing Zapclaw's centralized cache pooling.

## 2. Active Network Config

- **Connection Model:** `Omni-Router (Internal Default)`
- **Primary Tier Model:** `Gemini 3.1 (Deep Brain - SOTA)`

## 3. Model Tiering (Bicameral Brain)

- **Fast-Brain (Tier 1):** Utilized for simple classification, routing, and tool trigger checks. (e.g., `gemini-1.5-flash`).
- **Deep-Brain (Tier 2):** Utilized exclusively for complex logic, multi-step planning, and semantic conflict resolution. (e.g., `gemini-3.1`).

## 3. Override Warning

- **Platform Integrity (Olympus Only):** Olympus agents MUST NEVER use BYOK fallback. They are strictly bound to the internal Omni-Router infrastructure to ensure system-wide telemetry is not blinded.
