import express, { Router } from 'express';
import { PrismaClient } from '@prisma/client';

export const inventoryRouter: Router = express.Router();
const prisma = new PrismaClient();

// ==========================================
// INVENTORY ADMIN UI ROUTES
// ==========================================

// GET Raw Ingredients
inventoryRouter.get('/api/inventory/items', async (req, res) => {
    const tenantId = req.query.tenant_id as string;
    
    if (!tenantId) {
        res.status(400).json({ error: "Missing tenant_id" });
        return;
    }

    try {
        const items = await prisma.raw_ingredients.findMany({
            where: { tenant_id: tenantId }
        });
        res.status(200).json(items);
    } catch (error) {
        console.error("[API Inventory Items] Fetch Error:", error);
        res.status(500).json({ error: "Internal Database Error" });
    }
});

// GET Vendors
inventoryRouter.get('/api/inventory/vendors', async (req, res) => {
    const tenantId = req.query.tenant_id as string;
    
    if (!tenantId) {
        res.status(400).json({ error: "Missing tenant_id" });
        return;
    }

    try {
        const vendors = await prisma.vendors.findMany({
            where: { tenant_id: tenantId, status: "active" },
            orderBy: { name: 'asc' }
        });
        res.status(200).json(vendors);
    } catch (error) {
        console.error("[API Vendors] Fetch Error:", error);
        res.status(500).json({ error: "Internal Database Error" });
    }
});

// GET Purchase Orders
inventoryRouter.get('/api/inventory/purchase-orders', async (req, res) => {
    const tenantId = req.query.tenant_id as string;
    const status = req.query.status as string;
    
    if (!tenantId) {
        res.status(400).json({ error: "Missing tenant_id" });
        return;
    }

    try {
        const whereClause: any = { tenant_id: tenantId };
        if (status) {
            whereClause.status = status;
        }

        const pos = await prisma.purchase_orders.findMany({
            where: whereClause,
            include: {
                vendor: true,
                items: {
                    include: {
                        raw_ingredient: true
                    }
                }
            },
            orderBy: { created_at: 'desc' }
        });
        res.status(200).json(pos);
    } catch (error) {
        console.error("[API POs] Fetch Error:", error);
        res.status(500).json({ error: "Internal Database Error" });
    }
});

// POST Create Purchase Order
inventoryRouter.post('/api/inventory/purchase-orders', async (req, res) => {
    const { tenant_id, vendor_id, location_id, total_amount, currency, notes, items } = req.body;

    if (!tenant_id || !vendor_id || !location_id || !Array.isArray(items) || items.length === 0) {
        res.status(400).json({ error: "Missing required fields or valid items array" });
        return;
    }

    try {
        const newPO = await prisma.purchase_orders.create({
            data: {
                tenant_id,
                vendor_id,
                location_id,
                total_amount: total_amount || 0,
                currency: currency || "USD",
                notes,
                status: "submitted",
                items: {
                    create: items.map(item => ({
                        raw_ingredient_id: item.raw_ingredient_id,
                        quantity_ordered: item.quantity_ordered,
                        unit_price: item.unit_price || 0,
                        total_price: item.total_price || 0
                    }))
                }
            },
            include: { items: true }
        });
        res.status(201).json(newPO);
    } catch (error) {
        console.error("[API POs] Create Error:", error);
        res.status(500).json({ error: "Internal Database Error" });
    }
});

// POST Create new Raw Ingredient
inventoryRouter.post('/api/inventory/items', async (req, res) => {
    const { tenant_id, name, base_unit_measure, current_cost, yield_percentage } = req.body;

    if (!tenant_id || !name || !base_unit_measure) {
        res.status(400).json({ error: "Missing required fields" });
        return;
    }

    try {
        const newItem = await prisma.raw_ingredients.create({
            data: {
                tenant_id,
                name,
                base_unit_measure,
                current_cost,
                yield_percentage
            }
        });
        res.status(201).json(newItem);
    } catch (error) {
        console.error("[API Inventory Items] Create Error:", error);
        res.status(500).json({ error: "Internal Database Error" });
    }
});

// POST Receive Goods (Positive Movement)
inventoryRouter.post('/api/inventory/receive', async (req, res) => {
    const { tenant_id, location_id, purchase_order_id, reference_id, notes, items } = req.body;

    if (!tenant_id || !location_id || !Array.isArray(items)) {
        res.status(400).json({ error: "Missing required fields or invalid items array." });
        return;
    }

    try {
        let poReceiptId: string | null = null;
        let finalReferenceId = reference_id || `PO-${purchase_order_id || Date.now()}`;

        // If receiving against a PO, create a receipt record first
        if (purchase_order_id) {
            const receipt = await prisma.purchase_order_receipts.create({
                data: {
                    tenant_id,
                    purchase_order_id,
                    receipt_number: `REC-${Date.now()}`,
                    notes: notes || null
                }
            });
            poReceiptId = receipt.id;
            finalReferenceId = receipt.receipt_number;
        }

        for (const item of items) {
            const qty = Math.abs(Number(item.quantity)); // Force positive
            if (isNaN(qty) || qty === 0) continue;

            // Log event
            await prisma.inventory_movements.create({
                data: {
                    tenant_id,
                    raw_ingredient_id: item.raw_ingredient_id,
                    location_id: Number(location_id),
                    adjustment_unit: qty,
                    movement_reason: 'RECEIVE_PO',
                    reference_id: finalReferenceId,
                    purchase_order_id: purchase_order_id || null, // Link directly to PO if provided
                    purchase_order_receipt_id: poReceiptId // Link directly to the specific receipt instance
                }
            });

            // Upsert State Ledger
            await prisma.inventory_counts.upsert({
                where: {
                    raw_ingredient_id_location_id: {
                        raw_ingredient_id: item.raw_ingredient_id,
                        location_id: Number(location_id)
                    }
                },
                update: {
                    quantity_on_hand: { increment: qty }
                },
                create: {
                    tenant_id,
                    raw_ingredient_id: item.raw_ingredient_id,
                    location_id: Number(location_id),
                    quantity_on_hand: qty
                }
            });

            // Update PO Item quantities if linked to a Purchase Order
            if (purchase_order_id) {
                const poItem = await prisma.purchase_order_items.findUnique({
                    where: { purchase_order_id_raw_ingredient_id: { purchase_order_id, raw_ingredient_id: item.raw_ingredient_id } }
                });

                if (poItem) {
                    await prisma.purchase_order_items.update({
                        where: { id: poItem.id },
                        data: { quantity_received: { increment: qty } }
                    });
                }
            }
        }

        // Post-processing: Evaluate Overall PO Status specifically for Partial logic
        if (purchase_order_id) {
            const updatedItems = await prisma.purchase_order_items.findMany({
                where: { purchase_order_id }
            });

            const fullyReceived = updatedItems.every((item: any) => 
                Number(item.quantity_received) >= Number(item.quantity_ordered)
            );

            await prisma.purchase_orders.update({
                where: { id: purchase_order_id },
                data: { status: fullyReceived ? "completed" : "partial" }
            });
        }

        res.status(200).json({ success: true, message: "Goods Received successfully." });
    } catch (error) {
        console.error("[API Inventory Receive] Error:", error);
        res.status(500).json({ error: "Failed to process receipt" });
    }
});

// POST Log Waste (Negative Movement)
inventoryRouter.post('/api/inventory/waste', async (req, res) => {
    const { tenant_id, location_id, reference_id, items } = req.body;

    if (!tenant_id || !location_id || !Array.isArray(items)) {
        res.status(400).json({ error: "Missing required fields or invalid items array." });
        return;
    }

    try {
        for (const item of items) {
            const qty = -Math.abs(Number(item.quantity)); // Force negative
            if (isNaN(qty) || qty === 0) continue;

            // Log event
            await prisma.inventory_movements.create({
                data: {
                    tenant_id,
                    raw_ingredient_id: item.raw_ingredient_id,
                    location_id: Number(location_id),
                    adjustment_unit: qty,
                    movement_reason: 'WASTE',
                    reference_id: reference_id || `WST-${Date.now()}`
                }
            });

            // Upsert State Ledger
            await prisma.inventory_counts.upsert({
                where: {
                    raw_ingredient_id_location_id: {
                        raw_ingredient_id: item.raw_ingredient_id,
                        location_id: Number(location_id)
                    }
                },
                update: {
                    quantity_on_hand: { decrement: Math.abs(qty) }
                },
                create: {
                    tenant_id,
                    raw_ingredient_id: item.raw_ingredient_id,
                    location_id: Number(location_id),
                    quantity_on_hand: qty // Result gets negative
                }
            });
        }
        res.status(200).json({ success: true, message: "Waste logged successfully." });
    } catch (error) {
        console.error("[API Inventory Waste] Error:", error);
        res.status(500).json({ error: "Failed to process waste" });
    }
});
