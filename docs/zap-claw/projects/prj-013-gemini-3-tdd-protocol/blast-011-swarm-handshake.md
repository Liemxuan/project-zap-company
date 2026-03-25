# BLAST-011: Swarm Handshake & Task Orchestration

## 1. The Virtual Handshake

In the ZAP Claw infrastructure, agents (Claw, Tommy, Jerry) "handshake" via **Shared Memory Context**. Since all agents read from the same `SYS_CLAW_memory` collection scoped to the user, they are aware of each other's outputs in real-time.

### Handshake Protocol

- **Reference by Name:** Agents must explicitly address each other (e.g., "Jerry, I've cleared the zombies. Tommy, verify the port bindings.")
- **Inter-Agent Tasking:**
  - **Jerry (Chief of Staff):** Assigns priorities and handles logistics.
  - **Tommy (Analyst):** Validates logic, audits metrics, and performs TDD checks.
  - **Claw (Architect):** Executes builds, refactors, and manages the file system.

## 2. Integrated Building

When Zeus requests a "Build," the following handshake occurs:

1. **Jerry** flags the task as "In Progress" and sets the AROS status.
2. **Tommy** reviews the previous `state-summary.md` or `memory` to define the logic constraints.
3. **Claw** executes the file changes.
4. **Tommy** audits the new code for AROS/TDD compliance.
5. **Jerry** provides the final "Done" report via MSID.

## 3. Outstanding Collaboration Task: "The AROS Heartbeat Audit"

- **Objective:** Tommy to analyze the `SYS_OS_arbiter_metrics` for the last 24 hours and identify any "Hydra Depth" spikes (fallbacks).
- **Handshake:** Jerry will then include Tommy's findings in the 8:00 AM MSID report.
