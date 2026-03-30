# Property Box — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Data Display
**Source:** `genesis/atoms/data-display/property_box.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A specialized, dense key-value pair container primarily utilized within Inspector sidemenus and code-preview screens. It aligns a Label (`key`) directly opposite its Value or Input controller on a single rigid horizontal grid.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Standard property | Flex-between arrangement with a faint bottom border |
| `compact` | No-padding | Tight grid stacking for massive lists of properties |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `label` | `string` | undefined | Yes | The static property name |
| `value` | `ReactNode` | undefined | Yes | Rendering block (text or an interactive Input atom) |
| `orientation`| `'horizontal'\|'vertical'`| `'horizontal'`| No | Stacks property/value directly underneath the label if vertical |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Typography | `--font-m3-label` | Strictly binds the property Key to M3 label scale |
| Outline | `--color-outline-variant` | Creates the 1px delimiter beneath horizontal lists |
| Canvas | `--color-layer-panel` | Maps the local background for grouping |

## 5. Accessibility
- Must contain `aria-labelledby` linking the `label` cleanly to whatever input or display constitutes the `value`.

## 6. Usage Examples
```tsx
<PropertyBox label="Status" value={<Switch defaultChecked />} />
<PropertyBox label="Max Value" value="450 ms" />
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Build Inspector configuration accords rapidly with mapping PropertyBoxes | Don't let massive string values wrap continuously; utilize `truncate` explicitly on the `value` |
