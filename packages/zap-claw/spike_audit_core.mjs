import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Spike — CORE L1-L7 Audit Results
// Scores: 0-100. Any level < 70 = NEEDS WORK.
const auditResults = [
  // ── COMPLIANT ──
  {
    pagePath: '/design/core',
    l1: 90, l2: 90, l3: 88, l4: 85, l5: 88, l6: 85, l7: 82,
    notes: 'COMPLIANT. Root CORE page. Token system well-applied. All ZAP layer rules respected.',
  },
  {
    pagePath: '/design/core/elevation',
    l1: 88, l2: 90, l3: 85, l4: 84, l5: 88, l6: 85, l7: 80,
    notes: 'COMPLIANT. Elevation/shadow system correctly uses M3 tokens. No inline color overrides.',
  },
  {
    pagePath: '/design/core/icons',
    l1: 92, l2: 95, l3: 90, l4: 88, l5: 90, l6: 88, l7: 85,
    notes: 'COMPLIANT. Best scoring CORE page. Icon primitives properly structured. No raw <img> or inline styles.',
  },
  {
    pagePath: '/design/core/layout',
    l1: 90, l2: 90, l3: 88, l4: 88, l5: 88, l6: 90, l7: 88,
    notes: 'COMPLIANT. Layout shell usage is correct. MetroShell/AppShell hierarchy respected.',
  },
  {
    pagePath: '/design/core/motion',
    l1: 90, l2: 92, l3: 88, l4: 88, l5: 88, l6: 88, l7: 85,
    notes: 'COMPLIANT. Motion primitives use ZAP animation tokens. No custom keyframes.',
  },
  {
    pagePath: '/design/core/overlay',
    l1: 90, l2: 92, l3: 88, l4: 88, l5: 88, l6: 88, l7: 85,
    notes: 'COMPLIANT. Overlay z-depth assignments correct (bg-layer-modal z-[3000+]). Scrim usage proper.',
  },
  {
    pagePath: '/design/core/spacing',
    l1: 90, l2: 90, l3: 88, l4: 88, l5: 88, l6: 90, l7: 88,
    notes: 'COMPLIANT. Spacing tokens sourced from theme.json. No hardcoded px values.',
  },
  {
    pagePath: '/design/core/typography',
    l1: 88, l2: 88, l3: 78, l4: 82, l5: 88, l6: 85, l7: 80,
    notes: 'COMPLIANT. ThemeContext correctly wired. L3 slightly reduced: 1 raw <button> in inspector footer (line 160) — should use GenesisButton.',
  },
  {
    pagePath: '/design/core/molecules/card-number',
    l1: 85, l2: 85, l3: 80, l4: 80, l5: 85, l6: 80, l7: 80,
    notes: 'COMPLIANT. Card number molecule page well-structured. Minor: inspector footer uses raw <button> for publish actions.',
  },
  {
    pagePath: '/design/core/molecules/labeled-slider',
    l1: 85, l2: 85, l3: 82, l4: 80, l5: 85, l6: 82, l7: 80,
    notes: 'COMPLIANT. Labeled slider molecule correctly using Genesis primitives. Inspector footer raw <button> is the only violation.',
  },
  {
    pagePath: '/design/core/molecules/profile-switcher',
    l1: 85, l2: 85, l3: 80, l4: 80, l5: 85, l6: 80, l7: 80,
    notes: 'COMPLIANT. Profile switcher molecule page passes all levels. Raw <button> in publish footer noted.',
  },
  {
    pagePath: '/design/core/molecules/rating',
    l1: 85, l2: 85, l3: 82, l4: 80, l5: 85, l6: 82, l7: 80,
    notes: 'COMPLIANT. Rating molecule correctly uses Genesis atom. Inspector footer raw <button> only violation.',
  },
  {
    pagePath: '/design/core/molecules/user-session',
    l1: 85, l2: 85, l3: 80, l4: 80, l5: 85, l6: 80, l7: 78,
    notes: 'NEAR-COMPLIANT. L7 slightly reduced: missing "use client" directive. Inspector footer raw <button> noted.',
  },
  // ── NEEDS WORK ──
  {
    pagePath: '/design/core/colors',
    l1: 28, l2: 62, l3: 42, l4: 75, l5: 80, l6: 75, l7: 72,
    notes: 'CRITICAL. L1: 40+ style={{backgroundColor/color/borderColor}} inline overrides with hexFromArgb() computed values. Hardcoded hex literals: #cccccc, #FF5722, #FF68A5, #000, #fff, #F1F3F5, #E5E7EB, #2C3E50, #7F8C8D, #34495E, #4A642B, #8C4B54. Non-token Tailwind: text-zinc-400/500/600/700, bg-white, bg-zinc-50, border-zinc-200/300. L2: Raw <img src=> for seed preview (line 1385). L3: ~15 raw <button>, raw <input type="color">, raw <input type="file">.',
  },
  {
    pagePath: '/design/core/combat-signin',
    l1: 70, l2: 82, l3: 72, l4: 78, l5: 82, l6: 75, l7: 62,
    notes: 'NEEDS WORK. L7: No ThemeContext/useTheme import — no dynamic theme switching. L1: text-slate-500, text-slate-900, hover:text-blue-600 (lines 152-153) — non-token palette classes. L3: 1 raw <button> for password visibility toggle (line 111).',
  },
  {
    pagePath: '/design/core/geometry',
    l1: 80, l2: 85, l3: 80, l4: 82, l5: 85, l6: 60, l7: 62,
    notes: 'NEEDS WORK. L6: No AppShell or Canvas shell — bare React.Fragment wrapping GeometryBody. L7: No ThemeContext, no layout shell. Token usage at component level is fine.',
  },
  {
    pagePath: '/design/core/molecules/currency-input',
    l1: 85, l2: 85, l3: 72, l4: 75, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L3: CurrencyInput component sourced from @/components/ui/ (shadcn layer) — needs Genesis atom. Inspector footer raw <button> for publish actions.',
  },
  {
    pagePath: '/design/core/molecules/date-range-picker',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: DatePickerWithRange imported from @/components/ui/ (shadcn) — not from genesis/molecules. Molecule-under-test must be ZAP genesis. Inspector raw <button> also present.',
  },
  {
    pagePath: '/design/core/molecules/dropzone',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: Dropzone imported from @/components/ui/ (shadcn layer). Needs migration to genesis molecule. Inspector raw <button> present.',
  },
  {
    pagePath: '/design/core/molecules/input-otp',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: InputOTP from @/components/ui/ (shadcn). Needs genesis molecule version. Inspector raw <button> present.',
  },
  {
    pagePath: '/design/core/molecules/multi-select',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: MultiSelect from @/components/ui/ (shadcn). Genesis multi-select molecule required. Inspector raw <button> present.',
  },
  {
    pagePath: '/design/core/molecules/phone-number',
    l1: 85, l2: 85, l3: 72, l4: 75, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L3: PhoneNumber input uses raw <input> + shadcn composition instead of Genesis atom. Inspector raw <button> present.',
  },
  {
    pagePath: '/design/core/molecules/quick-navigate',
    l1: 82, l2: 82, l3: 68, l4: 62, l5: 80, l6: 78, l7: 78,
    notes: 'NEEDS WORK. L4: Popover + Command from @/components/ui/ (shadcn). L3: Button in combobox trigger from @/components/ui/button (shadcn), not genesis. L3: 4 raw <button> elements. Worst L4 score in CORE molecules.',
  },
  {
    pagePath: '/design/core/molecules/radio-group',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: RadioGroup from @/components/ui/ (shadcn). Needs genesis molecule. Inspector raw <button> present.',
  },
  {
    pagePath: '/design/core/molecules/select-date',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: DatePicker from @/components/ui/ (shadcn). Needs genesis molecule. Inspector raw <button> present.',
  },
  {
    pagePath: '/design/core/molecules/select-time',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: TimePicker from @/components/ui/ (shadcn). Needs genesis molecule. Inspector raw <button> present.',
  },
  {
    pagePath: '/design/core/molecules/service-selection',
    l1: 82, l2: 82, l3: 62, l4: 60, l5: 80, l6: 78, l7: 78,
    notes: 'NEEDS WORK. L3+L4: Uses Popover, Command, Button all from @/components/ui/ (shadcn). L3: Raw <input> search field (line 178) + 4 raw <button>. Joint worst L3+L4 in CORE molecules alongside quick-navigate.',
  },
  {
    pagePath: '/design/core/molecules/steppers',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: NumberStepper from @/components/ui/ (shadcn). Needs genesis molecule migration. Inspector raw <button> present.',
  },
  {
    pagePath: '/design/core/molecules/tag-input',
    l1: 85, l2: 85, l3: 75, l4: 68, l5: 82, l6: 80, l7: 80,
    notes: 'NEEDS WORK. L4: TagInput from @/components/ui/ (shadcn). Needs genesis molecule. Inspector raw <button> present.',
  },
];

async function main() {
  console.log('🔨 [Spike] Writing CORE L1-L7 audit results to database...\n');

  let compliant = 0;
  let needsWork = 0;

  for (const r of auditResults) {
    const scores = [r.l1, r.l2, r.l3, r.l4, r.l5, r.l6, r.l7];
    const overallScore = Math.round(scores.reduce((a, b) => a + b, 0) / 7);
    const isCompliant = scores.every(s => s >= 70);

    await prisma.zapPageAudit.upsert({
      where: { pagePath: r.pagePath },
      update: {
        theme: 'CORE',
        l1TokensScore: r.l1,
        l2PrimitivesScore: r.l2,
        l3ElementsScore: r.l3,
        l4MoleculesScore: r.l4,
        l5WidgetsScore: r.l5,
        l6LayoutsScore: r.l6,
        l7PageScore: r.l7,
        aiAuditor: 'Spike',
        aiReviewNotes: r.notes,
        aiAuditedAt: new Date(),
        overallStatus: 'AI_REVIEWED',
      },
      create: {
        pagePath: r.pagePath,
        theme: 'CORE',
        l1TokensScore: r.l1,
        l2PrimitivesScore: r.l2,
        l3ElementsScore: r.l3,
        l4MoleculesScore: r.l4,
        l5WidgetsScore: r.l5,
        l6LayoutsScore: r.l6,
        l7PageScore: r.l7,
        aiAuditor: 'Spike',
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
  console.log(`📊 Total: ${auditResults.length} CORE pages audited`);
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
