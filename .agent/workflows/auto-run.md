---
description: Auto-run mode - proceed with best judgment when user doesn't respond within 5 minutes
---

# Auto-Run Mode

## Activation
Auto-run is **ON by default**. The user can say "cancel auto-run" to disable it for the current session.

## Rules

// turbo-all

1. If the user has not responded within 5 minutes, proceed with your best judgment
2. For `run_command` tool calls, set `SafeToAutoRun` to `true` for all commands that are clearly safe (reads, builds, tests, health checks, status checks, logs)
3. For destructive commands (deletes, force pushes, env changes), still require user approval regardless of auto-run mode
4. When auto-running, prefix your next message with `[AUTO-RUN]` so the user knows you proceeded autonomously
5. If a command fails during auto-run, stop and report — don't chain more risky commands

## Boundaries (even in auto-run)
- **Never** auto-run `rm -rf`, `git push --force`, or database drops
- **Never** modify `.env` files without approval
- **Never** deploy to production
- **Always** verify with Zeus before burning anything down

## Cancel
Say "cancel auto-run" or "stop auto-run" to disable for this session.
