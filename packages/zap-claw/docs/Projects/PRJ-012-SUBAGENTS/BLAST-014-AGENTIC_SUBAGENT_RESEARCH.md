# BLAST-014: Subagent & Skill Ecosystem Integration Strategy

**Olympus ID:** OLY-112
**Status:** DRAFT (Cleared SOP-012 Foreign Code Scan)
**Author:** Antigravity / Jerry
**Date:** March 2026

## 1. Executive Summary

Per Zeus's directive, Team Claw has executed **SOP-012 (Zero-Trust Foreign Code Scanning)** to quarantine and analyze six distinct GitHub repositories related to Claude Code, AI Plugins, and UI tooling.

**Security Status:** ✅ **CLEARED**. Static analysis of the quarantine zone (`/tmp/zap-quarantine/`) revealed zero prompt injections, malicious `postinstall` dependencies, or obfuscated payloads across the 6 targets.

This BLAST document outlines the purpose of each tool and strategically maps how we will integrate them into the **Olympus/ZAP** infrastructure to supercharge our workflows.

---

## 2. Capability Analysis

### 2.1 OpenPencil (`open-pencil`)

**What it is:** An open-source, AI-native, 100% local Figma alternative. Crucially, it ships with an **MCP Server** that provides read/write access to `.fig` files.
**Business Purpose (ZAP Design Engine):**
This is the holy grail for our front-end pipeline. Currently, we use Stitch MCP to ingest raw HTML prototypes manually. With OpenPencil, we can connect our AI directly to `.fig` design files. We can programmatically read Figma nodes, colors, and layouts, and instantly translate them into the ZAP 4-Layer Theme Architecture (CORE, NEO, METRO).
*Verdict: High Priority. Adopt immediately to replace Stitch MCP for UI engineering.*

### 2.2 Superpowers (`obra/superpowers`)

**What it is:** A comprehensive toolkit of "skills" and subagent workflows designed to enforce TDD, Git Worktree isolation, and systematic debugging (e.g., the `subagent-driven-development` and `test-driven-development` skills).
**Business Purpose (ZAP-Claw):**
This protocol perfectly mirrors what we are trying to achieve with **Test-Time Recursive Thinking (TRT)**. Instead of inventing our own prompt structures for root-cause analysis and TDD loops, we will fork their logic and adapt it into ZAP's `.agent/skills/`. It explicitly forces the AI to execute Red-Green-Refactor before proposing code.
*Verdict: High Priority. Fork the `systematic-debugging` and `test-driven-development` skills into our own registry.*

### 2.3 Awesome Claude Code Subagents (`VoltAgent`)

**What it is:** A sprawling directory of 127+ highly specialized subagent prompts categorized by domain (e.g., `nextjs-developer`, `graphql-architect`, `qa-expert`).
**Business Purpose (Swarm Delegation):**
When Jerry (Chief of Staff) needs to delegate a task, he currently relies on generic prompts. By cherry-picking the absolute best domain prompts from this repo (like their `nextjs-developer` and `ui-designer`), we can create highly specialized "Minion" agents in ZAP-Claw.
*Verdict: Medium Priority. Extract the top 5 relevant subagent prompts and store them as templates in our `.agent/skills/` directory.*

### 2.4 Skill Prompt Generator (`skill-prompt-generator` v2.0)

**What it is:** A complex cross-domain prompt generator powered by an SQLite element database, originally purposed for generating AI image prompts (Midjourney/DALL-E) based on universal design patterns.
**Business Purpose (Generative Assets):**
While initially designed for photography/art, v2.0 includes a **Design Mode** with 37 color schemes and layouts. We can hook this into our Design Engine to dynamically generate abstract Neo-Brutalist cover art, onboarding placeholders, or UI variants without leaving the IDE.
*Verdict: Low Priority (For Code), High Priority (For Asset Gen). Keep in quarantine until we need a dedicated image-generation loop.*

### 2.5 Official Anthropic Plugins & Skills

**What it is:** The official `claude-plugins-official` (highlighting the `code-simplifier`) and the `skills` repository (demonstrating how Anthropic structures their MCP and Skill YAMLs).
**Business Purpose (Architecture Standards):**
The `code-simplifier` provides an excellent prompt for reducing code complexity without altering functionality. The `skills` repo serves as the gold standard for how our own `SKILL.md` files should be formatted.
*Verdict: Ongoing Reference. We will use their YAML frontmatter syntax as the authoritative standard for all ZAP Skills moving forward.*

---

## 3. Implementation Roadmap

If approved, Team Claw will execute the following pipeline:

1. **Phase 1: OpenPencil MCP Integration**
   - Boot OpenPencil's MCP server.
   - Refactor the ZAP Design Engine "Wash Protocol" to target `.fig` files instead of Stitch `.html` outputs.

2. **Phase 2: Superpower Subagent Adoption**
   - Import the `test-driven-development` and `systematic-debugging` frameworks from `obra/superpowers` into the `zap-claw/.agent/skills/` directory.

3. **Phase 3: Domain Specialists**
   - Create specialized `SKILL.md` files for Next.js, TailWind v4, and Prisma by referencing the `awesome-claude-code-subagents` library.
