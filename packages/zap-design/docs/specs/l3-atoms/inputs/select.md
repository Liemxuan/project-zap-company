# Select — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Inputs
**Source:** `genesis/atoms/interactive/select.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A rich dropdown interface used to pick a single item from a large list. Replaces native `<select>` to guarantee cross-browser visual fidelity, theme compliance, and complex Z-indexing behaviors.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Flat dropdown | Matches standard `--input-height` bounds and extends into L4 Space |
| `scrollable`| Large collection| Contains overflow within an active `ScrollArea` bounds |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `value` | `string` | undefined | No | Controlled root value |
| `onValueChange`| `function` | undefined | No | Callback upon selecting an `<SelectItem>` |
| `disabled` | `boolean` | `false` | No | Prevents opening of the dropdown |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Float Layer | `--color-layer-dialog` (L4) | Ensures dropdown contents block the Canvas perfectly |
| Radius | `--input-radius` | Global curve targeting on Trigger bounds |
| Hover | `--color-layer-cover` | Background application over nested `<SelectItems>` upon hover |

## 5. Accessibility
- Rooted deeply in Radix `Select`, ensuring flawless Typeahead selection within lists.
- Portals rendering guarantees the menu won't be truncated by nested `overflow: hidden` containers.

## 6. Usage Examples
```tsx
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="light">Light</SelectItem>
    <SelectItem value="dark">Dark</SelectItem>
    <SelectItem value="system">System</SelectItem>
  </SelectContent>
</Select>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Provide clear placeholder default text | Don't use `<Select>` if there are fewer than 4 choices (Use a `<RadioGroup>` instead) |
