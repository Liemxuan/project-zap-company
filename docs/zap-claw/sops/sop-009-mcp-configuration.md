# SOP-009: MCP Operational Guidelines

**Description:** This document defines the exact access levels, use cases, and restrictions for the Model Context Protocol (MCP) servers integrated into the Antigravity system. These constraints ensure security while providing the necessary velocity for UI iteration and memory persistence.

---

## 1. Active MCP Roster & Security Posture

### 1.1 MongoDB (`mongodb-mcp-server`)

* **Access Level:** **FULL ACCESS** (Read / Write / Delete)
* **Purpose:** Acts as the persistent memory engine for the Swarm and unstructured data.
* **Why:** Agents need unhindered read/write access to manage their own thought streams (`MemoryFact`), handle temporary context, and map out schemas before translating them to the strict relational DB.

### 1.2 NotebookLM (`notebooklm-mcp-server`)

* **Access Level:** **FULL ACCESS**
* **Purpose:** The centralized knowledge base for the entire Olympus team.
* **Why:** Acts as the core repository for sops, code decisions, employee workflows, and research findings. Allows the AI and humans to query a single source of truth for organizational memory.

### 1.3 Notion (`notion-mcp-server`)

* **Access Level:** **FULL ACCESS**
* **Purpose:** External collaboration, customer intake, and project tracking.
* **Why:** Maintained entirely for human-readable tracking (Tasks, Blasts, FAQs, customer questionnaires). It serves as the basic portal for company operations and client interactions.

### 1.4 Stitch (`StitchMCP`)

* **Access Level:** **FULL ACCESS**
* **Purpose:** UI rapid prototyping and component design.
* **Why:** Stitch allows anyone on the team to drop an idea, generate a functional React component, and tweak the code. Anthropic/Gemini agents can push updates directly to Stitch for rapid iteration before finalizing the design.

### 1.5 Figma (`figma-mcp-server`)

* **Access Level:** **READ-ONLY** (Writing tools disabled)
* **Purpose:** Design source of truth and asset extraction.
* **Why:** Figma represents the finalized, fine-tuned design system. The AI reads from Figma to extract specific layouts, dimensions, or assets, translating them into the Antigravity codebase. It does not write to Figma to avoid polluting the human design space.

### 1.6 GitHub & GitKraken (Local)

* **Access Level:** **RESTRICTED** (Sync & Recovery Only)
* **Purpose:** Codebase backup, version history, and emergency recovery.
* **Why:** The AI handles the majority of generation. Git tools are stripped of complex PR/Issue tracking capabilities to reduce the attack surface. They are strictly tools for backing up progress and rolling back if a session goes catastrophic.

---

## 2. Infrastructure Expansion (100k Customer Scale)

As we scale out the 100,000 customer data flow in the next phase, the following MCPs must be evaluated for integration:

1. **PostgreSQL MCP:** Critical for interacting with the primary C# /.NET relational database (EF Core). We cannot rely solely on MongoDB for a system of this scale.
2. **Kubernetes / Server Health MCP:** Because An is running local VN/EU servers, an MCP to read cluster health, pod status, and access network logs securely.
3. **Redis / Caching MCP:** High throughput requires caching. An MCP that allows the AI to inspect cached payload and manage invalidation schemas.
