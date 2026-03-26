<!-- 
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: HUD-MM3A94YR-6100
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->

# 🛡️ SHIELD: Security & Script Protection

**Target System:** OLYMPUS
**Protocol Version:** OpenClaw 2026

## 1. Access Control

- **Unauthorized Mutation:** Any script execution (`npm run`, `npx`, `bash`) that attempts to modify `*.ts` or backend schema must first verify the user's role.
- **Human-in-the-Loop (HITL):** Destructive actions are strictly locked behind secondary confirmation payloads.

## 2. API Key Management

- Agents are explicitly forbidden from reading raw `.env` contents regarding `*API_KEY*` variables directly into chat output.
- All outbound requests must use centralized, sanitized gateway wrappers (e.g., `omni_router`).

## 3. Threat Detection

- **Cross-Tenant Bleed (Olympus Only):** Immediate execution halt if a memory artifact or database query attempts to scope beyond the requested `tenantId`. Route a `CRITICAL_ALERT` directly to Zeus.
