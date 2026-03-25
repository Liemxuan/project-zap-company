# SOP-003-NAVIGATION_archITECTURE

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** B.L.A.S.T. / THEME REMIX ENGINE

---

## 1. The Global CSS Source of Truth

To restructure navigation and align it with the Antigravity global CSS while maintaining the 7-Layer Atomic Design hierarchy, the `VerticalNav` acts as the definitive bridge between the core design tokens (controlled by `theme.json`) and the application layout.

The global CSS (and its scoped `.theme-*` variants) acts as the **absolute "Source of Truth"** for every layer. Changes to navigation aesthetics or physics must happen at the token level, not by hardcoding Tailwind classes on individual components.

## 2. The 7-Layer Hierarchy for Navigation

Navigation components must be decoupled across the following architectural layers to transform the navigation from a simple hybrid into a robust, Theme Remix-compatible Organism:

### Layer 1 (Atoms): `NavLink.jsx`

* **Definition:** The smallest, indivisible unit of navigation.
* **Responsibility:** Renders a single link or button.
* **Token Consumption:** Must strictly consume the global color variables.
  * Active state: e.g., `var(--action-teal)` or `var(--color-brand-teal)`.
  * Default state: e.g., `var(--bg-midnight)` or `var(--color-layer-canvas)`.

### Layer 2 (Molecules): `NavGroup.jsx`

* **Definition:** A collection or cluster of `NavLink` atoms.
* **Responsibility:** Grouping related links under a single header (e.g., "Systems," "Core," "Typography").
* **Token Consumption:** Defines the structural flow and spacing between links using global spacing tokens (e.g., `var(--spacing-unit)`).

### Layer 3 (Organisms): `VerticalNav.jsx`

* **Definition:** The high-level component that stitches `NavGroup` molecules together into the main navigation sidebar.
* **Responsibility:** Acts as the primary "Trigger" for Physics Sync.
* **Token Consumption:** Consumes physics variables like `var(--nav-timing)` and `var(--nav-easing)` to dictate sidebar expansion, collapse, and fluid spring animations.

### Layer 4 (templates): `DashboardLayout.jsx`

* **Definition:** The structural master template.
* **Responsibility:** Defines the layout "slots" where the Organisms (like `VerticalNav`) sit relative to the `ContentCanvas` and header.
* **Implementation Status:** DO NOT IMPLEMENT directly in the context of the navigation component code; this layer solely dictates topological placement.

---

## 3. Implementation Rules (For the Team)

* **No Hardcoded Tailwind Physics:** Do not use utility classes like `duration-300` or `ease-in-out` inside the `VerticalNav`. Always map these to the dynamic cubic-bezier or spring tokens defined by the Theme Adjuster.
* **Strict Inheritance:** A `NavLink` cannot set its own padding arbitrarily. It must inherit spacing from the `NavGroup` or use the global system spacing tokens.
* **Zero Collision:** Developing a new layout template must never force a rewrite of the `VerticalNav` organism. The organism accepts space provided by the template slot.
