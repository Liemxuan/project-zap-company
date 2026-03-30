# Color Data Dictionary (Metro Theme)

> [!IMPORTANT]
> **ZAP-AUDIT DIRECTIVE:** This file is the absolute source of truth for Color configuration in the Metro theme. The `zap-audit` skill must evaluate all components against these rules.

## 1. The Core Rule (No Raw Hex)
Raw hex codes (e.g., `#ffffff`, `#1c1a0d`) are strictly forbidden in `className` or `style` attributes. All UI colors must be defined using the semantic M3 class mappings below.

## 2. Semantic Token Mappings

### Backgrounds (Surfaces)
- **Base Root (L0):** `bg-layer-base`
- **Primary Canvas (L1):** `bg-layer-canvas`
- **Standard Container (L2):** `bg-layer-cover`
- **Elevated Panel (L3):** `bg-layer-panel`
- **Floating Dialog (L4):** `bg-layer-dialog`
- **Blocking Modal (L5):** `bg-layer-modal`

### Typography Colors
- **Primary Text:** `text-on-surface` (High contrast, readable)
- **Secondary Text:** `text-on-surface-variant` (Muted, descriptive)
- **Inverse/Dark Mode Toggle Text:** `text-inverse-on-surface`

### Brand / Accents
- **Primary Brand Color:** `bg-primary` (Use `text-on-primary` for text inside it)
- **Secondary Highlight:** `bg-secondary`
- **Destructive/Error:** `bg-error` (Use `text-on-error` for text inside it)

## 3. Mandatory Audit Grep Scans
The auditor MUST run the following scans to identify illegal implementations:

```bash
# IMMEDIATE FAILURE: Scan for hardcoded hex strings inside inline styles or Tailwind arbitrary classes
grep -rE '(style=\{\{.*#([0-9a-fA-F]{3}){1,2}.*\}\}|bg-\[#[0-9a-fA-F]{3,6}\]|text-\[#[0-9a-fA-F]{3,6}\])' src/ --include="*.tsx"
```

## 4. Resolution Guide for `zap-fix`
When replacing hardcoded hex values, `zap-fix` must evaluate the element's structural depth or role and substitute the correct token from Section 2.
