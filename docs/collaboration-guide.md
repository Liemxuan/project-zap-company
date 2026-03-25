# ZAP Olympus Collaboration Guide

## Current State

* **Phase:** Navigation Restructuring & Theme Remix Validation
* **Focus:** Core setup, Molecule standardization (SideNav, MainNavBar, Breadcrumbs), Neo-Brutalist 2-Bucket system.
* **Recent Accomplishments (As of End-Of-Day Sync):**
  * Rebuilt `SideNav` with 3-level deep Accordion structures for "projects".
  * Locked `Settings` and `Dev Mode` toggles precisely to the bottom of the sticky sidebar.
  * Applied "Roll Pattern" dynamic semantic highlighting to level 2 components (Primary, Secondary, Tertiary).
  * Migrated raw utility colors to our standardized `Bucket 1` theme tokens (`bg-layer-cover`, `border-card-border`, `text-theme-base`).
  * Stripped old "ZAP BETA" literal text block inside `MainNavBar` and adopted the generic `Avatar` component for unified profiles.
* **Repository Status:**
  * `zap-claw` committed and pushed seamlessly to remote structure.
  * `zap-design` (UI Monorepo) local changes committed safely.

## Handoff Directives for Vietnam Team

1. **Strict Token Adoption**: Proceeding forward, NO hardcoded hexes or arbitrary `bg-slate/zinc` are to exist in the UI. Reference `globals.css` structure for technical tokens (Layer Protocol: `layer-canvas`/`layer-cover`/`layer-panel`).
2. **Atom Integrity Check**: We are initiating an automated Hydra pass overnight (EST time) over existing Atoms. Avoid heavy rewriting in `/genesis/atoms/` until our morning check-in to prevent cross-merges.
3. **Core Extension Tasking**: Focus your engineering efforts on data-hydration paths or Next.js route construction. The design structure is locked and handled by the Engine.

*(End of Sync)*
