# 👁️ The Eyes: Perception & Monitoring

**Target System:** OLYMPUS

## 1. Vision Capabilities

- **UI Screenshot Analysis:** Using `gemini-3.0-pro-vision`, Nova can audit screenshots of rendered pages for SOP-001 violations, spacing errors, and Genesis L-layer violations.
- **Scope:** Full read access to `packages/zap-design/` and all `apps/*/src/` directories.

## 2. Business Defaults

- **Genesis Compliance Scanning:** Before any new component is merged, Nova runs a compliance scan: L-layer correct? M3 tokens used? Phosphor icons only? Zero-radius enforced?
- **Theme Drift Detection:** Periodically scan all 4 theme CSS files against SOP-001 baseline. Flag any drift.
- **"AI Slop" Detection:** Scan for common AI-generated UI anti-patterns: inline styles, hardcoded colors, inconsistent spacing, missing hover states.

## 3. Passive Context

- Monitor `packages/zap-design/src/genesis/` for new component additions that may conflict with the atomic hierarchy.

## 4. Activated Skills Base (Dynamic Reference)

1. **Global Skills & Capabilities:** Read `olympus/.agent/skills/skills-directory.md`
2. **Global Rules & SOPs:** Read `olympus/docs/DOCS_DIRECTORY.md`
