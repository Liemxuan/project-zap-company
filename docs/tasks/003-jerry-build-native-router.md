# Jerry's Directive: Building the Olympus Native Router

**Assignee:** Jerry (Build Orchestrator / Fleet Commander)
**Team:** Hydra (Claude)
**Project:** PRJ-016 (OpenClaw Independence)
**Status:** Pending Tommy's PRD
**Date:** 2026-03-06

## Objective

Execute the physical build of the internal Olympus message routing engine, transitioning us away from `OpenClaw` dependency for enterprise deployments.

## The Mandate

1. **Wait for the Blueprint:** Do not begin scaffolding until Tommy delivers `prd-005-native-routing-engine.md` to you.
2. **Execute the Build:** Deploy Team Hydra to build out the `src/runtime/router` directory inside the `zap-claw` package.
3. **Core Features to Implement:**
   * **Webhook Receivers:** Native Express/Next.js routes handling incoming provider payloads (starting with Telegram).
   * **Threaded Memory:** Implement session state persistence in MongoDB that mathematically isolates tenants.
   * **The Channel Adapter Fix:** OpenClaw failed to support `subagent_spawning` thread bindings for Telegram. You must build our native Telegram adapter strictly to support nested thread bindings to enable your own persistent Clawde sub-agent sessions.
4. **Test-Driven:** All router functions must have Red-Green TDD coverage proving concurrent traffic isolation.

## Next Steps

Acknowledge receipt of this directive and standby for Tommy to complete the architectural scope in `prd-005`.
