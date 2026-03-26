import { PrismaClient } from '@prisma/client';

export class InventoryService {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Evaluates an array of sold variant IDs and dynamically depletes 
   * the physical inventory based on their BOM mappings.
   */
  async depleteOrder(orderId: string, locationId: string, items: { product_variant_id: string, quantity_sold: number }[]) {
    console.log(`[InventoryService] Intercepting Order: ${orderId} for Depletion`);

    for (const item of items) {
      // 1. Fetch the BOM Mapping for this Variant (Enforcing Tracking Rules)
      const boms = await this.prisma.bom_recipes.findMany({
        where: { product_variant_id: item.product_variant_id }
      });

      // SOP-031 Bypass: If no BOMs exist, this variant is NOT tracked. Skip to next item.
      if (boms.length === 0) {
        console.log(`  -> Variant ${item.product_variant_id} is UNTRACKED (No BOM). Skipping physical depletion.`);
        continue;
      }

      console.log(`  -> Variant ${item.product_variant_id} is TRACKED. Depleting ${boms.length} raw components...`);

      // 2. Iterate through the mapped Raw Ingredients and apply Double-Entry Mathematics
      for (const bom of boms) {
        // bom.quantity_needed is a Decimal. We convert it to a float for math, then it gets stored back as Decimal
        const totalDepletion = Number(bom.quantity_needed) * item.quantity_sold;

        // A. Write to the Event Ledger (Immutable double-entry)
        await this.prisma.inventory_movements.create({
          data: {
            tenant_id: bom.tenant_id,
            raw_ingredient_id: bom.raw_ingredient_id,
            location_id: Number(locationId),
            adjustment_unit: -totalDepletion, // Negative for sale
            movement_reason: 'SALE',
            reference_id: orderId
          }
        });

        // B. Recalculate the State Ledger (Quantity on Hand)
        // Here we just decrement, but true state ledgers might sum all movements occasionally to self-heal.
        // For line-speed performance, decrementing the cached state ledger is standard.
        await this.prisma.inventory_counts.upsert({
          where: {
            raw_ingredient_id_location_id: {
              raw_ingredient_id: bom.raw_ingredient_id,
              location_id: Number(locationId)
            }
          },
          update: {
            quantity_on_hand: { decrement: totalDepletion }
          },
          create: {
             tenant_id: bom.tenant_id,
             raw_ingredient_id: bom.raw_ingredient_id,
             location_id: Number(locationId),
             quantity_on_hand: -totalDepletion // Sold something we didn't receive yet (Negative Theoretical concept)
          }
        });

        console.log(`     [-] Depleted ${totalDepletion} ${bom.unit_of_measure} of Raw Ingredient ID: ${bom.raw_ingredient_id}`);
      }
    }

    console.log(`[InventoryService] Order ${orderId} Depletion Complete.`);
  }
}
