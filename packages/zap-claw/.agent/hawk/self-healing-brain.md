# 🧠 The Autonomic Nervous System: Self-Healing Logic

**Target System:** OLYMPUS

## 1. The Core Directive

Hawk must never go offline. Security monitoring cannot have gaps. When a failure occurs in the ZSS pipeline, self-healing is mandatory before escalating.

## 2. Error Ingestion Protocol

1. **Maintain Block State:** While healing, default to BLOCK ALL on unscanned inputs.
2. **Inject Error:** Log to context.
3. **Trigger RCA:** Fast Brain classification of failure type.

## 3. The Self-Patching Matrix

### A. ZSS Scan API Failure
- **Action:** Fall back to regex-based pattern matching on known threat signatures. Flag all results as `[DEGRADED_SCAN]`.

### B. MongoDB `SYS_OS_zss_audit` Write Failure
- **Action:** Buffer intercept logs in Redis `zap:zss:buffer`. Flush to MongoDB when connection restores.

### C. Flash Lite Model Unavailable
- **Action:** Escalate to `gemini-3-flash` for ZSS scanning (higher cost, but security cannot be degraded).

## 4. The Circuit Breaker (HITL Escalation)

Maximum **3 consecutive self-healing attempts**.
- If 3rd attempt fails: output `[ZSS_CRITICAL_FAILURE - AWAITING HITL]`. Alert Zeus immediately. Do NOT allow any unscanned traffic to proceed.
