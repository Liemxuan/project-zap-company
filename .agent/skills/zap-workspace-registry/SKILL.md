---
name: zap-workspace-registry
description: Port allocation rules, workspace onboarding, and the canonical workspace registry for the Olympus monorepo. Governs the Context Switcher, Mission Control, and health monitoring.
---

# ZAP Workspace Registry Protocol

## Overview

The Olympus monorepo hosts **17 workspaces** across **7 domains**. Every workspace is registered in a single source of truth:

**`packages/zap-design/src/config/workspace-registry.ts`**

This file defines the ID, port, domain, sub-category, health endpoint, and tags for every workspace. All navigation components (Context Switcher, Spotlight, Mission Control) consume this registry.

---

## Port Allocation Bands

| Domain | Range | Purpose |
|---|---|---|
| **DESIGN** | `:3000–3099` | ZAP Design Engine (L1–L7) |
| **POS** | `:3100–3499` | Point of Sale, Kiosk, Web, Portal |
| **AGENT** | `:3500–3999` | Claw, Mission Control, AI, Swarm |
| **OPERATION** | `:4000–4499` | Sales/Orders, Settings, Reports |
| **INFRA** | `:4500–4699` | Infrastructure dashboard, Database |
| **HUMAN** | `:4700–4999` | Authentication |
| **REF** | `:5000–6999` | Legacy reference, Metronic reference |

### Rules

1. **100-port gaps** between SUB workspaces within a domain allow for
   dev/staging/test variants.
2. **Domain bands** are non-overlapping. Buffer zones between bands
   accommodate future domain growth.
3. Ports are assigned in `package.json` `dev` scripts:
   `"dev": "next dev -p <PORT>"`

---

## Adding a New Workspace

### Step 1 — Pick a domain and port

Choose the domain band from the table above. Assign the next available
port within that band (use 100-port increments).

### Step 2 — Create the folder

```bash
# For an app (has its own server):
cd olympus && mkdir -p apps/<name>

# For a package (library, no server):
cd olympus && mkdir -p packages/<name>
```

The folder is automatically included via `pnpm-workspace.yaml`
(`apps/*` and `packages/*`).

### Step 3 — Register in workspace-registry.ts

Add a new `WorkspaceEntry` to the `WORKSPACE_REGISTRY` array in:
`packages/zap-design/src/config/workspace-registry.ts`

Required fields:
- `id` — unique slug (e.g., `"my-service"`)
- `name` — human-readable label
- `domain` — one of the 7 `WorkspaceDomain` values
- `sub` — sub-category string
- `port` — assigned port from Step 1
- `folder` — monorepo-relative path (e.g., `"apps/my-service"`)
- `healthEndpoint` — path to ping for health checks (default: `"/"`)
- `icon` — Lucide icon name
- `tags` — array of searchable keywords

### Step 4 — Set the port in package.json

```json
{
  "scripts": {
    "dev": "next dev -p <PORT>"
  }
}
```

### Step 5 — Seed MongoDB

Insert a document into `olympus_config.workspaces`:

```json
{
  "_id": "<workspace-id>",
  "domain": "<DOMAIN>",
  "sub": "<SUB>",
  "port": <PORT>,
  "folder": "<folder>",
  "status": "offline",
  "lastHealthCheck": null,
  "healthHistory": [],
  "userPrefs": { "pinned": false, "sortOrder": 99 }
}
```

### Step 6 — Verify

- Run `pnpm run dev` from the workspace folder and confirm the port.
- Check that the Context Switcher dropdown shows the new workspace.
- Confirm Mission Control health ping resolves.

---

## Database Schema

### Collection: `olympus_config.workspaces`

One document per workspace. Stores runtime health state and user preferences.

### Collection: `olympus_config.workspace_config`

Single global document (`_id: "global"`) storing port ranges and health check interval.

---

## Consumers

| Component | Uses |
|---|---|
| **Context Switcher** | `WORKSPACE_REGISTRY`, `DOMAIN_META` |
| **⌘K Spotlight** | `searchWorkspaces()`, `WORKSPACE_REGISTRY` tags |
| **Mission Control** | `WORKSPACE_REGISTRY` ports + `healthEndpoint` |
| **Health Monitor** | MongoDB `workspaces` collection |
