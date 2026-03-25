# 🏛️ Olympus Constitution (Project Core)

**prj-000-core-crm** | **SLA:** `SLA-blast-OLYMPUS-20260226`

## 1. Domain & North Star

Olympus is a multi-tenant, omni-channel CRM and operational suite built for physical and digital venues.

- **Goal:** Unify F&B, Spa, Hotel, and Retail into a single configurable platform.
- **Rule:** Do not guess the business logic. If the schema is undefined, halt and ask the Pilot.

## 2. Universal Data Schemas (WIP)

*To be filled out during the blast Discovery Phase.*

### Base Entity Shape (Required on all DB records)

```json
{
  "_id": "MongoDB ObjectId",
  "tenant_id": "String (Required for isolation)",
  "created_at": "ISODate",
  "updated_at": "ISODate",
  "created_by_tool": "String (e.g., TOOL-1A2B)",
  "authorized_by": "String (e.g., blast-001)"
}
```

## 3. Behavioral Rules

1. **Red-Green TDD:** All C#, JS, and Flutter code must be written test-first. No exceptions.
2. **SWARM Testing:** All multi-tenant routing logic must be tested with synthetic traffic before deployment.
3. **No Phantom Code:** If logic changes, `docs/architecture.md` must be updated *before* the code is touched.
