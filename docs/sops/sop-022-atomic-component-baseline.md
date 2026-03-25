# SOP-022-ATOMIC-COMPONENT-BASELINE

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** B.L.A.S.T. / COMPONENT-ASSEMBLY

---

## 1. Context & Purpose
This SOP governs the foundational rendering and styling restrictions for all atomic components and UI structures within the ZAP Design Engine. It exists as permanent systemic memory to prevent agents and engineers from falling back onto "lazy" hardcoded Tailwind utility classes instead of trusting the programmatic Material 3 (M3) inheritance via `zap_foundation.md`.

## 2. The Golden Rule of Theming
**Never hardcode a color or font style if a dynamic context variable exists.** 

The entire point of the ZAP Design Engine is theme flexibility. If you hardcode `bg-muted` or `text-brand-midnight` onto a primitive root component like `<Button>`, you immediately break its ability to adapt to Dark Mode, Light Mode, or Custom Brand Themes.

## 3. Typography Mandates
1. **NO Hardcoded Display Fonts:** Do NOT use `font-display` on generic labels, subtext, or buttons. `font-display` is strictly reserved for primary `H1`/`H2` headers.
2. **NO Hardcoded Uppercase:** Do NOT use the raw `.uppercase` class on buttons or labels. Use `text-transform-primary` or `text-transform-secondary`. This allows the user to change the casing via the Typography Inspector globally.
3. **Primary Body Font:** The default font for almost all atomic UI structures must be `font-body`.
4. **Mandatory Casing Pairing:** Whenever you apply a typography token (`font-display`, `font-body`), you **MUST** consciously pair it with its corresponding casing token (`text-transform-primary`, `text-transform-secondary`). Never assume default casing is acceptable for UI elements like Accoridons, Dialogs, or Alerts.

## 4. Class Merging & Inheritance
When building or refactoring components (e.g., inside `src/genesis/atoms`):
1. **Always Use CN:** Strings must NOT be manually concatenated (e.g., ``className={`${base} ${className}`}``). You **MUST** use the `cn()` utility (`import { cn } from '@/lib/utils';`) to allow the parent consumer to safely override base component classes.
2. **Default to M3:** A button's "solid" variant should default to `bg-primary text-on-primary`, NOT a static hex or brand color. Its "disabled" state should default to `bg-on-surface/10 text-on-surface/40`, adhering to material specifications rather than random `opacity-50` or `bg-muted`.

## 5. Component Theming & Dependencies
1. **Never Bypass the ZAP Button Atom:** If a component (e.g., Alert, Dialog, Toast) requires a dismissal "X" or arbitrary action trigger, you **MUST NOT** use a generic native HTML `<button>` or an unstyled Radix Primitive. You **MUST** import and compose the ZAP `<Button>` component (e.g., `<Button variant="ghost" size="icon">`). This ensures hover states, focus rings, and sizing perfectly aligns with the global M3 theme configuration rather than degrading into bespoke UI.

## 6. Organism Composition & Data Testing (The "No Blind Builds" Protocol)
1. **Mandatory Recon:** Before assembling an Organism (like a Data Grid or Dashboard), you must search the `genesis/` directory for existing weapons. If you need a search bar, use the L3 `SearchInput`, not a raw Shadcn `Input`. If you need a status indicator, use the `Pill` atom, not a generic `Badge`. Bypassing the engineered atomic arsenal is a critical architectural violation.
2. **Zero Tolerance for Raw Interactive Tags:** When building high-level components, you absolutely cannot use raw HTML `<button>`, `<input>`, or `<select>` tags, or generic `<div>` wrappers for interactivity. Every interactive piece must map back to an audited ZAP L3/L4 component to ensure M3 tokens cascade correctly.
3. **Overload the Mock Data:** You cannot verify grid, list, or pagination math with 3 rows of data. When building Data Grids or complex lists, overload the mock dataset (e.g., 25+ rows) immediately to stress-test the component boundaries, breakpoints, and mathematical rendering logic on step one.

## 7. Violations
Any code pushed that utilizes `bg-zinc-800`, `text-[12px]`, `font-sans`, opacity hacks for semantic backgrounds (`bg-primary/10`), native generic `<button>`s, or `uppercase` on core atomic foundation files (unless explicitly bypassing for a verified reason) is considered a critical architecture break. The same applies to building Organisms out of raw HTML instead of the audited Atomic registry. Own the standard.
