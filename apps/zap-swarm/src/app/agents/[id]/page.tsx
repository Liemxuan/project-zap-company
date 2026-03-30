"use client";

import Link from "next/link";
import { ArrowLeft, Save, ShieldAlert, Sparkles, Sliders, Lock } from "lucide-react";
import { use, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";

export default function AgentDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [isActive, setIsActive] = useState(false);
  const [activeTab, setActiveTab] = useState("session");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await fetch("/api/swarm/docker");
        const data = await res.json();
        const match = data.containers?.find((c: any) => 
          c.names?.toLowerCase().includes(resolvedParams.id) || 
          c.image?.toLowerCase().includes(resolvedParams.id)
        );
        setIsActive(match?.state === "running");
      } catch (err) {}
    };
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [resolvedParams.id]);

  const tabs = [
    { id: "session", label: "Active Session", icon: Sliders },
    { id: "skills", label: "Skills Configuration", icon: Sparkles },
    { id: "user", label: "User & Constraints", icon: Lock },
  ];

  return (
    <AppShell>
      <div className="flex flex-col h-full w-full overflow-hidden bg-layer-base">
        
        {/* Dynamic Header */}
        <div className="shrink-0 px-6 sm:px-8 py-5 border-b border-outline/10 bg-layer-base sticky top-0 z-20 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <Link href="/swarm/agents" className="group p-2 hover:bg-layer-cover rounded-full transition-colors">
                <ArrowLeft className="size-5 text-on-surface-variant group-hover:text-on-surface transition-colors" />
              </Link>
              <div className="flex flex-col">
                <Text size="label-small" className="text-on-surface-variant font-medium tracking-wide mb-0.5">AGENT PROFILE</Text>
                <Heading level={3} className="text-on-surface flex items-center gap-3 tracking-tight">
                  <Text as="span" className="text-primary text-inherit font-inherit tracking-inherit capitalize">{resolvedParams.id}</Text>
                  <div className="flex items-center gap-2 px-2 py-1 bg-layer-2/80 border border-outline/10 rounded-[var(--badge-border-radius,6px)] shadow-sm">
                    <div className={`size-2 rounded-full ${isActive ? 'bg-success shadow-[0_0_8px_rgba(0,255,0,0.5)]' : 'bg-surface-variant/50'}`} />
                    <Text size="label-small" weight="bold" className="text-[10px] tracking-widest text-on-surface-variant">
                      {isActive ? 'ONLINE' : 'OFFLINE'}
                    </Text>
                  </div>
                </Heading>
              </div>
            </div>
            
            <button className="group relative overflow-hidden bg-primary px-5 py-2.5 flex items-center gap-2 hover:bg-primary/90 transition-all rounded-[var(--button-border-radius,8px)] shadow-sm hover:shadow-md">
              <Save className="size-4 text-on-primary group-hover:scale-110 transition-transform" />
              <Text size="label-small" weight="bold" className="text-on-primary">
                 Commit Changes
              </Text>
            </button>
        </div>

        {/* Horizontal Tab Bar — the primary intra-entity navigation */}
        <div className="shrink-0 px-6 sm:px-8 pt-4 border-b border-outline/10 bg-layer-base/50">
          <div className="flex gap-6 overflow-x-auto no-scrollbar">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-3 transition-all relative ${
                  activeTab === tab.id
                    ? "text-primary"
                    : "text-on-surface-variant hover:text-on-surface"
                }`}
              >
                <tab.icon className="size-4" />
                <Text size="label-small" weight={activeTab === tab.id ? "bold" : "medium"}>{tab.label}</Text>
                
                {activeTab === tab.id && (
                  <motion.div 
                    layoutId="activeTabUnderlineAgents"
                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary rounded-t-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Canvas Content */}
        <main className="flex-1 overflow-y-auto p-8 relative">
          <AnimatePresence mode="wait">
             <motion.div 
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="max-w-4xl"
             >
                {activeTab === 'session' && (
                   <div className="bg-layer-cover border border-outline/10 p-8 rounded-[var(--card-radius,16px)] shadow-sm">
                      <Heading level={4} className="mb-4 flex items-center gap-2 text-on-surface"><Sliders className="text-primary size-5"/> Active Session Telemetry</Heading>
                      <Text size="body-small" className="text-on-surface-variant mb-6">Real-time memory heap, conversation depth, and token consumption.</Text>
                      
                      <div className="grid grid-cols-3 gap-4">
                         <div className="bg-layer-base border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                             <Text size="label-small" className="text-on-surface-variant mb-1">Context Window</Text>
                             <Heading level={2} className="text-on-surface">14k</Heading>
                         </div>
                         <div className="bg-layer-base border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                             <Text size="label-small" className="text-on-surface-variant mb-1">Turns Depth</Text>
                             <Heading level={2} className="text-on-surface">24</Heading>
                         </div>
                         <div className="bg-layer-base border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                             <Text size="label-small" className="text-on-surface-variant mb-1">Status</Text>
                             <Heading level={2} className="text-success tracking-tight">IDLE</Heading>
                         </div>
                      </div>
                   </div>
                )}

                {activeTab === 'skills' && (
                   <div className="bg-layer-cover border border-outline/10 p-8 rounded-[var(--card-radius,16px)] shadow-sm">
                      <Heading level={4} className="mb-4 flex items-center gap-2 text-on-surface"><Sparkles className="text-primary size-5"/> Skills Configuration</Heading>
                      <Text size="body-small" className="text-on-surface-variant mb-6">Manage the functions and MCP server tools this specific agent can access.</Text>
                      
                      <div className="flex flex-col gap-3">
                         {['zap-audit', 'blast-protocol', 'frontend-design'].map(skill => (
                            <div key={skill} className="flex justify-between items-center bg-layer-base border border-outline/5 p-4 rounded-[var(--card-radius,12px)]">
                               <Text size="label-small" weight="bold" className="text-on-surface font-mono">{skill}</Text>
                               <div className="w-10 h-5 bg-primary/20 rounded-full relative cursor-pointer">
                                  <div className="absolute top-0.5 right-0.5 w-4 h-4 bg-primary rounded-full shadow-sm" />
                               </div>
                            </div>
                         ))}
                      </div>
                   </div>
                )}

                {activeTab === 'user' && (
                   <div className="bg-layer-cover border border-outline/10 p-8 rounded-[var(--card-radius,16px)] shadow-sm">
                      <Heading level={4} className="mb-4 flex items-center gap-2 text-on-surface"><Lock className="text-primary size-5"/> User & Constraints</Heading>
                      <Text size="body-small" className="text-on-surface-variant mb-6">Define the agent's identity constraints and security boundaries (ZSS).</Text>
                      
                      <div className="flex flex-col gap-4">
                         <div className="flex flex-col gap-2">
                            <Text size="label-small" weight="bold" className="text-on-surface-variant">Max Identical Iterations (Loop Engine Check)</Text>
                            <input type="number" defaultValue="3" className="w-max bg-layer-base border border-outline/10 px-4 py-2 rounded-[var(--input-border-radius,8px)] text-on-surface focus:border-primary focus:outline-none" />
                         </div>
                         
                         <div className="flex flex-col gap-2 mt-4">
                           <Text size="label-small" weight="bold" className="text-on-surface-variant">System Prompt Identity</Text>
                           <textarea 
                             rows={6}
                             defaultValue="You are Spike, the primary structural builder..." 
                             className="w-full bg-layer-base border border-outline/10 px-5 py-4 text-sm text-on-surface focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 rounded-[var(--input-border-radius,8px)] font-mono resize-y"
                           />
                         </div>
                      </div>
                   </div>
                )}
             </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </AppShell>
  );
}
