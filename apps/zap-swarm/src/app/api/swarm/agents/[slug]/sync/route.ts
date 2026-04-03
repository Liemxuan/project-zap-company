import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { exec } from "child_process";
import { promisify } from "util";
import { getGlobalMongoClient } from "../../../../../../lib/mongo";

const execAsync = promisify(exec);

export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const resolvedParams = await params;
    const body = await request.json();
    const { role, tags } = body;

    if (!role || typeof tags !== 'string') {
      return NextResponse.json({ success: false, error: "Missing role or tags payload" }, { status: 400 });
    }

    const agentId = resolvedParams.slug.toLowerCase();
    
    // 1. Point to the local backend environment
    const rootDir = path.resolve(process.cwd(), "../../packages/zap-claw");
    const identityPath = path.join(rootDir, ".agent", agentId, "IDENTITY.md");

    // 2. Read existing Identity
    let identityContent = "";
    try {
      identityContent = await fs.readFile(identityPath, "utf8");
    } catch {
      return NextResponse.json({ success: false, error: "IDENTITY.md not found for agent" }, { status: 404 });
    }

    // 3. Regex strip the old tags and roles
    identityContent = identityContent
      .replace(/\*\*Role:\*\*\s*[a-zA-Z0-9_]+\n?/ig, "")
      .replace(/Role:\s*[a-zA-Z0-9_]+\n?/ig, "")
      .replace(/\*\*Tags:\*\*\s*.*\n?/ig, "")
      .replace(/Tags:\s*.*\n?/ig, "");

    // 4. Inject
    const injection = `\n**Role:** ${role}\n**Tags:** ${tags}\n`;
    
    if (identityContent.includes("## 1. Tone")) {
       identityContent = identityContent.replace("## 1. Tone", `${injection}\n## 1. Tone`);
    } else if (identityContent.startsWith("# ")) {
       const firstNewline = identityContent.indexOf("\n");
       identityContent = [identityContent.slice(0, firstNewline), injection, identityContent.slice(firstNewline)].join("");
    } else {
       identityContent = injection + identityContent;
    }

    await fs.writeFile(identityPath, identityContent);

    // 5. Fire the compiler script natively
    await execAsync(`npx tsx scripts/sync_agent_profession.ts ${agentId}`, { cwd: rootDir });

    // BLAST-IRONCLAD: Audit trail for agent reconfiguration
    try {
      const { MongoClient } = await import("mongodb");
      const mclient = await getGlobalMongoClient();
      await mclient.db("olympus").collection("SYS_OS_approvals").insertOne({
        type: "agent_sync",
        agentId,
        timestamp: new Date(),
        changes: { role, tags },
        approvedBy: "dashboard_user",
        source: "swarm_ui"
      });
    } catch (auditErr) {
      console.error("[IRONCLAD] Audit trail write failed:", auditErr);
    }

    return NextResponse.json({ success: true, message: "Matrix compiled successfully" });

  } catch (error: any) {
    console.error(`Sync API Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
