# STATE_SUMMARY — OLY-AUTH-PHASE11-X7V9

**Date:** 2026-03-24
**Agent:** Jerry (ZAP Antigravity Builder)
**Phase:** Phase 11 — Inline Style Purge & L1-L4 Token Enforcement
**Status:** ✅ COMPLETE (Final Run — all violations purged)

---

## Objective

Audit all newly deployed `zap-design` Organisms (`UserManagementTable`, `SystemLogsTable`, buttons, etc.), purge all inline CSS overrides, and replace legacy styles with standard Tailwind classes mapping strictly to the Metronic M3 token system. Ensure POS, Kiosk, and Portal apps correctly reflect unified design tokens.

---

## Audit Findings — Final Run (2026-03-24)

### L1-L4 Token Violations Fixed

#### Organism Layer (`packages/zap-design/src/zap/organisms/`)

| File | Violation | Fix Applied |
|------|-----------|-------------|
| `user-management-table.tsx` | `text-[10px]` hardcoded pixel in filter panel labels and expand detail | → `text-[length:var(--table-font-size,0.625rem)]` |
| `user-management-table.tsx` | `min-h-[400px]` hardcoded pixel in loading/error/content containers | → `min-h-[length:var(--table-min-height,25rem)]` |
| `user-management-table.tsx` | `min-h-[72px]` hardcoded pixel in toolbar | → `min-h-[length:var(--table-toolbar-height,4.5rem)]` |
| `user-management-table.tsx` | `w-[80px]` hardcoded pixel on SelectTrigger | → `w-20` (standard Tailwind token) |
| `user-management-table.tsx` | `whileHover={{ backgroundColor: "var(--color-surface-variant, rgba(0,0,0,0.02))" }}` redundant framer inline style | Removed; Tailwind hover class handles it |
| `system-logs-table.tsx` | `text-[10px]` (×7 occurrences) in all filter panel section labels and expand details | → `text-[length:var(--table-font-size,0.625rem)]` |
| `system-logs-table.tsx` | `min-h-[400px]` in content container | → `min-h-[length:var(--table-min-height,25rem)]` |
| `system-logs-table.tsx` | `min-h-[72px]` in toolbar | → `min-h-[length:var(--table-toolbar-height,4.5rem)]` |
| `system-logs-table.tsx` | `w-[80px]` on SelectTrigger | → `w-20` |
| `system-logs-table.tsx` | `whileHover={{ backgroundColor: "..." }}` redundant framer inline style | Removed |

#### App Layer (`apps/pos/`, `apps/kiosk/`)

| File | Violation | Fix Applied |
|------|-----------|-------------|
| `apps/pos/src/app/page.tsx` | `bg-zinc-950`, `bg-zinc-900`, `border-zinc-800`, `text-zinc-400`, `text-zinc-500`, `text-zinc-300`, `bg-zinc-800`, `text-indigo-400`, `text-white`, `font-sans`, `rounded-2xl`, `rounded-3xl`, `shadow-2xl` — all raw Tailwind palette, no token mapping | → `bg-layer-canvas`, `bg-layer-panel`, `border-border`, `text-muted-foreground`, `text-on-surface`, `bg-surface-variant`, `text-primary`, `text-foreground`, `font-body`, `rounded-[length:var(--radius-card,8px)]`, `shadow-[var(--elevation-4,...)]`; added `font-display text-transform-primary` to headings |
| `apps/kiosk/src/app/page.tsx` | Same violations as POS plus `text-emerald-400` | Same fixes; `text-emerald-400` → `text-primary` |

#### Previous Run (already fixed)
| File | Violation | Status |
|------|-----------|--------|
| `system-logs-table.tsx` | `text-green-500`, `text-yellow-500` in statusStyles | ✅ Fixed prior run |
| `apps/portal/src/app/page.tsx` | Full raw palette (`bg-zinc-950`, `text-red-500`, etc.) | ✅ Fixed prior run |

---

## Organisms Audited — Final Status

| File | Status |
|------|--------|
| `packages/zap-design/src/zap/organisms/user-management-table.tsx` | ✅ L1-L4 Fully Compliant |
| `packages/zap-design/src/zap/organisms/system-logs-table.tsx` | ✅ L1-L4 Fully Compliant |
| `apps/pos/src/app/page.tsx` | ✅ Token-compliant after this run |
| `apps/kiosk/src/app/page.tsx` | ✅ Token-compliant after this run |
| `apps/portal/src/app/page.tsx` | ✅ Token-compliant (fixed prior run, confirmed) |

### Excluded (Intentional Dynamic Inline Styles)

The following files use `style={{ }}` for **computed/dynamic values** that cannot be expressed as static Tailwind classes. These are exempt per audit policy:

- `DraggableToolbox.tsx` — `style={{ left: position.x, top: position.y }}` (drag position)
- `ColorInspectorPanel.tsx` — `style={{ backgroundColor: seedColor }}` (live color computation)
- `PaletteGridStage.tsx` — `style={{ backgroundColor: hexBg }}` (M3 palette generation)
- `TypographyCanvasStage.tsx` — `style={{ lineHeight, fontFamily, letterSpacing, transform }}` (live typography preview)
- `TypographyTokenStage.tsx` — `style={{ fontFamily, textTransform, fontSize }}` (token preview)

These are **factory/laboratory** components that render dynamic computed values from the M3 algorithm — inline styles are the correct and only viable approach for these.

---

## Apps Compliance Summary — Final

| App | L1-L4 Issues Found | Status |
|-----|-------------------|--------|
| `apps/pos` | 13 raw palette classes in page.tsx (zinc, indigo) | ✅ Fixed — all token-based |
| `apps/kiosk` | 14 raw palette classes in page.tsx (zinc, emerald) | ✅ Fixed — all token-based |
| `apps/portal` | Fixed prior run (zinc, red classes) | ✅ Confirmed compliant |

---

## Inline Style Inventory — Remaining Legit Uses

All remaining `style={{ }}` occurrences in non-factory components:

| File | Usage | Verdict |
|------|-------|---------|
| `genesis/layout/VerticalNav.tsx` | `style={{ width: isCollapsed ? 74 : width }}` | Dynamic number — exempt |
| `genesis/layout/Inspector.tsx` | `style={{ width }}` | Dynamic number — exempt |
| `genesis/atoms/surfaces/canvas.tsx` | Dynamic canvas dimensions | Exempt |
| `genesis/atoms/status/badges.tsx` | `style={{ minHeight: 'var(--badge-height, auto)' }}` | Token var fallback — borderline; acceptable |
| `genesis/atoms/status/pills.tsx` | `style={{ height: 'var(--pill-height, auto)' }}` | Token var fallback — borderline; acceptable |
| `genesis/molecules/cards/MetroFeatureCard.tsx` | `style={{ color: "var(--md-sys-color-on-surface)" }}` | M3 CSS variable — acceptable |
| `genesis/molecules/navigation/PlatformToggle.tsx` | `style={{ borderRadius: 'calc(var(--button-border-radius, 8px) + 4px)' }}` | CSS calc with token var — acceptable |
| `genesis/atoms/interactive/option-select.tsx` | Dynamic background from theme | Exempt — theme-driven |
| `genesis/atoms/interactive/buttons.tsx` | Dynamic from token | Exempt — token-driven |
| `genesis/atoms/interactive/progress.tsx` | `transform: translateX(...)` — animation value | Exempt — dynamic |
| `genesis/molecules/ai-prompt-box.tsx` | Hardcoded hex `#1F2023`, `#9b87f5`, etc. | ⚠️ FLAGGED — not fixed this phase (ai-prompt-box is out of L3-L5 scope for this phase) |

---

## Not In Scope (Phase 11)

- `ai-prompt-box.tsx` — Dozens of hardcoded hex colors for its dark-mode AI UI. Flagged for **Phase 12**.
- Typography/Color Factory organisms — Dynamic inline styles are architecturally intentional.
- CORE/NEO/WIX theme compliance — Only METRO M3 token mapping was the target.

---

## Token Mapping Reference Used

| Raw Class | Token Class | Source |
|-----------|-------------|--------|
| `text-green-500` / `text-green-700` | `text-success` | METRO semantic token |
| `bg-green-500` | `bg-success` | METRO semantic token |
| `text-yellow-500` | `text-warning` | METRO semantic token |
| `bg-zinc-950` | `bg-layer-canvas` | METRO layer token |
| `bg-zinc-900` | `bg-layer-panel` | METRO layer token |
| `text-white` | `text-foreground` | METRO foreground token |
| `text-zinc-300` / `text-zinc-400` | `text-muted-foreground` | METRO muted token |
| `bg-red-950/40` | `bg-destructive/10` | METRO destructive token |
| `text-red-500` | `text-destructive` | METRO destructive token |
| `border-red-900` | `border-destructive/30` | METRO destructive token |
| `text-rose-400` | `text-primary` | METRO primary token |
| `font-sans` | `font-body` | METRO typography token |
| `uppercase` | `text-transform-primary` | METRO typography token |
| `rounded-2xl` (hardcoded) | `rounded-[length:var(--radius-card,8px)]` | METRO physics token |
| `text-[10px]` (hardcoded px) | `text-[length:var(--table-font-size,0.625rem)]` | METRO table token |
| `min-h-[400px]` (hardcoded px) | `min-h-[length:var(--table-min-height,25rem)]` | METRO table token |
| `min-h-[72px]` (hardcoded px) | `min-h-[length:var(--table-toolbar-height,4.5rem)]` | METRO table token |
| `w-[80px]` (hardcoded px) | `w-20` | Standard Tailwind spacing |
| `text-indigo-400` | `text-primary` | METRO primary token |
| `text-emerald-400` | `text-primary` | METRO primary token |
| `text-zinc-300` | `text-on-surface` | METRO surface token |
| `bg-zinc-800` (code bg) | `bg-surface-variant` | METRO surface token |
