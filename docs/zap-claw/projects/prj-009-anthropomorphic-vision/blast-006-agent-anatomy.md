# B.L.A.S.T. Discovery Questionnaire (prj-009-anthropomorphic-vision)

**Identity:** System Pilot
**Phase:** 1 (Discovery & Parameters)
**Objective:** Establish the foundation for the Agent's "Soul" (Ethical Bounds, Skills Manifest, Persona Guide, Self-Healing Brain) across 4 target industries.

## 1. Blueprint (The Goal)

**Goal:** We are spawning an asynchronous research team (via Open Agent Manager) to consult, debate, and generate a strategic report analyzing the application of our AI agent's "Soul" (Persona, Skills, Ethics, Self-Healing).
**Focus Industries (5):**

1. Food & Beverage (F&B)
2. Spa, Nails & Beauty
3. Hotels & Airbnb
4. Retail (Online & Offline)
5. Professional Services

**Target Regions & Rollout Sequence:**

1. **United States (US):** Primary launch market. Sets baseline English persona and US legal/compliance boundaries (e.g., HIPAA equivalents).
2. **Vietnam (VN):** Secondary market. Requires heavy localization in Persona (tone, formality), Skills (Zalo/local payment integrations), and Ethics (local data laws).
3. **Germany (DE):** Tertiary market. Requires extreme QA on Ethics (strict GDPR compliance) and Persona (German professional standards).

**Output:** A consolidated research report (`RESEarch_REPORT.md`) that debates the operational risks, necessary skill mappings, and ethical boundaries across these five industries, resulting in a finalized roadmap of which industry to attack first. The resulting "Soul" documents MUST be explicitly scoped to a specific region (starting with the US).

## 2. Link (The Context)

**Dependencies:**

- OpenAgent Manager to spawn the sub-agents and run the debate.
- Main window (us) will perform QC (Quality Control) while the team researches.

## 3. Architect (The Strategy)

1. Human defines the 5 industries `[DONE]`.
2. System Pilot drafts the research prompt payload to feed to the OpenAgent team `[READY]`.
3. OpenAgent team generates `RESEarch_REPORT.md` (debating the industries).
4. System Pilot & Human review/QC the findings and select the primary target.
5. System Pilot generates `ethical-bounds.md`, `skills-manifest.md`, `persona-guide.md`, and `self-healing-brain.md` based on the targeted industry.

---

## 🚀 COPY THIS PROMPT INTO THE OPEN AGENT MANAGER

```markdown
**CONTEXT**
We are the architecture team for "Zap-Claw" an enterprise AI agent. We need to formalize the agent's "Soul" across 4 core documents: `ETHICAL_BOUNDS` (safety/rules), `SKILLS_MANIFEST` (tool usage), `PERSONA_GUIDE` (tone/behavior), and `SELF_HEALING_BRAIN` (error recovery).

**YOUR MISSION**
Form a multi-agent debate team consisting of:
1. A Risk & Compliance Officer (focusing on Ethics/Boundaries)
2. A Solution Architect (focusing on Skills/Self-Healing)
3. A Brand Manager (focusing on Persona/Tone)

Debate how our agent should operate within **five specific industries**:
1. Food & Beverage
2. Spa, Nails & Beauty
3. Hotels & Airbnb
4. Retail (Online & Offline)
5. Professional Services

**REQUIRED OUTPUT: A Strategic Report**
1. **Industry Analysis:** For each of the index industries, what are the primary friction points regarding Ethics, Skills, Persona, and Error Recovery?
2. **Debate & Conclusion:** Debate which of the 5 industries is the most strategic starting point (lowest risk of hallucination damage, highest ROI for tool usage, most contained persona constraints).
3. **Roadmap Recommendation:** Give a final, definitive recommendation on which single industry we should map our initial `ETHICAL_BOUNDS`, `SKILLS_MANIFEST`, `PERSONA_GUIDE`, and `SELF_HEALING_BRAIN` documents to first.
```

## 4. Stylize (The Format)

- Output format: Markdown documents in `docs/projects/prj-009-anthropomorphic-vision/`.
