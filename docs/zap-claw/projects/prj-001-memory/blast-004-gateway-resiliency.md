# B.L.A.S.T. Discovery: API Gateway Resiliency & Multi-Turn Fallbacks

## Overview
During the execution of **prj-001-memory**, a critical vulnerability was discovered in the Gateway Arbitrage layer. When OpenRouter API limits were reached (e.g., `403 Credit Limit`), the fallback mechanism to Google's Native Gemini API successfully caught the error but failed to preserve the conversation's state. This resulted in "Amnesia" and silent crashes (`finish_reason: undefined`), destroying the user's conversational context and triggering an infinite loop of broken tool calls.

This document formalizes the solution discovered through trial and error, ensuring future Gateway expansions adhere to strict LLM interoperability standards.

---

## 1. Blueprint (The Problem)

**The Symptoms:**
1. The bot fell back to Google Gemini successfully, but replied with `(no response)` or generic amnesiac answers like "Who are you?" despite knowing the user's name earlier in the conversation.
2. The bot hit `MAX_ITERATIONS` circuit breakers inside `AgentLoop.run()` and responded with exactly: `I hit a processing limit.`
3. Native LLM tool calls (`memory_recall`, `memory_remember`) silently failed during fallbacks.

**The Root Causes:**
* **Payload Truncation:** The Arbitrage adapter (`src/arbitrage.ts`) only forwarded the *latest* stringified user message to the fallback model, intentionally dropping the entire `requestPayload.messages` array and the `requestPayload.tools` schema block.
* **Proprietary Schema Crashes:** Blindly forwarding the full OpenAI payload caused HTTP 400 Bad Requests on the Google API because OpenRouter injects proprietary routing tags (`models`, `provider`, `route`) into the TS schema, which Google rejects. 
* **Database Serialization Corruption:** When tools were invoked, `src/history.ts` prefixed the primitive SQLite `content` blob with `[Tool: {JSON...}]`. However, when extracting the context tree later, it NEVER un-parsed this prefix. This injected heavily corrupted conversation text back into the LLM, violently breaking multi-turn tool logic for strict APIs like Gemini.

---

## 2. Link (The architecture Patch)

**A. Strict Payload Sanitization (`src/arbitrage.ts`)**
Instead of manually rebuilding prompts or dropping history, the Arbitrage core was refactored to seamlessly port the OpenAI spec natively into Google's Compatibility Endpoint, provided that OpenRouter tags are mathematically stripped first:
```typescript
const { models, provider, route, ...sanitizedPayload } = requestPayload;

completion = await googleFallbackClient.chat.completions.create({
    ...sanitizedPayload, // <== Full Context + Full Tools + Inherited Temperature
    model: nativeModel
});
```

**B. Finish Reason Normalization (`src/arbitrage.ts`)**
Google Gemini's endpoint occasionally omits strict `finish_reason` declarations when firing tools. Normalization logic was added to natively coerce it back to standard OpenAI `tool_calls` vs `stop` paradigms:
```typescript
if (completion.choices[0].message?.tool_calls?.length) {
    completion.choices[0].finish_reason = "tool_calls";
}
```

**C. Database Payload Inverse-Parsing (`src/history.ts`)**
The `getHistory()` function was fundamentally overhauled to use rigorous RegEx matching. It now actively searches for `[Tool: ___]` prefixes and safely unpacks them back into native `msg.tool_calls` objects, perfectly restoring the conversational state regardless of the underlying database abstraction.

---

## 3. Architect & Stylize (Validation via Trial and Error)

To bypass the need for constant manual Telegram intervention from the user, an automated internal harness (`test_agent.ts`) was constructed to programmatically ping the `AgentLoop.run()` via the master User ID. 

**Trial Output Log:**
```
[TEST] Simulating user message: "what is my name"
[arbitrage] OpenRouter failed with 403. Triggering Native Google Fallback...
[agent] Selected model: gemini-2.5-pro via google-native
[tool] recall { query: 'my name' }
[tool result] recall: No matching memories found.
[arbitrage] OpenRouter failed with 403. Triggering Native Google Fallback...
[agent] Selected model: gemini-2.5-pro via google-native
Bot Response: I don't believe you've told me your name yet...
```
**Conclusion:** The test proved a flawless multi-turn failover! Google Gemini inherited the history, discovered the tools, recognized it didn't know the name, fired the `recall` protocol locally against SQLite/MongoDB, gracefully ingested the `No memories found` tool-response loop back through Google, and finalized the answer.

---

## 4. Trigger (Standardization)

Going forward, **ALL** external models added to Zap-Claw (whether local ollama, Anthropic API, or alternative wrappers) MUST abide by this B.L.A.S.T Standard Protocol:
1. Always inherit the generic OpenAI `requestPayload`. Let the native SDKs handle translations.
2. Always actively sanitize proprietary networking definitions (`model, route, provider, system_pr`) before injecting them into a sibling provider.
3. Database serialization for custom tool strings must always ensure strict, reversible inverse-parsing constraints.
