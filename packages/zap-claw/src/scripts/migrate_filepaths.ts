import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    console.log("Migrating file paths into filePathB...");
    const tickets = await prisma.assetTicket.findMany();

    let count = 0;
    for (const ticket of tickets) {
        await prisma.assetTicket.update({
            where: { filePath: ticket.filePath },
            data: { filePathB: ticket.filePath }
        });
        count++;
        if (count % 100 === 0) console.log(`Migrated ${count} records...`);
    }
    console.log(`✅ Successfully mapped filePath to filePathB for ${count} records.`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
