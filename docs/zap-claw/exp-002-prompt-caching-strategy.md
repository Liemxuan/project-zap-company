# EXP-002: Prompt Caching & Omni-Channel Optimization Matrix

## The Core Philosophy
Prompt Caching is the single most critical mechanism for reducing latency and token expenditure in agentic AI. 
If the API receives a request where the initial thousands of tokens (the "prefix") exactly match a recent request, it skips processing them, yielding near-instant time-to-first-token (TTFT) and an massive reduction in input costs.

## The 7 Immutable Rules of Caching
1. **Structure in Layers:** Static -> Dynamic. (System Instructions -> Tools -> KB Context -> Session State -> Conversation).
2. **Immutable System Prompt:** Never inject dynamic data (time, user profile changes) mid-session into the System Prompt.
3. **Static Toolsets:** Declare all tools at the start. Adding/removing a tool mid-conversation invalidates the entire cache tree.
4. **Stateless Modes:** Do not swap system prompts to change agent modes (e.g., exploration vs execution). Inject a state message instead to instruct the model of the mode change.
5. **Model Continuity:** Do not switch to a cheaper/faster model for an inline subtask (it has no cache!). Spawn a separate subagent or use the same model to achieve 100% cache hits.
6. **Parent-Child Inheritance:** For side operations (summarizing, compacting), send the exact same parent system prompt, tools, and history, and simply append the new instruction at the end.
7. **Monitor Hit Rates:** Treat a cache miss as a severe system incident. Alert on regressions.

---

## ZAP Claw's Current Vulnerabilities

By auditing our current ZAP Claw engine against these 7 rules, we have identified several critical architectural flaws that act as "cache breakers." We will fix these in the upcoming Telegram B.L.A.S.T session.

### Vulnerability 1: The `serialized_lane.ts` System Prompt Mutation
**The Flaw:** Currently, `src/runtime/serialized_lane.ts` injects the dynamic current time and the user's `[LONG-TERM MEMORY CONTEXT]` (pulled from MongoDB) directly into the hardcoded System Prompt string (`src/system_prompt.ts`). Because the time changes every second, and memory changes every turn, the System Prompt is never static. **Our cache hit rate is mathematically 0%.**
**The Fix:** 
* Freeze `system_prompt.ts` to only contain immutable logic. 
* Inject time, user ID, and MongoDB memory as a distinct `{"role": "user", "content": "<state_injection>..."}` message inserted right before the actual chat history array.

### Vulnerability 2: The `memory_compactor.ts` Model Swap
**The Flaw (Rule 5 & 6):** Our Phase 9 cron worker sweeps the database and uses `gemini-2.5-flash` to summarize conversations originally held by `gemini-2.5-pro`. It also uses a completely different, shortened prompt just for summarizing. This completely wastes the massive cached context the `pro` model acquired during the conversation.
**The Fix:** When compacting, the compactor should send the *exact* original `pro` prompt and full history array, appending a final system instruction: `"Summarize the above conversation into a [COMPACTED_SUMMARY] metadata block."` This executes near-instantly because it pulls from the massive `pro` cache.

### Vulnerability 3: The Arbitrage Matrix Conflict
**The Flaw:** `executeWithArbitrage` routes from Claude 3.5 Sonnet to GPT-4o to DeepSeek upon API failures. 
**The Assessment:** This is an unavoidable cache breaker. Different models cannot share caches. However, Arbitrage is an emergency fallback strategy. We must monitor our Cache Hit Rate on the primary model (e.g., Claude 3.5 or Gemini 2.5) and only accept the 0% cache hit when the primary provider suffers a catastrophic outage.

## The Next B.L.A.S.T. Scope
In our upcoming Telegram Omni-Channel session, our first refactoring target will be severing the dynamic state away from the static system prompts to achieve a **>90% Prompt Cache Hit Rate**, paving the way for hyper-scale B2C handling.
