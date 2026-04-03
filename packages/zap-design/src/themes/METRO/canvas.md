# Canvas Sandbox Standard (PRD-037) — Metro Theme

> [!IMPORTANT]
> **ZAP-AUDIT DIRECTIVE:** This file is the absolute source of truth for the **L3/L4 Sandbox Canvas architecture**. The `zap-audit` skill must use this to verify the structural integrity of component sandboxes.

## 1. Role & Definition
The **L3/L4 Sandbox Canvas** is the dedicated environment for auditing and interacting with individual atomic and molecular components. It bridges the gap between the application's L2 (Cover) floor and the L3 (Panel) component surfaces.

## 2. Mandatory Structural Components (The Macros)
1. **`<CanvasBody>`**: The root wrapper for all sandbox content.
   - **L2 Surface Restoration**: MUST use `flush={false}` to restore the `bg-layer-cover` floor for components.
2. **`<CanvasBody.Section>`**: Structural dividers for different sandbox scenarios (e.g., Live Render, Variants).
   - **Padding**: MUST use `flush={false}` by default to maintain consistent grid alignment.
3. **`<CanvasBody.Demo>`**: The dedicated display area for the component.
   - **Centering**: SHOULD use `centered={true}` for atomic components.
4. **`<SectionHeader>`**: The mandatory header for every `CanvasBody.Section`.
   - **Attributes**: MUST include `number`, `title`, `icon`, `description`, and `id`.

## 3. Forbidden Legacy Patterns
The following patterns are considered **CRITICAL FAILURES** and MUST BE FIXED:
- **Raw `div` containers**: Replacing structural macros with generic `flex flex-col` wrappers.
- **Legacy Sliders**: Using `Slider` components for border-radius, border-width, or theme-bound typography settings.
- **Hardcoded Padding**: Using `p-8` or `py-10` on root-level sandbox containers instead of relying on the `CanvasBody` system.
- **Section Dividers**: Using `<section>` tags or horizontal rules instead of `CanvasBody.Section`.

## 4. Inspector Token Standardization
All inspector controls for foundational properties (Radius, Border, Type) MUST be mapped to the **M3 Design Token schema**:
- **Radius/Border**: Use `<Select>` populated from `BORDER_RADIUS_TOKENS` and `BORDER_WIDTH_TOKENS` in `@/zap/sections/atoms/foundations/schema`.
- **Typography**: Use `<Select>` populated from `TYPE_STYLES` in `@/zap/sections/atoms/foundations/schema`.
- **Values**: Controls should emit the **token string** (e.g., `rounded-lg`) rather than raw px values where possible, or map the token back to its resolved px value via a helper.

## 5. Mandatory Audit Grep Scans
```bash
# 1. Sweep for legacy div-based sections
grep -rE '<section className="space-y-[0-9]' src/app/design/zap/atoms --include="*.tsx"

# 2. Sweep for legacy sliders used for radius/border
grep -rE 'Slider.*borderRadius|Slider.*borderWidth|Slider.*fontSize' src/app/design/zap/atoms --include="*.tsx"

# 3. Sweep for missing CanvasBody macro root
grep -rL 'CanvasBody' src/app/design/zap/atoms/*/page.tsx

# 4. Sweep for missing SectionHeader components
grep -rL 'SectionHeader' src/app/design/zap/atoms/*/page.tsx
```

## 6. Resolution Guide for `zap-fix`
1. Re-wrap the entire page content in `<CanvasBody flush={false}>`.
2. Migrate each content group into `<CanvasBody.Section>` with an accompanying `<SectionHeader>`.
3. Wrap interactive previews in `<CanvasBody.Demo>`.
4. Refactor the `inspectorControls` to replace `<Slider>` with `<Select>` bound to `schema.ts`.
5. Fix relative import paths to use canonical `@/zap/...` or normalized `../../../../` depth.
6. Remove unused legacy imports (`Slider`, `parseCssToNumber`, `Wrapper` if internal to template).
