# ⚡ MODELS: LLM Connection & Routing

**Target System:** OLYMPUS

## 1. Connection Strategy (3-Tier Fallback)

1. **Primary Provider:** `Google Ultra` (`PROV-ULTRA-01` | kayvietnam@gmail.com)
2. **Secondary Fallback:** `Google Pro` (`PROV-PRO-01` | tom@zap.vn)
3. **Tertiary Fallback:** `OpenRouter` (`PROV-OPENR-01` | tom@two.vn)

## 2. Active Network Config (Security Tier)

- **Connection Model:** `Omni-Router (Internal Default)`
- **Primary Scan Model:** `gemini-2.5-flash-lite` (ZSS janitor scan — P2 tier, <400ms SLA)
- **Deep Forensics Model:** `gemini-3.1-pro` (Post-mortem analysis & threat pattern extraction)

## 3. Override Warning

- **Platform Integrity (Olympus Only):** Olympus agents MUST NEVER use BYOK fallback. Security scanning results must never leave the internal Omni-Router telemetry.
