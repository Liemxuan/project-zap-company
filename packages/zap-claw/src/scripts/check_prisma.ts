import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function check() {
    try {
        console.log("Checking Interaction fields...");
        // @ts-ignore
        const interaction = await prisma.interaction.findFirst();
        console.log("Interaction keys:", Object.keys(interaction || {}));

        console.log("Checking MemoryFact fields...");
        // @ts-ignore
        const fact = await prisma.memoryFact.findFirst();
        console.log("MemoryFact keys:", Object.keys(fact || {}));
    } catch (e: any) {
        console.error("Error:", e.message);
    } finally {
        await prisma.$disconnect();
    }
}

check();
