<!-- 
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: HUD-MM2QCK2X-3300
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->

# ⚡ MODELS: LLM Connection & Routing

**Target System:** OLYMPUS

## 1. Connection Strategy (3-Tier Fallback)

All AI inference strictly utilizes the Gemini model family. To ensure maximum uptime, connection routing follows a strict provider cascade:

1. **Primary Provider:** `Google Ultra` (`PROV-ULTRA-01` | <kayvietnam@gmail.com>)
2. **Secondary Fallback:** `Google Pro` (`PROV-PRO-01` | <tom@zap.vn>)
3. **Tertiary Fallback:** `OpenRouter` (`PROV-OPENR-01` | <tom@two.vn>)

## 2. Active Network Config (The Strategist)

- **Connection Model:** `Omni-Router (Internal Default)`
- **Primary Tier Model:** `gemini-3.1-pro` (Deep Brain - SOTA)
- **Fallback Engine:** `gemini-3.0-pro`
- **Background Engine:** `gemini-deep-research-pro-preview` (Used exclusively for multi-hour architectural validation and market scraping)

## 3. Override Warning

- **Platform Integrity (Olympus Only):** Olympus agents MUST NEVER use BYOK fallback. They are strictly bound to the internal Omni-Router infrastructure to ensure system-wide telemetry is not blinded.
