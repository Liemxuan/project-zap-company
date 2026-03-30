import { NextResponse } from "next/server";
import { logger } from "@/lib/logger";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    
    if (!id) {
        return NextResponse.json({ error: "Missing session ID" }, { status: 400 });
    }

    try {
        // Fetch from the local ZAP Claw instance which holds the Prisma/Postgres connection
        const CLAW_URL = process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900";
        const response = await fetch(`${CLAW_URL}/api/history/${id}?accountType=OLYMPUS_HUD`);
        
        if (!response.ok) {
            throw new Error(`ZAP Claw returned ${response.status}`);
        }

        const data = await response.json();
        return NextResponse.json(data);
    } catch (error: any) {
        logger.error(`[api/swarm/history] Error fetching history for ${id}:`, error);
        return NextResponse.json({ error: `Failed to fetch history: ${error.message}` }, { status: 500 });
    }
}
