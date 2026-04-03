export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import path from "path";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";

dotenv.config({ path: path.resolve(process.cwd(), "../../zap-core/.env"), override: true });

const CLAW_URL = process.env.NEXT_PUBLIC_CLAW_URL || "http://localhost:3900";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { sessionId, agentId, message, tenantId: bodyTenantId, modelId, attachments, contextParams } = body;
        
        // Identity Resolution (Matches middleware injection)
        const userId = req.headers.get("X-ZAP-User");
        const tenantId = req.headers.get("X-ZAP-Tenant") || bodyTenantId || "OLYMPUS_SWARM";

        if (!userId) {
            return NextResponse.json({ error: "Authentication required. Please log in." }, { status: 401 });
        }

        if (!sessionId || !agentId || !message) {
            return NextResponse.json({ error: "Missing required fields: sessionId, agentId, or message" }, { status: 400 });
        }

        // Proxy to Claw V2 (ConversationRuntime)
        try {
            const clawRes = await fetch(`${CLAW_URL}/api/swarm/chat/v2`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'X-ZAP-User': userId,
                    'X-ZAP-Tenant': tenantId
                },
                body: JSON.stringify({ 
                    sessionId, 
                    agentId, 
                    message, 
                    tenantId, 
                    modelId, 
                    attachments,
                    contextParams 
                }),
                signal: AbortSignal.timeout(10000), // V2 might take longer to initialize
            });

            if (clawRes.ok) {
                const data = await clawRes.json();
                return NextResponse.json(data);
            }

            // Claw returned an error
            let clawErr = `ZAP Claw (V2) error ${clawRes.status}`;
            try { 
                const b = await clawRes.json(); 
                clawErr = b.error || b.message || clawErr; 
            } catch {}
            
            logger.error(`[api/swarm/chat/v2] Claw V2 returned error: ${clawErr}`);
            return NextResponse.json({ error: clawErr }, { status: clawRes.status });

        } catch (clawConnErr: any) {
            logger.error(`[api/swarm/chat/v2] Claw V2 unreachable: ${clawConnErr.message}`);
            return NextResponse.json({ error: "ZAP Claw runtime is currently offline." }, { status: 503 });
        }

    } catch (error: any) {
        logger.error("[api/swarm/chat/v2] Bridge Error:", error);
        return NextResponse.json({ error: `Bridge internal error: ${error.message}` }, { status: 500 });
    }
}
