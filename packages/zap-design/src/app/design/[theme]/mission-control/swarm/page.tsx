'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '@/genesis/atoms/interactive/button';
import { Loader2, RefreshCw, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Layers, Fingerprint, ExternalLink } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/genesis/molecules/table';
import { Badge } from '@/genesis/atoms/interactive/badge';
import { AppShell } from '@/zap/layout/AppShell';

// Derives a human-readable page name from a URL path
// e.g. '/account/billing/history' -> 'Billing History'
// e.g. '/signin' -> 'Sign In'
function getPageName(urlPath: string): string {
    const segment = urlPath.split('/').filter(Boolean).pop() || urlPath;
    return segment
        .replace(/[\-_]/g, ' ')
        .replace(/\[.*?\]/g, 'Detail')
        .replace(/\b\w/g, c => c.toUpperCase());
}

// Core Base demo URL — running locally on 3200
const METRONIC_BASE = process.env.NEXT_PUBLIC_METRONIC_URL || 'http://localhost:3200';

interface Ticket {
    indexId: string;
    urlPath: string;
    group: string;
    assignedWorker: string | null;
    status: string;
    dependencies: string | null;
    auditHash: string | null;
    createdAt: string;
    updatedAt: string;
    zapLevel: string | null;
    l6Layout: string | null;
    l5Organisms: string[];
    l4Molecules: string[];
    l3Atoms: string[];
    l2Primitives: string[];
    l1Tokens: string[];
}

export default function SwarmDashboardTable() {
    const [tickets, setTickets] = useState<Ticket[] | { error: string }>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [expandedPath, setExpandedPath] = useState<string | null>(null);
    const ITEMS_PER_PAGE = 20;

    const fetchTickets = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/swarm');
            const data = await res.json();
            setTickets(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchTickets();
    }, []);

    const totalPages = Array.isArray(tickets) ? Math.ceil(tickets.length / ITEMS_PER_PAGE) : 0;
    const paginatedTickets = Array.isArray(tickets) ? tickets.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE) : [];

    // Compute Priority Extraction metrics
    const topComponents = useMemo(() => {
        const frequency: Record<string, { count: number, level: string }> = {};
        if (Array.isArray(tickets)) {
            tickets.forEach(t => {
                t.l5Organisms?.forEach(c => { frequency[c] = { count: (frequency[c]?.count || 0) + 1, level: 'L5 Organism' } });
                t.l4Molecules?.forEach(c => { frequency[c] = { count: (frequency[c]?.count || 0) + 1, level: 'L4 Molecule' } });
                t.l3Atoms?.forEach(c => { frequency[c] = { count: (frequency[c]?.count || 0) + 1, level: 'L3 Atom' } });
                t.l2Primitives?.forEach(c => { frequency[c] = { count: (frequency[c]?.count || 0) + 1, level: 'L2 Primitive' } });
                t.l1Tokens?.forEach(c => { frequency[c] = { count: (frequency[c]?.count || 0) + 1, level: 'L1 Token' } });
            });
        }
        return Object.entries(frequency)
            .sort((a, b) => b[1].count - a[1].count)
            .slice(0, 5);
    }, [tickets]);

    const toggleRow = (path: string) => {
        setExpandedPath(prev => prev === path ? null : path);
    };

    return (
        <AppShell>
        <div className="flex-1 overflow-y-auto p-6 md:p-10 max-w-7xl mx-auto w-full border border-border rounded-xl shadow-sm">
            <div className="flex flex-col gap-6">

                <div className="flex items-center justify-between pointer-events-auto">
                    <h3 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                        <Layers className="size-5" /> Mission Control: Swarm Extraction
                    </h3>
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground mr-2">{Array.isArray(tickets) ? tickets.length : 0} Target Pages Locked</span>
                        <Button variant="outline" size="sm" onClick={fetchTickets} disabled={loading} className="gap-2">
                            {loading ? <Loader2 className="size-4 animate-spin" /> : <RefreshCw className="size-4" />}
                            Refresh
                        </Button>
                    </div>
                </div>

                {/* Priority Extraction Widget */}
                {Array.isArray(tickets) && tickets.length > 0 && topComponents.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 rounded-lg bg-muted/30 border border-border">
                        <div className="md:col-span-5 mb-1">
                            <h4 className="text-sm font-semibold flex items-center gap-2 text-foreground">
                                <Fingerprint className="size-4 text-primary" /> Extraction Priorities (Component Frequency)
                            </h4>
                            <p className="text-xs text-muted-foreground mt-1">The most frequently used architectural components across the swarm.</p>
                        </div>
                        {topComponents.map(([name, data]) => (
                            <div key={name} className="flex flex-col p-3 rounded-md border shadow-sm">
                                <span className="text-2xl font-bold tracking-tight">{data.count}</span>
                                <span className="text-xs font-semibold truncate mt-1">{name}</span>
                                <span className="text-[10px] text-muted-foreground uppercase">{data.level}</span>
                            </div>
                        ))}
                    </div>
                )}

                <div className="rounded-md border flex-1 overflow-auto h-[60vh]">
                    <Table>
                        <TableHeader className="bg-muted/50 min-w-full sticky top-0 z-10">
                            <TableRow>
                                <TableHead className="w-[40px]"></TableHead>
                                <TableHead className="w-[100px]">ID</TableHead>
                                <TableHead>Page</TableHead>
                                <TableHead>Target Level</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Assigned Worker</TableHead>
                                <TableHead className="text-right">Last Updated</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading && (!Array.isArray(tickets) || tickets.length === 0) ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">Loading swarm targets...</TableCell>
                                </TableRow>
                            // eslint-disable-next-line @typescript-eslint/no-explicit-any
                            ) : (tickets as any).error ? (
                                <TableRow>
                                    <TableCell colSpan={7} className="h-48 text-center text-error font-mono text-transform-tertiary text-xs bg-error/5 p-10 leading-relaxed">
                                        <div className="flex flex-col items-center gap-4">
                                            <div className="p-3 bg-error/10 rounded-full">
                                                <Layers className="size-8 opacity-50" />
                                            </div>
                                            <div className="max-w-xl">
                                                <div className="font-bold text-sm mb-1">DATA PIPELINE SEVERED</div>
                                                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                                {(tickets as any).error}
                                            </div>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (!Array.isArray(tickets) || tickets.length === 0) ? (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-24 text-center">No targets found in database.</TableCell>
                                </TableRow>
                            ) : (
                                paginatedTickets.map((t) => (
                                    <React.Fragment key={t.urlPath}>
                                        <TableRow className="cursor-pointer hover:bg-muted/30 transition-colors" onClick={() => toggleRow(t.urlPath)}>
                                            <TableCell>
                                                {expandedPath === t.urlPath ? <ChevronUp className="size-4 text-muted-foreground" /> : <ChevronDown className="size-4 text-muted-foreground" />}
                                            </TableCell>
                                            <TableCell className="font-dev text-transform-tertiary text-xs font-bold text-primary">{t.indexId}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-col gap-0.5">
                                                    <div className="flex items-center gap-1.5">
                                                        <span className="text-sm font-semibold text-foreground">{getPageName(t.urlPath)}</span>
                                                        <a
                                                            href={`${METRONIC_BASE}${t.urlPath}`}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            onClick={e => e.stopPropagation()}
                                                            className="text-muted-foreground hover:text-primary transition-colors"
                                                            title={`Open ${t.urlPath} on Core demo`}
                                                        >
                                                            <ExternalLink className="size-3" />
                                                        </a>
                                                    </div>
                                                    <span className="font-dev text-transform-tertiary text-[10px] text-muted-foreground/60">{t.urlPath}</span>
                                                    {t.group && (
                                                        <span className="text-[10px] text-muted-foreground/40 uppercase tracking-wide">{t.group}</span>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs font-semibold text-muted-foreground">
                                                {t.zapLevel ? (
 <Badge variant="outline" className="font-dev text-transform-tertiary text-[10px] ">{t.zapLevel}</Badge>
                                                ) : 'PENDING'}
                                            </TableCell>
                                            <TableCell>
                                                <div className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[10px] uppercase tracking-wider font-bold transition-colors ${t.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400' : 'bg-primary/10 text-primary border border-primary/20'}`}>
                                                    {t.status}
                                                </div>
                                            </TableCell>
                                            <TableCell className="text-xs">{t.assignedWorker || 'Unassigned'}</TableCell>
                                            <TableCell className="text-right text-xs text-muted-foreground">
                                                {new Date(t.updatedAt).toLocaleTimeString()}
                                            </TableCell>
                                        </TableRow>

                                        {/* EXPANDED ROW for Architectural Breakdown */}
                                        {expandedPath === t.urlPath && (
                                            <TableRow className="bg-muted/10 hover:bg-muted/10">
                                                <TableCell colSpan={6} className="p-0 border-b">
                                                    <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 bg-gradient-to-br from-background to-muted/20 shadow-inner">

                                                        {t.l6Layout && (
                                                            <div className="col-span-full">
                                                                <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">L6 Layout / Template</h4>
                                                                <div className="text-sm font-dev text-transform-tertiary border px-3 py-2 rounded-md inline-block shadow-sm">{t.l6Layout}</div>
                                                            </div>
                                                        )}

                                                        <div>
                                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2 mb-3">L5 Organisms ({t.l5Organisms?.length || 0})</h4>
                                                            <ul className="text-xs space-y-1">
                                                                {t.l5Organisms?.length ? t.l5Organisms.map(comp => <li key={comp} className="truncate">▪ {comp}</li>) : <li className="text-muted-foreground/50 italic">None detected</li>}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2 mb-3">L4 Molecules ({t.l4Molecules?.length || 0})</h4>
                                                            <ul className="text-xs space-y-1">
                                                                {t.l4Molecules?.length ? t.l4Molecules.map(comp => <li key={comp} className="truncate">▪ {comp}</li>) : <li className="text-muted-foreground/50 italic">None detected</li>}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2 mb-3">L3 Atoms ({t.l3Atoms?.length || 0})</h4>
                                                            <ul className="text-xs space-y-1">
                                                                {t.l3Atoms?.length ? t.l3Atoms.map(comp => <li key={comp} className="truncate">▪ {comp}</li>) : <li className="text-muted-foreground/50 italic">None detected</li>}
                                                            </ul>
                                                        </div>

                                                        <div>
                                                            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground border-b pb-2 mb-3">L2 Primitives & L1 Tokens</h4>
                                                            <div className="space-y-4">
                                                                <div>
                                                                    <span className="text-xs font-semibold mb-1 block">Primitives ({t.l2Primitives?.length || 0})</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {t.l2Primitives?.length ? t.l2Primitives.map(comp => <Badge key={comp} variant="secondary" className="text-[9px] font-normal">{comp}</Badge>) : <span className="text-xs text-muted-foreground/50 italic">None</span>}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <span className="text-xs font-semibold mb-1 block">Tokens ({t.l1Tokens?.length || 0})</span>
                                                                    <div className="flex flex-wrap gap-1">
                                                                        {t.l1Tokens?.length ? t.l1Tokens.map(comp => <Badge key={comp} variant="outline" className="text-[9px] font-normal">{comp}</Badge>) : <span className="text-xs text-muted-foreground/50 italic">None</span>}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        )}
                                    </React.Fragment>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground pt-1">
                    <div>
                        Showing {Array.isArray(tickets) && tickets.length > 0 ? Math.min((page - 1) * ITEMS_PER_PAGE + 1, tickets.length) : 0} to {Math.min(page * ITEMS_PER_PAGE, Array.isArray(tickets) ? tickets.length : 0)} of {Array.isArray(tickets) ? tickets.length : 0} entries
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.max(1, p - 1))}
                            disabled={page === 1 || !Array.isArray(tickets) || tickets.length === 0}
                        >
                            <ChevronLeft className="size-4 mr-1" />
                            Prev
                        </Button>
                        <div className="font-medium text-foreground px-2">
                            Page {page} of {Math.max(1, totalPages)}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                            disabled={page >= totalPages || !Array.isArray(tickets) || tickets.length === 0}
                        >
                            Next
                            <ChevronRight className="size-4 ml-1" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
        </AppShell>
    );
}
