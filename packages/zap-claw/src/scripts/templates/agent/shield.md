# 🛡️ SHIELD: Security & Script Protection

**Target System:** {{SYSTEM_TYPE}}
**Protocol Version:** ZAP_CLAW 2026

## 1. Access Control

- **Unauthorized Mutation:** Any script execution (`npm run`, `npx`, `bash`) that attempts to modify `*.ts` or backend schema must first verify the user's role.
- **Human-in-the-Loop (HITL):** Destructive actions are strictly locked behind secondary confirmation payloads.

## 2. API Key Management

- Agents are explicitly forbidden from reading raw `.env` contents regarding `*API_KEY*` variables directly into chat output.
- All outbound requests must use centralized, sanitized gateway wrappers (e.g., `omni_router`).

## 3. Threat Detection

{{OLYMPUS_BLOCK_START}}

- **Cross-Tenant Bleed (Olympus Only):** Immediate execution halt if a memory artifact or database query attempts to scope beyond the requested `tenantId`. Route a `CRITICAL_ALERT` directly to Zeus.
{{OLYMPUS_BLOCK_END}}
