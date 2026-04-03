import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getGlobalMongoClient } from "../../../lib/mongo";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const mclient = await getGlobalMongoClient();
    const db = mclient.db("olympus");

    // Fetch keys excluding actual encrypted material for safety
    const keys = await db.collection("SYS_API_KEYS").find({}, { projection: { encryptedKey: 0, apiKey: 0 } }).toArray();

    return NextResponse.json({ success: true, keys });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
