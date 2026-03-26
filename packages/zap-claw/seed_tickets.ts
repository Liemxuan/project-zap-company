import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
    const targets = [
        { url: '/network/user-cards/mini-cards', group: 'Network' },
        { url: '/account/home/settings-plain', group: 'Account' },
        { url: '/user-management/permissions', group: 'User Management' }
    ];

    for (const t of targets) {
        await prisma.extractionTicket.upsert({
            where: { urlPath: t.url },
            update: { status: 'PENDING' },
            create: { urlPath: t.url, status: 'PENDING', group: t.group }
        });
        console.log(`Queued: ${t.url}`);
    }
}
main().catch(console.error).finally(() => prisma.$disconnect());
