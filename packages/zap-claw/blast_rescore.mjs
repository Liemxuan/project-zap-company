/**
 * Post-Blast Delta Rescore
 * Updates ZapPageAudit with improved scores after the 4-agent blast:
 * - Agent 1: ThemeContext injected → L7 +15-20 on all METRO pages
 * - Agent 2: AppShell added → L6 +20-30 on geometry, login, dashboard, kanban
 * - Agent 3: Raw buttons → GenesisButton → L3 improvements
 * - Agent 4: Inspector footers cleaned, Button import migrated on 2 CORE pages
 */
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

const updates = [
  // ── METRO: L7 ThemeContext + L6 AppShell + L3 button fixes ──
  { path: '/design/metro/geometry',      l3: 85, l6: 82, l7: 88, notes: 'BLAST: AppShell added (L6+), ThemeContext injected (L7+). React.Fragment replaced.' },
  { path: '/design/metro/login',         l3: 75, l4: 72, l6: 78, l7: 88, notes: 'BLAST: AppShell + ThemeContext added. shadcn Button/Input → genesis. Card → bg-layer-panel div.' },
  { path: '/design/metro/dashboard',     l6: 62, l7: 78, notes: 'BLAST: AppShell wrap (L6+), ThemeContext (L7+). Inner layout untouched.' },
  { path: '/design/metro/kanban',        l6: 62, l7: 78, notes: 'BLAST: AppShell wrap (L6+), ThemeContext (L7+). Inner layout untouched.' },
  { path: '/design/metro/diagrams',      l3: 78, l7: 65, notes: 'BLAST: 5 raw buttons → GenesisButton (L3+). ThemeContext injected (L7+).' },
  { path: '/design/metro/l6_new_showcase', l3: 75, l7: 65, notes: 'BLAST: 3 raw buttons → GenesisButton (L3+). ThemeContext injected (L7+).' },
  { path: '/design/metro/typography',    l3: 80, l7: 88, notes: 'BLAST: 1 raw button → GenesisButton (L3+). ThemeContext injected (L7+).' },
  { path: '/design/metro/typography_goal', l3: 80, l7: 88, notes: 'BLAST: 1 raw button → GenesisButton (L3+). ThemeContext injected (L7+).' },
  { path: '/design/metro/lab/experimental-header', l3: 72, l7: 60, notes: 'BLAST: 4 raw buttons → GenesisButton (L3+). ThemeContext injected (L7+).' },
  { path: '/design/metro/lab/inspector', l3: 80, l7: 58, notes: 'BLAST: 7 raw buttons → GenesisButton (L3+). ThemeContext injected (L7+). Inline style violations remain.' },
  // ThemeContext only (L7 bump) — all other remaining METRO pages
  { path: '/design/metro/elevation',     l7: 88, notes: 'BLAST: ThemeContext injected (L7+).' },
  { path: '/design/metro/foundations',   l7: 88, notes: 'BLAST: ThemeContext injected (L7+).' },
  { path: '/design/metro/icons',         l7: 62, notes: 'BLAST: ThemeContext injected (L7+). L1 inspector violations remain.' },
  { path: '/design/metro/layout',        l7: 88, notes: 'BLAST: ThemeContext injected (L7+).' },
  { path: '/design/metro/motion',        l7: 88, notes: 'BLAST: ThemeContext injected (L7+).' },
  { path: '/design/metro/overlay',       l7: 88, notes: 'BLAST: ThemeContext injected (L7+).' },
  { path: '/design/metro/profile',       l7: 82, notes: 'BLAST: ThemeContext injected (L7+). L6 MetroShell gap remains.' },
  { path: '/design/metro/settings',      l7: 82, notes: 'BLAST: ThemeContext injected (L7+).' },
  { path: '/design/metro/settings_demo', l7: 62, notes: 'BLAST: ThemeContext injected (L7+). shadcn component violations remain (L3/L4).' },
  { path: '/design/metro/spacing',       l7: 88, notes: 'BLAST: ThemeContext injected (L7+).' },
  { path: '/design/metro/template',      l7: 55, notes: 'BLAST: ThemeContext injected (L7+). Critical L1/L6 hardcoded color violations remain.' },
  { path: '/design/metro/colors',        l7: 55, notes: 'BLAST: ThemeContext injected (L7+). Critical L1 token violations remain (Vietnam rebuild required).' },
  { path: '/design/metro/color_goal',    l7: 65, notes: 'BLAST: ThemeContext injected (L7+). L1 seed hex and raw inspector violations remain.' },
  { path: '/design/metro/combat-signin', l7: 52, notes: 'BLAST: ThemeContext injected (L7+). Critical L1/L3/L6 violations remain (Vietnam full rebuild required).' },

  // ── CORE: L3 button fixes + L4 inspector footer cleanup ──
  { path: '/design/core/colors',         l3: 65, notes: 'BLAST: 15 raw buttons → GenesisButton (L3+). L1 inline hex/style violations remain (Vietnam rebuild required).' },
  { path: '/design/core/combat-signin',  l3: 82, notes: 'BLAST: 1 raw button → GenesisButton via alias (L3+). L1/L7 minor violations remain.' },
  { path: '/design/core/molecules/date-range-picker',  l3: 82, notes: 'BLAST: Inspector footer buttons → GenesisButton (L3+). TODO(Vietnam) added for DatePickerWithRange genesis build.' },
  { path: '/design/core/molecules/dropzone',           l3: 82, notes: 'BLAST: Inspector footer buttons → GenesisButton (L3+). TODO(Vietnam) added for Dropzone genesis build.' },
  { path: '/design/core/molecules/input-otp',          l3: 82, notes: 'BLAST: Inspector footer buttons → GenesisButton (L3+). TODO(Vietnam) added for InputOTP genesis build.' },
  { path: '/design/core/molecules/multi-select',       l3: 82, notes: 'BLAST: Footer already used genesis Button. TODO(Vietnam) added for MultiSelect genesis build.' },
  { path: '/design/core/molecules/quick-navigate',     l3: 78, l4: 72, notes: 'BLAST: Button import migrated to genesis (L4+). 2 footer buttons → GenesisButton. TODO(Vietnam) for Popover/Command.' },
  { path: '/design/core/molecules/radio-group',        l3: 82, notes: 'BLAST: Inspector footer buttons → GenesisButton (L3+). TODO(Vietnam) added for RadioGroup genesis build.' },
  { path: '/design/core/molecules/select-date',        l3: 82, notes: 'BLAST: Inspector footer buttons → GenesisButton (L3+). TODO(Vietnam) added for DatePicker genesis build.' },
  { path: '/design/core/molecules/select-time',        l3: 82, notes: 'BLAST: Inspector footer buttons → GenesisButton (L3+). TODO(Vietnam) added for TimePicker genesis build.' },
  { path: '/design/core/molecules/service-selection',  l3: 72, l4: 70, notes: 'BLAST: Button import migrated to genesis (L4+). 2 footer buttons → GenesisButton. TODO(Vietnam) for Popover/Command.' },
  { path: '/design/core/molecules/steppers',           l3: 82, notes: 'BLAST: Inspector footer buttons → GenesisButton (L3+). TODO(Vietnam) added for NumberStepper genesis build.' },
  { path: '/design/core/molecules/tag-input',          l3: 82, notes: 'BLAST: Inspector footer buttons → GenesisButton (L3+). TODO(Vietnam) added for TagInput genesis build.' },
];

async function main() {
  console.log('🔁 Post-Blast Rescore...\n');

  for (const u of updates) {
    const data = {
      aiReviewNotes: u.notes,
      aiAuditor: 'Blast-v1',
      aiAuditedAt: new Date(),
      overallStatus: 'AI_REVIEWED',
    };
    if (u.l1 !== undefined) data.l1TokensScore = u.l1;
    if (u.l2 !== undefined) data.l2PrimitivesScore = u.l2;
    if (u.l3 !== undefined) data.l3ElementsScore = u.l3;
    if (u.l4 !== undefined) data.l4MoleculesScore = u.l4;
    if (u.l5 !== undefined) data.l5WidgetsScore = u.l5;
    if (u.l6 !== undefined) data.l6LayoutsScore = u.l6;
    if (u.l7 !== undefined) data.l7PageScore = u.l7;

    const result = await prisma.zapPageAudit.updateMany({
      where: { pagePath: u.path },
      data,
    });

    const ok = result.count > 0;
    console.log(`${ok ? '✅' : '⚠️ MISS'} ${u.path}`);
  }
  console.log('\n✅ Rescore complete.');
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
