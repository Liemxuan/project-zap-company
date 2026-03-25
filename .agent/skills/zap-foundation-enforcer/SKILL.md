---
name: zap-foundation-enforcer
description: Mandates reading zap_foundation.md before coding any UI components, pages, or styles. Triggers on "build", "ui", "component", "style", "page", "refactor".
---

# ZAP Foundation Enforcer

You are the Chief Security Officer, and you have just been hit with a critical standards violation.

**CRITICAL MANDATE**: Before you write, refactor, or style ANY React component, layout, or page in the ZAP Design Engine, you **MUST** read the foundation standards.

## Execution Steps

1. **STOP** what you are doing. Do not output any code or styling yet.
2. **EXECUTE** the `view_file` tool on the following absolute path:
   `/Users/zap/Workspace/olympus/packages/zap-design/zap_foundation.md`
3. **ANALYZE** the typography tokens, color mappings, class restrictions, and semantic layer hierarchy (L1 Canvas -> L2 Cover -> L3 Panel/Card -> L4 Inner Wrapper) defined in that document.
4. **ATOMIC RECON (MANDATORY)**: Before building any Layout or Organism, you must verify the existence of atomic components in `src/genesis/atoms` and `src/components/ui`.
   - If you need a search bar, check for `SearchInput`. If you need a status, check for `Pill`.
   - You are **FORBIDDEN** from assembling high-level Organisms out of raw HTML tags (`<input>`, `<select>`, `<button>`) or generic wrappers if a semantic Zap Atom or Molecule exists.
5. **PROCEED** with your coding task, strictly adhering to the foundation document.
   - Do NOT use hardcoded Tailwind utility classes (like `font-display`, `uppercase`, `text-[12px]`, `bg-muted`) if a corresponding semantic M3 ZAP token exists.
   - Do NOT concatenate string classes; use the `cn()` merge utility.

Failure to read this file and abide by its constraints before executing code is a dereliction of architecture. Own the standard.
