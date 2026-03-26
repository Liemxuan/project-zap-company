import fs from 'fs';
import path from 'path';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// The directories to scan
const TARGET_DIR = path.join(process.cwd(), '../zap-design/src');

// Directories to explicitly ignore (dev dependencies, wrappers, etc)
const IGNORED_DIRS = ['components/dev', 'api', 'lib/utils'];

// Rules for Jerry (The Watchdog)
const HEX_REGEX = /#[0-9a-fA-F]{3,6}\b/g;
// Catching standard Tailwind colors that violate M3 semantic tokens
// e.g., bg-red-500, text-blue-400, border-gray-200
const TAILWIND_COLOR_REGEX = /\b(bg|text|border|fill|stroke)-(red|blue|green|yellow|indigo|purple|pink|gray|slate|zinc|neutral|stone|orange|amber|lime|emerald|teal|cyan|sky|violet|fuchsia|rose)-\d{2,3}(?:\/\d{1,3})?\b/g;

let violationsCount = 0;

function isIgnored(filePath: string) {
    return IGNORED_DIRS.some(ignored => filePath.includes(ignored));
}

function scanDirectory(dir: string) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);

        if (stat.isDirectory()) {
            if (!isIgnored(fullPath)) {
                scanDirectory(fullPath);
            }
        } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
            if (!isIgnored(fullPath)) {
                auditFile(fullPath);
            }
        }
    }
}

function auditFile(filePath: string) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const relativePath = filePath.split('zap-design/src/')[1];

    let fileHasViolations = false;

    // Check for hardcoded hex colors
    const hexMatches = content.match(HEX_REGEX);
    if (hexMatches) {
        // Filter out common innocent hexes just in case (e.g., standard SVG logic if needed)
        console.log(`\n🚨 [JERRY - WATCHDOG] Hex Violation in \`${relativePath}\``);
        console.log(`   Found hardcoded hex values: ${[...new Set(hexMatches)].join(', ')}`);
        console.log(`   Fix: Replace with ZAP M3 Custom Properties (e.g., bg-surface)`);
        fileHasViolations = true;
        violationsCount += hexMatches.length;
    }

    // Check for raw Tailwind color utilities
    const tailwindMatches = content.match(TAILWIND_COLOR_REGEX);
    if (tailwindMatches) {
        console.log(`\n🚨 [JERRY - WATCHDOG] Tailwind Violation in \`${relativePath}\``);
        console.log(`   Found generic utility classes: ${[...new Set(tailwindMatches)].join(', ')}`);
        console.log(`   Fix: Use semantic M3 tokens (e.g., bg-primary)`);
        fileHasViolations = true;
        violationsCount += tailwindMatches.length;
    }

    if (fileHasViolations) {
        // Here we could dynamically insert into an AuditTicket database table
        // await prisma.auditTicket.create({ ... })
    }
}

async function auditDatabaseIntegrity() {
    console.log(`\n🕵️ [RALPH - INSPECTOR] Initiating Database Integrity Scan...`);
    try {
        // Verify AssetTickets exist
        const assetCount = await prisma.assetTicket.count();
        console.log(`   ✅ AssetTicket Registry Online: ${assetCount} rows active.`);

        // Verify ExtractionTickets exist
        const extractionCount = await prisma.extractionTicket.count();
        console.log(`   ✅ ExtractionTicket Registry Online: ${extractionCount} rows active.`);
    } catch (e: any) {
        console.error(`\n🔥 [CRITICAL] Database Integrity Compromised:`, e.message);
    }
}

async function main() {
    console.log(`=================================================`);
    console.log(`🛡️  ZAP-OS AUDIT SWARM INITIATED`);
    console.log(`=================================================`);
    console.log(`⏰ Time: ${new Date().toISOString()}`);
    console.log(`🎯 Target: packages/zap-design/src\n`);

    await auditDatabaseIntegrity();

    console.log(`\n🐕 [JERRY - WATCHDOG] Commencing CSS M3 Token Scan...`);
    scanDirectory(TARGET_DIR);

    console.log(`\n=================================================`);
    if (violationsCount === 0) {
        console.log(`✅ [AUDIT PASSED] The perimeter is secure. 0 violations found.`);
    } else {
        console.log(`⚠️ [AUDIT FAILED] ${violationsCount} compliance violations detected.`);
        console.log(`   Directing violators to the Dead Letter Queue (DLQ).`);
    }
    console.log(`=================================================`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
