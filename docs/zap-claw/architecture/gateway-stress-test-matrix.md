# PRJ-007: Gateway Stress Test Matrix
**Objective:** Formally benchmark the Gateway Arbitrage routing architecture for prolonged uptime, caching deadlocks, and dynamic Key/OEM swapping. The goal is to gather hard data over a 1-2 hour sustained run.

---

## 1. The Core Questions
To ensure the Zap-Claw Gateway does not suffer from locked state, cached routing bugs, or silent crashing (issues prevalent in older OpenClaw versions), we must answer:
1. **Aggregator vs. Native (OEM):** How does OpenRouter (`openrouter/auto`, or specific fallback arrays) compare against hitting Google Ultra/Pro or Anthropic directly in terms of latency, token cost, and strict rate limits (RPM/TPM)?
2. **Hot-Swapping Durability:** If a primary API key or provider is revoked/rate-limited mid-loop, can the Gateway swap to a secondary OEM key (e.g., from OpenRouter to Native Google) without restarting the Node process or locking up?
3. **Concurrency & Deadlocks:** If a heavy foreground reasoning task (Tier 3) runs concurrently with 50 background Ralph Loop scraping tasks (Tier 1), does the standard HTTP connection pool lock up or cache the wrong headers?
4. **Resiliency over Time:** Can the Gateway sustain a continuous 1-2 hour simulated prompt storm without memory leaks or zombie processes dropping the connection entirely?

---

## 2. Experimental Variables & Scenarios

### A. The Endpoints (Keys & Providers)
*   `OPENROUTER_API_KEY` (Our current 4-tier aggregator strategy)
*   `GOOGLE_API_KEY` (Native GCP/Studio - testing Gemini Flash vs Pro/Ultra tiers)
*   `ANTHROPIC_API_KEY` (Native Console - testing Claude Haiku vs Sonnet)

### B. The Load Profiles (The Prompts)
*   **Profile A (Micro-Bursts):** High volume of highly granular extraction tasks (simulating the stateless Ralph Loop). 100-200 concurrent fast prompt insertions.
*   **Profile B (Heavy Context):** Massive token payloads (75k+ tokens) requiring long time-to-first-token (TTFT). Simulating architectural blueprinting.

### C. The Disturbance Events (Chaos Engineering)
*   **Event 1 (The 429 Wall):** Intentionally exhausting a Tier 0/1 token limit to observe if the `fallback` array actually catches and routes to the paid tier instantly.
*   **Event 2 (The Mid-Run Key Swap):** Altering the `process.env` or Gateway payload dynamically while active requests are in flight.
*   **Event 3 (The Cache Lock):** Sending identical requests rapidly to test if OpenRouter/Native aggressively caches the response, preventing true dynamic generation.

---

## 3. The Execution Plan (The Matrix)

| Test ID | Scenario | Configuration | Expected Outcome | Empirical Metric |
| :--- | :--- | :--- | :--- | :--- |
| **ST-01** | **Baseline Sustained Load** | 1-Hour continuous loop on Tier 1 (OpenRouter Flash). No disturbances. | System completes without memory leaks or API timeouts. | Uptime %, Avg Latency divergence. |
| **ST-02** | **OEM vs Aggregator** | Run identical payloads through OpenRouter Tier 2 vs Native Google Pro. | Identify if OpenRouter adds unacceptable network latency or markup. | Latency Delta (ms), Cost difference ($). |
| **ST-03** | **Dynamic Key Rotation** | Start loop with OpenRouter. On simulated 429 error, gateway hot-swaps to `GOOGLE_API_KEY`. | System catches 429, alters constructor, resumes processing without crashing. | Recovery Time (ms), Process Status. |
| **ST-04** | **Concurrency Deadlock** | Fire 50 Tier 1 requests and 1 Tier 3 request at the exact same millisecond. | All requests resolve independently. No header cross-contamination. | Success Rate (100%), Data Integrity. |

---

## 4. Next Steps
1. Request OEM Keys (Google, Anthropic) from User to configure the Native routes in `src/gateway.ts`.
2. Construct `src/memory/stress_test.ts` to execute this matrix over a prolonged timeframe (1-2 hours).
3. Record the logs, calculate the quantitative data, and use it to formally finalize the API routing architecture.
