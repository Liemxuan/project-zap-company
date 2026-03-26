import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Clearing trackingId for all AssetTicket records...");

    // Update all records to set trackingId to null
    const result = await prisma.assetTicket.updateMany({
        data: {
            trackingId: null
        }
    });

    console.log(`✅ Successfully cleared trackingId for ${result.count} records.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
