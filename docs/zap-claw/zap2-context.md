# ZAP 2.0 "Titan" — Master Context

> **Read this at the start of every session.** Last updated: Feb 21, 2025.

---

## What We Are Building

An **enterprise AI agent platform** that provides intelligent personal assistants to business owners across 5 vertical markets:

| Vertical | Scope |
|---|---|
| **F&B** | Restaurants, cafes, food & beverage businesses |
| **Spa & Nails** | Beauty, wellness, salon operations |
| **Hotels & Airbnb** | Hospitality, short-term rentals |
| **Retail (Online + Offline)** | E-commerce, POS, inventory |
| **Professional Services** | Consultants, agencies, service providers |

**Each business owner gets an agent + personal assistant** — running on ZAP 2.0 infrastructure.

---

## The Gem Network (Titan v1 Shards)

| Shard | Stack | Role |
|---|---|---|
| ZAP Claw | TypeScript/Node.js (active) + C# .NET 9 (parallel) | Logic Core — data ingestion |
| ZAP POS | C# + Flutter + Windows AOT | Universal Commerce |
| ZAP Design | React / Next.js | 7-Level UI/UX Engine |
| ZAP Employees | TBD + NotebookLM | Human Capital |
| ZAP Operation | TBD + Vision AI | sops & Workflows |
| ZAP Finance | .NET Enterprise | Arbitrage & Ledger |

---

## The Lineage

```
ZAP 1.0  →  OpenClaw research (2 months)  →  ZAP 2.0 Titan
```

- **ZAP 1.0**: Built the foundation — established core patterns, tooling, agent behavior
- **OpenClaw**: The "ingredient" — architecture tied together ZAP 1.0's learnings
- **ZAP 2.0 Titan**: Scale-focused enterprise rebuild for thousands of businesses

---

## Team (12 people in Vietnam)

| Team | Lead | Focus |
|---|---|---|
| **Team 1** | Founder + AI (Antigravity) | Core architecture, memory contract, prototype |
| **Team 2** | Vuong | Enterprise build (C# / .NET 9), production systems |
| **Shared** | — | Frontend, testing, DevOps, documentation |

---

## Two Selling Points (DO NOT RUSH THESE)

1. **Memory System** — enterprise-grade, auditable, cost-tracked, partitioned (business/personal)
2. **Multi-Tenant Gateway** — ability to give agents to each employee in a company

---

## Approach Decision

- **Phase 1:** Contract-first, partitioned memory (TS/SQLite prototype + C#/PostgreSQL concurrent)
- **Phase 2:** Evolve to full event-sourced memory (immutable events, time-travel audit)
- **Legacy:** MongoDB (already in use from ZAP 1.0)
- **Frontend:** Audit dashboard is critical — premium UI, not an afterthought

---

## architecture Philosophy

### Artifact-First
- The LLM is **stateless by design** — never trust chat history
- **Inject current state** into every single prompt
- Every AI action = an **artifact update** (versioned, revertable)
- Failure mode = revert the artifact, not the chat

### Core Technologies (The Stack)
1. **TypeScript/Node.js** — rapid prototyping & fast integrations (Phase 1)
2. **SQLite** — local-first state, FTS5 for basic memory (Phase 1)
3. **Markdown `.md` files** — versioned artifacts
4. **Pinecone** — vector search for semantic recall at scale (Phase 2, alongside C#)
5. **C# / .NET 9 orchestrator** — typed, structured, auditable (Phase 2)
6. **Sovereign deployment** — data residency compliance (Vietnam/EU)

---

## Entity Hierarchy (Multi-Tenant Data Model)

```
Customer (Person)
├── Company
│   ├── Departments
│   ├── Employees (with Roles)
│   ├── Suppliers
│   └── Partners
├── 📁 BUSINESS Context
│   └── Company ops, transactions, inventory, scheduling, staff, suppliers
└── 📁 PERSONAL Context
    └── Family, spouse, children, daily life, events calendar, personal notes
```

### Dual-Context Memory Partition

| Context | Contains |
|---|---|
| **Business** | Company data, sales, staff, suppliers, inventory, schedules |
| **Personal** | Family names, personal calendar, daily routines, relatives |

**Key rules:**
- They rarely cross — routes to right partition first (performance optimization)
- But they ARE interrelated — cross-reference, don't merge
- At 10,000 customers × hundreds of memories, partition routing is the difference between fast and unusable

## Entity Hierarchy (Multi-Tenant Data Model)

```
Customer (Person)
├── Company
│   ├── Departments
│   ├── Employees (with Roles)
│   ├── Suppliers
│   └── Partners
├── 📁 BUSINESS Context
│   └── Company ops, transactions, inventory, scheduling, staff, suppliers
└── 📁 PERSONAL Context
    └── Family, spouse, children, daily life, events calendar, personal notes
```

### Dual-Context Memory Partition

| Context | Contains |
|---|---|
| **Business** | Company data, sales, staff, suppliers, inventory, schedules |
| **Personal** | Family names, personal calendar, daily routines, relatives |

**Key rules:**
- They rarely cross — routes to right partition first (performance optimization)
- But they ARE interrelated — cross-reference, don't merge
- At 10,000 customers × hundreds of memories, partition routing is the difference between fast and unusable

---

## 🛡️ Proprietary Mandate

- **Decoupling**: Zap-OS is a standalone, packaged product. We do not follow the OpenClaw open-source roadmap to avoid "Frankenstein" bloat.
- **Sovereignty**: We own the maintenance, security, and rollout pipeline.
- **Standards**: ISO and SOP compliance (like the B.L.A.S.T. protocol) are non-negotiable.

---

## 🏗️ Core architecture & Development Methodology

All foundational architecture (including the **7-Level Hierarchy** and the **Three-Layer Language**) is enforced globally via the **B.L.A.S.T.** protocol.

See `docs/REFERENCES/BLAST_PROTOCOL.md` (or `~/.skills/blast-protocol/skill.md`) for the master directives.

---

## Skill Registry Pattern (Approved)

- **Global = the library** (`~/.agent/skills/`, synced to GitHub, Dockerized)
- **Project = the manifest** (`.agent/skills.json` declares imports)
- **Agent = the reader** (loads only what's on the manifest)

---

## Current Focus: Memory (Level 2)

See `docs/memory-implementation.md` for the full plan.
