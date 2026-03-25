# B.L.A.S.T. Discovery (prj-012-openclaw-integration)

**Identity:** System Pilot
**Phase:** 1 (Discovery & Blueprinting)
**Objective:** Integrate advanced agent behavioral protocols (Bootstrapping, Social Intelligence, Heartbeat/Cron architecture) from OpenClaw into the core Zap-Claw agent templates.

## 1. Blueprint (The Goal)

**Goal:** We are overhauling the standard `.agent/` architecture to reflect a more dynamic, socially intelligent, and self-managing AI agent.

**Core Upgrades:**

1. **Interactive Bootstrapping:** Pivot `bootstrap.md` from a static instructional file into an interactive "birth certificate." The agent must converse with the user to build `identity.md` and `user.md` on Day Zero, then auto-delete the bootstrap file.
2. **Personality & Continuity (Soul/Identity):** Introduce new core files:
    * `soul.md`: Replaces static ethical bounds with dynamic behavioral truths ("Be genuinely helpful. Have opinions.")
    * `identity.md`: Tracks the agent's chosen Name, Creature, Vibe, and Emoji.
    * `user.md`: Stores the human's context (name, pronouns, timezone).
3. **Social Intelligence (Group Chats):** Add explicit rules for when the agent should speak vs. stay silent in shared spaces (Slack/Discord/Zalo). Introduce Emoji constraints as lightweight social signals ("Avoid the triple-tap").
4. **Heartbeat vs. Cron Separation:** Restructure background logic.
    * *Heartbeats:* Fuzzy, conversational context loops (email, calendar checks).
    * *Crons:* Exact, isolated, low-level scripts (DB syncs).
5. **Voice Storytelling:** Mandate TTS capabilities (`sag` or equivalent) for high-engagement tasks rather than outputting text walls.

## 2. Link (The Context)

**Dependencies:**

* `src/scripts/templates/agent/agents.md` (Needs Core Logic update)
* `src/scripts/templates/agent/bootstrap.md` (Needs complete rewrite)
* `src/scripts/templates/agent/soul.md` (New file)
* `src/scripts/templates/agent/identity.md` (New file)
* `src/scripts/templates/agent/user.md` (New file)
* `src/scripts/templates/agent/heartbeat.md` (Needs separation from Cron logic)

## 3. Architect (The Strategy)

1. **[PENDING]** Rewrite `bootstrap.md` to act as an aggressive conversational prompt rather than passive docs.
2. **[PENDING]** Create templates for `soul.md`, `identity.md`, and `user.md`.
3. **[PENDING]** Splice the "Social Intelligence" and "External vs Internal" constraints into `agents.md`.
4. **[PENDING]** Formalize the "Heartbeats vs. Cron" protocol inside `agents.md` and define the JSON state tracking logic (`memory/heartbeat-state.json`).
5. **[PENDING]** Ensure the Zapclaw Init script correctly provisions these updated file versions for new merchants.

## 4. Stylize (The Format)

* Updates applied directly to the `src/scripts/templates/agent/` markdown architecture.

## 5. Trigger (The Action)

**Awaiting Human Approval:** Review this B.L.A.S.T blueprint. If the constraints and goals align with the OpenClaw standard, we will execute the overwrites globally.
