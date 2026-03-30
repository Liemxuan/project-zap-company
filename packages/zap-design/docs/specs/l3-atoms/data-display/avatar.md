# Avatar — L3 Atom Specification

**Tier:** L3 (Element) | **Category:** Data Display
**Source:** `genesis/atoms/data-display/avatar.tsx` | **Last Updated:** 2026-03-28

## 1. Purpose
An image element with a fallback for representing the user geometrically within Navbars, Tables, or User session components.

## 2. Variants
| Variant | Description | Visual Treatment |
|---------|-------------|-----------------|
| `default` | User graphic | An active URL fetching a rounded user image |
| `fallback`| Two letter initial | Gray background containing the extracted user initials |

## 3. Props API
| Prop | Type | Default | Required | Description |
|------|------|---------|----------|-------------|
| `src` | `string` | undefined | No | Full URL string to the `.png` or `.jpg` |
| `alt` | `string` | undefined | No | Accessibility text required by `<AvatarImage>` |
| `delayMs`| `number` | undefined | No | Time before rendering the fallback visually |

## 4. L1 Token Consumption
| Token | CSS Variable | Role in Component |
|-------|-------------|-------------------|
| Radius | `full` (`100%`) | Explicit override, universally rendering perfect circles |
| Fill | `--color-layer-panel` | Fallback span background masking the initial letters |
| Typography | `--font-m3-label` | Fallback letter text sizes scaling centrally |

## 5. Accessibility
- Radix guarantees that if the `alt` text is available, the `aria-label` is synchronized, otherwise the fallback maps as a standard `<span role="img">`.

## 6. Usage Examples
```tsx
<Avatar>
  <AvatarImage src="https://github.com/zap.png" alt="@zap" />
  <AvatarFallback>ZA</AvatarFallback>
</Avatar>
```

## 7. Do / Don't
| ✅ Do | ❌ Don't |
|-------|---------|
| Inject dynamic fallback string calculation (e.g., `user.name[0]`) | Don't square avatars manually via standard CSS |
