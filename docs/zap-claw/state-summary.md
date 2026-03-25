# ZAP Claw OS: State Summary

**Date:** 2026-02-26
**Current Phase:** Phase 29 (zapclaw init Agent Provisioning).

## Core architecture & Stack

* **Language:** TypeScript (Node.js). Zero external AI frameworks (No LangChain/LlamaIndex).
* **Database:** MongoDB (Global Vault) + SQLite (Local Ephmeral Interaction Cache).
* **Memory:** **Titan Memory Engine (TME)**. Semantic Vector Search (`gemini-embedding-001`) with hard account sharding.
* **Multi-Tenancy:** Hard-isolated account types (PERSONAL vs. BUSINESS) within user sessions.
* **Bicameral Brain:** Dual-Core reasoning. Fast-Brain (Budget/Flash) for simple tasks; Deep-Brain (Heavy/Reasoning) for research/logic.

## Major Systems Implemented (Phases 1-29)

1. **Omni-Router & Arbitrage (`src/arbitrage.ts`):**
    * Unified adapter for Gemini, OpenRouter, and local providers. Implements Bicameral Routing tiers.
2. **Titan Memory Engine (TME) (`src/memory/vector_store.ts`):**
    * Semantic recall of facts buried in history.
    * Integrates Account-level isolation (Personal vs. Business) and semantic conflict resolution in the **Ralph Loop**.
3. **The Ralph Loop (`src/memory/ralph.ts`):**
    * Self-healing consolidation daemon. Extracts enduring facts, detects semantic contradictions, and supersedes stale memory.
4. **Autonomic Agent Self-Healing (Phase 27/28):**
    * Error introspection using Circuit Breakers, Root Cause Analysis (RCA), and iterative patch validation in the HUD.
5. **Agent Anatomy templates & Swarm Init (Phase 29):**
    * `zapclaw init` runtime script to provision `.agent/` 7-pillar markdown architecture (AGENTS, SKILL, SOUL, etc.).
    * Separates Merchant vs. Olympus (Zeus) context payload generation logically.

## Current Constraints & Roadmap Gaps

* **Stateless Scaling:** Jerry remains natively stateless. All context and sharding reside in MongoDB.
* **Regional Boundaries:** Multi-region deployments (`US`, `VN`, `DE`) require strict Database Sharding. A `regionCode` key must dictate which "Soul" (Persona, Ethics, Skills) the Gateway fetches before routing to Omni-Router.
* **Recall Depth:** Fast-Brain models may trade recall depth for speed. Deep-Brain models are required for 100% accuracy on complex research.
* **ROADMAP GAPS (Anthropomorphic Vision):**
  * **Regions Configured [US]:** `ethical-bounds.md`, `skills-manifest.md`, `persona-guide.md`, `self-healing-brain.md` have been initialized for Spa & Beauty (US).
  * **Regions Pending [VN, DE]:** Require distinct Soul generation and local ZAP-OS Gateway architecture mapping.

**To resume the session:** Feed this State Summary alongside the standard B.L.A.S.T. / Titan ZAP protocol prompt.
