"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from "react";
import { Users, Activity, Terminal, Loader2, Bot, Shield, ScrollText, HeartPulse } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";

export default function SwarmDashboard() {
  const [containers, setContainers] = useState<any[]>([]);
  const [jobs, setJobs] = useState<any[]>([]);
  const [zssCount, setZssCount] = useState<number>(0);
  const [heartbeat, setHeartbeat] = useState<{ status: string; agents: { id: string; label: string; healthy: boolean; latencyMs: number }[] }>({ status: "CHECKING", agents: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const safeFetch = async (url: string) => {
      try {
        const res = await fetch(url);
        if (!res.ok) return null;
        return await res.json();
      } catch {
        return null;
      }
    };

    const fetchTelemetry = async () => {
      const [dockerData, jobsData, zssData, hbData] = await Promise.all([
        safeFetch("/api/swarm/docker"),
        safeFetch("/api/swarm/jobs"),
        safeFetch("/api/swarm/zss"),
        safeFetch("/api/swarm/heartbeat")
      ]);

      if (dockerData?.containers) setContainers(dockerData.containers);
      if (jobsData?.tasks) setJobs(jobsData.tasks);
      if (zssData?.count !== undefined) setZssCount(zssData.count);
      if (hbData?.agents) setHeartbeat(hbData);
      setLoading(false);
    };

    fetchTelemetry();
    const interval = setInterval(fetchTelemetry, 5000);
    return () => clearInterval(interval);
  }, []);

  const activeAgents = containers.filter(c => c.state === "running").length;
  const preventions = zssCount;

  return (
    <AppShell>
      <div className="flex flex-col h-full relative z-10">
        {/* Page Header — canonical ThemeHeader to enforce M3 pill styling */}
        <ThemeHeader
          title="Dashboard"
          breadcrumb="ZAP AI / Core Telemetry"
          badge=""
          liveIndicator={false}
          rightSlot={
            <nav className="flex items-center gap-4">
              {loading && <Loader2 className="size-4 animate-spin text-primary" />}
              <Link href="/security" className="bg-layer-cover border border-outline/10 px-4 py-2 hover:bg-layer-3 transition-colors rounded-[var(--button-border-radius,8px)] shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.08))]">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface flex items-center gap-1.5">
                  <Shield className="size-3" /> Security
                </Text>
              </Link>
              <Link href="/approvals" className="bg-layer-cover border border-outline/10 px-4 py-2 hover:bg-layer-3 transition-colors rounded-[var(--button-border-radius,8px)] shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.08))]">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface flex items-center gap-1.5">
                  <ScrollText className="size-3" /> Audit Log
                </Text>
              </Link>
              <Link href="/agents" className="bg-layer-cover border border-outline/10 px-4 py-2 hover:bg-layer-3 transition-colors rounded-[var(--button-border-radius,8px)] shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.08))]">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface">
                  Agents Registry
                </Text>
              </Link>
            </nav>
          }
        />

        {/* MAIN */}
        <main className="flex-1 px-5 md:px-12 py-8 flex flex-col gap-6 w-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* STAT CARD — Active Docker Agents */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.4 }} className="bg-layer-cover border border-outline/5 p-6 flex flex-col gap-4 rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.12))] hover:border-outline/10 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">
                  Active Docker Agents
                </Text>
                <div className="size-8 rounded-full bg-surface flex items-center justify-center border border-outline/5 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.06))]">
                  <Users className="size-4 text-primary" />
                </div>
              </div>
              <Heading level={1} className="text-on-surface tracking-tight">{activeAgents}</Heading>
            </motion.div>

            {/* STAT CARD — ZSS Intercepts */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.4 }} className="bg-layer-cover border border-outline/5 p-6 flex flex-col gap-4 rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.12))] hover:border-outline/10 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">
                  ZSS Intercepts
                </Text>
                <div className="size-8 rounded-full bg-error/10 flex items-center justify-center border border-error/20 shadow-[0_0_12px_rgba(255,0,0,0.1)]">
                  <Activity className="size-4 text-error" />
                </div>
              </div>
              <Heading level={1} className="text-error tracking-tight">{preventions}</Heading>
            </motion.div>

            {/* STAT CARD — Open Sandboxes */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.4 }} className="bg-layer-cover border border-outline/5 p-6 flex flex-col gap-4 rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.12))] hover:border-outline/10 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">
                  Open Sandboxes
                </Text>
                <div className="size-8 rounded-full bg-surface flex items-center justify-center border border-outline/5 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.06))]">
                  <Terminal className="size-4 text-on-surface-variant" />
                </div>
              </div>
              <Heading level={1} className="text-on-surface tracking-tight">{containers.length}</Heading>
            </motion.div>

            {/* STAT CARD — Claw Heartbeat */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.4 }} className="bg-layer-cover border border-outline/5 p-6 flex flex-col gap-3 rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.1))] hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.12))] hover:border-outline/10 hover:-translate-y-1 transition-all">
              <div className="flex items-center justify-between">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">
                  Claw Heartbeat
                </Text>
                <div className={`size-8 rounded-full flex items-center justify-center border shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.06))] ${
                  heartbeat.status === 'ALL_HEALTHY' ? 'bg-state-success/10 border-state-success/20' :
                  heartbeat.status === 'DEGRADED' ? 'bg-state-warning/10 border-state-warning/20' :
                  'bg-state-error/10 border-state-error/20'
                }`}>
                  <Activity className={`size-4 ${
                    heartbeat.status === 'ALL_HEALTHY' ? 'text-state-success' :
                    heartbeat.status === 'DEGRADED' ? 'text-state-warning' :
                    'text-state-error'
                  }`} />
                </div>
              </div>
              <div className="flex flex-col gap-1.5">
                {heartbeat.agents.map((a) => (
                  <div key={a.id} className="flex items-center gap-2">
                    <div className={`size-1.5 rounded-full ${a.healthy ? 'bg-state-success' : 'bg-state-error'}`} />
                    <Text size="body-small" className="text-on-surface-variant text-[11px] flex-1 truncate">{a.label}</Text>
                    <Text size="body-small" className={`text-[10px] font-mono ${a.healthy ? 'text-state-success' : 'text-state-error'}`}>
                      {a.healthy ? `${a.latencyMs}ms` : 'DOWN'}
                    </Text>
                  </div>
                ))}
                {heartbeat.agents.length === 0 && (
                  <Text size="body-small" className="text-on-surface-variant/50 text-[11px]">Checking...</Text>
                )}
              </div>
            </motion.div>
          </div>

          {/* DATA TABLE */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.5 }} className="flex-1 bg-layer-cover flex flex-col overflow-hidden border border-outline/10 rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-2,0_4px_8px_rgba(0,0,0,0.08))]">
            <div className="h-14 border-b border-outline/5 px-6 flex items-center bg-layer-panel">
              <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">
                Recent Execution Traces ({jobs.length})
              </Text>
            </div>
            <div className="flex-1 flex flex-col overflow-y-auto p-2">
              {jobs.length === 0 && !loading && (
                <div className="h-full flex flex-col items-center justify-center py-20 opacity-50">
                  <Terminal className="size-10 text-on-surface-variant mb-4" />
                  <Text size="body-small" className="text-on-surface-variant block">No tasks in the JobTicket Dead Letter Queue.</Text>
                </div>
              )}
              {jobs.map((job) => (
                <Link
                  key={job._id}
                  href={`/chats/${job.assignedAgentId}`}
                  className="group flex gap-4 p-4 hover:bg-layer-panel transition-all cursor-pointer rounded-[var(--card-radius,12px)] m-1 shadow-sm hover:shadow-md"
                >
                  <div className="size-8 shrink-0 rounded-[var(--button-border-radius,8px)] bg-primary/10 border border-primary/20 flex flex-col items-center justify-center text-primary mt-1 shadow-[0_2px_8px_rgba(var(--color-primary-rgb),0.1)]">
                    <Bot className="size-4" />
                  </div>

                  <div className="flex flex-col max-w-[85%] items-start">
                    <div className="flex items-center gap-2 mb-1 px-1">
                      <Text size="label-large" className="text-on-surface-variant font-medium">
                        {job.assignedAgentId ? job.assignedAgentId.replace(/^AGNT-OLY-/i, '').replace(/-/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase()) : 'OmniRouter AI'}
                      </Text>
                      <span className="text-on-surface-variant/40 text-[10px]">•</span>
                      <Text size="label-medium" className="text-on-surface-variant/70 uppercase">
                        {new Date(job.timestamp).toLocaleTimeString()}
                      </Text>
                      <span className="text-on-surface-variant/40 text-[10px]">•</span>
                      <div className="flex items-center gap-1.5">
                        <div className={`size-1.5 rounded-full ${job.status === 'PENDING_MCP_DISPATCH' ? 'bg-primary' : 'bg-success'}`}></div>
                        <Text size="label-small" className="text-on-surface-variant/70">{job.status}</Text>
                      </div>
                    </div>
                    <div className="p-4 bg-layer-cover text-on-surface rounded-[var(--layer-3-border-radius,16px)] rounded-tl-sm shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.08))] border border-outline/5 group-hover:border-primary/30 transition-colors">
                      <Text size="dev-wrapper" className="antialiased leading-relaxed line-clamp-2 md:line-clamp-3">
                        {typeof job.payload === 'object' ? (job.payload.intent || job.payload.systemPrompt || JSON.stringify(job.payload)) : String(job.payload)}
                      </Text>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        </main>
      </div>
    </AppShell>
  );
}
