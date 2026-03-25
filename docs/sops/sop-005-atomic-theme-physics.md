# SOP-005: Atomic Theme Physics & The 2-Bucket System

## 1. The Directive

**Purpose:** To establish total architectural consistency across the ZAP Design Engine. This document provides strict instructions for all AI Agents (AntiGravity, ZAPClaw, Claude, etc.) and human developers when generating or refactoring UI components.

**Core Truth:** ZAP UI employs a strict CSS-first variable architecture for its themes. Tailwind is reserved strictly for layouts and structure. Hardcoding brand-specific colors or arbitrary physics (like border radiuses) in TSX files is a critical failure.

---

## 2. The 2-Bucket Rule (The Core Law)

Whenever you write a component, you must perfectly separate its DNA into two buckets.

### Bucket 1: The Brand Skin & Physics (CSS Variables)

* **Location:** Controlled exclusively by `globals.css` and `theme-[name].css` files (e.g., `theme-core.css`, `theme-neo.css`).
* **What it holds:**
  * **Colors:** Semantic mappings like `--color-brand-primary`, `--color-layer-panel`, `--color-state-success`.
  * **Physics:** Structural style tokens that morph between brands, such as `--card-border-width`, `--btn-radius`, `--card-shadow`.
* **The Rule:** NEVER hardcode these values in a TSX component. They *must* dynamically pull from the active CSS theme variables via Tailwind utilities mapped to these tokens.

### Bucket 2: The Structural Skeleton (Tailwind)

* **Location:** Inline within `.tsx` React components.
* **What it holds:**
  * **Layout:** grid (`grid-cols-2`), flexbox (`flex-row`, `items-center`).
  * **Spacing:** padding (`p-4`), margins (`mt-6`), gaps (`gap-4`).
  * **Sizing:** width (`w-full`), height (`h-24`), min/max constraints.
* **The Rule:** Tailwind handles all responsive layouts and immutable mathematical structures natively. A `gap-6` does not change if the theme goes from light to dark.

---

## 3. Semantic Mapping Guide for AI Agents

When generating UI, do not use standard Tailwind color or radius classes. You must translate them into ZAP semantic tokens.

| Instead of Using... | Use ZAP Token... | Why? |
| :--- | :--- | :--- |
| `bg-white`, `bg-gray-50` | `bg-layer-cover`, `bg-layer-canvas` | Themes control surfaces dynamically via M3 Surface variables. |
| `bg-blue-500`, `bg-[#FF0000]` | `bg-theme-main`, `bg-theme-active` | The primary brand action color morphs per theme. |
| `text-gray-900`, `text-black` | `text-theme-base` | Ensures high-contrast readability across all themes. |
| `text-gray-500` | `text-theme-muted` | For secondary text. |
| `text-white` | `text-theme-inverted` | Automatically flips depending on the `bg-theme-main` contrast. |
| `rounded-lg`, `rounded-full` | `rounded-card`, `rounded-btn`, `rounded-input` | A Neo theme uses sharp corners; a WIX theme uses pill shapes. |
| `border`, `border-2` | `border-[length:var(--card-border-width,0px)]` | Border widths are controlled by the theme engine. |
| `shadow-md` | `shadow-card`, `shadow-btn` | Shadow physics (sharp vs soft) are governed by the theme. |

---

## 4. Hierarchy of Atoms & Organisms

* **Atoms:** The most primitive connectors (e.g., `<Button>`, `<Panel>`, `<Icon>`, `<Typography>`). Atoms internalize Bucket 1 (Theme Variables) and provide a clean prop interface.
* **Molecules & Organisms:** Higher-order components (e.g., `<NavigationBar>`, `<DataTable>`).
* **The Rule:** Molecules and Organisms MUST NOT reinvent primitives. They must assemble existing Atoms and use Tailwind flex/grid (Bucket 2) to arrange them.

---

## 5. The Forbidden Patterns (Do Not Do This)

1. **NO INLINE STYLES:** `style={{ backgroundColor: 'black' }}` permanently destroys the possibility of theme-switching.
2. **NO ARBITRARY COLORS:** Avoid `bg-[#E9FF70]` or `text-blue-500`. These cannot react to theme context changes.
3. **NO DIRECT DOM MUTATION IN COMPONENTS:** Modifying `document.documentElement.style` manually inside a component bypasses the theme engine.
4. **NO HARDCODED STATUS COLORS:** Do not use `bg-red-500` for errors. Use the M3 standardized functional states: `bg-theme-error`, `bg-theme-success`, `bg-theme-warning`, `bg-theme-info`.

---

*This document serves as primary context for LLMs building UI across the Olympus architecture. Reading and adhering to this protocol ensures uniform design engine adherence.*
