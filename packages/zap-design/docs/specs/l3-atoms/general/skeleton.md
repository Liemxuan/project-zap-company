# Skeleton — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** General
**Source:** `genesis/atoms/interactive/skeleton.tsx`, `genesis/atoms/data-display/skeleton.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A placeholder pulsing shape used to represent layout geometry while asynchronous data is fetching, preventing Cumulative Layout Shift (CLS) and providing visual assurance.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Fluid, inherits container size | Muted gray pulsing block |
| `avatar`| Forced round, square aspect ratio| 100% border radius |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className`| `string` | undefined | No | Allows specific height/width overrides |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `--radius` | Inherits the system curve (adjusted manually per UI) |
| Color | `--color-layer-cover`| Generates the pulsing gray/silver tone |

## 5. Accessibility
- Uses `aria-label="Loading..."` and `role="status"`.
- Pauses the pulse animation if `prefers-reduced-motion` is enabled globally.

## 6. Usage Examples
```tsx
<div className="flex items-center space-x-4">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2">
    <Skeleton className="h-4 w-[250px]" />
    <Skeleton className="h-4 w-[200px]" />
  </div>
</div>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Mimic the exact geometry of the loaded component | Don't just throw one giant 100vh skeleton on the page |
