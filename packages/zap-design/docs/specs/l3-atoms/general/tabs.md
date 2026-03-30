# Tabs — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** General
**Source:** `genesis/atoms/interactive/Tabs.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
Interactive segmented controls that toggle visibility of mutually exclusive content panes occupying the same visual space without requiring routing.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | Contained pill segments | Renders a unified background container |
| `underline`| Minimal text links | A clean line that translates via Framer Motion beneath the active text |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `defaultValue`| `string` | undefined | Yes | Sets the initially mounted tab |
| `onValueChange`| `function`| undefined | No | Callback when a user selects a tab |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `--btn-radius` | Applied to the active tab pill in default variant |
| Color | `--color-primary` | Active tab background or underline color |
| Type | `--font-m3-label`| Text sizing for the tab identifiers |

## 5. Accessibility
- Implements `role="tablist"`, `role="tab"`, and `role="tabpanel"` out-of-the-box.
- Fully operable via keyboard (Arrow keys toggle focus logic).

## 6. Usage Examples
```tsx
<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="password">Password</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Account details here.</TabsContent>
  <TabsContent value="password">Change password here.</TabsContent>
</Tabs>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Use Tabs to swap related settings views | Don't use standard Tabs for primary site routing (use a NavBar instead) |
