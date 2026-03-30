# Table — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Data Display
**Source:** `genesis/atoms/data-display/table.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
A highly structured responsive wrapper around native HTML tabular structures `table/thead/tbody`. Enforces strict alignment, thematic border tokens, and hover states on rows.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Base Radix grid | Standard 1px rows |
| `striped` | Zebra-striping | `.bg-layer-cover` alternating background mapped colors |
| `dense` | Height reduced | Halves the padding across all `td/th` nodes |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `className` | `string` | undefined | No | Binds padding overrides |

**Sub-Components:** `TableHeader`, `TableBody`, `TableFooter`, `TableHead`, `TableRow`, `TableCell`, `TableCaption`.

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Colors | `--color-layer-base` | Injects the standard Table Row background hovering states |
| Border | `--color-outline-variant` | Applies the standard table 1px `.border-b` across headers and lists |
| Type | `--font-m3-body` / `--font-m3-label` | `th` maps to labels, `td` maps to standard global body type |

## 5. Accessibility
- Ensures explicit screen-reader compatibility natively by relying heavily on proper `<th scope="col">` rules.
- Contains wrappers mapping `overflow-x-auto` strictly so that large data grids do not break the page.

## 6. Usage Examples
```tsx
<Table>
  <TableHeader>
    <TableRow>
      <TableHead className="w-[100px]">Invoice</TableHead>
      <TableHead>Status</TableHead>
      <TableHead className="text-right">Amount</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell className="font-medium">INV001</TableCell>
      <TableCell>Paid</TableCell>
      <TableCell className="text-right">$250.00</TableCell>
    </TableRow>
  </TableBody>
</Table>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Inject Pills and Status Indicators perfectly into columns | Don't build multi-action tables without abstracting an L4 `DataTable` logic module |
