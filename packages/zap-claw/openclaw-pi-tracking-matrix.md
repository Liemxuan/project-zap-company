# OpenClaw Parity Tracking Matrix

| Feature | Status | Owner | Notes |
| :--- | :--- | :--- | :--- |
| **Core Architecture** | | | |
| Native Routing (Inbound) | ✅ DONE | Jerry | `src/runtime/router/inbound.ts` tied to OmniQueue |
| Multi-Tier Job Queue | ✅ DONE | Jerry | `blast-016` implemented in `omni_queue.ts` |
| History Limiting (Rule of 500) | ✅ DONE | Jerry | Implemented in `session.ts` |
| **Security & Auth** | | | |
| Auth Rotation | ✅ DONE | Jerry | Parity achieved |
| Tag Stripping | ✅ DONE | Jerry | Parity achieved |
| **Agent Capabilities** | | | |
| Subagent Spawning | 🚧 WIP | Tommy | Pending Track A completion |
| Forum Topic Support | ✅ DONE | Jerry | `thread_id` captured in `inbound.ts` |

## Recent Updates
- **[Jerry]**: Implemented `blast-016-multi-tier-job-queue` logic.
- **[Jerry]**: Implemented "Rule of 500" compaction in `SYS_CLAW_sessions`.
- **[Jerry]**: Updated `inbound.ts` to use `OmniQueue` natively.
