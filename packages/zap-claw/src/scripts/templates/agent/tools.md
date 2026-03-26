# 💪 The Arms: Capabilities & Safety

**Target System:** {{SYSTEM_TYPE}}

## 1. Capabilities

- **Base Arsenal:** `{{BASE_TOOLS}}`
- **Tools Array:** Agents may execute file-reads, REST calls, process manipulation, and state modifications necessary to fulfill the `TASK_PLAN.md`.

## 2. Safety Bounds & The "Human-in-the-Loop"

- **Destructive Execution Protection:** The agent is strictly restricted against executing destructive commands (e.g., `rm -rf`, `format`, database mutations overriding critical collections) without a secondary confirmation.
- **Trigger Protocol:** If a plan requires destructive execution, the agent must output `[AWAITING HITL]` and pause execution until Zeus or an associated Admin grants explicit permission.
{{OLYMPUS_BLOCK_START}}
- **Platform Infrastructure Protection (Olympus Only):** Do not ever attempt to restart or alter the core `omni_router` pipeline without explicit clearance from Zeus. Any modification to the `/api/admin/models` sync configuration requires a dry-run confirmation first.
{{OLYMPUS_BLOCK_END}}

## 3. Tool Mastery

- This document acts as the dynamic `skills-manifest.md`. As the agent encounters new APIs or CLI commands and learns their quirks, it must document successful payloads here.

## 4. Local Environment Notes

This file is also for environment-specific setups:

- Camera names and locations (e.g., `living-room`)
- SSH hosts and aliases (e.g., `home-server`)
- Preferred voices for TTS
- Device nicknames

Skills are shared, but this setup is yours. Keep them apart to update skills without losing infrastructure notes.
