---
name: Zap Fix Background
description: Standard operating procedure for eliminating bottom whitespace gaps, resolving flexbox alignment collisions, and enforcing L1 -> L2 M3 spatial depth on ZAP UI pages. Triggered by "fix background", "white space at the bottom", or "card not stretching".
---

# Zap Fix Background (Layout & Elevation Protocol)

This protocol is invoked whenever there are visual gaps, whitespace at the bottom of a page, or when an inner table/organism fails to dynamically stretch to the bottom of the viewport frame within the ZAP Design Engine.

If a user complains about layout clipping or mysterious white space at the bottom of their page, execute these 4 directives:

## 1. Strip Fixed Height Calculations
Never use explicit viewport calculations like `h-[calc(100vh-theme(spacing.16))]` to force a layout container's height on primary app layouts. When mixed with browser UI chrome, native window borders, or sub-pixel rendering, `calc(100vh)` often leaves a microscopic mathematical gap exposed at the bottom of the screen.

- **Action**: Rip out `h-[calc(...)]` and `overflow-y-auto` from the wrapper.
- **Replace with**: Strict intrinsic flex stretching: `flex-1 w-full h-full flex flex-col`. Let the parent flex container dictate the bounds.

## 2. Resolve CSS Flex Collisions & The `flex-1` Viewport Truncation Law
If an organism fails to expand vertically or stretch across the available space, look for conflicting flex properties on the parent wrapper that cause early collapse.

- **Action (Alignment)**: If the parent wrapper uses `items-start`, it strictly aligns children to the top and prevents vertical stretching. Remove `items-start` and ensure `items-stretch` is active so the container is physically forced to push the footer/content to the absolute bottom of the screen.
- **Action (Viewport Truncation)**: **CRITICAL**: If an element's background magically stops painting exactly halfway down a scrolling page, check for rogue `flex-1` classes. If a `<Canvas>` or container is set to `flex-1` *inside* an `overflow-y-auto` parent, CSS flexbox will artificially clamp the container's height to exactly `100vh`. Its children will overflow correctly, but the container's background color will abruptly slice off at the viewport boundary. **Rip out `flex-1`** from the background wrapper and let it intrinsically wrap its children (`h-max` or standard `flex-col`) for infinite background repainting.

## 3. Eliminate L1 Canvas Floor Padding
If the design dictates that an organism (like a User Vault or Data Table) should sit exactly flush against the bottom of the window (common for full-screen dashboards), you must amputate the bottom padding from the L1 Canvas floor.

- **Action**: If the parent layout uses `px-12 py-8` (or similar symmetrical padding), modify it to flush the bottom: `px-12 pt-8 pb-0`.

## 4. Enforce ZAP M3 Spatial Depth (L1 → L2)
When auditing the page for background gaps, you must simultaneously ensure strict adherence to ZAP spatial architecture rules:

- **L1 Floor**: The outer page wrapper must use `bg-layer-canvas` (L1), not the deep `bg-layer-base` (L0) foundation.
- **L2 Cover**: The inner organism (typically the `<main>` tag of the primary view component) must use `bg-layer-cover` (L2) to elevate it off the canvas. Ensure `<main>` also has `h-full flex flex-col` so it fills the L1 container.
- **Purge Geometry**: Strip out hardcoded `border-[...]` and `rounded-[...]` overrides on the L2 Cover card. It must organically inherit its geometry and ambient shadow natively from the global ZAP M3 token system (`--layer-2-border-radius`, etc.).
- **Zero Framework Bindings**: When placing components into a sandbox or view, **do not** cage them inside redundant `bg-layer-panel` or artificial bounding boxes. Let them securely float on the natural L2 cover card. Rigid "framework bindings" destroy organic space.

## 5. Audit Template Suppression Overrides
Oftentimes background layers are mysteriously absent because the underlying layout factory (e.g. `ComponentSandboxTemplate` or `LaboratoryTemplate`) is deliberately stripping them.

- **Action**: Search the layout template instantiation for global overrides like `flush={true}` or empty string bindings (`coverTitle=""`). If a template operates with `flush={true}`, it systematically detonates the spatial floor and suppresses L1/L2 parity for all children components. Remove these hardcoded overrides to instantly restore native depth.
