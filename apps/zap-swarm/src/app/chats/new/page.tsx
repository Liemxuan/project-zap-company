"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { createPortal } from "react-dom";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";

type Agent = { name: string; role: string; status: string; uptime: string };

function StatusDot({ status }: { status: string }) {
  const color =
    status === "active" || status === "online"
      ? "bg-green-400"
      : status === "idle"
      ? "bg-amber-400"
      : "bg-red-400";
  return <span className={`inline-block size-1.5 rounded-full ${color} shrink-0`} />;
}

function AgentCard({ name, role, status, uptime, onSelect }: Agent & { onSelect: () => void }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className="group relative flex flex-col gap-3 p-5 bg-layer-panel border border-outline/10 hover:border-primary/40 hover:bg-layer-overlay transition-all text-left"
    >
      <div className="flex items-center justify-between">
        <div className="size-8 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
          <Zap className="size-4 text-primary" strokeWidth={2} />
        </div>
        <StatusDot status={status} />
      </div>
      <div className="flex flex-col gap-0.5 min-w-0">
        <Text size="label-large" className="font-semibold text-on-surface truncate">{name}</Text>
        <Text size="body-small" className="text-on-surface-variant/70 truncate">{role}</Text>
      </div>
      <span className="text-[10px] font-mono text-on-surface-variant/30 mt-auto">{uptime}</span>
    </button>
  );
}

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3 p-5 bg-layer-panel border border-outline/10 animate-pulse">
      <div className="flex items-center justify-between">
        <div className="size-8 rounded-md bg-outline/10" />
        <div className="size-1.5 rounded-full bg-outline/10" />
      </div>
      <div className="flex flex-col gap-1.5">
        <div className="h-3 w-20 bg-outline/10 rounded" />
        <div className="h-2.5 w-32 bg-outline/10 rounded" />
      </div>
      <div className="h-2 w-12 bg-outline/10 rounded mt-auto" />
    </div>
  );
}

export default function NewChatLanding() {
  const router = useRouter();
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedAgentName, setSelectedAgentName] = useState<string | null | undefined>(undefined);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    fetch("/api/swarm/agents")
      .then(r => r.ok ? r.json() : { agents: [] })
      .then(d => setAgents(d.agents ?? []))
      .catch(() => setAgents([]))
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = (agentName: string | null) => {
    setSelectedAgentName(agentName || "omni");
    // Generate a fresh session ID to prevent cross-agent session bleed
    const freshId = `chat_${Math.random().toString(36).substring(2, 9)}`;
    const agentParam = agentName ? `?agent=${agentName}` : '?agent=OmniRouter';
    
    setTimeout(() => {
      router.push(`/chats/${freshId}${agentParam}`);
    }, 400); // Wait for framer-motion exit animation
  };


  const dashboard = (
    <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
      <ThemeHeader 
        breadcrumb="Zap Swarm / Communication"
        title="Swarm Sessions"
        badge=""
        liveIndicator={false}
      />
      <main className="flex-1 w-full bg-layer-base relative pointer-events-none" />
    </div>
  );

  const overlay = (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/20 p-6 overflow-hidden backdrop-blur-none pointer-events-auto">
      <AnimatePresence>
        {selectedAgentName === undefined && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
            className="flex flex-col w-full max-w-5xl max-h-[85vh] bg-[color:var(--dialog-bg,var(--color-surface-container-high))] border-[length:var(--dialog-border-width,var(--layer-4-border-width,0px))] border-outline-variant border-solid rounded-[length:var(--dialog-border-radius,var(--layer-4-border-radius,1.5rem))] shadow-[var(--md-sys-elevation-level3)] overflow-hidden"
          >
            {/* Header */}
            <div className="shrink-0 border-b border-outline/10 px-6 py-4 flex items-center justify-between">
              <div>
                <Heading level={5} className="text-on-surface font-semibold">New Session</Heading>
                <Text size="body-small" className="text-on-surface-variant/60 mt-0.5">Select an agent to start</Text>
              </div>
              <Link
                href="/"
                className="flex items-center gap-1.5 text-[12px] font-mono text-on-surface-variant hover:text-on-surface transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedAgentName("back");
                  setTimeout(() => router.push("/"), 300);
                }}
              >
                <ChevronLeft className="size-3.5" /> Back
              </Link>
            </div>

            {/* Grid */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl">
                {/* OmniRouter — always first */}
                <AgentCard
                  name="OmniRouter"
                  role="Auto-route to best agent"
                  status="online"
                  uptime="always on"
                  onSelect={() => handleSelect(null)}
                />

                {loading
                  ? Array.from({ length: 7 }).map((_, i) => <SkeletonCard key={i} />)
                  : agents.map(a => (
                      <AgentCard key={a.name} {...a} onSelect={() => handleSelect(a.name)} />
                    ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );

  return (
    <AppShell>
      {dashboard}
      {mounted && typeof document !== 'undefined' && createPortal(overlay, document.body)}
    </AppShell>
  );
}
