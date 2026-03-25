---
name: zap-project-structure
description: Canonical folder structure, testing policies, and organization rules for the ZAP Design Engine and broader Olympus project. Mandatory reading for understanding where files belong.
---

# ZAP Design Engine: Project Structure & Organization Rules

This skill defines the canonical directory structure and testing policies for the ZAP Design Engine. It is mandatory reading for all AI agents and human staff working on the codebase. Our production code must remain clean, modular, and strictly aligned with the [Core 6 Mandates](./sops/SOP-005-ATOMIC_THEME_PHYSICS.md).

## 1. Unified architecture (The ZAP Plan)

The codebase is strictly organized according to the **7-Level Atomic architecture**.

```text
src/
├── app/                      // [L5/L6] Universe & Pages (Next.js App Router)
│   ├── api/                  // Route handlers
│   ├── debug/                // Consolidated Debugger
│   │   └── zap/              // ⬅️ Single source of truth for all inspectors
│   └── lab/                  // ⬅️ Dedicated zone for experimental/testing projects
│       └── [project-name]/   // Isolated testing environments
│
├── genesis/                  // [L1/L2] The Theme-Agnostic Core Engine
│   ├── atoms/                // L1: Singular structural primitives (Buttons, Inputs, Icons)
│   ├── molecules/            // L2: Functional groups (SideNav, SearchBars)
│   └── layout/               // Base layout structural pieces
│
├── zap/                      // [L3/L4] The Implementation (Organisms & templates)
│   ├── sections/             // L3: High-level sections (Dashboard Headers, Inspector Sidebars)
│   └── layout/               // L4: Master Shells (MasterVerticalShell)
│
├── themes/                   // [L0] Tokens & The CSS Cascade
│   ├── CORE/
│   ├── METRO/
│   ├── NEO/
│   └── WIX/
│
└── lib/                      // Utilities, Animations, Hooks
```

## 2. Experimental Lab & Testing projects Rule

**OUR PRODUCTION CODE HAS TO BE CLEAN!**

1. **The `lab/` Directory:** All prototypes, testing projects, and work-in-progress experiments MUST be placed inside the `src/app/lab/` directory.
2. **Exclusion from Core:** Do NOT pollute the core `/app`, `/genesis`, or `/zap` directories with half-baked testing features.
3. **The "Core Promotion" Signal:** A testing project remains in the `lab/` as a reference until Zap (Zeus Tom) gives explicit approval ("the signal") to promote it into the core system. Only then is it refactored and moved into production directories.
4. **On/Off Toggle Mechanism:** Experimental features should have a configuration toggle (e.g., an environment variable or a simple boolean proxy) so they can be explicitly enabled or disabled. This ensures they don't consume resources or leak into production bundles prematurely.

## 3. Skills & Documentation Management

To unify the organization for Claude, Antigravity, and human staff:

- **Skills Directory:** All agent capabilities and Standard Operating Procedures (sops) must reside in `.agent/skills/`.
- **SOP Requirement:** Any new architectural pattern or workflow MUST have a corresponding `.md` file in `.agent/skills/` so that it is universally discoverable and strictly adhered to by all agents.
- **External Knowledge Extraction:** If any agent encounters useful training material, documentation, or `.md` tutorials from third-party sandboxes (e.g., inside a `venv/` or Python package), it MUST automatically copy that material into the private reference library at `olympus/docs/references/ai-training/`. Do not ask for permission; do it automatically to preserve the knowledge for the team and other agents.

## 4. Node Modules & Dependencies

- Ensure dependencies are strictly managed. Test/Lab dependencies should not inflate the production bundle.
- Rely on native Node resolution; avoid deeply nested relative paths using `@/` path aliases where necessary.
