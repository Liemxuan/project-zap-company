import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const AGENT_DIR = path.resolve(process.cwd(), "../../packages/zap-claw/.agent");

export async function GET(req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  try {
    const { slug, file } = await params;
    const filename = file.endsWith('.md') ? file : `${file}.md`;
    const docPath = path.join(AGENT_DIR, slug, filename);

    if (!fs.existsSync(docPath)) {
      return NextResponse.json({ success: true, content: "" });
    }

    const content = fs.readFileSync(docPath, "utf-8");
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    console.error(`[api/swarm/agent/[slug]/[file] GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ slug: string; file: string }> }) {
  try {
    const { slug, file } = await params;
    const body = await req.json();
    const { content } = body;
    
    if (typeof content !== "string") {
      return NextResponse.json({ success: false, error: "Invalid content format" }, { status: 400 });
    }

    const agentPath = path.join(AGENT_DIR, slug);
    if (!fs.existsSync(agentPath)) {
      return NextResponse.json({ success: false, error: "Agent not found" }, { status: 404 });
    }

    const filename = file.endsWith('.md') ? file : `${file}.md`;
    const docPath = path.join(AGENT_DIR, slug, filename);
    fs.writeFileSync(docPath, content, "utf-8");
    
    return NextResponse.json({ success: true, message: `${filename} updated successfully` });
  } catch (error: any) {
    console.error("[api/swarm/agent/[slug]/[file] PUT] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
