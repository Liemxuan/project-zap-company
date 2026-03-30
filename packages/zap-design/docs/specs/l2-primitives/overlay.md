# Overlay — L2 Primitive Specification

**Tier:** L2 (Primitive) | **Category:** Overlay
**Source:** `genesis/molecules/dialogs/`, `genesis/atoms/interactive/dialog.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose & Scope
Overlays represent all break-out Z-index interruptions in the ZAP framework (Dialogs, Tooltips, Popovers, Commands, Sheets). They operate on the highest rendering level (`L4` Dialog and `L5` Modal) to command priority user attention over the L1 Canvas and L2 Cards.

## 2. API / Props
| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | `boolean` | `false` | Controlled state dictating visibility |
| `onOpenChange` | `function` | undefined | Callback when internal Radix state requests change |
| `defaultOpen` | `boolean` | `false` | Uncontrolled initial fallback |
| `modal` | `boolean` | `true` | When true, renders a backdrop lock and disables body scroll |

## 3. L1 Token Dependencies
- **Colors**: `--color-layer-dialog` (L4), `--color-layer-modal` (L5), `--color-layer-base/50` (Backdrop).
- **Elevation**: Heavily reliant on `--card-shadow` and dynamically scaling `z-index`.
- **Border**: Pulls from `--radius-shape-medium` for rounded corners on standard dialogs.

## 4. Composition Patterns
Overlays wrap L3 atoms to compose L4 content blocks. Typically, a `Dialog` encapsulates a `Card` structure, relying on `DialogHeader`, `DialogContent`, and `DialogFooter` primitives. Tooltips serve as micro-overlays leveraging `Shape Small` radii logic.

## 5. Theme Behavior
- **CORE**: Subtle, feathered drop-shadow (`var(--card-shadow)`) against an opaque modal backdrop.
- **NEO**: Solid hard black shadow under the dialog, stark border lines.
- **METRO**: Borderless or 1px fine-border dialogs with immediate entry/exit.
- **WIX**: Deep dark background `#1A0B2E` with neon rim-lighting on the overlay focus ring.
