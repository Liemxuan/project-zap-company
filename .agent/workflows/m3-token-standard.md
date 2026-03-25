---
description: SOP for using M3 design tokens when building or refactoring any page in ZAP Design Engine
---

# ZAP Design Engine: M3 Token Standard (The Absolute Mandate)

This workflow defines the **absolute strict mandate** for all AI Agents (Claude, Scout, Recon) and Human Engineers when building or refactoring UI components in the ZAP ecosystem.

**THE GOLDEN RULE: ZERO HARDCODING.**
**UNDER NO CIRCUMSTANCES** are you allowed to use hardcoded colors (e.g., hex, rgb), arbitrary Tailwind brackets (e.g., `text-[13px]`, `w-[15px]`, `drop-shadow-[...]`), or hardcoded raw CSS styles (`style={{ color: '#ff0000' }}`). *This creates technical debt and breaks the design system. Use the standard kit.*

All structural dimensioning, painting, typography, and elevation must mathematically map back to the standard M3/ZAP Token kit predefined in the system.

---

## 1. Color (Painting & Surfaces)
**NO HEX CODES. NO ARBITRARY CLASSES (`bg-[#ffffff]`).**
All colors must come from the M3 `md-sys-color` map and ZAP token extensions.

*   **Surfaces/Backgrounds:** Use `bg-layer-base`, `bg-layer-panel`, `bg-layer-canvas`, `bg-surface`, `bg-surface-container`, etc.
*   **Text/Icons:** Use `text-foreground`, `text-on-surface`, `text-primary`, `text-on-primary`, `text-iso-gray-500`, etc.
*   **Borders:** Use `border-border`, `border-outline`, `border-outline-variant`.
*   **Accents:** Use standard primary/secondary/tertiary/error mapping (e.g., `bg-primary-container text-on-primary-container`).

## 2. Typography
**NO ARBITRARY FONT SIZES (`text-[15px]`, `leading-[22px]`).**
Use our defined fluid typography standard (Display, Headline, Title, Body, Label).

*   **Display:** `text-display-lg`, `text-display-md`, `text-display-sm`
*   **Headline:** `text-heading-h1`, `text-heading-h2`, `text-heading-h3`
*   **Title:** `text-title-lg`, `text-title-md`, `text-title-sm`
*   **Body:** `text-body-lg`, `text-body-md` (Use for standard long-form text)
*   **Label/Meta:** `text-label-lg`, `text-label-md`, `text-label-sm` (Use for pills, badges, tiny UI text)

*Exceptions to this rule are only allowed if explicitly building a fluid `clamp()` foundation in CSS, never in everyday React component usage.*

## 3. Elevation & Shadow
**NO RAW CSS BOX-SHADOWS (`shadow-md`, `shadow-[0_4px_...]`).**
Use the custom M3 elevation tokens that combine shadow and surface tinting.

*   `elevation-0`: Flat, base layer.
*   `elevation-1`: Cards, un-hovered interactive elements.
*   `elevation-2`: Hover states, FABs, basic dropdowns.
*   `elevation-3`: Modals, date pickers, elevated menus.
*   `elevation-4`: Nav bars, floating action buttons (pressed).
*   `elevation-5`: Top-level dialogs, critical alerts.

## 4. Spacing, Sizing & Layout (The 4dp Grid)
**NO ARBITRARY SPACING (`gap-[18px]`, `p-[5px]`).**
All spatial rhythm is built on a non-negotiable **4dp base grid**. If it doesn't divide by 4, it breaks the layout engine.

*   `p-1` / `gap-1` / `m-1` (4px) -> micro gaps.
*   `p-2` / `gap-2` / `m-2` (8px) -> compact padding.
*   `p-3` (12px), `p-4` (16px), `p-5` (20px), `p-6` (24px), `p-8` (32px), `p-10` (40px)
*   **Minimum Touch Target (Accessibility):** `min-w-12 min-h-12` (48x48px) for anything a user physically clicks or taps (WCAG 2.1 AAA). Button specific heights (`h-10`, `h-8`) are allowed if their click-radius is extended or used in dense data grids.

## 5. Icons & Assets
**NO INLINE SVGs WITH HARDCODED FILL/STROKES.**
*   Always use `currentColor` for SVG `fill` or `stroke` properties.
*   Icons should inherit text color classes (e.g., `text-on-surface`, `text-iso-gray-500`) from their parent wrappers to respect light/dark mode and active states dynamically.
*   Standard icon sizing limits: 20px (`w-5 h-5`), 24px (`w-6 h-6`), 40px (`w-10 h-10`).

---

## Enforcement Guidelines for Fleet Agents
When generating new components or auditing existing `Genesis` atoms:
1.  **Extract the element.**
2.  **Strip ALL raw CSS inline variables and arbitrary Tailwind brackets related to color, typography, sizing, shadow, or spacing.**
3.  **Map non-compliant values straight to the nearest standardized M3 grid/color token.**
4.  **Enforce 48dp minimums for all clickable layers.**
5.  **Output clean, compliant M3 token-based wrappers.**

If you bypass this protocol, the layout will fail standard `ZAP-021` code compliance and your pull request will be rejected.
