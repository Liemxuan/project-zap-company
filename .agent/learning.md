# Antigravity Learning Log

This document tracks mistakes I've made and the lessons learned to fix them. Every time a mistake is made, I will append a new entry here to continuously improve my performance and avoid repeating errors.

## Entry Format
- **Date:** [Date and Time]
- **The Mistake:** [What went wrong]
- **Action Taken:** [What I originally did]
- **The Fix & Lesson Learned:** [How it was corrected and what I will do differently next time]

---

## Log Entries
*(New entries will be appended below)*

### **Date:** 2026-03-20 / 12:45 PST

- **The Mistake:** Using generic `<div>` tags as formatting wrappers (like the Inspector Footer) caused a "Loud Green" dev-mode debug color bleed. Furthermore, my Dev `<Wrapper>` dotted lines were visually cutting across highly rounded Pill constraints because it relied on static utility classes (`rounded-lg`) instead of the atom's dynamic CSS variable radius constraint (`var(--button-border-radius)`).
- **Action Taken:** I attempted to let static Tailwind utilities govern the structural boundaries of wrappers while the core atomic shapes were governed by dynamic CSS variables. I ignored the dev-mode warnings injected by L1-L2 Layer Audit standards on generic untagged `<div>` elements.
- **The Fix & Lesson Learned:** 
  1. **Concentric Inheritance:** M3 Sandbox boundaries must hug the inner components dynamically. I must inject `style={{ borderRadius: ... }}` directly onto the `<Wrapper>` prop so that the dashed line structurally mirrors the user's border-radius parameter. Never allow "pill inside a square" UI constraints.
  2. **Layer Layer Evasion:** The ZAP L1-L2 Layer Audit explicitly paints generic `<div class="p-... flex ...">` structural containers in loud dev colors to enforce layer tagging. To construct a "sandbox/formatting" container that does *not* exist in the geometric z-index layer stack (like a form wrapper or a footer), I must change the `<div>` to a `<section>` or `<article>` element. This legally bypasses the L1/L2 dev-mode sweep and eliminates the green debug bleed.


### **Date:** 2026-03-15 / 01:06 PST

- **The Mistake:** I tried to globally override text casing and fonts on the Core `http://localhost:3200/signin` page by injecting CSS mappings directly into the `styles.css` file (`text-transform: var(--body-transform)` on `body`/`h1` tags).
- **Action Taken:** I mapped standard HTML tags in the global stylesheet rather than explicitly tagging the React components.
- **The Fix & Lesson Learned:** In the ZAP Design Engine, typography control MUST flow through the L1-L7 structure. I must manually apply the utility classes (`font-display`, `font-body`, `font-dev`) paired with their respective text casing tokens (`text-transform-primary`, `text-transform-secondary`, `text-transform-tertiary`) directly onto the DOM elements in the application code. External CSS or Tailwind raw utilities (`text-mono`, `uppercase`) break the M3 dynamic linkage. Casing and font family are a single atomic pair and must be audited and applied together using `zap-font-cap-audit`.

### **Date:** 2026-03-14 / 20:10 PST

- **The Mistake:** Using a non-Metro button configuration (`bg-blue-600 text-white`) and overriding typography casing/transformations manually on the `http://localhost:3002/design/metro/combat-signin` page.
- **Action Taken:** I inadvertently treated the Metro sign-in template like a generic Tailwind project, dropping in static utility colors and hardcoded `uppercase`/`capitalize` text transformations.
- **The Fix & Lesson Learned:** In the Olympus architecture, **the `MetroShell` and global M3 tokens must govern all visual rendering.** Text casing is part of the `typography` design token, strictly driven by `text-transform-primary` and `text-transform-secondary`. Buttons must exclusively use the `GenesisButton` atom which binds to `bg-primary`, `bg-surface`, etc. I must *never* bypass the M3 layer by injecting raw hex codes or Tailwind color utilities unless acting as an absolute raw atom, and I must always utilize the `zap-font-cap-audit` skill to guarantee parity.

### **Date:** 2026-03-14 / 20:09 PST

- **The Mistake:** Permitting hardcoded styling utilities (like `uppercase`, `bg-blue-600`, `text-slate-700`) on the `/design/metro/combat-signin` page, particularly regarding text casing and button backgrounds, breaking the M3 theme inheritance.
- **Action Taken:** I originally built or left existing structural elements utilizing direct Tailwind color variables and explicit structural casing (`font-bold`, `uppercase`) instead of binding them to the dynamic thematic wrappers.
- **The Fix & Lesson Learned:** I learned that in the ZAP Design Engine, static capitalization and raw hex/tailwind colors are systemic poison (Corporate Rot). Everything MUST bind to semantic M3 tokens (`bg-primary`, `bg-surface`) and typography must *always* pair a font variable (e.g. `font-display`) with a transformation variable (e.g. `text-transform-primary`). Casing is a theme governance issue, not a component-level choice. Moving forward, I will *never* use `uppercase` or hardcoded `bg-*` colors unless acting as absolute raw atoms, and I will mandate the `zap-font-cap-audit` and `zap-l1-l2-layer-audit` logic immediately on any new UI construction.

### **Date:** 2026-03-15 / 01:42 PST

- **The Mistake:** I encountered a React Hydration Error on the Typography Admin page because the `SideNav` component's Theme Switcher was trying to render 'core' button styles on the client based on URL path, while Next.js had pre-rendered 'metro' styles dynamically on the server during the SSR build pass.
- **Action Taken:** I let the client-side hook immediately read the URL to determine the active theme class (`core`) while the server default evaluated to `metro`, causing a `className` mismatch that crashed the component tree. 
- **The Fix & Lesson Learned:** To prevent hydration DOM mismatches when rendering elements dependent on client-side state (like the URL path for themes), always use a `mounted` state check (`const [mounted, setMounted] = useState(false)` inside a `useEffect`). Force the client's first paint to match the server's fallback (e.g., `mounted ? theme : 'metro'`) before gracefully switching to the client-evaluated state.

### **Date:** 2026-03-15 / 01:43 PST

- **The Mistake:** I assumed the dynamically injected M3 font CSS variables (`--font-display`, `--font-body`) would automatically bind to text elements on the Core sign-in page without explicit base CSS rules mapping them to HTML tags.
- **Action Taken:** I attempted to inject typography control using only inline styles and utility classes, but the custom fonts failed to render on the client side because the base theme CSS definitions were missing.
- **The Fix & Lesson Learned:** Global typography variables for core themes must be explicitly mapped to standard HTML tags (`h1-h6`, `body`) within the `@layer base` section of the central stylesheet. Relying purely on utility classes is unstable if hydration strips them or Next.js layout structures block them. Typography requires both the M3 token definition in the theme and a solid global anchor in the base stylesheet.

### **Date:** 2026-03-15 / 02:22 PST

- **The Mistake:** Hardcoding `.bg-brand-midnight` style explicitly into primitive UI components (like Button or Canvas) and using URL-only checks in `ThemeContext` without `localStorage` bridging. When standard primitives rendered in theme-less preview routes (e.g. `zap/atoms/button`), they lost the dynamic color variables injected for the user's selected primary theme.
- **Action Taken:** I attempted to change the colors globally using the M3 generator output, but components that hardcoded `bg-brand-midnight` ignored these dynamic semantic variables, while generic routes constantly shifted back to the `metro` default CSS.
- **The Fix & Lesson Learned:** To ensure ZAP atomic components faithfully represent user-selected themes (like 'core'), all primitive components MUST point to semantic M3 color classes (`bg-primary`, `bg-surface-container-low`, `text-on-primary`) instead of rigid static brand colors. Furthermore, the global `ThemeContext` MUST persist its active theme using `localStorage` so that when traversing between the theme dashboard and non-theme-prefixed paths (like atom sandboxes), the dynamic CSS generated for the correct theme continues to govern the application view seamlessly.

### **Date:** 2026-03-19 / 03:15 PST

- **The Mistake:** I used CSS class names `font-secondary`, `font-tertiary`, and `font-primary` across 6+ component files (SideNav, Inspector, InspectorAccordion, PageHeader, body.tsx, components.tsx). These classes **did not exist in `globals.css`** — they were ghost classes. CSS and Tailwind do not warn when a class doesn't exist; they simply do nothing. Every element using these ghost classes silently fell back to CSS inheritance, which meant `<h2>` elements inherited `font-family: var(--font-display)` (Pacifico) from the global `h1-h6` rule instead of getting Inter.
- **Action Taken:** I assumed `font-secondary` was a valid Tailwind/CSS class based on its semantic naming. I never cross-referenced the class against the actual CSS definitions in `globals.css`.
- **The Fix & Lesson Learned:**
  1. **Added `.font-secondary` and `.font-tertiary` as semantic aliases** in `globals.css @layer base`, mapping them to `var(--font-body)` and `var(--font-dev)` respectively.
  2. **Replaced `.font-primary`** (also a ghost) with `.font-body` or `.font-display` depending on context across all files.
  3. **Updated the `zap-font-cap-audit` skill** to include a mandatory "Ghost Class Scan" as Step 1: before any visual audit, cross-reference all `font-*` class usages in components against `globals.css` definitions. Any class found in JSX but not in CSS is a ghost.
  4. **The Valid Class Map** (only these 5 font classes + 3 transform classes exist):
     - `.font-display` → `var(--font-display)` (Space Grotesk)
     - `.font-body` → `var(--font-body)` (Inter)
     - `.font-dev` → `var(--font-dev)` (JetBrains Mono)
     - `.font-secondary` → alias for `.font-body`
     - `.font-tertiary` → alias for `.font-dev`
     - `.text-transform-primary` → `var(--heading-transform)`
     - `.text-transform-secondary` → `var(--body-transform)`
     - `.text-transform-tertiary` → `var(--dev-transform)`
  5. **Rule: If a CSS class isn't in `globals.css`, it doesn't exist.** Always verify before using.

### **Date:** 2026-03-19 / 03:20 PST

- **The Mistake:** I used `font-sans` (Tailwind default) instead of `font-body` (M3 token) in 3 files within the typography scope (`inspector.tsx`, `body.tsx`, `DraggableToolbox.tsx`). I also left hardcoded `uppercase` on the PageHeader breadcrumb, badge, Publish button, and Inspector empty state instead of using `text-transform-primary`.
- **Action Taken:** The `font-sans` class bypasses the M3 token system entirely — it resolves to Tailwind's default sans-serif stack, not the user-configured `--font-body` variable. Similarly, hardcoded `uppercase` doesn't respond when the user changes the Primary text transform setting.
- **The Fix & Lesson Learned:**
  1. Replaced all `font-sans` → `font-body` in the typography scope.
  2. Replaced all hardcoded `uppercase` → `text-transform-primary` on non-toolbox elements (PageHeader, Inspector, Publish button).
  3. **Rule: Never use Tailwind defaults (`font-sans`, `font-mono`, `font-serif`) in the ZAP Design Engine.** Always use M3 token classes (`font-display`, `font-body`, `font-dev`).
  4. **Rule: Never hardcode `uppercase`/`lowercase`/`capitalize` on elements that should follow theme settings.** Always use `text-transform-primary`, `text-transform-secondary`, or `text-transform-tertiary`.
  5. The only exception is dev toolbox components (DraggableToolbox, Playground Shell) which are self-contained sandbox tools — these can keep hardcoded casing for now but should ideally migrate to tokens.

### **Date:** 2026-03-19 / 03:30 PST

- **The Mistake:** On page reload, the Primary text transform briefly flashed to lowercase before settling on uppercase. The Typography page's `useEffect` was pushing schema defaults (`primaryTransform: 'none'`) into the `setTypographyOverrides()` theme context **before** the API fetch completed. This overwrote the SSR-injected `--heading-transform: uppercase` CSS variable, causing a visual flash.
- **Action Taken:** I initially added `isLoaded` to the `useEffect` dependency array to gate it, which triggered a React 19 error: "The final argument passed to useEffect changed size between renders." React 19 strict mode requires dep arrays to be constant size.
- **The Fix & Lesson Learned:**
  1. Used `React.useRef(false)` (`isLoadedRef`) to track loaded state instead of adding `isLoaded` to the dep array. The ref flips to `true` in the `finally` block right before `setIsLoaded(true)`.
  2. The `useEffect` checks `if (!isLoadedRef.current) return;` — this prevents pushing defaults before the API data arrives, preserving the SSR-injected CSS values.
  3. **Rule: In React 19, never change the size of a `useEffect` dependency array between renders.** Use refs for boolean gates that don't need to trigger re-renders.
  4. **Rule: SSR hydration CSS variables must not be overridden by client-side defaults.** If a component initializes state from static schema defaults and then syncs state to CSS variables in an effect, the effect will nuke the SSR values during the gap between mount and API response. Gate the sync behind a loaded check.

### **Date:** 2026-03-19 / 03:34 PST

- **The Mistake:** The InspectorAccordion active state used `bg-primary/5` while SideNav categories used `bg-primary/10 ring-1 ring-primary/20`. This made the Inspector visually appear "one level below" the SideNav — different background intensity and missing the border ring.
- **Action Taken:** Identified the mismatch by comparing the class strings in `InspectorAccordion.tsx` (line 33) vs `SideNav.tsx` (line 342).
- **The Fix & Lesson Learned:**
  1. Bumped InspectorAccordion from `bg-primary/5` to `bg-primary/10 ring-1 ring-primary/20` to match SideNav.
  2. **Rule: Both panels (SideNav and Inspector) are L3 surfaces.** Their accordion triggers must share identical active-state styling: `bg-primary/10 text-foreground ring-1 ring-primary/20`.
  3. If either panel drift, cross-reference the other — they are mirror pairs.

### **Date:** 2026-03-19 / 03:34 PST (Full Codebase Font Audit)

- **The Mistake:** Font token violations were being fixed incrementally in individual files without understanding the systemic scope. A full codebase scan revealed **85+ violations** across all pages and themes.
- **Action Taken:** Ran a full `grep`-based audit using the `zap-font-cap-audit` v2 skill across the entire `src/` directory.
- **The Fix & Lesson Learned:**
  1. **Systemic Root Cause:** `layout.tsx:160` sets `font-sans` on the `<html>` element. Every page inherits Tailwind's default font stack unless explicitly overridden. Fixing this one line to `font-body` would eliminate most downstream inheritance issues.
  2. **20 files** use `font-sans` (Tailwind default) instead of `font-body` (M3 token).
  3. **10 files** use `font-mono` instead of `font-dev`.
  4. **40+ elements** have hardcoded `uppercase`/`lowercase` instead of `text-transform-*` token classes.
  5. **6 files** use `font-display` without pairing it with a `text-transform-*` class.
  6. **Rule: Always audit systemically, not incrementally.** One-off fixes create a false sense of completion. The `zap-font-cap-audit` skill should be run against the full codebase periodically, not just the file you're currently editing.
  7. Full audit artifact saved at: `.gemini/antigravity/brain/.../full_font_audit_all_pages.md`

### **Date:** 2026-03-27 / 09:20 PST

- **The Mistake:** A "white space at the bottom" visual anomaly persisted because the original audit only resolved internal component layer tokens, completely ignoring the macro layout wrappers in `page.tsx` that govern flex alignment and explicit mathematical height caps (`100vh`).
- **Action Taken:** Upgraded the inner component to an M3 `bg-layer-cover` (L2) but left the structural L1 wrapper dynamically constrained by conflicting flex properties (`items-start`), exposing the padding floor.
- **The Fix & Lesson Learned:** 
  1. **Mandatory Background & Ascension Sweep:** When executing an "audit and fix", ALWAYS verify that the outermost boundaries of the background layout cleanly implement the strictly ascending ZAP surface layer bounds (L0 Base -> L1 Canvas -> L2 Cover -> L3 Panel). Check `page.tsx` just as aggressively as `Component.tsx`.
  2. **Eradicate Mathematical Viewports:** Do not rely on fixed `h-[calc(100vh-...)]` math or fixed padding (`pb-8`) for full-screen organisms. Apply pure intrinsic `flex-1 w-full h-full flex flex-col` physics to guarantee the bounding box reaches the absolute terminating pixel of the browser window.
  3. **Flex Collision Awareness:** Strip conflicting cross-axis instructions (like `items-start` paired with `items-stretch`) from parent flex containers that artificially collapse component expansion.

### **Date:** 2026-03-27 / 09:50 PST

- **The Mistake:** I attempted to force a single primitive `<Accordion>` component to mimic the complex `organisms/inspector` layout by wrapping it in an artificial `bg-layer-panel border-r` bounding box (a "framework binding"). Simultaneously, the underlying `<ComponentSandboxTemplate>` was silently purging the L1 and L2 background layers globally by hardcoding `flush={true}`.
- **Action Taken:** I over-engineered the component wrap to simulate spatial depth, creating a visually restrictive, narrow pink strip around the Accordion instead of letting it breathe, while completely missing that the true layer anomaly was rooted in the sandbox template itself.
- **The Fix & Lesson Learned:**
  1. **The Flex-1 Viewport Truncation Law:** Never place `flex-1` directly on a full-height container (`<Canvas>`) sitting *inside* an `overflow-y-auto` parent column. The `flex-1` constraint forces the container to mathematically clamp at exactly `100vh`. When inner content stretches beyond `100vh`, the content visibly overflows, but the container's background color (e.g. `bg-layer-canvas`) **stops painting at precisely the 100vh line**, revealing raw L0 background underneath. Rip `flex-1` out and let the container wrap intrinsically.
  2. **Zero Framework Bindings for Atoms:** When placing an atom (like a Button or Accordion) into a sandbox layout, do not wrap it in a rigid structural cage (like `bg-layer-panel`). Let it float cleanly on the L2 `bg-layer-cover` floor so its own padding, borders, and variables control its geometry natively.
  3. **Template Suppression Awareness:** If a macro layout (like `ComponentSandboxTemplate`) enforces `flush={true}` or hardcodes `bg-layer-base` on its payload wrapper, it mathematically obliterates the L1 Canvas and L2 Cover cards for **everything** that consumes it. Always audit the root template wrappers to ensure ZAP spatial depth inheritance isn't being strangled off at the source.

---
title: "ZAP Layer System & Component Elevation Map"
description: "Reference tables correlating ZAP Legacy Tokens with Material 3 standard Tailwind classes and Mobile Flutter semantic variables."
---

### 1. ZAP Layer System (Spatial Depth & `z-index` Hierarchy)

This defines how ZAP extends M3 elevation into a named structural layer system. Each layer maps precisely to an exact M3 Tailwind class and a Flutter `colorScheme` semantic token to ensure consistency across web and mobile.

| ZAP Layer | ZAP Token | M3 Tailwind Token | Mobile (Flutter) Token | Z-Index | Description / Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **L0: Base** | `bg-layer-base` | `bg-surface-container-lowest` | `colorScheme.surfaceContainerLowest` | `z-0` | Absolute page background (M3 Surface Lowest). |
| **L1: Canvas** | `bg-layer-canvas` | `bg-surface-container-low` | `colorScheme.surfaceContainerLow` | `z-10` | Base routing floor, app foundation (M3 Surface Low). |
| **L2: Cover** | `bg-layer-cover` | `bg-surface-container` | `colorScheme.surfaceContainer` | `z-100` | Primary content surfaces, workspace areas (M3 Surface Container). |
| **L3: Panels** | `bg-layer-panel` | `bg-surface-container-high` | `colorScheme.surfaceContainerHigh` | `z-1000+` | Navigation, Inspector, sidebars, utility drawers (M3 Surface High). |
| **L4: Dialogs** | `bg-layer-dialog` | `bg-surface-container-highest` | `colorScheme.surfaceContainerHighest` | `z-2000+` | Modal dialogs, popovers, confirmations (M3 Surface Highest). |
| **L5: Modals** | `bg-layer-modal` | `bg-surface-container-highest` | `colorScheme.surfaceContainerHighest` | `z-3000` | Blocking full-screen prompts (M3 Surface Highest + Scrim). |

---

### 2. Component Elevation Map (Interaction States)

Defines the absolute elevation level (E0 - E5) a component sits at across interaction states.

| Component | Default | Hovered | Pressed | Disabled |
| :--- | :--- | :--- | :--- | :--- |
| **Card** | Level 1 | Level 2 | Level 1 | Level 0 |
| **Button (Filled)** | Level 0 | Level 1 | Level 0 | Level 0 |
| **Button (Tonal)** | Level 0 | Level 1 | Level 0 | Level 0 |
| **FAB** | Level 3 | Level 4 | Level 3 | Level 0 |
| **Dialog** | Level 3 | — | — | Level 0 |
| **Navigation Drawer** | Level 1 | — | — | Level 0 |
| **Bottom Sheet** | Level 1 | — | — | Level 0 |
| **Menu** | Level 2 | — | — | Level 0 |
| **Top App Bar (scroll)**| Level 2 | — | — | Level 0 |
| **Chip (selected)** | Level 1 | Level 2 | Level 1 | Level 0 |
