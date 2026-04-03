import fs from "fs/promises";
import path from "path";
import { parseArgs } from "util";

const ROOT_AGENT_DIR = path.resolve(process.cwd(), ".agent");
const MODELS_REGISTRY_PATH = path.join(ROOT_AGENT_DIR, "gemini_models_registry.md");

// 1. Strictly locking the Swarm down to the Top 10 Permitted Professions
const PERMITTED_PROFESSIONS = {
  STRUCTURAL_BUILDER: {
    description: "Core coding, UI/UX implementation, Next.js rendering. High blast radius.",
    primaryModel: "gemini-3.1-pro-preview",
    secondaryModel: "gemini-3-pro-image-preview",
    tags: ["coding", "architecture", "ui-mockups"],
  },
  CHIEF_OF_STAFF: {
    description: "DevOps, Telemetry, System Monitoring, Watchdog.",
    primaryModel: "gemini-3-flash-preview",
    secondaryModel: "gemini-3.1-pro-preview",
    tags: ["telemetry", "log-parsing", "complex-logic"],
  },
  SYSTEM_ARCHITECT: {
    description: "Backend architecture, database modeling, schema design.",
    primaryModel: "gemini-3.1-pro-preview",
    secondaryModel: "gemini-2.5-pro",
    tags: ["coding", "core-reasoning", "long-context"],
  },
  DATA_ANALYST: {
    description: "Python execution, SQL plotting, CSV crunching, stats.",
    primaryModel: "gemini-2.5-pro",
    secondaryModel: "gemini-3-flash-preview",
    tags: ["long-context", "fast"],
  },
  CREATIVE_DIRECTOR: {
    description: "Asset generation, cinematic b-roll, high-fidelity UI art.",
    primaryModel: "gemini-3-pro-image-preview",
    secondaryModel: "veo-3.1-generate-preview",
    tags: ["4k-visuals", "cinematic", "image-generation"],
  },
  SECURITY_OFFICER: {
    description: "SOP enforcement, static code analysis, vulnerability checking.",
    primaryModel: "gemini-3.1-pro-preview",
    secondaryModel: "gemini-3-flash-preview",
    tags: ["core-reasoning", "complex-logic", "fast"],
  },
  E2E_QA_TESTER: {
    description: "Playwright automation, dev-browser driving, DOM validation.",
    primaryModel: "gemini-2.5-computer-use-preview-10-2025",
    secondaryModel: "gemini-3.1-pro-preview",
    tags: ["computer-use", "browser-automation"],
  },
  DEEP_RESEARCHER: {
    description: "Deep RAG gathering, Google Search crawling, citing sources.",
    primaryModel: "deep-research-pro-preview-12-2025",
    secondaryModel: "gemini-2.5-pro",
    tags: ["deep-research", "autonomous", "long-context"],
  },
  MEMORY_ARCHIVIST: {
    description: "Vector database indexing, history summarization.",
    primaryModel: "gemini-embedding-2-preview",
    secondaryModel: "gemini-3-flash-preview",
    tags: ["embeddings", "rag", "fast"],
  },
  BRAND_MARKETER: {
    description: "Social media copy, Podcast scripting, PPT generation.",
    primaryModel: "gemini-3.1-flash-live-preview",
    secondaryModel: "gemini-3-pro-image-preview",
    tags: ["voice", "live-api", "image-generation"],
  }
};

async function syncAgentProfession() {
  const { values, positionals } = parseArgs({ args: process.argv.slice(2), allowPositionals: true });
  const agentName = positionals[0]?.toLowerCase();

  if (!agentName) {
    console.error("❌ E_FATAL: You must provide an agent target. (e.g. `npx tsx sync_agent_profession.ts jerry`)");
    process.exit(1);
  }

  const agentDir = path.join(ROOT_AGENT_DIR, agentName);

  try {
    await fs.access(agentDir);
  } catch (err) {
    console.error(`❌ E_FATAL: Agent directory not found: ${agentDir}`);
    process.exit(1);
  }

  // 2. Read IDENTITY.md
  const identityPath = path.join(agentDir, "IDENTITY.md");
  let identityContent = "";
  try {
    identityContent = await fs.readFile(identityPath, "utf8");
  } catch (err) {
    console.warn(`⚠️ WARNING: No IDENTITY.md found for ${agentName}. Standardizing core template...`);
    identityContent = `# ⚡ IDENTITY: ${agentName.toUpperCase()}\n\n**Target System:** OLYMPUS\n**Role:** CHIEF_OF_STAFF\n`;
    await fs.writeFile(identityPath, identityContent);
  }

  // 3. Extract the locked Profession Role and any Custom Tags
  const roleMatch = identityContent.match(/\*\*Role:\*\*\s*([A-Z0-9_]+)/i) || identityContent.match(/Role:\s*([A-Z0-9_]+)/i);
  const rawRole = roleMatch ? roleMatch[1].toUpperCase() : "CHIEF_OF_STAFF";

  const tagsMatch = identityContent.match(/\*\*Tags:\*\*\s*(.+)/i) || identityContent.match(/Tags:\s*(.+)/i);
  const customTags = tagsMatch ? tagsMatch[1].split(',').map(t => t.trim().replace(/^[`[\]]+|[`[\]]+$/g, '')) : [];

  if (!Object.keys(PERMITTED_PROFESSIONS).includes(rawRole)) {
    console.error(`❌ Security Exception: Role '${rawRole}' is NOT in the Top 10 Permitted Olympus Categories.`);
    console.log("Allowed Roles:", Object.keys(PERMITTED_PROFESSIONS).join(", "));
    process.exit(1);
  }

  const roleData = PERMITTED_PROFESSIONS[rawRole as keyof typeof PERMITTED_PROFESSIONS];
  
  // Merge intrinsic profession tags with custom agent tags
  const combinedPrimaryTags = [...new Set([...roleData.tags, ...customTags])];

  console.log(`✅ [ZAP-OS] Verified Profession: ${rawRole} for agent [${agentName}]`);
  console.log(`🧠 [ZAP-OS] Re-wiring Neural Link to: ${roleData.primaryModel}`);

  // 4. Overwrite models.md directly from the central registry logic
  const modelsPath = path.join(agentDir, "models.md");
  const modelsContent = `# ⚡ SYSTEM ROUTING MATRIX (${agentName.toUpperCase()})

<!-- ⚠️ DYNAMICALLY COMPILED VIA SYNC_AGENT_PROFESSION.TS ⚠️ -->
**Target System:** OLYMPUS
**Strict Profession Lock:** \`${rawRole}\`

## 1. Provider Tier Mapping

| Priority | Provider Tier | Assigned To | Engine Strategy |
| :--- | :--- | :--- | :--- |
| **Primary** | \`ULTRA\` | \`kayvietnam@gmail.com\` | Zero-latency, unthrottled high-priority lanes. |
| **Secondary** | \`PRO\` | \`tom@zap.vn\` | High-limit, stable backup pool. |
| **Tertiary** | \`OPENROUTER\` | \`tom@two.vn\` | Hard fallback. Last resort rate-limit bridging. |

## 2. Intelligence Assignments (Locked)

Based on the [${rawRole}] profession bounds, this agent is restricted to the following runtime limits:

| Objective | Bound Engine | Registry Identifier | Trigger Tags |
| :--- | :--- | :--- | :--- |
| **Deep Thinking / Complex Matrix** | Execution Core | \`${roleData.primaryModel}\` | \`${combinedPrimaryTags.join(', ')}\` |
| **High-Velocity Tasking** | Specialized Secondary | \`${roleData.secondaryModel}\` | \`${roleData.tags[1] || 'fallback, fast-tasking'}\` |
| **Swarm Heartbeat Tracker** | Gemini 4M Context | \`gemini-2.5-pro\` | \`4m-context, log-ingestion\` |
| **Data Visualization** | Nano Banana 2 | \`gemini-3.1-flash-image-preview\` | \`image-generation, ui-mockups\` |
| **Memory Sync Cortex** | Embeddings 2 | \`gemini-embedding-2-preview\` | \`rag, semantic-search\` |

## 3. Omni-Router Enforcements
- **Integrity Bounds:** Operating strictly within \`${roleData.description}\` bounds.
- **BYOK Lockout:** This agent is barred from independent OPENAI_API_KEY overwrites to preserve swarm telemetry.

*Compiled dynamically on ${new Date().toISOString()}*
`;

  await fs.writeFile(modelsPath, modelsContent);
  console.log(`✅ [ZAP-OS] Successfully authored ${modelsPath}`);
}

syncAgentProfession().catch(console.error);
