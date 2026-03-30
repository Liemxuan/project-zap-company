# Canvas — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Layout
**Source:** `genesis/atoms/surfaces/canvas.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `Canvas` is the strict L1 background layer component. It is the infinite scrollable backing of the primary application viewport, rendering immediately under all visual content.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard empty canvas | Simple container bounding all max width `children` |
| `island`| Restricted center column | Restricts the main body to a max-width center-aligned column |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `children` | `ReactNode` | undefined | Yes | The entire page content |
| `className`| `string` | undefined | No | Appends to the base wrapping |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Layer 1 | `--color-layer-canvas` | Hard dependency on the active theme's `#F8FAFC` base |
| Type | `--font-m3-body` | Establishes the text cascade point |

## 5. Accessibility
- Generally serves as `<main role="main">` for screen readers dictating the start of the page content.
- Applies standard focus ring resets to inner layers.

## 6. Usage Examples
```tsx
<Canvas variant="island">
  <PageHeader />
  <Feed />
</Canvas>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Place all Cards and primary modules inside | Don't wrap a Canvas inside another Canvas |
