import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting ZAP-OS Pho24 Sample Seed...');

  // 1. Seed Internal Channels
  console.log('📦 Seeding Internal Channels...');
  const internalChannels = [
    { id: 1, channel_name: 'POS Terminal', hardware_form_factor: 'Landscape Tablet', is_active: true },
    { id: 2, channel_name: 'Associate Handheld', hardware_form_factor: 'Portrait Mobile', is_active: true },
    { id: 3, channel_name: 'Self-Service Kiosk', hardware_form_factor: 'Large Display Touch', is_active: true },
    { id: 4, channel_name: 'Web Storefront', hardware_form_factor: 'Responsive Web', is_active: true },
    { id: 5, channel_name: 'Native Brand App', hardware_form_factor: 'iOS/Android', is_active: true },
    { id: 6, channel_name: 'QR Code Table Menu', hardware_form_factor: 'Bring Your Own Device', is_active: true },
    { id: 7, channel_name: 'Call Center / Phone', hardware_form_factor: 'Agent Dashboard', is_active: true },
  ];

  for (const channel of internalChannels) {
    await prisma.internal_channels.upsert({
      where: { id: channel.id },
      update: channel,
      create: channel,
    });
  }

  // 2. Seed Marketplace Channels
  console.log('🛒 Seeding Marketplace Channels...');
  const marketplaceChannels = [
    { id: 0, marketplace_name: 'Not Applicable (Internal)', integration_type: 'System Default', is_active: true },
    { id: 1, marketplace_name: 'UberEats', integration_type: 'Webhook', is_active: true },
    { id: 2, marketplace_name: 'DoorDash', integration_type: 'Webhook', is_active: true },
    { id: 3, marketplace_name: 'ShopeeFood', integration_type: 'Polling API', is_active: true },
    { id: 4, marketplace_name: 'GrabFood', integration_type: 'Webhook', is_active: true },
    { id: 5, marketplace_name: 'Deliveroo', integration_type: 'Webhook', is_active: true },
    { id: 6, marketplace_name: 'Postmates', integration_type: 'Webhook', is_active: true },
    { id: 7, marketplace_name: 'Foodpanda', integration_type: 'Polling API', is_active: true },
    { id: 8, marketplace_name: 'ZaloPay Mini App', integration_type: 'Webhook', is_active: true },
  ];

  for (const channel of marketplaceChannels) {
    await prisma.marketplace_channels.upsert({
      where: { id: channel.id },
      update: channel,
      create: channel,
    });
  }

  // 3. Seed Payment Gateways
  console.log('💳 Seeding Payment Gateways...');
  const gateways = [
    { id: 1, gateway_name: 'Cash', tender_origin: 'Physical USD/VND', is_active: true },
    { id: 2, gateway_name: 'Square Terminal', tender_origin: 'Physical Card Present', is_active: true },
    { id: 3, gateway_name: 'Stripe Checkout', tender_origin: 'Card Not Present (Web)', is_active: true },
    { id: 4, gateway_name: 'MoMo QR', tender_origin: 'Digital Wallet', is_active: true },
    { id: 5, gateway_name: 'ZaloPay QR', tender_origin: 'Digital Wallet', is_active: true },
    { id: 6, gateway_name: 'VNPay', tender_origin: 'Digital Wallet', is_active: true },
    { id: 7, gateway_name: 'Apple Pay / Google Pay', tender_origin: 'Direct Digital Wallet', is_active: true },
  ];

  for (const gateway of gateways) {
    await prisma.payment_gateways.upsert({
      where: { id: gateway.id },
      update: gateway,
      create: gateway,
    });
  }

  // 4. Create Pho24 Tenant
  console.log('🍜 Creating Pho24 Tenant...');
  const pho24 = await prisma.tenants.upsert({
    where: { slug: 'pho24' },
    update: {},
    create: {
      name: 'Pho24',
      slug: 'pho24',
      email: 'admin@pho24.com.vn',
      sector: 'FOOD_AND_BEVERAGE', // Using the IndustrySector enum
      plan: 'enterprise',
    },
  });

  // 5. Create Sample Orders for Pho24 showing Compartmentalization
  console.log('🧾 Generating Sample Orders for Pho24...');
  
  // Clean up old sample orders for a fresh view
  await prisma.orders.deleteMany({
    where: { tenant_id: pho24.id }
  });

  // Example 1: Walk-in customer ordering on Kiosk, paying with Square Terminal
  await prisma.orders.create({
    data: {
      id: '00000000-0000-0000-0000-000000001001',
      tenant_id: pho24.id,
      internal_channel_id: 3, // Self-Service Kiosk
      marketplace_channel_id: 0, // Not Applicable
      payment_gateway_id: 2, // Square Terminal
      status: 'completed',
      fulfillment: 'delivered',
      dining_option: 'for_here',
      subtotal: 15.50,
      total: 16.50,
      notes: 'Sample Kiosk Order',
    }
  });

  // Example 2: Customer ordering on DoorDash, paid via Webhook (we don't get the money directly, but track it)
  await prisma.orders.create({
    data: {
      id: '00000000-0000-0000-0000-000000001002',
      tenant_id: pho24.id,
      internal_channel_id: null, // Marketplaces often bypass our internal POS channel entry
      marketplace_channel_id: 2, // DoorDash
      payment_gateway_id: 3, // Usually Stripe or direct Marketplace payout tracking
      status: 'completed',
      fulfillment: 'delivered',
      dining_option: 'delivery',
      subtotal: 22.00,
      total: 25.00,
      notes: 'Sample DoorDash Order',
    }
  });

  // Example 3: Customer ordering from table QR code, paying with Momo
  await prisma.orders.create({
    data: {
      id: '00000000-0000-0000-0000-000000001003',
      tenant_id: pho24.id,
      internal_channel_id: 6, // QR Code Table Menu
      marketplace_channel_id: 0, // Not Applicable
      payment_gateway_id: 4, // MoMo QR
      status: 'completed',
      fulfillment: 'delivered',
      dining_option: 'for_here',
      subtotal: 12.00,
      total: 12.00,
      notes: 'Sample QR Order',
    }
  });

  console.log('✅ Seeding complete!');
  console.log('Pho24 Tenant ID:', pho24.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
