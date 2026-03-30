import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { logger } from "@/lib/logger";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

async function getGridFS(tenantId: string = "ZVN") {
  const client = new MongoClient(MONGO_URI);
  await client.connect();
  const db = client.db(DB_NAME);
  return { client, bucket: new GridFSBucket(db, { bucketName: `${tenantId}_SYS_ARTIFACTS` }) };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let client: MongoClient | null = null;
  try {
    const threadId = (await params).id;
    const { client: mongoClient, bucket } = await getGridFS();
    client = mongoClient;

    const files = await bucket.find({ "metadata.sessionId": threadId }).toArray();
    
    if (files.length === 0) {
      return NextResponse.json({ success: true, artifacts: [] });
    }

    const artifacts = [];
    for (const file of files) {
      const chunks: Buffer[] = [];
      const downloadStream = bucket.openDownloadStream(file._id);
      
      for await (const chunk of downloadStream) {
        chunks.push(chunk);
      }
      artifacts.push({ 
        filename: file.filename, 
        content: Buffer.concat(chunks).toString("utf-8") 
      });
    }

    return NextResponse.json({ success: true, artifacts });
  } catch (error: any) {
    logger.error(`[api/swarm/threads/[id]/artifacts GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let client: MongoClient | null = null;
  try {
    const threadId = (await params).id;
    const body = await req.json();
    const { filename, content, tenantId = "ZVN" } = body;

    if (!filename || content === undefined) {
      return NextResponse.json({ success: false, error: "Missing filename or content" }, { status: 400 });
    }

    const { client: mongoClient, bucket } = await getGridFS(tenantId);
    client = mongoClient;

    const uploadStream = bucket.openUploadStream(filename, {
      metadata: { sessionId: threadId, type: filename.endsWith('.html') ? 'html' : 'text' }
    });
    
    uploadStream.end(Buffer.from(content, "utf-8"));

    return NextResponse.json({ 
      success: true, 
      message: `${filename} written to GridFS`,
      uri: `gridfs://${tenantId}_SYS_ARTIFACTS/${filename}`
    });
  } catch (error: any) {
    logger.error(`[api/swarm/threads/[id]/artifacts POST] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
