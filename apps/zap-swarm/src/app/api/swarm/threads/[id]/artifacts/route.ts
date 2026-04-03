import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

async function getGridFS(tenantId: string = "OLYMPUS_SWARM") {
  const client = await getGlobalMongoClient();
  const db = client.db(DB_NAME);
  return { client, bucket: new GridFSBucket(db, { bucketName: `${tenantId}_SYS_ARTIFACTS` }) };
}

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  let client: MongoClient | null = null;
  try {
    const threadId = (await params).id;
    // We can also extract tenantId from URL query parameters if needed
    const { searchParams } = new URL(req.url);
    const tenantId = searchParams.get("tenantId") || "OLYMPUS_SWARM";
    
    const { client: mongoClient, bucket } = await getGridFS(tenantId);
    client = mongoClient;

    const files = await bucket.find({ "metadata.sessionId": threadId }).toArray();
    
    if (files.length === 0) {
      return NextResponse.json({ success: true, artifacts: [] });
    }

    const AUDIO_EXT = /\.(mp3|wav|ogg|m4a|aac|flac)$/i;

    const artifacts = [];
    for (const file of files) {
      // Skip binary reads for audio files — client constructs a stream URL
      if (AUDIO_EXT.test(file.filename)) {
        artifacts.push({ filename: file.filename, content: null, type: "audio" });
        continue;
      }

      const chunks: Buffer[] = [];
      const downloadStream = bucket.openDownloadStream(file._id);

      for await (const chunk of downloadStream) {
        chunks.push(chunk as Buffer);
      }

      const isImage = /\.(png|jpg|jpeg|gif|webp)$/i.test(file.filename);
      let contentStr = "";
      if (isImage) {
        // Content may already be a data URL (written by nano_banana_2 tool as UTF-8)
        // or raw binary bytes — handle both cases.
        const rawStr = Buffer.concat(chunks).toString("utf-8");
        if (rawStr.startsWith("data:")) {
          contentStr = rawStr;
        } else {
          const extMatch = file.filename.match(/\.(png|jpg|jpeg|gif|webp)$/i);
          const ext = extMatch ? extMatch[1].toLowerCase() : 'png';
          const mimeType = ext === 'jpg' ? 'jpeg' : ext;
          contentStr = `data:image/${mimeType};base64,${Buffer.concat(chunks).toString("base64")}`;
        }
      } else {
        contentStr = Buffer.concat(chunks).toString("utf-8");
      }

      artifacts.push({
        filename: file.filename,
        content: contentStr,
        type: (file.metadata as any)?.type || (isImage ? "image" : "text"),
      });
    }

    return NextResponse.json({ success: true, artifacts });
  } catch (error: any) {
    logger.error(`[api/swarm/threads/[id]/artifacts GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
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
  }
}
