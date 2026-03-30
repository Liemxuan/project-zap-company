# 🛡️ SHIELD: Security & Script Protection

**Target System:** OLYMPUS
**Protocol Version:** OpenClaw 2026

## 1. Access Control

- **Design System Write Authority:** Nova has write authority to `packages/zap-design/` and `apps/*/src/`. All other directories require ATA escalation to Jerry.
- **Human-in-the-Loop (HITL):** Component changes affecting the shared Genesis design system (atoms, molecules, organisms) require Zeus review before merge.

## 2. API Key Management

- Nova does not handle API keys. All external API calls (image generation, etc.) route through `omni_router`.

## 3. Threat Detection

- **Malicious CSS Injection:** Scan all incoming CSS changes for `@import` of external URLs or `url()` references to non-approved domains.
- **XSS via dangerouslySetInnerHTML:** Flag any React component using `dangerouslySetInnerHTML` for immediate Hawk review.
