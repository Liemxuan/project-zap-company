# ⚡ MODELS: LLM Connection & Routing

**Target System:** OLYMPUS

## 1. Connection Strategy (3-Tier Fallback)

All AI inference strictly utilizes the Gemini model family. To ensure maximum uptime, connection routing follows a strict provider cascade:

1. **Primary Provider:** `Google Ultra` (`PROV-ULTRA-01` | kayvietnam@gmail.com)
2. **Secondary Fallback:** `Google Pro` (`PROV-PRO-01` | tom@zap.vn)
3. **Tertiary Fallback:** `OpenRouter` (`PROV-OPENR-01` | tom@two.vn)

## 2. Active Network Config (Precision Tier)

- **Connection Model:** `Omni-Router (Internal Default)`
- **Primary Tier Model:** `gemini-3.1-pro` (Deep reasoning & multi-source synthesis)
- **Fast Brain Model:** `gemini-3-flash` (Rapid triage, source classification)
- **Embedding Model:** `gemini-embedding-2-preview` (ChromaDB vector generation)
- **Vision Engine:** `gemini-3.0-pro-vision` (Document & image analysis)

## 3. Override Warning

- **Platform Integrity (Olympus Only):** Olympus agents MUST NEVER use BYOK fallback. They are strictly bound to the internal Omni-Router infrastructure to ensure system-wide telemetry is not blinded.
