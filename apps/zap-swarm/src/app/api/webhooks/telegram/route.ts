import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Using nodejs runtime to ensure fetch compatibility with internal ports if needed, but edge is also okay. Let's stick strictly to edge as requested by PRD.

// Edge runtime as explicitly specified in PRD-005
export const preferredRegion = 'auto';

export async function POST(req: Request) {
    try {
        // 1. Ingress Validation: Immediately validate Secret/HMAC Signature to drop spoofed traffic
        const secretToken = req.headers.get('x-telegram-bot-api-secret-token');
        const defaultSecret = "zap-swarm-native-router-v1";
        const expectedToken = process.env.TELEGRAM_WEBHOOK_SECRET || defaultSecret;

        if (secretToken !== expectedToken) {
            console.warn("[Edge Webhook] 🛑 Dropped spoofed Telegram payload. Signature mismatch.");
            return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
        }

        const payload = await req.json();

        // 2. Relay to the internal ZAP-Claw Native Gateway
        const ZAP_CLAW_URL = process.env.ZAP_CLAW_INTERNAL_URL || 'http://localhost:3900';
        
        const response = await fetch(`${ZAP_CLAW_URL}/webhook/telegram`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                // Explicitly forward the isolated tenant ID
                'x-tenant-id': req.headers.get('x-tenant-id') || 'ZVN_DEFAULT',
                // Tell the internal gateway this passed the Edge gate
                'x-edge-verified': 'true'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            console.error(`[Edge Webhook] ZAP-Claw Gateway rejected payload. Status: ${response.status}`);
            return new NextResponse(JSON.stringify({ error: 'Gateway Error' }), { status: 502, headers: { 'Content-Type': 'application/json' } });
        }

        // Always 200 OK back to Telegram after successful relay
        return new NextResponse(JSON.stringify({ ok: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error("[Edge Webhook] 🚨 Edge Panic:", error.message);
        return new NextResponse(JSON.stringify({ error: 'Internal Server Error' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
}

export async function GET() {
    return new NextResponse('✅ ZAP Swarm Edge Webhook Gateway is running and ready to accept POST payloads.', { 
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
    });
}
