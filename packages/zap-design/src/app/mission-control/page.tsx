"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Zap, Monitor, Terminal, Activity, Layers, Brain, Code, Compass, Search, Cpu, Send, Eye, Radio, Server, Database, HardDrive, Container } from 'lucide-react';
import { Icon } from '../../genesis/atoms/icons/Icon';
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

const INFRA_SERVICES = [
    { name: 'Redis',     port: 6379, icon: Database,  color: 'red' },
    { name: 'MongoDB',   port: 27017, icon: Database, color: 'green' },
    { name: 'Postgres',  port: 5432, icon: HardDrive, color: 'blue' },
    { name: 'ChromaDB',  port: 8100, icon: Container, color: 'amber' },
] as const;

type Status = 'online' | 'offline' | 'checking';

export default function MissionControlPage() {
    const [agentStatuses, setAgentStatuses] = useState<Record<number, Status>>(
        Object.fromEntries(FLEET_AGENTS.map(a => [a.port, 'checking']))
    );
    const [infraStatuses, setInfraStatuses] = useState<Record<number, Status>>(
        Object.fromEntries(INFRA_SERVICES.map(s => [s.port, 'checking']))
    );
    const [lastCheck, setLastCheck] = useState<string>('—');

    useEffect(() => {
        let active = true;

        const checkPort = async (port: number): Promise<Status> => {
            try {
                const controller = new AbortController();
                const timeout = setTimeout(() => controller.abort(), 3000);
                await fetch(`http://localhost:${port}`, { mode: 'no-cors', signal: controller.signal });
                clearTimeout(timeout);
                return 'online';
            } catch {
                return 'offline';
            }
        };

        const poll = async () => {
            if (!active) return;
            const agentResults = await Promise.all(
                FLEET_AGENTS.map(async (a) => ({ port: a.port, status: await checkPort(a.port) }))
            );
            if (!active) return;
            const newAgent: Record<number, Status> = {};
            agentResults.forEach(r => { newAgent[r.port] = r.status; });
            setAgentStatuses(newAgent);

            const infraResults = await Promise.all(
                INFRA_SERVICES.map(async (s) => ({ port: s.port, status: await checkPort(s.port) }))
            );
            if (!active) return;
            const newInfra: Record<number, Status> = {};
            infraResults.forEach(r => { newInfra[r.port] = r.status; });
            setInfraStatuses(newInfra);
            setLastCheck(new Date().toLocaleTimeString());
        };
        const id = setInterval(poll, 15000);
        poll();
        return () => { active = false; clearInterval(id); };
    }, []);

    const onlineCount = Object.values(agentStatuses).filter(s => s === 'online').length;
    const totalCount = FLEET_AGENTS.length;
    const infraOnline = Object.values(infraStatuses).filter(s => s === 'online').length;
    const allHealthy = onlineCount === totalCount && infraOnline === INFRA_SERVICES.length;

    const statusDot = (s: Status) =>
        s === 'online' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]'
        : s === 'offline' ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.4)]'
        : 'bg-yellow-500 animate-pulse';

    return (
        <div className="min-h-screen bg-[#0A0A0A] p-6 md:p-8 font-mono text-white">
            {/* ── Header ─────────────────────────────────────────── */}
            <header className="mb-8 border border-white/10 bg-white/[0.02] backdrop-blur-sm rounded-lg p-6">
                <div className="flex items-center justify-between flex-wrap gap-4">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <Zap className="h-8 w-8 text-amber-400" fill="currentColor" />
                            <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tight bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent">
                                Mission Control
                            </h1>
                        </div>
                        <p className="text-sm text-white/40 font-medium tracking-wide">
                            ZAP-OS v2.1 &mdash; Memory Fleet &mdash; {totalCount} Agents &mdash; {INFRA_SERVICES.length} Services
                        </p>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <div className="text-[10px] uppercase tracking-[0.2em] text-white/30 mb-1">System Pulse</div>
                            <div className="flex items-center gap-2 justify-end">
                                <div className={`h-3 w-3 rounded-full ${allHealthy ? 'bg-green-500 animate-pulse shadow-[0_0_12px_rgba(34,197,94,0.6)]' : 'bg-amber-500'}`} />
                                <span className="font-black text-sm">{allHealthy ? 'ALL SYSTEMS GO' : `${onlineCount}/${totalCount} ONLINE`}</span>
                            </div>
                            <div className="text-[9px] text-white/20 mt-1">Last check: {lastCheck}</div>
                        </div>
                    </div>
                </div>
            </header>

            {/* ── Quick Stats Bar ──────────────────────────────────── */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                {[
                    { label: 'Agents Online', value: `${onlineCount}/${totalCount}`, accent: onlineCount === totalCount ? 'text-green-400' : 'text-amber-400' },
                    { label: 'Infrastructure', value: `${infraOnline}/${INFRA_SERVICES.length}`, accent: infraOnline === INFRA_SERVICES.length ? 'text-green-400' : 'text-red-400' },
                    { label: 'Tier-1 Agents', value: FLEET_AGENTS.filter(a => a.tier === 'tier-1').length.toString(), accent: 'text-blue-400' },
                    { label: 'Tier-2 Agents', value: FLEET_AGENTS.filter(a => a.tier === 'tier-2').length.toString(), accent: 'text-purple-400' },
                ].map(stat => (
                    <div key={stat.label} className="border border-white/10 bg-white/[0.02] rounded-lg p-4">
                        <div className="text-[10px] uppercase tracking-[0.15em] text-white/30 mb-1">{stat.label}</div>
                        <div className={`text-2xl font-black ${stat.accent}`}>{stat.value}</div>
                    </div>
                ))}
            </div>

            {/* ── Fleet Grid ──────────────────────────────────────── */}
            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Monitor className="h-5 w-5 text-white/40" />
                    <h2 className="text-lg font-black uppercase tracking-wide text-white/60">Agent Fleet</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                    {FLEET_AGENTS.map((agent) => {
                        const status = agentStatuses[agent.port] || 'checking';                        return (
                            <div
                                key={agent.port}
                                className={`group border rounded-lg p-4 transition-all duration-200 hover:bg-white/[0.04] ${
                                    status === 'online'
                                        ? 'border-white/10 bg-white/[0.02]'
                                        : status === 'offline'
                                        ? 'border-red-500/20 bg-red-500/[0.03]'
                                        : 'border-yellow-500/20 bg-yellow-500/[0.02]'
                                }`}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2">
                                        <Icon name="Bot" className="h-4 w-4 text-white/40" />
                                        <span className="font-black text-sm uppercase">{agent.name}</span>
                                    </div>
                                    <div className={`h-2.5 w-2.5 rounded-full ${statusDot(status)} mt-1`} />
                                </div>
                                <div className="space-y-1">
                                    <div className="text-[10px] text-white/30 uppercase tracking-wider">{agent.role}</div>
                                    <div className="flex items-center justify-between">
                                        <code className="text-xs text-white/50">:{agent.port}</code>
                                        <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${
                                            agent.tier === 'infra' ? 'bg-slate-500/20 text-slate-400'
                                            : agent.tier === 'tier-1' ? 'bg-blue-500/20 text-blue-400'
                                            : 'bg-purple-500/20 text-purple-400'
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

            {/* ── Infrastructure ──────────────────────────────────── */}
            <section className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                    <Database className="h-5 w-5 text-white/40" />
                    <h2 className="text-lg font-black uppercase tracking-wide text-white/60">Infrastructure</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {INFRA_SERVICES.map((svc) => {
                        const status = infraStatuses[svc.port] || 'checking';
                        const Icon = svc.icon;
                        return (
                            <div
                                key={svc.port}
                                className={`border rounded-lg p-4 transition-all ${
                                    status === 'online' ? 'border-white/10 bg-white/[0.02]' : 'border-red-500/20 bg-red-500/[0.03]'
                                }`}
                            >
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <Icon className="h-4 w-4 text-white/40" />
                                        <span className="font-black text-sm">{svc.name}</span>
                                    </div>
                                    <div className={`h-2.5 w-2.5 rounded-full ${statusDot(status)}`} />
                                </div>
                                <code className="text-xs text-white/40">:{svc.port}</code>
                            </div>
                        );
                    })}
                </div>
            </section>

            {/* ── Athena Research Panel ───────────────────────────── */}
            <section className="mb-8 border border-amber-500/20 bg-amber-500/[0.03] rounded-lg p-6">
                <div className="flex items-center gap-2 mb-4">
                    <Brain className="h-5 w-5 text-amber-400" />
                    <h2 className="text-lg font-black uppercase tracking-wide text-amber-400/80">Athena Research Agent</h2>
                    <span className="text-[9px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold uppercase ml-2">NotebookLM</span>
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
                        <div key={ep.endpoint} className="border border-amber-500/10 rounded p-3 bg-amber-500/[0.02]">
                            <div className="text-xs font-bold text-amber-400/60 mb-1">{ep.label}</div>
                            <div className="flex items-center gap-1.5">
                                <span className={`text-[9px] font-bold px-1 rounded ${ep.method === 'GET' ? 'bg-green-500/20 text-green-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                    {ep.method}
                                </span>
                                <code className="text-[10px] text-white/30 truncate">{ep.endpoint}</code>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Footer ─────────────────────────────────────────── */}
            <footer className="flex items-center justify-between border-t border-white/5 pt-6 text-[10px] uppercase tracking-[0.2em] text-white/20">
                <div className="flex items-center gap-4">
                    <span>Session: {new Date().toISOString().split('T')[0]}</span>
                    <div className="h-1 w-1 bg-white/10 rounded-full" />
                    <span>User: ZEUS_TOM</span>
                </div>
                <div className="flex items-center gap-2">
                    <Terminal className="h-3 w-3" />
                    <span>ZAP-OS Kernel v4.2.0 // Memory v2.1</span>
                </div>
            </footer>
        </div>
    );
}
