# Checkbox Layout & Theming Publish Protocol

## Motivation
The ZAP Design Engine (M3 implementation) enforces strict decoupling of structural component files (Genesis Atoms) from theme-specific styling (Typography, Layouts, Metrics). To support the visual specification of ZAP checkboxes—which must be capable of rendering standard, oversized, icon-injected, or complex multi-line labels—checkbox styles are not hardcoded inside `checkbox.tsx`.

## The Protocol

1. **Strict Context Injection**: Checkboxes will be wrapped with the `<Wrapper type="Wrapped Snippet">` layer in the typography and component playgounds. Checkbox instances will expose an `id` or `data-slot="checkbox"` to allow dynamic `<style>` tags to inject rules.

2. **Backend Persistence**: Modified checkbox properties (e.g., sizing metrics, label typography, border radii) are captured by the `DraggableToolbox` when the underlying active tool sets focus on the "checkbox" atom. The "Publish Atom" button sends a delta payload precisely scoped to `components.checkbox`.

3. **Validation Sequence**:
   - `ThemeContext.tsx` reads `typographyOverrides.components.checkbox`.
   - The overrides dynamically write to `var(--checkbox-size)`, `var(--checkbox-border-radius)`, and font properties.
   - The M3 Sandbox template (`/design/zap/atoms/checkbox`) consumes these variables automatically. The sandbox remains unaware of the source JSON profiles (`metro.json`, `core.json`, etc.).

## Checkbox Atom Architecture (Future Execution)

The implementation of `src/components/ui/checkbox.tsx` (or its Genesis override) will:
1. Inherit `className` processing via `cn()`.
2. Default its font rules to ZAP `[text-labelLarge]` or `[text-bodyMedium]` to strictly bind the M3 text properties.
3. React to externally driven size tokens (e.g., `[var(--checkbox-box-size,16px)]`) rather than fixed utility classes (`w-4`).

> This protocol mirrors the Button Theming sequence executed in the previous Typography Publishing operation.
