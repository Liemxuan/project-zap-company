"use client";

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Puzzle, RefreshCw } from "lucide-react";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";

import { useQuery } from "@tanstack/react-query";

interface SkillData {
  name: string;
  cat: string;
  desc: string;
  path: string;
}

export default function SkillsDashboard() {
  const { data, isLoading, error, refetch, isFetching } = useQuery<{ success: boolean; skills: SkillData[] }>({
    queryKey: ['swarm-skills'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/skills');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    }
  });

  const skills = data?.skills || [];

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader 
          breadcrumb="Zap Swarm / Registry"
          title="Skills Library"
          badge={`${skills.length} Loaded`}
          liveIndicator={false}
        />
        
        <main className="flex-1 overflow-y-auto p-8">
          <div className="flex justify-between items-center mb-8 bg-layer-cover p-6 rounded-[var(--card-radius,12px)] border border-outline/10 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))]">
            <div className="flex flex-col gap-1 max-w-2xl">
              <Heading level={3} className="text-on-surface">Capability Plugins</Heading>
              <Text size="body-small" className="text-on-surface-variant">
                The skills directory scans `/.agent/skills/` globally to detect new workflow nodes dynamically. Click Resync to re-read the file system and upsert new markdown instructions into the Swarm index.
              </Text>
            </div>
            <Button
              variant="primary"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Scanning...' : 'Resync Skills Directory'}
            </Button>
          </div>

          {isLoading && <div className="text-on-surface-variant animate-pulse p-4">Scanning Master File System...</div>}
          {error && <div className="text-state-error bg-state-error/10 p-4 rounded-lg">Failed to connect to SYS_SKILLS collection.</div>}

          {!isLoading && !error && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {skills.map((s) => (
                <div key={s.name} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-5 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] hover:-translate-y-1 hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.1))] transition-all cursor-pointer group flex flex-col h-full">
                  <div className="flex justify-between items-start mb-4">
                    <div className="size-10 bg-primary/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center group-hover:bg-primary/20 transition-colors">
                      <Puzzle className="size-5 text-primary" />
                    </div>
                    <span className="px-2 py-0.5 rounded text-xs font-bold tracking-wide bg-state-info/10 text-state-info shrink-0">
                      {s.cat}
                    </span>
                  </div>
                  <Heading level={4} className="text-on-surface mb-2 tracking-tight break-all">{s.name}</Heading>
                  <Text size="body-small" className="text-on-surface-variant line-clamp-3 mb-4">{s.desc}</Text>
                  
                  <div className="mt-auto pt-4 border-t border-outline/5">
                    <Text size="label-small" className="text-on-surface-variant/70 font-mono truncate" title={s.path}>
                      {s.path}
                    </Text>
                  </div>
                </div>
              ))}
            </section>
          )}
        </main>
      </div>
    </AppShell>
  );
}
