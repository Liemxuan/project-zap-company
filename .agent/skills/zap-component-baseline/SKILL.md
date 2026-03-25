---
name: zap-component-baseline
description: Deep systemic memory regarding how to build components in Zap. Triggers on "component", "button", "typography", "m3", or "hardcode". Mandates reading SOP-022.
---

# ZAP Component Baseline Memory

You are accessing permanent recollection of the ZAP Component rendering standards established during the Typography & Component Standards Hardening sessions. 

## Memory Recall Steps:

1. **STOP** your current action. Do not generate UI code yet.
2. **READ THE SOPs**: You **MUST** understand the architectural and design rules. Execute the `view_file` tool on:
   - `/Users/zap/Workspace/olympus/docs/sops/sop-022-atomic-component-baseline.md`
   - `/Users/zap/Workspace/olympus/.agent/skills/impeccable-frontend-design/SKILL.md` (CRITICAL for Anti-Slop aesthetics)
3. **ABSORB**: Understand that we do NOT use hardcoded colors (`bg-muted`) or fonts (`font-display`) when building atoms. We use `zap_foundation.md` tokens (like `bg-primary` and `text-transform-primary`). We do not use string concatenation; we use `cn()`.
4. **EXECUTE**: Apply these exact rules to whatever component the user has just asked you to build or fix. If they ask you "why did you hardcode this", apologize, realize you forgot this SOP, and fix it immediately using `cn()` and M3 variables.
5. **BOUNDARY HUGGING**: When building wrappers around dynamic components (like the Inspector Footer around the Button), ensure you inject `style` properties if needed so `<Wrapper>` dev lines or outer container limits perfectly align (e.g. `style={{ borderRadius: 'var(--button-border-radius, 9999px)' }}`). Never allow nested "pill-in-a-square" visual rendering.
6. **THE CASING OVERRIDE TRAP (SPECIFICITY PROTOCOL)**: Never mix inline structural styles (`style={{ textTransform: 'inherit' }}`) with M3 Tailwind typography classes (like `text-transform-secondary`). Inline styles *always* win CSS specificity. If you apply a Tailwind class, you MUST purge competing inline style attributes from the element to prevent the theme tokens from being silently defeated.
7. **THE SHADCN HALO EFFECT (BUTTONS.TSX)**: The repo currently contains both `button.tsx` (legacy Shadcn) and `buttons.tsx` (modern M3 dynamic atom). You MUST NEVER import `button.tsx` using generic tailwind like `className="h-12 w-full"`. You MUST explicitly import `import { Button } from '@/genesis/atoms/interactive/buttons';` and use M3 props: `visualStyle="solid"` and `color="primary"`. Hardcoded metrics break the L1 Inspector.
