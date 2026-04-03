"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { ScrollText, Search, ChevronDown, ChevronUp, Filter, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface Approval {
  _id: string;
  agentSlug: string;
  action: string;
  operator: string;
  timestamp: string;
  changes?: Record<string, any>;
  previousConfig?: Record<string, any>;
  newConfig?: Record<string, any>;
  metadata?: Record<string, any>;
}

export default function AuditLogPage() {
  const [page, setPage] = useState(1);
  const [agentFilter, setAgentFilter] = useState("");
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const limit = 25;

  const { data, isLoading, isFetching, refetch } = useQuery<{
    success: boolean;
    approvals: Approval[];
    total: number;
    pages: number;
  }>({
    queryKey: ["approvals", page, agentFilter],
    queryFn: async () => {
      const params = new URLSearchParams({ page: String(page), limit: String(limit) });
      if (agentFilter) params.set("agent", agentFilter);
      const res = await fetch(`/api/swarm/approvals?${params}`);
      if (!res.ok) throw new Error("Failed to fetch audit logs");
      return res.json();
    },
    refetchInterval: 15000,
  });

  const approvals = data?.approvals || [];
  const totalPages = data?.pages || 1;

  const formatTime = (ts: string) => {
    const d = new Date(ts);
    return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit", second: "2-digit" });
  };

  const getActionColor = (action: string) => {
    if (action === "SYNC" || action === "sync") return "bg-primary/10 text-primary";
    if (action === "SPAWN" || action === "spawn") return "bg-state-warning/10 text-state-warning";
    if (action === "DELETE" || action === "delete") return "bg-state-error/10 text-state-error";
    return "bg-on-surface-variant/10 text-on-surface-variant";
  };

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader
          breadcrumb="Zap Swarm / Security / Audit Trail"
          title="Approval Audit Log"
          badge={data?.total ? `${data.total} Events` : ""}
          liveIndicator={true}
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
          {/* Toolbar */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-on-surface-variant/50" />
              <input
                type="text"
                value={agentFilter}
                onChange={(e) => { setAgentFilter(e.target.value); setPage(1); }}
                placeholder="Filter by agent name..."
                className="w-full h-9 pl-9 pr-4 bg-layer-cover border border-outline/10 rounded-[var(--button-border-radius,8px)] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs transition-all"
              />
            </div>
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-9 px-4 flex items-center gap-2 bg-layer-cover border border-outline/10 rounded-[var(--button-border-radius,8px)] text-xs font-medium text-on-surface-variant hover:text-on-surface hover:border-outline/20 transition-all"
            >
              <RefreshCw className={`size-3 ${isFetching ? "animate-spin text-primary" : ""}`} />
              Refresh
            </button>
          </div>

          {/* Table */}
          <div className="bg-layer-cover border border-outline/10 rounded-[var(--card-radius,12px)] shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))] overflow-hidden">
            {/* Header */}
            <div className="grid grid-cols-[1fr_120px_140px_180px_40px] gap-4 px-6 py-3 border-b border-outline/5 bg-layer-panel/50 text-[10px] uppercase tracking-widest text-on-surface-variant/60 font-bold">
              <div>Agent</div>
              <div>Action</div>
              <div>Operator</div>
              <div>Timestamp</div>
              <div></div>
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : approvals.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 opacity-50">
                <ScrollText className="size-10 mb-4 text-on-surface-variant/30" />
                <Text size="body-small" className="text-on-surface-variant">No audit events recorded yet.</Text>
              </div>
            ) : (
              approvals.map((a) => (
                <div key={a._id}>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-[1fr_120px_140px_180px_40px] gap-4 px-6 py-4 border-b border-outline/5 hover:bg-layer-panel/30 transition-colors cursor-pointer items-center"
                    onClick={() => setExpandedRow(expandedRow === a._id ? null : a._id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <ScrollText className="size-3.5 text-primary" />
                      </div>
                      <Text size="label-medium" weight="bold" className="text-on-surface text-xs truncate">
                        {a.agentSlug || "unknown"}
                      </Text>
                    </div>
                    <div>
                      <span className={`px-2.5 py-1 rounded-[var(--button-border-radius,6px)] text-[10px] uppercase font-bold tracking-wider ${getActionColor(a.action)}`}>
                        {a.action || "UNKNOWN"}
                      </span>
                    </div>
                    <Text size="body-small" className="text-on-surface-variant text-xs truncate">
                      {a.operator || "system"}
                    </Text>
                    <Text size="body-small" className="text-on-surface-variant text-xs font-mono">
                      {formatTime(a.timestamp)}
                    </Text>
                    <div className="flex justify-center">
                      {expandedRow === a._id ? (
                        <ChevronUp className="size-4 text-on-surface-variant/50" />
                      ) : (
                        <ChevronDown className="size-4 text-on-surface-variant/50" />
                      )}
                    </div>
                  </motion.div>

                  {/* Expanded Detail */}
                  <AnimatePresence>
                    {expandedRow === a._id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 py-4 bg-layer-panel/20 border-b border-outline/5">
                          <Text size="label-small" weight="bold" className="text-on-surface-variant text-transform-tertiary mb-3 block">
                            Configuration Diff
                          </Text>
                          <pre className="text-xs font-mono text-on-surface-variant bg-layer-base p-4 rounded-[var(--button-border-radius,8px)] overflow-x-auto max-h-64 border border-outline/5">
                            {a.changes
                              ? JSON.stringify(a.changes, null, 2)
                              : a.newConfig
                              ? JSON.stringify(a.newConfig, null, 2)
                              : JSON.stringify(a.metadata || { detail: "No diff data captured" }, null, 2)}
                          </pre>
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
                Page {page} of {totalPages} ({data?.total || 0} events)
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
