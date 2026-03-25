# Button Theme-Sync: Data-Attribute CSS Variable Resolution

**Date:** 2026-03-24
**Status:** Implemented
**Scope:** Genesis Button atom, Button Lab publish action, login pages, theme assignments

## Problem

The Button atom used CVA compound variants to resolve visual styles at React render time. When a user configured a button in the Button Lab and hit "Publish to metro theme", the CSS variables were written to `theme-metro.css` but never consumed by the Button atom. The published settings were dead.

## Decision

**Theme controls visuals, props select roles.** Pages still pass `visualStyle` (solid/outline/ghost/elevated/tonal) and `color` (primary/secondary/tertiary/destructive) to select the button's semantic role. The theme defines what each role looks like via CSS custom properties.

## Architecture

### 1. Button Atom (`buttons.tsx`)

CVA handles only structural layout (`size`, `iconPosition`). Visual resolution is driven by CSS via data attributes.

The Button renders `data-visual`, `data-color`, and `data-variant` attributes based on props (defaulting to solid/primary/flat). CSS selectors in `genesis-button.css` match these attribute combinations and apply visuals from theme-overridable CSS variables.

```tsx
<button
  className="genesis-btn {size classes} {iconPosition classes}"
  data-visual="outline"
  data-color="primary"
  data-variant="flat"
  style={{
    borderRadius: 'var(--button-border-radius, 9999px)',
    borderWidth: 'max(var(--button-border-width, 1px), 1px)',
    borderStyle: 'var(--button-border-style, solid)',
  }}
/>
```

Props `visualStyle`, `color`, and `variant` are kept for role selection. Legacy shadcn variant mapping is preserved for backward compatibility.

### 2. CSS File (`src/styles/genesis-button.css`)

Contains 20 `visualStyle x color` selectors (5 visual styles x 4 colors), each reading from theme-overridable CSS variables with M3 token fallbacks:

```css
.genesis-btn[data-visual="solid"][data-color="primary"] {
  background: var(--button-solid-primary-bg, var(--color-primary));
  color: var(--button-solid-primary-text, var(--color-on-primary));
  border-color: var(--button-solid-primary-border, transparent);
}
```

Also contains:
- Hover states for all 20 combinations
- 4 variant effects (flat/soft/neo/glow) using `currentColor`
- Active, disabled states
- Text shadow for solid buttons

### 3. Publish Action (`button/page.tsx`)

The `buildPublishPayload()` function generates resolved CSS variables for all 20 combinations when publishing. These override the fallbacks in `genesis-button.css`:

- `--button-{visual}-{color}-bg`
- `--button-{visual}-{color}-text`
- `--button-{visual}-{color}-border`
- `--button-{visual}-{color}-bg-hover`

Plus structural variables: padding, border-width, border-radius, icon-gap, variant-style, visual-style, color, size, icon-position.

### 4. Theme Assignments

| App | Port | Theme |
|---|---|---|
| zap-design | 3000 | metro (design engine) |
| POS | 3001 | theme-core |
| Kiosk | 3002 | theme-core |
| Portal | 3003 | theme-metro |

**CORE theme:** JetBrains Mono everywhere, UPPERCASE headings, lowercase body, 0px border-radius, `soft` variant, `solid` visual style.

**METRO theme:** Pacifico cursive (display/body), JetBrains Mono (dev), UPPERCASE body, 22px border-radius, `flat` variant, `solid`/`tonal` visual style.

## Files

### Created
| File | Purpose |
|---|---|
| `src/styles/genesis-button.css` | Data-attribute CSS selectors for 20 visual x color combos + variant effects |

### Modified
| File | Change |
|---|---|
| `src/genesis/atoms/interactive/buttons.tsx` | Stripped CVA compound variants. Added `genesis-btn` class + data attributes. Kept props for role selection. |
| `src/app/design/zap/atoms/button/page.tsx` | Added `buildPublishPayload()` to emit resolved CSS variables for all combinations |
| `src/app/globals.css` | Added `@import "../styles/genesis-button.css"` |
| `src/components/ui/FoundationLogin.tsx` | Added text-transform and typography classes |
| `apps/portal/src/app/layout.tsx` | Changed to `theme-metro`, added Pacifico font |
| `apps/pos/src/app/layout.tsx` | Added proper fonts, set `theme-core` |
| `apps/kiosk/src/app/layout.tsx` | Added proper fonts, set `theme-core` |
| `src/zap/organisms/system-logs-table.tsx` | Added `'use client'` directive (Portal fix) |

## Constraints

- Props select roles, theme controls visuals. No escape hatches for overriding theme visuals per-instance.
- No `'use client'` requirement on the Button atom.
- No FOUC — CSS variables resolve at paint time.
- CSS fallback chain: theme override → M3 color tokens → hardcoded baseline.
