---
name: ZAP L1-L2 Layer Audit
description: Procedural audit to enforce M3 Spatial Depth (Layer 0–5) by removing inline background color overrides and tagging surfaces with bg-layer-* classes. Let MetroShell, Inspector, and globals.css govern shell colors and dev-mode debug visibility.
---

# ZAP L1-L2 Layer Audit Protocol

This skill dictates how Spike (or any agent) must audit and clean UI pages in the ZAP Design Engine to enforce the strict **Material 3 (M3) Spatial Depth Rules** for Layer 0 through Layer 5.

## Context: The Spatial Depth Rules

### Layer Token Map

| Layer | Tailwind Class       | CSS Variable          | M3 Surface Token                           | Dev Color  | Debug Class   |
|-------|---------------------|-----------------------|--------------------------------------------|------------|---------------|
| L0    | `bg-layer-base`     | `--color-layer-base`  | `surface-container-lowest`                 | #e5e7eb    | `debug-l0-cad`|
| L1    | `bg-layer-canvas`   | `--color-layer-canvas`| `surface-container-low`                    | #f87171    | (MetroShell)  |
| L2    | `bg-layer-cover`    | `--color-layer-cover` | `surface-container`                        | #facc15    | (auto)        |
| L3    | `bg-layer-panel`    | `--color-layer-panel` | `surface-container-high`                   | #22c55e    | `debug-l3`    |
| L4    | `bg-layer-dialog`   | `--color-layer-dialog`| `surface-container-highest`                | #a855f7    | `debug-l4`    |
| L5    | `bg-layer-modal`    | `--color-layer-modal` | `surface-container-highest` (+ scrim)      | #ec4899    | (auto)        |

### Ownership

- **L0 (Base)**: `<html>` / document body. Governed by root CSS.
- **L1 (Canvas)**: `<main>` tag inside `MetroShell.tsx`. Governed by MetroShell.
- **L2 (Cover)**: Content sandbox wrappers. Page components use `bg-layer-cover` on their main content card.
- **L3 (Panel)**: Inspector header, Inspector footer, section cards, nav panels. Use `bg-layer-panel debug-l3`.
- **L4 (Dialog)**: Elevated headers inside L3, popovers, confirmations. Use `bg-layer-dialog debug-l4`.
- **L5 (Modal)**: Full-screen blocking overlays. Use `bg-layer-modal`.

## The Problem (The Corporate Rot)

Many individual pages (`page.tsx`) and custom `Inspector` instance declarations have historically hardcoded inline style overrides, such as:
- `style={{ backgroundColor: 'var(--md-sys-color-surface-container-lowest)' }}`
- `style={{ backgroundColor: 'var(--md-sys-color-surface)' }}`
- `style={{ backgroundColor: hexFromArgb(scheme.surfaceContainerLowest) }}`

This breaks:
1. **Dev-mode visibility**: The elevation page cannot control opacity/border for untagged surfaces.
2. **Global token inheritance**: CSS specificity on `[data-zap-theme="metro"]` overrides fails.
3. **Dark mode**: Hardcoded hex values don't respond to theme changes.

## The Audit Boundary Rule
Never assume target components or pages live exclusively in a single directory. Before declaring an audit "complete", you MUST perform a project-wide scan covering `src/components/ui`, `src/genesis`, `src/zap/sections`, and `src/app`. Claiming an audit is 100% finished when rogue components remain in alternative directories is a critical failure.

## The Core Directive: Strip, Tag, and Trust the Shell

When auditing a page or component for layer parity:

### 1. Scan the Page Body
Find the root `<div className="flex flex-col...">` wrap inside the `<DebugAuditor>`.
If it has an inline `style={{ backgroundColor: ... }}` applying surface or surface-container tokens, **DELETE IT**. Rely entirely on the `<main>` shell from `MetroShell`.

### 2. Scan the Inspector Definition
Find `const customInspector = (<Inspector>...)`.
If the inner children `<div>` defining the inspector content have an inline `style={{ backgroundColor: ... }}` forcing a background color, **DELETE IT**. 
(Text colors, fonts, or explicit nested card container colors like `primary-container` are fine, but the *root inspector body* should allow `bg-layer-panel` to shine through naturally from the `<aside>` wrapper).

### 3. Tag Structural Containers
For every structural container that previously used `style={{ backgroundColor: ... }}` with a surface token:
- **Replace** the inline style with the appropriate `bg-layer-*` class
- **Add** the corresponding `debug-l*` class for dev visibility
- **Remove** the now-unused variable (e.g., `const bg = hexFromArgb(...)`)

### 4. Verify the "Strict Ascension Rule" (L2 → L3 → L4)
After stripping these base overrides, you must enforce the **Strict Ascension Rule**.
If a component lives inside the main L2 Cover Sandbox (`bg-layer-cover`), its inner structural child layers (like cards, tables, inner containers) **must strictly ascend** to `bg-layer-panel` (L3) or `bg-layer-dialog` (L4). It is a terminal architectural violation to nest `bg-layer-canvas` (L1) or `bg-layer-base` (L0) inside an L2 cover.

### 5. The Absolute Ban on `bg-surface-variant`
Never use `bg-surface-variant` to paint a layout shell, panel, or card background. M3 dictates that surface-variant is strictly reserved for the internal backgrounds of specific interactive components (like disabled buttons or input checkboxes), not spatial depth hierarchy. If you need a contrasting panel, use `bg-layer-panel` (L3).

### 6. Omission Rules — What NOT to Tag
The following elements are **exempt** from layer tagging:
- **Buttons** — interactive elements with their own M3 color roles
- **Pills / Badges** — status indicators with semantic colors
- **Tabs** — interactive navigation elements
- **Dynamic color previews** — components like `Swatch` that render computed ARGB values must use inline `style`
- **Device mockups** — phone/tablet frames using scheme preview colors
- **Sandbox Formatting Containers** — Generic rows, padding bounds, or flex containers that exist only to align components in the Sandbox/Inspector (like the Inspector Footer). If dev-mode `div:not([class*="bg-layer-"])` rules apply loud green bleed to these layout `div`s, **convert them to `<section>` or `<article>` tags** instead of tagging them with a background layer. This legally bypasses the Layer Audit without adding unnecessary surface tokens.

### 7. The Zero-Hardcoded-Border Rule for Structural Covers (L2)
Never hardcode `border` or `rounded-*` utilities onto structural layer containers like `bg-layer-cover` (L2). 
M3 specifies that structural layers (Cover, Panel, Modal) dictate their own border width and radius natively via `COMPONENT_BORDER_MAP` (e.g., L2 defaults to `rounded-[32px]` and `border-0`). 
Hardcoding `border border-border rounded-xl` onto a component like `<GenesisCard className="bg-layer-cover">` forcefully short-circuits the global spatial depth rules and severs the publisher's ability to structurally mute or elevate the Cover component. Strip these inline structural overrides so the element purely inherits its geometry from the CSS variable cascade (`--layer-2-border-*` or native fallback).

## Related Skill
**REQUIRED:** See `zap-layer-surface-dev-color` for the step-by-step procedure to identify untagged surfaces and apply `bg-layer-*` + `debug-l*` classes.

This protocol ensures zero inline color overrides for spatial foundations and strict depth ascension. By following this standard, we lock down our M3 Layer 0 through Layer 5 parity across all audit targets.
