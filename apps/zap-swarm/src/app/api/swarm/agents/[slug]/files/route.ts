import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const AGENT_DIR = path.resolve(process.cwd(), "../../packages/zap-claw/.agent");

export async function GET(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const slug = (await params).slug;
    const agentPath = path.join(AGENT_DIR, slug);
    
    if (!fs.existsSync(agentPath)) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    const files = fs.readdirSync(agentPath).filter(f => f.endsWith(".md")).sort();
    const mdFiles = files.map(file => {
      const content = fs.readFileSync(path.join(agentPath, file), "utf-8");
      // Strip '.md' extension to serve as the key since the UI uses these keys
      return { 
        id: file.replace('.md', ''),
        filename: file, 
        content 
      };
    });

    return NextResponse.json({ success: true, files: mdFiles });
  } catch (error: any) {
    console.error(`[api/swarm/agent/[slug]/files GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
