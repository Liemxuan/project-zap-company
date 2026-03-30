"use client";

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { Puzzle } from "lucide-react";

export default function SkillsDashboard() {
  const skills = [
    { name: "zap-audit", cat: "Inspection", desc: "Validates DOM & Tokens" },
    { name: "frontend-design", cat: "Builder", desc: "Generates high-density UX" },
    { name: "dev-browser", cat: "Tooling", desc: "Playwright Headless Testing" },
    { name: "blast-protocol", cat: "Architecture", desc: "Enforces Level 7 Atoms" },
    { name: "agent-evaluator", cat: "Telemetry", desc: "Measures Model Burn Rate" },
  ];

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface p-8 relative z-10 w-full overflow-y-auto">
        <div className="flex flex-col gap-2 mb-8 relative z-10">
          <Text size="label-small" weight="bold" className="text-on-surface-variant text-transform-tertiary tracking-widest mb-1">
            zap swarm / registry
          </Text>
          <Heading level={2} className="text-on-surface tracking-tight flex items-center gap-3">
            <Puzzle className="size-6 text-primary" /> Skills Library
          </Heading>
          <Text size="body-medium" className="text-on-surface-variant max-w-2xl">
            Management matrix for OmniRouter specialized capabilities.
          </Text>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {skills.map((s) => (
            <div key={s.name} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-5 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] hover:-translate-y-1 hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.1))] transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="size-10 bg-primary/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center group-hover:bg-primary/20 transition-colors">
                  <Puzzle className="size-5 text-primary" />
                </div>
                <span className="px-2 py-0.5 rounded text-xs font-bold tracking-wide bg-state-info/10 text-state-info">
                  {s.cat}
                </span>
              </div>
              <Heading level={4} className="text-on-surface mb-1 truncate">{s.name}</Heading>
              <Text size="body-small" className="text-on-surface-variant block mb-2">{s.desc}</Text>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
