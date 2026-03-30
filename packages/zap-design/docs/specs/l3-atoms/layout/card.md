# Card — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Layout
**Source:** `genesis/atoms/surfaces/card.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
The `Card` is the workhorse L2 Surface. It bounds content into manageable, digestible chunks that float visually above the Canvas. Cards encapsulate individual atomic features or dashboard widgets.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard solid surface | Uses `--color-layer-cover` and a standard soft shadow |
| `outlined`| Shadowless bounds | Removes the shadow, relies on `--color-card-border` purely |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className`| `string` | undefined | No | Custom width/height boundaries |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Layer 2 | `--color-layer-cover` | The surface background |
| Shadows | `--card-shadow` | Default depth presentation |
| Radius | `--card-radius` | Global corner logic linking directly to Inspector |
| Border | `--color-card-border` | The 1px delimiter (`--card-border-width`) |
| Padding | `--spacing-card-pad`| Hardcoded inset spacing on CardContent arrays |

## 5. Accessibility
- Relies heavily on accurate header hierarchy (`<CardTitle>` rendering as `H3/H4`).
- Interactive cards MUST have `<button>` wrappers for `onKeyPress` navigation.

## 6. Usage Examples
```tsx
<Card>
  <CardHeader>
    <CardTitle>System Load</CardTitle>
    <CardDescription>Current server telemetry.</CardDescription>
  </CardHeader>
  <CardContent>
    <MetricChart />
  </CardContent>
  <CardFooter>
    <Button>Refresh</Button>
  </CardFooter>
</Card>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Implement standard Dashboard blocks with Card | Don't put a Card inside another Card (use basic `div` borders for sub-sections) |
