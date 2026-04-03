---
name: zap-fix
description: The Universal Swarm Executor. Takes a generated Audit Matrix (from zap-audit) and surgically applies the structural token substitutions required to achieve compliance, then marks the task as fixed.
---

# ZAP Universal Fix Protocol (The Mechanic)

The `zap-fix` protocol takes the verified outputs from `zap-audit` and physically alters the codebase to comply with the Noun Data Dictionaries (`elevation.md`, `typography.md`, `colors.md`).

## 1. Accept The Audit Matrix
You must possess an Audit Table artifact containing `❌ FAILED` rows before executing. Do not guess fixes; follow the structured report.

## 2. The Golden Rules of Execution
When applying the fix, strictly follow the Universal Zap Mandates:
1. **The Component Map Rules All:** Replace raw HTML tags (`<p>`, `<span>`, `<div>`) with ZAP Atomic Primitives (`<Heading>`, `<Text>`, `<GenesisCard>`).
2. **The Canvas Macro Standard:** In sandboxes/labs, replace `div` based implementations with `<CanvasBody.Section>` and `<CanvasBody.Demo>`.
3. **L2 Restoration Mandate:** Ensure `<CanvasBody flush={false}>` is set to provide the mandatory `bg-layer-cover` depth.
4. **Eradicate Ghost Classes:** Remove hardcoded sizing, casing, hex codes, or spacing arrays that override the internal atomic token mappings.
5. **The Object.assign Bypass:** If dynamic runtime styles are explicitly required (e.g., a Sandbox Theme picker), wrap them strictly: `style={Object.assign({}, { borderRadius: 'var(--layer-2-border-radius)' })}`.
6. **Ascension Depth:** If patching elevation/layers, you must ascend (e.g., L2 -> L3 -> L4). Never nest a `bg-layer-base` (L0) inside a `bg-layer-cover` (L2).
7. **Token-Bound Selectors:** Replace `Slider` controls for tokens (Radius, Border) with `<Select>` bound to `schema.ts`.

## 3. Execution and Check-Off
Use multi_replace_file_content or file patching to update the target files. 
As you resolve each line item in the Audit Matrix, check it off the list by changing `❌ FAILED` to `✅ FIXED`.

## 4. Final Validation
You MUST run the TypeScript compiler (`npx tsc --noEmit`) on any modified app router or package boundary to ensure you didn't break React DOM typing when swapping raw HTML strings to ZAP Typed primitives. If the TypeScript build passes, return control to the User or the Swarm cycle.
