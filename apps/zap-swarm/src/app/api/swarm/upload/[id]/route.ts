// Olympus ID: OLY-SWARM
// Serves uploaded files from GridFS by ObjectId

import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import dotenv from "dotenv";
import path from "path";
import { getGlobalMongoClient } from "../../../../../lib/mongo";

dotenv.config({ path: path.resolve(process.cwd(), "../../.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    let client: MongoClient | null = null;

    try {
        client = await getGlobalMongoClient();
        const db = client.db(DB_NAME);
        const bucket = new GridFSBucket(db, { bucketName: "OLYMPUS_SWARM_SYS_UPLOADS" });

        const files = await bucket.find({ _id: new ObjectId(id) }).toArray();
        if (files.length === 0) {
            return new Response("Not found", { status: 404 });
        }

        const file = files[0];
        const mimeType = (file.metadata as any)?.mimeType || "application/octet-stream";

        const chunks: Buffer[] = [];
        const downloadStream = bucket.openDownloadStream(file._id);
        for await (const chunk of downloadStream) {
            chunks.push(chunk as Buffer);
        }

        return new Response(Buffer.concat(chunks), {
            headers: {
                "Content-Type": mimeType,
                "Content-Disposition": `inline; filename="${file.filename}"`,
                "Cache-Control": "public, max-age=86400",
            },
        });
    } catch {
        return new Response("Error fetching file", { status: 500 });
    } finally {
    }
}
