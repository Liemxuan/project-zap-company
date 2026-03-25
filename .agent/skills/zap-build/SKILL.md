---
description: The Master ZAP Build Macro. A mandatory 8-step pipeline to safely build pages, components, and features strictly adhering to ZAP Design Engine architecture without introducing technical debt. Triggered via /zap-build.
---

# ZAP Strict Build Protocol

This is the mandatory, unskippable procedure for all agents to build anything new within the ZAP ecosystem. 

## 1. THE HARD GATE (Customer & Theme)
**NEVER begin building or generating plans without asking the user these two questions first:**
1. **What is the customer you are building for?**
2. **What theme are you building for?**

Without these two answers, you do not have the components or the aesthetic foundation to build. Stop immediately and ask the user. Once the user answers, use that information to lock in the target visual values and parameters for the current theme before proceeding.

## 2. Foundation Sync (The Guardrails)
- Autonomously read `/Users/zap/Workspace/olympus/learn.md`
- Autonomously read `.agent/skills/zap-foundation-enforcer/SKILL.md`
- Autonomously read `.agent/skills/zap-component-baseline/SKILL.md`
- **Goal:** Internalize M3 Layer Topology (L0-L5) and the absolute ban on hardcoded basic Tailwind colors/font classes.

## 3. Extraction & Intent
- Invoke the `brainstorming` skill.
- Interrogate the user to clarify intent and propose 2-3 architectural approaches utilizing existing `Genesis` atoms based on the Theme selected in Step 1.

## 4. Atomic Mapping (Design Spec)
- Generate a `UI-SPEC.md` mapping all intended UI elements to exact M3 tokens. 
- Generic Tailwind (like `bg-white` or `rounded-xl` on structural covers) is strictly forbidden.

## 5. Execution Plan (The Blueprint)
- Generate `implementation_plan.md`.
- Detail the exact files, APIs, and dynamic CSS property wirings (e.g. `style={{ borderRadius: 'var(--button-radius)' }}`).
- **CRITICAL:** Get the User's explicit approval on the plan before touching any code.

## 6. Strict Implementation
- Write the code strictly adhering to the architectural mandates. Bypass Tailwind parsers for complex dynamic properties by using React `style={{}}`.
- **CRITICAL: The Inspector Tethering Checklist.** Before marking implementation complete, run this checklist against every Genesis atom instance in the new code. Any violation is an immediate fail.

### 6a. Inspector Tethering Checklist (V4 Post-Mortem)

Run this against every `<Button>`, `<Input>`, `<EmailInput>`, `<PasswordInput>`, or other Genesis atom in the new page/component:

| # | Check | Fail If... |
|---|-------|-----------|
| 1 | **Zero explicit visual props** | `visualStyle`, `color`, `size`, `variant` are passed as props on any atom instance |
| 2 | **Zero Tailwind padding/shadow on atoms** | `py-*`, `px-*`, `shadow-*`, `hover:shadow-*` exist in className of Genesis atoms |
| 3 | **Zero manual spacing inside atoms** | `mr-*`, `ml-*`, `gap-*` on children of Genesis atoms |
| 4 | **Zero hardcoded hover states** | `hover:bg-*` on Genesis atom instances |
| 5 | **Specialized atoms used** | Generic `<Input type="email">` used instead of `<EmailInput>`, or `<Input type="password">` instead of `<PasswordInput>` |
| 6 | **Sibling symmetry** | Two sibling instances of the same atom have different className overrides |
| 7 | **Type-safe props** | Any prop value that doesn't exist in the component's TypeScript interface |
| 8 | **No dev artifacts** | Version labels, debug text, or placeholder content in the UI |
| 9 | **Icon consistency** | Specialized input wrappers missing expected `leadingIcon` matching their siblings |
| 10 | **Layer token binding** | Structural containers using hardcoded `rounded-*` instead of `style={{ borderRadius: 'var(--layer-X-border-radius)' }}` |

> **The V4 Golden Rule:** If a Genesis atom accepts it as a prop, the Inspector already controls it. Your job as a page author is to compose atoms, not style them.

## 7. The 4-Point Verification
- Invoke `verification-before-completion`.
- Run the Layer Audit, Typography Audit, Inspector Sync Audit, and perform a VFS State Dump into `shared://`.

## 8. The Learn.md Audit (Continuous Improvement)
- Autonomously review the code that was just built and identify any new architectural pitfalls, CSS workarounds, or engine discoveries that were required to complete the feature.
- Update `/Users/zap/Workspace/olympus/learn.md` with these insights to permanently protect the Swarm from repeating the same mistakes on the next build.

