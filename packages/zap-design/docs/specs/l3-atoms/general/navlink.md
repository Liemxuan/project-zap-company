# NavLink — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** General
**Source:** `genesis/atoms/interactive/NavLink.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A highly specialized anchor tag replacement tailored for Next.js and the ZAP Design Engine. It understands its active state natively, rendering visual highlights when the current route matches its `href`.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `sidebar` | Vertical nav items | Wide padding, left-aligned icon, subtle highlight |
| `topbar`  | Horizontal headers| Minimal padding, bottom active border |
| `sub`     | Nested items     | Indented, smaller font size |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `href` | `string` | undefined | Yes | Route destination |
| `icon` | `ReactNode` | undefined | No | SVG Icon rendered beside label |
| `active`| `boolean` | `auto` | No | Overrides automatic route detection |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Active | `--color-primary` | M3 mapped highlight background state |
| Typography| `--font-m3-label`| Used for standard legibility |
| Radius | `--radius-btn` | Corner curve inheriting the active theme |

## 5. Accessibility
- Applies `aria-current="page"` dynamically if the route matches.
- Fully focusable, implements `--color-state-focus` standard ring.

## 6. Usage Examples
```tsx
<NavLink href="/dashboard/metrics" icon={<ActivityIcon />}>
  Metrics
</NavLink>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Use in MasterShells and layout components | Don't use for inline text links inside paragraphs |
