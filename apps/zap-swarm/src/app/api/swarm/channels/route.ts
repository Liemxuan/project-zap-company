import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

const defaultChannels = [
  { name: "Telegram", status: "active", users: 142, ping: "12ms" },
  { name: "WhatsApp", status: "pending", users: 0, ping: "-" },
  { name: "Discord", status: "active", users: 89, ping: "45ms" },
  { name: "iMessage", status: "active", users: 12, ping: "8ms" }
];

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection("ZVN_SYS_CHANNELS");

    let channels = await col.find({}).toArray();

    // Auto-seed if empty
    if (channels.length === 0) {
      const docsToInsert = defaultChannels.map(c => ({ ...c, createdAt: new Date() }));
      await col.insertMany(docsToInsert);
      channels = await col.find({}).toArray();
    }

    return NextResponse.json({ success: true, channels });
  } catch (error: any) {
    console.error(`[api/swarm/channels] Error:`, error);
    return NextResponse.json({ success: true, channels: defaultChannels });
  } finally {
    if (client) await client.close();
  }
}
