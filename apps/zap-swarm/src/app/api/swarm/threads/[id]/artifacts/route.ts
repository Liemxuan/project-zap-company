import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const VFS_ROOT = path.resolve(process.cwd(), "../../packages/zap-claw/.agent/vfs");

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const threadId = (await params).id;
    const threadVfsPath = path.join(VFS_ROOT, "tmp", threadId);

    if (!fs.existsSync(threadVfsPath)) {
      return NextResponse.json({ success: true, artifacts: [] });
    }

    const files = fs.readdirSync(threadVfsPath).filter(f => !f.startsWith("."));
    const artifacts = files.map(file => {
      const content = fs.readFileSync(path.join(threadVfsPath, file), "utf-8");
      return { filename: file, content };
    });

    return NextResponse.json({ success: true, artifacts });
  } catch (error: any) {
    console.error(`[api/swarm/threads/[id]/artifacts GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const threadId = (await params).id;
    const body = await req.json();
    const { filename, content } = body;

    if (!filename || content === undefined) {
      return NextResponse.json({ success: false, error: "Missing filename or content" }, { status: 400 });
    }

    const threadVfsPath = path.join(VFS_ROOT, "tmp", threadId);
    
    // Ensure directory exists
    if (!fs.existsSync(threadVfsPath)) {
      fs.mkdirSync(threadVfsPath, { recursive: true });
    }

    const docPath = path.join(threadVfsPath, filename);
    
    // Prevent directory traversal attacks
    if (!docPath.startsWith(threadVfsPath)) {
      return NextResponse.json({ success: false, error: "Path traversal violation" }, { status: 403 });
    }

    fs.writeFileSync(docPath, content, "utf-8");
    
    return NextResponse.json({ 
      success: true, 
      message: `${filename} written to VFS`,
      uri: `tmp://${threadId}/${filename}`
    });
  } catch (error: any) {
    console.error("[api/swarm/threads/[id]/artifacts POST] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
