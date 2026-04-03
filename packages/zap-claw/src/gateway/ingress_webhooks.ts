import { Router } from 'express';
import { AgentLoop } from '../agent.js';
import { MongoClient } from 'mongodb';
import crypto from 'crypto';

export const telemetryRouter: import("express").Router = Router();

// ==========================================
// PHASE 2 B.L.A.S.T: Proactive Telemetry Webhooks
// ==========================================
// Route allows external providers (Stripe, Shopify, GitHub) to directly trigger 
// the ZAP Swarm for proactive merchant alerting.
telemetryRouter.post('/api/telemetry/proactive/:provider/:tenantId', async (req, res) => {
    const { provider, tenantId } = req.params;
    
    // Fast ack to prevent webhook provider timeout
    res.status(200).send({ received: true });

    let alertMessage = "";

    try {
        // Standardize raw buffer if BodyParser bypassed it
        const payloadStr = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : JSON.stringify(req.body);
        const payload = typeof req.body === 'object' ? req.body : JSON.parse(payloadStr);

        // ==========================================
        // Security Gate: Webhook HMAC Verification
        // ==========================================
        if (provider.toLowerCase() === 'stripe') {
            const signature = req.headers['stripe-signature'];
            const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

            if (endpointSecret && signature) {
                try {
                    const parsedSig = (signature as string).split(',').reduce((acc, part) => {
                        const [key, value] = part.split('=');
                        if (key && value !== undefined) acc[key] = value;
                        return acc;
                    }, {} as Record<string, string>);

                    const signedPayload = `${parsedSig.t}.${payloadStr}`;
                    const expectedSignature = crypto
                        .createHmac('sha256', endpointSecret)
                        .update(signedPayload)
                        .digest('hex');

                    const receivedSig = parsedSig['v1'];
                    if (!receivedSig || receivedSig.length === 0) {
                        throw new Error("Missing v1 signature hash");
                    }

                    if (crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(receivedSig))) {
                        console.log(`[Security] Stripe HMAC Signature verified for ${tenantId}`);
                    } else {
                        throw new Error("Signature mismatch");
                    }
                } catch (err: any) {
                    console.error(`[Security Danger] Invalid Stripe Signature. Possible spoofing attack for ${tenantId}. Dropping payload.`);
                    return; // Abort processing since we already fast-acked 200
                }
            } else if (!endpointSecret) {
                console.warn(`[Security Warning] STRIPE_WEBHOOK_SECRET is missing. Bypassing validation (DEV ONLY).`);
            }
        }

        if (provider.toLowerCase() === 'stripe') {
            const type = payload.type;
            const amount = payload.data?.object?.amount ? (payload.data.object.amount / 100).toFixed(2) : 0;
            const currency = payload.data?.object?.currency ? payload.data.object.currency.toUpperCase() : "USD";
            const risk_level = payload.data?.object?.outcome?.risk_level || "normal";

            if (type === 'payment_intent.succeeded' || type === 'charge.succeeded') {
                alertMessage = `[SYSTEM EVENT: Proactive Hook] Stripe Payment Succeeded: ${amount} ${currency}. Risk Level: ${risk_level}. Evaluate if this requires merchant interruption.`;
            } else if (type === 'charge.dispute.created') {
                alertMessage = `🚨 [URGENT SYSTEM EVENT] Stripe Dispute Created for ${amount} ${currency}. Notify the merchant via default Slack channel immediately with Canvas action link to respond.`;
            } else {
                alertMessage = `[SYSTEM EVENT] Unclassified Stripe Webhook: ${type}`;
            }
        } else if (provider.toLowerCase() === 'shopify') {
            // Shopify webhook mapping logic
            alertMessage = `[SYSTEM EVENT: Proactive Hook] Shopify Order received.`;
        }

        if (alertMessage) {
            console.log(`[Proactive Telemetry] Dispatching Swarm Event for ${tenantId}: ${alertMessage}`);

            // Instantiate the Swarm Agent
            // 'tier_p0_fast' for instantaneous evaluation, 'tier_p3_heavy' if deep analysis is required.
            const loop = new AgentLoop("tier_p3_heavy", `AGENT-PROACTIVE-${tenantId}`);

            // Dispatch to the Agent cognitively. 
            // If the agent determines the event is worthy, it will invoke its egress tool (Slack/WhatsApp)  
            // and push the alert asynchronously.
            await loop.run(
                tenantId as any,
                alertMessage,
                "PROACTIVE_TELEMETRY", 
                undefined,
                (msg: string) => console.log(`[Proactive Agent Status] ${msg}`)
            );
        }

    } catch (err: any) {
        console.error(`[Proactive Telemetry] Exception during Swarm dispatch for ${provider}:`, err.message);
    }
});
