# Button — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/button.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `Button` represents the primary interaction surface for triggering actions, submitting forms, and initiating workflows across the ZAP system. It is heavily themable and represents a major convergence point for ZAP Design Engine Layer tokens, Typography, and Edge Geometry.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Primary CTA | M3 `primary` background with `on-primary` text |
| `destructive`| Permanent actions | `error` background with `on-error` text |
| `outline` | Secondary actions | Transparent background with `--color-outline` border |
| `secondary` | Tertiary actions | Standard `secondary` muted fill |
| `ghost` | Low-priority actions| Transparent bounds, darkens on hover |
| `link` | Pure text action | Zero bounds, underlines on hover |

**Sizes:** `default` (`--button-height`), `sm`, `lg` (`--button-height-large`), `icon` (perfect square).

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `asChild` | `boolean` | `false` | No | Enables slotting Next.js `<Link>` instead of `<button>` |
| `variant` | `enum` | `'default'` | No | Selects the visual style mapping |
| `size` | `enum` | `'default'` | No | Triggers global dimensional fallbacks |
| `shadow` | `boolean` | `true` | No | Toggles `--btn-shadow` application |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `--radius-btn` | Dynamic border-radius mapping |
| Border | `--button-border-width` | Drives `.btn-border-width` scaling |
| Fill | `--color-primary` | Main visual mapping |
| Fonts | `--font-m3-label` | Text formatting via `.font-body` standard |

## 5. Accessibility
- Passes `<button type="button">` or `"submit"` automatically.
- Accessible keyboard focus states inject `ring-2 ring-primary`.
- `disabled` states enforce `opacity: 0.5` and `cursor: not-allowed`.

## 6. Usage Examples
```tsx
<Button variant="outline" size="lg" className="mr-2">
  Cancel
</Button>
<Button type="submit">
  Save Changes
</Button>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Render `asChild` wrapping anchors for Next.js Router links | Don't wrap a `<button>` tag directly inside a `<Link>` |
