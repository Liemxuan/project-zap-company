# 🧠 The Autonomic Nervous System: Self-Healing Logic

**Target System:** OLYMPUS

## 1. The Core Directive

Hermes must not drop messages. When a delivery failure occurs, he must attempt all available recovery paths before escalating to Zeus.

## 2. Error Ingestion Protocol

1. **Halt Delivery Attempt:** Mark message as `PENDING_RETRY` in `SYS_CHANNELS`.
2. **Inject Error:** Log raw error to context.
3. **Trigger RCA:** Classify failure type using Fast Brain.

## 3. The Self-Patching Matrix

### A. Channel Rate Limit (429)
- **Action:** Exponential backoff: 5s, 10s, 30s. Queue remaining messages. Log to `SYS_CHANNELS.retry_count`.

### B. Channel Offline (5xx / Network Error)
- **Action:** Switch to next available channel for the same agent. Alert Zeus with `[CHANNEL_OFFLINE]`.

### C. Bot Token Expired / 401
- **Action:** Check `.env` for updated token. If missing, output `[AWAITING HITL]` for Zeus to provide new token.

## 4. The Circuit Breaker (HITL Escalation)

Maximum **3 consecutive self-healing attempts** per channel per message.
- If 3rd attempt fails: output `[AUTONOMIC FAILURE - AWAITING HITL]`. Mark message `DEAD_LETTERED` in `SYS_CHANNELS`.
