# Spacing Data Dictionary (Core Theme)

> [!IMPORTANT]
> **ZAP-AUDIT DIRECTIVE:** This file is the absolute source of truth for Spacing configuration in the Core theme. The `zap-audit` skill must evaluate all components against these rules.

## 1. The Core Rule (Component Tokens Rule All)
Do not hardcode repetitive Tailwind padding or margin utilities on primitive Atoms (like `Button`, `Input`). Spacing geometry is dictated strictly by the component's internal CSS variable map.

## 2. Structural Layer Progression (L0 - L5)
When mapping out an interface, elements must obey spatial padding rules based on their Layer Depth.
*Note: This Noun dictionary defines horizontal/vertical geometry. Z-index geometry is governed by `elevation.md`.*

- **L1 (Canvas):** Full viewport bleed. No explicit outer wrapper padding.
- **L2 (Cover):** Primary sandbox boundaries. Usually `p-6` or dynamic CSS vars (`var(--layer-2-padding)`).
- **L3-L4 (Panels/Dialogs):** Dense internal padding. Must inherit `var(--layer-X-padding)`.

## 3. Mandatory Audit Grep Scans
The auditor MUST run the following scans to identify illegal manual spacing:

```bash
# IMMEDIATE FAILURE: Scan for hardcoded padding/margin on atomic input wrappers
grep -rE 'px-[0-9]+|py-[0-9]+|pt-[0-9]+|pb-[0-9]+' src/genesis/atoms --include="*.tsx"
```

## 4. Resolution Guide for `zap-fix`
When replacing hardcoded spacing utilities, `zap-fix` must strip the explicit layout classes and ensure the parent container dictates the flex gap or padding. If replacing button margins, map them back to global `--button-icon-gap`.
