"use client";

export const dynamic = 'force-dynamic';
// Olympus ID: OLY-SWARM

import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { Clock, ExternalLink, Activity, AlertTriangle, RefreshCw, Search, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef } from "react";

interface SessionData {
  id: string;
  status: string;
  turns: number;
  createdAt: string;
  title: string | null;
}

const getStatusStyle = (status: string) => {
  if (status === 'COMPLETED') return {
    border: 'border-state-success/20', glow: 'shadow-[0_0_15px_rgba(var(--state-success-rgb),0.05)]',
    dot: 'bg-state-success', text: 'text-state-success', bg: 'bg-state-success/10'
  };
  if (status === 'PENDING') return {
    border: 'border-state-warning/20', glow: 'shadow-[0_0_15px_rgba(var(--state-warning-rgb),0.05)]',
    dot: 'bg-state-warning', text: 'text-state-warning', bg: 'bg-state-warning/10'
  };
  if (status === 'RUNNING') return {
    border: 'border-primary/20', glow: 'shadow-[0_0_15px_rgba(var(--color-primary-rgb),0.05)]',
    dot: 'bg-primary', text: 'text-primary', bg: 'bg-primary/10'
  };
  return {
    border: 'border-outline/10', glow: '',
    dot: 'bg-outline/20', text: 'text-on-surface-variant', bg: 'bg-layer-panel border border-outline/5'
  };
};

export default function SessionsDashboard() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const renameInputRef = useRef<HTMLInputElement>(null);

  const { data, isLoading, isFetching, error, refetch } = useQuery<{ success: boolean; sessions: SessionData[] }>({
    queryKey: ['swarm-sessions'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/sessions');
      if (!res.ok) throw new Error('Network response was not ok');
      return res.json();
    },
    refetchInterval: 8000,
  });

  const renameMutation = useMutation({
    mutationFn: async ({ id, title }: { id: string; title: string }) => {
      const res = await fetch(`/api/swarm/sessions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok) throw new Error("Rename failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swarm-sessions'] });
      setRenamingId(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/swarm/sessions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Delete failed");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['swarm-sessions'] });
      setDeletingId(null);
    },
  });

  const newChatMutation = useMutation({
    mutationFn: async () => {
      const sessionId = crypto.randomUUID();
      return { sessionId };
    },
    onSuccess: ({ sessionId }) => {
      router.push(`/chats/${sessionId}`);
    },
  });

  const startRename = (s: SessionData, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setRenamingId(s.id);
    setRenameValue(s.title || `Session ${s.id.slice(0, 8)}`);
    setTimeout(() => renameInputRef.current?.select(), 50);
  };

  const commitRename = (id: string) => {
    const trimmed = renameValue.trim();
    if (trimmed) renameMutation.mutate({ id, title: trimmed });
    else setRenamingId(null);
  };

  const sessions = data?.sessions || [];
  const activeCount = sessions.filter(s => s.status === 'RUNNING').length;
  const filtered = search.trim()
    ? sessions.filter(s =>
        (s.title || `Session ${s.id.slice(0, 8)}`).toLowerCase().includes(search.toLowerCase())
      )
    : sessions;

  if (isLoading) return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader breadcrumb="Zap Swarm / Registry" title="Active Sessions" liveIndicator={false} />
        <main className="flex-1 p-12 animate-pulse space-y-8">
          <div className="h-8 w-1/4 bg-outline/5 rounded-lg" />
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[1, 2, 3].map(i => <div key={i} className="h-40 bg-outline/5 rounded-[var(--card-radius,16px)]" />)}
          </div>
        </main>
      </div>
    </AppShell>
  );

  if (error) return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader breadcrumb="Zap Swarm / Registry" title="Active Sessions" liveIndicator={false} />
        <main className="flex-1 flex flex-col items-center justify-center p-20 space-y-4">
          <AlertTriangle className="size-20 text-state-error opacity-20" />
          <Heading level={2} className="text-on-surface font-black">REGISTRY OFFLINE</Heading>
          <Text className="text-on-surface-variant max-w-md text-center">Failed to connect to SYS_OS_job_queue. Verify backend availability.</Text>
        </main>
      </div>
    </AppShell>
  );

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader
          breadcrumb="Zap Swarm / Registry"
          title="Active Sessions"
          badge={`${activeCount} connected`}
          liveIndicator={activeCount > 0}
          rightSlot={
            <div className="flex items-center gap-2">
              <Button
                type="button"
                onClick={() => refetch()}
                disabled={isFetching}
                variant="outline"
                size="sm"
              >
                <RefreshCw className={`size-3.5 ${isFetching ? "animate-spin text-primary" : ""}`} />
                Refresh
              </Button>
              <Button
                type="button"
                onClick={() => newChatMutation.mutate()}
                disabled={newChatMutation.isPending}
                variant="primary"
                size="sm"
              >
                <Plus className="size-3.5" />
                New Chat
              </Button>
            </div>
          }
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
          {/* Stats + Search Row */}
          <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="flex items-center gap-6 flex-1 p-6 bg-layer-cover border border-outline/10 rounded-[var(--card-radius,16px)] shadow-[var(--shadow-elevation-2,0_4px_8px_rgba(0,0,0,0.08))]"
            >
              <div className={`size-16 rounded-2xl flex items-center justify-center ${activeCount > 0 ? "bg-primary/10" : "bg-outline/5"}`}>
                <Activity className={`size-8 ${activeCount > 0 ? "text-primary" : "text-on-surface-variant"}`} />
              </div>
              <div>
                <Text size="body-large" weight="medium" className="text-on-surface tracking-tight block">
                  Session Registry — {activeCount} Active Threads
                </Text>
                <Text size="body-medium" className="text-on-surface-variant mt-1">
                  {isFetching && !isLoading ? "Synchronizing registry state..." : `Tracking ${sessions.length} total cognitive loops.`}
                </Text>
              </div>
            </motion.div>

            {/* Search */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="relative md:w-72"
            >
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-on-surface-variant/50 pointer-events-none" />
              <input
                type="text"
                placeholder="Search sessions..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full h-10 pl-9 pr-4 bg-layer-cover border border-outline/10 rounded-[var(--button-border-radius,8px)] text-[13px] text-on-surface placeholder:text-on-surface-variant/50 outline-none focus:border-primary/40 transition-colors"
              />
              {search && (
                <button type="button" title="Clear search" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant/50 hover:text-on-surface">
                  <X className="size-3.5" />
                </button>
              )}
            </motion.div>
          </div>

          {/* Session Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
            <AnimatePresence mode="popLayout">
              {filtered.map((s, i) => {
                const style = getStatusStyle(s.status);
                const isRenaming = renamingId === s.id;
                const isDeleting = deletingId === s.id;
                const displayTitle = s.title || `Session ${s.id.slice(0, 8)}`;

                return (
                  <motion.div
                    key={s.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: 0.05 + (i % 10) * 0.05, duration: 0.3 }}
                  >
                    {isDeleting ? (
                      // Delete confirmation overlay
                      <div className={`relative p-6 rounded-[var(--card-radius,16px)] border bg-layer-cover border-error/30 h-full flex flex-col items-center justify-center gap-4 text-center`}>
                        <Trash2 className="size-8 text-error/60" />
                        <div>
                          <Text size="label-medium" weight="bold" className="text-on-surface block mb-1">Archive this session?</Text>
                          <Text size="body-small" className="text-on-surface-variant/70">This will hide it from the registry.</Text>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            onClick={() => setDeletingId(null)}
                            variant="outline"
                            size="sm"
                          >
                            Cancel
                          </Button>
                          <Button
                            type="button"
                            onClick={() => deleteMutation.mutate(s.id)}
                            disabled={deleteMutation.isPending}
                            variant="destructive"
                            size="sm"
                          >
                            {deleteMutation.isPending ? "Archiving..." : "Archive"}
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Link href={`/chats/${s.id}`} className="block group">
                        <div className={`relative p-6 rounded-[var(--card-radius,16px)] border bg-layer-cover ${style.border} ${style.glow} hover:shadow-[var(--shadow-elevation-2,0_4px_12px_rgba(0,0,0,0.1))] transition-all hover:-translate-y-0.5 h-full`}>
                          {/* Status dot */}
                          <div className="absolute top-4 right-4 flex items-center gap-2">
                            <div className={`size-2 rounded-full ${style.dot} ${s.status === 'RUNNING' ? 'animate-pulse' : ''}`} />
                            <Text size="label-small" weight="bold" className={`text-[10px] uppercase tracking-widest ${style.text}`}>
                              {s.status}
                            </Text>
                          </div>

                          {/* Action buttons — visible on hover */}
                          <div className="absolute top-3 right-20 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.preventDefault()}>
                            <Button
                              type="button"
                              onClick={(e: React.MouseEvent) => startRename(s, e)}
                              title="Rename session"
                              variant="ghost"
                              size="icon"
                            >
                              <Pencil className="size-3.5" />
                            </Button>
                            <Button
                              type="button"
                              onClick={(e: React.MouseEvent) => { e.preventDefault(); e.stopPropagation(); setDeletingId(s.id); }}
                              title="Archive session"
                              variant="ghost"
                              size="icon"
                              className="hover:bg-error/10 hover:text-error"
                            >
                              <Trash2 className="size-3.5" />
                            </Button>
                          </div>

                          <div className={`size-10 rounded-[var(--button-border-radius,8px)] ${style.bg} flex items-center justify-center mb-4 transition-colors`}>
                            <Clock className={`size-5 ${style.text} ${s.status === 'COMPLETED' ? 'opacity-80' : ''}`} />
                          </div>

                          {/* Inline rename or title */}
                          {isRenaming ? (
                            <div className="flex items-center gap-1 mb-1 pr-16" onClick={(e) => e.preventDefault()}>
                              <input
                                ref={renameInputRef}
                                type="text"
                                title="Session name"
                                placeholder="Session name"
                                value={renameValue}
                                onChange={(e) => setRenameValue(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === "Enter") commitRename(s.id);
                                  if (e.key === "Escape") setRenamingId(null);
                                }}
                                autoFocus
                                className="flex-1 bg-layer-base border border-primary/30 rounded-sm px-2 py-0.5 text-[12px] text-on-surface outline-none"
                              />
                              <button type="button" title="Confirm rename" onClick={() => commitRename(s.id)} className="p-1 text-primary hover:text-primary/80"><Check className="size-3.5" /></button>
                              <button type="button" title="Cancel rename" onClick={() => setRenamingId(null)} className="p-1 text-on-surface-variant hover:text-on-surface"><X className="size-3.5" /></button>
                            </div>
                          ) : (
                            <Text size="label-medium" weight="bold" className="text-on-surface text-xs block mb-1 truncate pr-16 group-hover:text-primary transition-colors">
                              {displayTitle}
                            </Text>
                          )}

                          <Text size="body-small" className="text-on-surface-variant text-xs block mb-3">
                            {s.createdAt ? `Started: ${new Date(s.createdAt).toLocaleDateString()}` : "Active connection"}
                          </Text>

                          <div className="pt-3 border-t border-outline/5 mt-auto flex justify-between items-center">
                            <Text size="body-small" className="text-on-surface-variant/70 text-[11px] font-mono">
                              Context Depth: {s.turns} turns
                            </Text>
                            <ExternalLink className="size-3 text-on-surface-variant opacity-0 group-hover:opacity-100 transition-opacity" />
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && !isLoading && (
            <div className="w-full py-24 flex flex-col items-center justify-center bg-layer-cover border border-outline/10 rounded-[var(--card-radius,16px)]">
              <Activity className="size-10 text-on-surface-variant/30 mb-4" />
              {search ? (
                <>
                  <Text size="body-medium" className="text-on-surface-variant">No sessions match "{search}"</Text>
                  <button type="button" onClick={() => setSearch("")} className="mt-2 text-[12px] text-primary hover:underline">Clear search</button>
                </>
              ) : (
                <>
                  <Text size="body-medium" className="text-on-surface-variant">No sessions found.</Text>
                  <Text size="body-small" className="text-on-surface-variant/60 mt-1">Start a chat with an agent to create one.</Text>
                  <Button
                    type="button"
                    onClick={() => newChatMutation.mutate()}
                    variant="primary"
                    size="md"
                    className="mt-4"
                  >
                    <Plus className="size-4" />
                    New Chat
                  </Button>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </AppShell>
  );
}
