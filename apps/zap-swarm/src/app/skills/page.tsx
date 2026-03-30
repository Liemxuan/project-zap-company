"use client";

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Puzzle, RefreshCw, Activity, CheckCircle, XCircle, Clock, Search, X, Bot, Shield, Wrench, Cpu } from "lucide-react";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { useState, useMemo } from "react";

import { useQuery } from "@tanstack/react-query";

// ── Types ──────────────────────────────────────────────

interface SkillData {
  name: string;
  dirName: string;
  group: string;
  agent: string;
  tags: string[];
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

// ── Agent Colors & Icons ───────────────────────────────

const AGENT_CONFIG: Record<string, { color: string; bg: string; icon: React.ReactNode; label: string }> = {
  spike:    { color: "text-blue-400", bg: "bg-blue-400/10", icon: <Wrench className="size-3" />, label: "Spike" },
  jerry:    { color: "text-amber-400", bg: "bg-amber-400/10", icon: <Shield className="size-3" />, label: "Jerry" },
  ralph:    { color: "text-purple-400", bg: "bg-purple-400/10", icon: <Bot className="size-3" />, label: "Ralph" },
  cso:      { color: "text-red-400", bg: "bg-red-400/10", icon: <Shield className="size-3" />, label: "CSO" },
  operator: { color: "text-emerald-400", bg: "bg-emerald-400/10", icon: <Cpu className="size-3" />, label: "Operator" },
  any:      { color: "text-on-surface-variant", bg: "bg-outline/10", icon: <Bot className="size-3" />, label: "Any" },
};

const GROUP_COLORS: Record<string, string> = {
  "ZAP Engine": "bg-blue-500/10 text-blue-400",
  "Frontend": "bg-violet-500/10 text-violet-400",
  "Backend": "bg-emerald-500/10 text-emerald-400",
  "DevOps": "bg-orange-500/10 text-orange-400",
  "DeerFlow": "bg-purple-500/10 text-purple-400",
  "GSD": "bg-sky-500/10 text-sky-400",
  "Agent": "bg-red-500/10 text-red-400",
  "Workflow": "bg-stone-500/10 text-stone-400",
  "MCP": "bg-yellow-500/10 text-yellow-400",
  "Research": "bg-pink-500/10 text-pink-400",
};

// ── Main Page ──────────────────────────────────────────

export default function SkillsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGroup, setActiveGroup] = useState<string | null>(null);
  const [activeAgent, setActiveAgent] = useState<string | null>(null);

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
    refetchInterval: 10_000,
  });

  const skills = data?.skills || [];
  const stats = execData?.stats || { total: 0, dispatched: 0, completed: 0, failed: 0 };
  const recentExecs = execData?.executions || [];

  // ── Derived data ──────────────────────────────────────
  const groups = useMemo(() => {
    const counts = new Map<string, number>();
    skills.forEach(s => counts.set(s.group || 'Uncategorized', (counts.get(s.group || 'Uncategorized') || 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [skills]);

  const agents = useMemo(() => {
    const counts = new Map<string, number>();
    skills.forEach(s => counts.set(s.agent || 'any', (counts.get(s.agent || 'any') || 0) + 1));
    return Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([name, count]) => ({ name, count }));
  }, [skills]);

  const filteredSkills = useMemo(() => {
    let result = skills;
    
    if (activeGroup) {
      result = result.filter(s => (s.group || 'Uncategorized') === activeGroup);
    }
    if (activeAgent) {
      result = result.filter(s => (s.agent || 'any') === activeAgent);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.desc.toLowerCase().includes(q) ||
        (s.group || '').toLowerCase().includes(q) ||
        (s.agent || '').toLowerCase().includes(q) ||
        (s.tags || []).some(t => t.includes(q)) ||
        (s.dirName && s.dirName.toLowerCase().includes(q))
      );
    }

    return result;
  }, [skills, activeGroup, activeAgent, searchQuery]);

  const hasActiveFilters = activeGroup || activeAgent || searchQuery.trim();

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
          {/* ── Search & Controls Bar ────────────────── */}
          <div className="flex gap-4 items-stretch mb-6">
            {/* Search Box */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search skills by name, tag, agent, or keyword..."
                className="w-full h-full pl-11 pr-10 bg-layer-cover border border-outline/10 rounded-[var(--card-radius,12px)] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30 transition-all text-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  title="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded hover:bg-outline/10 transition-colors"
                >
                  <X className="size-3.5 text-on-surface-variant/50" />
                </button>
              )}
            </div>
            
            <Button
              variant="primary"
              onClick={() => refetch()}
              disabled={isFetching}
              className="flex items-center gap-2 shrink-0"
            >
              <RefreshCw className={`size-4 ${isFetching ? 'animate-spin' : ''}`} />
              {isFetching ? 'Scanning...' : 'Resync'}
            </Button>
          </div>

          {/* ── Group Filter Chips ───────────────────── */}
          <div className="flex gap-2 mb-4 flex-wrap">
            <FilterChip
              label="All Groups"
              count={skills.length}
              active={activeGroup === null}
              onClick={() => setActiveGroup(null)}
            />
            {groups.map(g => (
              <FilterChip
                key={g.name}
                label={g.name}
                count={g.count}
                active={activeGroup === g.name}
                onClick={() => setActiveGroup(activeGroup === g.name ? null : g.name)}
                colorClass={GROUP_COLORS[g.name]}
              />
            ))}
          </div>

          {/* ── Agent Filter Chips ───────────────────── */}
          <div className="flex gap-2 mb-6 flex-wrap">
            {agents.map(a => {
              const cfg = AGENT_CONFIG[a.name] || AGENT_CONFIG.any;
              return (
                <button
                  key={a.name}
                  onClick={() => setActiveAgent(activeAgent === a.name ? null : a.name)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
                    activeAgent === a.name
                      ? `${cfg.bg} ${cfg.color} border-current ring-1 ring-current/20`
                      : 'border-outline/10 text-on-surface-variant/60 hover:border-outline/20 hover:text-on-surface-variant'
                  }`}
                >
                  {cfg.icon}
                  {cfg.label}
                  <span className="opacity-60">{a.count}</span>
                </button>
              );
            })}
          </div>

          {/* ── Execution Health Panel ────────────────── */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <StatCard label="Total Executions" value={stats.total} icon={<Activity className="size-4" />} color="text-primary" bgColor="bg-primary/10" />
            <StatCard label="In Flight" value={stats.dispatched} icon={<Clock className="size-4" />} color="text-state-warning" bgColor="bg-state-warning/10" />
            <StatCard label="Completed" value={stats.completed} icon={<CheckCircle className="size-4" />} color="text-state-success" bgColor="bg-state-success/10" />
            <StatCard label="Failed" value={stats.failed} icon={<XCircle className="size-4" />} color="text-state-error" bgColor="bg-state-error/10" />
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
                      <td className="px-5 py-2.5"><StatusBadge status={exec.status} /></td>
                      <td className="px-5 py-2.5 text-on-surface-variant/70 truncate max-w-[200px]" title={exec.input}>{exec.input?.substring(0, 60) || '—'}</td>
                      <td className="px-5 py-2.5 text-on-surface-variant/60 text-xs font-mono">{formatRelativeTime(exec.timestamp)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* ── Results Header ───────────────────────── */}
          {hasActiveFilters && (
            <div className="flex items-center justify-between mb-4">
              <Text size="body-small" className="text-on-surface-variant">
                Showing <span className="font-bold text-on-surface">{filteredSkills.length}</span> of {skills.length} skills
                {activeGroup && <> in <span className="font-bold text-on-surface">{activeGroup}</span></>}
                {activeAgent && <> assigned to <span className="font-bold text-on-surface">{AGENT_CONFIG[activeAgent]?.label || activeAgent}</span></>}
              </Text>
              <button
                onClick={() => { setSearchQuery(""); setActiveGroup(null); setActiveAgent(null); }}
                className="text-xs text-primary hover:text-primary/80 transition-colors"
              >
                Clear all filters
              </button>
            </div>
          )}

          {isLoading && <div className="text-on-surface-variant animate-pulse p-4">Scanning Master File System...</div>}
          {error && <div className="text-state-error bg-state-error/10 p-4 rounded-lg">Failed to connect to SYS_SKILLS collection.</div>}

          {!isLoading && !error && filteredSkills.length === 0 && hasActiveFilters && (
            <div className="text-center py-16 text-on-surface-variant/50">
              <Search className="size-12 mx-auto mb-4 opacity-30" />
              <Heading level={4} className="text-on-surface-variant/60 mb-2">No skills match your filters</Heading>
              <Text size="body-small" className="text-on-surface-variant/40">Try adjusting your search or clearing filters.</Text>
            </div>
          )}

          {!isLoading && !error && filteredSkills.length > 0 && (
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredSkills.map((s) => {
                const agentCfg = AGENT_CONFIG[s.agent] || AGENT_CONFIG.any;
                const groupColor = GROUP_COLORS[s.group] || "bg-outline/10 text-on-surface-variant";
                return (
                  <div key={s.name} className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-5 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] hover:-translate-y-1 hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.1))] transition-all cursor-pointer group flex flex-col h-full">
                    {/* Top row: icon + badges */}
                    <div className="flex justify-between items-start mb-3">
                      <div className="size-9 bg-primary/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center group-hover:bg-primary/20 transition-colors">
                        <Puzzle className="size-4 text-primary" />
                      </div>
                      <div className="flex gap-1.5 items-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-wide ${groupColor} shrink-0`}>
                          {s.group}
                        </span>
                        <span className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold ${agentCfg.bg} ${agentCfg.color}`}>
                          {agentCfg.icon}
                          {agentCfg.label}
                        </span>
                      </div>
                    </div>

                    {/* Skill name */}
                    <Heading level={4} className="text-on-surface mb-1.5 tracking-tight break-all text-sm">{s.name}</Heading>
                    <Text size="body-small" className="text-on-surface-variant line-clamp-2 mb-3 text-xs leading-relaxed">{s.desc}</Text>
                    
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1 mb-3">
                      {(s.tags || []).slice(0, 5).map(tag => (
                        <span
                          key={tag}
                          onClick={(e) => { e.stopPropagation(); setSearchQuery(tag); }}
                          className="px-1.5 py-0.5 rounded bg-outline/5 text-on-surface-variant/50 text-[10px] font-mono hover:bg-outline/10 hover:text-on-surface-variant/80 transition-colors cursor-pointer"
                        >
                          {tag}
                        </span>
                      ))}
                      {(s.tags || []).length > 5 && (
                        <span className="px-1.5 py-0.5 text-on-surface-variant/30 text-[10px]">
                          +{(s.tags || []).length - 5}
                        </span>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="mt-auto pt-3 border-t border-outline/5">
                      <Text size="label-small" className="text-on-surface-variant/50 font-mono truncate text-[10px]" title={s.path}>
                        {s.dirName || s.path}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </section>
          )}
        </main>
      </div>
    </AppShell>
  );
}

// ── Sub-components ──────────────────────────────────────

function FilterChip({ label, count, active, onClick, colorClass }: {
  label: string; count: number; active: boolean; onClick: () => void; colorClass?: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${
        active
          ? `${colorClass || 'bg-primary/10 text-primary'} border-current/20 ring-1 ring-current/10`
          : 'border-outline/10 text-on-surface-variant/50 hover:border-outline/20 hover:text-on-surface-variant'
      }`}
    >
      {label} <span className="opacity-50">{count}</span>
    </button>
  );
}

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
