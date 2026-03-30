"use client";

import { useState, useMemo } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Orbit, Activity, Server, KeyRound, AlertTriangle, CheckCircle2, Search, X, RefreshCw, Box } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { useQuery } from "@tanstack/react-query";

interface FleetKey {
  _id: string;
  tier: string;
  keyHash: string;
  status: string;
  allocation: string;
  provider: string;
  lastUsedAt?: string;
  errors?: number;
}

export default function FleetDashboard() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTier, setActiveTier] = useState<string | null>(null);

  // Fetch real-time fleet data
  const { data, isLoading, isFetching, error, refetch } = useQuery<{ success: boolean; keys: FleetKey[] }>({
    queryKey: ['swarm-fleet'],
    queryFn: async () => {
      const res = await fetch('/api/fleet');
      if (!res.ok) throw new Error('Failed to fetch fleet data');
      return res.json();
    },
    refetchInterval: 10_000,
  });

  const keys = data?.keys || [];

  // Compute metrics
  const ultraCount = keys.filter(k => k.tier === "ULTRA").length;
  const proCount = keys.filter(k => k.tier === "PRO").length;
  const orCount = keys.filter(k => k.tier === "OPENROUTER").length;
  const ollamaCount = keys.filter(k => k.tier === "OLLAMA").length;

  const activeCount = keys.filter(k => k.status === "ACTIVE").length;
  const deadCount = keys.filter(k => k.status === "DEAD").length;

  // Filter keys
  const filteredKeys = useMemo(() => {
    return keys.filter(k => {
      if (activeTier && k.tier !== activeTier) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!k.keyHash?.toLowerCase().includes(q) && 
            !k.provider?.toLowerCase().includes(q) &&
            !k.allocation?.toLowerCase().includes(q) &&
            !k.tier?.toLowerCase().includes(q)) {
          return false;
        }
      }
      return true;
    });
  }, [keys, activeTier, searchQuery]);

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader 
          breadcrumb="Zap Swarm / Fleet Control"
          title="API Fleet Matrix"
          badge={`${activeCount} Active Units`}
          liveIndicator={true}
        />

        <main className="flex-1 overflow-y-auto p-8 pt-6">
          
          {/* ── Fleet Tier Monitors ────────────────────────── */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <MetricCard 
              label="Ultra (Precision)" 
              value={ultraCount} 
              icon={<Orbit className="size-5" />} 
              color="text-amber-400" 
              bg="bg-amber-400/10"
              active={activeTier === "ULTRA"}
              onClick={() => setActiveTier(activeTier === "ULTRA" ? null : "ULTRA")}
            />
            <MetricCard 
              label="Pro (Workforce)" 
              value={proCount} 
              icon={<Activity className="size-5" />} 
              color="text-blue-400" 
              bg="bg-blue-400/10"
              active={activeTier === "PRO"}
              onClick={() => setActiveTier(activeTier === "PRO" ? null : "PRO")}
            />
            <MetricCard 
              label="OpenRouter (Fallback)" 
              value={orCount} 
              icon={<Server className="size-5" />} 
              color="text-purple-400" 
              bg="bg-purple-400/10"
              active={activeTier === "OPENROUTER"}
              onClick={() => setActiveTier(activeTier === "OPENROUTER" ? null : "OPENROUTER")}
            />
            <MetricCard 
              label="Ollama (Local)" 
              value={ollamaCount} 
              icon={<Box className="size-5" />} 
              color="text-emerald-400" 
              bg="bg-emerald-400/10"
              active={activeTier === "OLLAMA"}
              onClick={() => setActiveTier(activeTier === "OLLAMA" ? null : "OLLAMA")}
            />
          </div>

          <div className="flex-1 bg-layer-cover border border-outline/10 rounded-[var(--card-radius,12px)] shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))] overflow-hidden flex flex-col min-h-[500px]">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-outline/5 flex items-center justify-between bg-layer-panel/50 backdrop-blur-md sticky top-0 z-10">
              <div className="flex items-center gap-6">
                 <Heading level={4} className="text-sm">Drone Registry</Heading>
                 <div className="flex gap-4 border-l border-outline/10 pl-6">
                   <div className="flex items-center gap-2 text-xs text-state-success font-medium tracking-wide">
                     <CheckCircle2 className="size-4" /> {activeCount} Online
                   </div>
                   <div className="flex items-center gap-2 text-xs text-state-error font-medium tracking-wide">
                     <AlertTriangle className="size-4" /> {deadCount} Burned Out
                   </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-3 w-1/3">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-on-surface-variant/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search keys, providers, tiers..."
                    className="w-full h-8 pl-9 pr-8 bg-layer-base border border-outline/10 rounded-[var(--button-border-radius,8px)] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} title="Clear filter" className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-outline/10">
                      <X className="size-3 text-on-surface-variant/50" />
                    </button>
                  )}
                </div>
                
                <Button variant="secondary" onClick={() => refetch()} disabled={isFetching} className="h-8 px-3 text-xs gap-1.5 border border-outline/10">
                  <RefreshCw className={`size-3 ${isFetching ? 'animate-spin text-primary' : 'text-on-surface-variant'}`} />
                  Sync Array
                </Button>
              </div>
            </div>

            {/* Matrix Data */}
            <div className="flex-1 overflow-y-auto p-4 bg-layer-cover">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                  <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <Text size="body-small" className="font-mono tracking-widest text-on-surface-variant">SYNCING FLEET MATRIX...</Text>
                </div>
              ) : error ? (
                <div className="p-6 bg-state-error/5 text-state-error rounded-xl border border-state-error/10 flex items-center gap-3">
                  <AlertTriangle /> Failed to synchronize with Fleet Database.
                </div>
              ) : filteredKeys.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                   <Server className="size-12 mb-4 text-on-surface-variant/30" />
                   <Text size="body-small" className="text-on-surface-variant">No drones found matching current parameters.</Text>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-2">
                  {filteredKeys.map((k, i) => (
                    <motion.div 
                      key={k._id || i}
                      initial={{ opacity: 0, scale: 0.98 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ duration: 0.2, delay: i * 0.02 }} 
                      className="bg-layer-panel border border-outline/5 p-4 rounded-[var(--card-radius,12px)] flex items-center justify-between hover:border-outline/20 hover:bg-layer-panel/80 transition-all group"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${k.status === 'DEAD' ? 'bg-state-error/10 text-state-error' : 'bg-primary/10 text-primary group-hover:bg-primary/20'}`}>
                          {k.status === "DEAD" ? <AlertTriangle className="size-4" /> : <KeyRound className="size-4" />}
                        </div>
                        <div>
                          <Text size="label-medium" weight="bold" className="uppercase tracking-wide text-on-surface pb-0.5 text-xs">
                            {k.provider || "GENERIC"} <span className="text-on-surface-variant/40 px-1">•</span> {k.tier || "GENERIC"} TIER
                          </Text>
                          <Text size="body-small" className="text-on-surface-variant font-mono text-[11px] opacity-70 group-hover:opacity-100 transition-opacity">
                            {k.keyHash || 'hash_unavailable'}
                          </Text>
                        </div>
                      </div>

                      <div className="flex items-center gap-8">
                        {k.errors !== undefined && k.errors > 0 && (
                          <div className="text-right">
                             <Text size="label-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider">Err / Drops</Text>
                             <Text size="body-small" weight="bold" className="text-state-warning text-xs mt-0.5">{k.errors}</Text>
                          </div>
                        )}
                        
                        <div className="text-right w-32 border-l border-outline/5 pl-6">
                           <Text size="label-small" className="text-on-surface-variant/50 text-[10px] uppercase tracking-wider">Allocation</Text>
                           <Text size="body-small" weight="bold" className="text-on-surface text-xs mt-0.5 truncate">{k.allocation || "MERCHANT_SHARED"}</Text>
                        </div>
                        
                        <div className={`shrink-0 w-24 text-center px-3 py-1.5 rounded-[var(--button-border-radius,6px)] text-[10px] uppercase font-bold tracking-widest ${k.status === 'DEAD' ? 'bg-state-error/10 text-state-error' : 'bg-state-success/10 text-state-success'}`}>
                          {k.status || "ACTIVE"}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </AppShell>
  );
}

// ── Shared Metric Card ─────────────────────────────────

interface MetricProps {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bg: string;
  active?: boolean;
  onClick?: () => void;
}

function MetricCard({ label, value, icon, color, bg, active, onClick }: MetricProps) {
  return (
    <div 
      onClick={onClick}
      className={`relative p-5 rounded-[var(--card-radius,12px)] flex items-center gap-4 group transition-all cursor-pointer overflow-hidden border ${
        active 
          ? `bg-layer-cover border-[${color}] ring-1 ring-current/20 shadow-md transform -translate-y-0.5` 
          : 'bg-layer-cover border-outline/10 hover:border-outline/20 hover:-translate-y-0.5 shadow-sm'
      }`}
    >
      {/* Background bleed icon */}
      <div className={`absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity scale-150 ${color}`}>
        {icon}
      </div>

      <div className={`p-3 rounded-[var(--button-border-radius,8px)] shrink-0 transition-colors ${bg} ${color}`}>
        {icon}
      </div>
      
      <div className="flex flex-col relative z-10 min-w-0">
        <Text size="label-small" className="text-on-surface-variant font-medium text-[11px] uppercase tracking-wider truncate mb-1">
          {label}
        </Text>
        <Heading level={3} className={`text-2xl font-bold tabular-nums tracking-tight ${color}`}>
          {value.toLocaleString()}
        </Heading>
      </div>
      
      {active && (
        <div className={`absolute top-0 right-0 h-full w-1 ${bg}`} />
      )}
    </div>
  );
}
