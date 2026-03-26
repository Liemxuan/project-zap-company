import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkJerry() {
    const interactions = await prisma.interaction.findMany({
        where: { accountType: { contains: 'Jerry' } },
        orderBy: { createdAt: 'desc' },
        take: 10
    });
    console.log(JSON.stringify(interactions, null, 2));
}

checkJerry().catch(console.error).finally(() => prisma.$disconnect());
