# L3 Panel Data Dictionary (Core Theme)

> [!IMPORTANT]
> **ZAP-AUDIT DIRECTIVE:** This file is the absolute source of truth for the **L3 Panel Layer**. The `zap-audit` skill must use this to verify the structural integrity of UI containers, cards, and modal elements.

## 1. Definition & Role
The **L3 Panel** operates as an internal bounded container within the L2 Sandbox. It encompasses all floating sub-surfaces (e.g., Cards, Sidebars, Modals, Accordions, Data Grids). It defines the containment physics separating L4 Atoms (buttons, typography) from bleeding into the primary sandbox.

## 2. Structural Tokens
- **Mandatory Background:** `bg-layer-panel` (Secondary/Tertiary layers may use variants like `bg-layer-dialog` or `bg-layer-menu`).
- **Dynamic Borders:** `style={{ borderRadius: 'var(--layer-3-border-radius)' }}`.
- **Dynamic Padding:** Use `style={{ padding: 'var(--layer-3-padding)' }}` rather than hardcoded `p-5` when wrapping complex content grids.

## 3. Topographic Rules
1. **Absolute Containment:** L3 panels *must* exist within an L2 sandbox wrapper.
2. **Viewport Boundaries:** L3 components cannot utilize `min-h-screen` viewport bleeding (reserved strictly for L1).
3. **Atomic Encapsulation:** All text and interactive controls (L4 Atoms) must be housed inside an L3 Panel array, rather than resting directly on L2 raw backgrounds where conceptually isolated.

## 4. Mandatory Audit Grep Scans
The `zap-audit` process MUST flag any violation of the L3 structural contract.

```bash
# Sweep for rogue padding utilties on L3 panels acting as master cards
grep -rE 'class(Name)?="[^"]*bg-layer-(panel|dialog)[^"]*p-[4-8]' src/ --include="*.tsx"

# Sweep for hardcoded structural radiuses mapped onto L3 panels
grep -rE 'class(Name)?="[^"]*bg-layer-(panel|dialog)[^"]*rounded-' src/ --include="*.tsx"

# Sweep for legacy white background container cards mimicking L3 behavior
grep -rE 'class(Name)?="[^"]*bg-white[^"]*rounded-[md|lg|xl|2xl]' src/ --include="*.tsx"
```

## 5. Resolution Guide for `zap-fix`
If an L3 UI element fails the audit:
1. Identify generic containers using legacy 'ghost classes' (`bg-white rounded-xl shadow-sm p-5`).
2. Replace structural geometry with dynamic CSS variables: `style={{ borderRadius: 'var(--layer-3-border-radius)', padding: 'var(--layer-3-padding)' }}`.
3. Replace the background color utility with `bg-layer-panel` or its context-specific variant.
4. Ensure internal L4 atoms (Headings, Text) inherit their boundaries correctly rather than relying on the stripped padding ghost classes.
