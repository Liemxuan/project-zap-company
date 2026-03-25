# SOP-023-TYPOGRAPHY-CASING-ENFORCER

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** B.L.A.S.T. / PROTOCOL ADHERENCE

---

## 1. Context & Purpose
This SOP governs the mandatory enforcement of the 3-tier Material 3 typography system within the `zap-design` ecosystem. It establishes the `typography-casing-enforcer.js` script as the sole authority for ensuring that `font-display`, `font-body`, and `font-mono`/`font-dev` classes are intrinsically bonded to their required M3 `text-transform` tokens, while simultaneously eradicating all legacy hardcoded casing (`uppercase`, `lowercase`, `capitalize`).

This exists to prevent "Proper Casing" bleed-throughs and FOUT (Flash of Unstyled Text) caused by disjointed utility classes.

## 2. The Tool
The enforcer script is located at:
`packages/zap-design/scripts/typography-casing-enforcer.js`

It operates in two modes:
1. ** ऑडिट Mode (Audit):** Scans the codebase and returns a statistical table of compliance metrics.
2. ** Remediation Mode (Fix):** Forcefully injects the required tokens and strips hardcoded utility classes.

## 3. Execution Directives for Agents
All agents (Tommy, Jerry, Spike) working within or building upon the `zap-design` package are bound by this protocol.

### 3.1 Mandatory Post-Build Verification
After generating a new Metronic component, page layout, or organism, you **MUST** run the enforcer script in Audit mode to verify your own compliance before committing or presenting to the human.

```bash
node scripts/typography-casing-enforcer.js --audit
```

### 3.2 Automated Remediation Loop
If an audit reveals non-compliance or if you are tasked with cleaning up legacy technical debt, you **MUST** run the script in Remediation mode.

```bash
node scripts/typography-casing-enforcer.js --fix
```
You will then execute a mandatory follow-up `--audit` to prove 100% adherence and present the resulting table in the BLAST output.

### 3.3 Safe Exclusions
The enforcer script is hardcoded to safely ignore structural root files:
- `layout.tsx`
- `ThemeContext.tsx`
- `globals.css`
Do **not** attempt to force compliance on these root files manually. The script handles exclusions safely.

## 4. Integration with CI/CD (Future State)
This script is designated for integration into the pre-commit Huskey hooks and the Github Actions build pipeline to act as a permanent gatekeeper against hardcoded typography styling.
