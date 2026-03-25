# archITECTURE STANDARD: The ZAP-OS Plan

**Mandatory Reading for Antigravity, Claude, and all Zap-Claw Team Members.**

This SOP outlines the absolute standard for project structure, L0-L6 atomic hierarchy, and domain isolation. No deviations are allowed.

## 1. Domain Isolation Strategy

When building the Olympus ERP platform, our logic and components must never cross-pollinate inappropriately.

- **`src/domains/`**: This is the heart of specialized business logic. We currently partition into:
  - `pos/`: Point of Sale, Checkout logic, Merchant devices.
  - `finance/`: Ledgers, Transactions, Auditing.
  - `employees/`: Staff management, Shifts, Permissions.

**Rule**: Any cross-domain communication MUST happen through formal, tested interfaces, not by importing UI elements across boundaries. If a button belongs to `pos`, `finance` cannot borrow it. If both need it, it's an **L1 Atom** and belongs in `genesis/atoms`.

## 2. Experimental Lab Zone

Any unverified, messy, or external prototype code goes into `src/app/lab/`.

- **`/lab` is isolated.** It is in `.gitignore`, it does not pollute `src/genesis` or `src/zap`.
- To promote code from `lab/` to core, you must completely refactor it to align with the **B.L.A.S.T.** protocol.
- Check `src/app/lab/registry.json` for the status of current prototypes.

## 3. The Debugger Hub

- **`/debug/zap`**: This is our consolidated Mission Control. It hosts all Interactive Spec Sheets, Colors, Icons, and Status mapping definitions.
- We do not build scattered debugger pages anymore (`/neo`, `/metro`, `/debug/tools`). Everything related to component or physics visualization lives under `/debug/zap`.

## 4. The `lib/flags.ts` Off Switch

We use strict environmental toggles for feature management:

- `NEXT_PUBLIC_ENABLE_LAB`
- `NEXT_PUBLIC_ENABLE_DEBUG_TOOLS`
These ensure our main bundle size remains hyper-optimized and isolated experiments do not crash production.

---
**Enforcement:**
As an agent working on this codebase, if you see components drifting out of `genesis/atoms` into domain zones without cause, or legacy `Metro` code lingering, you must flag it and purge it. Follow the 7-Level Atomic architecture with absolute discipline.
