---
name: workflow-sop-generation
description: Formal SOP generation guidelines defining required document structure, sequential numbering rules, and header metadata required for all Olympus documentation.
---

# SOP Generation Standard

## Context

Use this skill whenever you are instructed to create, register, document, or append a new Standard Operating Procedure (SOP) for the Olympus/Zap-Claw project ecosystems.

## Directory

All sops must be written to the `docs/sops/` directory within the `olympus` workspace (or equivalent docs root if not in `olympus`).

## Naming Convention

Files must strictly follow this pattern: `sop-[xxx]-[topic-name].md`

- `[xxx]`: A sequential 3-digit number (e.g., 001, 002, 004).
- `[topic-name]`: A lowercase, hyphen-separated title (e.g., `navigation-architecture`).

**Crucial Check:** Before generating an SOP, you *must* list the contents of `docs/sops/` to determine the next highest available number. Never overwrite an existing SOP number by guessing.

## Required Metadata Header

Every SOP file must begin with this exact metadata block format:

```markdown
# SOP-[XXX]-[TOPIC_NAME]

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** [RELEVANT_PROTOCOL, e.g., B.L.A.S.T.]

---

## 1. Context & Purpose
[Brief summary of why this SOP exists and what it governs.]

## 2. ...
```

## Tone

Direct, authoritative, and structured. No fluff. Write it like you are the security engineer laying down the law. Use imperative commands ("Must do X", "Never do Y").

## Registry Update (MANDATORY)

After you have saved the new SOP or modified an existing document, you **MUST** automatically update the global documentation registry so that AI agents and humans can find it.

Do not ask for permission. Run this python script in the background:

```bash
python3 /Users/zap/Workspace/olympus/docs/update-docs-registry.py
```
