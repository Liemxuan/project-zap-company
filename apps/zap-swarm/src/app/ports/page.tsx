'use client';

import React, { useState, useEffect } from 'react';
import { 
  Shield, Activity, Database, BarChart3, Monitor, Cpu, Globe, Layout, ArrowUpRight,
  Palette, Tablet, Store, Radar, Users, Package, Settings2, Archive, BookOpen
} from 'lucide-react';
import { WORKSPACE_REGISTRY } from 'zap-design/src/config/workspace-registry';

const IconMap: Record<string, React.ReactNode> = {
  palette: <Palette className="w-5 h-5" />,
  monitor: <Monitor className="w-5 h-5" />,
  tablet_mac: <Tablet className="w-5 h-5" />,
  public: <Globe className="w-5 h-5" />,
  dashboard: <Layout className="w-5 h-5" />,
  psychology: <Cpu className="w-5 h-5" />,
  storefront: <Store className="w-5 h-5" />,
  radar: <Radar className="w-5 h-5" />,
  group: <Users className="w-5 h-5" />,
  inventory_2: <Package className="w-5 h-5" />,
  tune: <Settings2 className="w-5 h-5" />,
  bar_chart: <BarChart3 className="w-5 h-5" />,
  monitoring: <Activity className="w-5 h-5" />,
  database: <Database className="w-5 h-5" />,
  shield: <Shield className="w-5 h-5" />,
  archive: <Archive className="w-5 h-5" />,
  menu_book: <BookOpen className="w-5 h-5" />,
};

// --- Types ---
interface PortService {
  name: string;
  port: number;
  domain: string;
  description: string;
  icon: React.ReactNode;
  ownership: string;
  badgeClass: string;
}

// --- Data ---
const FEDERATION_MAP: PortService[] = WORKSPACE_REGISTRY.map(ws => {
  const isMerchant = ws.domain === 'MERCHANT';
  const isShared = ws.domain === 'VAULT' || ws.domain === 'FLEET';
  
  let mapOwnership = 'ZAP';
  let mapColor = 'border-[#7C4DFF]/30 text-[#7C4DFF] bg-[#7C4DFF]/5';
  
  if (isMerchant) {
    mapOwnership = 'MERCHANT';
    mapColor = 'border-[#00BFA5]/30 text-[#00BFA5] bg-[#00BFA5]/5';
  } else if (isShared) {
    mapOwnership = 'SHARED';
    mapColor = 'border-[#00E5FF]/30 text-[#00E5FF] bg-[#00E5FF]/5'; // Cyan
  }

  return {
    name: ws.name.toLowerCase(),
    port: ws.port,
    domain: ws.domain,
    description: ws.description,
    ownership: mapOwnership,
    badgeClass: mapColor,
    icon: IconMap[ws.icon] || <Monitor className="w-5 h-5" />
  };
});

// --- Sub-Components ---
const PortCard = ({ service }: { service: PortService }) => {
  const [isLive, setIsLive] = useState<boolean | null>(null);

  useEffect(() => {
    const checkPort = async () => {
      try {
        await fetch(`http://localhost:${service.port}`, { mode: 'no-cors' });
        setIsLive(true);
      } catch {
        setIsLive(false);
      }
    };
    checkPort();
    const interval = setInterval(checkPort, 5000);
    return () => clearInterval(interval);
  }, [service.port]);

  return (
    <a 
      href={`http://localhost:${service.port}`}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative flex flex-col p-5 bg-[#0A0A0A] border border-white/5 hover:border-white/20 transition-all duration-300 rounded-2xl overflow-hidden"
    >
      {/* Background Decor */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/2 blur-[80px] group-hover:bg-white/5 transition-all" />
      
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 bg-white/5 rounded-xl text-white/60 group-hover:text-white transition-colors">
          {service.icon}
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-1 rounded-full ${
            isLive === true ? 'bg-green-500/10 text-green-400' : 
            isLive === false ? 'bg-red-500/10 text-red-400' : 'bg-white/5 text-white/30'
          }`}>
            {isLive === true ? 'Live' : isLive === false ? 'Offline' : 'Pending'}
          </span>
          <ArrowUpRight className="w-3 h-3 text-white/20 group-hover:text-white transition-all transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium text-lg leading-tight mb-1 group-hover:translate-x-1 transition-transform">
          {service.name}
        </h3>
        <p className="text-white/40 text-xs font-mono mb-3">
          Port {service.port}
        </p>
        <p className="text-white/50 text-sm leading-relaxed line-clamp-2">
          {service.description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-2">
        <span className={`text-[10px] font-black tracking-tighter uppercase border px-2 py-0.5 rounded ${service.badgeClass}`}>
          {service.ownership}
        </span>
      </div>
    </a>
  );
};

// --- Page ---
export default function PortsPage() {
  return (
    <div className="h-screen overflow-y-auto overflow-x-hidden bg-[#050505] p-8 lg:p-16 font-sans selection:bg-white selection:text-black pb-32">
      {/* Header */}
      <header className="mb-16 max-w-4xl">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-1 bg-white/80 rounded-full" />
          <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white/40">ZAP Sovereign Registry v2.1</span>
        </div>
        <h1 className="text-5xl lg:text-7xl font-bold text-white tracking-tighter leading-[0.9] mb-8">
          The Hub of <br />
          <span className="text-white/40">The Federation.</span>
        </h1>
        <p className="text-xl text-white/40 max-w-2xl leading-relaxed mb-8">
          The sovereign navigational map for the ZAP-OS ecosystem. Unified, port-isolated, and architecturally locked for the 14-agent fleet.
        </p>
        
        {/* Source of Truth Notice */}
        <div className="p-5 bg-white/5 border border-white/10 rounded-xl max-w-2xl mt-4">
          <h3 className="text-white/80 text-xs font-black uppercase tracking-[0.2em] mb-3 flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#FF6D00]" />
            CSO Architecture Truth
          </h3>
          <div className="space-y-2">
            <p className="text-white/50 text-sm leading-relaxed">
              The port topologies rendered below are enforced programmatically by <code className="text-white/80 px-1.5 py-0.5 mx-0.5 bg-black/50 rounded font-mono text-xs border border-white/10">workspace-registry.ts</code>.
            </p>
            <p className="text-white/50 text-sm leading-relaxed">
              The human-readable operational specification for the Vietnam team explicitly defining the isolated boundaries between <span className="font-bold text-[#7C4DFF]">[ZAP]</span> internal infra and <span className="font-bold text-[#00BFA5]">[MERCHANT]</span> products is documented in <code className="text-white/80 px-1.5 py-0.5 mx-0.5 bg-black/50 rounded font-mono text-xs border border-white/10">zap_ports.md</code>.
            </p>
          </div>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {FEDERATION_MAP.map((service) => (
          <PortCard key={service.port} service={service} />
        ))}
      </div>

      {/* Footer / Status */}
      <footer className="mt-24 pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <div className="flex flex-col">
            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Master Harness</span>
            <span className="text-white font-mono text-sm">SSE Telemetry @ Port 3999</span>
          </div>
          <div className="flex flex-col">
            <span className="text-[10px] text-white/20 font-black uppercase tracking-widest">Database (Tri-Vault)</span>
            <span className="text-white font-mono text-sm leading-none">Shared Memory (Redis/PG/Chroma)</span>
          </div>
        </div>
        
        <button 
          onClick={() => window.location.reload()}
          className="px-6 py-3 bg-white text-black font-black text-xs uppercase tracking-[0.2em] rounded-full hover:scale-105 transition-transform cursor-pointer"
        >
          Force Re-Sync Fleet
        </button>
      </footer>
    </div>
  );
}
