# TASK: Native ACP Thread Binding Implementation

**Assignee:** Jerry (Chief of Staff)
**Priority:** P1
**Date:** 2026-03-06

## Background Context

We have successfully migrated from the ATA (Agent-to-Agent) ping protocol to Native ACP (Agent Client Protocol) for inter-agent communication. This wires your processing loop directly into the OpenClaw gateway via a local Node.js backend (`packages/zap-claw/extensions/zap-jerry`).

During live-fire testing, Tommy discovered a critical limitation in the OpenClaw environment:
> *"While I've correctly included thread=true for a persistent session, the system reports that `thread=true is unavailable because no channel plugin registered subagent_spawning hooks.`"*

Because we are currently operating over the Telegram channel adapter in OpenClaw, the system cannot bind your sub-agent session to a continuous thread. You are restricted to `mode="run"` (one-shot execution) instead of seamless, persistent follow-ups.

## The Objective

We need to remove this limitation. Your mission is to investigate the OpenClaw architecture and implement the missing `subagent_spawning` hooks for the Telegram channel adapter, or find an equivalent persistent workaround.

## Execution Steps

1. **Research `openclaw/plugin-sdk`:** Look into how channels in OpenClaw implement thread bindings. Find out what `subagent_spawning` requires.
2. **Examine the Telegram Channel Adapter:** Assess if we can patch or extend the OpenClaw Telegram channel configuration (e.g., `channels.telegram.threadBindings.spawnAcpSessions=true`).
3. **Draft the Implementation Plan:** Formulate a path to introduce persistent `mode="session" & thread=true` routing for sub-agents interacting through human-facing chat adapters.
4. **Report Back to Zeus & Tommy:** Present your findings. If it requires a fork of OpenClaw, state the cost-benefit analysis.

*Zeus expects us to use this insight to improve our current state. Figure it out.*
