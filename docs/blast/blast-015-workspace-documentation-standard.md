# B.L.A.S.T. 015: Workspace Documentation Standardization

**Status:** ACTIVE  |  **Initiated:** March 4, 2026 | **Project:** OLYMPUS CORE

---

## 1. The Directive: No Standard, No Commit

**To all Antigravity agents, sub-agents, and human staff acting within the Olympus, Zap-Claw, and Zap-Design ecosystems:**

You are strictly forbidden from dumping unstructured, unformatted Markdown files or documentation into any vault without first ensuring rigorous compliance with our documentation standards.

### Mandatory Pre-Flight Execution

Before initiating *any* output that involves writing a Standard Operating Procedure (SOP), protocol, protocol decision (ADR), or Business Logic Action Strategy (BLAST):

1. **Agents MUST invoke their tools to dynamically read and process the `@workflow-sop-generation` skill.**
2. Follow its rules unconditionally.
3. Lowercase kebab-case naming is an absolute architectural invariant.

## 2. Context & Background

Historically, documentation across `olympus`, `zap-claw`, and `zap-design` degraded into casing anarchy. Documents ranged from `README.md` to `SOP_001.md`, all the way to `Architecture/MASTER-ENTITY-SCHEMA.md`. This shattered programmatic searchability and agent retrieval performance.

This BLAST permanently outlaws uppercase documentation titles and underscores.

## 3. The Great Wash (Phase 1)

As part of the execution of this protocol, an automated system-wide purge was completed on March 4th across all 3 monorepos.

* **Physical Renaming:** Recursively crawled `olympus/`, `zap-claw/`, and `zap-design/`.
* **Standard Enforcement:** Enforced `lowercase-kebab-case.md` for all 200+ markdown files.
* **Link Repair:** Rewrote thousands of relative and absolute markdown hyperlinks within identical commits to prevent 404s. `README.md` is now `readme.md`. `SOP_001.md` is now `sop-001.md`.

## 4. The Cross-Workspace Cartesian Map (Phase 2)

To ensure visibility isn't lost across micro-workspaces, we are initiating a unified view. While `olympus/docs` remains the supreme source of truth via its `master-registry.md`, developers must navigate the domain logic using the `cross-workspace-map.md` introduced alongside this BLAST.

If documentation spans beyond `olympus`, it must be linked contextually.

## 5. Summary Tracking & Success Metrics

* **Workspace Cleanup Complete:** All `docs/` and root `.md` files in `zap-claw` and `zap-design` are standardized.
* **Agent Governance Deployed:** Agents are explicitly instructed to cross-reference `.agent/skills` strictly for documentation drops.
* **Link Integrity Validated:** Node script injected to guarantee reference survival.
