// Olympus ID: OLY-SWARM
// Upload endpoint — stores user-attached files to GridFS and returns a reference URL.
// Accepts multipart/form-data with fields: file (File), sessionId (string)

import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { logger } from "@/lib/logger";
import { getGlobalMongoClient } from "../../../../lib/mongo";
import pdfParse from "pdf-parse";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const MIME_TO_TYPE: Record<string, "image" | "file" | "audio" | "video"> = {
    "image/png": "image",
    "image/jpeg": "image",
    "image/jpg": "image",
    "image/gif": "image",
    "image/webp": "image",
    "audio/mpeg": "audio",
    "audio/wav": "audio",
    "video/mp4": "video",
    "video/webm": "video",
    "application/pdf": "file",
};

export async function POST(req: Request) {
    let client: MongoClient | null = null;
    try {
        const formData = await req.formData();
        const file = formData.get("file") as File | null;
        const sessionId = formData.get("sessionId") as string | null;

        if (!file || !sessionId) {
            return NextResponse.json({ error: "Missing file or sessionId" }, { status: 400 });
        }

        if (file.size > MAX_FILE_SIZE) {
            return NextResponse.json({ error: "File exceeds 10 MB limit" }, { status: 413 });
        }

        const buffer = Buffer.from(await file.arrayBuffer());
        const filename = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, "_")}`;
        const mimeType = file.type || "application/octet-stream";
        const attachmentType = MIME_TO_TYPE[mimeType] || "file";

        let extractedText = null;
        if (mimeType === "application/pdf") {
            try {
                const pdfData = await pdfParse(buffer);
                extractedText = pdfData.text;
                logger.info(`[api/swarm/upload] Extracted ${extractedText.length} characters from PDF ${file.name}`);
            } catch (err: any) {
                logger.warn(`[api/swarm/upload] Failed to parse PDF text: ${err.message}`);
            }
        }

        client = await getGlobalMongoClient();
        const db = client.db(DB_NAME);
        const bucket = new GridFSBucket(db, { bucketName: "OLYMPUS_SWARM_SYS_UPLOADS" });

        const uploadStream = bucket.openUploadStream(filename, {
            metadata: {
                sessionId,
                originalName: file.name,
                mimeType,
                type: attachmentType,
                sizeBytes: file.size,
                uploadedAt: new Date(),
                ...(extractedText ? { parsedText: extractedText } : {})
            },
        });

        uploadStream.end(buffer);

        const fileId = uploadStream.id.toString();

        return NextResponse.json({
            success: true,
            attachment: {
                id: fileId,
                filename,
                originalName: file.name,
                type: attachmentType,
                mimeType,
                sizeBytes: file.size,
                url: `/api/swarm/upload/${fileId}`,
            },
        });
    } catch (error: any) {
        logger.error("[api/swarm/upload] Error:", { error: error.message });
        return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 });
    } finally {
    }
}
