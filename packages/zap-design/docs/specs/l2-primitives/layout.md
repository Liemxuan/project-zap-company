# Layout — L2 Primitive Specification

**Tier:** L2 (Primitive) | **Category:** Layout
**Source:** `genesis/layout/MasterVerticalShell.tsx`, ` genesis/layout/Inspector.tsx`, `genesis/atoms/surfaces/` | **Last Updated:** 2026-03-28

## 1. Purpose & Scope
The Layout primitives establish the global structural containers that orchestrate the ZAP Design Engine's 3-Layer Semantic System. They manage the primary screen real estate, bounding areas into persistent functional zones (e.g., Vertical Nav, Main Canvas, Inspector sidebar). These components act as "shells," passing context rather than distinct data, to ensure uniform grid alignment and viewport control.

## 2. API / Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | required | The content to render strictly within the shell body |
| `activeModule` | `string` | `''` | Dictates the current active route for nav highlights |
| `className` | `string` | `undefined` | Optional root-level class appending |
| `showInspector` | `boolean` | `false` | Toggles the secondary contextual right-sidebar |

## 3. L1 Token Dependencies
- **Colors**: `--color-layer-base` (L0), `--color-layer-canvas` (L1), `--color-layer-panel` (L3).
- **Typography**: Inherits `font-body` global text alignment.
- **Spacing**: Requires `--spacing-element-gap` for fluid grid sizing between panels.

## 4. Composition Patterns
- **MasterVerticalShell** acts as the root L0 base.
- **VerticalNav** renders as an L3 persistent panel on the left.
- **Canvas** (Main tag) renders as an L1 container where pages mount their content.
- **Inspector** renders conditionally on the right as an L3 panel.

## 5. Theme Behavior
- **CORE**: `MasterVerticalShell` operates with subtle ambient divider lines and an `#f8fafc` canvas.
- **NEO**: Drops border dividers in favor of hard `#000` outlines between primary layout blocks.
- **METRO**: Utilizes dense 1px grid borders bounding all navs, turning the shell into a flat Windows-style workspace.
- **WIX**: Deep space backgrounds with subtle glowing delimiters between nav and canvas.
