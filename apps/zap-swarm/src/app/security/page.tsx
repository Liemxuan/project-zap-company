"use client";

export const dynamic = 'force-dynamic';

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import {
  Shield, ShieldCheck, ShieldAlert, Eye, Coins, KeyRound,
  ClipboardCheck, Container, Lock, Activity, AlertTriangle, RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";

interface PostureData {
  success: boolean;
  posture: {
    log_redaction: { status: string; detail: string };
    token_budgets: { status: string; detail: string; agents: { agentId: string; pct: number; tokens_used: number; monthly_limit: number }[] };
    agent_jwt: { status: string; detail: string };
    approval_gates: { status: string; detail: string; recent: { agent: string; action: string; timestamp: string; operator: string }[] };
    docker_hardening: { status: string; detail: string };
    skill_sandbox: { status: string; detail: string };
  };
  zss: { total: number; recent: any[] };
  budgets: { tenantId: string; limit: number; spent: number; pct: number }[];
  checkedAt: string;
}

const BLAST_CONFIG = [
  { key: "log_redaction", label: "BLAST 1 — Log Redaction", icon: Eye, description: "Regex scrubbing on all trace + HTTP logs" },
  { key: "token_budgets", label: "BLAST 2 — Token Budgets", icon: Coins, description: "Per-agent monthly token accounting" },
  { key: "agent_jwt", label: "BLAST 3 — Agent JWT", icon: KeyRound, description: "Scoped JWT auth on memory routes" },
  { key: "approval_gates", label: "BLAST 4 — Approval Gates", icon: ClipboardCheck, description: "Config change audit trail" },
  { key: "docker_hardening", label: "BLAST 5 — Docker Hardening", icon: Container, description: "cap_drop ALL + tmpfs isolation" },
  { key: "skill_sandbox", label: "BLAST 6 — Skill Sandbox", icon: Lock, description: "node:vm execution isolation" },
] as const;

function getStatusStyle(status: string) {
  switch (status) {
    case "ACTIVE":
    case "ENFORCING":
    case "HEALTHY":
      return { bg: "bg-state-success/10", border: "border-state-success/20", text: "text-state-success", dot: "bg-state-success", glow: "shadow-[0_0_20px_rgba(34,197,94,0.12)]" };
    case "WARNING":
    case "DEGRADED":
      return { bg: "bg-state-warning/10", border: "border-state-warning/20", text: "text-state-warning", dot: "bg-state-warning", glow: "shadow-[0_0_20px_rgba(234,179,8,0.12)]" };
    case "ARMED":
      return { bg: "bg-amber-500/10", border: "border-amber-500/20", text: "text-amber-400", dot: "bg-amber-400", glow: "" };
    case "DISABLED":
    case "DOWN":
      return { bg: "bg-state-error/10", border: "border-state-error/20", text: "text-state-error", dot: "bg-state-error", glow: "shadow-[0_0_20px_rgba(239,68,68,0.12)]" };
    default:
      return { bg: "bg-on-surface-variant/10", border: "border-outline/10", text: "text-on-surface-variant", dot: "bg-on-surface-variant", glow: "" };
  }
}

export default function SecurityPosturePage() {
  const { data, isLoading, isFetching, refetch } = useQuery<PostureData>({
    queryKey: ["security-posture"],
    queryFn: async () => {
      const res = await fetch("/api/swarm/security");
      if (!res.ok) throw new Error("Failed to fetch security posture");
      return res.json();
    },
    refetchInterval: 10000,
  });

  const posture = data?.posture;

  // Count healthy vs total
  const statuses = posture
    ? Object.values(posture).map((p) => p.status)
    : [];
  const healthyCount = statuses.filter(
    (s) => s === "ACTIVE" || s === "ENFORCING" || s === "HEALTHY"
  ).length;
  const totalCount = statuses.length;

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader
          breadcrumb="Zap Swarm / Security"
          title="Security Posture"
          badge={posture ? `${healthyCount}/${totalCount} Active` : ""}
          liveIndicator={true}
          rightSlot={
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="h-8 px-3 flex items-center gap-2 bg-layer-cover border border-outline/10 rounded-[var(--button-border-radius,8px)] text-xs font-medium text-on-surface-variant hover:text-on-surface transition-all"
            >
              <RefreshCw className={`size-3 ${isFetching ? "animate-spin text-primary" : ""}`} />
              Refresh
            </button>
          }
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
          {/* Overall Shield */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="flex items-center gap-6 mb-8 p-6 bg-layer-cover border border-outline/10 rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-2,0_4px_8px_rgba(0,0,0,0.08))]"
          >
            <div className={`size-16 rounded-2xl flex items-center justify-center ${healthyCount === totalCount ? "bg-state-success/10" : "bg-state-warning/10"}`}>
              {healthyCount === totalCount ? (
                <ShieldCheck className="size-8 text-state-success" />
              ) : (
                <ShieldAlert className="size-8 text-state-warning" />
              )}
            </div>
            <div>
              <Text size="body-large" weight="medium" className="text-on-surface tracking-tight block">
                {healthyCount === totalCount
                  ? "Operation Ironclad — All Defenses Active"
                  : `Operation Ironclad — ${healthyCount} of ${totalCount} Defenses Active`}
              </Text>
              <Text size="body-medium" className="text-on-surface-variant mt-1">
                {data?.checkedAt ? `Last checked: ${new Date(data.checkedAt).toLocaleTimeString()}` : "Checking..."}
              </Text>
            </div>
          </motion.div>

          {/* BLAST Cards Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : posture ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
              {BLAST_CONFIG.map((blast, i) => {
                const p = posture[blast.key as keyof typeof posture];
                const style = getStatusStyle(p.status);
                const Icon = blast.icon;

                return (
                  <motion.div
                    key={blast.key}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 + i * 0.08, duration: 0.4 }}
                    className={`relative p-6 rounded-[var(--card-radius,16px)] border bg-layer-cover ${style.border} ${style.glow} hover:shadow-[var(--shadow-elevation-2,0_4px_12px_rgba(0,0,0,0.1))] transition-all hover:-translate-y-0.5`}
                  >
                    {/* Status dot */}
                    <div className="absolute top-4 right-4 flex items-center gap-2">
                      <div className={`size-2 rounded-full ${style.dot} animate-pulse`} />
                      <Text size="label-small" weight="bold" className={`text-[10px] uppercase tracking-widest ${style.text}`}>
                        {p.status}
                      </Text>
                    </div>

                    <div className={`size-10 rounded-[var(--button-border-radius,8px)] ${style.bg} flex items-center justify-center mb-4`}>
                      <Icon className={`size-5 ${style.text}`} />
                    </div>

                    <Text size="label-medium" weight="bold" className="text-on-surface text-xs block mb-1">
                      {blast.label}
                    </Text>
                    <Text size="body-small" className="text-on-surface-variant text-xs block mb-3">
                      {blast.description}
                    </Text>

                    <div className="pt-3 border-t border-outline/5">
                      <Text size="body-small" className="text-on-surface-variant/70 text-[11px] font-mono">
                        {p.detail}
                      </Text>
                    </div>

                    {/* Token budget bars for BLAST 2 */}
                    {blast.key === "token_budgets" && "agents" in p && (
                      <div className="mt-3 space-y-2">
                        {(p as any).agents.slice(0, 3).map((agent: any) => (
                          <div key={agent.agentId} className="flex items-center gap-2">
                            <Text size="body-small" className="text-on-surface-variant text-[10px] w-20 truncate">
                              {agent.agentId}
                            </Text>
                            <div className="flex-1 h-1.5 bg-layer-panel rounded-full overflow-hidden">
                              <div
                                className={`h-full rounded-full transition-all ${agent.pct > 80 ? "bg-state-error" : agent.pct > 60 ? "bg-state-warning" : "bg-primary"}`}
                                style={{ width: `${Math.min(agent.pct, 100)}%` }}
                              />
                            </div>
                            <Text size="body-small" className="text-on-surface-variant text-[10px] w-8 text-right">
                              {agent.pct}%
                            </Text>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : null}

          {/* ZSS Intercept Feed */}
          {data?.zss && data.zss.total > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.4 }}
              className="bg-layer-cover border border-outline/10 rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))] overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-outline/5 bg-layer-panel/50 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-4 text-state-error" />
                  <Text size="label-medium" weight="bold" className="text-on-surface text-xs">
                    ZSS Intercept Feed
                  </Text>
                </div>
                <Text size="label-small" className="text-state-error text-[10px] font-bold tracking-wider uppercase">
                  {data.zss.total} Total Intercepts
                </Text>
              </div>
              <div className="divide-y divide-outline/5">
                {data.zss.recent.map((event: any, i: number) => (
                  <div key={event._id || i} className="px-6 py-3 flex items-center justify-between hover:bg-layer-panel/20 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="size-2 rounded-full bg-state-error" />
                      <Text size="body-small" className="text-on-surface text-xs">
                        {event.type || event.reason || "Security intercept"}
                      </Text>
                    </div>
                    <Text size="body-small" className="text-on-surface-variant text-xs font-mono">
                      {event.timestamp ? new Date(event.timestamp).toLocaleTimeString() : "—"}
                    </Text>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Budget Utilization */}
          {data?.budgets && data.budgets.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              className="mt-6"
            >
              <Heading level={4} className="text-on-surface mb-4 flex items-center gap-2 text-sm">
                <Coins className="size-4 text-primary" /> Tenant Budget Utilization
              </Heading>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.budgets.map((b, i) => (
                  <div key={b.tenantId || i} className="bg-layer-cover p-5 rounded-[var(--card-radius,12px)] border border-outline/10">
                    <div className="flex justify-between mb-2">
                      <Text size="label-medium" className="text-on-surface font-medium text-xs">{b.tenantId}</Text>
                      <Text size="label-small" className={`text-xs ${b.pct > 80 ? "text-state-error" : "text-on-surface-variant"}`}>
                        ${b.spent.toFixed(2)} / ${b.limit.toFixed(2)}
                      </Text>
                    </div>
                    <div className="h-2 bg-layer-panel rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${b.pct > 80 ? "bg-state-error" : "bg-primary"}`}
                        style={{ width: `${Math.min(b.pct, 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </main>
      </div>
    </AppShell>
  );
}
