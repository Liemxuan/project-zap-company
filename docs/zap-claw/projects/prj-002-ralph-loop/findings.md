# prj-002-ralph-loop

## Findings Log
*This document tracks raw research, context retrieved from existing schemas, and lessons learned during the discovery/blueprint phases.*

### Initial Audit Context (`kb-001-ralph-loop.md`)
The Ralph Loop is a resilience mechanism designed to allow AI agents to work infinitely on complex, multi-iteration tasks without getting stuck in context loops.
* **Core Loop:** Read PRD -> Pick one story -> Implement -> Test -> Commit/Update PRD.
* **Statelessness:** It spawns fresh agent instances per iteration, preventing context degradation.
* **Stop Condition:** It requires a definitive completion signal (e.g., `<promise>COMPLETE</promise>`) to break the loop.
