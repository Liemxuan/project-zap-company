# 🧠 Olympus Skills Directory & Global Registry

This directory contains all canonical behaviors, rules, and SOPs for ZAP-OS agents and staff.
The naming convention follows a strict `[CATEGORY]-[SKILL_NAME]` format to prevent fragmentation.

## 📖 SOP: How to Use Skills (For Humans & Agents)

**For Humans (Engineers & Staff):**
When programming or reviewing code, use the **Shortcut** in your prompt or IDE (like Cursor or Claude) to instantly command the AI to follow that exact protocol.
*Example:* *"Hey Claude, build a new dashboard widget using the `/zap-project-structure` and `/ui-ux-pro-max-skill` rules."*

**For Agents (Antigravity, Tommy, Jerry):**
When you receive a user prompt containing a `/[shortcut]` or when you encounter a task matching a skill's description, you **MUST** automatically read the `SKILL.md` file located inside that designated folder before writing a single line of code.

---

## AGENT

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `agent-session-checkpoint` | **`/agent-session-checkpoint`** | Generates a serialized B.L.A.S.T. State Summary, saves it to the Olympus MongoDB cluster via CLI, and returns a BLAST-SPLIT ID. Use when the user requests a 'State Summary', 'Checkpoint', or 'Save Session'. |
| `agent-skill-creator` | **`/agent-skill-creator`** | Guide for creating effective skills. This skill should be used when users want to create a new skill (or update an existing skill) that extends Antigravity's capabilities with specialized knowledge, workflows, or tool integrations |
| `agent-skill-evaluator` | **`/agent-skill-evaluator`** | Create new skills, modify and improve existing skills, and measure skill performance. Use when users want to create a skill from scratch, update or optimize an existing skill, run evals to test a skill, benchmark skill performance with variance analysis, or optimize a skill's description for better triggering accuracy. |
| `agent-using-superpowers` | **`/agent-using-superpowers`** | Use when starting any conversation - establishes how to find and use skills, requiring Skill tool invocation before ANY response including clarifying questions |

## BACKEND

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `backend-api-patterns` | **`/backend-api-patterns`** | API design principles and decision-making. REST vs GraphQL vs tRPC selection, response formats, versioning, pagination. |
| `backend-database-design` | **`/backend-database-design`** | Database design principles and decision-making. Schema design, indexing strategy, ORM selection, serverless databases. |
| `backend-nodejs-best-practices` | **`/backend-nodejs-best-practices`** | Node.js development principles and decision-making. Framework selection, async patterns, security, and architecture. Teaches thinking, not copying. |

## DEVOPS

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `devops-clear-cache` | **`/devops-clear-cache`** | Safely clears the local Antigravity application cache to resolve issues like "Failed to send", UI glitches, or performance lags. |
| `devops-olympus-sync` | **`/devops-olympus-sync`** | Automates project backup, GitHub synchronization, and protocol pushing for the ZAP Olympus infrastructure. |
| `devops-server-management` | **`/devops-server-management`** | Server management principles and decision-making. Process management, monitoring strategy, and scaling decisions. Teaches thinking, not commands. |
| `devops-server-reset` | **`/devops-server-reset`** | robustly resets the local development environment. Use this when the localhost server is failing, ports are stuck (EADDRINUSE), or the preview is not loading. It handles killing zombie Node processes, clearing Next.js cache, and verifying ports before restarting. |
| `devops-workspace-ready` | **`/devops-workspace-ready`** | Automated workspace initialization and readiness check. Use when the user says "let's go", "ready to start", "workspace ready", or wants to begin a development session. Automatically checks server status, validates dependencies, performs health checks, starts the dev server if needed, and opens the browser to localhost:3000 - all without requiring user confirmation. |

## FRONTEND

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `frontend-code-review` | **`/frontend-code-review`** | No description provided. |
| `frontend-component-refactor` | **`/frontend-component-refactor`** | Refactor high-complexity React components. Use when complexity is high or lineCount > 300, when the user asks for code splitting, hook extraction, or complexity reduction; avoid for simple/well-structured components or third-party wrappers. |
| `frontend-motion` | **`/frontend-motion`** | | |
| `frontend-react-nextjs-expert` | **`/frontend-react-nextjs-expert`** | React and Next.js performance optimization from Vercel Engineering. Use when building React components, optimizing performance, eliminating waterfalls, reducing bundle size, reviewing code for performance issues, or implementing server/client-side optimizations. |
| `frontend-tailwind-patterns` | **`/frontend-tailwind-patterns`** | Tailwind CSS v4 principles. CSS-first configuration, container queries, modern patterns, design token architecture. |
| `frontend-test-generation` | **`/frontend-test-generation`** | No description provided. |
| `frontend-testing` | **`/frontend-testing`** | No description provided. |
| `frontend-webapp-testing` | **`/frontend-webapp-testing`** | Toolkit for interacting with and testing local web applications using Playwright. Supports verifying frontend functionality, debugging UI behavior, capturing browser screenshots, and viewing browser logs. |
| `ui-ux-pro-max-skill` | **`/ui-ux-pro-max-skill`** | 50+ styles, 97 color palettes, 57 font pairings, accessibility rules. Single source of truth for all UI/UX design intelligence in Olympus. |

## MCP

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `agent-notebooklm-cli` | **`/agent-notebooklm-cli`** | Standard protocol for utilizing the `notebooklm-py` CLI for backend research queries and source injects instead of the MCP protocol. |
| `agent-playwright-cli` | **`/agent-playwright-cli`** | Standard protocol for using playwright-cli for token-efficient, skill-based browser automation instead of Playwright MCP. |
| `mcp-server-builder` | **`/mcp-server-builder`** | Guide for creating high-quality MCP (Model Context Protocol) servers that enable LLMs to interact with external services through well-designed tools. Use when building MCP servers to integrate external APIs or services, whether in Python (FastMCP) or Node/TypeScript (MCP SDK). |
| `mcp-stitch-main` | **`/mcp-stitch-main`** | No description provided. |
| `mcp-stitch-snippet-import` | **`/mcp-stitch-snippet-import`** | Standard procedure for importing parts (snippets) of Stitch MCP screens (e.g., Body, Inspector) into the ZAP ecosystem (Olympus). |

## SYSTEMATIC

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `systematic-debugging` | **`/systematic-debugging`** | 4-phase systematic debugging methodology with root cause analysis and evidence-based verification. Use when debugging complex issues. |

## TEST

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `test-driven-development` | **`/test-driven-development`** | Use when implementing any feature or bugfix, before writing implementation code |

## WORKFLOW

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `workflow-brand-guidelines` | **`/workflow-brand-guidelines`** | Applies Anthropic's official brand colors and typography to any sort of artifact that may benefit from having Anthropic's look-and-feel. Use it when brand colors or style guidelines, visual formatting, or company design standards apply. |
| `workflow-clean-code` | **`/workflow-clean-code`** | Pragmatic coding standards - concise, direct, no over-engineering, no unnecessary comments |
| `workflow-code-review-checklist` | **`/workflow-code-review-checklist`** | Code review guidelines covering code quality, security, and best practices. |
| `workflow-doc-templates` | **`/workflow-doc-templates`** | Documentation templates and structure guidelines. README, API docs, code comments, and AI-friendly documentation. |
| `workflow-release-artifacts` | **`/workflow-release-artifacts`** | TODO: Complete and informative explanation of what the skill does and when to use it. Include WHEN to use this skill - specific scenarios, file types, or tasks that trigger it. |
| `workflow-release-notes` | **`/workflow-release-notes`** | Toolkit for generating release notes from GitHub milestone PRs or commit ranges. Use when asked to create release notes, summarize milestone PRs, generate changelog, or prepare release documentation. |
| `workflow-sop-generation` | **`/workflow-sop-generation`** | Formal SOP generation guidelines defining required document structure, sequential numbering rules, and header metadata required for all Olympus documentation. |
| `workflow-systematic-debugging` | **`/workflow-systematic-debugging`** | 4-phase systematic debugging methodology with root cause analysis and evidence-based verification. Use when debugging complex issues. |

## ZAP

| Skill Folder | Shortcut Command | Description |
| :--- | :--- | :--- |
| `zap-dev-wrapper` | **`/zap-dev-wrapper`** | Standard operating procedure for applying the generic Wrapper component to isolate and identify UI snippets for AI extraction. |
| `zap-inspector-development` | **`/zap-inspector-development`** | Guide for building and refactoring ZAP Inspector components (Admin/Merchant controls). |
| `zap-inspector-icons` | **`/zap-inspector-icons`** | Standardized procedure for adding visual icons to Inspector Accordions in the ZAP Design Engine. |
| `zap-integration` | **`/zap-integration`** | Automates the application of ZAP Design System standards (Identity Pills, Dev Wrappers) to React components. |
| `zap-project-structure` | **`/zap-project-structure`** | Canonical folder structure, testing policies, and organization rules for the ZAP Design Engine and broader Olympus project. Mandatory reading for understanding where files belong. |
| `zap-protocol` | **`/zap-protocol`** | The rigorous standard for deep component tracking and "All-The-Way-Down" element tagging in the ZAP Design Engine. |
| `zap-sandbox-bypass` | **`/zap-sandbox-bypass`** | ZAP Sandbox Integrity Bypass (EPERM fix) |
| `zap-testing` | **`/zap-testing`** | Generate Jest + React Testing Library tests for ZAP Design Engine components. Use when testing Next.js 15 + React 19 components, hooks, or utilities in the ZAP project. |
