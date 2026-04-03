export const revalidate = false;
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { getTenantContext } from "@/lib/tenant";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const SKILLS_DIR = path.resolve(process.cwd(), "../../.agent/skills");
const CLAW_URL = process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900";

// ── Skill Taxonomy Engine ──────────────────────────────────
// Maps directory prefixes → group, primary agent, base tags

type SkillGroup = "ZAP Engine" | "Frontend" | "Backend" | "DevOps" | "DeerFlow" | "GSD" | "Agent" | "Workflow" | "MCP" | "Research";
type AgentTag = "spike" | "jerry" | "ralph" | "cso" | "operator" | "any";

interface SkillClassification {
    group: SkillGroup;
    agent: AgentTag;
    tags: string[];
}

const PREFIX_RULES: Array<{ prefix: string; group: SkillGroup; agent: AgentTag; baseTags: string[] }> = [
    { prefix: "zap-",          group: "ZAP Engine",  agent: "any",    baseTags: ["design-system", "m3", "tokens"] },
    { prefix: "frontend-",    group: "Frontend",    agent: "any",    baseTags: ["react", "ui", "components"] },
    { prefix: "backend-",     group: "Backend",     agent: "any",    baseTags: ["api", "server", "database"] },
    { prefix: "devops-",      group: "DevOps",      agent: "any",    baseTags: ["infra", "deployment", "server"] },
    { prefix: "df-",          group: "DeerFlow",    agent: "any",    baseTags: ["research", "analysis", "content"] },
    { prefix: "gsd-",         group: "GSD",         agent: "any",    baseTags: ["planning", "workflow", "project"] },
    { prefix: "agent-",       group: "Agent",       agent: "any",    baseTags: ["swarm", "automation", "agent"] },
    { prefix: "mcp-",         group: "MCP",         agent: "any",    baseTags: ["integration", "mcp", "protocol"] },
    { prefix: "workflow-",    group: "Workflow",    agent: "any",    baseTags: ["process", "documentation", "standards"] },
    { prefix: "nano-",        group: "DeerFlow",    agent: "any",    baseTags: ["generation", "image", "ai"] },
];

// Content-derived tags: scan SKILL.md for high-signal keywords
const CONTENT_TAG_PATTERNS: Array<{ regex: RegExp; tag: string }> = [
    { regex: /\btesting\b|\btest\b|\bvitest\b|\bjest\b/i, tag: "testing" },
    { regex: /\bsecurity\b|\bzss\b|\bauth\b/i, tag: "security" },
    { regex: /\banimation\b|\bmotion\b|\bframer/i, tag: "animation" },
    { regex: /\btailwind\b/i, tag: "tailwind" },
    { regex: /\bmongodb\b|\bprisma\b|\bdatabase\b/i, tag: "database" },
    { regex: /\bredis\b/i, tag: "cache" },
    { regex: /\bdocker\b|\bk8s\b|\bkubernetes\b/i, tag: "containers" },
    { regex: /\bgit\b|\bbranch\b|\bcommit\b/i, tag: "git" },
    { regex: /\bdiagram\b|\bvisuali/i, tag: "visualization" },
    { regex: /\baudit\b|\breview\b/i, tag: "audit" },
    { regex: /\brefactor\b|\bsimplif/i, tag: "refactoring" },
    { regex: /\bdebug\b/i, tag: "debugging" },
    { regex: /\bpodcast\b|\baudio\b/i, tag: "media" },
    { regex: /\bvideo\b|\bslide\b|\bppt\b/i, tag: "media" },
    { regex: /\bnotebook\b|\bresearch\b/i, tag: "research" },
];

function classifySkill(dirName: string, content: string): SkillClassification {
    // 1. Match by prefix
    let group: SkillGroup = "Workflow";
    let agent: AgentTag = "any";
    let tags: string[] = [];

    for (const rule of PREFIX_RULES) {
        if (dirName.startsWith(rule.prefix)) {
            group = rule.group;
            agent = rule.agent;
            tags = [...rule.baseTags];
            break;
        }
    }

    // Special overrides for non-prefixed skills
    if (group === "Workflow") {
        if (dirName.includes("debug")) { group = "Workflow"; agent = "any"; tags.push("debugging"); }
        else if (dirName.includes("review") || dirName.includes("audit")) { group = "Workflow"; agent = "any"; tags.push("audit"); }
        else if (dirName.includes("plan") || dirName.includes("writing")) { group = "Workflow"; agent = "any"; tags.push("planning"); }
        else if (dirName.includes("test")) { group = "Workflow"; agent = "any"; tags.push("testing"); }
        else if (dirName.includes("motion") || dirName.includes("animation")) { group = "Frontend"; agent = "any"; tags.push("animation"); }
        else if (dirName.includes("design") || dirName.includes("ui-ux")) { group = "Frontend"; agent = "any"; tags.push("design"); }
    }

    // 2. Content-derived tags (deduplicated)
    const excerpt = content.substring(0, 3000); // Only scan first 3k chars for perf
    for (const pat of CONTENT_TAG_PATTERNS) {
        if (pat.regex.test(excerpt) && !tags.includes(pat.tag)) {
            tags.push(pat.tag);
        }
    }

    // 3. Always add the agent as a tag for filtering
    if (!tags.includes(agent)) tags.push(agent);

    return { group, agent, tags };
}

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = await getGlobalMongoClient();
    const db = client.db(DB_NAME);
    const col = db.collection("ZVN_SYS_SKILLS");

    let skills = await col.find({}).toArray();

    // Auto-seed/Sync from File System
    console.log("[SKILLS DEBUG] SKILLS_DIR:", SKILLS_DIR, "Exists?", fs.existsSync(SKILLS_DIR));
    
    if (fs.existsSync(SKILLS_DIR)) {
      const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true }).filter(d => d.isDirectory());
      const fsSkills = dirs.map(dir => {
        const skillPathMd = path.join(SKILLS_DIR, dir.name, "SKILL.md");
        const skillPathLower = path.join(SKILLS_DIR, dir.name, "skill.md");
        let content = "";
        
        if (fs.existsSync(skillPathMd)) {
          content = fs.readFileSync(skillPathMd, "utf-8");
        } else if (fs.existsSync(skillPathLower)) {
          content = fs.readFileSync(skillPathLower, "utf-8");
        } else {
          return null;
        }

        const nameMatch = content.match(/name:\s*(.+)/);
        const descMatch = content.match(/description:\s*(.+)/);
        const { group, agent, tags } = classifySkill(dir.name, content);
        
        return {
          name: nameMatch ? nameMatch[1].trim() : dir.name,
          dirName: dir.name,
          desc: descMatch ? descMatch[1].trim() : "No description provided.",
          group,
          agent,
          tags,
          content,
          path: `../../.agent/skills/${dir.name}`
        };
      }).filter(Boolean);

      // Upsert matching FS skills into MongoDB so we don't duplicate
      if (fsSkills.length > 0) {
        const bulkOps = fsSkills.map((s: any) => ({
          updateOne: {
            filter: { name: s.name },
            update: { $set: { ...s, updatedAt: new Date() } },
            upsert: true
          }
        }));
        await col.bulkWrite(bulkOps);
      }
    }

    skills = await col.find({}).toArray();
    return NextResponse.json({ success: true, skills: skills.map(s => ({ ...s, _id: s._id.toString() })) });
  } catch (error: any) {
    logger.error(`[api/swarm/skills GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
  }
}

/**
 * POST /api/swarm/skills — Execute a skill
 * 
 * Body:
 *   skillName: string     — The skill identifier (directory name or display name)
 *   input: string         — The user's input/instruction for the skill
 *   sessionId: string     — Session to attach execution results to
 *   agentId?: string      — Agent to execute (defaults to "spike")
 *   params?: object       — Optional parameters passed to skill context
 * 
 * Flow:
 *   1. Resolve skill from MongoDB (name lookup)
 *   2. Read the SKILL.md from filesystem
 *   3. Build system prompt: skill instructions + user input
 *   4. Dispatch to zap-claw OmniRouter as a job
 *   5. Return job ID for tracking
 */
export async function POST(req: Request) {
  let client: MongoClient | null = null;
  try {
    const body = await req.json();
    const { skillName, input, sessionId, agentId = "spike", params } = body;
    const { tenantId } = await getTenantContext();

    if (!skillName || !input || !sessionId) {
      return NextResponse.json(
        { error: "Missing required fields: skillName, input, sessionId" },
        { status: 400 }
      );
    }

    // 1. Resolve skill from MongoDB
    client = await getGlobalMongoClient();
    const db = client.db(DB_NAME);
    const col = db.collection("ZVN_SYS_SKILLS");

    const skill = await col.findOne({
      $or: [
        { name: skillName },
        { name: { $regex: new RegExp(`^${skillName}$`, 'i') } }
      ]
    });

    if (!skill) {
      return NextResponse.json(
        { error: `Skill "${skillName}" not found in registry.` },
        { status: 404 }
      );
    }

    // 2. Read SKILL.md from filesystem
    let skillInstructions = "";
    if (skill.path) {
      const resolvedPath = path.resolve(process.cwd(), skill.path);
      const skillMdPath = path.join(resolvedPath, "SKILL.md");
      const skillMdLower = path.join(resolvedPath, "skill.md");

      if (fs.existsSync(skillMdPath)) {
        skillInstructions = fs.readFileSync(skillMdPath, "utf-8");
      } else if (fs.existsSync(skillMdLower)) {
        skillInstructions = fs.readFileSync(skillMdLower, "utf-8");
      }
    }

    // 3. Build the execution prompt
    const systemPrompt = [
      `You are executing the "${skill.name}" skill.`,
      `Category: ${skill.cat || "General"}`,
      skillInstructions ? `\n## Skill Instructions\n${skillInstructions}` : "",
      params ? `\n## Parameters\n${JSON.stringify(params, null, 2)}` : "",
    ].filter(Boolean).join("\n");

    // 4. Dispatch to zap-claw
    const response = await fetch(`${CLAW_URL}/api/swarm/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId,
        agentId,
        message: input,
        tenantId,
        contextParams: {
          skillName: skill.name,
          skillCategory: skill.cat,
          ...params,
        },
        systemPromptOverride: systemPrompt,
      }),
    });

    if (!response.ok) {
      const errText = await response.text().catch(() => "Unknown error");
      throw new Error(`ZAP Claw returned ${response.status}: ${errText}`);
    }

    const data = await response.json();

    // 5. Log execution to skills audit
    await db.collection("ZVN_SYS_SKILL_EXECUTIONS").insertOne({
      skillName: skill.name,
      sessionId,
      agentId,
      tenantId,
      input: input.substring(0, 500), // Truncate for audit storage
      status: "DISPATCHED",
      jobId: data.jobId || null,
      timestamp: new Date(),
    });

    return NextResponse.json({
      success: true,
      jobId: data.jobId || null,
      skill: skill.name,
      agent: agentId,
      sessionId,
    });
  } catch (error: any) {
    logger.error(`[api/swarm/skills POST] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
  }
}

