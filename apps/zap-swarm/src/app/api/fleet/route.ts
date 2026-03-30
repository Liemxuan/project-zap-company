import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mclient = new MongoClient(process.env.MONGODB_URI || "mongodb://localhost:27017");
    await mclient.connect();
    const db = mclient.db("olympus");

    // Fetch keys excluding actual encrypted material for safety
    const keys = await db.collection("SYS_API_KEYS").find({}, { projection: { encryptedKey: 0, apiKey: 0 } }).toArray();
    await mclient.close();

    return NextResponse.json({ success: true, keys });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
