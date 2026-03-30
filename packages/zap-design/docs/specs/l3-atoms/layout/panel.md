# Panel — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Layout
**Source:** `genesis/atoms/surfaces/panel.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `Panel` sits at layer Level 3 (L3). Unlike Cards, Panels generally mount permanently to the edge of the viewport (Sidebars, Inspector overlays) or represent major sub-structural wings within an app shell. 

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `sidebar` | Typical left-nav mount | Uses `--color-layer-panel` |
| `inspector`| Right-nav toggle | Thick left-stroke outline bounding the layout grid |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `position` | `'left'\|'right'`| `'left'` | Yes | Determines visual pinning behavior |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Layer 3 | `--color-layer-panel` | M3 mapped Panel container background |
| Outline | `--color-outline-variant` | Creates the inner 1px divide stopping color flow |

## 5. Accessibility
- Requires `aria-hidden="true"` conditionally if mounted but completely off-screen (e.g., mobile sheets).
- Must contain an `<aside role="complementary">` wrapping tag if it presents side-loaded data.

## 6. Usage Examples
```tsx
<Panel position="right" className="hidden lg:block w-96 border-l">
  <InspectorControls />
</Panel>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Fix to `h-screen` viewport bounds | Don't confuse Panels with Cards that sit in the Canvas |
