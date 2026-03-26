import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log(`[SEED] Purging existing omnichannel data...`);
    await prisma.pricing_rules.deleteMany();
    await prisma.pre_modifiers.deleteMany();
    await prisma.menu_presentations.deleteMany();
    await prisma.category_modifiers.deleteMany();
    await prisma.modifier_options.deleteMany();
    await prisma.modifier_lists.deleteMany();
    await prisma.product_variants.deleteMany();
    await prisma.products.deleteMany();
    await prisma.product_categories.deleteMany();
    
    // Check if the base tenant exists from the MongoDB side, but in Postgres we might need to recreate the shell
    // We will just upsert the shell for PHO24.
    const tenantId = 'PHO24';
    
    console.log(`[SEED] Upserting PHO24 Tenant in PostgreSQL...`);
    const tenant = await prisma.tenants.upsert({
        where: { slug: tenantId },
        update: {},
        create: {
            name: 'Pho24',
            slug: tenantId,
            email: 'hello@pho24.com',
            sector: 'FOOD_AND_BEVERAGE',
            plan: 'enterprise'
        }
    });

    console.log(`[SEED] Creating Nested Categories (Toast-style hierarchy)...`);
    const foodCat = await prisma.product_categories.create({
        data: { tenant_id: tenant.id, name: 'Food' }
    });
    const drinksCat = await prisma.product_categories.create({
        data: { tenant_id: tenant.id, name: 'Drinks & Beverages' }
    });
    
    // Nested Category
    const phoCat = await prisma.product_categories.create({
        data: { tenant_id: tenant.id, name: 'Phở & Noodles', parent_id: foodCat.id }
    });

    console.log(`[SEED] Creating Pre-Modifiers (Operational Instructions)...`);
    await prisma.pre_modifiers.createMany({
        data: [
            { tenant_id: tenant.id, name: 'Extra' },
            { tenant_id: tenant.id, name: 'No' },
            { tenant_id: tenant.id, name: 'Side of' },
            { tenant_id: tenant.id, name: 'Lite' }
        ]
    });

    console.log(`[SEED] Creating Pricing Rules...`);
    const happyHour = await prisma.pricing_rules.create({
        data: {
            tenant_id: tenant.id,
            name: 'Happy Hour Coffee 50% Off',
            type: 'promotional',
            metadata: {
                discountType: 'percentage',
                discountValue: 50,
                activeSchedule: { days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], time: { start: '14:00', end: '17:00' } }
            }
        }
    });

    console.log(`[SEED] Creating Modifier Lists (The F&B constraints)...`);
    const extraMeatList = await prisma.modifier_lists.create({
        data: { tenant_id: tenant.id, name: 'Extra Meats', min_allowed: 0, max_allowed: 3, max_per_option: 1 } // Toast gap: cannot order more than 1 of the same extra meat
    });
    const garnishList = await prisma.modifier_lists.create({
        data: { tenant_id: tenant.id, name: 'Garnishes (Free)', min_allowed: 0, max_allowed: 5, max_per_option: 1 }
    });
    const tempList = await prisma.modifier_lists.create({
        data: { tenant_id: tenant.id, name: 'Temperature', min_allowed: 1, max_allowed: 1, max_per_option: 1 } // Forced choice for drinks
    });

    console.log(`[SEED] Creating Modifier Options...`);
    await prisma.modifier_options.createMany({
        data: [
            // Extra Meats
            { tenant_id: tenant.id, modifier_list_id: extraMeatList.id, name: 'Extra Beef Brisket', price_override: 20000 },
            { tenant_id: tenant.id, modifier_list_id: extraMeatList.id, name: 'Extra Meatballs', price_override: 15000 },
            { tenant_id: tenant.id, modifier_list_id: extraMeatList.id, name: 'Extra Tendon', price_override: 25000 },
            
            // Garnishes
            { tenant_id: tenant.id, modifier_list_id: garnishList.id, name: 'Extra Bean Sprouts', price_override: 0 },
            { tenant_id: tenant.id, modifier_list_id: garnishList.id, name: 'Extra Basil & Mint', price_override: 0 },
            { tenant_id: tenant.id, modifier_list_id: garnishList.id, name: 'No Onions', price_override: 0 },
            
            // Temperature 
            { tenant_id: tenant.id, modifier_list_id: tempList.id, name: 'Hot', price_override: 0 },
            { tenant_id: tenant.id, modifier_list_id: tempList.id, name: 'Iced', price_override: 0 },
        ]
    });

    console.log(`[SEED] Linking Modifiers to Categories (Toast-style Inheritance)...`);
    await prisma.category_modifiers.createMany({
        data: [
            { category_id: phoCat.id, modifier_list_id: extraMeatList.id },
            { category_id: phoCat.id, modifier_list_id: garnishList.id },
            { category_id: drinksCat.id, modifier_list_id: tempList.id }
        ]
    });

    console.log(`[SEED] Creating Products (Pure Metadata Wrappers with KDS routing)...`);
    
    // Assume KDS UUIDs (Routing destinations in Kitchen)
    const hotStationId = '5a87fbab-8386-444f-b677-74be34d58897';
    const barStationId = '6fac2c49-014c-4235-86f2-a270af906ac6';

    const phoBoProduct = await prisma.products.create({
        data: {
            tenant_id: tenant.id,
            category_id: phoCat.id, // Linked to the nested category
            name: 'Phở Bò (Beef Pho)',
            description: 'Classic Vietnamese beef noodle soup with slow-cooked broth.',
            prep_station_id: hotStationId, // Toast gap: routes ticket to Hot Kitchen
            allergens: ['Soy', 'Fish', 'Gluten'],
            nutritional_info: { calories: 450, protein: 35, carbs: 60, fat: 12 }
        }
    });

    const caPheDaProduct = await prisma.products.create({
        data: {
            tenant_id: tenant.id,
            category_id: drinksCat.id,
            name: 'Cà Phê Sữa',
            description: 'Traditional Vietnamese sweet milk coffee.',
            prep_station_id: barStationId, // Toast gap: routes ticket to Bar/Drink station
            allergens: ['Dairy'],
            nutritional_info: { calories: 250, sugar: 40 }
        }
    });

    console.log(`[SEED] Creating Product Variants (The STRICT Transactable SKUs)...`);
    await prisma.product_variants.createMany({
        data: [
            // Pho Bo - Sizes (Exclude tax to match VN typical pricing standard for food)
            { tenant_id: tenant.id, product_id: phoBoProduct.id, name: 'Regular (Tô Thường)', sku: 'PHO-BO-REG', price: 65000, inventory_count: 500, is_default: true, tax_included: false },
            { tenant_id: tenant.id, product_id: phoBoProduct.id, name: 'Large (Tô Lớn)', sku: 'PHO-BO-LRG', price: 85000, inventory_count: 500, tax_included: false },
            { tenant_id: tenant.id, product_id: phoBoProduct.id, name: 'Kids Portion', sku: 'PHO-BO-KID', price: 45000, inventory_count: 500, tax_included: false },

            // Coffee (Tax inclusive for grab-and-go speed)
            { tenant_id: tenant.id, product_id: caPheDaProduct.id, name: 'Standard Cup', sku: 'CF-SUA', price: 35000, inventory_count: 1000, is_default: true, tax_included: true },
        ]
    });

    console.log(`[SEED] Creating Menu Presentations (Publishing/Routing Layer)...`);
    await prisma.menu_presentations.create({
        data: {
            tenant_id: tenant.id,
            name: 'Main Dining In Menu',
            availability_schedule: { // Toast gap: Schedule
                daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                startTime: '06:00',
                endTime: '22:00'
            },
            metadata: {
                channels: ["Table Ordering System", "POS"], // Internal DINE-IN channels
                visibleCategoryIds: [phoCat.id, drinksCat.id]
            }
        }
    });
    
    await prisma.menu_presentations.create({
        data: {
            tenant_id: tenant.id,
            name: 'UberEats Delivery Menu',
            availability_schedule: {
                daysOfWeek: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                startTime: '07:00',
                endTime: '21:00'
            },
            metadata: {
                channels: ["Grab, UberEats, DoorDash, etc."], // External API integration
                visibleCategoryIds: [phoCat.id, drinksCat.id],
                priceMarkupMode: "FIXED_PERCENTAGE",
                markupValue: 15 // 15% markup on variants for delivery
            }
        }
    });

    console.log(`\n[SEED COMPLETE] PHO24 Omnichannel Schema successfully primed.`);
}

main()
    .catch(e => { console.error(e); process.exit(1); })
    .finally(() => prisma.$disconnect());
