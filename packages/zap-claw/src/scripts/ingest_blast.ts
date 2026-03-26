import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting BLAST ingestion...");

    // Find the markdown file
    const docPath = '/Users/zap/Workspace/olympus/docs/localhost_3200_scan.md';

    if (!fs.existsSync(docPath)) {
        console.error(`ERROR: Could not find scan file at ${docPath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(docPath, 'utf-8');

    // Parse the markdown table
    const lines = content.split('\n');
    let inTable = false;
    let addedCount = 0;

    for (const line of lines) {
        if (line.trim().startsWith('| Link URL')) {
            inTable = true;
            continue;
        }
        if (line.trim().startsWith('| :---')) {
            continue; // Skip separator
        }

        if (inTable && line.trim().startsWith('|')) {
            // Extract using regex or split
            // Format: | [URL] | `Internal Route` | Group |
            const parts = line.split('|').map(s => s.trim());
            if (parts.length >= 4) {
                const urlRaw = parts[1]; // [http://localhost:3200/](http://localhost:3200/)
                const routeRaw = parts[2]; // `/`
                const groupRaw = parts[3]; // Root

                // Clean the route
                if (!routeRaw) continue;
                let routeMatch = routeRaw.match(/`([^`]+)`/);
                let route = routeMatch ? routeMatch[1] : routeRaw;

                // We use route as the primary key id
                if (route) {
                    try {
                        await prisma.extractionTicket.upsert({
                            where: { urlPath: route },
                            update: {
                                group: groupRaw || null,
                            },
                            create: {
                                urlPath: route,
                                group: groupRaw || null,
                                assignedWorker: null,
                                status: "PENDING",
                            }
                        });
                        addedCount++;
                    } catch (err) {
                        console.error(`Failed to insert ticket: ${route}`, err);
                    }
                }
            }
        }
    }

    console.log(`Successfully ingested and upserted ${addedCount} tickets from the scan report.`);
}

main()
    .then(async () => {
        await prisma.$disconnect()
    })
    .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
    })
