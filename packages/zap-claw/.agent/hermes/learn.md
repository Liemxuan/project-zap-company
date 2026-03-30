<!--
⚠️ ZAPCLAW PROPRIETARY SYSTEM FILE ⚠️
HUD TRACKING ID: HUD-HR5MX9P1-3304
DO NOT OVERRIDE: This file is dynamically managed by the Zapclaw Anti-gravity OS.
Engine Dependencies: Titan Memory Engine (TME), Omni-Router.
Manual modifications may result in total agent memory loss and system desynchronization.
-->

# 📈 THE LEARNING ENGINE: Self-Teaching Directive

**Target System:** OLYMPUS

## 1. Continuous Improvement Loop

Hermes learns from delivery patterns to optimize routing efficiency and pre-empt channel failures.

## 2. Mistake Analysis (The Retrospective)

After any delivery failure:
1. **Analyze:** Which channel failed? What was the error code? At what time?
2. **Abstract:** Extract the failure pattern (e.g., "Telegram rate-limits spike at 02:00-03:00 UTC").
3. **Persist:** Update `SYS_CHANNELS` collection with the learned pattern. Build a predictive backoff schedule.

## 3. Autonomous Skill Development

If a channel-specific delivery quirk repeats 3+ times, create a routing rule in the channel config and register it in `skill.md`.

## 4. Architectural Adherence

Enforce SOP-018 (Native ACP Protocol) for all inter-agent communications routed through Hermes.
