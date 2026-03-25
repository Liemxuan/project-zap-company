# PRJ-006: Gateway Arbitrage & Model Matrix

## 1. The Core Objective
To construct a competitive API Gateway that actively arbitrages model bandwidth. Rather than relying on a static string configuration (e.g., `openrouter/auto`), the Gateway must dynamically route, fallback, and optimize execution paths based on real-time empirical matrices (Low/Budget, Free, Expensive/Reasoning) and across different suppliers (OpenRouter vs. Native OEM accounts).

## 2. The Current Deficit (What We Lack)
As it stands, Zap-Claw only holds a single `$OPENROUTER_API_KEY` mapped in `.env`.
It does **not** utilize critical OpenRouter routing configurations, nor does it have fallback Native OEM accounts (like Google Studio or Anthropic Console) to switch to if OpenRouter goes down or spikes prices.

## 3. The Arbitrage Matrix (Testing Variables)

To test true competitive routing, the following parameters must be evaluated and configured:

### A. Provider Sourcing (The Supply Chain)
*   **Variable 1 (Native vs. Aggregator):** Does it cost less, or have lower latency, to query Google Gemini 2.5 Flash natively via the Gemini SDK (Google API Key) versus mapping it through OpenRouter?
*   **Variable 2 (Provider Fallbacks):** If `DeepSeek-Coder` API is down, does the Gateway instantly catch the 502 error and automatically route the exact same payload to `Claude-3.5-Sonnet`?

### B. OpenRouter Advanced Routing Parameters
OpenRouter allows deep control over its internal arbitrage. We must construct a matrix testing these explicit properties in the JSON payload:
*   `models`: Sending an array of strings (e.g., `["anthropic/claude-3-haiku", "google/gemini-flash"]`) to force immediate internal fallback on failure.
*   `provider.order`: Explicitly ranking data-center providers based on historical latency.
*   `provider.quantized`: Testing the performance hit of allowing budget/quantized models versus forcing full-precision floats.
*   `provider.data_collection`: Ensuring secure/private tasks enforce `deny: true` for data logging.
*   `route`: Testing `fallback` (sequential retry) vs `parallel` (send to all, fastest response wins).

### C. Tiered Gateway Profiles (The Demand)
We must establish distinct programmatic profiles that Zap-Claw's internal systems can call depending on their specific budget and reasoning requirements.

1.  **TIER 0 - FREE/SCRAPING:** Uncached, unstructured background tasks. (Target Cost: $0.00. Target Models: `google/gemini-2.0-flash-exp:free`, `meta-llama/llama-3-8b-instruct:free`).
2.  **TIER 1 - BUDGET (BACKGROUND LOOPS):** Fast, heavily repeated tasks like the Ralph Loop extraction. (Target Cost: $\le $0.15/1M. Target Models: `google/gemini-2.5-flash`, `anthropic/claude-3-haiku`).
3.  **TIER 2 - HEAVY (FOREGROUND AGENT):** Deep context reasoning, the primary user interface. (Target Cost: standard. Target Models: `anthropic/claude-3.5-sonnet`, `openai/gpt-4o`).
4.  **TIER 3 - EXPENSIVE (archITECT/REVIEW):** Maximum precision, zero-shot complex blueprinting. (Target Cost: premium. Target Models: `openai/o1`, `openai/o3-mini-high`).

## 4. Testing Hypothesis & Methodology
**Hypothesis:** If we configure a dynamic multi-tier Gateway that utilizes OpenRouter's parallel routing and native SDK fallbacks, we can drop the average token cost of foreground operations while completely preventing 500/502 API outages.

**Methodology:**
1. Secure the missing OEM API keys (Google Native, Anthropic Native).
2. Rewrite `src/gateway.ts` to implement the OpenRouter Custom Routing JSON object.
3. Build a test script (`arbitrage_test.ts`) that runs 500 simultaneous requests against different profiles (Tier 0, 1, 2) and records the lowest latency/cost combination.

## 5. Arbitrage Matrices (User Defined)

### A. Core Routing Target Matrix

| Variable | Local Edge (Mac Mini) | Google Pro (Project A/B) | Google Ultra (Premium) |
| :--- | :--- | :--- | :--- |
| Model | Qwen3-8B / Kimi 2.5 | Gemini 3 Flash | Gemini 3.1 Pro / Deep Think |
| Primary Goal | Zero-cost extraction (Ralph Loop) | High-speed structured tagging | Architectural Oversight |
| Rate Limit Test | Infinite (Hardware bound) | Standard Tier (Audit 502s) | Ultra Tier (Max Throughput) |
| Credit Burn | $0 (Electricity only) | Use $10/mo Credits | Use $100/mo Credits |

### B. Execution Variables & Objectives

| Test Case | Mode | Target Metric | Expected Outcome |
| :--- | :--- | :--- | :--- |
| Ralph Loop Efficiency | Instant (Kimi 2.5) | Extraction Latency | ≤1500ms (Ultra-fast) |
| Complex Logic Audit | Thinking (Qwen3) | Reasoning Accuracy | Better handling of nested logic. |
| Arbitrage Fallback | Hybrid | 502 Recovery | Pro fails → Route to Local. |
| HIDR Stress | Thinking | Security | "Does reasoning detect ""hidden"" injections?" |

### C. HIDR & Reasoning Baseline Matrix

| Model Tier | Injection Type | Success Metric | Variable to Watch |
| :--- | :--- | :--- | :--- |
| Local (Qwen3-8B) | Polyglot (Code + Text) | Extraction Purity | Does local MoE leak system rules? |
| Pro (Flash) | Prompt Leaking | Sandbox Integrity | Does <user_data> stay isolated? |
| Ultra (Deep Think) | Long-context manipulation | State Persistence | "Does the 1M+ window cause ""forgetting""?" |

## 6. Hardware Benchmarking & Planned Tests

### Hardware Benchmarking: The Mac Mini Variable
Given execution on standard hardware (e.g., Mac Mini M2/M4), the primary bottleneck is Unified Memory (RAM).
*   **Test Variable:** Parallelism.
*   **The Scenario:** Run a Ralph Loop on Kimi 2.5 while simultaneously running a UI layout task on Qwen 3.8.
*   **Measurement:** Measure Tokens Per Second (TPS) degradation. If TPS drops below 15, the Arbitrage Matrix should automatically switch the "Ralph Loop" to the Google Pro account to save local resources.

### 🧪 Suggested First Test: "The Credit Squeeze"
An Economic Resilience Test to validate the fallback mechanism.

1.  **Configure:** Zap-Claw to use Google Pro (Project A) as the primary.
2.  **Execute:** Programmatically saturate the rate limit until you hit a `429 Too Many Requests`.
3.  **Audit:** Verify if the Arbitrage Matrix shifts to Ollama (Local) or Google Ultra *without* losing state in MongoDB.
