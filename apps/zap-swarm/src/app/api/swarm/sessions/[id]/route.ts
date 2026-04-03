// Olympus ID: OLY-SWARM
// Session management: rename (PATCH) and soft-delete/archive (DELETE)

import { NextRequest, NextResponse } from "next/server";
import { getGlobalMongoClient } from "../../../../../lib/mongo";
import { logger } from "@/lib/logger";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: sessionId } = await params;
    if (!sessionId) return NextResponse.json({ error: "Missing session ID" }, { status: 400 });

    let body: { title?: string };
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const title = body.title?.trim();
    if (!title) return NextResponse.json({ error: "Title is required" }, { status: 400 });

    try {
        const client = await getGlobalMongoClient();
        const db = client.db("olympus");
        await db.collection("SYS_OS_session_titles").updateOne(
            { sessionId },
            { $set: { sessionId, title, updatedAt: new Date() } },
            { upsert: true }
        );
        return NextResponse.json({ success: true, title });
    } catch (err: any) {
        logger.error("[api/sessions/[id]] PATCH error", { error: err?.message });
        return NextResponse.json({ error: "Failed to rename session" }, { status: 500 });
    }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id: sessionId } = await params;
    if (!sessionId) return NextResponse.json({ error: "Missing session ID" }, { status: 400 });

    try {
        const client = await getGlobalMongoClient();
        const db = client.db("olympus");
        // Soft-archive: mark in session_titles so the sessions API filters it out
        await db.collection("SYS_OS_session_titles").updateOne(
            { sessionId },
            { $set: { sessionId, archived: true, archivedAt: new Date() } },
            { upsert: true }
        );
        return NextResponse.json({ success: true });
    } catch (err: any) {
        logger.error("[api/sessions/[id]] DELETE error", { error: err?.message });
        return NextResponse.json({ error: "Failed to archive session" }, { status: 500 });
    }
}
