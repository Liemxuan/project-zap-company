import "dotenv/config";
import { PrismaClient } from '@prisma/client';
export const prisma = new PrismaClient();

// Handle process termination to close the DB cleanly
process.on('exit', async () => await prisma.$disconnect());
process.on('SIGHUP', async () => { await prisma.$disconnect(); process.exit(128 + 1); });
process.on('SIGINT', async () => { await prisma.$disconnect(); process.exit(128 + 2); });
process.on('SIGTERM', async () => { await prisma.$disconnect(); process.exit(128 + 15); });

// Core memory utility for Zap-Claw to quickly fetch recent interaction history
export async function getRecentInteractions(limit = 50) {
    return await prisma.interaction.findMany({
        take: limit,
        orderBy: { createdAt: 'desc' }
    });
}
