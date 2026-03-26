'use client';

import React, { useState, useEffect } from 'react';
import { NeoBadge } from 'zap-design/src/genesis/atoms/status/badges';
import { AppShell } from 'zap-design/src/zap/layout/AppShell';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';
import { Wrapper } from 'zap-design/src/components/dev/Wrapper';
import { StatusDot } from 'zap-design/src/genesis/atoms/status/indicators';
import { MetroHeader } from 'zap-design/src/genesis/molecules/layout/MetroHeader';
import { KanbanBoard, KanbanColumn, KanbanTask } from 'zap-design/src/genesis/organisms/kanban-board';

interface ServerInfo {
    id: string;
    name: string;
    sector: string;
    status: 'online' | 'offline';
    version: string;
    host: string;
    details: string;
    latency: string;
}

interface AgentInfo {
    id: string;
    name: string;
    role: string;
    port: number;
    status: 'online' | 'offline' | 'checking';
}

interface InfrastructureReport {
    servers: ServerInfo[];
    agents: AgentInfo[];
    tasks?: KanbanTask[];
    activeSplit?: string;
}

const INITIAL_COLUMNS: KanbanColumn[] = [
  { id: 'queued', title: 'Queued Jobs' },
  { id: 'in-progress', title: 'Swarm Active' },
  { id: 'review', title: 'Validation' },
  { id: 'done', title: 'Done / Merged' },
];

const INITIAL_TASKS: KanbanTask[] = [
  { id: 'job-1', columnId: 'in-progress', title: 'Extract Flutter REST Endpoints from zap-auth', priority: 'high', assignee: { name: 'Spike', avatarUrl: 'https://i.pravatar.cc/150?u=spike' } },
  { id: 'job-2', columnId: 'queued', title: 'Route handler mapping in zap-claw API', priority: 'medium', assignee: { name: 'Jerry', avatarUrl: 'https://i.pravatar.cc/150?u=jerry' } },
  { id: 'job-3', columnId: 'done', title: 'Resolve `sidebar.tsx` hydration failure', priority: 'high' },
  { id: 'job-4', columnId: 'in-progress', title: 'Token extraction via HTTP headers', priority: 'medium' },
];

export default function MissionControlDashboard() {
    const [report, setReport] = useState<InfrastructureReport | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastSync, setLastSync] = useState<string>('');
    const [tasks, setTasks] = useState<KanbanTask[]>(INITIAL_TASKS);

    const fetchReport = async () => {
        setLoading(true);
        try {
            // First fetch existing infrastructure state (mock/local)
            const infraReq = fetch('/api/admin/infrastructure').catch(() => null);
            // Poll the newly injected backend telemetry endpoints via absolute local URL
            const heartbeatReq = fetch('http://localhost:4000/api/admin/heartbeat').catch(() => null);
            const swarmReq = fetch('http://localhost:4000/api/admin/swarm').catch(() => null);

            const [infraRes, heartbeatRes, swarmRes] = await Promise.all([infraReq, heartbeatReq, swarmReq]);
            
            const data: InfrastructureReport = { servers: [], agents: [] };
            
            if (infraRes && infraRes.ok) {
                const infraData = await infraRes.json();
                data.servers = infraData.servers || [];
                data.agents = infraData.agents || [];
                if (infraData.tasks?.length > 0) {
                    setTasks(infraData.tasks);
                }
                data.activeSplit = infraData.activeSplit || undefined;
            }

            // Inject Docker telemetry if the heartbeat responds
            if (heartbeatRes && heartbeatRes.ok) {
                const hb = await heartbeatRes.json();
                if (hb.daemonAlive && hb.agents) {
                    const dockerAgents = hb.agents.map((a: { ID?: string, Names?: string, Image?: string, State?: string }) => ({
                        id: a.ID || Math.random().toString(),
                        name: (a.Names || 'Docker Node').substring(0, 15),
                        role: a.Image || 'Worker',
                        port: 0,
                        status: a.State === 'running' ? 'online' : 'offline'
                    }));
                    data.agents = [...data.agents, ...dockerAgents];
                }
            }

            // Inject Swarm (Claude) telemetry
            if (swarmRes && swarmRes.ok) {
                const swarmData = await swarmRes.json();
                data.servers.push({
                    id: 'swarm-registry',
                    name: 'Claude Swarm',
                    sector: 'Orchestration',
                    status: 'online',
                    version: 'Anthropic Uplink',
                    host: 'API Gateway',
                    details: `Active Jobs: ${swarmData.registry?.active_jobs || 0}`,
                    latency: `${swarmData.registry?.tpm_burn_rate || 0} TPM`
                });
                
                if (swarmData.nativeAgents) {
                    data.agents = [...data.agents, ...swarmData.nativeAgents];
                }
            }

            setReport(data);
            setLastSync(new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
        } catch (err) {
            console.error("Infrastructure Sync Failed:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReport();
        const interval = setInterval(fetchReport, 60000);
        return () => clearInterval(interval);
    }, []);

    const ServerCard = ({ server }: { server: ServerInfo }) => (
        <CardWrapper>
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                    <StatusDot 
                        intent={server.status === 'online' ? 'online' : 'offline'} 
                        pulse={server.status === 'online'} 
                        size="lg" 
                        className={server.status === 'online' ? 'shadow-[0_0_12px_rgba(34,197,94,0.6)]' : ''}
                    />
                    <div>
                        <div className="text-xl font-black text-on-surface uppercase font-display leading-none">{server.name}</div>
                        <div className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-widest font-body">{server.sector}</div>
                    </div>
                </div>
                <NeoBadge variant={server.status === 'online' ? 'yellow' : 'dark'}>
                    {server.status.toUpperCase()}
                </NeoBadge>
            </div>
            
            <div className="space-y-3 pt-4 border-t border-outline/5 font-body">
                <DataRow label="Version" value={server.version} />
                <DataRow label="Host" value={server.host} className="font-mono text-[10px]" />
                <DataRow label="Details" value={server.details} />
                <DataRow label="Latency" value={server.latency} valueClassName={server.status === 'online' ? 'text-primary' : 'text-on-surface-variant'} />
            </div>
        </CardWrapper>
    );

    const Inspector = () => (
        <div className="w-80 h-full bg-layer-panel flex flex-col font-dev">
            <Wrapper identity={{ displayName: "Inspector Header", type: "Wrapped Snippet", filePath: "app/admin/infrastructure/page.tsx" }}>
                <div className="h-14 px-4 flex items-center justify-between shrink-0 border-b border-border/50 bg-layer-panel">
                    <div className="flex items-center gap-2">
                        <Icon name="radar" size={18} className="text-foreground" />
                        <h2 className="font-black text-foreground text-[11px] tracking-widest font-display text-transform-primary uppercase">
                            MISSION CONTROL
                        </h2>
                    </div>
                </div>
            </Wrapper>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-8">
                {/* 1. THE BRAIN (MEMORY) */}
                <Wrapper identity={{ displayName: "Memory Status Section", type: "Section", filePath: "app/admin/infrastructure/page.tsx" }}>
                    <div className="space-y-3">
                        <Heading level={6} className="flex items-center gap-2 text-on-surface-variant px-1 uppercase mb-2">
                            <Icon name="psychology" size={16} weight={700} className="text-primary"/>
                            The Brain (Memory)
                        </Heading>
                        <div className="space-y-2 p-3 bg-surface-container rounded-md border border-outline/10">
                            <DataRow label="Active Split" value={report?.activeSplit || "AWAITING_SYNC"} valueClassName="font-mono text-[9px] text-brand-yellow font-black" />
                            <DataRow label="MongoDB Sync" value={report?.activeSplit ? "ONLINE" : "OFFLINE"} valueClassName="text-[10px] text-green-500 font-bold" />
                            <DataRow label="Chroma KIs" value="INJECTED" valueClassName="text-[10px] text-green-500 font-bold" />
                        </div>
                    </div>
                </Wrapper>

                {/* 2. THE ARMORY (SOP / SKILLS) */}
                <Wrapper identity={{ displayName: "Active SOPs Section", type: "Section", filePath: "app/admin/infrastructure/page.tsx" }}>
                    <div className="space-y-3">
                        <Heading level={6} className="flex items-center gap-2 text-on-surface-variant px-1 uppercase mb-2">
                            <Icon name="shield" size={16} weight={700} className="text-primary"/>
                            Active SOPs (Armory)
                        </Heading>
                        <div className="space-y-2 p-3 bg-surface-container rounded-md border border-outline/10">
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-on-surface">zap-layer-surface-dev-color</span>
                                <Icon name="check_circle" size={12} className="text-green-500" />
                            </div>
                            <div className="flex items-center justify-between">
                                <span className="text-[10px] font-mono font-bold text-on-surface">zap-foundation-enforcer</span>
                                <Icon name="check_circle" size={12} className="text-green-500" />
                            </div>
                            <div className="flex items-center justify-between opacity-50">
                                <span className="text-[10px] font-mono font-bold text-on-surface line-through">zap-spike-extraction</span>
                                <Icon name="cancel" size={12} className="text-on-surface-variant" />
                            </div>
                        </div>
                    </div>
                </Wrapper>

                {/* 3. AGENT FLEET HEALTH */}
                <Wrapper identity={{ displayName: "Agent Status Section", type: "Section", filePath: "app/admin/infrastructure/page.tsx" }}>
                    <div className="space-y-3">
                        <Heading level={6} className="text-on-surface-variant px-1 uppercase mb-2">Fleet Health</Heading>
                        <div className="space-y-2">
                            {report?.agents.map(agent => (
                                <div key={agent.id} className="flex items-center justify-between p-3 bg-layer-panel border border-outline/5 rounded-md shadow-sm">
                                    <div className="flex items-center gap-3">
                                        <div className="h-8 w-8 bg-primary-container rounded flex items-center justify-center text-on-primary-container font-black text-xs">
                                            {agent.name[0]}
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-on-surface uppercase leading-none mb-1">{agent.name}</div>
                                            <div className="text-[8px] font-bold text-on-surface-variant/60 uppercase tracking-tighter">{agent.role}</div>
                                        </div>
                                    </div>
                                    <div className="flex flex-col items-end gap-1">
                                        <div className={`h-1.5 w-1.5 rounded-full ${
                                            agent.status === 'online' ? 'bg-primary' : 
                                            agent.status === 'offline' ? 'bg-error' : 
                                            'bg-brand-yellow animate-pulse'
                                        }`} />
                                    </div>
                                </div>
                            ))}
                            {(!report?.agents || report.agents.length === 0) && (
                                <div className="text-[10px] text-on-surface-variant font-medium text-center py-4 bg-surface-container rounded border border-outline/5">
                                    AWAITING FLEET HEARTBEAT...
                                </div>
                            )}
                        </div>
                    </div>
                </Wrapper>

                {/* 4. QUICK TARGETS */}
                <Wrapper identity={{ displayName: "Quick Access Links", type: "Section", filePath: "app/admin/infrastructure/page.tsx" }}>
                    <div className="space-y-3">
                        <Heading level={6} className="text-on-surface-variant px-1 uppercase mb-2">Internal Gateways</Heading>
                        {[
                            { label: 'Cloud DB Viewer', icon: 'database', href: '#' },
                            { label: 'Job Registry Log', icon: 'fact_check', href: '/admin/log' }
                        ].map(link => (
                            <a key={link.label} href={link.href} className="flex items-center justify-between p-2.5 border border-outline/5 text-[10px] font-black uppercase text-on-surface-variant hover:bg-primary hover:text-on-primary transition-all group rounded bg-surface">
                                <span className="flex items-center gap-2">
                                    <Icon name={link.icon} size={14} weight={700} />
                                    {link.label}
                                </span>
                                <Icon name="arrow_forward" size={12} weight={700} className="opacity-0 group-hover:opacity-100" />
                            </a>
                        ))}
                    </div>
                </Wrapper>
            </div>
            
            <div className="p-4 bg-surface-container border-t border-outline/10 text-center">
                <div className="text-[9px] font-black uppercase tracking-[0.2em] mb-1 text-on-surface-variant/40">ZAP_KERNEL_REVISION</div>
                <div className="text-[10px] font-mono text-on-surface">v4.2.0-MISSION_CONTROL</div>
            </div>
        </div>
    );

    return (
        <AppShell inspector={<Inspector />}>
            <div className="flex-1 overflow-y-auto bg-surface-container-lowest font-dev mb-20 scrollbar-hide flex flex-col">
                <Wrapper identity={{ displayName: "Infrastructure Header", type: "Header", filePath: "app/admin/infrastructure/page.tsx" }}>
                    <MetroHeader 
                        title="mission control"
                        breadcrumb="ADMIN/HUD"
                        badge="L7: OVERVIEW"
                        liveIndicator={true}
                    />
                </Wrapper>

                <div className="flex-1 px-10 py-6 flex flex-col gap-10">
                    <Wrapper identity={{ displayName: "Swarm Fleet Section", type: "Body", filePath: "app/admin/infrastructure/page.tsx" }}>
                        <div className="flex flex-col gap-6">
                            <div className="flex items-end justify-between border-b border-outline/10 pb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-on-surface font-display leading-none uppercase">MCP Connection Fleet</h3>
                                    <p className="text-sm font-bold text-on-surface-variant font-body mt-2">
                                        Real-time pipeline health to external databases and orchestration services.
                                    </p>
                                </div>
                                <div className="text-right flex flex-col items-end gap-1 text-transform-tertiary">
                                    <div className="text-3xl font-black text-on-surface font-display leading-none flex items-baseline gap-1">
                                        <span>{report?.servers.filter(s => s.status === 'online').length || 0}</span>
                                        <span className="text-xl text-on-surface-variant/40">/</span>
                                        <span>{report?.servers.length || 0}</span>
                                    </div>
                                    <div className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant/60 flex items-center gap-2">
                                        Sync: {lastSync || 'CALIBRATING...'}
                                        <Icon name="timer" size={12} weight={700} className={loading ? 'animate-spin' : ''} />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {report?.servers.map(server => (
                                    <ServerCard key={server.id} server={server} />
                                ))}
                                {(!report?.servers || report.servers.length === 0) && (
                                    <div className="col-span-full h-32 flex items-center justify-center bg-surface-container rounded-xl border border-outline/10 border-dashed">
                                        <span className="text-xs font-bold text-on-surface-variant uppercase tracking-widest">Scanning MCP Fleet...</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </Wrapper>

                    <Wrapper identity={{ displayName: "Swarm Kanban Core", type: "Body", filePath: "app/admin/infrastructure/page.tsx" }}>
                        <div className="flex flex-col gap-6 flex-1 min-h-[600px] bg-layer-panel border border-outline/10 rounded-2xl p-6 shadow-sm">
                            <div className="flex justify-between items-center border-b border-outline/10 pb-4">
                                <div>
                                    <h3 className="text-2xl font-black text-on-surface font-display leading-none uppercase">Swarm Work Stream</h3>
                                    <p className="text-sm font-bold text-on-surface-variant font-body mt-2">
                                        Active job tickets distributed across the agent matrix.
                                    </p>
                                </div>
                                <NeoBadge variant="yellow" className="shadow-sm border border-primary/20">
                                    {tasks.length} ACTIVE DIRECTIVES
                                </NeoBadge>
                            </div>
                            
                            <div className="flex-1 w-full bg-surface-container-lowest rounded-xl border border-outline/5 overflow-hidden">
                                <KanbanBoard
                                    columns={INITIAL_COLUMNS}
                                    tasks={tasks}
                                    onTasksChange={setTasks}
                                    className="pt-4 px-2"
                                />
                            </div>
                        </div>
                    </Wrapper>
                </div>
            </div>
        </AppShell>
    );
}

function CardWrapper({ children }: { children: React.ReactNode }) {
    return (
        <div className="bg-layer-panel border border-outline/10 rounded-xl p-5 shadow-[0px_5px_15px_-5px_rgba(0,0,0,0.05)] hover:shadow-[0px_10px_30px_-10px_rgba(0,0,0,0.1)] transition-all duration-300 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:bg-primary/10 transition-colors" />
            <div className="relative z-10">{children}</div>
        </div>
    );
}

function DataRow({ label, value, className = '', valueClassName = '' }: { label: string; value: string; className?: string; valueClassName?: string }) {
    return (
        <div className={`flex items-center justify-between text-xs py-0.5 ${className}`}>
            <span className="font-bold text-on-surface-variant/50 uppercase tracking-tight">{label}</span>
            <span className={`font-black text-on-surface text-right max-w-[160px] truncate ${valueClassName}`}>{value}</span>
        </div>
    );
}
