"use client";

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Shield, Monitor, Terminal, Activity, Layers, Brain, Code, Compass, Search, Cpu, Send, Eye, Radio, Server, Database, HardDrive, Container, LayoutTemplate, ShoppingCart, Tablet, Globe, LayoutDashboard, Briefcase, Settings, BarChart3, Lock, AppWindow, Key } from 'lucide-react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '../../../../components/ui/sheet';
import { Button } from '../../../../components/ui/button';
// ── Fleet Registry ──────────────────────────────────────────────────────────────
const FLEET_AGENTS = [
    { name: 'Gateway',   port: 3001, role: 'API Gateway',        icon: Server,  tier: 'infra',   color: 'slate' },
    { name: 'Daemon',    port: 8000, role: 'Core Engine',         icon: Cpu,     tier: 'infra',   color: 'slate' },
    { name: 'Jerry',     port: 3300, role: 'Watchdog / QA',       icon: Shield,  tier: 'tier-1',  color: 'purple' },
    { name: 'Spike',     port: 3301, role: 'Structural Builder',  icon: Code,    tier: 'tier-1',  color: 'blue' },
    { name: 'Thomas',    port: 3302, role: 'Telegram Ops',        icon: Send,    tier: 'tier-1',  color: 'green' },
    { name: 'Athena',    port: 3303, role: 'Research Agent',       icon: Brain,   tier: 'tier-1',  color: 'amber' },
    { name: 'Hermes',    port: 3304, role: 'Messenger',           icon: Radio,   tier: 'tier-2',  color: 'cyan' },
    { name: 'Hawk',      port: 3305, role: 'Surveillance',        icon: Eye,     tier: 'tier-2',  color: 'red' },
    { name: 'Nova',      port: 3306, role: 'Unassigned',          icon: Compass, tier: 'tier-2',  color: 'pink' },
    { name: 'Raven',     port: 3307, role: 'Unassigned',          icon: Search,  tier: 'tier-2',  color: 'indigo' },
    { name: 'Scout',     port: 3308, role: 'Recon',               icon: Search,  tier: 'tier-2',  color: 'teal' },
    { name: 'Coder',     port: 3309, role: 'Code Gen',            icon: Code,    tier: 'tier-1',  color: 'emerald' },
    { name: 'Architect', port: 3310, role: 'System Design',       icon: Layers,  tier: 'tier-1',  color: 'violet' },
    { name: 'Cleo',      port: 3311, role: 'Ops',                 icon: Activity,tier: 'tier-2',  color: 'orange' },
] as const;

const APP_SERVICES = [
    { name: 'Design Engine', port: 3000, role: 'L1-L7 Foundations', icon: LayoutTemplate, tier: 'design' },
    { name: 'POS Terminal',  port: 3100, role: 'Point of Sale',     icon: ShoppingCart,   tier: 'pos' },
    { name: 'Kiosk',         port: 3200, role: 'Customer Facing',   icon: Tablet,         tier: 'pos' },
    { name: 'Web App',       port: 3300, role: 'Main Storefront',   icon: Globe,          tier: 'pos' },
    { name: 'Portal',        port: 3400, role: 'Internal Portal',   icon: LayoutDashboard,tier: 'pos' },
    { name: 'Operations',    port: 4000, role: 'Sales/Inventory',   icon: Briefcase,      tier: 'ops' },
    { name: 'Settings',      port: 4100, role: 'System Mgmt',       icon: Settings,       tier: 'ops' },
    { name: 'Reports',       port: 4200, role: 'Financials',        icon: BarChart3,      tier: 'ops' },
    { name: 'ZAP-Auth',      port: 4700, role: 'Security Gateway',  icon: Lock,           tier: 'auth' },
] as const;

const INFRA_SERVICES = [
    { name: 'Redis',     port: 6379, icon: Database,  color: 'red' },
    { name: 'MongoDB',   port: 27017, icon: Database, color: 'green' },
    { name: 'Postgres',  port: 5432, icon: HardDrive, color: 'blue' },
    { name: 'ChromaDB',  port: 8100, icon: Container, color: 'amber' },
] as const;

type Status = 'online' | 'offline' | 'checking';

type InfraStatusInfo = {
    status: Status;
    parsedHost?: string;
};

export default function MissionControlPage() {
    const params = useParams();
    const router = useRouter();
    const theme = (params?.theme as string) || 'metro';

    type KeyObj = { key: string; project: string; status: string; tier: string };

    type GatewayStatusInfo = {
        status: Status; ultraKeys: number; proKeys: number; ultraKeysList?: KeyObj[]; proKeysList?: KeyObj[]; blockedProjects: string[]; deadKeysCount: number; deadKeys: string[];
    };

    type InspectorData = 
        | { type: 'agent', node: typeof FLEET_AGENTS[number], status: Status }
        | { type: 'app', node: typeof APP_SERVICES[number], status: Status }
        | { type: 'infra', node: typeof INFRA_SERVICES[number], info: InfraStatusInfo }
        | { type: 'gateway', statusData: GatewayStatusInfo, view?: 'ultra' | 'pro' | 'blocks' | 'dead' | 'all' }
        | null;

    const [inspector, setInspector] = useState<InspectorData>(null);

    const [agentStatuses, setAgentStatuses] = useState<Record<number, Status>>(
        Object.fromEntries(FLEET_AGENTS.map(a => [a.port, 'checking']))
    );
    const [appStatuses, setAppStatuses] = useState<Record<number, Status>>(
        Object.fromEntries(APP_SERVICES.map(a => [a.port, 'checking']))
    );
    const [infraStatuses, setInfraStatuses] = useState<Record<number, InfraStatusInfo>>(
        Object.fromEntries(INFRA_SERVICES.map(s => [s.port, { status: 'checking' }]))
    );
    const [gatewayStatus, setGatewayStatus] = useState<GatewayStatusInfo>({ 
        status: 'checking', ultraKeys: 0, proKeys: 0, ultraKeysList: [], proKeysList: [], blockedProjects: [], deadKeysCount: 0, deadKeys: [] 
    });
    const [lastCheck, setLastCheck] = useState<string>('—');

    useEffect(() => {
        let active = true;

        const checkPort = async (port: number, serviceName?: string): Promise<{status: Status, parsedHost?: string}> => {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 3500);
                const query = serviceName ? `?port=${port}&service=${serviceName}` : `?port=${port}`;
                const res = await fetch(`/api/tcp-ping${query}`, { signal: controller.signal });
                clearTimeout(timeout);
                
                if (!res.ok) return { status: 'offline' };
                const data = await res.json();
                return { status: data.status as Status, parsedHost: data.parsedHost };
            } catch {
                return { status: 'offline' };
            }
        };

        const poll = async () => {
            if (!active) return;
            const agentResults = await Promise.all(
                FLEET_AGENTS.map(async (a) => ({ port: a.port, result: await checkPort(a.port) }))
            );
            if (!active) return;
            const newAgent: Record<number, Status> = {};
            agentResults.forEach(r => { newAgent[r.port] = r.result.status; });
            setAgentStatuses(newAgent);

            const appResults = await Promise.all(
                APP_SERVICES.map(async (a) => ({ port: a.port, result: await checkPort(a.port) }))
            );
            if (!active) return;
            const newApp: Record<number, Status> = {};
            appResults.forEach(r => { newApp[r.port] = r.result.status; });
            setAppStatuses(newApp);

            const infraResults = await Promise.all(
                INFRA_SERVICES.map(async (s) => ({ port: s.port, result: await checkPort(s.port, s.name) }))
            );
            if (!active) return;
            const newInfra: Record<number, InfraStatusInfo> = {};
            infraResults.forEach(r => { newInfra[r.port] = r.result; });
            setInfraStatuses(newInfra);
            
            try {
                const gatewayRes = await fetch('/api/telemetry/keys');
                if (gatewayRes.ok) {
                    setGatewayStatus(await gatewayRes.json());
                } else {
                    setGatewayStatus(prev => ({ ...prev, status: 'offline' }));
                }
            } catch {
                setGatewayStatus(prev => ({ ...prev, status: 'offline' }));
            }

            setLastCheck(new Date().toLocaleTimeString());
        };
        const id = setInterval(poll, 15000);
        poll();
        return () => { active = false; clearInterval(id); };
    }, []);

    const onlineCount = Object.values(agentStatuses).filter(s => s === 'online').length;
    const totalCount = FLEET_AGENTS.length;
    const appOnline = Object.values(appStatuses).filter(s => s === 'online').length;
    const infraOnline = Object.values(infraStatuses).filter(s => s.status === 'online').length;
    const allHealthy = onlineCount === totalCount && appOnline === APP_SERVICES.length && infraOnline === INFRA_SERVICES.length;

    const statusDot = (s: Status) =>
        s === 'online' ? 'bg-success shadow-[0_0_8px_rgba(var(--success),0.5)]'
        : s === 'offline' ? 'bg-error shadow-[0_0_8px_rgba(var(--error),0.4)]'
        : 'bg-warning animate-pulse';

    return (
        <div className="flex flex-col min-h-screen bg-layer-base text-on-surface pb-10 selection:bg-primary/20 cursor-default">
            <div className="w-full max-w-7xl mx-auto flex flex-col h-full p-4 md:p-8 lg:pt-12">
            
            {/* ── Header ClawX Style ──────────────────────────── */}
            <div className="flex flex-col md:flex-row md:items-start justify-between mb-12 shrink-0 gap-4">
                <div>
                    <h1 className="text-4xl md:text-5xl font-serif text-on-surface mb-3 font-normal tracking-tight">
                        Mission Control
                    </h1>
                    <p className="text-[17px] text-on-surface-variant font-medium">
                        ZAP-OS v2.1 — Memory Fleet — {totalCount} Agents — {APP_SERVICES.length} Apps — {INFRA_SERVICES.length} Services
                    </p>
                </div>
                <div className="flex items-center gap-3 md:mt-2">
                    <div className="text-right">
                        <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-1 font-bold">System Pulse</div>
                        <div className="flex items-center gap-2 justify-end">
                            <div className={`h-3 w-3 rounded-full ${allHealthy ? 'bg-success shadow-[0_0_12px_rgba(var(--success),0.6)]' : 'bg-warning animate-pulse'}`} />
                            <span className="font-bold text-sm text-on-surface">{allHealthy ? 'ALL SYSTEMS GO' : `${onlineCount}/${totalCount} ONLINE`}</span>
                        </div>
                        <div className="text-[10px] text-on-surface-variant mt-1.5 font-medium">Last check: {lastCheck}</div>
                    </div>
                </div>
            </div>

            {/* ── Quick Stats Bar ──────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-10">
                {[
                    { label: 'Agents Online', value: `${onlineCount}/${totalCount}`, accent: onlineCount === totalCount ? 'text-success' : 'text-warning' },
                    { label: 'Apps Online', value: `${appOnline}/${APP_SERVICES.length}`, accent: appOnline === APP_SERVICES.length ? 'text-success' : 'text-info' },
                    { label: 'Infrastructure', value: `${infraOnline}/${INFRA_SERVICES.length}`, accent: infraOnline === INFRA_SERVICES.length ? 'text-success' : 'text-error' },
                    { label: 'Tier-1 Agents', value: FLEET_AGENTS.filter(a => a.tier === 'tier-1').length.toString(), accent: 'text-primary' },
                ].map(stat => (
                    <div key={stat.label} className="border border-outline/10 bg-surface-container-low rounded-xl p-5">
                        <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">{stat.label}</div>
                        <div className={`text-3xl font-black ${stat.accent}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* ── Fleet Grid ──────────────────────────────────────── */}
            <section className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                    <Monitor className="h-5 w-5 text-on-surface-variant" />
                    <h2 className="text-lg font-black uppercase tracking-widest text-on-surface">Agent Fleet</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {FLEET_AGENTS.map((agent) => {
                        const status = agentStatuses[agent.port] || 'checking';
                        const AgentIcon = agent.icon;
                        return (
                            <div
                                key={agent.port}
                                onClick={() => setInspector({ type: 'agent', node: agent, status })}
                                className={`cursor-pointer group border rounded-xl p-5 transition-all duration-200 hover:shadow-sm ${
                                    status === 'online'
                                        ? 'border-outline/10 bg-surface-container-low hover:bg-surface-container'
                                        : status === 'offline'
                                        ? 'border-error/20 bg-error/5 hover:bg-error/10'
                                        : 'border-warning/20 bg-warning/5 hover:bg-warning/10'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AgentIcon className="h-5 w-5 text-on-surface-variant" />
                                        <span className="font-bold text-base text-on-surface">{agent.name}</span>
                                    </div>
                                    <div className={`h-2.5 w-2.5 rounded-full ${statusDot(status)} mt-1.5`} />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] text-on-surface-variant uppercase tracking-widest font-bold">{agent.role}</div>
                                    <div className="flex items-center justify-between">
                                        <code className="text-xs text-on-surface-variant font-medium">:${agent.port}</code>
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                                            agent.tier === 'infra' ? 'bg-outline/10 text-on-surface-variant'
                                            : agent.tier === 'tier-1' ? 'bg-primary/10 text-primary'
                                            : 'bg-secondary/10 text-secondary'
                                        }`}>
                                            {agent.tier}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Application Layer ───────────────────────────────── */}
            <section className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                    <AppWindow className="h-5 w-5 text-on-surface-variant" />
                    <h2 className="text-lg font-black uppercase tracking-widest text-on-surface">Application Layer</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {APP_SERVICES.map((app) => {
                        const status = appStatuses[app.port] || 'checking';
                        const AppIcon = app.icon;
                        return (
                            <div
                                key={app.port}
                                onClick={() => setInspector({ type: 'app', node: app, status })}
                                className={`cursor-pointer group border rounded-xl p-5 transition-all duration-200 hover:shadow-sm ${
                                    status === 'online'
                                        ? 'border-outline/10 bg-surface-container-low hover:bg-surface-container'
                                        : status === 'offline'
                                        ? 'border-error/20 bg-error/5 hover:bg-error/10'
                                        : 'border-warning/20 bg-warning/5 hover:bg-warning/10'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        <AppIcon className="h-5 w-5 text-on-surface-variant" />
                                        <span className="font-bold text-base text-on-surface">{app.name}</span>
                                    </div>
                                    <div className={`h-2.5 w-2.5 rounded-full ${statusDot(status)} mt-1.5`} />
                                </div>
                                <div className="space-y-2">
                                    <div className="text-[11px] text-on-surface-variant uppercase tracking-widest font-bold">{app.role}</div>
                                    <div className="flex items-center justify-between">
                                        <code className="text-xs text-on-surface-variant font-medium">:${app.port}</code>
                                        <span className={`text-[10px] font-black uppercase px-2 py-1 rounded ${
                                            app.tier === 'design' ? 'bg-secondary/10 text-secondary'
                                            : app.tier === 'pos' ? 'bg-success/10 text-success'
                                            : app.tier === 'auth' ? 'bg-error/10 text-error'
                                            : 'bg-primary/10 text-primary'
                                        }`}>
                                            {app.tier}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Infrastructure ──────────────────────────────────── */}
            <section className="mb-10">
                <div className="flex items-center gap-3 mb-5">
                    <Database className="h-5 w-5 text-on-surface-variant" />
                    <h2 className="text-lg font-black uppercase tracking-widest text-on-surface">Infrastructure</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {INFRA_SERVICES.map((svc) => {
                        const info = infraStatuses[svc.port] || { status: 'checking' };
                        const status = info.status;
                        const Icon = svc.icon;
                        return (
                            <div
                                key={svc.port}
                                onClick={() => setInspector({ type: 'infra', node: svc, info })}
                                className={`cursor-pointer border rounded-xl p-5 transition-all ${
                                    status === 'online' ? 'border-outline/10 bg-surface-container-low hover:bg-surface-container' : 'border-error/20 bg-error/5 hover:bg-error/10'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <Icon className="h-5 w-5 text-on-surface-variant" />
                                        <span className="font-bold text-base text-on-surface">{svc.name}</span>
                                    </div>
                                    <div className={`h-2.5 w-2.5 rounded-full ${statusDot(status)}`} />
                                </div>
                                {info.parsedHost && info.parsedHost !== 'localhost' && info.parsedHost !== '127.0.0.1' ? (
                                    <div className="flex flex-col gap-1.5 mt-2">
                                        <span className="text-[10px] font-black text-info mb-0.5 uppercase tracking-widest bg-info/10 self-start px-2 py-1 rounded">Remote</span>
                                        <code className="text-xs text-on-surface-variant font-medium truncate w-full" title={info.parsedHost}>{info.parsedHost}</code>
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-1.5 mt-2">
                                         <span className="text-[10px] font-black text-success mb-0.5 uppercase tracking-widest bg-success/10 self-start px-2 py-1 rounded">Local</span>
                                         <code className="text-xs text-on-surface-variant font-medium">:${svc.port}</code>
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Gateway Telemetry ───────────────────────────────── */}
            <section 
                className="mb-10 border border-secondary/20 bg-secondary/5 rounded-xl p-6 md:p-8 cursor-pointer hover:bg-secondary/10 transition-colors"
                onClick={() => setInspector({ type: 'gateway', statusData: gatewayStatus, view: 'all' })}
            >
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                        <Key className="h-6 w-6 text-secondary" />
                        <h2 className="text-xl font-black uppercase tracking-widest text-secondary">Gateway Matrix</h2>
                    </div>
                    <div className={`h-3 w-3 rounded-full ${statusDot(gatewayStatus.status)}`} />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div 
                        className="border border-outline/10 bg-surface-container rounded-xl p-5 hover:border-outline/30 transition-all box-border-active"
                        onClick={(e) => { e.stopPropagation(); setInspector({ type: 'gateway', statusData: gatewayStatus, view: 'ultra' }); }}
                    >
                        <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Ultra Tier</div>
                        <div className="text-3xl font-black text-rose-500">{gatewayStatus.ultraKeys} Keys</div>
                    </div>
                    <div 
                        className="border border-outline/10 bg-surface-container rounded-xl p-5 hover:border-outline/30 transition-all box-border-active"
                        onClick={(e) => { e.stopPropagation(); setInspector({ type: 'gateway', statusData: gatewayStatus, view: 'pro' }); }}
                    >
                        <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Pro Tier</div>
                        <div className="text-3xl font-black text-info">{gatewayStatus.proKeys} Keys</div>
                    </div>
                    <div 
                        className={`border rounded-xl p-5 transition-all box-border-active hover:border-outline/30 ${gatewayStatus.blockedProjects.length > 0 ? 'border-error/40 bg-error/10' : 'border-outline/10 bg-surface-container'}`}
                        onClick={(e) => { e.stopPropagation(); setInspector({ type: 'gateway', statusData: gatewayStatus, view: 'blocks' }); }}
                    >
                        <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">429 Blocks</div>
                        <div className="text-3xl font-black text-error">{gatewayStatus.blockedProjects.length} Active</div>
                    </div>
                    <div 
                        className={`border rounded-xl p-5 transition-all box-border-active hover:border-outline/30 ${gatewayStatus.deadKeysCount > 0 ? 'border-warning/40 bg-warning/10' : 'border-outline/10 bg-surface-container'}`}
                        onClick={(e) => { e.stopPropagation(); setInspector({ type: 'gateway', statusData: gatewayStatus, view: 'dead' }); }}
                    >
                        <div className="text-[11px] uppercase tracking-widest text-on-surface-variant mb-2 font-bold">Dead Keys (403)</div>
                        <div className="text-3xl font-black text-warning">{gatewayStatus.deadKeysCount} Total</div>
                    </div>
                </div>

                {gatewayStatus.blockedProjects.length > 0 && (
                    <div className="mt-6 border border-error/20 bg-error/10 rounded-xl p-5">
                        <div className="text-[11px] font-black text-error uppercase tracking-widest mb-3">Currently Quarantined Projects</div>
                        <div className="flex gap-2 flex-wrap">
                            {gatewayStatus.blockedProjects.map(p => (
                                <span key={p} className="text-xs font-mono bg-error/20 text-error px-3 py-1.5 rounded border border-error/30 font-bold">
                                    {p}
                                </span>
                            ))}
                        </div>
                    </div>
                )}
            </section>

            {/* ── Athena Research Panel ───────────────────────────── */}
            <section className="mb-10 border border-warning/20 bg-warning/5 rounded-xl p-6 md:p-8">
                <div className="flex items-center gap-3 mb-6">
                    <Brain className="h-6 w-6 text-warning" />
                    <h2 className="text-xl font-black uppercase tracking-widest text-warning">Athena Research Agent</h2>
                    <span className="text-[10px] bg-warning/20 text-warning px-2.5 py-1 rounded font-black uppercase ml-2">NotebookLM</span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                        { label: 'Create Notebook', endpoint: '/api/research/notebook', method: 'POST' },
                        { label: 'Add Source', endpoint: '/api/research/source', method: 'POST' },
                        { label: 'Ask Question', endpoint: '/api/research/ask', method: 'POST' },
                        { label: 'Generate Content', endpoint: '/api/research/generate', method: 'POST' },
                        { label: 'List Notebooks', endpoint: '/api/research/notebooks', method: 'GET' },
                        { label: 'Research Web', endpoint: '/api/research/web', method: 'POST' },
                        { label: 'Download', endpoint: '/api/research/download', method: 'POST' },
                        { label: 'Status', endpoint: '/api/research/status', method: 'GET' },
                    ].map(ep => (
                        <div key={ep.endpoint} className="border border-warning/20 rounded-xl p-4 bg-warning/5 hover:bg-warning/10 transition-colors">
                            <div className="text-[11px] font-bold text-warning/80 mb-2 uppercase tracking-wide">{ep.label}</div>
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded ${ep.method === 'GET' ? 'bg-success/20 text-success' : 'bg-info/20 text-info'}`}>
                                    {ep.method}
                                </span>
                                <code className="text-xs text-on-surface-variant font-medium truncate">{ep.endpoint}</code>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
            
            </div>

            {/* ── Right-Side Inspector Sheet ──────────────────────── */}
            <Sheet open={inspector !== null} onOpenChange={(open: boolean) => !open && setInspector(null)}>
                <SheetContent className="bg-surface-container-low border-l border-outline/10 text-on-surface sm:max-w-md overflow-y-auto z-[99999]" side="right">
                    <SheetHeader className="mb-8">
                        <SheetTitle className="flex items-center gap-3 text-2xl font-serif text-on-surface capitalize border-b border-outline/10 pb-5" style={{ fontFamily: 'Georgia, Cambria, "Times New Roman", Times, serif' }}>
                            {inspector?.type === 'agent' && <><Monitor className="h-6 w-6 text-primary" /> {inspector.node.name} Agent</>}
                            {inspector?.type === 'app' && <><AppWindow className="h-6 w-6 text-primary" /> {inspector.node.name}</>}
                            {inspector?.type === 'infra' && <><Database className="h-6 w-6 text-primary" /> {inspector.node.name} Node</>}
                            {inspector?.type === 'gateway' && <><Key className="h-6 w-6 text-secondary" /> Gateway Matrix</>}
                        </SheetTitle>
                        <SheetDescription className="text-[15px] font-medium text-on-surface-variant mt-2">
                            Live node diagnostics and operational forensics.
                        </SheetDescription>
                    </SheetHeader>
                    
                    {inspector && (
                        <div className="flex flex-col gap-5">
                            {inspector.type === 'agent' && (
                                <>
                                    <div className="flex justify-between items-center p-5 rounded-xl bg-surface-container shadow-sm ring-1 ring-outline/10 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-on-surface-variant" />
                                            <span className="text-on-surface-variant tracking-widest uppercase text-[11px] font-bold">Status</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-surface-container-high px-3.5 py-1.5 rounded-full border border-outline/10">
                                            <span className="capitalize font-mono text-xs font-bold text-on-surface">{inspector.status}</span>
                                            <div className={`h-2.5 w-2.5 rounded-full ${statusDot(inspector.status)}`} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-5">
                                        <div className="p-5 bg-surface-container shadow-sm ring-1 ring-outline/10 rounded-xl flex flex-col justify-center">
                                            <div className="text-[11px] uppercase font-bold text-on-surface-variant tracking-widest mb-3">Port Bind</div>
                                            <div className="font-mono text-xl text-on-surface border border-outline/5 bg-surface-container-high px-3 py-1.5 rounded-lg w-max">:${inspector.node.port}</div>
                                        </div>
                                        <div className="p-5 bg-surface-container shadow-sm ring-1 ring-outline/10 rounded-xl flex flex-col justify-center">
                                            <div className="text-[11px] uppercase font-bold text-on-surface-variant tracking-widest mb-3">Clearance</div>
                                            <div className="font-mono text-sm font-black tracking-widest bg-primary/10 text-primary w-max px-3 py-1.5 rounded-md uppercase">{inspector.node.tier}</div>
                                        </div>
                                    </div>
                                    <div className="p-5 bg-surface-container shadow-sm ring-1 ring-outline/10 rounded-xl relative overflow-hidden">
                                        <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                        <div className="text-[11px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 pl-3">Primary Role</div>
                                        <div className="font-body text-base font-medium text-on-surface pl-3 capitalize">{inspector.node.role}</div>
                                    </div>
                                    <div className="pt-6">
                                        <Button 
                                            onClick={() => router.push(`/design/${theme}/mission-control/agents/${inspector.node.name.toLowerCase()}`)}
                                            className="w-full font-bold tracking-widest uppercase h-14 shadow-sm 
                                                       bg-primary text-on-primary hover:bg-primary/90 transition-all rounded-xl"
                                        >
                                            Open Full Forensics
                                        </Button>
                                    </div>
                                </>
                            )}
                            {inspector.type === 'gateway' && (
                                <>
                                    <div className="flex justify-between items-center p-5 rounded-xl bg-primary/5 shadow-sm ring-1 ring-primary/20 text-sm">
                                        <span className="text-primary tracking-widest uppercase text-[11px] font-bold">Network State</span>
                                        <div className="flex items-center gap-3 bg-surface-container px-3.5 py-1.5 rounded-full border border-primary/10">
                                            <span className="capitalize font-mono text-xs font-bold text-primary">{inspector.statusData.status}</span>
                                            <div className={`h-2.5 w-2.5 rounded-full ${statusDot(inspector.statusData.status)}`} />
                                        </div>
                                    </div>
                                    <div className="flex flex-col gap-4 mt-6">
                                        <div className="overflow-hidden rounded-xl bg-surface-container shadow-sm ring-1 ring-outline/10">
                                            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-outline/20 scrollbar-track-transparent">
                                                <table className="w-full text-left text-sm text-on-surface-variant">
                                                    <thead className="sticky top-0 bg-surface-container-highest z-10 text-[11px] uppercase font-black tracking-widest text-on-surface border-b border-outline/10">
                                                        <tr>
                                                            <th className="p-4 bg-surface-container-high font-body">API Key</th>
                                                            <th className="p-4 bg-surface-container-high font-body">Project Bind</th>
                                                            <th className="p-4 bg-surface-container-high font-body">Status</th>
                                                            { (!inspector.view || inspector.view === 'all') && <th className="p-4 bg-surface-container-high font-body">Tier</th> }
                                                        </tr>
                                                    </thead>
                                                    <tbody className="divide-y divide-outline/5 font-mono text-xs">
                                                        {(!inspector.view || inspector.view === 'all' || inspector.view === 'ultra') && inspector.statusData.ultraKeysList?.map((k, i) => (
                                                            <tr key={`u-${i}`} className="hover:bg-surface-container-high transition-colors">
                                                                <td className="p-4 text-secondary">{k.key}</td>
                                                                <td className="p-4"><span className="bg-surface-container-high font-medium px-2 py-1 rounded border border-outline/5">{k.project}</span></td>
                                                                <td className="p-4">
                                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        k.status === 'Active' ? 'bg-success/15 text-success' :
                                                                        k.status === 'Dead' ? 'bg-warning/15 text-warning' :
                                                                        'bg-error/15 text-error'
                                                                    }`}>
                                                                        {k.status}
                                                                    </span>
                                                                </td>
                                                                { (!inspector.view || inspector.view === 'all') && <td className="p-4 text-secondary opacity-80 uppercase text-[10px] font-black tracking-widest">{k.tier}</td> }
                                                            </tr>
                                                        ))}
                                                        {(!inspector.view || inspector.view === 'all' || inspector.view === 'pro') && inspector.statusData.proKeysList?.map((k, i) => (
                                                            <tr key={`p-${i}`} className="hover:bg-surface-container-high transition-colors">
                                                                <td className="p-4 text-info">{k.key}</td>
                                                                <td className="p-4"><span className="bg-surface-container-high font-medium px-2 py-1 rounded border border-outline/5">{k.project}</span></td>
                                                                <td className="p-4">
                                                                    <span className={`px-2 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                                                                        k.status === 'Active' ? 'bg-success/15 text-success' :
                                                                        k.status === 'Dead' ? 'bg-warning/15 text-warning' :
                                                                        'bg-error/15 text-error'
                                                                    }`}>
                                                                        {k.status}
                                                                    </span>
                                                                </td>
                                                                { (!inspector.view || inspector.view === 'all') && <td className="p-4 text-info opacity-80 uppercase text-[10px] font-black tracking-widest">{k.tier}</td> }
                                                            </tr>
                                                        ))}
                                                        { ((inspector.view === 'ultra' && !inspector.statusData.ultraKeysList?.length) ||
                                                           (inspector.view === 'pro' && !inspector.statusData.proKeysList?.length) ||
                                                           ((!inspector.view || inspector.view === 'all') && !inspector.statusData.ultraKeysList?.length && !inspector.statusData.proKeysList?.length)) && (
                                                            <tr>
                                                                <td colSpan={100} className="p-10 text-center text-on-surface-variant font-medium text-sm border-t border-outline/5 bg-surface-container/50">No Keys Detected in Pool</td>
                                                            </tr>
                                                        )}
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                    {(!inspector.view || inspector.view === 'all' || inspector.view === 'blocks') && (
                                    <div className="p-5 bg-error/5 shadow-sm ring-1 ring-error/20 rounded-xl mt-6">
                                        <div className="text-[11px] uppercase font-black text-error tracking-widest mb-3">429 Active Blocks</div>
                                        <div className="text-sm font-mono font-bold text-error leading-relaxed">
                                            {inspector.statusData.blockedProjects.length === 0 ? 'Clear (No Captchas)' : inspector.statusData.blockedProjects.join(', ')}
                                        </div>
                                    </div>
                                    )}
                                    {(!inspector.view || inspector.view === 'all' || inspector.view === 'dead') && (
                                    <div className="p-5 bg-warning/5 shadow-sm ring-1 ring-warning/20 rounded-xl mt-4">
                                        <div className="text-[11px] uppercase font-black text-warning tracking-widest mb-3">Dead Keys (403)</div>
                                        <div className="text-sm font-mono font-bold text-warning leading-relaxed">
                                            {inspector.statusData.deadKeysCount === 0 ? 'Clear (No 403s)' : inspector.statusData.deadKeys?.join(', ')}
                                        </div>
                                    </div>
                                    )}
                                    <div className="pt-6">
                                        <Button 
                                            onClick={() => router.push(`/design/${theme}/mission-control/gateway`)}
                                            className="w-full h-14 rounded-xl shadow-sm bg-primary hover:bg-primary/90 text-on-primary font-bold tracking-widest uppercase transition-all"
                                        >
                                            Inspect Key Matrix
                                        </Button>
                                    </div>
                                </>
                            )}
                            {/* App & Infra defaults */}
                            {(inspector.type === 'app' || inspector.type === 'infra') && (
                                <>
                                    <div className="flex justify-between items-center p-5 rounded-xl bg-surface-container shadow-sm ring-1 ring-outline/10 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Activity className="h-4 w-4 text-on-surface-variant" />
                                            <span className="text-on-surface-variant tracking-widest uppercase text-[11px] font-bold">Ping State</span>
                                        </div>
                                        <div className="flex items-center gap-3 bg-surface-container-high px-3.5 py-1.5 rounded-full border border-outline/10">
                                            <span className="capitalize font-mono text-xs font-bold text-on-surface">
                                                {inspector.type === 'app' ? inspector.status : inspector.info.status}
                                            </span>
                                            <div className={`h-2.5 w-2.5 rounded-full ${statusDot(inspector.type === 'app' ? inspector.status : inspector.info.status)}`} />
                                        </div>
                                    </div>
                                    
                                    <div className="p-5 bg-surface-container shadow-sm ring-1 ring-outline/10 rounded-xl">
                                        <div className="text-[11px] uppercase font-bold text-on-surface-variant tracking-widest mb-3">Connection Bind</div>
                                        <div className="font-mono text-lg font-medium text-on-surface bg-surface-container-high px-4 py-2 rounded-lg border border-outline/5 w-max">
                                            {inspector.type === 'infra' && inspector.info.parsedHost && inspector.info.parsedHost !== 'localhost' ? inspector.info.parsedHost : `:${inspector.node.port}`}
                                        </div>
                                    </div>
                                    
                                    {inspector.type === 'app' && (
                                        <div className="p-5 bg-surface-container shadow-sm ring-1 ring-outline/10 rounded-xl relative overflow-hidden">
                                            <div className="absolute top-0 left-0 w-1.5 h-full bg-primary" />
                                            <div className="text-[11px] uppercase font-bold text-on-surface-variant tracking-widest mb-2 pl-3">Component</div>
                                            <div className="font-body text-base font-bold text-on-surface uppercase tracking-widest pl-3">
                                                {(inspector.node as typeof APP_SERVICES[number]).role}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </SheetContent>
            </Sheet>

            {/* ── Footer ─────────────────────────────────────────── */}
            <div className="mt-auto">
                <footer className="flex items-center justify-between border-t border-outline/10 pt-6 mt-12 text-[11px] uppercase tracking-widest text-on-surface-variant font-bold">
                    <div className="flex items-center gap-4">
                        <span>Session: {new Date().toISOString().split('T')[0]}</span>
                        <div className="h-1.5 w-1.5 bg-outline/20 rounded-full" />
                        <span>User: ZEUS_TOM</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Terminal className="h-4 w-4" />
                        <span>ZAP-OS Kernel v4.2.0 // Memory v2.1</span>
                    </div>
                </footer>
            </div>
        </div>
    );

}
