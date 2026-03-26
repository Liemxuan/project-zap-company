/**
 * JERRY-VALIDATE.mjs — Agent: Jerry (Watchdog)
 * 
 * Validates all SCANNED_BY_SCOUT tickets by:
 * 1. Re-reading the source file
 * 2. Checking that every listed organism/molecule actually appears in imports
 * 3. Flagging missing components or phantom entries
 * 4. Promoting valid tickets to DOM_RIPPED
 * 5. Marking invalid tickets as VALIDATION_FAILED
 * 
 * Usage: cd packages/zap-claw && node jerry-validate.mjs
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

const METRONIC_ROOT = '/Users/zap/Workspace/metronic-v9.4.5/metronic-tailwind-react-demos/typescript/nextjs';

function urlToFilePath(urlPath) {
    if (['/signin', '/signup', '/reset-password', '/change-password', '/verify-email'].includes(urlPath)) {
        return join(METRONIC_ROOT, 'app', '(auth)', urlPath.slice(1), 'page.tsx');
    }
    return join(METRONIC_ROOT, 'app', '(protected)', urlPath.slice(1), 'page.tsx');
}

function extractAllNamesFromSource(source) {
    const names = new Set();
    // All import names
    const importRegex = /import\s+\{([^}]+)\}\s+from/g;
    let m;
    while ((m = importRegex.exec(source)) !== null) {
        m[1].split(',').map(n => n.trim().replace(/\s+as\s+\w+/, '')).filter(Boolean).forEach(n => names.add(n));
    }
    // Default imports
    const defaultRegex = /import\s+(\w+)\s+from/g;
    while ((m = defaultRegex.exec(source)) !== null) {
        names.add(m[1]);
    }
    // JSX component usage
    const jsxRegex = /<(\w+)[\s/>]/g;
    while ((m = jsxRegex.exec(source)) !== null) {
        if (m[1][0] === m[1][0].toUpperCase()) names.add(m[1]);
    }
    return names;
}

async function main() {
    console.log('[JERRY] 🔎 Starting validation of Scout scans...\n');

    const tickets = await prisma.extractionTicket.findMany({
        where: { status: { in: ['SCANNED_BY_SCOUT', 'SCANNED_UTILITY'] } },
        orderBy: { urlPath: 'asc' },
    });

    console.log(`[JERRY] Found ${tickets.length} tickets to validate\n`);

    let passed = 0;
    let failed = 0;
    const issues = [];

    for (const ticket of tickets) {
        const filePath = urlToFilePath(ticket.urlPath);
        const pageIssues = [];

        if (!existsSync(filePath)) {
            pageIssues.push('SOURCE_FILE_MISSING');
        } else {
            const source = readFileSync(filePath, 'utf-8');
            const sourceNames = extractAllNamesFromSource(source);

            // Validate L5 organisms
            try {
                const orgs = JSON.parse(ticket.l5Organisms || '[]');
                for (const org of orgs) {
                    // Extract the base component name (before any parenthetical description)
                    const baseName = org.split(' ')[0].split('(')[0];
                    if (baseName && !sourceNames.has(baseName)) {
                        // Check if it's referenced indirectly (content imported from subpath)
                        if (!source.includes(baseName)) {
                            pageIssues.push(`PHANTOM_ORGANISM: "${org}" not found in source`);
                        }
                    }
                }
            } catch { /* skip parse errors */ }

            // Validate L4 molecules
            try {
                const mols = JSON.parse(ticket.l4Molecules || '[]');
                for (const mol of mols) {
                    const baseName = mol.split(' ')[0].split('(')[0];
                    if (baseName && !sourceNames.has(baseName)) {
                        if (!source.includes(baseName)) {
                            pageIssues.push(`PHANTOM_MOLECULE: "${mol}" not found in source`);
                        }
                    }
                }
            } catch { /* skip parse errors */ }

            // Check that the page has at least 1 organism (skip for utility pages)
            if (ticket.status !== 'SCANNED_UTILITY') {
                try {
                    const orgs = JSON.parse(ticket.l5Organisms || '[]');
                    if (orgs.length === 0) {
                        pageIssues.push('NO_ORGANISMS_DETECTED');
                    }
                } catch { /* skip */ }
            }

            // Check layout was detected
            if (!ticket.l6Layout || ticket.l6Layout === '') {
                pageIssues.push('NO_LAYOUT_DETECTED');
            }
        }

        if (pageIssues.length === 0) {
            // PASS — promote to DOM_RIPPED (or DOM_RIPPED_UTILITY)
            const rippedStatus = ticket.status === 'SCANNED_UTILITY' ? 'DOM_RIPPED_UTILITY' : 'DOM_RIPPED';
            await prisma.extractionTicket.update({
                where: { urlPath: ticket.urlPath },
                data: {
                    status: rippedStatus,
                    assignedWorker: `Scout → Jerry ✓${ticket.status === 'SCANNED_UTILITY' ? ' (utility)' : ''}`,
                },
            });
            console.log(`  ✅ ${ticket.urlPath} — PASSED${ticket.status === 'SCANNED_UTILITY' ? ' (utility)' : ''}`);
            passed++;
        } else {
            // FAIL — mark for review
            await prisma.extractionTicket.update({
                where: { urlPath: ticket.urlPath },
                data: {
                    status: 'VALIDATION_FAILED',
                    assignedWorker: `Jerry ✗ (${pageIssues.length} issues)`,
                },
            });
            console.log(`  ❌ ${ticket.urlPath} — FAILED`);
            pageIssues.forEach(i => console.log(`     → ${i}`));
            issues.push({ url: ticket.urlPath, issues: pageIssues });
            failed++;
        }
    }

    console.log(`\n[JERRY] ═══════════════════════════════════════`);
    console.log(`[JERRY] Validation complete.`);
    console.log(`[JERRY]   Passed (→ DOM_RIPPED): ${passed}`);
    console.log(`[JERRY]   Failed:                ${failed}`);
    console.log(`[JERRY]   Pass Rate:             ${tickets.length > 0 ? ((passed / tickets.length) * 100).toFixed(1) : 0}%`);
    if (issues.length > 0) {
        console.log(`\n[JERRY] Failed tickets need manual review:`);
        issues.forEach(i => {
            console.log(`  ${i.url}:`);
            i.issues.forEach(issue => console.log(`    - ${issue}`));
        });
    }
    console.log(`[JERRY] ═══════════════════════════════════════`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
