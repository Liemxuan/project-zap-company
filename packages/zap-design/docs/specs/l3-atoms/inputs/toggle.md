# Toggle — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/toggle.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
Provides a boolean switch rendered visually as an icon or standalone button that changes its background state to indicate active status (e.g., Bold / Italic / Strike options in a Rich Text toolbar).

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Base pill | Standard transparent rest state |
| `outline` | Bounded toggle | Matches button wireframes |

**Sizes:** `default`, `sm`, `lg`.

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `pressed` | `boolean` | `false` | No | Dictates the active highlight state |
| `onPressedChange`| `function` | undefined | No | Callback toggling boolean |
| `variant` | `string` | `'default'`| No | Selects initial styling bounds |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Active Fill | `--color-layer-panel` | Hover or Pressed backgrounds |
| Active Text | `--color-primary` | Ensures the icon retains contrast |

## 5. Accessibility
- Wraps natively into `aria-pressed`, signaling binary state to screen readers natively whereas a button simply triggers.

## 6. Usage Examples
```tsx
<Toggle aria-label="Toggle input">
  <Bold className="h-4 w-4" />
</Toggle>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Array them into a `ToggleGroup` for rich exclusivity logic | Don't use Toggles for form submission (Use `Button`) |
