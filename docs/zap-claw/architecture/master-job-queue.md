# 🗄️ MASTER MULTI-AGENT JOB QUEUE

## 🐝 Swarm Allocation & Execution Rules
To maximize velocity and avoid analysis paralysis, tasks are broken down into isolated `EXEC` (Execution) Jobs. Each job is bound to a strict `PRJ` ID, targeting a specific Entity Level (`FND`, `PRJ`, `AGNT`, `MRCH`), and explicitly tagged with a `TEST-XXX` A/B ID.

*   **Allocation:** The Human Orchestrator assigns different LLM Models (Agent Personas) to independent Jobs.
*   **Concurrency:** If a Job has `DEPENDENCIES: NONE`, it can be launched in parallel with other independent jobs.
*   **Tracking:** Status is updated here in real-time. If a test fails, a new `EXEC` job is spawned with a `PATCH` objective.

---

## 🚦 Active Job Matrix & Model Evaluation

| `JOB_ID` | Project | Exec Type (Loop vs Linear) | Assigned Model (Agent) | Model Strategy & Cost | Est. Tokens | Dependencies | Status | Empirical Outcome (Model Eval) |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **EXEC-001** | `PRJ-004` | **Linear** (Finished all the way through) | `Antigravity` | Heavy (High Logic Required) | ~15k | **NONE** | `[x] COMPLETE` | `[SUCCESS] Built SQLite Initializer and Daemon Orchestrator.` |
| **EXEC-002** | `PRJ-001` | **Ralph Loop** (Isolated chunking) | `Antigravity` | Downgrade (`gemini-2.5-flash`) | ~5k / loop | `EXEC-001` | `[x] COMPLETE` | `[EMPIRICAL SUCCESS (N=100)] HIDR: 100%, EL: 14.65s` |
| **EXEC-003** | `PRJ-005` | **Linear** (Finished all the way through) | `Antigravity` | Local Script (MongoDB Driver) | N/A | `EXEC-002` | `[x] COMPLETE` | `[EMPIRICAL SUCCESS (N=100)] Synced N=100 states seamlessly.` |

---

## 🧠 Model Optimization & Feedback Pipeline
To scale efficiently and minimize API costs, we must learn which models are capable of which tasks. 

1. **The Downgrade Strategy:** Start complex tasks with a Heavy model. As the task is formalized into a strict Ralph Loop SOP, **downgrade the assigned model** to a cheaper, faster variant.
2. **Outcome Tracking:** If a cheap model fails its assigned `EXEC` job (e.g., it hallucinates or loops infinitely), we log the outcome as `FAILED: DUMB MODEL` in the empirical outcome column.
3. **Self-Correction:** If a model is flagged as incapable, the Orchestrator instantly hot-swaps the assignment back to a Heavy model to clear the blockage. Every job becomes a data point learning the exact cognitive floor (cheapest viable model) for a specific task.

---

## 🚀 How to Launch the Swarm

When you (the Human) allocate a Model to a row above and change the status from `[ ] PENDING` to `[ ] RUNNING`, that specific Agent will instantly spin up. 

Because `EXEC-001` has **NO DEPENDENCIES**, it is fundamentally ready to launch immediately. 

The moment `EXEC-001` flips to `[x] COMPLETE` by the victorious Agent, the system can automatically unblock and spawn `EXEC-002` and `EXEC-003` concurrently in parallel, drastically compressing development runtime.
