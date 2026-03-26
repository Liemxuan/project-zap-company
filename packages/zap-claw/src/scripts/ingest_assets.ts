import { config } from "dotenv";
import { PrismaClient } from '@prisma/client';
import fs from 'fs';
import path from 'path';

config();

const prisma = new PrismaClient();

async function main() {
    const manifestPath = '/Users/zap/Workspace/olympus/packages/zap-claw/src/scripts/asset_manifest.txt';
    console.log(`📦 [INGEST] Targeting Asset Manifest: ${manifestPath}`);

    if (!fs.existsSync(manifestPath)) {
        console.error("⛔ [INGEST] Manifest not found. Run the find command first.");
        process.exit(1);
    }

    const lines = fs.readFileSync(manifestPath, 'utf8').split('\n').filter(l => l.trim() !== '');
    console.log(`📊 [INGEST] Found ${lines.length} proprietary image paths.`);

    let successCount = 0;

    for (const filePath of lines) {
        // Only strip the prefix to keep the folder structure intact for contextual replacement later
        // Original: /Users/zap/Workspace/references/metronic/metronic-tailwind-react-demos/typescript/nextjs/public/media/brand-logos/google.svg
        // Target filePath format: /media/brand-logos/google.svg

        const publicDirMatch = filePath.indexOf('/public');
        if (publicDirMatch === -1) continue;

        const relativePath = filePath.substring(publicDirMatch + 7); // +7 drops '/public'
        const originalName = path.basename(filePath);

        try {
            await prisma.assetTicket.upsert({
                where: { filePath: relativePath },
                update: {}, // Do nothing if it already exists
                create: {
                    filePath: relativePath,
                    originalName: originalName,
                    status: 'PENDING'
                }
            });
            successCount++;
        } catch (error) {
            console.error(`Failed to ingest asset: ${relativePath}`, error);
        }
    }

    console.log(`\n✅ [INGEST] Successfully seeded ${successCount} Metronic image assets into the AssetTicket registry.`);
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    });
