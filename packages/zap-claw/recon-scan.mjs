/**
 * RECON-SCAN.mjs — Agent: Recon (DOM Scanner)
 * 
 * Independent from Scout. Visits each page on localhost:3200 with a headless
 * browser, analyzes the rendered DOM structure, and writes findings to DB.
 * 
 * This provides a SECOND opinion — completely different method than Scout's
 * source code analysis. The Referee then compares both.
 * 
 * Usage: cd packages/zap-claw && node recon-scan.mjs
 */

import { PrismaClient } from '@prisma/client';
import puppeteer from 'puppeteer';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3200';

// DOM analysis — extract component structure from rendered page
async function analyzePage(page, url) {
    try {
        await page.goto(`${BASE_URL}${url}`, { waitUntil: 'networkidle2', timeout: 10000 });
    } catch {
        // Some pages may timeout or redirect — still try to analyze
        await new Promise(r => setTimeout(r, 2000));
    }

    const analysis = await page.evaluate(() => {
        const result = {
            shell: 'unknown',
            organisms: [],
            molecules: [],
            atoms: [],
            rawStats: {},
        };

        // Detect layout shell
        const sidebar = document.querySelector('[data-sidebar], .sidebar, aside, [class*="sidebar"]');
        const topbar = document.querySelector('header, [class*="header"], [class*="topbar"]');
        const authLayout = document.querySelector('[class*="branded"], [class*="auth-layout"]');
        const twoColGrid = document.querySelector('[class*="grid-cols-2"], [class*="lg:grid"]');

        if (authLayout || (twoColGrid && !sidebar)) {
            result.shell = 'BrandedLayout';
        } else if (sidebar && topbar) {
            result.shell = 'DashboardLayout';
        } else if (topbar) {
            result.shell = 'TopbarLayout';
        }

        // Detect UserHero
        const heroSection = document.querySelector('[class*="hero"], [class*="user-hero"], [class*="banner"]');
        if (heroSection) {
            result.organisms.push('UserHero');
        }

        // Detect Toolbar
        const toolbar = document.querySelector('[class*="toolbar"]');
        if (toolbar) {
            result.organisms.push('Toolbar');
        }

        // Detect Navigation
        const nav = document.querySelector('nav, [role="navigation"], [class*="navbar"], [class*="page-navbar"]');
        if (nav) {
            result.organisms.push('Navigation');
        }

        // Detect Dialogs/Modals
        const dialogs = document.querySelectorAll('[role="dialog"], [class*="dialog"], [class*="modal"]');
        if (dialogs.length > 0) {
            result.organisms.push(`Dialog (${dialogs.length})`);
        }

        // Detect Data Tables
        const tables = document.querySelectorAll('table, [role="grid"], [class*="data-grid"]');
        if (tables.length > 0) {
            result.organisms.push(`DataTable (${tables.length})`);
        }

        // Detect Card grids
        const cards = document.querySelectorAll('[class*="card"]');
        if (cards.length > 3) {
            result.organisms.push(`CardGrid (${cards.length} cards)`);
        }

        // --- MOLECULES ---

        // Detect Forms
        const forms = document.querySelectorAll('form');
        if (forms.length > 0) {
            result.molecules.push(`Form (${forms.length})`);
        }

        // Detect Tabs
        const tabs = document.querySelectorAll('[role="tab"], [class*="tab"]');
        if (tabs.length > 0) {
            result.molecules.push(`Tabs (${tabs.length})`);
        }

        // Detect Dropdowns
        const dropdowns = document.querySelectorAll('[class*="dropdown"], [role="menu"]');
        if (dropdowns.length > 0) {
            result.molecules.push(`Dropdown (${dropdowns.length})`);
        }

        // Detect Breadcrumbs
        const breadcrumbs = document.querySelector('[class*="breadcrumb"], [aria-label="breadcrumb"]');
        if (breadcrumbs) {
            result.molecules.push('Breadcrumbs');
        }

        // --- ATOMS ---

        // Count interactive elements
        const buttons = document.querySelectorAll('button, [role="button"], a.btn, [class*="btn"]');
        const inputs = document.querySelectorAll('input, textarea, select');
        const checkboxes = document.querySelectorAll('input[type="checkbox"], [role="checkbox"]');
        const switches = document.querySelectorAll('[role="switch"], [class*="switch"]');
        const badges = document.querySelectorAll('[class*="badge"]');
        const avatars = document.querySelectorAll('[class*="avatar"], img[class*="rounded-full"]');
        const alerts = document.querySelectorAll('[role="alert"], [class*="alert"]');
        const links = document.querySelectorAll('a:not(.btn)');

        if (buttons.length > 0) result.atoms.push(`Button (${buttons.length})`);
        if (inputs.length > 0) result.atoms.push(`Input (${inputs.length})`);
        if (checkboxes.length > 0) result.atoms.push(`Checkbox (${checkboxes.length})`);
        if (switches.length > 0) result.atoms.push(`Switch (${switches.length})`);
        if (badges.length > 0) result.atoms.push(`Badge (${badges.length})`);
        if (avatars.length > 0) result.atoms.push(`Avatar (${avatars.length})`);
        if (alerts.length > 0) result.atoms.push(`Alert (${alerts.length})`);
        if (links.length > 0) result.atoms.push(`Link (${links.length})`);

        // Raw stats for Referee comparison
        result.rawStats = {
            buttons: buttons.length,
            inputs: inputs.length,
            checkboxes: checkboxes.length,
            switches: switches.length,
            badges: badges.length,
            avatars: avatars.length,
            alerts: alerts.length,
            links: links.length,
            forms: forms.length,
            tables: tables.length,
            dialogs: dialogs.length,
            cards: cards.length,
        };

        return result;
    });

    return analysis;
}

async function main() {
    console.log('[RECON] 👁  Starting DOM scan...\n');

    // Get all tickets that need Recon scanning
    // We scan everything that has been scanned by Scout (or manually ripped)
    const tickets = await prisma.extractionTicket.findMany({
        where: {
            status: { in: ['DOM_RIPPED', 'DOM_RIPPED_UTILITY', 'SCANNED_BY_SCOUT', 'SCANNED_UTILITY'] }
        },
        orderBy: { urlPath: 'asc' },
    });

    console.log(`[RECON] Found ${tickets.length} tickets to DOM-scan\n`);

    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.setViewport({ width: 1440, height: 900 });

    let scanned = 0;
    const errors = [];
    const results = [];

    for (const ticket of tickets) {
        try {
            const analysis = await analyzePage(page, ticket.urlPath);

            // Store Recon's findings in a separate field pattern
            // We use the 'group' field to store Recon data as JSON (temporary)
            const reconData = JSON.stringify({
                shell: analysis.shell,
                organisms: analysis.organisms,
                molecules: analysis.molecules,
                atoms: analysis.atoms,
                rawStats: analysis.rawStats,
                scannedAt: new Date().toISOString(),
            });

            await prisma.extractionTicket.update({
                where: { urlPath: ticket.urlPath },
                data: {
                    // Store recon data in the 'group' field as JSON (will be used by Referee)
                    group: `RECON:${reconData}`,
                },
            });

            const orgCount = analysis.organisms.length;
            const molCount = analysis.molecules.length;
            const atomCount = analysis.atoms.length;
            console.log(`  ✓ ${ticket.urlPath} — shell:${analysis.shell} | ${orgCount} orgs, ${molCount} mols, ${atomCount} atoms`);
            results.push({ url: ticket.urlPath, analysis });
            scanned++;
        } catch (err) {
            console.log(`  ✗ ${ticket.urlPath} — ${err.message}`);
            errors.push({ url: ticket.urlPath, error: err.message });
        }
    }

    await browser.close();

    console.log(`\n[RECON] ═══════════════════════════════════════`);
    console.log(`[RECON] DOM scan complete.`);
    console.log(`[RECON]   Scanned: ${scanned}`);
    console.log(`[RECON]   Errors:  ${errors.length}`);
    console.log(`[RECON] ═══════════════════════════════════════`);
    console.log(`[RECON] Next step: Run referee-compare.mjs to cross-reference with Scout`);
}

main().catch(e => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
