// @ts-nocheck
import { config } from "dotenv";
import { PrismaClient } from '@prisma/client';
import { exec } from "child_process";
import { promisify } from "util";
import path from "path";
import fs from "fs";

config();

const prisma = new PrismaClient();
const execAsync = promisify(exec);

const METRONIC_PUBLIC_DIR = '/Users/zap/Workspace/metronic-v9.4.5/metronic-tailwind-react-demos/typescript/nextjs/public';
const NANO_BANANA_CLI = '/Users/zap/Workspace/olympus/.agent/skills/nano-banana-2-skill/src/cli.ts';

const THEME_INSTRUCTION = `
STYLE MANDATE:
- Aesthetic: 8-bit/16-bit pixel art, early 90s visual novels, vintage graphical user interface (Classic Mac OS / Windows 95). Nostalgic, playfully digital.
- Illustration Style: 16-bit retro anime aesthetic. Analog tech motifs (chunky keyboards, CRTs, sound waves, chunky cables).
- Color Palette: Retro Indigo, Arcade Orange, System Grey, Shadow Grey, True White, True Black, CRT Charcoal.
- Technique: Strictly aliased (no blur). Zero anti-aliasing. Gradients are strictly forbidden. Use dithering (checkerboard pixel patterns of two solid colors) for shading, depth, and texture. Hard 1px black outlines on objects.
`;

// Helper to deduce a prompt based on filepath
function generatePromptForFile(filePath: string): { prompt: string, transparent: boolean } {
    const base = path.basename(filePath, path.extname(filePath));
    const dir = path.dirname(filePath);

    let subject = `a classic Windows 95 style interface abstract background, System Grey pane, CRT Charcoal accents, 16-bit pixel art style`;
    let transparent = false;

    if (dir.includes('avatars')) {
        subject = `a 16-bit pixel art headshot avatar of a person in retro anime style, sharp 1px black outline`;
    } else if (dir.includes('brand-logos')) {
        subject = `a flat 16-bit pixel art tech logo, strictly aliased, 1px solid black outline`;
        transparent = true;
    } else if (dir.includes('illustrations') || dir.includes('misc') || dir.includes('auth')) {
        subject = `a 16-bit retro anime illustration featuring analog tech motifs, dithered shading, Windows 95 UI elements`;
        transparent = true;
    } else if (dir.includes('products')) {
        subject = `a chunky, blocky retro tech product in 8-bit pixel art style, isometric view, rigid black outlines`;
    } else if (dir.includes('stock') || dir.includes('books') || dir.includes('docs')) {
        subject = `a 16-bit retro anime aesthetic scene, dithering for shading, no gradients, classic Mac OS visual novel vibe`;
    }

    // Clean up base file name to add context if available
    const contextName = base.replace(/-/g, ' ').replace(/[0-9]/g, '').trim();
    if (contextName.length > 2) {
        subject += ` conceptually related to ${contextName}`;
    }

    // Strip newlines from the theme instruction so it doesn't break CLI args
    const cleanTheme = THEME_INSTRUCTION.replace(/\n/g, ' ').trim();

    return { prompt: `${subject}. ${cleanTheme}`, transparent };
}

async function main() {
    const batchSize = 10;

    while (true) {
        const pendingTickets = await prisma.assetTicket.findMany({
            where: { status: 'PENDING' },
            take: batchSize
        });

        if (pendingTickets.length === 0) {
            console.log("✅ [ASSET SWARM] Zero pending asset tickets found. All assets generated.");
            break;
        }

        console.log(`🎯 [ASSET SWARM] Acquired ${pendingTickets.length} pending images for replacement.`);

        const TARGET_MEDIA_DIR = path.join(process.cwd(), '../zap-design/public');

        for (const ticket of pendingTickets) {
            const originalDir = path.dirname(path.join(TARGET_MEDIA_DIR, ticket.filePath));
            const fullTargetPath = path.join(TARGET_MEDIA_DIR, ticket.filePath);

            // Ensure target directory exists
            fs.mkdirSync(originalDir, { recursive: true });

            console.log(`\n➡️ Processing: ${ticket.filePath} -> ${fullTargetPath}`);

            await prisma.assetTicket.update({
                where: { filePath: ticket.filePath },
                data: { status: 'GENERATING', assignedWorker: 'Nano Banana 2 (Gemini 3.1 Flash)' }
            });

            const { prompt, transparent } = generatePromptForFile(ticket.filePath);

            const tempName = `zap_gen_${Date.now()}`;

            let cmd = `bun run src/cli.ts "${prompt}" -s 1K -o ${tempName} -d "${originalDir}"`;
            if (transparent) {
                cmd += ` -t`;
            }

            console.log(`   Running: ${cmd}`);

            try {
                const { stdout, stderr } = await execAsync(cmd, {
                    cwd: '/Users/zap/Workspace/olympus/.agent/skills/nano-banana-2-skill',
                    env: {
                        ...process.env,
                        GOOGLE_API_KEY: process.env.SPIKE_IMAGE_API_KEY,
                        GEMINI_API_KEY: process.env.SPIKE_IMAGE_API_KEY,
                    }
                });
                // ... suppressed stdout logging to keep output clean, rely on CLI logging ...

                // The CLI outputs the final file path
                let generatedFilePath = '';
                const lines = stdout.split('\n');
                for (const line of lines) {
                    if (line.includes('+') && line.includes(tempName)) {
                        const match = line.match(/(?:\+ |Transparent: )(.*zap_gen_.*)$/);
                        if (match && match[1]) {
                            generatedFilePath = match[1].trim();
                            break;
                        }
                    }
                }

                if (!generatedFilePath || !fs.existsSync(generatedFilePath)) {
                    const files = fs.readdirSync(originalDir);
                    const generated = files.find(f => f.startsWith(tempName));
                    if (generated) {
                        generatedFilePath = path.join(originalDir, generated);
                    } else {
                        throw new Error("Could not locate generated file output.");
                    }
                }

                // Move the generated file to the target path, forcefully replacing it keeping original extension
                fs.renameSync(generatedFilePath, fullTargetPath);

                console.log(`   ✅ Saved new asset over target at ${fullTargetPath}`);

                await prisma.assetTicket.update({
                    where: { filePath: ticket.filePath },
                    data: {
                        status: 'SWAPPED',
                        promptUsed: prompt,
                        newFileName: ticket.filePath
                    }
                });

            } catch (error) {
                console.error(`   ❌ Failed to generate asset: ${ticket.filePath}`, error);
                // Revert back to pending so it can be retried or debugged
                await prisma.assetTicket.update({
                    where: { filePath: ticket.filePath },
                    data: { status: 'PENDING' }
                });
            }
        }

        console.log(`\n✅ [ASSET SWARM] Batch complete. Sleeping briefly before next batch...`);
        await new Promise(r => setTimeout(r, 2000));
    }
}

main()
    .catch(console.error)
    .finally(async () => {
        await prisma.$disconnect()
    });
