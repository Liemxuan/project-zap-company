"use client";

export const dynamic = 'force-dynamic';

import React, { use, useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { ArrowLeft, BrainCircuit, Activity, Lock, MapPin, FileCode2, Terminal, Database, ShieldAlert, Sparkles, Building, Briefcase, Bot, Wrench, Fingerprint, LineChart, Code2 } from 'lucide-react';
import { Button as GenesisButton } from 'zap-design/src/genesis/atoms/interactive/buttons';
import { Card } from 'zap-design/src/genesis/atoms/surfaces/card';
import { Avatar, AvatarFallback } from 'zap-design/src/genesis/atoms/interactive/avatar';
import { Badge } from 'zap-design/src/genesis/atoms/status/badges';
import { LiveBlinker } from 'zap-design/src/genesis/atoms/indicators/LiveBlinker';
import { AppShell } from 'zap-design/src/zap/layout/AppShell';
import { Heading } from 'zap-design/src/genesis/atoms/typography/headings';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';

export default function AgentProfile({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const agentName = resolvedParams.id.charAt(0).toUpperCase() + resolvedParams.id.slice(1);

    const [isActive, setIsActive] = useState(false);
    const [activeTab, setActiveTab] = useState("activity");
    const [professions, setProfessions] = useState<Record<string, any>>({});
    const [selectedRole, setSelectedRole] = useState("CHIEF_OF_STAFF");
    const [customTags, setCustomTags] = useState("");
    const [isCompiling, setIsCompiling] = useState(false);
    const [agentMemories, setAgentMemories] = useState<any[]>([]);
    const [showSyncConfirm, setShowSyncConfirm] = useState(false);
    const [telemetry, setTelemetry] = useState<any>({
        tokens: "0.0 / 0.0",
        latency: "0.0s",
        errors: "0.00%",
        total_memories: 0
    });
    const [terminalLogs, setTerminalLogs] = useState<string>("> Initializing Trace Stream for agent '" + resolvedParams.id + "'...\r\n");
    const terminalRef = useRef<HTMLDivElement>(null);

    const fetchMemories = async () => {
        try {
            const res = await fetch(`/api/swarm/memory?agentId=${resolvedParams.id.toLowerCase()}`);
            if (res.ok) {
                const data = await res.json();
                if (data.success) setAgentMemories(data.memories || []);
            }
        } catch (err) {}
    };

    useEffect(() => {
        // Fetch real docker status in real-world
        setIsActive(true);

        // Fetch the global allowed professions for the dropdown
        fetch("/api/swarm/professions")
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setProfessions(data.professions);
                }
            });

        // Hydrate UI State from exactly what lives in IDENTITY.md
        fetch(`/api/swarm/agents/${resolvedParams.id.toLowerCase()}/files`)
            .then(res => res.json())
            .then(data => {
                if (data.success && data.files) {
                    const identityFile = data.files.find((f: any) => f.filename === "IDENTITY.md");
                    if (identityFile && identityFile.content) {
                        const content = identityFile.content;
                        const roleMatch = content.match(/\*\*Role:\*\*\s*([A-Z0-9_]+)/i);
                        if (roleMatch && roleMatch[1]) {
                            setSelectedRole(roleMatch[1].toUpperCase());
                        }
                        const tagsMatch = content.match(/\*\*Tags:\*\*\s*(.+)/i);
                        if (tagsMatch && tagsMatch[1]) {
                            setCustomTags(tagsMatch[1].trim());
                        }
                    }
                }
            });

        fetchMemories();

        // 1. Fetch Real-time Telemetry
        const fetchTelemetry = async () => {
            try {
                const res = await fetch(`/api/swarm/agents/${resolvedParams.id.toLowerCase()}/telemetry`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.success) {
                        setTelemetry(data.stats);
                    }
                }
            } catch (err) {}
        };
        fetchTelemetry();
        const teleInterval = setInterval(fetchTelemetry, 10000);

        // 2. SSE for Terminal Logs
        let sse: EventSource;
        try {
            sse = new EventSource(`/api/swarm/logs?container=${resolvedParams.id.toLowerCase()}`);
            sse.onmessage = (e) => {
                try {
                    const data = JSON.parse(e.data);
                    if (data.logs) {
                        setTerminalLogs((prev) => prev + data.logs);
                    }
                } catch (err) {}
            };
        } catch (err) {}

        return () => {
            clearInterval(teleInterval);
            if (sse) sse.close();
        };

    }, [resolvedParams.id]);

    useEffect(() => {
        if (terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalLogs, activeTab]);

    const handleSync = async () => {
        setIsCompiling(true);
        try {
            const res = await fetch(`/api/swarm/agents/${resolvedParams.id.toLowerCase()}/sync`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: selectedRole, tags: customTags })
            });
            const data = await res.json();
            if (data.success) {
                alert("✅ Neural Matrix successfully locked into Swarm Registry.");
            } else {
                alert(`❌ Sync Failed: ${data.error}`);
            }
        } catch (e) {
            alert("❌ Server disconnected.");
        } finally {
            setIsCompiling(false);
        }
    };

    return (
        <AppShell>
            <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden relative z-10 bg-surface-container-lowest pb-12 w-full">

                {/* Back Button Overlay */}
                <div className="absolute top-4 left-4 z-50">
                    <Link href="/agents" className="flex items-center gap-2 px-3 py-2 bg-surface/50 backdrop-blur-md rounded-full border border-outline/10 text-on-surface-variant hover:text-on-surface hover:bg-surface transition-all">
                        <ArrowLeft className="size-4" />
                        <span className="text-xs font-bold tracking-wide">Back to Swarm</span>
                    </Link>
                </div>

                {/* Header Banner - Layer 1 */}
                <div className="w-full h-64 bg-primary-container relative border-b border-outline/10 overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.05)_50%,transparent_75%,transparent_100%)] bg-[length:20px_20px]" />
                    <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-container-lowest to-transparent" />
                </div>

                {/* Profile Information Container */}
                <div className="w-full max-w-[1200px] mx-auto px-6 lg:px-10 -mt-20 relative z-20">
                    <div className="flex flex-col lg:flex-row gap-8 items-start">

                        {/* Left Column: Avatar & Quick Info */}
                        <div className="flex flex-col gap-6 w-full lg:w-[340px] shrink-0">
                            <Card className="p-6 flex flex-col items-center text-center gap-4 bg-surface shadow-md">
                                <div className="relative">
                                    <Avatar className="h-32 w-32 text-4xl shadow-sm flex items-center justify-center rounded-full">
                                        <AvatarFallback className="text-5xl rounded-full">{agentName.substring(0, 2).toLowerCase()}</AvatarFallback>
                                    </Avatar>
                                    <div className="absolute bottom-1 right-1 border-[3px] border-surface rounded-full flex items-center justify-center bg-surface w-6 h-6 z-10">
                                        <LiveBlinker color={isActive ? 'green' : 'red'} iconOnly />
                                    </div>
                                </div>

                                <div className="flex flex-col gap-1 w-full mt-2">
                                    <h1 className="font-display text-headlineMedium text-on-surface text-transform-primary">{agentName}</h1>
                                    <p className="font-body text-titleMedium text-on-surface-variant text-transform-secondary flex items-center justify-center gap-1.5">
                                        <Bot className="size-4" /> @agent_{resolvedParams.id}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 mt-1">
                                    <Badge className="bg-inverse-surface text-inverse-on-surface flex items-center gap-1 border-transparent px-3 py-1">
                                        <ShieldAlert className="size-3" /> Core Fleet
                                    </Badge>
                                </div>

                                <div className="flex w-full gap-3 mt-4">
                                    <GenesisButton visualStyle="solid" className="flex-1 bg-primary text-on-primary" title="Wake agent from sleep mode" aria-label="Wake Agent">Wake</GenesisButton>
                                    <GenesisButton visualStyle="outline" className="flex-1 border-border text-on-surface hover:text-primary hover:border-primary/50" onClick={() => setActiveTab("memory")} title="View agent memory vault" aria-label="Open Memory Vault">Memory</GenesisButton>
                                </div>

                                {/* Meta info list */}
                                <div className="flex flex-col gap-3 w-full mt-6 text-left border-t border-border pt-6 bg-surface-container-lowest/50 p-4 rounded-[var(--card-radius,12px)]">
                                    <div className="flex items-center gap-3 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                        <Building className="size-4 text-primary" />
                                        <span>OLYMPUS Core</span>
                                    </div>
                                    <div className="flex items-center gap-3 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                        <MapPin className="size-4 text-primary" />
                                        <span>Port 3901 • Omni-Router</span>
                                    </div>
                                    <div className="flex items-center gap-3 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                        <Database className="size-4 text-primary" />
                                        <span>{telemetry.total_memories || 0} Knowledge Indexed</span>
                                    </div>
                                </div>
                            </Card>
                        </div>

                        {/* Right Column: Dynamic Tabs */}
                        <div className="flex flex-col gap-6 grow min-w-0 mt-8 lg:mt-24">

                            {/* Inner Tabs */}
                            <div className="flex gap-2 border-b border-border pb-[1px] overflow-x-auto no-scrollbar">
                                <GenesisButton
                                    visualStyle="ghost"
                                    onClick={() => setActiveTab("activity")}
                                    className={`rounded-none border-b-[3px] font-display text-transform-primary px-5 py-3 ${activeTab === "activity" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                                    title="View recent agent activities"
                                    aria-label="Activity Tab"
                                >
                                    <Activity className="size-4 mr-2 inline" /> Activities
                                </GenesisButton>
                                <GenesisButton
                                    visualStyle="ghost"
                                    onClick={() => setActiveTab("config")}
                                    className={`rounded-none border-b-[3px] font-display text-transform-primary px-5 py-3 ${activeTab === "config" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                                    title="Edit agent neural configuration"
                                    aria-label="General Info Tab"
                                >
                                    <BrainCircuit className="size-4 mr-2 inline" /> General Info
                                </GenesisButton>
                                <GenesisButton
                                    visualStyle="ghost"
                                    onClick={() => setActiveTab("identity")}
                                    className={`rounded-none border-b-[3px] font-display text-transform-primary px-5 py-3 ${activeTab === "identity" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                                    title="View IDENTITY.md cortex"
                                    aria-label="Identity Tab"
                                >
                                    <Fingerprint className="size-4 mr-2 inline" /> Identity
                                </GenesisButton>
                                <GenesisButton
                                    visualStyle="ghost"
                                    onClick={() => setActiveTab("mcp")}
                                    className={`rounded-none border-b-[3px] font-display text-transform-primary px-5 py-3 ${activeTab === "mcp" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                                    title="Manage MCP tool bindings"
                                    aria-label="Tools Tab"
                                >
                                    <Wrench className="size-4 mr-2 inline" /> Tools
                                </GenesisButton>
                                <GenesisButton
                                    visualStyle="ghost"
                                    onClick={() => setActiveTab("metrics")}
                                    className={`rounded-none border-b-[3px] font-display text-transform-primary px-5 py-3 ${activeTab === "metrics" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                                    title="View real-time agent metrics"
                                    aria-label="Metrics Tab"
                                >
                                    <LineChart className="size-4 mr-2 inline" /> Metrics
                                </GenesisButton>
                                <GenesisButton
                                    visualStyle="ghost"
                                    onClick={() => setActiveTab("terminal")}
                                    className={`rounded-none border-b-[3px] font-display text-transform-primary px-4 py-3 ${activeTab === "terminal" ? "border-primary text-primary bg-primary/5" : "border-transparent text-on-surface-variant hover:bg-surface-variant hover:text-on-surface"}`}
                                    title="Open agent execution terminal"
                                    aria-label="Terminal Tab"
                                >
                                    <Terminal className="size-4 mr-2 inline" />
                                </GenesisButton>
                            </div>

                            {/* Content Area */}
                            <div className="flex flex-col gap-6 mt-2">

                                {activeTab === "activity" && (
                                    <>
                                        <Card className="p-6 flex flex-col gap-4 shadow-sm border-outline/10">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <Avatar size="sm">
                                                        <AvatarFallback>{agentName.substring(0, 2).toLowerCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-display text-labelLarge text-on-surface">Spawned Omni-Router Trace</span>
                                                        </div>
                                                        <span className="font-body text-bodySmall text-on-surface-variant flex items-center gap-1 mt-0.5"><Activity className="size-3 text-success" /> 2 seconds ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pl-12 pr-4">
                                                <div className="p-4 rounded-[var(--card-radius,12px)] border border-outline/10 bg-inverse-surface font-mono text-xs text-inverse-on-surface whitespace-pre-wrap leading-relaxed shadow-inner">
                                                    {`[SYS] Requesting fallback allocation...
[API] Resolved -> PROV-ULTRA-01 
[LOG] Executing /packages/zap-design/src/genesis/templates/profile/ProfileTemplate.tsx
[STATUS] Clean DOM injection successful.`}
                                                </div>
                                            </div>
                                        </Card>

                                        <Card className="p-6 flex flex-col gap-4 shadow-sm border-outline/10">
                                            <div className="flex justify-between items-start">
                                                <div className="flex gap-4">
                                                    <Avatar size="sm">
                                                        <AvatarFallback>{agentName.substring(0, 2).toLowerCase()}</AvatarFallback>
                                                    </Avatar>
                                                    <div className="flex flex-col">
                                                        <div className="flex items-center gap-2">
                                                            <span className="font-display text-labelLarge text-on-surface">Security Audit Enforced</span>
                                                        </div>
                                                        <span className="font-body text-bodySmall text-on-surface-variant">3 hours ago</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="pl-12 pr-4">
                                                <p className="font-body text-bodyMedium text-on-surface text-transform-secondary italic text-primary border-l-[3px] border-primary pl-4 py-1">
                                                    "Blocked external port dependency injection to ensure zero bypass on OmniRouter limits."
                                                </p>
                                            </div>
                                        </Card>
                                    </>
                                )}

                                {activeTab === "config" && (
                                    <div className="flex flex-col gap-6">
                                        <Card className="p-8 flex flex-col gap-8 shadow-sm border-primary/20 bg-surface">
                                            <div>
                                                <Heading level={4} className="flex items-center gap-2 text-on-surface mb-2"><Briefcase className="text-primary size-5" /> Neural Configuration</Heading>
                                                <Text size="body-medium" className="text-on-surface-variant">Select the Agent's macro-profession to dynamically bind to the Fleet Core. This restricts their models and context tier automatically.</Text>
                                            </div>

                                            <div className="flex flex-col gap-6 bg-surface-container-lowest/50 p-6 rounded-[var(--card-radius,16px)] border border-outline/10">
                                                <div className="flex flex-col gap-2">
                                                    <label className="font-display text-labelLarge text-on-surface flex items-center gap-2">
                                                        <Sparkles className="size-4 text-primary" />
                                                        Primary Profession Lock
                                                    </label>
                                                    <select
                                                        value={selectedRole}
                                                        onChange={(e) => setSelectedRole(e.target.value)}
                                                        className="w-full bg-layer-base border border-outline/20 px-4 py-3 rounded-[var(--input-border-radius,8px)] text-on-surface font-body text-bodyMedium focus:border-primary focus:ring-1 focus:ring-primary/20 appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22M7%2010L12%2015L17%2010%22%20stroke%3D%22%23666%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%2F%3E%3C%2Fsvg%3E')] bg-no-repeat bg-[position:right_12px_center] pr-10 hover:border-primary/50 transition-colors"
                                                    >
                                                        {Object.keys(professions).map((key) => (
                                                            <option key={key} value={key}>
                                                                {professions[key].label} ({key})
                                                            </option>
                                                        ))}
                                                    </select>
                                                    {professions[selectedRole] && (
                                                        <div className="mt-3 text-sm text-on-surface-variant flex items-start gap-2 bg-layer-base p-3 rounded-lg border border-outline/5">
                                                            <ShieldAlert className="size-4 shrink-0 mt-0.5 text-success" />
                                                            <div className="flex flex-col gap-1">
                                                                <span>{professions[selectedRole].description}</span>
                                                                <span className="font-mono text-[11px] text-primary">Bound -&gt; {professions[selectedRole].primaryModel}</span>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="flex flex-col gap-2 mt-4">
                                                    <label className="font-display text-labelLarge text-on-surface flex items-center gap-2">
                                                        <FileCode2 className="size-4 text-primary" />
                                                        Custom Capability Tags (Comma Separated)
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={customTags}
                                                        onChange={(e) => setCustomTags(e.target.value)}
                                                        placeholder="e.g. sys-manager, deploy-specialist, code-reviewer"
                                                        className="w-full bg-layer-base border border-outline/20 px-4 py-3 rounded-[var(--input-border-radius,8px)] text-on-surface font-mono text-bodySmall focus:border-primary focus:ring-1 focus:ring-primary/20 hover:border-primary/50 transition-colors"
                                                    />
                                                    <Text size="body-small" className="text-on-surface-variant mt-1.5 leading-relaxed">
                                                        These tags will be dynamically merged into the Matrix Registry, routing incoming prompts to this agent automatically if they match the taxonomy.
                                                    </Text>
                                                </div>
                                            </div>

                                            <div className="flex justify-end pt-2">
                                                <GenesisButton disabled={isCompiling} visualStyle="solid" className="bg-primary text-on-primary font-bold px-8 py-2.5 shadow-md shadow-primary/20 hover:shadow-primary/40 transition-all hover:-translate-y-0.5" onClick={() => setShowSyncConfirm(true)} title="Synchronize changes with agent matrix" aria-label="Sync Matrix">
                                                    {isCompiling ? "Compiling Matrix..." : "Compile & Sync Neural Matrix"}
                                                </GenesisButton>
                                            </div>
                                        </Card>

                                        {/* Security Boundaries */}
                                        <Card className="p-8 flex flex-col gap-6 shadow-sm border-destructive/10 bg-surface">
                                            <Heading level={4} className="flex items-center gap-2 text-on-surface"><Lock className="text-destructive size-5" /> Security Cortex</Heading>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div className="p-4 border border-outline/10 rounded-[12px] flex justify-between items-center bg-layer-base">
                                                    <div className="flex flex-col">
                                                        <span className="font-display font-medium text-on-surface">Permit Local Bash</span>
                                                        <span className="text-xs text-on-surface-variant mt-0.5">ZAP-Sandbox isolation level</span>
                                                    </div>
                                                    <div className="w-12 h-6 bg-success/20 rounded-full relative cursor-pointer border border-success/30">
                                                        <div className="absolute top-[2px] right-[4px] w-4 h-4 bg-success rounded-full" />
                                                    </div>
                                                </div>
                                                <div className="p-4 border border-outline/10 rounded-[12px] flex justify-between items-center bg-layer-base">
                                                    <div className="flex flex-col">
                                                        <span className="font-display font-medium text-on-surface">Allow BYOK Tokens</span>
                                                        <span className="text-xs text-on-surface-variant mt-0.5">External API bypass</span>
                                                    </div>
                                                    <div className="w-12 h-6 bg-surface-variant rounded-full relative cursor-not-allowed">
                                                        <div className="absolute top-[2px] left-[4px] w-4 h-4 bg-on-surface-variant rounded-full opacity-50" />
                                                    </div>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {activeTab === "mcp" && (
                                    <div className="flex flex-col gap-6">
                                        <Card className="p-8 flex flex-col gap-6 shadow-sm border-outline/10 bg-surface">
                                            <div>
                                                <Heading level={4} className="flex items-center gap-2 text-on-surface mb-2"><Wrench className="text-primary size-5" /> Active Bindings</Heading>
                                                <Text size="body-medium" className="text-on-surface-variant">Manage the generic or task-specific Model Context Protocol servers granted to this agent.</Text>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {[
                                                    { name: 'GitHub Sync', env: 'MCP_SERVER_GITHUB', active: true },
                                                    { name: 'Playwright Browser', env: 'MCP_DEV_BROWSER', active: true },
                                                    { name: 'Stitch Ecosystem', env: 'MCP_STITCH_REGISTRY', active: false },
                                                    { name: 'MongoDB (Olympus)', env: 'MCP_MONGO_URI', active: true }
                                                ].map((tool, idx) => (
                                                    <div key={idx} className="p-4 border border-outline/10 rounded-[12px] flex justify-between items-center bg-layer-base">
                                                        <div className="flex flex-col">
                                                            <span className="font-display font-medium text-on-surface">{tool.name}</span>
                                                            <span className="text-xs font-mono text-on-surface-variant mt-0.5">{tool.env}</span>
                                                        </div>
                                                        <div className={`w-12 h-6 rounded-full relative cursor-pointer border ${tool.active ? 'bg-success/20 border-success/30' : 'bg-surface-variant border-transparent'}`}>
                                                            <div className={`absolute top-[2px] w-4 h-4 rounded-full transition-all ${tool.active ? 'right-[4px] bg-success' : 'left-[4px] bg-on-surface-variant opacity-50'}`} />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {activeTab === "identity" && (
                                    <div className="flex flex-col gap-6">
                                        <Card className="p-8 flex flex-col gap-6 shadow-sm border-outline/10 bg-surface">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Heading level={4} className="flex items-center gap-2 text-on-surface mb-2"><Fingerprint className="text-primary size-5" /> IDENTITY.md Cortex</Heading>
                                                    <Text size="body-medium" className="text-on-surface-variant">The core system prompt instructions dictating tone, formatting, and B.L.A.S.T. compliance boundaries.</Text>
                                                </div>
                                                <GenesisButton visualStyle="outline" className="text-sm" title="Edit agent system prompt" aria-label="Edit Cortex">Edit Cortex</GenesisButton>
                                            </div>
                                            
                                            <div className="mt-2 rounded-[var(--card-radius,12px)] border border-outline/10 bg-inverse-surface overflow-hidden">
                                                <div className="bg-inverse-surface border-b border-outline/10 px-4 py-2 flex items-center gap-2 text-xs font-mono text-inverse-on-surface/50">
                                                    <Code2 className="size-3" /> packages/zap-claw/.agent/{resolvedParams.id.toLowerCase()}/IDENTITY.md
                                                </div>
                                                <div className="p-6 font-mono text-[13px] text-inverse-on-surface whitespace-pre-wrap leading-relaxed">
{`# 👄 The Mouth: Persona & Output Formatting

**Target System:** OLYMPUS
**Role:** ${selectedRole || 'AGENT_DEFAULT'}

## 1. Tone
- **Voice & Style:** Decisive, high-agency, strategic, and direct. As a ZAP Swarm agent, you do not use corporate fluff.

## 2. Communication Standards
- **Reporting Format:** YOU ARE STRICTLY FORBIDDEN from generating structural fluff. Keep responses extremely brief, conversational, and direct.`}
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}
                                {activeTab === "metrics" && (
                                    <div className="flex flex-col gap-6">
                                        <Card className="p-8 flex flex-col gap-6 shadow-sm border-outline/10 bg-surface">
                                            <div>
                                                <Heading level={4} className="flex items-center gap-2 text-on-surface mb-2"><LineChart className="text-primary size-5" /> Token Burn & Operations</Heading>
                                                <Text size="body-medium" className="text-on-surface-variant">Real-time resource burn-rate, error frequency, and execution times.</Text>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                <div className="p-5 border border-outline/10 rounded-[12px] bg-layer-base flex flex-col gap-1">
                                                    <span className="text-sm text-on-surface-variant font-medium">Monthly Token Burn</span>
                                                    <span className="text-3xl font-display font-bold text-on-surface mt-2">{telemetry.tokens} <span className="text-sm text-on-surface-variant font-normal">tokens</span></span>
                                                    <span className="text-xs text-success flex items-center gap-1 mt-1"><Activity className="size-3" /> Operating in normal limits</span>
                                                </div>
                                                <div className="p-5 border border-outline/10 rounded-[12px] bg-layer-base flex flex-col gap-1">
                                                    <span className="text-sm text-on-surface-variant font-medium">Avg T/O Execution (sec)</span>
                                                    <span className="text-3xl font-display font-bold text-on-surface mt-2">{telemetry.latency}</span>
                                                    <span className="text-xs text-success flex items-center gap-1 mt-1"><Activity className="size-3" /> Latency stable</span>
                                                </div>
                                                <div className="p-5 border border-outline/10 rounded-[12px] bg-layer-base flex flex-col gap-1">
                                                    <span className="text-sm text-on-surface-variant font-medium">Error Frequency</span>
                                                    <span className="text-3xl font-display font-bold text-on-surface mt-2">{telemetry.errors}</span>
                                                    <span className="text-xs text-success flex items-center gap-1 mt-1">Zero repeating loops detected</span>
                                                </div>
                                            </div>
                                        </Card>
                                    </div>
                                )}
                                {activeTab === "terminal" && (
                                    <div className="flex flex-col gap-6">
                                        <Card className="p-0 overflow-hidden shadow-sm border-outline/10 bg-inverse-surface border-0 h-[600px] flex flex-col">
                                            <div className="bg-inverse-surface/90 border-b border-white/5 px-4 py-3 flex justify-between items-center shrink-0">
                                                <div className="flex items-center gap-2 text-xs font-mono text-white/50">
                                                    <Terminal className="size-4 text-primary" /> 
                                                    <span>zap-claw-stream @ localhost:3901</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                                                    <span className="text-[10px] text-white/50 uppercase tracking-widest">Socket Connected</span>
                                                </div>
                                            </div>
                                            <div 
                                                ref={terminalRef}
                                                className="flex-1 p-6 font-mono text-[13px] text-success/80 whitespace-pre-wrap leading-loose overflow-y-auto no-scrollbar"
                                                role="log"
                                                aria-label="Agent terminal output"
                                            >
                                                {terminalLogs}
                                            </div>
                                        </Card>
                                    </div>
                                )}

                                {activeTab === "memory" && (
                                    <div className="flex flex-col gap-6">
                                        <Card className="p-8 flex flex-col gap-6 shadow-sm border-outline/10 bg-surface">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <Heading level={4} className="flex items-center gap-2 text-on-surface mb-2"><Database className="text-primary size-5" /> Memory</Heading>
                                                    <Text size="body-medium" className="text-on-surface-variant">Permanent vector long-term storage and artifacts. Facts indexed from past conversations.</Text>
                                                </div>
                                                <GenesisButton 
                                                    visualStyle="outline" 
                                                    className="text-sm border-destructive/50 text-destructive hover:bg-destructive hover:text-white" 
                                                    onClick={async () => {
                                                        const res = await fetch(`/api/swarm/memory?agentId=${resolvedParams.id.toLowerCase()}`, { method: 'DELETE' });
                                                        if (res.ok) fetchMemories();
                                                    }}
                                                    title="Wipe agent memory and reset identity" 
                                                    aria-label="Wipe Identity"
                                                >
                                                    Forget Identity / WIPE RAG
                                                </GenesisButton>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {agentMemories.length > 0 ? (
                                                    agentMemories.map((memory, idx) => (
                                                        <div key={memory._id || idx} className="p-4 border border-outline/10 rounded-[12px] bg-layer-base flex flex-col gap-3 relative group">
                                                            <div className="flex justify-between items-center pr-8">
                                                                <Badge className="bg-surface-variant font-mono text-[10px] uppercase text-on-surface-variant tracking-wider">{memory.type || "global"}</Badge>
                                                                <span className="text-[10px] text-on-surface-variant">
                                                                    {memory.createdAt ? new Date(memory.createdAt).toLocaleDateString() : "Just now"}
                                                                </span>
                                                            </div>
                                                            <p className="text-sm text-on-surface leading-relaxed mt-1">"{memory.content || memory.fact}"</p>
                                                            <button 
                                                                className="absolute top-4 right-4 text-on-surface-variant hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity" 
                                                                title="Forget Memory Block"
                                                                onClick={async () => {
                                                                    const res = await fetch(`/api/swarm/memory?id=${memory._id}`, { method: 'DELETE' });
                                                                    if (res.ok) fetchMemories();
                                                                }}
                                                            >
                                                                <Lock className="size-4" />
                                                            </button>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-sm text-on-surface-variant">No memories indexed yet.</p>
                                                )}
                                            </div>
                                        </Card>
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            {/* BLAST-IRONCLAD: Sync Confirmation Modal */}
            {showSyncConfirm && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowSyncConfirm(false)}>
                    <div className="bg-surface rounded-2xl border border-outline/20 shadow-2xl max-w-md w-full mx-4 p-0 overflow-hidden" onClick={(e) => e.stopPropagation()}>
                        <div className="bg-destructive/10 border-b border-destructive/20 px-6 py-4 flex items-center gap-3">
                            <ShieldAlert className="size-5 text-destructive" />
                            <span className="font-display text-titleMedium text-on-surface">Confirm Agent Reconfiguration</span>
                        </div>
                        <div className="px-6 py-5 flex flex-col gap-4">
                            <p className="font-body text-bodyMedium text-on-surface-variant leading-relaxed">
                                This will overwrite <span className="font-mono text-primary font-semibold">{agentName}</span>'s IDENTITY.md, role bindings, and model configuration.
                            </p>
                            <div className="bg-surface-container-lowest border border-outline/10 rounded-xl p-4 flex flex-col gap-2 font-mono text-xs">
                                <div className="flex justify-between"><span className="text-on-surface-variant">Role:</span><span className="text-on-surface">{selectedRole}</span></div>
                                <div className="flex justify-between"><span className="text-on-surface-variant">Tags:</span><span className="text-on-surface">{customTags || '—'}</span></div>
                            </div>
                            <div className="flex gap-3 justify-end pt-2">
                                <GenesisButton visualStyle="outline" className="border-outline/30 text-on-surface-variant px-5" onClick={() => setShowSyncConfirm(false)} aria-label="Cancel sync">
                                    Cancel
                                </GenesisButton>
                                <GenesisButton visualStyle="solid" className="bg-destructive text-on-primary font-bold px-6 shadow-md" onClick={() => { setShowSyncConfirm(false); handleSync(); }} aria-label="Confirm and sync agent">
                                    Confirm & Sync
                                </GenesisButton>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </AppShell>
    );
}
