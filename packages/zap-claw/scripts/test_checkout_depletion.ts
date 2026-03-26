import { PrismaClient } from '@prisma/client'
import { InventoryService } from '../src/services/InventoryService'

const prisma = new PrismaClient()
const inventoryService = new InventoryService(prisma)

async function main() {
  console.log('--- ZAP-OS Inventory Interception Test ---')

  // 1. Get Pho24
  const tenant = await prisma.tenants.findFirst({ where: { name: 'Pho24' } })
  if (!tenant) throw new Error('Pho24 Tenant not found.')
  
  const locationId = tenant.id // Using tenant id as pseudo-location

  // 2. Mock a POS ring: 2x Pho Bowls, 1x Coke Can
  // Fetch variants to get their IDs
  const pho = await prisma.products.findFirst({
      where: { tenant_id: tenant.id, name: { contains: 'Pho' } },
      include: { product_variants: true }
  })
  const soda = await prisma.products.findFirst({
      where: { tenant_id: tenant.id, name: { contains: 'Soda' } },
      include: { product_variants: true }
  })
  
  if (!pho || !pho.product_variants.length || !soda || !soda.product_variants.length) {
      throw new Error("Missing Products for testing.")
  }

  const phoVariantId = pho.product_variants[0].id
  const sodaVariantId = soda.product_variants[0].id

  // Create a mock Order ID
  const mockOrderId = `ORD-TEST-${Date.now()}`

  const itemsSold = [
      { product_variant_id: phoVariantId, quantity_sold: 2 },
      { product_variant_id: sodaVariantId, quantity_sold: 1 }
  ]

  console.log(`[POS] Order ${mockOrderId} Placed: 2x Pho, 1x Coke`)

  // 3. Trigger the Service
  await inventoryService.depleteOrder(mockOrderId, locationId, itemsSold)

  // 4. Verification Check
  console.log('\n--- VERIFICATION: Checking Event Ledger ---')
  const movements = await prisma.inventory_movements.findMany({
      where: { reference_id: mockOrderId },
      include: { raw_ingredient: true }
  })

  movements.forEach(m => {
      console.log(`  LOGGED: ${m.movement_reason} | ${m.adjustment_unit} ${m.raw_ingredient.base_unit_measure} of ${m.raw_ingredient.name}`)
  })
  
  if (movements.length > 0) {
      console.log('\n✅ Depletion Interception SUCCESSFUL')
  } else {
      console.log('\n❌ FAILED: No movements logged.')
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
