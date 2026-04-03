# PRJ-017: Evolution Arena (DGM-H HyperAgents Integration)

**Status:** Active | **Lead Architect:** CSO (Security) & Tommy | **Date:** 2026-04-01

## 1. The Directive

To scale the Olympus Swarm into a self-improving Darwin Gödel Machine (DGM-H) without compromising infrastructure security. We will adapt Meta's HyperAgents framework to enable autonomous self-modification of the Swarm's skills and execution logic, strictly contained within a zero-trust Virtual File System (VFS) sandbox. Let the agents evolve; keep the walls intact.

## 2. Security Posture (CSO Mandate)

- **Immutable Core:** `zap-swarm-security` (ZSS), RBAC, and the root `omni_router.ts` are strictly out of bounds. Any attempt by the Swarm to modify these layers will result in an immediate hard kill of the session.
- **The Sandbox:** All self-rewriting logic occurs exclusively in the designated `zap-arena` (VFS `tmp://zap-arena`).
- **No Regressions:** Code or Prompts are only promoted from the arena to main if it mathematically improves success rates (`imp@k > 0`) over baseline, measured via `zap-swarm-evaluator`.

## 3. Phase 1 Architecture: Autonomous Skill Evolution

The safest, highest-leverage application of self-modification is allowing the Swarm to autonomously refine its own `SKILL.md` instructions.

### The Roles
- **Meta-Agent (Jerry):** Acts as the optimizer and evaluator. Analyzes tool failures, rewrites the targeted `SKILL.md` in the sandbox, and grades the result.
- **Task-Agent (Spike):** Executes the actual coding task using the newly modified skill file.

### The Evolution Loop (TRT Integration)
1. **Trigger:** The system detects a failure loop, linting hell, or sub-optimal code generation from Spike.
2. **Analysis:** Jerry reads the failure summary and identifies prompt ambiguity within Spike's active `SKILL.md`.
3. **Modification:** Jerry clones the `SKILL.md` to `tmp://zap-arena/skills/` and rewrites the markdown logic to patch the hallucination or correct the methodology.
4. **Execution:** Spike runs a regression test suite against the target workflow using the modified sandboxed skill.
5. **Evaluation (`imp@k`):** Jerry calculates the delta in success rate.
   - If `imp@k > 0`: File is promoted to `.agent/skills/`.
   - If `imp@k <= 0`: File discarded; automatic rollback to baseline.

## 4. Immediate Next Steps

1. **CSO/Security:** Provision the `tmp://zap-arena` sandbox directory within the Swarm VFS ensuring zero exterior network traversal.
2. **Jerry (Team Hydra):** Extend the OmniRouter's TRT capabilities to include the "Skill Rewrite State"—allowing it to trigger the `agent-skill-evaluator` programmatically upon repeated failure.
3. **Proof of Concept:** Run the first live test by tasking Jerry to autonomously evolve the `zap-fix-background` skill against a known complex M3 layout test.
