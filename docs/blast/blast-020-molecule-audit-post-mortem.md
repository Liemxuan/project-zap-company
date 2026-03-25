# BLAST-020: L4 Molecule Audit Post-Mortem & Root Cause Analysis

**Status:** ACTIVE
**Objective:** Document the root causes of recurring L1/L2 theme violations in L4 Molecule components to prevent regression during agent (Spike) code generation phases. 

---

## 🛑 The Core Problem: Why Does This Keep Happening?

Despite the implementation of the ZAP Design Engine and M3 token system, recurrent theme violations (hardcoded colors, stripped typography casing, un-networked buttons) persist across our UI structures. An intensive audit of L4 Molecules (`Alert`, `Dialog`, `Accordion`, `Tabs`, `Form`, etc.) revealed three primary root causes for this regression:

### 1. LLM Pre-training Bias vs. System Context (Tailwind/Radix Defaulting)
Agents like Spike are heavily pre-trained on public Shadcn/Radix/Tailwind patterns. When asked to build a standard UI component, their primary instinct is to hallucinate standard utility classes (`bg-muted`, `text-destructive`, `shadow-md`) rather than searching the local context for our proprietary M3 semantic analogs (`bg-surface-variant`, `text-error`, `shadow-[var(--md-sys-elevation-level2)]`).
* **The Fix:** We must ruthlessly enforce context injection (SOP-022) before Spike generates code. If an agent tries to output `bg-muted`, it must be hard-corrected to use M3 semantics.

### 2. The "Native Bypass" (Failure to Compose Atoms)
When generating dismissal triggers, close icons, or arbitrary interactive zones inside larger molecules, agents frequently write raw HTML `<button className="p-2 hover:bg-muted" />` or manually style `<DialogPrimitive.Close>`. 
* **The Consequence:** This completely bypasses the ZAP `<Button>` atom. The resulting component fails to inherit the global `devMode` wrappers, M3 focus rings, motion states, and structural system consistency.
* **The Fix:** Any interactive trigger inside a molecule must compose the ZAP `<Button>` atom (e.g., `<Button variant="ghost" size="icon" asChild>`).

### 3. The Typography / Casing Unpairing
In the ZAP hierarchy, a font face (`font-display`, `font-body`) is inextricably linked to a casing behavior, but these exist as separate utility tokens to allow global toggling via the Inspector. Agents consistently apply the font face token but "forget" to pair it with its corresponding casing token (`text-transform-primary`, `text-transform-secondary`).
* **The Consequence:** Headers shrink, accordions look like normal paragraph text, and UI hierarchy collapses because the text fails to capitalize/transform according to the overarching theme engine.
* **The Fix:** Agents must be instructed that typography tokens are binary pairs. You cannot have `font-display` without a `text-transform-*` suffix.

---

## 🛠️ Actionable Agent Governance (For Spike/Ralph)

When building or refactoring UI components, agents MUST run validation against this checklist:

- [ ] **Surface Check:** Does the background use an M3 layer (`bg-surface`, `bg-surface-variant`, `bg-error-container`) instead of legacy opacity hacks (`bg-primary/10`)?
- [ ] **Structural Dependency:** Are ALL buttons and triggers routed through `import { Button } from '@/components/ui/button'`? Are there zero raw `<button>` HTML tags?
- [ ] **Casing Pairs:** Did I include a `-transform-` token next to every `font-` token applied?
- [ ] **Dynamic Shadows:** Are shadows mapped to `--md-sys-elevation-levelX` instead of arbitrary Tailwind translations?

*This document is attached to the BLAST protocol to serve as mandatory context for automated styling and structural derivation.*
