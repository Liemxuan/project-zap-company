import { NextResponse } from "next/server";
import { MongoClient, ObjectId } from "mongodb";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";
const DB_NAME = "olympus";
const COLLECTION_NAME = "SYS_MEMORY"; 

export async function GET() {
  let client: MongoClient | null = null;
  try {
    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION_NAME);

    const memories = await col.find({}).sort({ createdAt: -1 }).toArray();
    return NextResponse.json({ success: true, memories });
  } catch (error: any) {
    console.error(`[api/swarm/memory GET] Error:`, error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

export async function POST(req: Request) {
  let client: MongoClient | null = null;
  try {
    const { content, tags, agentSource } = await req.json();
    if (!content) return NextResponse.json({ success: false, error: "Content is required" }, { status: 400 });

    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION_NAME);

    const newMemory = {
      content,
      tags: tags || [],
      agentSource: agentSource || "system",
      createdAt: new Date(),
    };

    const result = await col.insertOne(newMemory);
    return NextResponse.json({ success: true, memoryId: result.insertedId });
  } catch (error: any) {
    console.error("[api/swarm/memory POST] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}

export async function DELETE(req: Request) {
  let client: MongoClient | null = null;
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    if (!id) return NextResponse.json({ success: false, error: "ID is required" }, { status: 400 });

    client = new MongoClient(MONGO_URI);
    await client.connect();
    const db = client.db(DB_NAME);
    const col = db.collection(COLLECTION_NAME);

    const result = await col.deleteOne({ _id: new ObjectId(id) });
    return NextResponse.json({ success: result.deletedCount > 0 });
  } catch (error: any) {
    console.error("[api/swarm/memory DELETE] Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  } finally {
    if (client) await client.close();
  }
}
