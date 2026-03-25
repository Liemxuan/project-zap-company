# Tommy's Directive: Olympus Native Routing Architecture

**Assignee:** Tommy (Lead Architect)
**Project:** PRJ-016 (OpenClaw Independence)
**Status:** In Progress
**Date:** 2026-03-06

## Objective

Design the core architecture for the internal Olympus message routing engine to completely replace our dependency on the external `OpenClaw` framework. This is critical for enterprise deployment.

## Mandatory Deliverables

1. **Scope Document (prd-005-native-routing-engine.md):**
   * Define the exact sequence of events from receiving a webhook (e.g., Telegram) to dispatching a payload to a ZAP-Claw agent loop, and streaming the response back.
   * Define the DB schema required to manage active sessions and threaded memory persistently in MongoDB.
   * Clearly define boundaries to prevent feature creep. We need the MVP routing infrastructure, not generic AGI capabilities.

2. **Native ACP Specification:**
   * Document how our internal agents (Jerry, Spike) will invoke and communicate with sub-agents entirely natively, bypassing external API calls or chat interfaces.
   * Solve the "thread binding" limitation currently experienced in OpenClaw's Telegram adapter by designing a native threaded session model in our custom adapter.

## Strict Rules of Engagement

* **Do not write the execution code.** Your job is architectural design, constraint setting, and scope management.
* Jerry and Team Hydra will execute your blueprints.
* Once PRD-005 is drafted, use `{A2A:PING}` or Native ACP to hand off the build execution to Jerry.

## Next Step

Review `olympus-vs-openclaw-strategy.md` for existing architectural guidelines, then draft `prd-005`.
