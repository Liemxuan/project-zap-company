"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import {
  Zap, Clock, CheckCircle2, XCircle, Search, RefreshCw,
  ChevronDown, ChevronUp, Cpu, Activity, DollarSign,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface Execution {
  _id: string;
  botName: string;
  modelId: string;
  tokens: { total: number; prompt: number; completion: number };
  gatewayCharge: number;
  durationMs: number;
  status: string;
  timestamp: string;
  sessionId: string;
  tier: string;
}

interface ExecutionData {
  success: boolean;
  executions: Execution[];
  total: number;
  page: number;
  pages: number;
  today: {
    totalToday: number;
    avgDuration: number;
    totalTokensToday: number;
    totalCostToday: number;
    successRate: number;
  };
}

const formatTokens = (n: number) => n >= 1_000_000 ? `${(n / 1_000_000).toFixed(1)}M` : n >= 1_000 ? `${(n / 1_000).toFixed(1)}K` : n.toString();
const formatCost = (n: number) => `$${n.toFixed(4)}`;
const formatDuration = (ms: number) => ms >= 1000 ? `${(ms / 1000).toFixed(1)}s` : `${Math.round(ms)}ms`;

export default function ExecutionHistoryPage() {
  const [page, setPage] = useState(1);
  const [agentFilter, setAgentFilter] = useState("");
  const [days, setDays] = useState(7);
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const limit = 30;

  const { data, isLoading, isFetching, refetch } = useQuery<ExecutionData>({
    queryKey: ["execution-history", page, agentFilter, days],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit), days: String(days) });
      if (agentFilter) params.set("agent", agentFilter);
      const res = await fetch(`/api/swarm/execution?${params}`);
      if (!res.ok) throw new Error("Failed to fetch execution history");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const executions = data?.executions || [];
  const totalPages = data?.pages || 1;
  const today = data?.today;

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader
          breadcrumb="Zap Swarm / Operations"
          title="Execution History"
          badge={data?.total ? `${data.total} Traces` : ""}
          liveIndicator={true}
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
          {/* Today's Stats */}
          {today && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="bg-layer-cover border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="size-3.5 text-primary" />
                  <Text size="label-small" className="text-on-surface-variant text-[10px] uppercase tracking-wider">Today</Text>
                </div>
                <Heading level={4} className="text-on-surface">{today.totalToday.toLocaleString()}</Heading>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-layer-cover border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="size-3.5 text-state-warning" />
                  <Text size="label-small" className="text-on-surface-variant text-[10px] uppercase tracking-wider">Avg Latency</Text>
                </div>
                <Heading level={4} className="text-on-surface">{formatDuration(today.avgDuration)}</Heading>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-layer-cover border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="size-3.5 text-state-success" />
                  <Text size="label-small" className="text-on-surface-variant text-[10px] uppercase tracking-wider">Tokens</Text>
                </div>
                <Heading level={4} className="text-on-surface">{formatTokens(today.totalTokensToday)}</Heading>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-layer-cover border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                <div className="flex items-center gap-2 mb-2">
                  <DollarSign className="size-3.5 text-primary" />
                  <Text size="label-small" className="text-on-surface-variant text-[10px] uppercase tracking-wider">Cost</Text>
                </div>
                <Heading level={4} className="text-on-surface">{formatCost(today.totalCostToday)}</Heading>
              </motion.div>
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }} className="bg-layer-cover border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="size-3.5 text-state-success" />
                  <Text size="label-small" className="text-on-surface-variant text-[10px] uppercase tracking-wider">Success</Text>
                </div>
                <Heading level={4} className="text-on-surface">{today.successRate}%</Heading>
              </motion.div>
            </div>
          )}

          {/* Toolbar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-on-surface-variant/50" />
              <input
                type="text"
                value={agentFilter}
                onChange={(e) => { setAgentFilter(e.target.value); setPage(1); }}
                placeholder="Filter by agent..."
                className="w-full h-9 pl-9 pr-4 bg-layer-cover border border-outline/10 rounded-[var(--button-border-radius,8px)] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs transition-all"
              />
            </div>
            <div className="flex gap-1 bg-layer-panel rounded-lg p-1 border border-outline-dim">
              {[1, 7, 30].map(d => (
                <button
                  key={d}
                  onClick={() => { setDays(d); setPage(1); }}
                  className={`px-3 py-1 rounded-md text-xs font-medium transition-all ${days === d ? 'bg-primary text-on-primary' : 'text-on-surface-variant hover:text-on-surface'}`}
                >
                  {d}d
                </button>
              ))}
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 px-4 flex items-center gap-2 bg-layer-cover border border-outline/10 rounded-[var(--button-border-radius,8px)] text-xs font-medium text-on-surface-variant hover:text-on-surface transition-all"
            >
              <RefreshCw className={`size-3 ${isFetching ? "animate-spin text-primary" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Execution Table */}
          <div className="bg-layer-cover border border-outline/10 rounded-[var(--card-radius,12px)] shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))] overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-[1fr_140px_100px_80px_80px_80px_40px] gap-3 px-6 py-3 border-b border-outline/5 bg-layer-panel/50 text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
              <div>Agent</div>
              <div>Model</div>
              <div className="text-right">Tokens</div>
              <div className="text-right">Cost</div>
              <div className="text-right">Latency</div>
              <div className="text-center">Status</div>
              <div></div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : executions.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <Zap className="size-10 mb-4 text-on-surface-variant/30" />
                <Text size="body-small" className="text-on-surface-variant">No execution traces found.</Text>
              </div>
            ) : (
              executions.map((ex) => (
                <div key={ex._id}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-[1fr_140px_100px_80px_80px_80px_40px] gap-3 px-6 py-3 border-b border-outline/5 hover:bg-layer-panel/30 transition-colors cursor-pointer items-center"
                    onClick={() => setExpandedRow(expandedRow === ex._id ? null : ex._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <Cpu className="size-3 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <Text size="label-medium" weight="bold" className="text-on-surface text-xs truncate block">
                          {ex.botName || "unknown"}
                        </Text>
                        <Text size="body-small" className="text-on-surface-variant/50 text-[10px] font-mono">
                          {new Date(ex.timestamp).toLocaleTimeString()}
                        </Text>
                      </div>
                    </div>
                    <Text size="body-small" className="text-on-surface-variant text-[11px] font-mono truncate">
                      {ex.modelId || "—"}
                    </Text>
                    <Text size="body-small" className="text-on-surface-variant text-xs text-right font-mono">
                      {formatTokens(ex.tokens?.total || 0)}
                    </Text>
                    <Text size="body-small" className="text-on-surface text-xs text-right font-medium">
                      {formatCost(ex.gatewayCharge || 0)}
                    </Text>
                    <Text size="body-small" className="text-on-surface-variant text-xs text-right font-mono">
                      {ex.durationMs ? formatDuration(ex.durationMs) : "—"}
                    </Text>
                    <div className="flex justify-center">
                      {ex.status === "ERROR" ? (
                        <XCircle className="size-4 text-state-error" />
                      ) : (
                        <CheckCircle2 className="size-4 text-state-success" />
                      )}
                    </div>
                    <div className="flex justify-center">
                      {expandedRow === ex._id ? <ChevronUp className="size-3.5 text-on-surface-variant/50" /> : <ChevronDown className="size-3.5 text-on-surface-variant/50" />}
                    </div>
                  </motion.div>

                  <AnimatePresence>
                    {expandedRow === ex._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-layer-panel/20 border-b border-outline/5 grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div>
                            <Text size="label-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider block mb-1">Session</Text>
                            <Text size="body-small" className="text-on-surface font-mono text-[11px]">{ex.sessionId ? `...${ex.sessionId.slice(-12)}` : "—"}</Text>
                          </div>
                          <div>
                            <Text size="label-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider block mb-1">Tier</Text>
                            <Text size="body-small" className="text-on-surface font-medium text-xs">{ex.tier || "STANDARD"}</Text>
                          </div>
                          <div>
                            <Text size="label-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider block mb-1">Prompt Tokens</Text>
                            <Text size="body-small" className="text-on-surface font-mono text-xs">{formatTokens(ex.tokens?.prompt || 0)}</Text>
                          </div>
                          <div>
                            <Text size="label-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider block mb-1">Completion Tokens</Text>
                            <Text size="body-small" className="text-on-surface font-mono text-xs">{formatTokens(ex.tokens?.completion || 0)}</Text>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <Text size="body-small" className="text-on-surface-variant">
                Page {page} of {totalPages} ({data?.total || 0} traces)
              </Text>
              <div className="flex gap-2">
                <button
                  onClick={() => setPage(Math.max(1, page - 1))}
                  disabled={page <= 1}
                  className="px-3 py-1.5 bg-layer-cover border border-outline/10 rounded-[var(--button-border-radius,6px)] text-xs font-medium disabled:opacity-30 hover:bg-layer-panel transition-colors"
                >
                  Previous
                </button>
                <button
                  onClick={() => setPage(Math.min(totalPages, page + 1))}
                  disabled={page >= totalPages}
                  className="px-3 py-1.5 bg-layer-cover border border-outline/10 rounded-[var(--button-border-radius,6px)] text-xs font-medium disabled:opacity-30 hover:bg-layer-panel transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
    </AppShell>
  );
}
