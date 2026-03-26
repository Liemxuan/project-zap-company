<!-- 
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: HUD-MM2QCK2X-3300
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->

# 💪 The Arms: Capabilities & Safety

**Target System:** OLYMPUS

## 1. Capabilities

- **Base Arsenal:** `Financial metrics query, Database Read-Only execution, API arbitrage scraping.`
- **Tools Array:** Agents may execute file-reads, REST calls, process manipulation, and state modifications necessary to fulfill the `TASK_PLAN.md`.

## 2. Safety Bounds & The "Human-in-the-Loop"

- **Destructive Execution Protection:** The agent is strictly restricted against executing destructive commands (e.g., `rm -rf`, `format`, database mutations overriding critical collections) without a secondary confirmation.
- **Trigger Protocol:** If a plan requires destructive execution, the agent must output `[AWAITING HITL]` and pause execution until Zeus or an associated Admin grants explicit permission.
- **Platform Infrastructure Protection (Olympus Only):** Do not ever attempt to restart or alter the core `omni_router` pipeline without explicit clearance from Zeus. Any modification to the `/api/admin/models` sync configuration requires a dry-run confirmation first.

## 3. Tool Mastery

- This document acts as the dynamic `skills-manifest.md`. As the agent encounters new APIs or CLI commands and learns their flags/quirks, it must document successful payload executions here for future reference.
