# SOP-001-BRAND_GUIDELINES

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** B.L.A.S.T. / DESIGN SYSTEM

---

This is the Source of Truth for the ZAP-OS design system. It ensures visual and technical consistency across POS, KIOSK, and Web platforms.

---

## 1. Core Visual Identity: The Theme Remix Engine

**Aesthetic:** Dynamic, Switchable, and CSS-Cascaded.

* **Philosophy:** ZAP-OS no longer has a single hardcoded aesthetic. The foundation of the app is a completely sterile, naked wireframe (`globals.css`). Visual identities (NEO, WIX, METRO) are applied as dynamic CSS skins over this infrastructure.
* **Layout:** A rigid flex/grid system that leaves formatting, spacing, and dimensions to dynamic CSS variables.
* **Edge Rule:** Depends on the active theme (`var(--card-radius)`).

### Core Logo Asset

The official ZAP logo is a stark, black textmark. It has been extracted as a transparent PNG and is stored as `/public/zap-logo.png` in the `zap-design` web repository.

![ZAP Official Logo Reference](/Users/zap/Workspace/zap-design/public/zap-logo.png)

* **Code Primitive:** `<ZapLogo />` (available in `src/components/ui/primitives/ZapLogo.tsx`).
* **Usage Rules:** The logo must be rendered in black on light backgrounds. On dark backgrounds, use CSS filters (`grayscale contrast-200 invert`) to effectively render it in white.

## 2. Typography (Google Fonts)

ZAP-OS strictly mandates the use of **Google Fonts** for all Primary and Secondary typography. Local fallbacks must be configured in the CSS stack as a failsafe in case the Google CDN is unreachable.

| Component | Font | Usage |
| :--- | :--- | :--- |
| **Brand & Headers** | `Space Grotesk` | All-caps section headers (e.g., "DATA STRATEGY"), Large UI titles. |
| **UI & Body** | `Inter` or `Roboto Flex` | KIOSK and POS touchscreen readability. |
| **Technical Data** | `JetBrains Mono` or `Google Sans Mono` | Database schemas, code blocks, logs. |

## 3. Iconography (Material Symbols)

Variable "Sharp" configuration for technical precision.

* **Library:** [Material Symbols Outlined](https://fonts.google.com/icons?icon_set=Material+Symbols)
* **Standard Weight:** `300` (Technical feel).
* **Grade:** `-25` for dark mode (Midnight Blue) to reduce visual bleeding.

## 4. Design Tokens (The Physics Engine)

Colors and structural values are NO LONGER hardcoded in Tailwind classes. They are managed by the CSS Cascade.

### 4.1 Layer Semantics (Bridged to M3 Dynamic Tokens)

| Token | Semantic Mapping | Description |
| :--- | :--- | :--- |
| **Canvas** | `bg-layer-canvas` | The absolute background of the application (M3 Surface Lowest). |
| **Cover/Surface** | `bg-layer-cover` | Primary elevated surfaces like Cards (M3 Surface). |
| **Panel** | `bg-layer-panel` | Secondary interactive blocks or sidebars (M3 Surface High). |
| **Text Primary** | `text-brand-midnight` | Primary high-contrast text. |

### 4.2 Structural Rules (DO NOT HARDCODE BORDERS/SHADOWS)

| Feature | DO NOT USE | MUST USE | Reason |
| :--- | :--- | :--- | :--- |
| **Borders** | `border-2 border-black` | `border-[length:var(--card-border-width,0px)] border-card-border` | Borders must vanish in METRO but appear in NEO. |
| **Depth** | `shadow-[4px_4px_#000]` | `shadow-card` | Shadows dictate the theme's physical depth. |
| **Corners** | `rounded-none` or `rounded-lg`| `rounded-card` | Rounding dictates the theme's personality. |

---

## 5. Implementation Workflow (For AI and Human Devs)

> **CRITICAL AI INSTRUCTION:** All agents (Claude, ZAPClaw, AntiGravity) MUST read AND obey **[sop-005-atomic-theme-physics.md](file:///Users/zap/Workspace/olympus/docs/sops/sop-005-atomic-theme-physics.md)** before generating any UI components.

1. **Build the Naked Skeleton:** Use flexbox, grid, and padding (Tailwind) to build the structure (Bucket 2).
2. **Apply Semantic Layers:** Use `bg-layer-cover` for surfaces. Never use `bg-white` or hardcoded hex colors.
3. **Inject Physics Atoms:** Add `shadow-card`, `rounded-card`, and the dynamic border length utility to allow the Theme Switcher to control the element's physics (Bucket 1).
4. **Test in Core:** If the component looks like a detailed, opinionated design in the "Core" theme, you have failed. It must look like a grey/white wireframe.

---

## 6. Navigation architecture

To align with the Antigravity global CSS and maintaining the Atomic Design hierarchy, Navigation is strictly governed by **sop-003-navigation-architecture.md**.

* **Layer 1 (Atoms) - `NavLink.jsx`:** The smallest unit. Consumes global color variables (e.g., active vs. default states).
* **Layer 2 (Molecules) - `NavGroup.jsx`:** A collection of `NavLinks` that inherit the structural flow and `spacing-unit` tokens.
* **Layer 3 (Organisms) - `VerticalNav.jsx`:** The high-level navigation trigger. Strictly responsible for consuming global physics tokens (spring/cubic-bezier) to govern sidebar expansion.
* **Layer 4 (templates) - `DashboardLayout.jsx`:** Defines the layout "slots". The template dictates the space the organism occupies, allowing for a zero-collision swap of layouts without rewriting the navigation logic.
