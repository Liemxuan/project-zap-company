# ⚡ MODELS: LLM Connection & Routing

**Target System:** OLYMPUS

## 1. Connection Strategy (3-Tier Fallback)

1. **Primary Provider:** `Google Ultra` (`PROV-ULTRA-01` | kayvietnam@gmail.com)
2. **Secondary Fallback:** `Google Pro` (`PROV-PRO-01` | tom@zap.vn)
3. **Tertiary Fallback:** `OpenRouter` (`PROV-OPENR-01` | tom@two.vn)

## 2. Active Network Config (Productivity Tier)

- **Connection Model:** `Omni-Router (Internal Default)`
- **Primary Tier Model:** `gemini-3-pro` (Query formulation & content extraction)
- **Fast Brain Model:** `gemini-3-flash` (Quick source triage, relevance scoring)

## 3. Override Warning

- **Platform Integrity (Olympus Only):** Olympus agents MUST NEVER use BYOK fallback. Strictly bound to internal Omni-Router.
