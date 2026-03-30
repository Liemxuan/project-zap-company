"use client";

import { useState, useEffect } from "react";
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";
import { AppShell } from "zap-design/src/zap/layout/AppShell";
import { Orbit, Activity, Search, Server, KeyRound, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function FleetDashboard() {
  const [keys, setKeys] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/fleet")
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setKeys(data.keys || []);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  // Compute metrics:
  const ultraCount = keys.filter(k => k.tier === "ULTRA").length;
  const proCount = keys.filter(k => k.tier === "PRO").length;
  const orCount = keys.filter(k => k.tier === "OPENROUTER").length;
  const ollamaCount = keys.filter(k => k.tier === "OLLAMA").length;

  const activeCount = keys.filter(k => k.status === "ACTIVE").length;
  const deadCount = keys.filter(k => k.status === "DEAD").length;

  return (
    <AppShell>
    <div className="flex flex-col h-full bg-layer-base text-on-surface p-8 relative z-10 w-full overflow-y-auto">
      <div className="flex flex-col gap-2 mb-8 relative z-10">
        <Text size="label-small" weight="bold" className="text-on-surface-variant text-transform-tertiary tracking-widest mb-1">
          zap swarm / fleet control
        </Text>
        <Heading level={2} className="text-on-surface tracking-tight flex items-center gap-3">
          <Server className="size-6 text-primary" /> API Fleet Command
        </Heading>
        <Text size="body-medium" className="text-on-surface-variant max-w-2xl">
          Real-time visualization of the OmniRouter load-balancing matrix. 
          Manage ACTIVE and DEAD keys across the 4-Provider strategy.
        </Text>
      </div>

      <div className="grid grid-cols-4 gap-6 mb-8 relative z-10">
        <MetricCard label="Ultra Pool (Precision)" value={ultraCount} icon={<Orbit />} color="text-amber-500" />
        <MetricCard label="Pro Pool (Workforce)" value={proCount} icon={<Activity />} color="text-blue-500" />
        <MetricCard label="OpenRouter (Fallback)" value={orCount} icon={<Server />} color="text-purple-500" />
        <MetricCard label="Ollama (Local)" value={ollamaCount} icon={<Server />} color="text-emerald-500" />
      </div>

      <div className="flex-1 bg-layer-cover border border-outline/10 rounded-[var(--card-radius,20px)] p-6 relative z-10 overflow-hidden flex flex-col">
          <div className="flex items-center justify-between mb-6 shrink-0">
             <Heading level={4}>Registered Assets</Heading>
             <div className="flex gap-4">
               <div className="flex items-center gap-2 text-[length:var(--type-label-small-desktop,12px)] text-emerald-500 font-medium tracking-wide">
                 <CheckCircle2 className="size-4" /> {activeCount} Active
               </div>
               <div className="flex items-center gap-2 text-[length:var(--type-label-small-desktop,12px)] text-red-500 font-medium tracking-wide">
                 <AlertTriangle className="size-4" /> {deadCount} Dead (403/429)
               </div>
             </div>
          </div>
          <div className="flex-1 overflow-y-auto pr-2 rounded-xl">
             {loading ? <div className="text-center py-10 opacity-50 flex items-center justify-center gap-2"><div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin"/> Syncing Matrix...</div> : (
               <div className="grid grid-cols-1 gap-3">
                 {keys.length === 0 ? (
                   <div className="text-center py-10 opacity-50 border border-dashed border-outline/20 rounded-xl text-on-surface-variant">No Keys Imported - Run SYS_API_KEYS Sync.</div>
                 ) : (
                   keys.map((k, i) => (
                     <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className="bg-layer-panel border border-outline/5 p-4 rounded-[var(--card-radius,12px)] flex items-center justify-between hover:border-outline/20 transition-all">
                       <div className="flex items-center gap-4">
                         <div className={`p-2 rounded-full ${k.status === 'DEAD' ? 'bg-red-500/10 text-red-500' : 'bg-primary/10 text-primary'}`}>
                           {k.status === "DEAD" ? <AlertTriangle className="size-4" /> : <KeyRound className="size-4" />}
                         </div>
                         <div>
                           <Text size="label-medium" weight="bold" className="uppercase">{k.tier || "GENERIC"} TIER</Text>
                           <Text size="body-small" className="text-on-surface-variant font-mono mt-1">Hash: {k.keyHash}</Text>
                         </div>
                       </div>
                       <div className="flex items-center gap-6">
                         <div className="text-right">
                           <Text size="label-small" className="text-on-surface-variant">Allocation</Text>
                           <Text size="body-small" weight="bold" className="mt-0.5">{k.allocation || "MERCHANT_SHARED"}</Text>
                         </div>
                         <div className={`px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider ${k.status === 'DEAD' ? 'bg-red-500/10 text-red-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                           {k.status || "ACTIVE"}
                         </div>
                       </div>
                     </motion.div>
                   ))
                 )}
               </div>
             )}
          </div>
      </div>
    </div>
    </AppShell>
  );
}

function MetricCard({ label, value, icon, color }: any) {
  return (
    <div className="bg-layer-2 border border-outline/10 p-5 rounded-[var(--layer-2-border-radius,16px)] flex items-center gap-4 relative overflow-hidden group hover:border-outline/20 transition-all">
       <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity scale-150 text-on-surface">
         {icon}
       </div>
       <div className={`p-3 rounded-full bg-layer-3 ${color}`}>
         {icon}
       </div>
       <div className="flex flex-col relative z-10">
         <Text size="body-small" className="text-on-surface-variant font-medium">{label}</Text>
         <Heading level={4} className={color}>{value}</Heading>
       </div>
    </div>
  );
}
