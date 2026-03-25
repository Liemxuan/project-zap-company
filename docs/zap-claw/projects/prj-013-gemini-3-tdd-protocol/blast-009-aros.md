# BLAST-009: Agentic Runtime Observability & Stability (AROS)

## "Making Sure It's Done" (MSID) Protocol

## 1. The "Ghost in the Machine" (Root Cause Analysis)

**Why do overlaps happen?**

1. **TSX Worker Orphaning:** `tsx watch` spawns a watcher (parent) and a worker (child). If the watcher is force-killed or crashes, the worker can stay alive as an orphan.
2. **Cumulative Restarts:** If multiple `npm run dev` sessions are started in different terminals/vms, they each spin up a full Swarm (Claw, Tommy, Jerry).
3. **Ghost State:** Orphaned workers keep old memory, old Telegram polling sessions, and old Port 3000 bindings, causing "Port already in use" or "Duplicate update" errors.

**The Fix:** Always use `npm run health` or the `pkill -f tsx` command before starting a new session.

## 2. Process Hygiene (Anti-Zombie)

- **Zero-Overlap Rule:** Only one `tsx watch` or `node` process is allowed per Telegram Bot Token / Port.
- **Monitoring:** Periodic checks for "Ghost" processes that hold port bindings or Telegram long-polling loops.
- **Protocol:** If a process collision is detected, the `Daemon` must alert the `Watchdog` and sigterm the older process.

## 3. Telemetry & Metrics

Every LLM request through the **Omni-Router** must log the following to `SYS_OS_arbiter_metrics`:

- `latencyMs`: Total turn-around time.
- `pillar`: Which of the 4 pillars (Ultra/Pro/OR/LOC) served the request.
- `hydraDepth`: Number of fallback attempts before success.
- `costUSD`: Calculated cost per 1M tokens.

## 4. Health Checks: The MSID Ritual

A system is considered "Green" and "Done" only if the `npm run health` command returns a score of 100/100.

### MSID Schedule

- **Daily Check:** 9:00 AM (Recommended) - Run `npm run health` to verify the environment is ready for the day.
- **Pre-Dev Trigger:** Automatically executed via `predev` hook whenever `npm run dev` is called.
- **Post-Deploy:** Manual trigger after any critical code push.

### Verification Criteria

1. `MONGODB`: Accessible and `olympus` collections are writable.
2. `G1/G2/OR`: API keys respond to a minimal `ping` (echo prompt).
3. `CORES`: No more than 1 active process per PID file.

## 5. Learning Loop

Monthly audit of `arbiter_metrics` to identify:

- Flaky models (high hydra depth).
- Budget leaks.
- Persistence failures (when HUD selections are overridden).
