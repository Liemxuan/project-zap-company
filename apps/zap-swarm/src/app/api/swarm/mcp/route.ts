import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";

const defaultServers = [
  { name: "github", command: "npx", args: ["-y", "@modelcontextprotocol/server-github"], env: {}, status: "online", type: "stdio" },
  { name: "testsprite", command: "npx", args: ["-y", "testsprite-mcp-server"], env: {}, status: "offline", type: "stdio" },
  { name: "notebooklm", command: "uvx", args: ["notebooklm-mcp"], env: {}, status: "offline", type: "stdio" }
];

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection("ZVN_SYS_MCP_SERVERS");

    let servers = await col.find({}).toArray();

    // Auto-seed if empty
    if (servers.length === 0) {
      const docsToInsert = defaultServers.map(s => ({ ...s, createdAt: new Date() }));
      await col.insertMany(docsToInsert);
      servers = await col.find({}).toArray();
    }

    return NextResponse.json({ success: true, servers: servers.map((s: any) => ({ ...s, _id: s._id.toString() })) });
  } catch (error: any) {
    logger.error(`[api/swarm/mcp GET] Error:`, error);
    return NextResponse.json({ success: true, servers: defaultServers });
  } finally {
    if (client) await client.close();
  }
}

export async function PUT(req: Request) {
  let client: MongoClient | null = null;
  try {
    const body = await req.json();
    const { name, config } = body;

    if (!name) return NextResponse.json({ success: false, error: "Missing server name" }, { status: 400 });

    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection("ZVN_SYS_MCP_SERVERS");

    await col.updateOne(
      { name },
      { $set: { ...config, updatedAt: new Date() } },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: `MCP Server '${name}' updated.` });
  } catch (error: any) {
    logger.error(`[api/swarm/mcp PUT] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
