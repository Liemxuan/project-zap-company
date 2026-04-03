"use client";

export const dynamic = 'force-dynamic';

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { DollarSign, Activity, Cpu, TrendingUp, AlertTriangle, Clock, Flame, Server, FolderKanban } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

interface CostData {
  success: boolean;
  period: { days: number; since: string };
  totals: { totalTokens: number; totalCost: number; totalCalls: number };
  byModel: { _id: string; totalTokens: number; totalCost: number; calls: number }[];
  byAgent: { _id: string; totalTokens: number; totalCost: number; calls: number }[];
  byFleet: { _id: string; totalTokens: number; totalCost: number; calls: number; models: string[] }[];
  byProject: { _id: string; totalTokens: number; totalCost: number; calls: number; providers: string[] }[];
  budgets: { tenantId: string; budgetLimit: number; currentSpend: number }[];
  burnProjections: { agentId: string; avgDailyTokens: number; avgDailyCost: number; daysActive: number; monthlyLimit: number; tokensUsed: number; pctUsed: number; daysUntilExhaustion: number | null; exhaustionDate: string | null }[];
  topConversations: { _id: string; agent: string; model: string; totalTokens: number; totalCost: number; calls: number; lastActivity: string }[];
}

const formatTokens = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : n.toString();
const formatCost = (n: number) => `$${n.toFixed(4)}`;

export default function CostDashboard() {
  const [days, setDays] = useState(7);

  const { data, isLoading, error } = useQuery<CostData>({
    queryKey: ['swarm-cost', days],
    queryFn: async () => {
      const res = await fetch(`/api/swarm/cost?days=${days}`);
      if (!res.ok) throw new Error('Failed to fetch cost data');
      return res.json();
    },
    refetchInterval: 10000,
  });

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader 
          breadcrumb="Zap Swarm / Global Telemetry"
          title={
            <div className="flex items-center gap-3">
              <DollarSign className="size-6 text-primary" /> 
              <span>Cost Intelligence</span>
            </div>
          }
          liveIndicator={true}
          rightSlot={
            <div className="flex gap-1 bg-layer-panel rounded-lg p-1 border border-outline-dim">
              {[1, 7, 30].map(d => (
                <button
                  key={d}
                  onClick={() => setDays(d)}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${days === d ? 'bg-primary text-on-primary shadow-sm' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {d}d
                </button>
              ))}
            </div>
          }
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8 relative z-10 w-full">

        {isLoading && <div className="text-on-surface-variant animate-pulse">Loading cost data...</div>}
        {error && <div className="text-state-error bg-state-error/10 p-4 rounded-lg">Failed to load cost data.</div>}

        {data?.success && (
          <>
            {/* Top Stats */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-6 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 bg-primary/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center">
                    <DollarSign className="size-5 text-primary" />
                  </div>
                  <Text size="label-medium" className="text-on-surface-variant">Total Spend</Text>
                </div>
                <Heading level={3} className="text-on-surface">{formatCost(data.totals.totalCost)}</Heading>
                <Text size="body-small" className="text-on-surface-variant mt-1">Last {days} day{days > 1 ? 's' : ''}</Text>
              </div>

              <div className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-6 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 bg-state-success/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center">
                    <Activity className="size-5 text-state-success" />
                  </div>
                  <Text size="label-medium" className="text-on-surface-variant">Total Tokens</Text>
                </div>
                <Heading level={3} className="text-on-surface">{formatTokens(data.totals.totalTokens)}</Heading>
                <Text size="body-small" className="text-on-surface-variant mt-1">Prompt + Completion</Text>
              </div>

              <div className="bg-layer-cover shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] p-6 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))]">
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-10 bg-state-warning/10 rounded-[var(--button-border-radius,8px)] flex justify-center items-center">
                    <Cpu className="size-5 text-state-warning" />
                  </div>
                  <Text size="label-medium" className="text-on-surface-variant">API Calls</Text>
                </div>
                <Heading level={3} className="text-on-surface">{data.totals.totalCalls.toLocaleString()}</Heading>
                <Text size="body-small" className="text-on-surface-variant mt-1">Across all providers</Text>
              </div>
            </section>

            {/* ═══════ FLEET TIER BREAKDOWN ═══════ */}
            <section className="mb-8">
              <Heading level={4} className="text-on-surface mb-4 flex items-center gap-2">
                <Server className="size-4 text-primary" /> By Provider Fleet
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {(data.byFleet || []).map((f, i) => {
                  const fleetLabels: Record<string, { label: string; color: string; desc: string }> = {
                    ULTRA: { label: "Google Ultra", color: "text-state-error", desc: "Premium Precision Gateway" },
                    PRO: { label: "Google Pro", color: "text-primary", desc: "Code Workforce" },
                    GOOGLE_PRO: { label: "Google Pro", color: "text-primary", desc: "Code Workforce" },
                    OPENROUTER: { label: "OpenRouter", color: "text-state-warning", desc: "Frontier Bridge" },
                    LOCAL: { label: "Local / Ollama", color: "text-state-success", desc: "MacMini Watchdog" },
                    OLLAMA: { label: "Local / Ollama", color: "text-state-success", desc: "MacMini Watchdog" },
                    STANDARD: { label: "Standard", color: "text-on-surface-variant", desc: "Default tier" },
                  };
                  const meta = fleetLabels[f._id] || { label: f._id || "Unknown", color: "text-on-surface-variant", desc: "" };
                  const pctOfTotal = data.totals.totalCalls > 0 ? Math.round((f.calls / data.totals.totalCalls) * 100) : 0;

                  return (
                    <div key={f._id || i} className="bg-layer-cover border border-outline/5 p-5 rounded-[var(--card-radius,12px)] hover:border-outline/10 transition-all">
                      <div className="flex items-center justify-between mb-3">
                        <Text size="label-medium" weight="bold" className={`${meta.color}`}>{meta.label}</Text>
                        <Text size="body-small" className="text-on-surface-variant/50 text-[10px]">{pctOfTotal}% of calls</Text>
                      </div>
                      <Heading level={4} className="text-on-surface mb-1">{formatCost(f.totalCost)}</Heading>
                      <div className="flex items-center gap-3 mt-2">
                        <Text size="body-small" className="text-on-surface-variant text-[11px]">{f.calls} calls</Text>
                        <Text size="body-small" className="text-on-surface-variant text-[11px]">{formatTokens(f.totalTokens)} tokens</Text>
                      </div>
                      {f.models && f.models.length > 0 && (
                        <div className="mt-3 pt-3 border-t border-outline-dim/30">
                          <Text size="body-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider mb-1">Models</Text>
                          <div className="flex flex-wrap gap-1">
                            {f.models.filter(Boolean).slice(0, 3).map((m: string) => (
                              <span key={m} className="text-[9px] font-mono px-1.5 py-0.5 bg-layer-panel rounded-md text-on-surface-variant truncate max-w-[120px]">{m}</span>
                            ))}
                            {f.models.filter(Boolean).length > 3 && (
                              <span className="text-[9px] font-mono px-1.5 py-0.5 text-on-surface-variant/50">+{f.models.filter(Boolean).length - 3}</span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
                {(!data.byFleet || data.byFleet.length === 0) && (
                  <div className="col-span-4 py-8 text-center text-on-surface-variant/50"><Text size="body-small">No fleet data for this period.</Text></div>
                )}
              </div>
            </section>

            {/* ═══════ PROJECT BREAKDOWN ═══════ */}
            {data.byProject && data.byProject.length > 0 && (
              <section className="mb-8">
                <Heading level={4} className="text-on-surface mb-4 flex items-center gap-2">
                  <FolderKanban className="size-4 text-primary" /> By Project
                </Heading>
                <div className="flex flex-col gap-4">
                  {data.byProject.map((p: any, i: number) => {
                    const pctOfTotal = data.totals.totalCalls > 0 ? Math.round((p.calls / data.totals.totalCalls) * 100) : 0;
                    const pctOfCost = data.totals.totalCost > 0 ? Math.round((p.totalCost / data.totals.totalCost) * 100) : 0;

                    return (
                      <div key={p._id || i} className="bg-layer-cover border border-outline/5 rounded-[var(--card-radius,12px)] hover:border-outline/10 transition-all overflow-hidden">
                        {/* Project Header */}
                        <div className="p-5 pb-4 border-b border-outline-dim/30">
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <Text size="label-large" weight="bold" className="text-on-surface font-mono">{p._id || 'default'}</Text>
                              <div className="flex gap-1.5 mt-2">
                                {(p.providers || []).filter(Boolean).map((prov: string) => (
                                  <span key={prov} className="text-[10px] font-medium px-2 py-0.5 bg-primary/10 text-primary rounded-full">{prov}</span>
                                ))}
                                {(p.fleetTiers || []).filter((t: string) => t && t !== "STANDARD").map((tier: string) => {
                                  const tierColors: Record<string, string> = {
                                    ULTRA: "bg-state-error/10 text-state-error",
                                    PRO: "bg-primary/10 text-primary",
                                    OPENROUTER: "bg-state-warning/10 text-state-warning",
                                    OLLAMA: "bg-state-success/10 text-state-success",
                                  };
                                  return (
                                    <span key={tier} className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${tierColors[tier] || "bg-layer-panel text-on-surface-variant"}`}>{tier}</span>
                                  );
                                })}
                              </div>
                            </div>
                            <div className="text-right">
                              <Heading level={3} className="text-on-surface">{formatCost(p.totalCost)}</Heading>
                              <Text size="body-small" className="text-on-surface-variant/60 text-[11px]">{pctOfCost}% of total spend</Text>
                            </div>
                          </div>
                        </div>

                        {/* Stats Row */}
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 divide-x divide-outline-dim/20">
                          <div className="p-4">
                            <Text size="body-small" className="text-on-surface-variant/60 text-[10px] uppercase tracking-wider">Calls</Text>
                            <Text size="label-large" weight="bold" className="text-on-surface mt-1">{p.calls.toLocaleString()}</Text>
                            <Text size="body-small" className="text-on-surface-variant/50 text-[10px]">{pctOfTotal}% of traffic</Text>
                          </div>
                          <div className="p-4">
                            <Text size="body-small" className="text-on-surface-variant/60 text-[10px] uppercase tracking-wider">Total Tokens</Text>
                            <Text size="label-large" weight="bold" className="text-on-surface mt-1">{formatTokens(p.totalTokens)}</Text>
                          </div>
                          <div className="p-4">
                            <Text size="body-small" className="text-on-surface-variant/60 text-[10px] uppercase tracking-wider">Prompt</Text>
                            <Text size="label-large" weight="bold" className="text-on-surface mt-1">{formatTokens(p.promptTokens || 0)}</Text>
                          </div>
                          <div className="p-4">
                            <Text size="body-small" className="text-on-surface-variant/60 text-[10px] uppercase tracking-wider">Completion</Text>
                            <Text size="label-large" weight="bold" className="text-on-surface mt-1">{formatTokens(p.completionTokens || 0)}</Text>
                          </div>
                          <div className="p-4">
                            <Text size="body-small" className="text-on-surface-variant/60 text-[10px] uppercase tracking-wider">Avg / Call</Text>
                            <Text size="label-large" weight="bold" className="text-on-surface mt-1">{formatCost(p.avgCostPerCall || 0)}</Text>
                            <Text size="body-small" className="text-on-surface-variant/50 text-[10px]">{formatTokens(Math.round(p.avgTokensPerCall || 0))} tok</Text>
                          </div>
                          <div className="p-4">
                            <Text size="body-small" className="text-on-surface-variant/60 text-[10px] uppercase tracking-wider">Activity</Text>
                            <Text size="label-medium" className="text-on-surface mt-1">{p.lastActivity ? new Date(p.lastActivity).toLocaleDateString() : '–'}</Text>
                            <Text size="body-small" className="text-on-surface-variant/50 text-[10px]">{p.lastActivity ? new Date(p.lastActivity).toLocaleTimeString() : ''}</Text>
                          </div>
                        </div>

                        {/* Models & Agents Footer */}
                        <div className="px-5 py-3 bg-layer-panel/30 border-t border-outline-dim/20 flex flex-wrap gap-x-8 gap-y-2">
                          <div>
                            <Text size="body-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider mr-2">Models</Text>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(p.models || []).filter(Boolean).map((m: string) => (
                                <span key={m} className="text-[10px] font-mono px-2 py-0.5 bg-layer-cover border border-outline-dim/30 rounded-md text-on-surface-variant">{m}</span>
                              ))}
                            </div>
                          </div>
                          <div>
                            <Text size="body-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider mr-2">Agents</Text>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {(p.agents || []).filter(Boolean).map((a: string) => (
                                <span key={a} className="text-[10px] font-mono px-2 py-0.5 bg-layer-cover border border-outline-dim/30 rounded-md text-on-surface-variant">{a}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Model Breakdown */}
            <section className="mb-8">
              <Heading level={4} className="text-on-surface mb-4 flex items-center gap-2">
                <TrendingUp className="size-4 text-primary" /> By Model
              </Heading>
              <div className="bg-layer-cover rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-dim">
                      <th className="text-left px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Model</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Calls</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Tokens</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byModel.map((m, i) => (
                      <tr key={m._id || i} className="border-b border-outline-dim/50 hover:bg-layer-panel/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-on-surface font-mono">{m._id || 'unknown'}</td>
                        <td className="px-4 py-3 text-sm text-on-surface-variant text-right">{m.calls}</td>
                        <td className="px-4 py-3 text-sm text-on-surface-variant text-right">{formatTokens(m.totalTokens)}</td>
                        <td className="px-4 py-3 text-sm text-on-surface text-right font-medium">{formatCost(m.totalCost)}</td>
                      </tr>
                    ))}
                    {data.byModel.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-on-surface-variant">No model data for this period.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Agent Breakdown */}
            <section className="mb-8">
              <Heading level={4} className="text-on-surface mb-4 flex items-center gap-2">
                <Cpu className="size-4 text-primary" /> By Agent
              </Heading>
              <div className="bg-layer-cover rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-outline-dim">
                      <th className="text-left px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Agent</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Calls</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Tokens</th>
                      <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.byAgent.map((a, i) => (
                      <tr key={a._id || i} className="border-b border-outline-dim/50 hover:bg-layer-panel/50 transition-colors">
                        <td className="px-4 py-3 text-sm text-on-surface font-medium">{a._id || 'unknown'}</td>
                        <td className="px-4 py-3 text-sm text-on-surface-variant text-right">{a.calls}</td>
                        <td className="px-4 py-3 text-sm text-on-surface-variant text-right">{formatTokens(a.totalTokens)}</td>
                        <td className="px-4 py-3 text-sm text-on-surface text-right font-medium">{formatCost(a.totalCost)}</td>
                      </tr>
                    ))}
                    {data.byAgent.length === 0 && (
                      <tr><td colSpan={4} className="px-4 py-8 text-center text-on-surface-variant">No agent data for this period.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Budget Status */}
            {data.budgets.length > 0 && (
              <section>
                <Heading level={4} className="text-on-surface mb-4 flex items-center gap-2">
                  <DollarSign className="size-4 text-primary" /> Budget Status
                </Heading>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {data.budgets.map((b, i) => {
                    const pct = b.budgetLimit > 0 ? Math.min((b.currentSpend / b.budgetLimit) * 100, 100) : 0;
                    const isWarning = pct > 80;
                    return (
                      <div key={b.tenantId || i} className="bg-layer-cover p-5 rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))]">
                        <div className="flex justify-between mb-2">
                          <Text size="label-medium" className="text-on-surface font-medium">{b.tenantId}</Text>
                          <Text size="label-small" className={isWarning ? 'text-state-error' : 'text-on-surface-variant'}>
                            {formatCost(b.currentSpend)} / {formatCost(b.budgetLimit)}
                          </Text>
                        </div>
                        <div className="h-2 bg-layer-panel rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${isWarning ? 'bg-state-error' : 'bg-primary'}`}
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Burn Projections — BLAST 2 Enhancement */}
            {data.burnProjections && data.burnProjections.length > 0 && (
              <section className="mb-8">
                <Heading level={4} className="text-on-surface mb-4 flex items-center gap-2">
                  <Flame className="size-4 text-state-warning" /> Agent Burn Rate & Exhaustion
                </Heading>
                {/* Warning banner for agents >80% */}
                {data.burnProjections.some(bp => bp.pctUsed > 80) && (
                  <div className="mb-4 p-4 bg-state-error/10 border border-state-error/20 rounded-[var(--card-radius,12px)] flex items-center gap-3">
                    <AlertTriangle className="size-5 text-state-error shrink-0" />
                    <Text size="body-small" className="text-state-error font-medium">
                      ⚠️ {data.burnProjections.filter(bp => bp.pctUsed > 80).length} agent(s) exceeding 80% budget utilization
                    </Text>
                  </div>
                )}
                <div className="bg-layer-cover rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-dim">
                        <th className="text-left px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Agent</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Daily Avg</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Budget Used</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Days Left</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Exhaustion</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.burnProjections.map((bp, i) => (
                        <tr key={bp.agentId || i} className="border-b border-outline-dim/50 hover:bg-layer-panel/50 transition-colors">
                          <td className="px-4 py-3 text-sm text-on-surface font-medium">{bp.agentId || 'unknown'}</td>
                          <td className="px-4 py-3 text-sm text-on-surface-variant text-right font-mono">{formatTokens(bp.avgDailyTokens)}/day</td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <div className="w-16 h-1.5 bg-layer-panel rounded-full overflow-hidden">
                                <div className={`h-full rounded-full ${bp.pctUsed > 80 ? 'bg-state-error' : bp.pctUsed > 60 ? 'bg-state-warning' : 'bg-primary'}`} style={{ width: `${Math.min(bp.pctUsed, 100)}%` }} />
                              </div>
                              <span className={`text-xs font-bold ${bp.pctUsed > 80 ? 'text-state-error' : 'text-on-surface-variant'}`}>{bp.pctUsed}%</span>
                            </div>
                          </td>
                          <td className={`px-4 py-3 text-sm text-right font-bold ${bp.daysUntilExhaustion !== null && bp.daysUntilExhaustion < 7 ? 'text-state-error' : 'text-on-surface-variant'}`}>
                            {bp.daysUntilExhaustion !== null ? `${bp.daysUntilExhaustion}d` : '∞'}
                          </td>
                          <td className="px-4 py-3 text-xs text-on-surface-variant text-right font-mono">
                            {bp.exhaustionDate ? new Date(bp.exhaustionDate).toLocaleDateString() : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}

            {/* Top Expensive Conversations */}
            {data.topConversations && data.topConversations.length > 0 && (
              <section className="mb-8">
                <Heading level={4} className="text-on-surface mb-4 flex items-center gap-2">
                  <Clock className="size-4 text-primary" /> Top Expensive Conversations
                </Heading>
                <div className="bg-layer-cover rounded-[var(--card-radius,12px)] border border-[var(--color-outline-variant,rgba(0,0,0,0.05))] overflow-hidden">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-outline-dim">
                        <th className="text-left px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Session</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Agent</th>
                        <th className="text-left px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Model</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Tokens</th>
                        <th className="text-right px-4 py-3 text-xs font-medium text-on-surface-variant tracking-wider uppercase">Cost</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topConversations.map((tc, i) => (
                        <tr key={tc._id || i} className="border-b border-outline-dim/50 hover:bg-layer-panel/50 transition-colors">
                          <td className="px-4 py-3 text-xs text-on-surface font-mono truncate max-w-[200px]">{tc._id ? `...${String(tc._id).slice(-8)}` : '—'}</td>
                          <td className="px-4 py-3 text-sm text-on-surface font-medium">{tc.agent || '—'}</td>
                          <td className="px-4 py-3 text-xs text-on-surface-variant font-mono">{tc.model || '—'}</td>
                          <td className="px-4 py-3 text-sm text-on-surface-variant text-right">{formatTokens(tc.totalTokens)}</td>
                          <td className="px-4 py-3 text-sm text-on-surface text-right font-bold">{formatCost(tc.totalCost)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
        </main>
      </div>
    </AppShell>
  );
}
