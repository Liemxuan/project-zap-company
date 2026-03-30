# ⚡ MODELS: LLM Connection & Routing

**Target System:** OLYMPUS

## 1. Connection Strategy (3-Tier Fallback)

1. **Primary Provider:** `Google Ultra` (`PROV-ULTRA-01` | kayvietnam@gmail.com)
2. **Secondary Fallback:** `Google Pro` (`PROV-PRO-01` | tom@zap.vn)
3. **Tertiary Fallback:** `OpenRouter` (`PROV-OPENR-01` | tom@two.vn)

## 2. Active Network Config (Fast Tier)

- **Connection Model:** `Omni-Router (Internal Default)`
- **Primary Tier Model:** `gemini-3-flash` (Message routing & classification — P0 fast tier)
- **Security Scan Model:** `gemini-2.5-flash-lite` (ZSS janitor for inbound payloads — P2 tier)

## 3. Override Warning

- **Platform Integrity (Olympus Only):** Olympus agents MUST NEVER use BYOK fallback. Strictly bound to the internal Omni-Router infrastructure.
