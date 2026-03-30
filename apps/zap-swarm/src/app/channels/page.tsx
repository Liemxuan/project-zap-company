"use client";

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { MessageSquare, Users } from "lucide-react";

import { useQuery } from "@tanstack/react-query";

interface ChannelData {
  name: string;
  status: string;
  users: number;
  ping: string;
}

export default function ChannelsDashboard() {
  const { data, isLoading, error } = useQuery<{ success: boolean; channels: ChannelData[] }>({
    queryKey: ['swarm-channels'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/channels');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  if (isLoading) return <div className="text-on-surface-variant animate-pulse p-8">Loading Channels Registry...</div>;
  if (error) return <div className="text-state-error bg-state-error/10 p-8 rounded-lg">Failed to connect to SYS_CHANNELS collection.</div>;

  const channels = data?.channels || [];


  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface p-8 relative z-10 w-full overflow-y-auto">
        <div className="flex flex-col gap-2 mb-8 relative z-10">
          <Text size="label-small" weight="bold" className="text-on-surface-variant text-transform-tertiary tracking-widest mb-1">
            zap swarm / registry
          </Text>
          <Heading level={2} className="text-on-surface tracking-tight flex items-center gap-3">
            <MessageSquare className="size-6 text-primary" /> Channels Matrix
          </Heading>
          <Text size="body-medium" className="text-on-surface-variant max-w-2xl">
            Gateway telemetry for external messaging platforms.
          </Text>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {channels.map((c) => (
            <div key={c.name} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-5 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] hover:-translate-y-1 hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.1))] transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="size-10 bg-primary/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center group-hover:bg-primary/20 transition-colors">
                  <MessageSquare className="size-5 text-primary" />
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold tracking-wide ${c.status === 'active' ? 'bg-state-success/10 text-state-success' : 'bg-state-warning/10 text-state-warning'}`}>
                  {c.status.toUpperCase()}
                </span>
              </div>
              <Heading level={4} className="text-on-surface mb-1 truncate">{c.name}</Heading>
              
              <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-outline/10 text-on-surface-variant">
                <Users className="size-3.5" />
                <Text size="body-small" weight="bold">{c.users} DAU</Text>
                <span className="mx-2 opacity-50">•</span>
                <Text size="body-small" className="font-mono">{c.ping}</Text>
              </div>
            </div>
          ))}
        </section>
      </div>
    </AppShell>
  );
}
