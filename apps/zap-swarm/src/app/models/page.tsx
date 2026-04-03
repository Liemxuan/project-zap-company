"use client";

export const dynamic = 'force-dynamic';

import { useState, useMemo } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { Activity, Server, Orbit, Search, X, RefreshCw, Box, Database, Sparkles, Hash, AlertTriangle, ShieldCheck } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "zap-design/src/genesis/atoms/interactive/button";
import { useQuery } from "@tanstack/react-query";

interface GeminiModelEntry {
  name: string;
  identifier: string;
  description: string;
  strategy: string;
  tags: string[];
  status: "ACTIVE" | "INACTIVE";
}

export default function ModelsDashboard() {
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real-time models data
  const { data, isLoading, isFetching, error, refetch } = useQuery<{ success: boolean; models: GeminiModelEntry[] }>({
    queryKey: ['swarm-models'],
    queryFn: async () => {
      const res = await fetch('/api/swarm/models');
      if (!res.ok) throw new Error('Failed to fetch models data');
      return res.json();
    },
    refetchInterval: 30_000,
  });

  const models = data?.models || [];
  const activeCount = models.filter(m => m.status === "ACTIVE").length;
  const inactiveCount = models.filter(m => m.status === "INACTIVE").length;

  // Filter models
  const filteredModels = useMemo(() => {
    return models.filter(m => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (!m.name.toLowerCase().includes(q) && 
            !m.identifier.toLowerCase().includes(q) &&
            !m.strategy.toLowerCase().includes(q) &&
            !m.tags.some(tag => tag.toLowerCase().includes(q))) {
          return false;
        }
      }
      return true;
    });
  }, [models, searchQuery]);

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader 
          breadcrumb="Zap Swarm / Omni-Router"
          title="System Models Database"
          badge={`${activeCount} Active Core Engines`}
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8">
          <div className="flex-1 bg-layer-cover border border-outline/10 rounded-[var(--card-radius,12px)] shadow-[var(--shadow-elevation-1,0_1px_2px_rgba(0,0,0,0.05))] overflow-hidden flex flex-col min-h-[500px]">
            {/* Toolbar */}
            <div className="px-6 py-4 border-b border-outline/5 flex items-center justify-between bg-layer-panel/50 backdrop-blur-md sticky top-0 z-10 w-full">
              <div className="flex items-center gap-6">
                 <Heading level={4} className="text-sm">Model Registry</Heading>
                 <div className="flex gap-4 border-l border-outline/10 pl-6">
                   <div className="flex items-center gap-2 text-xs text-state-success font-medium tracking-wide">
                     <ShieldCheck className="size-4" /> {activeCount} Bound
                   </div>
                   <div className="flex items-center gap-2 text-xs text-on-surface-variant font-medium tracking-wide">
                     <AlertTriangle className="size-4" /> {inactiveCount} Deprecated
                   </div>
                 </div>
              </div>
              
              <div className="flex items-center gap-3 w-1/3 min-w-[300px]">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-on-surface-variant/50" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by name, key, strategy, or tags..."
                    className="w-full h-8 pl-9 pr-8 bg-layer-base border border-outline/10 rounded-[var(--button-border-radius,8px)] text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-1 focus:ring-primary/50 text-xs transition-all"
                  />
                  {searchQuery && (
                    <button onClick={() => setSearchQuery("")} title="Clear filter" className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5 rounded hover:bg-outline/10">
                      <X className="size-3 text-on-surface-variant/50" />
                    </button>
                  )}
                </div>
                
                <Button variant="secondary" onClick={() => refetch()} disabled={isFetching} className="h-8 px-3 text-xs gap-1.5 border border-outline/10 shrink-0">
                  <RefreshCw className={`size-3 ${isFetching ? 'animate-spin text-primary' : 'text-on-surface-variant'}`} />
                  Sync DB
                </Button>
              </div>
            </div>

            {/* Models Flex Layout */}
            <div className="flex-1 overflow-y-auto p-6 bg-layer-cover">
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50 space-y-4">
                  <div className="size-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                  <Text size="body-small" className="font-mono tracking-widest text-on-surface-variant">LOADING REGISTRY...</Text>
                </div>
              ) : error ? (
                <div className="p-6 bg-state-error/5 text-state-error rounded-xl border border-state-error/10 flex items-center gap-3">
                  <AlertTriangle /> Failed to fetch from Master Models Registry.
                </div>
              ) : filteredModels.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full opacity-50">
                   <Server className="size-12 mb-4 text-on-surface-variant/30" />
                   <Text size="body-small" className="text-on-surface-variant">No engine definitions matched your search.</Text>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-4">
                  {filteredModels.map((model, i) => (
                    <motion.div 
                      key={model.identifier}
                      initial={{ opacity: 0, scale: 0.98 }} 
                      animate={{ opacity: 1, scale: 1 }} 
                      transition={{ duration: 0.2, delay: i * 0.05 }} 
                      className={`relative flex flex-col bg-layer-panel border p-5 rounded-[var(--card-radius,12px)] transition-all ${model.status === 'INACTIVE' ? 'border-state-error/20 opacity-60 grayscale-[0.5]' : 'border-outline/5 hover:border-outline/20 hover:shadow-lg'}`}
                    >
                      {/* Name & ID Header */}
                      <div className="flex justify-between items-start mb-4 gap-4">
                        <div className="flex items-center gap-3">
                            <div className={`size-10 rounded-full flex items-center justify-center shrink-0 ${model.status === 'INACTIVE' ? 'bg-state-error/10 text-state-error' : 'bg-primary/10 text-primary'}`}>
                                {model.name.includes("Embedding") ? <Database className="size-4" /> : 
                                 model.name.includes("Video") || model.name.includes("Veo") || model.name.includes("Image") || model.name.includes("Banana") ? <Sparkles className="size-4" /> :
                                 <Activity className="size-4" />}
                            </div>
                            <div className="flex flex-col">
                                <Heading level={5} className="text-base text-on-surface">{model.name}</Heading>
                                <Text size="body-small" className="font-mono text-[10px] text-on-surface-variant/70 tracking-tight">{model.identifier}</Text>
                            </div>
                        </div>
                        <div className={`px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase border ${model.status === 'INACTIVE' ? 'bg-state-error/10 text-state-error border-state-error/20' : 'bg-state-success/10 text-state-success border-state-success/20'}`}>
                            {model.status}
                        </div>
                      </div>

                      {/* Info Sections */}
                      <div className="flex flex-col space-y-3 flex-1">
                        <div>
                            <Text size="label-small" className="text-on-surface-variant/50 uppercase tracking-widest mb-1.5 font-bold">Strategy</Text>
                            <Text size="body-small" className="text-on-surface">{model.strategy}</Text>
                        </div>
                        <div className="flex-1">
                            <Text size="label-small" className="text-on-surface-variant/50 uppercase tracking-widest mb-1.5 font-bold">Capabilities</Text>
                            <Text size="body-small" className="text-on-surface-variant/90 line-clamp-3">{model.description}</Text>
                        </div>

                        {/* Tags */}
                        <div className="pt-3 border-t border-outline/5 flex flex-wrap gap-1.5 mt-auto">
                            {model.tags.map((tag, tagIndex) => (
                                <span key={tagIndex} className="bg-layer-base border border-outline/10 text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] flex items-center gap-1 font-mono hover:text-on-surface hover:bg-outline/5 transition-colors cursor-default">
                                    <Hash className="size-[8px] opacity-50" />
                                    {tag}
                                </span>
                            ))}
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
