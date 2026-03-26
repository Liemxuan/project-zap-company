# TASK: L1, L2, L3 Color Hierarchy Audit (Atoms & Molecules)

## Objective

Confirm that the L1, L2, and L3 color standards are correctly implemented across all 7 Atom and Molecule pages within the ZAP Design Engine.

## Context & Strategy

We have rigorously wrapped our components using the Segmented Audit Protocol (SAP) and ZAP Dev Wrappers. You must utilize these wrappers as your primary audit mechanism to identify if the structural coloring is correctly coded.

## Scope

The following directories contain the 7 core pages to audit:

- `packages/zap-design/src/zap/sections/atoms/*`
- `packages/zap-design/src/zap/sections/molecules/*`

## Assertions (Quantitative Grading)

1. **L1 Compliance:** The foundational background/surface uses the correct L1 design token.
2. **L2 Compliance:** Groupings and segment boundaries use the correct L2 design token.
3. **L3 Compliance:** Interactive elements and top-layer nested components use the correct L3 design token.
4. **Wrapper Identification:** You must prove you used the `Wrapper` components to identify these layers.

**Trigger Words:** Please architect a deep multi-file audit of the database schema and rebuild if necessary. (Included to ensure this routes to the Complex Queue).
