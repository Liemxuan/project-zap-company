import { PrismaClient } from '@prisma/client';
import { AgentLoop } from '../agent.js';

const prisma = new PrismaClient();

async function assignJob() {
    console.log("🚀 [ZAP-OS] Registering autonomous Job Ticket for Spike...");

    const ticketId = `ZAP-SWARM-UI-${Date.now()}`;

    const ticket = await prisma.jobTicket.create({
        data: {
            ticketId: ticketId,
            level: 'L5', // Organism / Page Level
            scope: 'Swarm Dashboard L1-L7 Architecture UI Upgrades (Visualizing ZapLevel mappings)',
            manager: 'Spike',
            status: 'PENDING',
            targetBranch: 'main'
        }
    });

    console.log(`✅ [ZAP-OS] Job Ticket Assigned to SPike: ${ticket.ticketId}`);
    console.log(`   Scope: ${ticket.scope}`);

    console.log(`\n🤖 [ZAP-OS] Invoking Spike via Omni Router...`);

    const prompt = `
**Job Ticket ID:** ${ticket.ticketId}
**Assigned Agent:** Spike
**Role:** Primary Structural Builder
**Context:** We have successfully mapped all 94 Metronic routes to their ZAP Architectural Dependencies (L1-L7) and stored this in zap-claw.db (ExtractionTicket). The /api/swarm/route.ts endpoint has been updated to serialize these new JSON arrays (zapLevel, l5Organisms, l4Molecules, l3Atoms, l2Primitives, l1Tokens).

**Required Actions:**
1. Upgrade <SwarmDataGrid> in packages/zap-design/src/app/debug/swarm/page.tsx to handle the new JSON array column data.
2. Implement a sub-row expansion (or dialog/drawer) for each route in the Grid: When clicked, visually break down its specific architectural makeup (What L3 Atoms does it use? What L4 Molecules?).
3. Build a "Priority Extraction Widget" at the top of the /debug/swarm page: Sum the occurrences of each component across all 94 routes and list the Top 5 most urgently needed components (e.g., "Button is needed by 80 routes. Build this first.").

Execute and report status.
    `;

    const loop = new AgentLoop("tier_p3_heavy", "Spike");
    await loop.run(999, prompt);

    console.log(`\n✅ [ZAP-OS] Spike has completed the assignment.`);
}

assignJob()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    });
