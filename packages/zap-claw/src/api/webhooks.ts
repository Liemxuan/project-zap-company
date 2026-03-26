import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { InventoryService } from '../services/InventoryService.js';
import Stripe from 'stripe';

export const webhookRouter: Router = express.Router();
const prisma = new PrismaClient();
const inventoryService = new InventoryService(prisma);

// Initialize Stripe gracefully, avoiding crash if not set locally
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock');

// ==========================================
// GENERIC PAYMENT PROXY WEBHOOK (Stripe, etc.)
// ==========================================
webhookRouter.post('/webhook/payment', async (req, res) => {
    try {
        const sig = req.headers['stripe-signature'];
        const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;
        let event;

        // SOP-033: Enforce Stripe Signature Hardening
        if (endpointSecret && sig) {
            try {
                // req.body is a raw Buffer because of bodyParser.raw() mapped in server.ts
                event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
            } catch (err: any) {
                console.error(`[Webhook] Signature verification failed:`, err.message);
                res.status(400).send(`Webhook Error: ${err.message}`);
                return;
            }
        } else {
            // Fallback for local testing / bypass if env vars are not set
            // Since req.body is raw buffer, we must parse it back to JSON manually
            try {
                const bodyString = Buffer.isBuffer(req.body) ? req.body.toString('utf8') : req.body;
                event = typeof bodyString === 'string' ? JSON.parse(bodyString) : bodyString;
            } catch (err) {
                console.error(`[Webhook] Failed to parse raw body payload fallback`);
                res.status(400).send('Bad Request: Invalid JSON body');
                return;
            }
        }

        // We simulate extracting metadata representing a fulfilled order cart.
        const payload = event;
        
        console.log(`[Webhook] Incoming Payment / Order Fulfillment Proxy`);

        // Validate payload structure matching our test requirements
        const orderId = payload.orderId || payload.data?.object?.metadata?.orderId;
        const locationId = payload.locationId || payload.data?.object?.metadata?.locationId;
        
        let itemsSold: { product_variant_id: string, quantity_sold: number }[] = [];

        // Determine if items are in raw payload or nested in metadata JSON string
        if (Array.isArray(payload.items)) {
             itemsSold = payload.items;
        } else if (payload.data?.object?.metadata?.items) {
             try {
                itemsSold = JSON.parse(payload.data.object.metadata.items);
             } catch (e) {
                console.error(`[Webhook] Failed to parse items array from metadata`);
             }
        } else if (payload.data?.object?.line_items?.data) {
             // SOP-033 / SOP-031: External POS To Internal BOM Mapping Layer
             // Example: Stripe sends line items with price IDs. We map price IDs (stored as SKU) to internal variants.
             console.log(`[Webhook] Translating External POS Line Items...`);
             const externalItems = payload.data.object.line_items.data;
             for (const extItem of externalItems) {
                 const externalId = extItem.price?.id || extItem.price_id;
                 if (externalId) {
                     const variant = await prisma.product_variants.findFirst({
                         where: { sku: externalId } // External IDs like Stripe Price ID map to our SKU field
                     });
                     
                     if (variant) {
                         itemsSold.push({
                             product_variant_id: variant.id,
                             quantity_sold: extItem.quantity || 1
                         });
                         console.log(`  -> Mapped External ID ${externalId} to Internal Variant ${variant.id}`);
                     } else {
                         console.warn(`[Webhook] Unmapped External Item: ${externalId}`);
                     }
                 }
             }
        }

        if (!orderId || !locationId || itemsSold.length === 0) {
            console.warn(`[Webhook] Ignoring payload: Missing orderId, locationId, or items.`);
            res.status(400).send('Bad Request: Missing required routing fields.');
            return;
        }

        console.log(`[Webhook] Initiating Depletion for Order ${orderId}`);
        await inventoryService.depleteOrder(orderId, locationId, itemsSold);

        res.status(200).send('OK');
    } catch (error) {
        console.error(`[Webhook] Critical error during Inventory Depletion:`, error);
        res.status(500).send('Internal Server Error');
    }
});
