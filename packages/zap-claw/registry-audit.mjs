/**
 * REGISTRY-AUDIT.mjs — Agent: Scout (Audit Mode)
 * 
 * Reads the master component registry from the DB and flags:
 * - PHANTOM: Components that don't exist (Jerry already caught some)
 * - MISCLASSIFIED: Components in the wrong Genesis tier (L3/L4/L5)
 * - DUPLICATE: Same component appearing in multiple tiers
 * - ICON: React-icons or lucide imports that slipped through
 * - DEMO: Demo/wrapper page components that aren't reusable
 * - HTML: Raw HTML elements that aren't real components
 * - FRAMEWORK: Next.js/React internals that should be excluded
 * 
 * DRY RUN ONLY — shows findings, touches nothing.
 * 
 * Usage: cd packages/zap-claw && node registry-audit.mjs
 */

import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════
// KNOWN ISSUES — These rules encode what we've learned
// ═══════════════════════════════════════════════════════════

// Shadcn/Radix atoms that got misclassified as organisms
const SHADCN_ATOMS = [
    'PopoverContent', 'SelectContent', 'CardContent',
    'DialogContent', 'DialogHeader', 'DialogBody',
    'CardHeader', 'CardTitle', 'CardDescription', 'CardFooter',
];

// Demo/page wrappers — not reusable components
const DEMO_PAGES = [
    'Demo1LightSidebarPage', 'Demo1DarkSidebarPage',
    'Demo2Page', 'Demo3Page', 'Demo4Page', 'Demo5Page',
];

// React-icons that slipped through Scout's filter
const ICON_IMPORTS = [
    'RiCheckboxCircleFill', 'RiErrorWarningFill', 'LoaderCircleIcon',
];

// HTML elements that aren't real components
const HTML_ELEMENTS = ['img', 'a', 'div', 'span', 'form'];

// Framework internals that should be excluded
const FRAMEWORK_INTERNALS = ['Link', 'Form'];

// Components that appear in multiple tiers (pick the correct one)
const TIER_CORRECTIONS = {
    'DialogBody':    { correct: 'L3', remove: ['L4', 'L5'] },
    'UserHero':      { correct: 'L5', remove: ['L4'] },
    'NavbarActions': { correct: 'L5', remove: ['L4'] },  // Part of Navbar organism
    'PopoverContent':{ correct: 'L3', remove: ['L5'] },
    'SelectContent': { correct: 'L3', remove: ['L5'] },
    'CardContent':   { correct: 'L3', remove: ['L5'] },
};

// Tab/content components that are really page sections, not standalone molecules
const PAGE_SECTION_COMPONENTS = [
    'Empty', 'Network', 'Projects', 'Projects2', 'Teams', 'Works',
    'AccountProfile', 'PermissionList', 'RoleList', 'UserDangerZone',
    'UserProfile', 'UserList', 'TimezoneSelect', 'I18nExample',
];

async function main() {
    console.log('[AUDIT] 🔍 Registry Dedup & Audit — DRY RUN\n');
    console.log('[AUDIT] Reading all tickets from DB...\n');

    const tickets = await prisma.extractionTicket.findMany({
        select: {
            urlPath: true,
            l5Organisms: true,
            l4Molecules: true,
            l3Atoms: true,
            dependencies: true,
            status: true,
        }
    });

    // Build the full registry with source tracking
    const registry = {
        organisms: {},  // L5
        molecules: {},  // L4
        atoms: {},      // L3
    };

    for (const t of tickets) {
        const orgs = JSON.parse(t.l5Organisms || '[]');
        const mols = JSON.parse(t.l4Molecules || '[]');
        const atoms = JSON.parse(t.l3Atoms || '[]');

        orgs.forEach(o => {
            const key = o.split(' ')[0].split('(')[0];
            if (!registry.organisms[key]) registry.organisms[key] = { count: 0, pages: [], raw: o };
            registry.organisms[key].count++;
            registry.organisms[key].pages.push(t.urlPath);
        });
        mols.forEach(m => {
            const key = m.split(' ')[0].split('(')[0];
            if (!registry.molecules[key]) registry.molecules[key] = { count: 0, pages: [], raw: m };
            registry.molecules[key].count++;
            registry.molecules[key].pages.push(t.urlPath);
        });
        atoms.forEach(a => {
            const key = a.split(' ')[0].split('(')[0];
            if (!registry.atoms[key]) registry.atoms[key] = { count: 0, pages: [], raw: a };
            registry.atoms[key].count++;
            registry.atoms[key].pages.push(t.urlPath);
        });
    }

    // ═══════════════════════════════════════════════════════════
    // RUN AUDIT CHECKS
    // ═══════════════════════════════════════════════════════════

    const findings = [];

    function flag(type, tier, name, reason, pages) {
        findings.push({ type, tier, name, reason, pages: pages || [] });
    }

    // CHECK 1: Shadcn atoms misclassified as organisms
    for (const name of SHADCN_ATOMS) {
        if (registry.organisms[name]) {
            flag('MISCLASSIFIED', 'L5→L3', name,
                `Shadcn/Radix UI atom detected in L5 Organisms — should be L3 Atom`,
                registry.organisms[name].pages);
        }
    }

    // CHECK 2: Demo page wrappers in molecules
    for (const name of DEMO_PAGES) {
        if (registry.molecules[name]) {
            flag('DEMO', 'L4', name,
                `Demo page wrapper — not a reusable component, should be excluded`,
                registry.molecules[name].pages);
        }
    }

    // CHECK 3: Icon imports that slipped through
    for (const name of ICON_IMPORTS) {
        for (const [tier, tierName] of [['organisms', 'L5'], ['molecules', 'L4'], ['atoms', 'L3']]) {
            if (registry[tier][name]) {
                flag('ICON', tierName, name,
                    `Icon import — should be excluded from component registry`,
                    registry[tier][name].pages);
            }
        }
    }

    // CHECK 4: HTML elements
    for (const name of HTML_ELEMENTS) {
        for (const [tier, tierName] of [['organisms', 'L5'], ['molecules', 'L4'], ['atoms', 'L3']]) {
            if (registry[tier][name]) {
                flag('HTML', tierName, name,
                    `Raw HTML element — not a component`,
                    registry[tier][name].pages);
            }
        }
    }

    // CHECK 5: Framework internals
    for (const name of FRAMEWORK_INTERNALS) {
        for (const [tier, tierName] of [['organisms', 'L5'], ['molecules', 'L4'], ['atoms', 'L3']]) {
            if (registry[tier][name]) {
                flag('FRAMEWORK', tierName, name,
                    `Framework internal (Next.js/React) — not a project component`,
                    registry[tier][name].pages);
            }
        }
    }

    // CHECK 6: Cross-tier duplicates
    for (const [name, correction] of Object.entries(TIER_CORRECTIONS)) {
        const tiers = [];
        if (registry.organisms[name]) tiers.push('L5');
        if (registry.molecules[name]) tiers.push('L4');
        if (registry.atoms[name]) tiers.push('L3');
        if (tiers.length > 1) {
            flag('DUPLICATE', tiers.join('+'), name,
                `Appears in ${tiers.join(' and ')} — correct tier is ${correction.correct}`,
                [...(registry.organisms[name]?.pages || []), ...(registry.molecules[name]?.pages || []), ...(registry.atoms[name]?.pages || [])]);
        }
    }

    // CHECK 7: Page section components misclassified as molecules
    for (const name of PAGE_SECTION_COMPONENTS) {
        if (registry.molecules[name]) {
            flag('PAGE_SECTION', 'L4', name,
                `Page-specific section/tab — may not be a standalone reusable molecule`,
                registry.molecules[name].pages);
        }
    }

    // CHECK 8: Jerry's phantom — FormFieldGroup
    if (registry.molecules['FormFieldGroup']) {
        flag('PHANTOM', 'L4', 'FormFieldGroup',
            `Jerry caught this as phantom — component name extracted from JSX but not a real import`,
            registry.molecules['FormFieldGroup'].pages);
    }

    // CHECK 9: Weird names (slash-separated etc)
    if (registry.molecules['FormField/FormItem']) {
        flag('MALFORMED', 'L4', 'FormField/FormItem',
            `Slash-separated name — likely two separate atoms (FormField + FormItem)`,
            registry.molecules['FormField/FormItem'].pages);
    }

    // ═══════════════════════════════════════════════════════════
    // REPORT
    // ═══════════════════════════════════════════════════════════

    console.log(`[AUDIT] ═══════════════════════════════════════════════════`);
    console.log(`[AUDIT] CURRENT REGISTRY: ${Object.keys(registry.organisms).length} organisms + ${Object.keys(registry.molecules).length} molecules + ${Object.keys(registry.atoms).length} atoms = ${Object.keys(registry.organisms).length + Object.keys(registry.molecules).length + Object.keys(registry.atoms).length} total`);
    console.log(`[AUDIT] ═══════════════════════════════════════════════════\n`);

    if (findings.length === 0) {
        console.log('[AUDIT] ✅ Registry is clean — no issues found');
    } else {
        // Group by type
        const grouped = {};
        for (const f of findings) {
            if (!grouped[f.type]) grouped[f.type] = [];
            grouped[f.type].push(f);
        }

        const typeLabels = {
            'MISCLASSIFIED': '🔀 MISCLASSIFIED (wrong Genesis tier)',
            'DEMO': '🎭 DEMO WRAPPERS (not reusable)',
            'ICON': '🎨 ICON IMPORTS (should be excluded)',
            'HTML': '📝 HTML ELEMENTS (not components)',
            'FRAMEWORK': '⚙️  FRAMEWORK INTERNALS (not project components)',
            'DUPLICATE': '♊ CROSS-TIER DUPLICATES',
            'PAGE_SECTION': '📄 PAGE SECTIONS (may not be standalone)',
            'PHANTOM': '👻 PHANTOMS (don\'t exist)',
            'MALFORMED': '⚠️  MALFORMED NAMES',
        };

        let totalFlagged = 0;
        for (const [type, items] of Object.entries(grouped)) {
            console.log(`\n${typeLabels[type] || type} (${items.length}):`);
            console.log('─'.repeat(60));
            for (const f of items) {
                console.log(`  ${f.tier.padEnd(6)} ${f.name}`);
                console.log(`         → ${f.reason}`);
                if (f.pages.length <= 3) {
                    console.log(`         Pages: ${f.pages.join(', ')}`);
                } else {
                    console.log(`         Pages: ${f.pages.slice(0, 3).join(', ')} + ${f.pages.length - 3} more`);
                }
                totalFlagged++;
            }
        }

        // Calculate clean count
        const flaggedNames = new Set(findings.map(f => f.name));
        const cleanOrgs = Object.keys(registry.organisms).filter(k => !flaggedNames.has(k));
        const cleanMols = Object.keys(registry.molecules).filter(k => !flaggedNames.has(k));
        const cleanAtoms = Object.keys(registry.atoms).filter(k => !flaggedNames.has(k));

        console.log(`\n[AUDIT] ═══════════════════════════════════════════════════`);
        console.log(`[AUDIT] AUDIT SUMMARY`);
        console.log(`[AUDIT]   Total findings:       ${totalFlagged}`);
        console.log(`[AUDIT]   Unique names flagged:  ${flaggedNames.size}`);
        console.log(`[AUDIT] ───────────────────────────────────────────────────`);
        console.log(`[AUDIT] PROJECTED CLEAN REGISTRY:`);
        console.log(`[AUDIT]   L5 Organisms:  ${cleanOrgs.length} (was ${Object.keys(registry.organisms).length})`);
        console.log(`[AUDIT]   L4 Molecules:  ${cleanMols.length} (was ${Object.keys(registry.molecules).length})`);
        console.log(`[AUDIT]   L3 Atoms:      ${cleanAtoms.length} (was ${Object.keys(registry.atoms).length})`);
        console.log(`[AUDIT]   TOTAL:         ${cleanOrgs.length + cleanMols.length + cleanAtoms.length} (was ${Object.keys(registry.organisms).length + Object.keys(registry.molecules).length + Object.keys(registry.atoms).length})`);
        console.log(`[AUDIT] ═══════════════════════════════════════════════════`);
        console.log(`\n[AUDIT] ⚠️  DRY RUN — nothing was changed. Review findings above.`);
        console.log(`[AUDIT] Next: Approve fixes → run registry-fix.mjs to apply.`);
    }
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
