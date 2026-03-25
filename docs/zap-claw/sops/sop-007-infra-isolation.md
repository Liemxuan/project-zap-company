# SOP-007: Infra-Isolation & API Key Registry

## 1. Purpose
To establish a multi-project isolation architecture within Google Cloud and OpenRouter. This prevents rate-limit starvation, ensures 100% availability for mission-critical gateway tasks, and provides a clear mechanism for tenant-level isolation.

## 2. Infrastructure architecture
All requests are routed through a tiered project isolation model:
- **Project: ULTRA**: Mission-critical gateway reasoning and precision tasks.
- **Project: PRO**: High-volume internal dev/scout agent operations.
- **Project: TENANT**: Isolated pipelines for customer/end-user agents.

## 3. The Central Key Registry (Fill in the Blanks)

| logical_name | provider | gcp_project | env_variable / key | usage_capability |
| :--- | :--- | :--- | :--- | :--- |
| **PRECISION_GATEWAY** | GOOGLE | [FILL PROJECT] | `GOOGLE_ULTRA_API_KEY` | Final decision logic (Ultra) |
| **INTERNAL_COMMANDER** | GOOGLE | [FILL PROJECT] | `GOOGLE_COMMANDER_API_KEY` | Team Leadership / Roadmap |
| **CODE_WORKFORCE** | GOOGLE | [FILL PROJECT] | `GOOGLE_PRO_API_KEY` | Coding (Nguyen/Claw-Coder) |
| **SCOUT_RESEarch** | GOOGLE | [FILL PROJECT] | `GOOGLE_SCOUT_API_KEY` | Discovery (Ghost-Scout) |
| **TENANT_PLATINUM** | GOOGLE | [FILL PROJECT] | `TENANT_PLATINUM_KEY` | High-priority customers |
| **TENANT_STANDARD** | GOOGLE | [FILL PROJECT] | `TENANT_STANDARD_KEY` | General customer pool |
| **FRONTIER_BRIDGE** | OPENROUTER | N/A | `OPENROUTER_API_KEY` | Claude 4.6 / GPT-5 Fallbacks |
| **CHEAP_BULK** | OPENROUTER | N/A | `DEEPSEEK_BYOK_KEY` | High-volume low-cost tasks |

---

## 4. Database & Settings Dashboard (Projected State)

### 📊 Current Gateway Status (Feb 2026)
- **Primary Data Store**: MongoDB (Tenant Registry, Agent Memory, Telemetry).
- **Local Cache**: SQLite (Fast response history, rate-limit counters).
- **Routing Engine**: Hydra Fallback (Hydra Chain v3.2).
- **Security**: Prompt Injection Shield (Phase 18 Verified).
- **Budget Cap**: $5.00/1M Tokens (Standard) | NO CAP (Critical).

### ⚙️ Active Global Settings
| Setting | Current Value | Purpose |
| :--- | :--- | :--- |
| `MAX_PAYG_BUDGET` | $5.00 | Prevents high-cost PAYG model billing. |
| `RETRIABLE_ONLY` | TRUE | Surgical fallback for 5xx/429 only. |
| `ZERO_COMPLETION` | ENABLED | Insurance against stuck provider requests. |
| `HYDRA_CHAIN` | PREPAID-FIRST | Prioritize Google fixed-fee keys. |

## 5. Maintenance
When creating a new Google Project or rotating keys:
1. Update the GCP Secret Manager or your local `.env`.
2. Add the NEW logic key name to this Registry Table.
3. Restart the **ZAP Gateway** to re-bind the new project limits.
