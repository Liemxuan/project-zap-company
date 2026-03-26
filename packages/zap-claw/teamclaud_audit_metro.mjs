import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Team Claud — METRO L1-L7 Audit Results
// Scores: 0-100. Any level < 70 = NEEDS WORK.
const auditResults = [
  // ── COMPLIANT ──
  {
    pagePath: '/design/metro',
    l1: 97, l2: 95, l3: 92, l4: 90, l5: 90, l6: 85, l7: 80,
    notes: 'COMPLIANT. Root METRO page. Properly structured. All token layers respected.',
  },
  {
    pagePath: '/design/metro/activities',
    l1: 96, l2: 95, l3: 95, l4: 90, l5: 90, l6: 88, l7: 78,
    notes: 'NEAR-COMPLIANT. L7: Missing ThemeContext import at page level (pervasive issue). Otherwise clean.',
  },
  {
    pagePath: '/design/metro/billing',
    l1: 94, l2: 95, l3: 93, l4: 90, l5: 90, l6: 87, l7: 78,
    notes: 'NEAR-COMPLIANT. L7: Missing ThemeContext import at page level. Token usage is clean.',
  },
  {
    pagePath: '/design/metro/elevation',
    l1: 80, l2: 90, l3: 85, l4: 88, l5: 88, l6: 88, l7: 72,
    notes: 'BORDERLINE. L7: Missing ThemeContext. L1: Minor inline style remnants. Structurally sound.',
  },
  {
    pagePath: '/design/metro/foundations',
    l1: 80, l2: 90, l3: 85, l4: 88, l5: 88, l6: 88, l7: 72,
    notes: 'BORDERLINE. L7: Missing ThemeContext. Foundations page is structurally OK.',
  },
  {
    pagePath: '/design/metro/layout',
    l1: 80, l2: 90, l3: 85, l4: 82, l5: 85, l6: 85, l7: 72,
    notes: 'BORDERLINE. L7: Missing ThemeContext. L4 slightly reduced — some inline molecule compositions.',
  },
  {
    pagePath: '/design/metro/motion',
    l1: 80, l2: 90, l3: 85, l4: 88, l5: 88, l6: 87, l7: 72,
    notes: 'BORDERLINE. L7: Missing ThemeContext. Motion primitives otherwise well-structured.',
  },
  {
    pagePath: '/design/metro/overlay',
    l1: 80, l2: 90, l3: 85, l4: 88, l5: 88, l6: 87, l7: 72,
    notes: 'BORDERLINE. L7: Missing ThemeContext. Overlay usage follows ZAP z-depth rules.',
  },
  {
    pagePath: '/design/metro/spacing',
    l1: 80, l2: 90, l3: 85, l4: 88, l5: 88, l6: 87, l7: 72,
    notes: 'BORDERLINE. L7: Missing ThemeContext. Spacing tokens mostly correct.',
  },
  {
    pagePath: '/design/metro/profile',
    l1: 92, l2: 93, l3: 93, l4: 88, l5: 90, l6: 70, l7: 65,
    notes: 'BORDERLINE. L6: Missing MetroShell wrapping — custom layout container. L7: Missing ThemeContext. L1/L2/L3 scores strong.',
  },
  {
    pagePath: '/design/metro/typography',
    l1: 82, l2: 88, l3: 65, l4: 78, l5: 85, l6: 80, l7: 75,
    notes: 'NEEDS WORK. L3: Raw <button> elements used for toolbar controls — should use GenesisButton. ThemeContext correctly imported (one of only 2 pages). L1 strong.',
  },
  {
    pagePath: '/design/metro/typography_goal',
    l1: 82, l2: 88, l3: 65, l4: 78, l5: 85, l6: 80, l7: 75,
    notes: 'NEEDS WORK. L3: Raw <button> elements in toolbar. ThemeContext correctly imported (one of only 2 pages). Goal state page — incomplete migration.',
  },
  // ── NEEDS WORK ──
  {
    pagePath: '/design/metro/color_goal',
    l1: 62, l2: 80, l3: 58, l4: 70, l5: 80, l6: 65, l7: 52,
    notes: 'NEEDS WORK. L1: Hardcoded #576500 seed color in className. L3: Raw <button> in color inspector panel. L7: Missing ThemeContext. Goal-state page with incomplete ZAP token migration.',
  },
  {
    pagePath: '/design/metro/colors',
    l1: 38, l2: 80, l3: 52, l4: 65, l5: 80, l6: 58, l7: 42,
    notes: 'CRITICAL. L1: Hardcoded hex in className (bg-[#F1F3F5], text-[#2C3E50]), style={{backgroundColor}} inline overrides throughout. L3: Raw <button> elements. L7: No ThemeContext. Most severe token violation on METRO.',
  },
  {
    pagePath: '/design/metro/combat-signin',
    l1: 28, l2: 75, l3: 48, l4: 58, l5: 75, l6: 32, l7: 38,
    notes: 'CRITICAL. L1: Right panel uses bg-white, bg-slate-50, bg-blue-600, bg-indigo-100 — zero token compliance. L6: No layout shell at all. L7: No ThemeContext. Complete token system bypass.',
  },
  {
    pagePath: '/design/metro/dashboard',
    l1: 65, l2: 80, l3: 65, l4: 70, l5: 80, l6: 38, l7: 48,
    notes: 'NEEDS WORK. L6: No MetroShell — custom inline flex h-screen layout composition. L7: No ThemeContext. Metronic dashboard pattern not yet migrated to ZAP shells.',
  },
  {
    pagePath: '/design/metro/diagrams',
    l1: 65, l2: 80, l3: 58, l4: 70, l5: 80, l6: 52, l7: 52,
    notes: 'NEEDS WORK. L3: Raw <button> in toolbar. L4: Uses text-muted-foreground/text-foreground shadcn tokens instead of M3. L6: No layout shell. L7: No ThemeContext.',
  },
  {
    pagePath: '/design/metro/geometry',
    l1: 72, l2: 85, l3: 75, l4: 80, l5: 85, l6: 28, l7: 52,
    notes: 'NEEDS WORK. L6: No layout shell at all — bare React.Fragment as root. L7: No ThemeContext. Token usage is otherwise acceptable.',
  },
  {
    pagePath: '/design/metro/icons',
    l1: 42, l2: 78, l3: 65, l4: 75, l5: 80, l6: 58, l7: 48,
    notes: 'CRITICAL. L1: Inspector panel uses bg-white, bg-zinc-100, text-slate-500, bg-black, text-white — zero token compliance in inspector component. L7: No ThemeContext.',
  },
  {
    pagePath: '/design/metro/kanban',
    l1: 65, l2: 80, l3: 65, l4: 70, l5: 80, l6: 38, l7: 48,
    notes: 'NEEDS WORK. L6: No MetroShell — same custom inline layout pattern as dashboard. L7: No ThemeContext. Kanban board not wrapped in ZAP layout shell.',
  },
  {
    pagePath: '/design/metro/l6_new_showcase',
    l1: 65, l2: 85, l3: 58, l4: 70, l5: 80, l6: 55, l7: 52,
    notes: 'NEEDS WORK. L3: Raw <button> elements. L4: bg-background/text-foreground shadcn tokens instead of M3. L7: No ThemeContext. Showcase page not yet fully ZAP-compliant.',
  },
  {
    pagePath: '/design/metro/lab/assets',
    l1: 58, l2: 68, l3: 58, l4: 62, l5: 68, l6: 48, l7: 42,
    notes: 'NEEDS WORK. Lab proxy wrapper — no ZAP architecture implemented. Passes traffic through without L1-L7 compliance. No layout shell, no ThemeContext, no token system.',
  },
  {
    pagePath: '/design/metro/lab/experimental-header',
    l1: 38, l2: 68, l3: 52, l4: 62, l5: 72, l6: 48, l7: 42,
    notes: 'NEEDS WORK. L1: Hardcoded bg-[#5A6B29], bg-red-500/10 — raw Tailwind palette. L2: Inline SVG used directly. L3: Raw <button> elements. L7: No ThemeContext. Experimental — not production ready.',
  },
  {
    pagePath: '/design/metro/lab/inspector',
    l1: 48, l2: 68, l3: 58, l4: 62, l5: 72, l6: 48, l7: 42,
    notes: 'NEEDS WORK. L1: style={{backgroundColor}} inline overrides. L2: Raw <img> for seed thumbnails. L3: Raw <button> for inspector actions. L7: No ThemeContext. Lab-grade code.',
  },
  {
    pagePath: '/design/metro/lab/swarm',
    l1: 58, l2: 68, l3: 58, l4: 62, l5: 68, l6: 48, l7: 42,
    notes: 'NEEDS WORK. Lab proxy wrapper — no ZAP architecture. Same issues as lab/assets. No layout shell, no ThemeContext.',
  },
  {
    pagePath: '/design/metro/login',
    l1: 70, l2: 85, l3: 38, l4: 52, l5: 72, l6: 52, l7: 48,
    notes: 'CRITICAL. L3: All components from shadcn @/components/ui/ — Button, Input, Card — no Genesis atoms used at all. L4: Shadcn Card used as molecule. L7: No ThemeContext. Full genesis adoption required.',
  },
  {
    pagePath: '/design/metro/settings_demo',
    l1: 65, l2: 80, l3: 38, l4: 52, l5: 72, l6: 52, l7: 48,
    notes: 'CRITICAL. L3: All components from shadcn — Button, Input, Label, Switch. L3: Raw <button> in sidebar. L4: Shadcn Form composition. L7: No ThemeContext. Needs full Genesis atom adoption.',
  },
  {
    pagePath: '/design/metro/template',
    l1: 38, l2: 72, l3: 48, l4: 58, l5: 72, l6: 38, l7: 38,
    notes: 'CRITICAL. L1: Inspector wireframe uses bg-slate-50, bg-white, bg-blue-500 throughout. L3: Raw <div> used as buttons. L6: No layout shell. L7: No ThemeContext. Template page requires complete L1-L7 rebuild.',
  },
];

async function main() {
  console.log('🤖 [Team Claud] Writing METRO L1-L7 audit results to database...\n');

  let compliant = 0;
  let needsWork = 0;

  for (const r of auditResults) {
    const overallScore = Math.round((r.l1 + r.l2 + r.l3 + r.l4 + r.l5 + r.l6 + r.l7) / 7);
    const isCompliant = [r.l1, r.l2, r.l3, r.l4, r.l5, r.l6, r.l7].every(s => s >= 70);

    await prisma.zapPageAudit.upsert({
      where: { pagePath: r.pagePath },
      update: {
        theme: 'METRO',
        l1TokensScore: r.l1,
        l2PrimitivesScore: r.l2,
        l3ElementsScore: r.l3,
        l4MoleculesScore: r.l4,
        l5WidgetsScore: r.l5,
        l6LayoutsScore: r.l6,
        l7PageScore: r.l7,
        aiAuditor: 'Team Claud',
        aiReviewNotes: r.notes,
        aiAuditedAt: new Date(),
        overallStatus: isCompliant ? 'AI_REVIEWED' : 'AI_REVIEWED',
      },
      create: {
        pagePath: r.pagePath,
        theme: 'METRO',
        l1TokensScore: r.l1,
        l2PrimitivesScore: r.l2,
        l3ElementsScore: r.l3,
        l4MoleculesScore: r.l4,
        l5WidgetsScore: r.l5,
        l6LayoutsScore: r.l6,
        l7PageScore: r.l7,
        aiAuditor: 'Team Claud',
        aiReviewNotes: r.notes,
        aiAuditedAt: new Date(),
        overallStatus: 'AI_REVIEWED',
      },
    });

    const flag = isCompliant ? '✅' : '⚠️ ';
    console.log(`${flag} [${overallScore}] ${r.pagePath}`);
    if (isCompliant) compliant++; else needsWork++;
  }

  console.log('\n──────────────────────────────────────────');
  console.log(`✅ COMPLIANT (all levels ≥ 70): ${compliant}`);
  console.log(`⚠️  NEEDS WORK (any level < 70): ${needsWork}`);
  console.log(`📊 Total: ${auditResults.length} METRO pages audited`);
  console.log('──────────────────────────────────────────');
  console.log('\n📁 Average Scores Per Level:');
  const levels = ['l1','l2','l3','l4','l5','l6','l7'];
  const names  = ['L1 Tokens','L2 Primitives','L3 Elements','L4 Molecules','L5 Widgets','L6 Layouts','L7 Route'];
  levels.forEach((l, i) => {
    const avg = (auditResults.reduce((sum, r) => sum + r[l], 0) / auditResults.length).toFixed(1);
    console.log(`  ${names[i]}: ${avg}`);
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
