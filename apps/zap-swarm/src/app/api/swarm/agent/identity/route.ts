import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";

const ZAP_CLAW_AGENT_DIR = path.resolve(process.cwd(), "../../packages/zap-claw/.agent");

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const slug = searchParams.get("slug");

        if (!slug || typeof slug !== "string") {
            return NextResponse.json({ error: "Missing or invalid slug parameter" }, { status: 400 });
        }

        const safeSlug = slug.replace(/[^a-zA-Z0-9_\-]/g, "");
        
        // Agents can either be in the root .agent/ dir or under .agent/humans/ or .agent/teams/
        const potentialPaths = [
            path.join(ZAP_CLAW_AGENT_DIR, safeSlug),
            path.join(ZAP_CLAW_AGENT_DIR, "humans", safeSlug),
            path.join(ZAP_CLAW_AGENT_DIR, "teams", safeSlug)
        ];

        let targetDir = "";
        for (const p of potentialPaths) {
            try {
                const stat = await fs.stat(p);
                if (stat.isDirectory()) {
                    targetDir = p;
                    break;
                }
            } catch (e) {
                // Ignore if not found
            }
        }

        if (!targetDir) {
            return NextResponse.json({ error: `Agent identity directory not found for slug: ${safeSlug}` }, { status: 404 });
        }

        const CORE_FILES = ["identity.md", "models.md", "soul.md", "self-healing-brain.md", "learn.md", "heartbeat.md", "agents.md", "skill.md", "memory.md", "shield.md", "tools.md", "user.md"];
        let compiledPayload = "";

        for (const filename of CORE_FILES) {
            try {
                const filePath = path.join(targetDir, filename);
                const content = await fs.readFile(filePath, 'utf-8');
                
                // Add a visual separator between sections for the deployment payload
                compiledPayload += `\n\n--- [${filename.toUpperCase()}] ---\n\n`;
                compiledPayload += content.trim();
            } catch (err) {
                // File doesn't exist; continue to the next one
            }
        }

        if (!compiledPayload) {
            return NextResponse.json({ error: "No identity files found in target directory" }, { status: 404 });
        }

        // Clean up the initial separator
        compiledPayload = compiledPayload.trim();

        return NextResponse.json({ payload: compiledPayload });
    } catch (error: any) {
        return NextResponse.json({ error: `Failed to compile agent identity: ${error.message}` }, { status: 500 });
    }
}
