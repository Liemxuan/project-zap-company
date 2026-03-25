# B.L.A.S.T. EXECUTION PLAN: THEME REMIX archITECTURE

**Status:** ACTIVE
**Objective:** Complete systematic refactor of all current ZAP-Design components (Atoms & Molecules) to render them perfectly neutral and 100% compatible with the newly established Theme Remix Engine (CSS variables via `globals.css`).

> **CRITICAL DIRECTIVE:** ZAP-OS is no longer "Neo-Brutalist" by default. It is a skin. The underlying react components must be wireframes that consume `--physics-tokens`. Hardcoded aesthetics like `border-2 border-black` or `shadow-[4px_4px_#000]` are strictly forbidden at the React component layer. Reference `SOP-004-THEME_COMPATIBILITY_GUIDE.md` for exact token mappings.

---

## [B] - Blueprint (Planning & Identification)

Identify all components containing hardcoded legacy brand logic:

1. **Scan for Hardcoded Shadows:** Search the `src/` directory for any instances of `shadow-[...#000]` or generic `shadow-lg` properties.
2. **Scan for Hardcoded Borders:** Search for instances of `border-2`, `border-black`, `border-b-4`, etc., not using the `var(--card-border-width)` mapping.
3. **Scan for Hardcoded Backgrounds:** Search for non-semantic backgrounds like `bg-white`, `bg-[#FDFDFD]`, `bg-[#F5F5F0]` instead of layer semantics (`bg-layer-cover`, `bg-layer-panel`).
4. **Target Directories:**
    * `src/genesis/atoms/` (L1 Primitives)
    * `src/genesis/molecules/` (L2 Functional Groups)
    * `src/zap/sections/` (L3 Organisms/Blocks)
    * `src/zap/layout/` (L4 Master Shells)

## [L] - Logic (Refactoring Rules)

The AI team must execute the following conversions on every file identified in the Blueprint phase:

| Legacy Tailwind Value | Target Dynamic Token (Theme Engine) | Purpose & architecture Rule |
| :--- | :--- | :--- |
| `bg-white` / hex codes | `bg-layer-cover` / `bg-layer-panel` | Maps to the 3-layer architecture. Prevents "glowing boxes" in dark themes. |
| `border-X border-black` | `border-[length:var(--card-border-width,0px)] border-card-border` | Allows themes to toggle borders on/off and switch colors globally. |
| `shadow-[4px_...#000]` | `shadow-card` (or `shadow-btn` etc.) | Allows themes to replace hard drops with soft blurs (e.g., Apple vs Neo-Brutal). |
| `rounded-none` | `rounded-[var(--card-radius,0px)]` | Allows themes to switch between 0px and 12px radiuses programmatically. |
| `text-black` / `text-[#0B132B]` | `text-brand-midnight` | Ensures extreme contrast mapping. Never hardcode absolute black/white for text. |

## [A] - architecture (Integration)

Ensure all components rely exclusively on the global CSS system:

1. **Stop Component-Level Mutations:** Do not write custom CSS in React files. All theme definitions MUST remain in `globals.css` and the respective `theme-*.css` files.
2. **Verify Semantic Layers:** Ensure the DOM structure makes sense (i.e., a `bg-layer-panel` is sitting on top of a `bg-layer-cover`, which sits on the `bg-layer-canvas`).

## [S] - Styling (Execution Waves)

Execute the refactor in the following structural waves to maintain application stability:

* **WAVE 1: The Foundation Surfaces (Atoms)**
  * Refactor `<Card />`, `<Canvas />`, `<Panel />` in `src/genesis/`.
* **WAVE 2: Interactive Primitives (Atoms)**
  * Refactor Buttons, Inputs, Standard Checkboxes, Badges.
* **WAVE 3: Navigation & Shell (Organisms)**
  * Refactor `VerticalNav.tsx`, `Header.tsx`, and the Sidebar structural backgrounds.
* **WAVE 4: Complex Blocks (Molecules/Organisms)**
  * Refactor the Typography demo block, the Color Inspector, and other specific feature blocks in `src/zap/sections/`.

## [T] - Testing (Verification Protocol)

After each wave, the following QA must be performed:

1. Run the application locally.
2. Navigate to `/debug/zap/theme-remix` to visually verify 4-state component stability.
3. Use the global dev mode toggle (`devMode = true`) on individual pages to highlight structural `<ContainerDevWrapper>` borders.
4. Use the new global Theme Switcher (in the Vertical Navigation) to toggle between `core`, `metro`, `neo`, and `wix`.
5. **PASS CONDITION:** When the active theme is `core`, the application must look like a sterile, wireframe UI (grey background, white cards, placeholder borders). It must NOT look like ZAP-OS (Neo-Brutalism). ZAP-OS styling must only activate when the `neo` theme is selected.
