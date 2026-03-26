/**
 * REGISTRY-SEED.mjs — Populates ComponentRegistry from ExtractionTicket data
 * 
 * Reads all 99 converged pages, extracts every unique component,
 * cross-references against our Genesis library, applies audit flags,
 * and writes the master inventory to the ComponentRegistry table.
 * 
 * Usage: cd packages/zap-claw && node registry-seed.mjs
 */

import { PrismaClient } from '@prisma/client';
import { existsSync } from 'fs';
const prisma = new PrismaClient();

// ═══════════════════════════════════════════════════════════
// GENESIS CROSS-REFERENCE MAP
// Maps Metronic component names → our Genesis equivalents
// ═══════════════════════════════════════════════════════════

const GENESIS_ROOT = '/Users/zap/Workspace/olympus/packages/zap-design/src/genesis';

const GENESIS_MAP = {
    // Atoms → Genesis atoms
    'Button':       { path: 'atoms/interactive/buttons.tsx',     status: 'EXISTS' },
    'Input':        { path: 'atoms/interactive/inputs.tsx',      status: 'EXISTS' },
    'Checkbox':     { path: 'atoms/interactive/checkboxes.tsx',  status: 'EXISTS' },
    'Select':       { path: 'atoms/interactive/Select.tsx',      status: 'EXISTS' },
    'Toggle':       { path: 'atoms/interactive/Toggle.tsx',      status: 'EXISTS' },
    'Badge':        { path: 'atoms/status/badges.tsx',           status: 'EXISTS' },
    'Card':         { path: 'atoms/surfaces/card.tsx',           status: 'EXISTS' },
    'CardHeader':   { path: 'atoms/surfaces/card.tsx',           status: 'EXISTS' },
    'CardTitle':    { path: 'atoms/surfaces/card.tsx',           status: 'EXISTS' },
    'CardDescription': { path: 'atoms/surfaces/card.tsx',        status: 'EXISTS' },
    'CardFooter':   { path: 'atoms/surfaces/card.tsx',           status: 'EXISTS' },
    'CardContent':  { path: 'atoms/surfaces/card.tsx',           status: 'EXISTS' },
    'Container':    { path: 'atoms/layout/box.tsx',              status: 'EXISTS' },
    'Tabs':         { path: 'atoms/interactive/Tabs.tsx',        status: 'EXISTS' },
    'Alert':        { path: null,                                status: 'NEEDS_BUILD', notes: 'No Genesis Alert atom yet' },
    'AlertIcon':    { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Alert system' },
    'AlertTitle':   { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Alert system' },
    'Switch':       { path: null,                                status: 'NEEDS_BUILD', notes: 'Toggle exists but Switch variant missing' },
    'Textarea':     { path: null,                                status: 'NEEDS_BUILD', notes: 'No Genesis Textarea atom' },
    'Label':        { path: null,                                status: 'NEEDS_BUILD', notes: 'Implicit in inputs but no standalone Label' },
    'ScrollArea':   { path: null,                                status: 'NEEDS_BUILD', notes: 'No Genesis ScrollArea' },
    'Table':        { path: null,                                status: 'NEEDS_BUILD', notes: 'No Genesis Table atom' },
    'TableBody':    { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Table system' },
    'TableCell':    { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Table system' },
    'TableHead':    { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Table system' },
    'TableHeader':  { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Table system' },
    'TableRow':     { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Table system' },
    'Dialog':       { path: null,                                status: 'NEEDS_BUILD', notes: 'No Genesis Dialog' },
    'DialogContent':{ path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Dialog system' },
    'DialogHeader': { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Dialog system' },
    'DialogBody':   { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Dialog system' },
    'Popover':      { path: null,                                status: 'NEEDS_BUILD', notes: 'No Genesis Popover' },
    'PopoverTrigger':{ path: null,                               status: 'NEEDS_BUILD', notes: 'Part of Popover system' },
    'PopoverContent':{ path: null,                               status: 'NEEDS_BUILD', notes: 'Part of Popover system' },
    'SelectContent':{ path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Select system' },
    'SelectGroup':  { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Select system' },
    'SelectItem':   { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Select system' },
    'SelectTrigger':{ path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Select system' },
    'SelectValue':  { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Select system' },
    'Command':      { path: null,                                status: 'NEEDS_BUILD', notes: 'No Genesis Command palette' },
    'CommandCheck': { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Command system' },
    'CommandEmpty': { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Command system' },
    'CommandGroup': { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Command system' },
    'CommandInput': { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Command system' },
    'CommandItem':  { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Command system' },
    'CommandList':  { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Command system' },
    'Form':         { path: null,                                status: 'NEEDS_BUILD', notes: 'React Hook Form wrapper' },
    'FormControl':  { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Form system' },
    'FormField':    { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Form system' },
    'FormItem':     { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Form system' },
    'FormLabel':    { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Form system' },
    'FormMessage':  { path: null,                                status: 'NEEDS_BUILD', notes: 'Part of Form system' },
    'FormDescription':{ path: null,                              status: 'NEEDS_BUILD', notes: 'Part of Form system' },
    'Icons':        { path: 'atoms/icons/Icon.tsx',              status: 'EXISTS', notes: 'Core icon wrapper exists' },

    // Molecules → Genesis molecules
    'Breadcrumb':    { path: 'molecules/navigation/Breadcrumbs.tsx', status: 'EXISTS' },
    'BreadcrumbItem':{ path: 'molecules/navigation/Breadcrumbs.tsx', status: 'EXISTS' },
    'BreadcrumbLink':{ path: 'molecules/navigation/Breadcrumbs.tsx', status: 'EXISTS' },
    'BreadcrumbList':{ path: 'molecules/navigation/Breadcrumbs.tsx', status: 'EXISTS' },
    'BreadcrumbPage':{ path: 'molecules/navigation/Breadcrumbs.tsx', status: 'EXISTS' },
    'BreadcrumbSeparator':{ path: 'molecules/navigation/Breadcrumbs.tsx', status: 'EXISTS' },
    'ToolbarHeading':   { path: null, status: 'NEEDS_BUILD', notes: 'Toolbar system needs extraction' },
    'ToolbarActions':   { path: null, status: 'NEEDS_BUILD', notes: 'Toolbar system needs extraction' },
    'ToolbarPageTitle': { path: null, status: 'NEEDS_BUILD', notes: 'Toolbar system needs extraction' },
    'ToolbarDescription':{ path: null, status: 'NEEDS_BUILD', notes: 'Toolbar system needs extraction' },
    'ToolbarTitle':     { path: null, status: 'NEEDS_BUILD', notes: 'Toolbar system needs extraction' },
    'DropdownMenu9':    { path: null, status: 'NEEDS_BUILD', notes: 'Dropdown not yet in Genesis' },
    'PasswordInputGroup':{ path: null, status: 'NEEDS_BUILD', notes: 'Auth form molecule' },
    'Metadata':         { path: null, status: 'NEEDS_BUILD', notes: 'Key-value metadata display' },
    'Steps':            { path: null, status: 'NEEDS_BUILD', notes: 'Stepper/wizard molecule' },
    'OptionsCard':      { path: null, status: 'NEEDS_BUILD', notes: 'Options selection card' },
    'RecaptchaPopover': { path: null, status: 'NEEDS_BUILD', notes: 'Auth verification molecule' },
    'OAuthButtonGroup': { path: null, status: 'NEEDS_BUILD', notes: 'Social login group' },
    'OrDivider':        { path: null, status: 'NEEDS_BUILD', notes: 'Visual divider with text' },
    'TokenVerificationState': { path: null, status: 'NEEDS_BUILD', notes: 'Auth token state display' },
    'ErrorWithBackLink': { path: null, status: 'NEEDS_BUILD', notes: 'Error page with back navigation' },

    // Organisms → Genesis layouts/templates
    'Toolbar':       { path: null, status: 'NEEDS_BUILD', notes: 'Page toolbar organism — high priority' },
    'PageNavbar':    { path: 'molecules/navigation/MainNavBar.tsx', status: 'NEEDS_IMPROVEMENT', notes: 'MainNavBar exists but needs Metronic tab patterns' },
    'Navbar':        { path: 'molecules/navigation/MainNavBar.tsx', status: 'NEEDS_IMPROVEMENT', notes: 'Overlaps with MainNavBar' },
    'PageMenu':      { path: null, status: 'NEEDS_BUILD', notes: 'Tab-based page menu organism' },
    'UserHero':      { path: null, status: 'NEEDS_BUILD', notes: 'Profile hero banner — high priority' },
    'BrandedLayout': { path: 'templates/auth/auth-scaffold.tsx', status: 'NEEDS_IMPROVEMENT', notes: 'Auth scaffold exists but needs Metronic branding patterns' },
    'AuthFormCard':  { path: 'templates/auth/auth-scaffold.tsx', status: 'NEEDS_IMPROVEMENT', notes: 'Part of auth scaffold' },
    'DashboardContent': { path: 'templates/dashboard/app-shell.tsx', status: 'EXISTS', notes: 'AppShell is the Genesis dashboard shell' },
};

// ═══════════════════════════════════════════════════════════
// CATEGORY CLASSIFICATION RULES
// ═══════════════════════════════════════════════════════════

function classifyCategory(name, tier) {
    const n = name.toLowerCase();

    // Navigation
    if (['toolbar', 'pagenavbar', 'navbar', 'navbaractions', 'pagemenu', 'breadcrumb'].some(k => n.includes(k.toLowerCase()))) return 'Navigation';

    // Auth
    if (['auth', 'signin', 'signup', 'login', 'password', 'oauth', 'recaptcha', 'verification', 'branded', 'token'].some(k => n.includes(k.toLowerCase()))) return 'Auth';

    // Form
    if (['form', 'input', 'select', 'checkbox', 'toggle', 'switch', 'textarea', 'label'].some(k => n.includes(k.toLowerCase()))) return 'Form';

    // Data Display
    if (['table', 'grid', 'card', 'badge', 'metadata', 'property', 'kpi', 'chart'].some(k => n.includes(k.toLowerCase()))) return 'DataDisplay';

    // Feedback
    if (['alert', 'dialog', 'modal', 'toast', 'error', 'loader', 'skeleton'].some(k => n.includes(k.toLowerCase()))) return 'Feedback';

    // Surface
    if (['popover', 'dropdown', 'menu', 'command', 'scroll'].some(k => n.includes(k.toLowerCase()))) return 'Surface';

    // Layout
    if (['container', 'layout', 'dashboard', 'hero', 'steps', 'divider'].some(k => n.includes(k.toLowerCase()))) return 'Layout';

    // Content — page-specific content blocks
    if (n.includes('content')) return 'Content';

    // Icon
    if (['icon', 'icons'].some(k => n.includes(k.toLowerCase()))) return 'Icon';

    // Default
    if (tier === 'L5') return 'Content';
    if (tier === 'L4') return 'Composition';
    return 'Primitive';
}

// ═══════════════════════════════════════════════════════════
// TAG GENERATION
// ═══════════════════════════════════════════════════════════

function generateTags(name, tier, category, pages) {
    const tags = [];

    // Source tags
    if (GENESIS_MAP[name]) tags.push('metronic');
    if (name.includes('Content')) tags.push('page-content');

    // Tier tags
    tags.push(tier.toLowerCase());

    // Category tag
    tags.push(category.toLowerCase());

    // Pattern tags
    if (pages.some(p => p.startsWith('/account/'))) tags.push('account');
    if (pages.some(p => p.startsWith('/public-profile/'))) tags.push('profile');
    if (pages.some(p => p.startsWith('/network/'))) tags.push('network');
    if (pages.some(p => p.startsWith('/store-client/'))) tags.push('ecommerce');
    if (pages.some(p => ['/signin', '/signup', '/reset-password', '/change-password', '/verify-email'].includes(p))) tags.push('auth');

    // Usage volume
    if (pages.length >= 20) tags.push('high-usage');
    else if (pages.length >= 5) tags.push('medium-usage');
    else tags.push('low-usage');

    // Shadcn detection
    if (['Button', 'Input', 'Card', 'Badge', 'Dialog', 'Popover', 'Select', 'Table', 'Command', 'ScrollArea', 'Alert', 'Switch', 'Checkbox', 'Textarea', 'Label', 'Form', 'Tabs'].includes(name) ||
        name.startsWith('Card') || name.startsWith('Dialog') || name.startsWith('Table') ||
        name.startsWith('Select') || name.startsWith('Popover') || name.startsWith('Command') ||
        name.startsWith('Form') || name.startsWith('Breadcrumb') || name.startsWith('Alert')) {
        tags.push('shadcn');
    }

    return [...new Set(tags)];
}

// ═══════════════════════════════════════════════════════════
// AUDIT FLAG DETECTION (same rules as registry-audit.mjs)
// ═══════════════════════════════════════════════════════════

const AUDIT_RULES = {
    PHANTOM:        ['FormFieldGroup'],
    DEMO:           ['Demo1LightSidebarPage', 'Demo1DarkSidebarPage', 'Demo2Page', 'Demo3Page', 'Demo4Page', 'Demo5Page'],
    ICON:           ['RiCheckboxCircleFill', 'RiErrorWarningFill', 'LoaderCircleIcon'],
    HTML:           ['img', 'a', 'div', 'span'],
    FRAMEWORK:      ['Link'],
    PAGE_SECTION:   ['Empty', 'Network', 'Projects', 'Projects2', 'Teams', 'Works', 'I18nExample'],
    MALFORMED:      ['FormField/FormItem'],
};

function getAuditFlag(name) {
    for (const [flag, names] of Object.entries(AUDIT_RULES)) {
        if (names.includes(name)) return flag;
    }
    return 'CLEAN';
}

function getAuditNotes(name, flag) {
    const notes = {
        PHANTOM: 'Jerry caught as phantom — not a real import',
        DEMO: 'Demo page wrapper — not a reusable component',
        ICON: 'Icon import — tracked in icon system, not component registry',
        HTML: 'Raw HTML element — not a project component',
        FRAMEWORK: 'Framework internal (Next.js/React)',
        PAGE_SECTION: 'Page-specific section — review for reusability',
        MALFORMED: 'Malformed name — needs manual review',
    };
    return notes[flag] || null;
}

// ═══════════════════════════════════════════════════════════
// BUILD SOURCE PATH MAP from ExtractionTicket.dependencies
// ═══════════════════════════════════════════════════════════

function buildSourceMap(tickets) {
    const sourceMap = {};
    for (const t of tickets) {
        if (!t.dependencies) continue;
        try {
            const deps = JSON.parse(t.dependencies);
            if (deps.imports) {
                for (const [name, from] of Object.entries(deps.imports)) {
                    if (!sourceMap[name]) sourceMap[name] = from;
                }
            }
        } catch {}
    }
    return sourceMap;
}

// ═══════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════

async function main() {
    console.log('[SEED] 🌱 Seeding ComponentRegistry...\n');

    // Read all tickets
    const tickets = await prisma.extractionTicket.findMany({
        select: {
            urlPath: true,
            l5Organisms: true,
            l4Molecules: true,
            l3Atoms: true,
            dependencies: true,
            status: true,
            updatedAt: true,
        }
    });

    console.log(`[SEED] Read ${tickets.length} ExtractionTickets\n`);

    // Build source import map
    const sourceMap = buildSourceMap(tickets);

    // Collect all components with usage data
    const components = {};

    for (const t of tickets) {
        const orgs = JSON.parse(t.l5Organisms || '[]');
        const mols = JSON.parse(t.l4Molecules || '[]');
        const atoms = JSON.parse(t.l3Atoms || '[]');

        for (const o of orgs) {
            const key = o.split(' ')[0].split('(')[0];
            if (!components[key]) components[key] = { tier: 'L5', pages: [], raw: o };
            components[key].pages.push(t.urlPath);
        }
        for (const m of mols) {
            const key = m.split(' ')[0].split('(')[0];
            if (!components[key]) components[key] = { tier: 'L4', pages: [], raw: m };
            components[key].pages.push(t.urlPath);
        }
        for (const a of atoms) {
            const key = a.split(' ')[0].split('(')[0];
            if (!components[key]) components[key] = { tier: 'L3', pages: [], raw: a };
            components[key].pages.push(t.urlPath);
        }
    }

    console.log(`[SEED] Found ${Object.keys(components).length} unique components\n`);

    // Clear existing registry
    await prisma.componentRegistry.deleteMany({});
    console.log('[SEED] Cleared existing registry\n');

    // Seed each component
    let seeded = 0;
    const summary = { EXISTS: 0, NEEDS_BUILD: 0, NEEDS_IMPROVEMENT: 0, NOT_NEEDED: 0, UNKNOWN: 0 };
    const auditSummary = {};

    for (const [name, data] of Object.entries(components)) {
        const category = classifyCategory(name, data.tier);
        const tags = generateTags(name, data.tier, category, data.pages);
        const auditFlag = getAuditFlag(name);
        const auditNotes = getAuditNotes(name, auditFlag);

        // Genesis cross-reference
        const genesis = GENESIS_MAP[name];
        let genesisStatus = 'UNKNOWN';
        let genesisPath = null;
        let genesisNotes = null;

        if (genesis) {
            genesisStatus = genesis.status;
            genesisPath = genesis.path ? `${GENESIS_ROOT}/${genesis.path}` : null;
            genesisNotes = genesis.notes || null;

            // Verify the file actually exists
            if (genesisPath && !existsSync(genesisPath)) {
                genesisNotes = `⚠️ Path listed but file not found: ${genesisPath}`;
                genesisStatus = 'NEEDS_BUILD';
            }
        }

        // If audit flagged as NOT_NEEDED types
        if (['DEMO', 'ICON', 'HTML', 'FRAMEWORK', 'PHANTOM', 'MALFORMED'].includes(auditFlag)) {
            genesisStatus = 'NOT_NEEDED';
        }

        // Unique pages
        const uniquePages = [...new Set(data.pages)];

        await prisma.componentRegistry.create({
            data: {
                name,
                displayName: data.raw || name,
                tier: data.tier,
                category,
                tags: JSON.stringify(tags),
                usageCount: uniquePages.length,
                pages: JSON.stringify(uniquePages),
                sourcePath: sourceMap[name] || null,
                sourceImport: sourceMap[name] || null,
                genesisStatus,
                genesisPath,
                genesisNotes,
                auditFlag,
                auditNotes,
            }
        });

        summary[genesisStatus]++;
        auditSummary[auditFlag] = (auditSummary[auditFlag] || 0) + 1;
        seeded++;

        const statusIcon = {
            'EXISTS': '🟢',
            'NEEDS_BUILD': '🔵',
            'NEEDS_IMPROVEMENT': '🟠',
            'NOT_NEEDED': '⚪',
            'UNKNOWN': '❓',
        }[genesisStatus];

        console.log(`  ${statusIcon} ${data.tier} ${name.padEnd(30)} ${category.padEnd(14)} ${genesisStatus.padEnd(20)} ${auditFlag !== 'CLEAN' ? `⚠ ${auditFlag}` : '✓'}`);
    }

    console.log(`\n[SEED] ═══════════════════════════════════════════════════`);
    console.log(`[SEED] SEEDED ${seeded} COMPONENTS`);
    console.log(`[SEED] ═══════════════════════════════════════════════════`);
    console.log(`\n[SEED] Genesis Status Breakdown:`);
    console.log(`  🟢 EXISTS:            ${summary.EXISTS}`);
    console.log(`  🔵 NEEDS_BUILD:       ${summary.NEEDS_BUILD}`);
    console.log(`  🟠 NEEDS_IMPROVEMENT: ${summary.NEEDS_IMPROVEMENT}`);
    console.log(`  ⚪ NOT_NEEDED:        ${summary.NOT_NEEDED}`);
    console.log(`  ❓ UNKNOWN:           ${summary.UNKNOWN}`);
    console.log(`\n[SEED] Audit Flag Breakdown:`);
    for (const [flag, count] of Object.entries(auditSummary).sort((a, b) => b[1] - a[1])) {
        console.log(`  ${flag.padEnd(16)} ${count}`);
    }
    console.log(`\n[SEED] ═══════════════════════════════════════════════════`);
    console.log(`[SEED] ✅ ComponentRegistry is live. Query with Prisma or view in swarm dashboard.`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
