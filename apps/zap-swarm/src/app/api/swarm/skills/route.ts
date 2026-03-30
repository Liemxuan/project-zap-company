import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
import { getTenantContext } from "@/lib/tenant";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const SKILLS_DIR = path.resolve(process.cwd(), "../../.agent/skills");
const CLAW_URL = process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900";

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection("ZVN_SYS_SKILLS");

    let skills = await col.find({}).toArray();

    // Auto-seed/Sync from File System
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

        // Extremely native frontmatter extraction without extra dependencies
        const nameMatch = content.match(/name:\s*(.+)/);
        const descMatch = content.match(/description:\s*(.+)/);
        
        return {
          name: nameMatch ? nameMatch[1].trim() : dir.name,
          desc: descMatch ? descMatch[1].trim() : "No description provided.",
          cat: dir.name.includes('zap') ? 'ZAP Native' : dir.name.includes('df-') ? 'Analysis' : 'Workflow',
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
    console.error(`[api/swarm/skills GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
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
    client = new MongoClient(MONGO_URI);
    await client.connect();
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
    console.error(`[api/swarm/skills POST] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

