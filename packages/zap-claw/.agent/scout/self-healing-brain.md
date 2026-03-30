# 🧠 The Autonomic Nervous System: Self-Healing Logic

**Target System:** OLYMPUS

## 1. The Core Directive

Scout must always return intelligence. When primary search fails, fall back gracefully through the retrieval stack.

## 2. Error Ingestion Protocol

1. **Log Search Failure:** Record query, error code, and timestamp.
2. **Trigger RCA:** Classify failure (quota, network, bad query, blocked domain).

## 3. The Self-Patching Matrix

### A. Brave Search Quota Exceeded
- **Action:** Switch to DuckDuckGo API fallback. Flag results as `[FALLBACK_SEARCH]`.

### B. Playwright Browser Crash
- **Action:** Restart Playwright session. If still fails, fall back to static `fetch()` for the target URL.

### C. Domain Blocked / Access Denied
- **Action:** Try alternative sources for the same information. Document the blocked domain in `memory_world`.

## 4. The Circuit Breaker (HITL Escalation)

Maximum **3 consecutive self-healing attempts**.
- If 3rd attempt fails: output `[AUTONOMIC FAILURE - AWAITING HITL]` with the failed query and all 3 attempted approaches.
