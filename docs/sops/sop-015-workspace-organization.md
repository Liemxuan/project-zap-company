# SOP-015: ZAP Workspace Organization & Hierarchy

**Olympus ID:** OLY-115
**Status:** ACTIVE
**Author:** Antigravity / Jerry
**Date:** March 2026

## 1. Objective

To maintain a strict "Zero-Trust" and highly organized file structure within `/Users/zap/Workspace`. This SOP dictates where all code—whether internal, foreign, operational, or deprecated—must live.

## 2. The Workspace Hierarchy

The root directory (`/Users/zap/Workspace/`) is restricted to the following four standard directories. **No other top-level directories should be created without Zeus's explicit permission.**

### 2.1 The Core Triad (`/olympus`)

**Description:** The active, production-grade ZAP monorepo. This is the heart of the business.

* **Path:** `/Users/zap/Workspace/olympus/packages/`
* **Contents:**
  * `zap-claw` (Backend / Agentic OS)
  * `zap-design` (Frontend / Next.js)
  * `olympus` (Shared libraries, sync scripts, core documentation)
* **Rule:** Only verified, deeply trusted, and proprietary ZAP code lives here.

### 2.2 The Active Armory (`/tools`)

**Description:** Standalone, executable developer tools that run alongside our stack but are not part of the core business logic.

* **Path:** `/Users/zap/Workspace/tools/`
* **Examples:** `open-pencil` (Figma MCP server), `skill-prompt-generator`.
* **Rule:** These are active processes. They can be booted up, bind to ports, and interact with the system, but their code should not be blindly copied into `olympus`.

### 2.3 The Passive Vault (`/references`)

**Description:** Static repositories used purely for inspiration, template extraction, or skill harvesting. We read from these, but we do not execute them.

* **Path:** `/Users/zap/Workspace/references/`
* **Examples:** `metronic` (UI Templates), `superpowers` (TDD skills), `awesome-claude-code-subagents`.
* **Rule:** NEVER run `npm run dev` or boot a server from within `/references`. They exist solely to be queried by agents or developers for code snippets.

### 2.4 The Graveyard (`/graveyard`)

**Description:** Archive for deprecated, abandoned, or legacy projects.

* **Path:** `/Users/zap/Workspace/graveyard/`
* **Examples:** `zap-pos`, `zap-employee`, `zap-concept-old`.
* **Rule:** Code goes here to die. It is kept for historical context but is completely severed from the active execution path.

---

## 3. Workflow: Ingesting a New Repository

When Zeus requests a new GitHub repository to be pulled down, agents must follow this exact flow:

1. **Quarantine:** Clone the repository to `/tmp/zap-quarantine/`.
2. **Scan (sop-012):** Execute the Foreign Code Scanning protocol to check for prompt injections or malicious dependencies.
3. **Categorize & Relocate:**
    * *Is it a tool we will run actively?* Move to `/tools/`.
    * *Is it a template or knowledge base we will just read from?* Move to `/references/`.
4. **Integration (Optional):** If specific files or concepts (like a UI component or a TDD prompt) need to be used in production, selectively copy *only* those required files into the `/olympus` monorepo.

## 4. Enforcement

Jerry (Chief of Staff) and Zapclaw (Olympus OS) are jointly responsible for scanning the root `/Workspace/` directory periodically. Any unclassified directories found at the root level must be flagged for cleanup.
