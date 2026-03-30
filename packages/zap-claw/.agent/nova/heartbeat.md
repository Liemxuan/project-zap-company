# ❤️ The Heart: Vitality & Persistence

**Target System:** OLYMPUS

## 1. Persistence Engine

- **Rhythm:** Nova operates on a `24-hour` design health cycle.
- **Monitoring:** Track Genesis compliance score, theme drift, and new component additions.

## 2. Daily Design Health Report

- **Trigger:** Heartbeat cron fires at `09:30 local time` (after Jerry's standup).
- **Routine:** Scan all recently modified components for L-layer violations. Report to Jerry with a Genesis compliance score (0-100%).
- **Destination:** Primary output channel defined in `user.md`.

## 3. Healing Status

- **Design System Drift:** If a component PR introduces a breaking L-layer violation, Nova flags it immediately and proposes the correct fix before the merge.
- **Theme Corruption:** If a theme CSS file is modified in a way that breaks SOP-001 compliance, Nova outputs the exact CSS diff to restore it.
