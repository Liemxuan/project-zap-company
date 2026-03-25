---
name: zap-layer-surface-dev-color
description: Use when tagging UI surfaces with M3 layer tokens (bg-layer-*) and dev debug colors. Triggers on "layer surface", "dev color", "tag layers", "surface audit", "untagged surface", or when a page has structural containers using inline backgroundColor styles instead of semantic layer classes.
---

# Layer Surface — Apply Dev Color

Step-by-step procedure for identifying untagged structural surfaces on any ZAP page and applying the correct `bg-layer-*` class + `debug-l*` tag so the Elevation Inspector page can govern opacity, border-radius, and border-width per layer.

## Prerequisites

**REQUIRED BACKGROUND:** Read `zap-l1-l2-layer-audit` for the full layer hierarchy and rules.

## Quick Reference

| Layer | Class              | Debug Tag        | Dev Color | Use For                              |
|-------|--------------------|------------------|-----------|--------------------------------------|
| L0    | `bg-layer-base`    | `debug-l0-cad`   | gray      | Document root                        |
| L1    | `bg-layer-canvas`  | —                | red       | `<main>` (MetroShell)                |
| L2    | `bg-layer-cover`   | —                | yellow    | Content sandbox cards                |
| L3    | `bg-layer-panel`   | `debug-l3`       | green     | Inspector shells, section cards, nav |
| L4    | `bg-layer-dialog`  | `debug-l4`       | purple    | Elevated headers inside L3, popovers|
| L5    | `bg-layer-modal`   | —                | pink      | Full-screen blocking overlays        |

## Procedure

### Step 1: Identify Untagged Surfaces

Scan the target file for inline background assignments on structural containers:

```bash
# Find inline backgroundColor on structural elements
grep -n 'style={{.*backgroundColor' <target-file>

# Find hardcoded surface hex values in Tailwind classes
grep -n 'bg-\[#' <target-file>

# Find raw M3 surface token usage (should be layer classes)
grep -n 'bg-surface-container\b' <target-file>
```

### Step 2: Classify Each Surface

For each hit, determine:

1. **Is it a structural container?** (card shell, section wrapper, inspector region, header bar)
   → **TAG IT** with `bg-layer-*`
2. **Is it a button, pill, badge, or tab?**
   → **OMIT** — these have their own M3 color roles
3. **Is it a dynamic color preview?** (Swatch, phone mockup, tonal matrix cell)
   → **EXEMPT** — must use inline `style` for computed values
4. **Is it a semantic M3 role?** (e.g., `bg-secondary-container` on a contextual card)
   → **Keep as semantic class** — no layer tag needed

### Step 3: Determine Layer Depth

Use the **Strict Ascension Rule**:

```
Page Canvas (L1) 
  └─ Content Card (L2: bg-layer-cover)
       └─ Section Container (L3: bg-layer-panel debug-l3)
            └─ Elevated Header (L4: bg-layer-dialog debug-l4)
```

- If the surface is **inside L2 Cover** → it's L3 or L4
- If the surface is **a header inside L3** → it's L4
- **Never nest L0 or L1 inside L2+** — this is a terminal violation

### Step 4: Apply the Tag

Replace the inline style with the layer class:

```tsx
// ❌ BEFORE: Inline style, invisible to elevation controls
<section style={{ backgroundColor: hexFromArgb(scheme.surfaceContainerLowest) }}>

// ✅ AFTER: Tagged, dev-color-visible, elevation-controllable
<section className="bg-layer-panel debug-l3">
```

### Step 5: Clean Up Dead Variables

After replacing inline styles, remove any now-unused variables:

```tsx
// ❌ Remove if no longer referenced
const containerBg = hexFromArgb(scheme.surfaceContainerLowest);
const headerBg = hexFromArgb(isDark ? scheme.surfaceContainerHigh : scheme.surfaceContainerLow);
```

### Step 6: Verify Lint

Run the linter to confirm no unused variable warnings remain:

```bash
npx next lint --filter <target-file>
```

### Step 7: Remove Hardcoded Borders on L2 Covers

Per the Zero-Hardcoded-Border Rule (see `zap-l1-l2-layer-audit`), if you are tagging an L2 Cover (`bg-layer-cover`), you MUST simultaneously strip any hardcoded border or radius utility classes (e.g., `border`, `border-border`, `rounded-xl`). The L2 Cover inherits its structural geometry natively from the theme's `COMPONENT_BORDER_MAP`.

## Real-World Example: Colors Page

**Before audit:** 5 structural surfaces using `style={{ backgroundColor }}` — invisible to elevation controls.

| Surface                    | Before                                        | After                            |
|---------------------------|-----------------------------------------------|----------------------------------|
| ThemeGrid container       | `style={{ bg: containerBg }}`                 | `bg-layer-panel debug-l3`       |
| ThemeGrid header          | `style={{ bg: headerBg }}`                    | `bg-layer-dialog debug-l4`      |
| FixedGrid container       | `style={{ bg: bg }}`                          | `bg-layer-panel debug-l3`       |
| TonalMatrixGrid container | `style={{ bg: bg }}`                          | `bg-layer-panel debug-l3`       |
| Seed picker card          | `style={{ bg: secondaryContainer }}`          | `bg-secondary-container`        |

**Omitted:** Publish button, upload button, scheme variant tabs, tonal slider dots — all interactive elements.

## Common Mistakes

| Mistake | Fix |
|---------|-----|
| Tagging a button with `bg-layer-*` | Buttons use M3 color roles, not layer tokens |
| Using `bg-surface-container` instead of `bg-layer-panel` | Layer classes include dev-mode visibility; raw surface tokens don't |
| Nesting `bg-layer-canvas` inside `bg-layer-cover` | Violates Strict Ascension — inner layers must be L3+ |
| Forgetting `debug-l3` / `debug-l4` tag | Surface won't be visible in elevation dev mode |
| Leaving `const bg = ...` after removing inline style | Lint error — clean up dead variables |
