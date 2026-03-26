import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Seeding Pho24 Inventory Data...')

  // 1. Get the Demo Merchant (Pho24)
  const tenant = await prisma.tenants.findFirst({
    where: { name: 'Pho24' }
  })

  if (!tenant) {
    throw new Error('Pho24 Tenant not found. Run base seed first.')
  }

  // 2. Define Raw Ingredients (The basic building blocks for BOM)
  const ingredientsData = [
    { name: 'Beef Bones', base_unit_measure: 'lb', current_cost: 2.50, yield_percentage: 95.0 },
    { name: 'Ribeye (Thin Sliced)', base_unit_measure: 'oz', current_cost: 0.85, yield_percentage: 100.0 },
    { name: 'Rice Noodles', base_unit_measure: 'lb', current_cost: 1.20, yield_percentage: 100.0 },
    { name: 'Bean Sprouts', base_unit_measure: 'oz', current_cost: 0.10, yield_percentage: 90.0 },
    { name: 'Thai Basil', base_unit_measure: 'oz', current_cost: 0.15, yield_percentage: 85.0 },
    { name: 'Coca-Cola (Can)', base_unit_measure: 'can', current_cost: 0.45, yield_percentage: 100.0 }
  ]

  console.log('Inserting Raw Ingredients...')
  const createdIngredients = []
  for (const item of ingredientsData) {
    const rawIng = await prisma.raw_ingredients.create({
      data: {
        tenant_id: tenant.id,
        name: item.name,
        base_unit_measure: item.base_unit_measure,
        current_cost: item.current_cost,
        yield_percentage: item.yield_percentage
      }
    })
    createdIngredients.push(rawIng)
  }

  // Helper function to get an ingredient by name
  const getIng = (name: string) => createdIngredients.find(i => i.name === name)!

  // 3. Define the Locations (Need at least one generic one if not formally built out)
  // Assuming a generic store location for now. We create a pseudo-location string for the ledger.
  // We'll use the Tenant ID itself as the pseudo-location for now until locations are built.
  const mainLocationId = tenant.id 

  // 4. Initial Inventory Receipt (Moving stock INTO the store)
  console.log('Logging Initial Inventory Receipts...')
  for (const ing of createdIngredients) {
    // Let's say we receive an initial batch of everything
    const qtyReceived = ing.base_unit_measure === 'can' ? 240 : 100 // 240 cans, 100 lbs/oz
    
    await prisma.inventory_movements.create({
      data: {
        tenant_id: tenant.id,
        raw_ingredient_id: ing.id,
        location_id: mainLocationId,
        adjustment_unit: qtyReceived,
        movement_reason: 'INITIAL_RECEIPT',
        reference_id: 'PO-0001'
      }
    })

    // Update the State Ledger (counts)
    await prisma.inventory_counts.upsert({
      where: {
        idx_inv_counts_unique_loc: {
          raw_ingredient_id: ing.id,
          location_id: mainLocationId
        }
      },
      update: {
        quantity_on_hand: { increment: qtyReceived },
        quantity_warning: 20 // Warn at 20 units
      },
      create: {
        tenant_id: tenant.id,
        raw_ingredient_id: ing.id,
        location_id: mainLocationId,
        quantity_on_hand: qtyReceived,
        quantity_warning: 20
      }
    })
  }


  // 5. Fetch existing Products to map BOMs to their Variants
  const phos = await prisma.products.findMany({
    where: { tenant_id: tenant.id, name: { contains: 'Pho' } },
    include: { product_variants: true }
  })
  
  const sodas = await prisma.products.findMany({
    where: { tenant_id: tenant.id, name: { contains: 'Soda' } },
    include: { product_variants: true }
  })

  // 6. Tie the BOMs to the Variants!
  console.log('Mapping BOM Recipes...')

  // Map the Classic Pho (Large variant if exists, else the first one)
  for (const p of phos) {
    if (p.product_variants.length > 0) {
      const variant = p.product_variants[0] // Just grabbing default variant

      // Pho takes Noodles, Ribeye, Bones (for broth), and garnish
      await prisma.bom_recipes.createMany({
        data: [
          { tenant_id: tenant.id, product_variant_id: variant.id, raw_ingredient_id: getIng('Rice Noodles').id, quantity_needed: 0.5, unit_of_measure: 'lb' },
          { tenant_id: tenant.id, product_variant_id: variant.id, raw_ingredient_id: getIng('Ribeye (Thin Sliced)').id, quantity_needed: 4.0, unit_of_measure: 'oz' },
          { tenant_id: tenant.id, product_variant_id: variant.id, raw_ingredient_id: getIng('Beef Bones').id, quantity_needed: 0.25, unit_of_measure: 'lb' },
          { tenant_id: tenant.id, product_variant_id: variant.id, raw_ingredient_id: getIng('Bean Sprouts').id, quantity_needed: 1.0, unit_of_measure: 'oz' },
          { tenant_id: tenant.id, product_variant_id: variant.id, raw_ingredient_id: getIng('Thai Basil').id, quantity_needed: 0.5, unit_of_measure: 'oz' },
        ],
        skipDuplicates: true
      })
    }
  }

  // Map the Coke Can (1:1 relationship, but still needs a BOM if we are STRICT tracking)
  for (const soda of sodas) {
      if (soda.product_variants.length > 0) {
          const variant = soda.product_variants[0]
          await prisma.bom_recipes.create({
              data: {
                  tenant_id: tenant.id,
                  product_variant_id: variant.id,
                  raw_ingredient_id: getIng('Coca-Cola (Can)').id,
                  quantity_needed: 1.0, 
                  unit_of_measure: 'can' 
              }
          })
      }
  }

  console.log('Pho24 Inventory Seeding Complete.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
