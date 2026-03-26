import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const prisma = new PrismaClient();

async function main() {
    console.log("Starting metadata backfill for 977 AssetTickets...");

    const tickets = await prisma.assetTicket.findMany({
        where: { trackingId: null }
    });

    console.log(`Found ${tickets.length} tickets to backfill.`);

    let count = 0;
    for (const ticket of tickets) {
        // 1. Generate Metadata
        const trackingId = crypto.randomUUID();
        const fileType = path.extname(ticket.originalName).replace('.', '').toUpperCase() || 'UNKNOWN';

        const pathParts = ticket.filePath.split('/').filter(Boolean);
        const category = pathParts.length > 1 ? (pathParts[1] as string).replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Uncategorized';
        // e.g. "brand-logos" -> "Brand Logos"

        const description = `Original Asset: ${ticket.originalName.replace(/[-_]/g, ' ').replace(/\.[^/.]+$/, "")}`;

        // 2. Extrapolate Dimensions
        let width = null;
        let height = null;
        const pristineDir = "/Users/zap/Workspace/metronic-v9.4.5/metronic-tailwind-react-demos/typescript/nextjs/public";
        const pristinePath = path.join(pristineDir, ticket.filePath);

        if (fs.existsSync(pristinePath)) {
            if (fileType === 'SVG') {
                try {
                    const svgc = fs.readFileSync(pristinePath, 'utf8');
                    const wMatch = svgc.match(/width="?([\d\.]+)[^"]*"?/);
                    const hMatch = svgc.match(/height="?([\d\.]+)[^"]*"?/);
                    const vbMatch = svgc.match(/viewBox="?[\d\.]+ [\d\.]+ ([\d\.]+) ([\d\.]+)"?/);

                    if (wMatch && hMatch && parseFloat(wMatch[1] as string) > 0 && parseFloat(hMatch[1] as string) > 0) {
                        width = parseInt(wMatch[1] as string, 10);
                        height = parseInt(hMatch[1] as string, 10);
                    } else if (vbMatch && parseFloat(vbMatch[1] as string) > 0 && parseFloat(vbMatch[2] as string) > 0) {
                        width = parseInt(vbMatch[1] as string, 10);
                        height = parseInt(vbMatch[2] as string, 10);
                    }
                } catch (e) { }
            } else {
                try {
                    const wOut = execSync(`sips -g pixelWidth "${pristinePath}" 2>/dev/null`).toString();
                    const hOut = execSync(`sips -g pixelHeight "${pristinePath}" 2>/dev/null`).toString();
                    const wM = wOut.match(/pixelWidth: (\d+)/);
                    const hM = hOut.match(/pixelHeight: (\d+)/);
                    if (wM) width = parseInt(wM[1] as string, 10);
                    if (hM) height = parseInt(hM[1] as string, 10);
                } catch (e) { }
            }
        }

        // 3. Save to DB
        await prisma.assetTicket.update({
            where: { filePath: ticket.filePath },
            data: {
                trackingId,
                fileType,
                category,
                description,
                width,
                height
            }
        });

        count++;
        if (count % 50 === 0) console.log(`Processed ${count} / ${tickets.length}`);
    }

    console.log("Backfill complete!");
}

main()
    .catch(e => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
