
import { PrismaClient } from '@prisma/client';
import { randomUUID } from 'crypto';

const prisma = new PrismaClient();

async function csoSync() {
    console.log("🛠️ [ZAP-CSO] Swarm Synchronization Initiated.");

    // 1. Reset existing QC status (Spike's automated work)
    console.log("🧹 Clearing legacy QC status for 99+ pages...");
    await prisma.extractionTicket.updateMany({
        where: {
            status: "M3_INJECTED"
        },
        data: {
            status: "DOM_RIPPED" // Resetting to post-rip, pre-injection stage
        }
    });

    // 2. Register and mark Metro Debug pages
    const debugPaths = [
        '/debug/metro',
        '/debug/metro/colors',
        '/debug/metro/typography'
    ];

    console.log("📍 Registering Metro Debug Suite in registry...");
    for (const path of debugPaths) {
        await prisma.extractionTicket.upsert({
            where: { urlPath: path },
            update: { status: "M3_INJECTED" },
            create: {
                urlPath: path,
                status: "M3_INJECTED",
                group: "Engine/Debug",
                zapLevel: "L7"
            }
        });

        await prisma.pageAudit.upsert({
            where: { path: path },
            update: {
                details: "QC: Header Only (MASP-72 Baseline Applied).",
                spacingApplied: true,
                colorsApplied: true
            },
            create: {
                path: path,
                details: "QC: Header Only (MASP-72 Baseline Applied).",
                spacingApplied: true,
                colorsApplied: true,
                universalId: randomUUID()
            }
        });
    }

    // 3. Seed PageAudit for remaining tickets
    console.log("🌱 Seeding PageAudit for all tickets...");
    const tickets = await prisma.extractionTicket.findMany();
    for (const ticket of tickets) {
        if (debugPaths.includes(ticket.urlPath)) continue;
        await prisma.pageAudit.upsert({
            where: { path: ticket.urlPath },
            update: {},
            create: {
                path: ticket.urlPath,
                details: "Pending Alpha/Beta Swarm Sync.",
                universalId: randomUUID()
            }
        });
    }

    console.log("✅ [ZAP-CSO] DB Synced. Swarm is clean.");
}

csoSync().catch(console.error).finally(() => prisma.$disconnect());
