"use client";

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { Clock } from "lucide-react";

export default function SessionsDashboard() {
  const sessions = [
    { id: "JERRY_SESSION_2026-03-29", status: "ACTIVE", turns: 14 },
    { id: "SPIKE_SESSION_2026-03-29", status: "PENDING", turns: 2 },
    { id: "HUD_SESSION_2026-03-28", status: "COMPLETED", turns: 8 },
  ];

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface p-8 relative z-10 w-full overflow-y-auto">
        <div className="flex flex-col gap-2 mb-8 relative z-10">
          <Text size="label-small" weight="bold" className="text-on-surface-variant text-transform-tertiary tracking-widest mb-1">
            zap swarm / registry
          </Text>
          <Heading level={2} className="text-on-surface tracking-tight flex items-center gap-3">
            <Clock className="size-6 text-primary" /> Active Sessions
          </Heading>
          <Text size="body-medium" className="text-on-surface-variant max-w-2xl">
            Live monitoring of ongoing agent threads and contextual state depth.
          </Text>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {sessions.map((s) => (
            <div key={s.id} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-5 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] flex justify-between items-center group">
              <div className="flex items-center gap-4">
                <div className="size-10 bg-primary/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center">
                  <Clock className="size-5 text-primary" />
                </div>
                <div>
                  <Heading level={4} className="text-on-surface mb-0.5">{s.id}</Heading>
                  <Text size="body-small" className="text-on-surface-variant">Context Depth: {s.turns} turns</Text>
                </div>
              </div>
              <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide ${s.status === 'ACTIVE' ? 'bg-state-success/10 text-state-success' : s.status === 'PENDING' ? 'bg-state-warning/10 text-state-warning' : 'bg-outline/10 text-on-surface-variant'}`}>
                {s.status}
              </span>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
