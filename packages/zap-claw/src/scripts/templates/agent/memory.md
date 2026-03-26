# 🧠 MEMORY: Learned Project Facts

**Target System:** {{SYSTEM_TYPE}}

## 1. Core Operating Context

- This file acts as the explicit, long-term memory store for the {{VERTICAL}} agent.
- Facts gathered during conversations, environment scans, or system debugging must be appended here if they possess long-term strategic value.

## 2. Core Operational Rules

- **ONLY load in main session** (direct chats with your human)
- **DO NOT load in shared contexts** (Discord, group chats) for security.
- You can **read, edit, and update** memory.md freely in main sessions.
- Capture what matters: decisions,
- **Swarm Command:** The single source of truth for all agents (Antigravity, Tommy, Jerry) is [swarm-command.md](file:///Users/zap/Workspace/zap-claw/docs/swarm-command.md).
- **Shadow Memory Bridge:** Sessions with Antigravity (CSO) are synced to `docs/decisions.md`. Check this file first for architectural overrides.
- **Write it down:** If you want to remember something, write it to a file (`memory/YYYY-MM-DD.md` or this file). "Mental notes" don't survive restarts.

## 3. Memory Maintenance

Periodically (every few days), use a heartbeat to:

1. Read through recent `memory/YYYY-MM-DD.md` files
2. Identify significant events, lessons, or insights worth keeping long-term
3. Update this file (`memory.md`) with distilled learnings
4. Remove outdated info that's no longer relevant

---
*Example: The database connection string format for this environment uses `?authSource=admin`.*

## 4. Current Progress

- **Autonomic Agent Self-Healing (Phase 27)**: Successfully implemented and verified error ingestion, RCA, circuit breakers, and self-patching mechanisms.
- **Model Routing & HUD**: Established strict priority (Gemini Ultra > Gemini Pro > OpenRouter > Local) and added TPM tracking to the Zeus profile HUD.
- **MCP Integrations**: Debugged and configured Figma and Notion MCP servers.

## 5. Current Constraints & Rules

- **Anti-Gravity Protocol**: Strict adherence to "Direct and Operational" outputs. Prioritize Intent, Plan, and Code Blocks; eliminate conversational filler and boilerplate.
- **Context Maintenance**: Use Delta updates only. Rely on references instead of repasting files. Use 'State Summary' resets for long sessions.
- **MCP Limitations**: A strict ceiling of 100 maximum enabled tools applies to MCP configurations (encountered with Notion MCP).
- **GKE Operations**: Prefer native MCP tools over shelling out to `gcloud`/`kubectl` unless necessary. Clarify ambiguity in configurations proactively.

## Project: Building Olympus

### Environment & Context

- **Machine:** Mac Mini
- **Company:** Zap
- **Role:** Software Developer

### Tech Stack

- **Languages:** C#, JavaScript, HTML, CSS,TYPEscript,Tailwind
- **Frameworks:** Blazor (Web), Flutter (Mobile)
- **Database:** MongoDB,SQLite,Postgres
- **Tools:** Visual Studio, Figma,Google Antigravity,Google Stich,

### Organizational Alignment (Olympus System Build)

#### 1. The Human Vanguard (Core Developers)

- **Nguyen:** Frontend Visual Engineer (Next.js, HTML/CSS, UI/UX implementation)
- **Liem:** Frontend Integration Engineer (Next.js data fetching, API to UI wiring)
- **Vuong:** Lead Backend Engineer (.NET 9, APIs, Auth/Security interim)
- **Linh:** Database & Integration Engineer (DB structure, API/MCP tool support)
- **An:** Backend & DevOps Engineer (Building VN/EU local servers, Kubernetes/K8s, firewalls for data sovereignty mandates)

#### 2. The Human Vanguard (Product & Ops)

- **Kien:** Lead Designer & Growth (Figma UX/UI, Ads)
- **Vinh:** 3D/Video & Aesthetics (Spline/Sketchup, dynamic UI experience)
- **Tuan:** Lead QA/Tester (Test plans, deployment validation)
- **Phong:** Product & Customer Ops (Market research, accepts deployments, manages Tuan)
- **Nguyet:** Legal & Finance (CPA, compliance, coordination)

#### 3. The Command Staff (Leadership & Core Swarm)

- **Zeus (Tom):** Chief Operations & Product (Applies new methods and tests with Claw before rollout; defines scope and business logic)
- **Claw (Antigravity):** Chief Security Officer & Infrastructure Architect (Writes the foundational code, enforces security, wires the databases, acts as Zeus' right hand)
- **Jerry:** Chief of Staff & Swarm Commander (Managing and building Olympus with human help and the Claude Team; has full power to manage them within our guidance rails)
- **Spike:** Lead Internal Analyst [Formerly Tommy] (Analyzes legacy code, drafts internal API contracts, temporary Auth/Security support)

#### 4. The External AI & Consultants

- **Claude Team (Swarm):** External AI Coding Team (Logged in via <tom@two.vn> OAuth. Managed by Jerry to write and test code using their specialized models)
- **OpenClaw Tommy:** Lead Consultant & Architectural Advisor (Distills learnings from the OpenClaw project and feeds insights back to Zeus and Claw on how to build Olympus better, faster, and more securely)

### Current Goals

- Streamlining development workflow using Google Antigravity.
- Automating API connections to C# services.
- Finalizing database choice (MongoDB Atlas vs Postgres vs SQLite)  
- Finalizing Next.js deployment strategy with Vercel vs Google Cloud Run
