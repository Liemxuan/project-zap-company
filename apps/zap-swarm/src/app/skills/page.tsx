"use client";

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Puzzle, RefreshCw, Activity, CheckCircle, XCircle, Clock } from "lucide-react";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";

import { useQuery } from "@tanstack/react-query";

interface SkillData {
  name: string;
  cat: string;
  desc: string;
  path: string;
}

interface ExecutionStats {
  total: number;
  dispatched: number;
  completed: number;
  failed: number;
}

interface ExecutionRecord {
  _id: string;
  skillName: string;
  status: string;
  agentId: string;
  timestamp: string;
  input: string;
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

  const { data: execData } = useQuery<{ success: boolean; executions: ExecutionRecord[]; stats: ExecutionStats }>({
    queryKey: ['swarm-skill-executions'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/skills/executions?limit=10');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 10_000, // poll every 10s
  });

  const skills = data?.skills || [];
  const stats = execData?.stats || { total: 0, dispatched: 0, completed: 0, failed: 0 };
  const recentExecs = execData?.executions || [];

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
          {/* ── Header Card ──────────────────────────── */}
          <div className="flex justify-between items-center mb-6 bg-layer-cover p-6 rounded-[var(--card-radius,12px)] border border-outline/10 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))]">
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

          {/* ── Execution Health Panel ────────────────── */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard 
              label="Total Executions" 
              value={stats.total} 
              icon={<Activity className="size-4" />}
              color="text-primary"
              bgColor="bg-primary/10"
            />
            <StatCard 
              label="In Flight" 
              value={stats.dispatched} 
              icon={<Clock className="size-4" />}
              color="text-state-warning"
              bgColor="bg-state-warning/10"
            />
            <StatCard 
              label="Completed" 
              value={stats.completed} 
              icon={<CheckCircle className="size-4" />}
              color="text-state-success"
              bgColor="bg-state-success/10"
            />
            <StatCard 
              label="Failed" 
              value={stats.failed} 
              icon={<XCircle className="size-4" />}
              color="text-state-error"
              bgColor="bg-state-error/10"
            />
          </div>

          {/* ── Recent Executions Table ───────────────── */}
          {recentExecs.length > 0 && (
            <div className="mb-8 bg-layer-cover rounded-[var(--card-radius,12px)] border border-outline/10 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))] overflow-hidden">
              <div className="px-5 py-3 border-b border-outline/5">
                <Heading level={4} className="text-on-surface text-sm">Recent Executions</Heading>
              </div>
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-on-surface-variant/70 border-b border-outline/5">
                    <th className="px-5 py-2 font-medium">Skill</th>
                    <th className="px-5 py-2 font-medium">Agent</th>
                    <th className="px-5 py-2 font-medium">Status</th>
                    <th className="px-5 py-2 font-medium">Input</th>
                    <th className="px-5 py-2 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {recentExecs.map((exec) => (
                    <tr key={exec._id} className="border-b border-outline/5 last:border-0 hover:bg-layer-cover/50 transition-colors">
                      <td className="px-5 py-2.5 font-mono text-xs text-on-surface">{exec.skillName}</td>
                      <td className="px-5 py-2.5 text-on-surface-variant">{exec.agentId}</td>
                      <td className="px-5 py-2.5">
                        <StatusBadge status={exec.status} />
                      </td>
                      <td className="px-5 py-2.5 text-on-surface-variant/70 truncate max-w-[200px]" title={exec.input}>
                        {exec.input?.substring(0, 60) || '—'}
                      </td>
                      <td className="px-5 py-2.5 text-on-surface-variant/60 text-xs font-mono">
                        {formatRelativeTime(exec.timestamp)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

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

// ── Sub-components ──────────────────────────────────

function StatCard({ label, value, icon, color, bgColor }: {
  label: string; value: number; icon: React.ReactNode; color: string; bgColor: string;
}) {
  return (
    <div className="bg-layer-cover p-4 rounded-[var(--card-radius,12px)] border border-outline/10 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))]">
      <div className="flex items-center gap-2 mb-2">
        <div className={`size-7 ${bgColor} rounded-md flex items-center justify-center ${color}`}>
          {icon}
        </div>
        <Text size="label-small" className="text-on-surface-variant">{label}</Text>
      </div>
      <Heading level={2} className={`${color} text-2xl font-bold tabular-nums`}>
        {value.toLocaleString()}
      </Heading>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { bg: string; text: string; label: string }> = {
    DISPATCHED: { bg: 'bg-state-warning/10', text: 'text-state-warning', label: 'In Flight' },
    COMPLETED: { bg: 'bg-state-success/10', text: 'text-state-success', label: 'Completed' },
    FAILED: { bg: 'bg-state-error/10', text: 'text-state-error', label: 'Failed' },
  };
  const c = config[status] || { bg: 'bg-outline/10', text: 'text-on-surface-variant', label: status };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold ${c.bg} ${c.text}`}>
      {c.label}
    </span>
  );
}

function formatRelativeTime(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  
  if (diffMs < 60_000) return 'just now';
  if (diffMs < 3_600_000) return `${Math.floor(diffMs / 60_000)}m ago`;
  if (diffMs < 86_400_000) return `${Math.floor(diffMs / 3_600_000)}h ago`;
  return `${Math.floor(diffMs / 86_400_000)}d ago`;
}
