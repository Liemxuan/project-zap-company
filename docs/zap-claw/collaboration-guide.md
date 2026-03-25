# ZAP Olympus - Collaboration Guide

**Team:** Vietnam / US
**Last Sync:** Phase 2 - HUD Integration

## 🚀 Recent architecture Updates

1. **ZAP Design Engine (ZDE) Initialization:**
   - The master vertical and horizontal Neo-Brutalist dashboards have been fully built in Next.js.
   - 7-Level abstraction pattern (From Global CSS to Page/App level).
   - Metronic components have been completely stripped and mapped to our Neo-Brutalist design tokens.

2. **Agent / HUD Gateway (Zap-Claw):**
   - We integrated an **AI Command Bar** directly into the ZAP UI (`MasterVerticalShell.tsx`).
   - Hitting `Enter` in the frontend sends a cross-origin `POST /api/hud/chat` request to the Zap-Claw server on `localhost:8000`.
   - The payload passes `activePage: pathname` so Agents automatically understand UI context.
   - Re-enabled CORS on the Zap-Claw express API.

3. **Agent Role Refinements:**
   - **Jerry (Chief of Staff):** Fully connected to Omni-Router, handling HTTP HUD requests and Telegram webhook requests.
   - **Spike (Analyst) & Tommy:** Internal memory alignment updated. `tommy` directory replaced with `spike`.

## 🏗 Setup & Running the Environment

### 1. The Design Context (Next.js)

```bash
cd /Users/zap/Workspace/zap-design
npm run dev # Starts on localhost:3000
```

### 2. The Gateway (Zap-Claw)

```bash
cd /Users/zap/Workspace/zap-claw
PORT=8000 npm run gateway # Starts the Omni-channel API HTTP gateway
```

*Note: The HUD requires Zap-Claw running on PORT 8000 or it will throw an unreachable error to the UI.*

## 🛣️ Next Steps / Handoff

- Expand Agent specific action pipelines. Currently the HUD relies solely on general LLM chat. We need to tie agent 'Tools' natively to Next.js UI states.
- Re-check database indexing on the MongoDB Atlas `SYS_OS_users` table to ensure scalability as traffic expands from internal tools to cross-origin integrations.
