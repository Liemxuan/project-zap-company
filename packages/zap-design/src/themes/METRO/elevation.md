# ZAP Surface Elevation Protocol (METRO)
> This document is auto-generated upon Theme Publishing. It represents the single source of truth for ZAP-OS L0-L5 surface semantics for this theme.
> Last Sync: 2026-04-02T04:33:21.311Z

## 1. The Default M3 Surface Map
By default, the `bg-layer-*` utility classes map directly to the underlying Material 3 surface tint hierarchy:
- **L0: Base** (`bg-layer-base`) → `--md-sys-color-surface-container-lowest`
- **L1: Canvas** (`bg-layer-canvas`) → `--md-sys-color-surface-container-low`
- **L2: Cover** (`bg-layer-cover`) → `--md-sys-color-surface-container`
- **L3: Panels** (`bg-layer-panel`) → `--md-sys-color-surface-container-high`
- **L4: Dialogs** (`bg-layer-dialog`) → `--md-sys-color-surface-container-highest`
- **L5: Modals** (`bg-layer-modal`) → `--md-sys-color-surface-container-highest` (Note: L5 shares the highest container token but often incorporates scrim/shadow values for depth)

## 2. The Dynamic Override Tokens
The ZAP system allows real-time theming via the Inspector. These override tokens sit on top of the defaults. If these CSS variables are set, they override the M3 standard colors via `color-mix()`.

Currently active inspector overrides for this theme session:
- **L0 Override:** `var(--layer-0-bg-token)`  (Active: `default`)
- **L1 Override:** `var(--layer-1-bg-token)`  (Active: `default`)
- **L2 Override:** `var(--layer-2-bg-token)`  (Active: `default`)
- **L3 Override:** `var(--layer-3-bg-token)`  (Active: `default`)
- **L4 Override:** `var(--layer-4-bg-token)`  (Active: `default`)
- **L5 Override:** `var(--layer-5-bg-token)`  (Active: `default`)

## 3. The DevMode Debug Colors
When spatial depth debugging is activated (`[data-devmode="true"]`), the architecture forcefully applies highly saturated generic colors to easily spot "layer inversion":
- **L0:** `#e5e7eb` (Gray-200)
- **L1:** `#f87171` (Red-400)
- **L2:** `#facc15` (Yellow-400)
- **L3:** `#22c55e` (Green-500)
- **L4:** `#a855f7` (Purple-500)
- **L5:** `#ec4899` (Pink-500)

## ZAP Structural Compliance Rules

### A. The Strict Ascension Rule (Terminal Violations)
The system explicitly calls out a **Terminal Violation** for spatial inversion.
* **The Rule:** "Once an **L2 Cover** wrapper is established (like a main body sandbox), all inner localized content MUST strictly ascend to `bg-layer-panel` (L3) or `bg-layer-dialog` (L4)."
* **The Warning:** Nesting `bg-layer-base` (L0) or `bg-layer-canvas` (L1) inside an L2 Cover is flagged as an architectural failure.

### B. Interaction State Mechanics
Elevation is not static. The `COMPONENT_ELEVATION_MAP` dictates exactly how surfaces must react to user interaction:
* **Hover:** Raises the elevation by exactly **1 level** (e.g., L1 Card elevates to L2 on hover).
* **Press/Active:** Drops back down to the **default level**.
* **Disabled:** Hard drops to **Level 0 (Flat)** with reduced opacity.

### C. Z-Index Coupling & Tint Mathematics
ZAP replaces arbitrary drop shadows with the M3 Tint Overlay math.
* **Tint Opacity:** Elevation hierarchy is primarily achieved by injecting microscopic amounts of primary color into the surface background (L1 is 5% tint, L5 is 14% tint).
* **Z-Index Bonding:** Every semantic layer is hard-coupled to a z-index band. 
  * `L1: z-10`
  * `L2: z-100`
  * `L3: z-1000+`
  * `L4: z-2000+`
  * `L5: z-3000`