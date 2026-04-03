// Olympus ID: OLY-SWARM
import { NextResponse } from "next/server";
import { GridFSBucket } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: true });

const DB_NAME = "olympus";

const EXT_TO_MIME: Record<string, string> = {
  mp3: "audio/mpeg",
  wav: "audio/wav",
  ogg: "audio/ogg",
  m4a: "audio/mp4",
  aac: "audio/aac",
  flac: "audio/flac",
};

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const threadId = (await params).id;
    const { searchParams } = new URL(req.url);
    const filename = searchParams.get("filename");
    const tenantId = searchParams.get("tenantId") || "OLYMPUS_SWARM";

    if (!filename) {
      return NextResponse.json({ error: "Missing filename" }, { status: 400 });
    }

    const client = await getGlobalMongoClient();
    const db = client.db(DB_NAME);
    const bucket = new GridFSBucket(db, { bucketName: `${tenantId}_SYS_ARTIFACTS` });

    const files = await bucket
      .find({ filename, "metadata.sessionId": threadId })
      .limit(1)
      .toArray();

    if (files.length === 0) {
      return NextResponse.json({ error: "Audio artifact not found" }, { status: 404 });
    }

    const file = files[0];
    const ext = filename.split(".").pop()?.toLowerCase() ?? "";
    const mimeType = EXT_TO_MIME[ext] ?? "application/octet-stream";

    const chunks: Buffer[] = [];
    const downloadStream = bucket.openDownloadStream(file._id);
    for await (const chunk of downloadStream) {
      chunks.push(chunk as Buffer);
    }

    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        "Content-Type": mimeType,
        "Content-Length": buffer.length.toString(),
        "Content-Disposition": `inline; filename="${filename}"`,
        "Cache-Control": "public, max-age=86400",
        "Accept-Ranges": "bytes",
      },
    });
  } catch (error: any) {
    logger.error(`[artifacts/audio GET] Error:`, error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
