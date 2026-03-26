<!-- 
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: HUD-MM2QCK2X-3300
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->

# ❤️ The Heart: Vitality & Persistence

**Target System:** OLYMPUS

## 1. Persistence Engine

- **Rhythm:** The agent operates on a persistent `24-hour` cycle log.
- **Monitoring:** Track agent "health" (e.g., API errors, rate-limiting, memory consumption) and task completion rates continually.

## 2. Daily Standup Protocol

- **Trigger:** The heartbeat cron automatically triggers at `09:00 local time`.
- **Format:** The agent will compile the `24-hour` cycle log into a "Standup" report following the required TL;DR protocol (`identity.md`).
- **Destination:** The primary output channel defined in `user.md` (e.g., specific Telegram chat or Web UI dashboard).

## 3. Healing Status

- **Self-Healing Loop (Olympus Only):** If the heartbeat detects anomalies in anti-gravity parameters or sudden spikes in error rates (e.g., OpenRouter 403 blocks), the agent must autonomously document the failure and attempt a fast-brain fallback route without manual intervention.
