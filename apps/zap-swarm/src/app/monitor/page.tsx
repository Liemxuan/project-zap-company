"use client";

import { useEffect, useState, useRef } from "react";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { ThemeHeader } from "zap-design/src/genesis/molecules/layout/ThemeHeader";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, Zap, Cpu, Database, Server, Hexagon, Play } from "lucide-react";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";

// Based on the Rust KAIROS tick publish payload
interface TickEvent {
  id: string; // generated locally for React keys
  tick: string;
  jobs_processed: number;
  duration_ms: number;
}

export default function SwarmMonitorPage() {
  const [ticks, setTicks] = useState<TickEvent[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [totalProcessed, setTotalProcessed] = useState(0);

  useEffect(() => {
    const sse = new window.EventSource("http://localhost:3999/api/v1/stream/ticks");
    
    sse.onopen = () => setIsConnected(true);
    sse.onerror = () => setIsConnected(false);
    
    sse.addEventListener("message", (e) => {
      try {
        const data = JSON.parse(e.data);
        if (data.tick) {
           const newTick = { ...data, id: Math.random().toString(36).substring(7) };
           setTicks(prev => [newTick, ...prev].slice(0, 50)); // Keep history
           if (data.jobs_processed > 0) {
             setTotalProcessed(p => p + data.jobs_processed);
           }
        }
      } catch (err) {
        console.error("SSE parse error", err);
      }
    });

    return () => sse.close();
  }, []);

  // Compute active throughput
  const latestJobs = ticks.length > 0 ? ticks[0].jobs_processed : 0;
  const isPumping = latestJobs > 0;

  return (
    <AppShell>
      <div className="flex flex-col h-full bg-layer-base text-on-surface w-full overflow-hidden">
        <ThemeHeader
          breadcrumb="Zap Swarm / Architecture"
          title="Telemetry Monitor"
          badge={isConnected ? "Gateway Online" : "Gateway Offline"}
          liveIndicator={isConnected}
        />

        <main className="flex-1 overflow-y-auto px-5 md:px-12 py-8 flex flex-col gap-8 flex-col relative">
          
          {/* Top Metric Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-layer-cover border border-outline/10 p-5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                <Activity className="size-4" />
                <Text size="label-small" className="uppercase tracking-widest text-[10px] font-bold">Connection</Text>
              </div>
              <Heading level={3} className={isConnected ? "text-state-success" : "text-state-error"}>
                {isConnected ? "LIVE" : "DISCONNECTED"}
              </Heading>
            </div>
            
            <div className="bg-layer-cover border border-outline/10 p-5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                <Play className="size-4" />
                <Text size="label-small" className="uppercase tracking-widest text-[10px] font-bold">Active Throughput</Text>
              </div>
              <Heading level={3} className="text-on-surface">
                {latestJobs} <span className="text-base text-on-surface-variant/50">jobs/sec</span>
              </Heading>
            </div>

            <div className="bg-layer-cover border border-outline/10 p-5 rounded-2xl flex flex-col justify-between">
              <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                <Zap className="size-4" />
                <Text size="label-small" className="uppercase tracking-widest text-[10px] font-bold">Total Processed</Text>
              </div>
              <Heading level={3} className="text-on-surface">
                {totalProcessed.toLocaleString()}
              </Heading>
            </div>

            <div className="bg-layer-cover border border-outline/10 p-5 rounded-2xl flex flex-col justify-between relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
                <Cpu className="size-4" />
                <Text size="label-small" className="uppercase tracking-widest text-[10px] font-bold">KAIROS Tick Latency</Text>
              </div>
              <Heading level={3} className="text-on-surface relative z-10">
                {ticks.length > 0 ? ticks[0].duration_ms : 0} <span className="text-base text-on-surface-variant/50">ms</span>
              </Heading>
              
              {/* Background heartbeat pulse */}
              {isConnected && (
                 <motion.div 
                   animate={{ opacity: [0.1, 0.3, 0.1], scale: [1, 1.2, 1] }} 
                   transition={{ duration: 1, repeat: Infinity }}
                   className="absolute -right-4 -bottom-4 size-24 bg-primary/20 blur-xl rounded-full"
                 />
              )}
            </div>
          </div>

          {/* Animated Moving Line Pipeline */}
          <div className="flex-1 min-h-[300px] bg-layer-cover border border-outline/10 rounded-2xl p-8 relative flex flex-col items-center justify-center overflow-hidden">
             
             {/* Pipeline Header */}
             <div className="absolute top-6 left-6 flex items-center gap-3 z-20">
               <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                 <Hexagon className="size-4 text-primary" />
               </div>
               <div>
                 <Heading level={4} className="text-sm">Agent Orchestration Pipeline</Heading>
                 <Text size="body-small" className="text-on-surface-variant text-[11px] font-mono mt-0.5">rust::KAIROS --&gt; zap::Tick --&gt; Postgres</Text>
               </div>
             </div>

             {/* The physical line connecting nodes */}
             <div className="w-full max-w-4xl h-1 bg-outline/10 relative rounded-full mt-10">
               {/* Animated streaming gradient inside the line */}
               {isConnected && (
                 <motion.div 
                   className="absolute top-0 left-0 bottom-0 w-1/3 bg-gradient-to-r from-transparent via-primary/50 to-transparent"
                   animate={{ x: ["-100%", "300%"] }}
                   transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                 />
               )}

               {/* Render actual jobs moving down the line */}
               <AnimatePresence>
                 {ticks.filter(t => t.jobs_processed > 0).slice(0, 10).map((t) => (
                   Array.from({ length: Math.min(t.jobs_processed, 5) }).map((_, i) => (
                     <motion.div
                       key={`${t.id}-${i}`}
                       initial={{ left: "0%", opacity: 0, scale: 0 }}
                       animate={{ left: "100%", opacity: [0, 1, 1, 0], scale: 1 }}
                       exit={{ opacity: 0 }}
                       transition={{ duration: 3, ease: "linear", delay: i * 0.2 }}
                       className="absolute top-1/2 -translate-y-1/2 flex items-center justify-center"
                     >
                       <div className="size-4 bg-primary rounded-full shadow-[0_0_15px_rgba(var(--primary),0.5)] flex items-center justify-center">
                         <div className="size-1.5 bg-white rounded-full animate-pulse" />
                       </div>
                     </motion.div>
                   ))
                 ))}
               </AnimatePresence>

               {/* Nodes along the line */}
               <div className="absolute top-1/2 -translate-y-1/2 left-0 size-12 bg-layer-panel border-2 border-outline/20 rounded-full flex items-center justify-center shadow-lg z-10 transition-transform">
                 <Database className="size-5 text-on-surface-variant" />
                 <span className="absolute -top-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">Redis Jobs</span>
               </div>

               <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 size-16 bg-layer-panel border-2 border-primary/40 rounded-xl flex items-center justify-center shadow-[0_0_30px_rgba(var(--primary),0.1)] z-10">
                 <Cpu className={`size-6 ${isPumping ? 'text-primary' : 'text-on-surface-variant'}`} />
                 <span className="absolute -top-8 text-[10px] font-black uppercase tracking-widest text-primary">KAIROS Daemon</span>
                 <span className="absolute -bottom-8 text-[10px] font-mono text-on-surface-variant text-nowrap">port: 3999</span>
                 
                 {/* Daemon active ping ring */}
                 <AnimatePresence>
                   {isPumping && (
                     <motion.div 
                       initial={{ scale: 1, opacity: 0.5 }}
                       animate={{ scale: 1.5, opacity: 0 }}
                       transition={{ duration: 0.8, ease: "easeOut" }}
                       className="absolute inset-0 border border-primary rounded-xl"
                     />
                   )}
                 </AnimatePresence>
               </div>

               <div className="absolute top-1/2 -translate-y-1/2 right-0 size-12 bg-layer-panel border-2 border-outline/20 rounded-full flex items-center justify-center shadow-lg z-10">
                 <Server className="size-5 text-on-surface-variant" />
                 <span className="absolute -top-8 text-[10px] font-black uppercase tracking-widest text-on-surface-variant">PostgreSQL</span>
               </div>
             </div>
          </div>

          {/* Raw Log Output */}
          <div className="h-64 bg-black rounded-2xl border border-white/10 p-5 overflow-hidden flex flex-col">
            <div className="flex items-center gap-2 mb-4 border-b border-white/10 pb-4">
              <TerminalIcon className="size-4 text-white/50" />
              <Text size="label-small" className="text-white/50 uppercase tracking-widest text-[10px] font-mono">Live Sync Console</Text>
            </div>
            <div className="flex-1 overflow-y-auto font-mono text-[11px] text-white/70 space-y-1.5 flex flex-col-reverse">
               {ticks.map((t) => (
                 <div key={t.id} className="flex items-center gap-4 py-1 hover:bg-white/5 px-2 rounded">
                   <div className="w-40 text-emerald-500/70">{t.tick}</div>
                   <div className="w-32 text-amber-500/70">jobs:{t.jobs_processed}</div>
                   <div className="w-32 text-blue-400/70">{t.duration_ms}ms lat</div>
                   <div className="flex-1 text-white/40">
                     {t.jobs_processed > 0 ? "🔥 Dispatched agent thought loop." : "Idle tick."}
                   </div>
                 </div>
               ))}
            </div>
          </div>

        </main>
      </div>
    </AppShell>
  );
}

function TerminalIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
      <polyline points="4 17 10 11 4 5"></polyline>
      <line x1="12" y1="19" x2="20" y2="19"></line>
    </svg>
  );
}
