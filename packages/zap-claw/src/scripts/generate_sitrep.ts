import { prisma } from "../db/client.js";
import * as fs from "fs";
import * as path from "path";

async function generateSitrep() {
    console.log("📊 [sitrep] Generating OLYMPUS System Builder SITREP...");

    // 1. Fetch Architectural Decisions and Milestones extracted by Ralph
    const facts = await prisma.memoryFact.findMany({
        where: {
            OR: [
                { factType: "ARCHITECTURAL_DECISION" },
                { factType: "MILESTONE" },
                { fact: { contains: "Olympus" } }
            ]
        },
        orderBy: { createdAt: "desc" },
        take: 20
    });

    if (facts.length === 0) {
        console.log("⚠️ [sitrep] No specialized architectural facts found in memory.");
        return;
    }

    // 2. Format the SITREP
    let sitrep = `# OLYMPUS System Builder SITREP\n\n`;
    sitrep += `**Generated:** ${new Date().toISOString()}\n\n`;

    sitrep += `## Architectural Derivations\n`;
    for (const f of facts) {
        sitrep += `- [${f.factType}] ${f.fact}\n`;
    }

    sitrep += `\n---\n*Note: This SITREP is derived from autonomous Ralph extraction across the OLYMPUS War Room channels.*`;

    // 3. Write to docs
    const sitrepPath = path.resolve(process.cwd(), "docs/OLYMPUS_SITREP.md");
    fs.writeFileSync(sitrepPath, sitrep);

    console.log(`✅ [sitrep] SITREP updated at ${sitrepPath}`);
}

generateSitrep().catch(console.error).finally(() => prisma.$disconnect());
