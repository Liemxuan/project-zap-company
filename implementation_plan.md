# Implementation Plan
**Olympus ID:** OLY-AUTH-PHASE11-X7V9
**Phase:** 11 (M3 Token & Architecture Hardening)

## Objective
Purge all hardcoded/hallucinated CSS overrides across the workspace (specifically targeting POS, Kiosk, and Portal apps) and enforce strict adherence to the L1-L4 design tokens hosted in `zap-design`.

## The Ralph Loop Execution
1. **Reason:** The Swarm used inline styles and rogue Tailwind classes instead of the centralized Metronic M3 token system.
2. **Act (B.L.A.S.T.):**
   - **Audit:** Scan `packages/zap-design/src/components` (specifically `UserManagementTable`, `SystemLogsTable`, and buttons).
   - **Purge:** Remove all inline CSS (e.g., `style={{ fontSize: ... }}`).
   - **Replace:** Apply standard L1-L4 Tailwind classes.
   - **Test:** Ensure visual consistency matches port 3000 baseline without breaking component functionality.
3. **Learn:** Update `STATE_SUMMARY.md` with the purged files and token mapping.
4. **Plan:** Mark Phase 11 complete.
