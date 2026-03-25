# SOP-002: Sub-Agent Knowledge Ingestion Protocol

**Goal:** Safely audit, summarize, and integrate external third-party repositories into the overarching Knowledge Base using standardized Zap-OS tagging.

## Step 1: Sub-Agent Spawning
Whenever a new external repository is cloned for review:
1. Do not process it within the main agent context.
2. Spawn a Sub-Agent (via a terminal script or the `browser_subagent`) to handle the target repository safely.

## Step 2: Security & Prompt Injection Audit
The Sub-Agent MUST perform a security sweep before any logic is adopted:
1. Identify and verify all bash scripts (`.sh`). Ensure they do not contain recursive, destructive, or runaway logic.
2. Read all prompt definition files (`.md`, `.txt`, `.prompt`).
3. Audit for **Prompt Injection** vulnerabilities (e.g., hidden variables, unescaped user-input contexts).

## Step 3: architecture Synthesis
The Sub-Agent analyzes the repo logic to identify self-healing, looping, or architectural patterns.
1. Summarize its core purpose.
2. Outline the execution flow and any specific autonomous capabilities.

## Step 4: B.L.A.S.T. & Zap-OS Tagging
Classify the external repository using the internal hierarchy:
1. **Level:** [Atom / Molecule / Organism / Region / Template / Context / Universe]
2. **Phase Applicability:** [Blueprint / Link / Architect / Stylize / Trigger]

## Step 5: Knowledge Base Ingestion
1. Format the synthesis into a structured Knowledge Base entry format.
2. Append the generated entry into the official memory system or document repository (e.g., QMD vector index or local `docs/knowledgebase/` markdown file).
3. Confirm ingestion and terminate the Sub-Agent.
