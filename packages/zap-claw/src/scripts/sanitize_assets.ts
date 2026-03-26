import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();
// Public directory where the assets live
const METRONIC_PUBLIC_DIR = path.resolve('/Users/zap/Workspace/references/metronic/metronic-tailwind-react-demos/typescript/nextjs/public');

// The new theme folder to hold the generic assets
const OUTPUT_THEME_DIR = 'theme-retro';
const THEME_ABSOLUTE_DIR = path.join(METRONIC_PUBLIC_DIR, 'media', OUTPUT_THEME_DIR);

function generateGenericName(ext: string): string {
    const hash = randomBytes(4).toString('hex');
    return `asset_${hash}${ext}`;
}

async function main() {
    console.log("⚡️ [ASSET SANITIZER] Booting up Post-Verification Sanitization Script...");

    // Create the new theme directory if it doesn't exist
    if (!fs.existsSync(THEME_ABSOLUTE_DIR)) {
        fs.mkdirSync(THEME_ABSOLUTE_DIR, { recursive: true });
        console.log(`📁 Created theme directory at: ${THEME_ABSOLUTE_DIR}`);
    }

    const tickets = await prisma.assetTicket.findMany({
        where: { status: 'SWAPPED' },
    });

    if (tickets.length === 0) {
        console.log("⚠️ No 'SWAPPED' assets found. The generation swarm may still be running.");
        return;
    }

    console.log(`🎯 Found ${tickets.length} assets ready for sanitization & renaming.`);

    let sanitizedCount = 0;
    const mapping: Record<string, string> = {};

    for (const ticket of tickets) {
        const ext = path.extname(ticket.filePath);
        const originalAbsolutePath = path.join(METRONIC_PUBLIC_DIR, ticket.filePath);

        // If the file doesn't exist at the original location, skip
        if (!fs.existsSync(originalAbsolutePath)) {
            console.warn(`[WARNING] Source file not found, skipping: ${originalAbsolutePath}`);
            continue;
        }

        const newFileName = generateGenericName(ext);
        const newFilePathRelative = `/media/${OUTPUT_THEME_DIR}/${newFileName}`;
        const newAbsolutePath = path.join(METRONIC_PUBLIC_DIR, newFilePathRelative);

        // Rename (move) the file to the new theme directory
        try {
            fs.renameSync(originalAbsolutePath, newAbsolutePath);

            // Update the database ticket
            await prisma.assetTicket.update({
                where: { filePath: ticket.filePath },
                data: {
                    filePathB: newFileName,
                    status: 'PURGED' // Custom status indicating it has been genericized
                }
            });

            mapping[ticket.filePath] = newFilePathRelative;
            sanitizedCount++;
            console.log(`✅ [OBLITERATED]: ${ticket.filePath} -> ${newFilePathRelative}`);
        } catch (error) {
            console.error(`❌ Failed to rename ${ticket.filePath}:`, error);
        }
    }

    // Re-fetch all PURGED tickets to ensure the mapping file is always a complete source of truth
    const purgedTickets = await prisma.assetTicket.findMany({
        where: { status: 'PURGED' },
    });
    for (const pt of purgedTickets) {
        if (pt.filePathB) {
            mapping[pt.filePath] = `/media/${OUTPUT_THEME_DIR}/${pt.filePathB}`;
        }
    }

    // Export the mapping to a JSON file so we can run a Find & Replace script on the codebase later
    const mappingFile = path.resolve('./data/asset_mapping.json');
    fs.writeFileSync(mappingFile, JSON.stringify(mapping, null, 2));

    console.log(`\n🎉 [ASSET SANITIZER] Complete. Sanitized ${sanitizedCount} assets.`);
    console.log(`🗺️  Asset Mapping file saved to: ${mappingFile}`);
    console.log(`➡️  Next Step: Use the mapping file to run a global search/replace across the extracted React components to link to the new generic descriptors.`);
}

main().catch(console.error);
