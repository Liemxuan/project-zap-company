# SOP-025-AGENT-CORE-CONFIGURATION

**Status:** ACTIVE  |  **Project:** ZAP-OS / OLYMPUS  |  **Protocol:** AGENT DEPLOYMENT & GOVERNANCE

---

## 1. Context & Purpose
This SOP governs the mandatory core Markdown files required for initializing any autonomous agent or swarm operative within the Olympus ecosystem. It ensures all agents operate with universal context, persona boundaries, and directives per industry specifics, preventing context drift across the fleet.

## 2. Core Operational Documents
Every operative environment MUST establish the following configuration files as foundational defaults:

- **`AGENTS.md`**: Master configuration for the environment. Outlines the overall boot sequence, establishing core rules, distinct operational roles (e.g., security, engineering, architecture), and strict memory management principles.
- **`SOUL.md`**: Persona definition for the active agent. Defines the absolute core truths, operational directives (e.g., "Business First, No BS"), communication style, and overall perimeter vibe.
- **`IDENTITY.md`**: Explicit identification parameters explicitly stating the Name, Role, Creature Type, and Avatar for the assigned AI operative.
- **`USER.md`**: Detailed mapping of the human operator, dictating strict interaction protocols, preferred nomenclature, and relevant context history.
- **`TOOLS.md`**: Environment-specific operations and execution settings, governing SSH host configurations, access boundaries, and preferred tool or TTS interfaces.
- **`HEARTBEAT.md`**: Governs periodic system checks and diagnostic crons. Provides the mandatory scaffold for automated network, security, and perimeter monitoring.

## 3. Enforcement Rule
Any AI agent or swarm instance deployed within the Olympus ecosystem or interacting with the ZAP-OS infrastructure MUST verify the existence and compliance of these six core documents before executing autonomous operations. Operating without these boundaries is an immediate security violation.
