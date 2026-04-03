import fs from "fs/promises";
import path from "path";
import { execSync } from "child_process";

const ROOT_AGENT_DIR = path.resolve(process.cwd(), ".agent");

// The Master Fleet Matrix Assignment
const FLEET_MATRIX: Record<string, { role: string; tags: string }> = {
  spike: { role: "STRUCTURAL_BUILDER", tags: "react, ui-layout, builder, frontend" },
  jerry: { role: "CHIEF_OF_STAFF", tags: "devops, telemetry, watchdog" },
  gateway: { role: "SYSTEM_ARCHITECT", tags: "api-routing, network-mesh, rate-limiter" },
  athena: { role: "DEEP_RESEARCHER", tags: "osint, r-and-d, deep-search" },
  daemon: { role: "SECURITY_OFFICER", tags: "zss-enforcement, firewall, compliance" },
  hawk: { role: "E2E_QA_TESTER", tags: "playwright, dom-navigation, automated-tests" },
  cleo: { role: "CREATIVE_DIRECTOR", tags: "nano-banana, cinematic, ui-mockups" },
  hermes: { role: "BRAND_MARKETER", tags: "voice, communications, copywriter" },
  tommy: { role: "DATA_ANALYST", tags: "python, csv-crunching, plot-generation" },
  nova: { role: "MEMORY_ARCHIVIST", tags: "vector-mapping, history-compression" },
  raven: { role: "SYSTEM_ARCHITECT", tags: "backend-schema, pipeline-design" },
  scout: { role: "DEEP_RESEARCHER", tags: "triage, metadata, fast-sweep" },
  architect: { role: "SYSTEM_ARCHITECT", tags: "microservices, omni-router, system-design" },
  coder: { role: "STRUCTURAL_BUILDER", tags: "backend-api, pipeline, database-mutations" },
  claw: { role: "CHIEF_OF_STAFF", tags: "core-orchestration, workflow-runner" }
};

async function standardizeFleet() {
  console.log("🚀 [ZAP-OS] Initiating Fleet Standardization Protocol...");
  
  const entries = await fs.readdir(ROOT_AGENT_DIR, { withFileTypes: true });
  
  for (const dirent of entries) {
    if (!dirent.isDirectory()) continue;
    
    // Skip internal meta folders
    if (["rules", "workflows", "teams", "projects", "humans", "skills"].includes(dirent.name)) continue;

    const agentName = dirent.name.toLowerCase();
    const assignment = FLEET_MATRIX[agentName];
    
    if (!assignment) {
      console.warn(`⚠️ Skipping ${agentName} - Not in Fleet Matrix.`);
      continue;
    }

    const identityPath = path.join(ROOT_AGENT_DIR, agentName, "IDENTITY.md");
    
    let identityContent = "";
    try {
      identityContent = await fs.readFile(identityPath, "utf8");
    } catch {
      identityContent = `# ⚡ IDENTITY: ${agentName.toUpperCase()}\n\n`;
    }

    // Strip out old strict tags or roles so we don't have duplicates
    identityContent = identityContent
      .replace(/\*\*Role:\*\*\s*[A-Z_]+\n?/ig, "")
      .replace(/Role:\s*[A-Z_]+\n?/ig, "")
      .replace(/\*\*Tags:\*\*\s*.*\n?/ig, "")
      .replace(/Tags:\s*.*\n?/ig, "");

    // Inject the new Role and Tags at the top under the first header
    const injection = `\n**Role:** ${assignment.role}\n**Tags:** ${assignment.tags}\n`;
    
    if (identityContent.includes("## 1. Tone")) {
       identityContent = identityContent.replace("## 1. Tone", `${injection}\n## 1. Tone`);
    } else if (identityContent.startsWith("# ")) {
       const firstNewline = identityContent.indexOf("\n");
       identityContent = [identityContent.slice(0, firstNewline), injection, identityContent.slice(firstNewline)].join("");
    } else {
       identityContent = injection + identityContent;
    }

    await fs.writeFile(identityPath, identityContent);
    console.log(`✅ Patched IDENTITY.md for [${agentName}] -> ${assignment.role}`);

    // Compile Models.md
    try {
      execSync(`npx tsx scripts/sync_agent_profession.ts ${agentName}`, { stdio: "ignore" });
      console.log(`🧠 Synthesized Neural Models Matrix for [${agentName}]`);
    } catch (e: any) {
      console.error(`❌ Failed to compile Neural Matrix for [${agentName}]`, e.message);
    }
  }

  console.log("✅ [ZAP-OS] Fleet Standardization Complete. All active Swarm Agents are now locked to the 5-Tier Registry.");
}

standardizeFleet().catch(console.error);
