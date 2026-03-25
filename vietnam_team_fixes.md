# Vietnam Team Fix Guide — ZAP L1-L7 Compliance

**Date:** 2026-03-17
**Prepared by:** Spike + Team Claud (AI Audit) + Blast-v1 (automated fixes)
**Status:** Post-blast. Mechanical fixes applied. Remaining items require human implementation.

---

## What Was Already Fixed (Blast-v1)
- ✅ `useTheme` / `ThemeContext` injected into all 26 applicable METRO pages
- ✅ AppShell added to `geometry`, `login`, `dashboard`, `kanban` (METRO)
- ✅ `login` shadcn Button/Input/Card → genesis equivalents
- ✅ 37 raw `<button>` elements → `<Button>` from `@/genesis/atoms/interactive/buttons`
- ✅ All CORE molecule inspector footers use genesis Button
- ✅ `quick-navigate` + `service-selection` Button import migrated to genesis
- ✅ TODO(Vietnam) comments added to 9 CORE molecule sandbox pages

---

## Remaining Issues by Priority

### 🔴 CRITICAL — Full Rebuild Required

These pages have systemic L1 token violations that require a complete rewrite. Do not patch inline — rebuild from a compliant template.

---

#### `metro/combat-signin` — Score: 53/100
**File:** `src/app/design/metro/combat-signin/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 28 | Right panel: `bg-white`, `bg-slate-50`, `bg-blue-600`, `bg-indigo-100` — zero token compliance |
| L3 | 48 | Raw HTML elements remain |
| L4 | 58 | No genesis molecules |
| L6 | 32 | No layout shell — custom inline layout |

**Fix:** Full rebuild using `AppShell` + genesis components. All colors must come from M3 tokens (`bg-layer-*`, `bg-primary`, `text-on-surface`, etc). Reference `activities/page.tsx` as a compliant template.

---

#### `metro/template` — Score: 54/100
**File:** `src/app/design/metro/template/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 38 | Inspector wireframe: `bg-slate-50`, `bg-white`, `bg-blue-500` throughout |
| L3 | 48 | Raw `<div>` used as buttons |
| L6 | 38 | No layout shell |

**Fix:** Strip all hardcoded Tailwind palette classes. Replace with M3 token equivalents. Wrap in `AppShell`. Replace `<div onClick>` with `<Button>`.

---

#### `metro/colors` — Score: 61/100
**File:** `src/app/design/metro/colors/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 38 | `bg-[#F1F3F5]`, `text-[#2C3E50]` in className. `style={{backgroundColor}}` inline overrides throughout |
| L3 | 52 | Inspector uses raw HTML elements |
| L6 | 58 | No shell |

**Fix:** The color tool intentionally shows hex values as *content* — separate the display data from the layout tokens. Use `style` only for the color preview swatch, use tokens for all chrome/layout elements.

---

#### `core/colors` — Score: 65/100
**File:** `src/app/design/core/colors/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 28 | 40+ `style={{backgroundColor/color/borderColor}}` with `hexFromArgb()` values. Hardcoded hex: `#cccccc`, `#FF5722`, `#FF68A5`, `#000`, `#fff`, `#F1F3F5`, `#E5E7EB` |
| L2 | 62 | Raw `<img src=>` for seed preview (line 1385) |

**Fix:** Move hex values to a data array, only use `style` on the preview swatch element itself. Replace `<img>` with `<Image>` from Next.js or genesis icon component. All layout chrome must use tokens.

---

### 🟠 MEDIUM — Targeted Fixes

---

#### `metro/icons` — Score: 66/100
**File:** `src/app/design/metro/icons/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 42 | Inspector panel: `bg-white`, `bg-zinc-100`, `text-slate-500`, `bg-black`, `text-white` |
| L6 | 58 | No shell wrapping for inspector overlay |
| L7 | 62 | ThemeContext present but inspector violates token rules |

**Fix:** Replace all non-token classes in the inspector panel. `bg-white` → `bg-layer-panel`, `text-slate-500` → `text-on-surface-variant`, `bg-black` → `bg-inverse-surface`, `text-white` → `text-inverse-on-surface`.

---

#### `metro/color_goal` — Score: 69/100
**File:** `src/app/design/metro/color_goal/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 62 | Hardcoded `#576500` seed color in className |
| L3 | 58 | Raw `<button>` in inspector panel |
| L6 | 65 | No shell |

**Fix:** Move `#576500` to a data constant, not a className. Replace `<button>` with `<Button variant="ghost">`. Wrap with `AppShell`.

---

#### `metro/settings_demo` — Score: 60/100
**File:** `src/app/design/metro/settings_demo/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L3 | 38 | All UI from `@/components/ui/` — Button, Input, Label, Switch |
| L4 | 52 | shadcn Card, Form composition |
| L7 | 62 | ThemeContext present, but no genesis atoms used |

**Fix:** Replace all `@/components/ui/` imports:
- `Button` → `@/genesis/atoms/interactive/buttons`
- `Input` → `@/genesis/atoms/interactive/inputs`
- `Card` → `@/genesis/atoms/surfaces/card`
- `Label`, `Switch` → check genesis atoms directory

---

#### `metro/lab/experimental-header` — Score: 60/100
**File:** `src/app/design/metro/lab/experimental-header/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 38 | `bg-[#5A6B29]`, `bg-red-500/10` — raw Tailwind palette |
| L2 | 68 | Inline SVG used directly |
| L4 | 62 | shadcn-style token usage |
| L6 | 48 | No layout shell |

**Fix:** `bg-[#5A6B29]` → `bg-primary` (or nearest semantic token). Replace inline SVG with `<Icon>` from genesis. Wrap with `AppShell`.

---

#### `metro/lab/inspector` — Score: 62/100
**File:** `src/app/design/metro/lab/inspector/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 48 | `style={{backgroundColor}}` inline overrides |
| L2 | 68 | Raw `<img>` for seed thumbnails |
| L4 | 62 | No genesis molecule composition |
| L6 | 48 | No layout shell |

**Fix:** `style={{backgroundColor: X}}` → `className="bg-[token]"` using M3 tokens. `<img>` → Next.js `<Image>` or genesis `<Avatar>`. Wrap with `AppShell`.

---

#### `metro/diagrams` — Score: 70/100 (borderline)
**File:** `src/app/design/metro/diagrams/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 65 | shadcn tokens (`text-muted-foreground`, `text-foreground`) |
| L6 | 52 | No layout shell |
| L7 | 65 | Partial ThemeContext — some shadcn color tokens still present |

**Fix:** Replace `text-muted-foreground` → `text-on-surface-variant`, `text-foreground` → `text-on-surface`. Wrap with `AppShell`.

---

#### `metro/dashboard` — Score: 71/100 (borderline)
**File:** `src/app/design/metro/dashboard/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 65 | Non-token Tailwind classes in inline layout |
| L3 | 65 | Raw elements in sidebar |
| L6 | 62 | AppShell outer wrap added but inner `flex h-screen` layout still custom |

**Fix:** Migrate the inline sidebar/layout to use `MasterVerticalShell` from `@/genesis/layout/MasterVerticalShell`. Pass sidebar content as a prop instead of inline composition.

---

#### `metro/kanban` — Score: 71/100 (borderline)
**File:** `src/app/design/metro/kanban/page.tsx`

Same pattern as dashboard — same fix. Use `MasterVerticalShell` to replace custom `flex h-screen` composition.

---

#### `metro/l6_new_showcase` — Score: 71/100 (borderline)
**File:** `src/app/design/metro/l6_new_showcase/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 65 | `bg-background`, `text-foreground` shadcn tokens |
| L6 | 55 | No proper shell |
| L7 | 65 | Token system incomplete |

**Fix:** Replace shadcn tokens: `bg-background` → `bg-layer-canvas`, `text-foreground` → `text-on-surface`. Wrap with `AppShell`.

---

#### `core/combat-signin` — Score: 76/100
**File:** `src/app/design/core/combat-signin/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L1 | 70 | `text-slate-500`, `text-slate-900`, `hover:text-blue-600` (lines 152-153) |
| L7 | 62 | ThemeContext import missing (CORE version not fixed by blast) |

**Fix:**
1. Add `import { useTheme } from '@/components/ThemeContext'` + `const { theme } = useTheme();` to the page
2. Replace `text-slate-500` → `text-on-surface-variant`, `text-slate-900` → `text-on-surface`, `hover:text-blue-600` → `hover:text-primary`

---

#### `core/geometry` — Score: 76/100
**File:** `src/app/design/core/geometry/page.tsx`

| Level | Score | Problem |
|-------|-------|---------|
| L6 | 60 | `<React.Fragment>` root — no AppShell |
| L7 | 62 | No ThemeContext |

**Fix:** Apply the same fix as METRO geometry (already done):
```tsx
'use client'
import { useTheme } from '@/components/ThemeContext';
import { AppShell } from '@/zap/layout/AppShell';
import { GeometryBody } from '@/zap/sections/atoms/geometry/body';

export default function GeometryPage() {
  const { theme } = useTheme();
  return (
    <AppShell>
      <GeometryBody theme="core" />
    </AppShell>
  );
}
```

---

### 🟡 GENESIS MOLECULE BUILDS — New Work Required

These CORE molecule sandbox pages need genesis molecule equivalents built. The sandbox page structure is already clean — only the tested molecule needs a genesis version.

**Template pattern:** Look at `src/app/design/core/molecules/card-number/page.tsx` + `src/genesis/atoms/formatters/credit-card.tsx` as a reference.

Each build requires:
1. Create the genesis component at `@/genesis/atoms/[category]/[name].tsx`
2. Update the sandbox import from `@/components/ui/` to the new genesis path

| Page | Shadcn Component | Build Path | Current L4 |
|------|-----------------|------------|------------|
| `molecules/date-range-picker` | `DatePickerWithRange` | `@/genesis/atoms/pickers/date-range-picker` | 68 |
| `molecules/dropzone` | `Dropzone` | `@/genesis/atoms/inputs/dropzone` | 68 |
| `molecules/input-otp` | `InputOTP` | `@/genesis/atoms/inputs/otp` | 68 |
| `molecules/multi-select` | `MultiSelect` | `@/genesis/molecules/inputs/multi-select` | 68 |
| `molecules/quick-navigate` | `Popover`, `Command` | `@/genesis/molecules/overlays/command-palette` | 72 |
| `molecules/radio-group` | `RadioGroup` | `@/genesis/atoms/inputs/radio-group` | 68 |
| `molecules/select-date` | `DatePicker` | `@/genesis/atoms/pickers/date-picker` | 68 |
| `molecules/select-time` | `TimePicker` | `@/genesis/atoms/pickers/time-picker` | 68 |
| `molecules/service-selection` | `Popover`, `Command` | `@/genesis/molecules/overlays/command-palette` | 70 |
| `molecules/steppers` | `NumberStepper` | `@/genesis/atoms/inputs/stepper` | 68 |
| `molecules/tag-input` | `TagInput` | `@/genesis/atoms/inputs/tag-input` | 68 |

---

### 🔵 SKIP (Lab Proxies — Low Priority)
These are pass-through proxy pages with no architecture. Fix only if the wrapped page is being promoted out of lab.

- `metro/lab/assets` (Score: 58) — proxy for `assets/page`
- `metro/lab/swarm` (Score: 58) — proxy for `swarm/page`

---

## Token Replacement Reference

| ❌ Non-compliant | ✅ ZAP M3 Token |
|-----------------|----------------|
| `bg-white` | `bg-layer-panel` or `bg-surface` |
| `bg-slate-50` | `bg-layer-base` |
| `text-slate-500` | `text-on-surface-variant` |
| `text-slate-900` | `text-on-surface` |
| `bg-blue-600` | `bg-primary` |
| `text-white` | `text-on-primary` |
| `bg-background` | `bg-layer-canvas` |
| `text-foreground` | `text-on-surface` |
| `text-muted-foreground` | `text-on-surface-variant` |
| `bg-muted` | `bg-surface-container` |
| `bg-black` | `bg-inverse-surface` |
| `text-black` | `text-on-surface` |
| `hover:text-blue-600` | `hover:text-primary` |
| Hardcoded `#XXXXXX` in layout | Use nearest M3 semantic token |

---

## Compliance Target
All pages must reach **≥ 80** on every level before Vietnam hand-off sign-off.

Questions → ping in #zap-compliance Slack.
