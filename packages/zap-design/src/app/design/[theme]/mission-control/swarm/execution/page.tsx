'use client';

import React, { useState, useEffect } from 'react';
import { 
    Activity, 
    RefreshCw, 
    Search,
    Clock,
    CheckCircle2,
    AlertCircle,
    PlayCircle,
    Server,
    Terminal,
    Loader2
} from 'lucide-react';
import { Button } from '@/genesis/atoms/interactive/button';
import { Badge } from '@/genesis/atoms/interactive/badge';
import { Input } from '@/genesis/atoms/interactive/inputs';
import { AppShell } from '@/zap/layout/AppShell';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/genesis/molecules/table';

interface SwarmJobItem {
    _id: string;
    tenantId: string;
    senderIdentifier: string;
    assignedAgentId: string;
    payload: Record<string, any>;
    status: string;
    timestamp: string;
}

export default function ExecutionTrackerDashboard() {
    const [jobs, setJobs] = useState<SwarmJobItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [selectedJob, setSelectedJob] = useState<SwarmJobItem | null>(null);

    const fetchJobs = async () => {
        setLoading(true);
        try {
            // Re-using the zap-swarm endpoint running locally, or mocking if in isolated Zap Design Engine environment
            const res = await fetch('http://localhost:3500/api/swarm/jobs');
            if (!res.ok) throw new Error('Failed to fetch from Swarm API');
            const data = await res.json();
            setJobs(data.tasks || []);
        } catch (err) {
            console.warn('Execution Tracker: Swarm endpoint unavailable, falling back to mock data for layout purposes.', err);
            // Mock data for pure UI rendering within ZAP Design if backend is unreachable
            setJobs([
                {
                    _id: 'job_882a17b5',
                    tenantId: 'ZVN',
                    senderIdentifier: 'zap-swarm-command-center',
                    assignedAgentId: 'agent-spike-3',
                    payload: { task: 'Extract Typography Accordion', priority: 'HIGH' },
                    status: 'PENDING_MCP_DISPATCH',
                    timestamp: new Date(Date.now() - 60000).toISOString()
                },
                {
                    _id: 'job_992b18c6',
                    tenantId: 'ZVN',
                    senderIdentifier: 'zap-swarm-command-center',
                    assignedAgentId: 'agent-jerry-1',
                    payload: { task: 'Verify M3 Tokens', pipeline: 'ZSS' },
                    status: 'COMPLETED',
                    timestamp: new Date(Date.now() - 3600000).toISOString()
                },
                {
                    _id: 'job_443c19d7',
                    tenantId: 'ZVN',
                    senderIdentifier: 'zap-system-cron',
                    assignedAgentId: 'agent-hydra-0',
                    payload: { task: 'Garbage Collect Redis' },
                    status: 'FAILED',
                    timestamp: new Date(Date.now() - 7200000).toISOString()
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs();
    }, []);

    const filteredJobs = jobs.filter(j => {
        const matchesSearch = j.assignedAgentId.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              j._id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'ALL' || j.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        if (status === 'COMPLETED') return 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20';
        if (status === 'FAILED') return 'text-rose-500 bg-rose-500/10 border-rose-500/20';
        if (status === 'PENDING_MCP_DISPATCH') return 'text-amber-500 bg-amber-500/10 border-amber-500/20';
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
    };

    const getStatusIcon = (status: string) => {
        if (status === 'COMPLETED') return <CheckCircle2 className="size-3" />;
        if (status === 'FAILED') return <AlertCircle className="size-3" />;
        if (status === 'PENDING_MCP_DISPATCH') return <Clock className="size-3" />;
        return <PlayCircle className="size-3" />;
    };

    return (
        <AppShell>
            <div className="flex-1 overflow-y-auto p-4 md:p-8 max-w-[1600px] mx-auto w-full min-h-full">
                <div className="flex flex-col gap-8">
                    
                    {/* Header Container */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                        <div className="space-y-1">
                            <div className="flex items-center gap-3">
                                <div className="bg-primary/10 p-2 rounded-lg">
                                    <Activity className="size-6 text-primary" />
                                </div>
                                <h1 className="text-3xl font-extrabold tracking-tight">Execution Tracker</h1>
                            </div>
                            <p className="text-muted-foreground text-sm max-w-2xl">
                                Real-time DLQ monitoring and job ticketing for the Deerflow 2.0 Swarm Fleet.
                            </p>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                onClick={fetchJobs} 
                                disabled={loading}
                                className="h-10 px-4 font-semibold"
                            >
                                {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <RefreshCw className="size-4 mr-2" />}
                                Poll Telemetry
                            </Button>
                        </div>
                    </div>

                    {/* Controls & Metrics */}
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                        
                        {/* Real-time Filter Matrix */}
                        <div className="lg:col-span-3 flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                                <Input 
                                    placeholder="Search Job ID or Agent Node..." 
                                    className="pl-10 h-11 bg-muted/20 border-border/50 transition-all font-dev text-transform-tertiary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-2 bg-muted/50 p-1 rounded-lg border">
                                {['ALL', 'PENDING_MCP_DISPATCH', 'RUNNING', 'COMPLETED', 'FAILED'].map((s) => (
                                    <button
                                        key={s}
                                        onClick={() => setFilterStatus(s)}
                                        className={`px-3 py-1.5 text-[10px] uppercase font-bold rounded-md transition-all ${filterStatus === s ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                    >
                                        {s.replace('_MCP_DISPATCH', '')}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quick Stats */}
                        <div className="bg-muted/30 border rounded-xl p-4 flex gap-4 items-center justify-between">
                            <div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-1">Queue Depth</div>
                                <div className="text-2xl font-black font-dev text-transform-tertiary text-transform-primary tracking-tighter">
                                    {jobs.filter(j => j.status === 'PENDING_MCP_DISPATCH').length} <span className="text-xs text-muted-foreground">/ {jobs.length}</span>
                                </div>
                            </div>
                            <Server className="size-6 text-primary flex-shrink-0 opacity-50" />
                        </div>
                    </div>

                    {/* Desktop Split View: Table (Left) + Payload Inspector (Right) */}
                    <div className="flex flex-col xl:flex-row gap-6 h-[600px] items-stretch">
                        
                        {/* Interactive Queue Table */}
                        <div className="flex-1 rounded-2xl border overflow-hidden shadow-sm flex flex-col bg-card">
                            <div className="overflow-y-auto flex-1 custom-scrollbar">
                                <Table>
                                    <TableHeader className="bg-muted/40 sticky top-0 z-10 backdrop-blur-sm">
                                        <TableRow className="hover:bg-transparent border-b h-8">
                                            <TableHead className="font-bold text-[9px] uppercase tracking-widest pl-4">Job Ticket</TableHead>
                                            <TableHead className="font-bold text-[9px] uppercase tracking-widest">Agent / Node</TableHead>
                                            <TableHead className="font-bold text-[9px] uppercase tracking-widest">Sender</TableHead>
                                            <TableHead className="font-bold text-[9px] uppercase tracking-widest text-right pr-4">Pipeline Status</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {loading ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                                                    <Loader2 className="size-6 animate-spin mx-auto mb-2 text-primary" />
                                                    <span className="text-xs uppercase font-bold tracking-widest">Syncing Mongo Streams...</span>
                                                </TableCell>
                                            </TableRow>
                                        ) : filteredJobs.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={4} className="h-48 text-center text-muted-foreground">
                                                    <Server className="size-6 mx-auto mb-2 opacity-50" />
                                                    <span className="text-xs font-bold uppercase tracking-widest">No matching jobs found in DLQ</span>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            filteredJobs.map((job) => (
                                                <TableRow 
                                                    key={job._id}
                                                    onClick={() => setSelectedJob(job)}
                                                    className={`cursor-pointer transition-colors h-12 ${selectedJob?._id === job._id ? 'bg-primary/5 border-l-2 border-l-primary' : 'hover:bg-muted/20 border-l-2 border-l-transparent'}`}
                                                >
                                                    <TableCell className="pl-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-dev text-transform-tertiary text-xs font-bold">{job._id.slice(-8).toUpperCase()}</span>
                                                            <span className="text-[9px] text-muted-foreground">{new Date(job.timestamp).toLocaleTimeString()}</span>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge variant="outline" className="font-dev text-transform-tertiary text-[9px] h-4 py-0 bg-background">{job.assignedAgentId}</Badge>
                                                    </TableCell>
                                                    <TableCell>
                                                        <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{job.senderIdentifier}</span>
                                                    </TableCell>
                                                    <TableCell className="pr-4 text-right">
                                                        <Badge variant="outline" className={`font-black text-[8px] h-4 py-0 rounded-sm uppercase tracking-tighter inline-flex items-center gap-1 ${getStatusColor(job.status)}`}>
                                                            {getStatusIcon(job.status)}
                                                            {job.status.replace('_MCP_DISPATCH', '')}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </div>
                        </div>

                        {/* Right Panel: Active Payload Inspector */}
                        <div className="w-full xl:w-[400px] border rounded-2xl bg-muted/10 flex flex-col shadow-sm overflow-hidden flex-shrink-0">
                            <div className="h-10 border-b bg-muted/40 flex items-center px-4 justify-between">
                                <div className="flex items-center gap-2 text-primary">
                                    <Terminal className="size-3" />
                                    <span className="text-[9px] font-black uppercase tracking-widest">Telemetry Inspector</span>
                                </div>
                            </div>
                            
                            <div className="p-4 flex-1 overflow-y-auto custom-scrollbar">
                                {selectedJob ? (
                                    <div className="space-y-6">
                                        <div className="space-y-1">
                                            <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest">Target Agent Node</div>
                                            <div className="text-xl font-black font-dev text-transform-tertiary tracking-tight text-foreground">{selectedJob.assignedAgentId}</div>
                                            <div className="flex gap-2 mt-2">
                                                <Badge variant="secondary" className="text-[8px] uppercase tracking-tighter border-none bg-muted/50">{selectedJob.tenantId}</Badge>
                                                <Badge variant="outline" className={`text-[8px] uppercase tracking-tighter border-none ${getStatusColor(selectedJob.status)}`}>{selectedJob.status}</Badge>
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="text-[9px] font-bold uppercase text-muted-foreground tracking-widest flex items-center justify-between">
                                                MCP Dispatch Payload
                                            </div>
                                            <div className="bg-[#050505] rounded-xl p-3 border border-border/10 shadow-inner overflow-x-auto relative group">
                                                <pre className="text-[10px] font-dev text-transform-tertiary text-[#14FF00] leading-relaxed tracking-wide opacity-90">
                                                    {JSON.stringify(selectedJob.payload, null, 2)}
                                                </pre>
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="h-full flex flex-col items-center justify-center text-muted-foreground space-y-3">
                                        <Activity className="size-8 opacity-20" />
                                        <span className="text-[10px] font-bold uppercase tracking-widest opacity-50">Select job stream</span>
                                    </div>
                                )}
                            </div>
                        </div>
                        
                    </div>
                </div>

                <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                        width: 4px;
                        height: 4px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                        background: transparent;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                        background: var(--border);
                        border-radius: 10px;
                    }
              `}</style>
            </div>
        </AppShell>
    );
}
