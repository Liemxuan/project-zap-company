# architecture Notes — OpenClaw → ZAP Claw

## Purpose

Document what we're carrying over from OpenClaw and what we're skipping, with rationale.

---

## ✅ Carrying Over (Adapt for ZAP Claw)

| Concept | Source | Notes |
| --- | --- | --- |
| Agent tool loop | OpenClaw core | Already implemented in Level 1 |
| Memory/recall pattern | OpenClaw memory | Target for Level 2 |
| Session logging | OpenClaw sessions | Adapt for Telegram context |
| Skill architecture | OpenClaw skills | Inform our `.agent/skills/` structure |

## ❌ Skipping

| Concept | Reason |
| --- | --- |
| Desktop app UI | ZAP Claw is Telegram-first, no desktop UI |
| Extension system | Too complex for current stage; revisit at Level 4 |
| Browser integrations | Not relevant for Telegram bot |

## ❓ To Evaluate (Level 2+)

| Concept | When | Decision Needed |
| --- | --- | --- |
| FTS5 vs OpenClaw search | Level 2 | Which search approach fits Telegram UX |
| Skill creator tool | Level 4 | Adapt OpenClaw's skill-creator for ZAP ecosystem |
| MCP bridge | Level 4 | Use OpenClaw's mcporter as reference |

---
