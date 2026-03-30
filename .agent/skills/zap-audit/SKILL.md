---
name: zap-audit
description: The Universal Swarm Auditor. Use this skill when asked to review code, components, or pages against the ZAP Design Engine tokens (Typography, Elevation, Colors). It dynamically loads the correct Noun dictionary, runs explicit scans, and generates a Pass/Fail Table.
---

# ZAP Universal Audit Protocol (The Scanner)

This is the Swarm's absolute directive for scanning code compliance. You no longer hold bespoke rules in memory; you dynamically fetch the Nouns (Dictionaries) and execute the Verb (Audit).

## 1. The Noun Target Identification
Before auditing, you MUST identify the Target Noun from the user.
- **Typography:** Rules for fonts, casing, size mappings.
- **Elevation:** Rules for L0-L5 Spatial Depth and z-indexes.
- **Colors:** Rules for semantic mappings vs hardcoded hex values.

## 2. Load the Ruleset (The Dictionary)
Once the Noun is identified (and the active Theme is known, e.g., `CORE` or `METRO`), you MUST autonomously read the dictionary file:
`packages/zap-design/src/themes/[THEME]/[NOUN].md` (e.g., `typography.md`, `elevation.md`, `colors.md`).

**CRITICAL RULE:** Do not invent rules. The `.md` dictionary is the absolute law. Read it fully.

## 3. Execute the Scan
Execute the mandatory `grep` sweeps dictated by the Data Dictionary.
- *Example:* `typography.md` configures an immediate failure sweep for uppercase ghost classes (`grep -rE 'className=".*uppercase.*"'`).
- Check for implicit browser falls-backs, hardcoded Shadcn primitives, inline structural `style={{}}` attributes.

## 4. Generate the Audit Matrix
Compile the findings into a standard artifact table. DO NOT MAKE EDITS DURING THIS PHASE.

| UI Region | Element | Current Implementation | Noun Dictionary Rule | Status |
| :--- | :--- | :--- | :--- | :--- |
| **Header** | Title `<p>` | `className="text-[12px] uppercase"` | Illegal Ghost Classes. Use `<Heading>` matching `headlineLarge`. | ❌ FAILED |

## 5. Pass to Fix
Once the table is generated, you must await user approval, or if autonomously chained, pass the table into the `zap-fix` skill.
