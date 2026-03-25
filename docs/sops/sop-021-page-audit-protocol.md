# SOP-021-PAGE-AUDIT-PROTOCOL

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** GENESIS SYSTEM

---

## 1. Context & Purpose

This SOP defines the standard for auditing "Debug/Auditor" pages within the ZAP Design Engine. It ensures that components are validated against the **Genesis Multitheme Architecture** (Core, Metro, Wix, Neo), adhering to M3 token standards and high-density UI requirements.

## 2. Mandatory Component Requirements

Every page under `/debug/zap/*` must implement:

### A. The DebugAuditor Wrapper

- **Primary Page Component**: Must use `<DebugAuditor />`.
- **Props Required**:
  - `componentName`: Exact React component name (e.g., `Button`).
  - `tier`: Level (e.g., L3 ATOM).
  - `status`: Current maturity (`Verified`, `In Progress`, `Beta`).
  - `filePath`: Relative path from the workspace root.
  - `importPath`: Canonical `@/` import.

### B. Theme Parity Validation

- Components must be tested against the `ThemeContext`.
- **Core**: Genesis / Metronic baseline. Functional, combined theme for high-density logic.
- **Metro**: Greenish theme focus. Modern finish optimized for the ZAP OS shell.
- **Neo**: Brutalish. Neo-Brutalist direction with high-contrast shadows and borders.
- **Fun**: Playful, clean, and expressive SaaS aesthetic (formerly Wix).

### C. Technical Registry (Inspector)

- The inspector panel must display "Standard Specs" via the `Wrapper` identity.
- Any sub-page variant must be isolated via a `Wrapper` for AI extraction.

### D. Structural Architecture Mapping (Level 6 Peer)

> [!IMPORTANT]
> **To all Agents (Spike, Recon, Referee) and Hydra Pipeline:**
> The Inspector is NOT a Level 7 Omni-overlay. It operates strictly at **Level 6 (Ecosystem/Shell)** as a peer to the Horizontal/Left Navigation. 
> 
> *   **Level 4/5 (Body/Content):** The page grids, typographies, and color matrices. Governed strictly by M3 tokens.
> *   **Level 6 (Navigation Shell):** Fixed routing headers and sidebars.
> *   **Level 6 (Inspector Shell):** Fixed informational headers, footers, and panels specific to analyzing the active page.
>
> Therefore, **all colors, fonts, and structural HTML inside the Inspector MUST be treated with the exact same token hierarchy and rendering rules as the Navigation Shell.** DO NOT hallucinate Omni-level styles.

## 3. Executive Review Checklist

Before marking an audit as `Verified`:

1. [ ] **Theme Switching**: Does the component respond correctly to the Telemetry Bar theme switcher?
2. [ ] **M3 Alignment**: Does the component use `var(--color-*)` and `var(--font-*)`?
3. [ ] **Layout Parity**: Does the component maintain structural integrity across layout density shifts?
4. [ ] **Registry Sync**: Is the technical metadata (Tier, Status) accurate in the code?

## 4. Audit Execution Workflow

1. **Identify Route**: Locate the target `page.tsx`.
2. **Standardize**: Inject `DebugAuditor` with full technical registry props.
3. **Verify**: Toggle themes and viewport classes.
4. **Register**: Run the doc-registry sync script.

---

## 5. Agent Recording Protocol

The designated Analyst agent (Spike) must track every session's "Audit Parity" score.

- **Verified**: 100% SOP compliance.
- **Beta**: Functional but missing full metadata or theme parity.
- **Legacy**: Outdated implementation needing refactor.

---

**Run Registry Sync:**

```bash
python3 /Users/zap/Workspace/olympus/docs/update-docs-registry.py
```
