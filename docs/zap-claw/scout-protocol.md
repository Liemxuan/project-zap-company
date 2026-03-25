# 🛰️ scout-protocol.md: Agentic Reconnaissance (v1.0)

## Objective

To enable agents (primarily Jerry) to perform safe, read-only reconnaissance of the system environment before tasking a higher-tier agent (Claw/Tommy) for implementation. This prevents "Shadow Context" and ensures alignment with current system state.

## 1. The Scout Workflow

### Phase A: Initialization

- Triggered when a task requires knowledge of the local environment (e.g., "Check why the daemon is down" or "Analyze the DB schema").
- **Agent**: Jerry (Chief of Staff).

### Phase B: Information Gathering (The Eyes)

- **Tools**: `view_file`, `brave_search`, `recall`.
- **Target**: Logs (`/logs`), Schemas (`*.prisma`), Docs (`/docs`), and real-time news (`brave_search`).
- **Safety**: No writing (`replace_file_content`) or modification allowed.

### Phase C: Synthesis & Handover (The Brain)

- Jerry synthesizes the findings into a **SITREP** (Situation Report).
- **Handover**: Use `ATA_HANDSHAKE` to pass the synthesized plan to **Claw Team** for execution.

## 2. Mandatory Reporting Template

Every scout mission must end with a report using the following structure:

```markdown
### 🕵️ SCOUT SITREP: [MISSION NAME]
**Environment Analysis**: [Findings from view_file]
**External Intelligence**: [Findings from brave_search]
**Identified Blockers**: [Missing tools, dependency issues, or errors]
**Recommendation**: [Clear action plan for Claw Team]
```

## 3. Designated Tools for Scouting

- **Primary**: `view_file` (Codebase/Log analysis)
- **External**: `brave_search` (Web intel/Troubleshooting)
- **Internal**: `recall` (Memory fact checking)

---
**Custodian**: Olympus (CSO)
**Field Lead**: Jerry (Chief of Staff)
