import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Locking highly sensitive core assets...");

    // Update assets that contain flags, app or brand logos from being overwritten
    const result = await prisma.assetTicket.updateMany({
        where: {
            OR: [
                { filePath: { contains: 'flags' } },
                { filePath: { contains: 'brand-logos' } },
                { filePath: { contains: 'app' } }
            ]
        },
        data: {
            isLocked: true
        }
    });

    console.log(`✅ Successfully locked ${result.count} core system asset records.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
