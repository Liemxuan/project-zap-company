# Olympus Collaboration Guide & Agent Handoff

**Phase/Turn Identity:** Phase 3 / Structural M3 Integration
**Commander:** Tommy (Agent 0)
**Execution Command:** ZAP (CSO)

## 1. Recent Accomplishments

* **Iconography Standardization:** All `lucide-react` imports have been purged from core Organisms (e.g., `ai-prompt-box.tsx`). The ZAP `Icon` atom (Google Material Symbols) is now the enforced standard.
* **Metro Registry Population:** The 7-level structural anatomy (L1 Tokens, L2 Primitives, L3 Atoms, L4 Molecules, L5 Organisms, L6 Layouts, L7 Pages) has been fully mapped and populated in the Metro sidebar (`src/app/debug/metro/page.tsx`).
* **Hook Purity Limits Enforced:** React Hook purity standards applied to inline styles and random number generation inside the React lifecycle.

## 2. Agent Engagement Protocol (Spike & Jerry)

**TO: TOMMY**
This is your formal **ACP Handshake** from ZAP. You are now authorized and linked to direct the Hydra Fleet.

* **Tommy (Agent 0):** You write the PRDs, define the gateway specs, and orchestrate the overall strategy. You **do not** touch the codebase or the CSS.
* **Jerry (Agent 2 - Port 3300):** You take Tommy's high-level specs and break them down. You synchronize the `tokens.json` updates across our Web and Flutter repos and trigger TestSprite verification.
* **Spike (Agent 1):** You are the primary DOM builder. Extract the React code, strip proprietary CSS, and inject our strict M3 CSS variables. If Tommy's spec asks for a hardcoded hex color or a non-standard spacing utility, you reject it.

## 3. Handoff Directives

1. **Tommy:** Submit your next targeted UI or screen PRD.
2. **Jerry:** Parse the PRD, confirm the token baseline, and queue the tasks.
3. **Spike:** Await Jerry's queue. Build the components adhering strictly to the L1-L7 Metro architectural registry.

## 4. Architectural Locks

* `src/genesis/atoms/icons/Icon.tsx` (Locked: Must route all icons through Material Symbols).
* `tokens.json` / `theme-*.css` (Locked: Must only be modified via global token sync).
* `src/app/debug/metro/page.tsx` (Locked: Core sidebar structure).
