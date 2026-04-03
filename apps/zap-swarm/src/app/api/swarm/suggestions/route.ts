import { NextRequest, NextResponse } from "next/server";
import { MongoClient } from "mongodb";
import { getGlobalMongoClient } from "../../../../lib/mongo";

const MONGO_URI = process.env.MONGODB_URI || "mongodb://localhost:27017";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("sessionId");
  if (!sessionId) {
    return NextResponse.json({ success: false, error: "sessionId required" }, { status: 400 });
  }

  const client = await getGlobalMongoClient();
  try {
    const db = client.db("olympus");
    const doc = await db.collection("SYS_OS_followup_suggestions").findOne({ sessionId });
    return NextResponse.json({
      success: true,
      suggestions: doc?.suggestions || [],
      updatedAt: doc?.updatedAt || null,
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  } finally {
  }
}
