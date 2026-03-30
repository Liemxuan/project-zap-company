"use client";

import { useState, useEffect } from "react";
import { Users, Activity, Terminal, Loader2 } from "lucide-react";
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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTelemetry = async () => {
      try {
        const [dockerRes, jobsRes, zssRes] = await Promise.all([
          fetch("/api/swarm/docker"),
          fetch("/api/swarm/jobs"),
          fetch("/api/swarm/zss")
        ]);

        const dockerData = await dockerRes.json();
        const jobsData = await jobsRes.json();
        const zssData = await zssRes.json();

        if (dockerData.containers) setContainers(dockerData.containers);
        if (jobsData.tasks) setJobs(jobsData.tasks);
        if (zssData.count !== undefined) setZssCount(zssData.count);
      } catch (err) {
        console.error("Failed to fetch swarm telemetry");
      } finally {
        setLoading(false);
      }
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
          breadcrumb="Zap Swarm / Core Telemetry"
          badge=""
          liveIndicator={false}
          rightSlot={
            <nav className="flex items-center gap-4">
              {loading && <Loader2 className="size-4 animate-spin text-primary" />}
              <Link href="/agents" className="bg-layer-cover border border-outline/10 px-4 py-2 hover:bg-layer-3 transition-colors rounded-[var(--button-border-radius,8px)] shadow-[var(--shadow-elevation-1,0_1px_3px_rgba(0,0,0,0.08))]">
                <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface">
                  Agents Registry
                </Text>
              </Link>
            </nav>
          }
        />

        {/* MAIN */}
        <main className="flex-1 px-8 py-6 flex flex-col gap-6 max-w-7xl mx-auto w-full overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  className="group flex flex-col md:flex-row md:items-center justify-between p-4 bg-transparent border border-transparent hover:border-outline/5 hover:bg-layer-panel transition-all cursor-pointer rounded-[var(--card-radius,12px)] m-1 shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))] hover:shadow-[var(--shadow-elevation-2,0_4px_6px_rgba(0,0,0,0.08))]"
                >
                  <div className="flex flex-col gap-1">
                    <Text size="body-medium" weight="bold" className="text-on-surface group-hover:text-primary transition-colors truncate max-w-xl">
                      {typeof job.payload === 'object' ? (job.payload.intent || job.payload.systemPrompt || JSON.stringify(job.payload)) : String(job.payload)}
                    </Text>
                    <Text size="dev-note" className="text-transform-secondary text-on-surface-variant mt-1.5 flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-layer-panel border border-outline/5 rounded-[4px]">{job.assignedAgentId?.toUpperCase()}</span>
                      {new Date(job.timestamp).toLocaleString()}
                    </Text>
                  </div>
                  <div className="flex items-center gap-2 mt-2 md:mt-0 px-3 py-1.5 bg-layer-panel border border-outline/5 rounded-[var(--badge-border-radius,6px)]">
                    <div className={`size-2 rounded-full ${job.status === 'PENDING_MCP_DISPATCH' ? 'bg-primary' : 'bg-success'}`}></div>
                    <Text size="label-small" weight="bold" className="text-transform-tertiary text-on-surface-variant">{job.status}</Text>
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
