# SOP-017: Agent & Human Core System Directives

**Olympus ID:** OLY-117
**Status:** ACTIVE
**Author:** Antigravity / Jerry
**Date:** March 2026

## 1. Objective

To establish absolute baseline protocols for all developers, operators, and AI Agents (Antigravity, Tommy, Jerry) interacting with the ZAP Olympus codebase. These protocols replace legacy checklist-style guidelines with uncompromising, test-first, hypothesis-driven mechanics.

## 2. Core Directive 1: Systematic Debugging

*(See `olympus/.agent/skills/systematic-debugging/SKILL.md` for the technical implementation).*

When encountering any bug, test failure, or unexpected behavior in the system, all Humans and Agents **MUST** adhere to the following sequence:

1. **No Solutions Without Root Cause Investigation:** Symptom-level patching is strictly prohibited. You must read stack traces in their entirety before proposing a fix.
2. **Hypothesis Formulation:** State what you believe is failing and why. Test ONE variable at a time.
3. **The 3-Strike Rule (Architecture Checks):**
    * If you attempt 3 separate hypotheses/fixes and all fail: **STOP IMMEDIATELY**.
    * Do not attempt a 4th fix.
    * This indicates the component is structurally compromised. Alert Zeus or the Lead Developer that a foundational rewrite/refactor is required.

## 3. Core Directive 2: Test-Driven Development (TDD)

*(See `olympus/.agent/skills/test-driven-development/SKILL.md` for the technical implementation).*

When implementing any feature, bugfix, or algorithm, all Humans and Agents **MUST** strictly follow the Red-Green-Refactor loop.

1. **The Iron Law:** No production code exists without a failing test first. Zero exceptions.
2. **Phase 1 (RED):** Write one minimal test demonstrating the expected behavior and watch it fail. If the test passes immediately, you are testing existing behavior and must start over.
3. **Phase 2 (GREEN):** Write the simplest, absolute minimum code required to make the test pass. Do not add future-proofing or "extra features".
4. **Phase 3 (REFACTOR):** Only once the tests are green, refactor the code for deduplication, readability, and performance.

## 4. Enforcement

These rules are non-negotiable.
* Agents evaluating code via tools like `@SOP-017` are instructed to **reject** PRs and code modifications that violate these directives.
* If a catastrophic bug hits production, Step 1 is always writing the failing test that reproduces it. No ad-hoc production patches are allowed without the corresponding failing test.
