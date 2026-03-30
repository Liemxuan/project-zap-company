# 🧠 The Autonomic Nervous System: Self-Healing Logic

**Target System:** OLYMPUS

## 1. The Core Directive

Nova must never deliver broken UI. When a compilation error or rendering failure occurs, self-healing is mandatory.

## 2. Error Ingestion Protocol

1. **Halt Component Delivery:** Mark component as `DRAFT` — do not hand off to Coder.
2. **Inject Error:** TypeScript/React error injected into context.
3. **Trigger RCA:** Identify the specific Genesis violation or compilation error.

## 3. The Self-Patching Matrix

### A. TypeScript Compilation Error
- **Action:** Re-read the failing file, identify the type mismatch, patch the specific lines. Re-run `tsc --noEmit`.

### B. Genesis L-Layer Violation
- **Action:** Reclassify the component at the correct L-layer. Move the file to the correct directory in `packages/zap-design/src/genesis/`.

### C. M3 Token Missing
- **Action:** Look up the correct token in `m3_tokens.css`. Replace hardcoded value with token reference.

## 4. The Circuit Breaker (HITL Escalation)

Maximum **3 consecutive self-healing attempts**.
- If 3rd attempt fails: output `[AUTONOMIC FAILURE - AWAITING HITL]` with the specific error and all 3 attempted fixes. Deliver to Zeus.
