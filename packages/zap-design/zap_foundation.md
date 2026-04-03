# ZAP Foundation Master Protocol

**Purpose:** This is the absolute, unbreakable Standard Operating Procedure (SOP) for constructing any page or component within the ZAP ecosystem. 

Whether you are a Human, Spike, Jerry, or Claude, if you are building a page, you **must** obey these layers. You do not invent rules; you consume the established foundations.

---

## Part 1: The L0-L2 Design Foundations (The Rulebook)
*Before you put a single `div` on the screen, these engines are already running.*

### L0 & L1: The Global Engines (Do Not Rebuild)
1. **Colors (M3 Math Engine):** We do not use hardcoded hex values (`#ff0000`). We pull the `targetTheme` from `ThemeContext`, which reads from the indestructible `.zap-settings/colors-metro.json`. UI elements use math-generated Semantic Tokens like `bg-primary` or `hexFromArgb(scheme.error)`.
2. **Typography (The 3-Tier Hierarchy & Casing Pairs):** Font Families and Text Casing are inextricably linked in `.zap-settings/typography-metro.json`. Never enforce custom utility classes (`font-sans`, `uppercase`) where semantic pairs exist.
   - **Primary (Display):** Used for major Page Titles and Hero sections. Bound to the `font-display` class and `text-transform-primary` casing token.
   - **Secondary (Body):** Used for 95% of the UI (buttons, standard labels, paragraphs, inputs). Bound to the `font-body` class and `text-transform-secondary` casing token.
   - **Tertiary (Dev/System):** Reserved for Development overlays, Inspector panels, code snippets, and metadata. Bound to `font-tertiary` (or `font-mono`) and `text-transform-tertiary` casing.
   - **Crucial Casing Rule (Zero-Tolerance for Hardcoding):** NEVER hardcode string cases like `"COMPONENT SANDBOX"` or explicitly add `uppercase`/`lowercase`/`capitalize` Tailwind utilities. ALL UI raw strings MUST be written in standard **Title Case** (e.g., `"Component Sandbox"`). The CSS engine and M3 variables (`text-transform-primary`, `text-transform-secondary`, `text-transform-tertiary`) will dynamically handle applying the correct casing based on the active theme. If you hardcode `uppercase` locally, you permanently break the M3 skinning engine for that component.
3. **Spacing & Elevation:** Governed by CSS Variables in `globals.css` (e.g., `--card-radius`, `--nav-gap-category`). Never guess pixel padding. Use semantic Tailwind equivalents (`p-4`, `rounded-card`, `shadow-card`).

### L1 & L2: The Primitives
4. **Icons:** The literal source of truth is `src/genesis/atoms/icons/Icon.tsx`. Never use raw SVGs. Use the `<Icon name="bolt">` Atom, which handles Google Material Symbols math. For interactive icons, strictly use the L2 `<IconButton>` to guarantee the 48x48 hit target.
5. **Overlays & Scrims:** Modals and Sheets must use the pre-configured primitives (e.g., `<SheetOverlay>`) which enforces a strict `bg-black/10` with a 1px backdrop blur. No custom dimming layers.
6. **Motion:** Basic fade/slides use Tailwind utilities (`animate-in`, `fade-in-0`) tied to root easing curves. Complex physics (drag/spring) must use `framer-motion` via the `frontend-motion` SKILL protocol. Random `@keyframes` are banned.
7. **Universal Sinks & Theme Publishers:** Never hardcode generic `<button>` variants inside an inspector to publish state. Always use the universal `<ThemePublisher>` which accurately inherits its configurations from the global CSS cascade. If saved CSS variables fail to propagate to components in global pages or foundation tools, explicitly verify that the dynamic class injector (e.g., `<ThemeManager>`) is successfully applying the exact `.theme-{id}` class to the `<html>` or `<body>` root; without the root class, the variables will silently fail to inherit.

### L0-L5: The ZAP Layer System (Spatial Hierarchy)
The structural depth of all ZAP applications is strictly governed by 6 semantic layers, corresponding to background classes, z-indexes, and M3 Surface tokens.

- **L0: Base** (`bg-layer-base`, `z-0`): Absolute root document background (M3 Surface Lowest). Sits beneath all layout.
- **L1: Canvas** (`bg-layer-canvas`, `z-10`): Base routing floor. This is the absolute bottom layer for the primary App view. *Critical:* Do not use this for inner content wrappers.
- **L2: Cover** (`bg-layer-cover`, `z-100`): Primary content surfaces, workspace sandboxes, and **internal Page Headers** (M3 Surface Container). *Critical:* All main 1080px sandbox wrappers and structural design grids *must* map to L2, never L1. In `ComponentSandboxTemplate` environments where the default L2 is flushed, developers MUST wrap content in an explicit `<CanvasBody flush={false}>` to restore spatial depth.
- **L3: Panels** (`bg-layer-panel`, `z-1000+`): Generic structural UI Cards, Global side/horizontal navigation, Inspector covers, and **Global AppShell Headers** (M3 Surface High). Sitting above the L2 Cover.
- **L4: Dialogs** (`bg-layer-dialog`, `z-[2000+]`): Floating, non-blocking UI interactions (M3 Surface Highest). *Examples:* Encapsulated inner details panels, Shadow/Color Comparison sub-wrappers, Font Picker Popups, Dropdown Menus, Tooltips, Autocomplete overlays, **Table Headers, and Cover Headers**.
- **L5: Modals** (`bg-layer-modal`, `z-[3000+]`): Blocking full-screen prompts and critical break-glass dialogs (M3 Surface Highest + Scrim). *Must* be accompanied by a `bg-black/10` to `bg-black/40` backdrop scrim that disables underlying interactivity.

*Critical Target:* **The Absolute Ban on `bg-surface-variant`**. Never use `bg-surface-variant` to paint a layout shell, panel, or card background. M3 dictates that surface-variant is strictly reserved for the internal backgrounds of specific interactive components (like disabled buttons or input fields), not spatial depth hierarchy. If you need a contrasting panel, use `L3 (bg-layer-panel)`.

*Strict Ascension Rule:* Once you establish an `L2 Cover` wrapper (like a main body sandbox or an inspector wrap), all inner localized content (e.g., table cells, interactive demos, nested parameter settings) **MUST strictly ascend** to `L3 (bg-layer-panel)` or `L4 (bg-layer-dialog)`. 

It is a terminal architectural violation to nest `L0 (bg-surface-container-lowest)` or `L1 (bg-surface-container)` inside an `L2` cover. Spatial depth must continuously ascend as the user dives into the element tree. Never regress to lower layers.

---

## Part 2: The L3-L7 Build Architecture (The Assembly)
*How to construct a page from the ground up.*

### L7: Application Boundary (Next.js Root)
- **The Territory:** `src/app/layout.tsx`
- **The Rule:** This is where the global `ThemeContext` Provider lives. Individual pages do not build context; they only consume it. 

### L6: The Route (The Page)
- **The Territory:** `src/app/.../page.tsx` (e.g., `design/metro/colors/page.tsx`)
- **The Rule:** The L6 Page is just a dumb container. It manages local React state (like `activeTab`) and passes the global `useTheme()` context down to the L4 Layout shells and L3 Organisms. It should have almost zero raw HTML `divs`.

### L5: The Templates (Standardized Views)
- **The Territory:** Reusable complete page layouts (e.g., Standard Dashboard, Auth Screen)
- **The Rule:** Before building a custom L4 shell, check if an L5 Template exists. If it does, wrap the L6 Page in it.

### L4: Layout Shells (The Grid Framework)
- **The Territory:** `src/zap/layout/...` (e.g., `<Inspector>`)
- **The Rule:** Agents do not calculate pixel widths or write custom CSS grids. L4 Layouts handle all responsive behavior (collapsing sidebars, maximum content widths). You wrap your L3 Organisms inside these Shells.

### L3: Organisms (The Major Sections)
- **The Territory:** `src/zap/sections/...` (e.g., `<MoleculeContainmentBody>`)
- **The Rule:** These are highly complex, standalone sections like a functional sidebar, a complex data table, or a full preview mockup. They orchestrate L1 Atoms and L2 Molecules.

---

## The Ultimate Enforcement: The Dev Wrapper
Every single valid ZAP component from L1 upwards must be wrapped in the `<ContainerDevWrapper>` or equivalent identity protocol. 

**The Zero Tolerance Audit:** If you build an Organism or a Page, and the human CSO turns on Dev Mode, your components *must* light up with the correct X-Ray bounding box and identity pills (`Atom`, `Molecule`, `Layout`). If an element does not light up, it means you built "outside the house" using raw HTML, and your code will be rejected. 
