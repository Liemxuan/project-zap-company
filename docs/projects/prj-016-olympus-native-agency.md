# PRJ-016: Olympus Native Agency (The OpenClaw Independence Directive)

**Status:** Active | **Lead Architect:** Tommy | **Build Orchestrator:** Jerry (Team Hydra) | **Date:** 2026-03-06

## 1. The Directive

Olympus is evolving into a standalone, enterprise-grade product. We cannot rely on the external `OpenClaw` framework as our core routing and agent-session engine for customer deployments.

We must build our own comparable, native system within the Olympus/Zap-Claw architecture.

## 2. Roles & Responsibilities

### Tommy (Lead Architect - Scope & Routing)

Tommy is responsible for designing the internal architecture and managing the project scope.

- **The Routing Engine:** Architect how incoming messages (Telegram, Web, etc.) are routed to specific AI or Human entities without OpenClaw.
- **Session State:** Define how memory and conversation history are maintained natively in MongoDB.
- **Boundaries:** Ensure strict multi-tenant isolation (as outlined in `olympus-vs-openclaw-strategy.md`).
- **Scope Management:** Prevent feature creep. Define the exact MVP needed to replace OpenClaw's core functionality (Webhook reception -> Agent Loop -> Response dispatch).

### Jerry & Team Hydra (Build Execution)

Jerry, orchestrating Team Hydra (inclusive of Claude and sub-agents), is responsible for the physical codebase writing and testing.

- **Execution:** Translate Tommy's architecture into TypeScript/Next.js/Node.js code within the `zap-claw` package.
- **Native ACP Bridge:** Ensure the new internal router fully natively supports the ACP (Agent Client Protocol) for background agent-to-agent communication without external dependencies.
- **Channel Adapters:** Build native adapters for Telegram (with proper `subagent_spawning` and thread binding hooks, solving the limitation found in OpenClaw).
- **Validation:** Write Red-Green TDD suites to prove the native router handles concurrent loads (Omni-Queue) flawlessly.

## 3. Immediate Next Steps

1. **Tommy:** Draft the `prd-005-native-routing-engine.md` detailing the sequence diagram of a message flowing from a Telegram Webhook to a Zap-Claw agent and back, bypassing OpenClaw entirely. Provide this to Zeus for review.
2. **Jerry:** Review Tommy's PRD. Spin up Team Hydra and begin scaffolding the `src/runtime/router/` directory inside `zap-claw`.

> **Zeus's Mandate:** "We are building a system, Olympus, to sell to other customers. We can't have this thing sitting on OpenClaw. We have to build something comparable to this." Execution starts immediately.
