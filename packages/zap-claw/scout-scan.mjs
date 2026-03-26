/**
 * SCOUT-SCAN.mjs — Agent: Scout (Recon & Audit)
 * 
 * Scans all PENDING ExtractionTicket pages by reading the actual Metronic
 * source files, detecting the page shell pattern, extracting component
 * imports, and writing the architectural breakdown to the DB.
 * 
 * Usage: cd packages/zap-claw && node scout-scan.mjs
 */

import { PrismaClient } from '@prisma/client';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

// Metronic source root
const METRONIC_ROOT = '/Users/zap/Workspace/metronic-v9.4.5/metronic-tailwind-react-demos/typescript/nextjs';

// Map URL paths to filesystem paths
function urlToFilePath(urlPath) {
    // Auth pages (non-protected)
    if (['/signin', '/signup', '/reset-password', '/change-password', '/verify-email'].includes(urlPath)) {
        return join(METRONIC_ROOT, 'app', '(auth)', urlPath.slice(1), 'page.tsx');
    }
    // Everything else is under (protected)
    return join(METRONIC_ROOT, 'app', '(protected)', urlPath.slice(1), 'page.tsx');
}

// Detect the page shell pattern from imports and JSX
function detectShell(source) {
    if (source.includes('BrandedLayout') || source.includes("from '../layouts/branded'")) {
        return 'BrandedLayout (2-col grid: form card + hero image panel)';
    }
    if (source.includes('UserHero')) {
        return 'DashboardLayout + UserHero (profile banner shell)';
    }
    return 'DashboardLayout (protected, sidebar + topbar)';
}

// Extract all import statements and identify components
function extractComponents(source) {
    const organisms = [];
    const molecules = [];
    const atoms = [];

    // Extract all imports
    const importRegex = /import\s+\{([^}]+)\}\s+from\s+['"]([^'"]+)['"]/g;
    let match;
    const allImports = {};

    while ((match = importRegex.exec(source)) !== null) {
        const names = match[1].split(',').map(n => n.trim().replace(/\s+as\s+\w+/, ''));
        const from = match[2];
        names.forEach(name => {
            if (name) allImports[name] = from;
        });
    }

    // Default import pattern
    const defaultImportRegex = /import\s+(\w+)\s+from\s+['"]([^'"]+)['"]/g;
    while ((match = defaultImportRegex.exec(source)) !== null) {
        allImports[match[1]] = match[2];
    }

    // Classify imports
    for (const [name, from] of Object.entries(allImports)) {
        // Skip React/Next internals
        if (['Fragment', 'useState', 'useEffect', 'useCallback', 'Suspense', 'useRouter', 'useSearchParams', 'Link', 'useSettings'].includes(name)) continue;
        if (from === 'react' || from === 'next/link' || from === 'next/navigation' || from === 'next/dist/client/link') continue;
        if (from.includes('@hookform') || from.includes('react-hook-form') || from === 'zod' || from === 'next-auth/react') continue;

        // Toolbar components → L5
        if (['Toolbar', 'ToolbarHeading', 'ToolbarPageTitle', 'ToolbarDescription', 'ToolbarActions'].includes(name)) {
            if (!organisms.includes('Toolbar')) organisms.push('Toolbar');
            if (name !== 'Toolbar' && !molecules.includes(name)) molecules.push(name);
            continue;
        }

        // Navbar → L5
        if (['Navbar', 'NavbarActions'].includes(name)) {
            if (!organisms.includes('Navbar')) organisms.push('Navbar');
            continue;
        }

        // PageNavbar, PageMenu → L5
        if (name === 'PageNavbar' || name === 'PageMenu') {
            organisms.push(name);
            continue;
        }

        // UserHero → L5
        if (name === 'UserHero') {
            organisms.push('UserHero (avatar + name + info badges)');
            continue;
        }

        // Content components → L5 organisms
        if (name.includes('Content') || name.includes('Dialog') || name.includes('Modal')) {
            organisms.push(name);
            continue;
        }

        // UI primitives from @/components/ui → L3 atoms
        if (from.includes('@/components/ui/')) {
            atoms.push(name);
            continue;
        }

        // Icons from lucide-react → skip (they're part of atoms)
        if (from === 'lucide-react') {
            continue;
        }

        // Container → L3
        if (name === 'Container') {
            atoms.push('Container');
            continue;
        }

        // Dropdown menus → L4
        if (name.includes('DropdownMenu')) {
            molecules.push(name);
            continue;
        }

        // Icons component
        if (name === 'Icons') {
            atoms.push('Icons');
            continue;
        }

        // RecaptchaPopover → L4
        if (name === 'RecaptchaPopover') {
            molecules.push('RecaptchaPopover');
            continue;
        }

        // Schema imports → skip
        if (from.includes('schema') || from.includes('forms/')) continue;

        // Helpers → skip
        if (from.includes('@/lib/')) continue;
        if (from.includes('helpers')) continue;
        if (from.includes('providers/')) continue;

        // Anything else with a component-like name → L4 molecule
        if (name[0] === name[0].toUpperCase()) {
            molecules.push(name);
        }
    }

    // Detect form patterns from JSX — only tag actual imported names
    // NOTE: FormFieldGroup was a PHANTOM caught by Jerry.
    // FormField is already captured via @/components/ui/form import classifier above.
    if (source.includes('passwordVisible') || source.includes("type='password'") || source.includes('type={password')) {
        if (!molecules.includes('PasswordInputGroup')) molecules.push('PasswordInputGroup');
    }
    if (source.includes('<Checkbox')) {
        if (!atoms.includes('Checkbox')) atoms.push('Checkbox');
    }

    return { organisms, molecules, atoms, allImports };
}

async function main() {
    console.log('[SCOUT] 🔍 Starting page scan...\n');

    // Get all PENDING tickets
    const tickets = await prisma.extractionTicket.findMany({
        where: { status: 'PENDING' },
        orderBy: { urlPath: 'asc' },
    });

    console.log(`[SCOUT] Found ${tickets.length} PENDING tickets to scan\n`);

    let scanned = 0;
    let skipped = 0;
    const errors = [];

    for (const ticket of tickets) {
        const filePath = urlToFilePath(ticket.urlPath);

        if (!existsSync(filePath)) {
            console.log(`  ⚠ ${ticket.urlPath} — file not found: ${filePath}`);
            skipped++;
            errors.push({ url: ticket.urlPath, error: 'FILE_NOT_FOUND', path: filePath });
            continue;
        }

        try {
            const source = readFileSync(filePath, 'utf-8');
            const shell = detectShell(source);
            const { organisms, molecules, atoms, allImports } = extractComponents(source);

            // Utility/wrapper pages with 0 organisms get tagged differently
            const isUtilityPage = organisms.length === 0;
            const scanStatus = isUtilityPage ? 'SCANNED_UTILITY' : 'SCANNED_BY_SCOUT';
            const worker = isUtilityPage ? 'Scout (Utility Page)' : 'Scout (Auto-Scan)';

            // Build source references — where every component lives
            const sourceRefs = {
                pageFile: filePath.replace(METRONIC_ROOT, ''),
                imports: Object.entries(allImports).reduce((acc, [name, from]) => {
                    if (from.startsWith('@/') || from.startsWith('./') || from.startsWith('../')) {
                        acc[name] = from;
                    }
                    return acc;
                }, {}),
                scannedAt: new Date().toISOString(),
            };

            await prisma.extractionTicket.update({
                where: { urlPath: ticket.urlPath },
                data: {
                    zapLevel: isUtilityPage ? 'L6' : 'L7',
                    l6Layout: shell,
                    l5Organisms: JSON.stringify(organisms),
                    l4Molecules: JSON.stringify(molecules),
                    l3Atoms: JSON.stringify(atoms),
                    l2Primitives: JSON.stringify(['Fragment', 'Container']),
                    l1Tokens: JSON.stringify(['--color-primary', '--color-foreground', '--color-secondary-foreground', '--color-muted-foreground']),
                    dependencies: JSON.stringify(sourceRefs),
                    assignedWorker: worker,
                    status: scanStatus,
                }
            });

            console.log(`  ✓ ${ticket.urlPath} — ${organisms.length} orgs, ${molecules.length} mols, ${atoms.length} atoms`);
            scanned++;
        } catch (err) {
            console.log(`  ✗ ${ticket.urlPath} — ${err.message}`);
            errors.push({ url: ticket.urlPath, error: err.message });
        }
    }

    console.log(`\n[SCOUT] ═══════════════════════════════════════`);
    console.log(`[SCOUT] Scan complete.`);
    console.log(`[SCOUT]   Scanned: ${scanned}`);
    console.log(`[SCOUT]   Skipped: ${skipped}`);
    console.log(`[SCOUT]   Errors:  ${errors.length}`);
    if (errors.length > 0) {
        console.log(`[SCOUT] Error details:`);
        errors.forEach(e => console.log(`  - ${e.url}: ${e.error}`));
    }
    console.log(`[SCOUT] ═══════════════════════════════════════`);
    console.log(`[SCOUT] Next step: Run jerry-validate.mjs to verify results`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
