'use client';

import React, { useState, useMemo } from 'react';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { 
    Loader2,
    RefreshCw, 
    ChevronLeft, 
    ChevronRight, 
    ChevronDown, 
    ChevronUp, 
    Search,
    CheckCircle2,
    AlertCircle,
    Tag,
    ExternalLink,
    Code,
    Layers,
    Fingerprint
} from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '../../../../genesis/molecules/table';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { Input } from '../../../../genesis/atoms/interactive/inputs';
import { AppShell } from '../../../../zap/layout/AppShell';

interface ComponentRegistryItem {
    id: string;
    name: string;
    displayName: string;
    tier: string;
    category: string;
    tags: string[];
    usageCount: number;
    pages: string[];
    sourcePath: string;
    sourceImport: string;
    genesisStatus: string;
    genesisPath: string | null;
    genesisNotes: string | null;
    genesisOrigin: string;
    auditFlag: string;
    auditNotes: string | null;
    updatedAt: string;
}

export default function ComponentRegistryDashboard() {
    const [components, setComponents] = useState<ComponentRegistryItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('ALL');
    const [filterOrigin, setFilterOrigin] = useState<string>('ALL');
    const [expandedId, setExpandedId] = useState<string | null>(null);
    const ITEMS_PER_PAGE = 25;

    const fetchRegistry = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/swarm/registry');
            const data = await res.json();
            setComponents(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    React.useEffect(() => {
        fetchRegistry();
    }, []);

    const filteredComponents = useMemo(() => {
        return components.filter(c => {
            const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                                 c.category.toLowerCase().includes(searchTerm.toLowerCase());
            const matchesStatus = filterStatus === 'ALL' || c.genesisStatus === filterStatus;
            const matchesOrigin = filterOrigin === 'ALL' || c.genesisOrigin === filterOrigin;
            return matchesSearch && matchesStatus && matchesOrigin;
        });
    }, [components, searchTerm, filterStatus, filterOrigin]);

    const totalPages = Math.ceil(filteredComponents.length / ITEMS_PER_PAGE);
    const paginatedComponents = filteredComponents.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

    const stats = useMemo(() => {
        return {
            total: components.length,
            core: components.filter(c => c.genesisOrigin === 'CORE').length,
            metro: components.filter(c => c.genesisOrigin === 'METRO').length,
            shared: components.filter(c => c.genesisOrigin === 'SHARED').length,
            exists: components.filter(c => c.genesisStatus === 'EXISTS').length,
            needsBuild: components.filter(c => c.genesisStatus === 'NEEDS_BUILD').length,
        };
    }, [components]);

    const getAuditColor = (flag: string) => {
        if (flag === 'CLEAN') return 'text-emerald-500';
        if (flag === 'PHANTOM' || flag === 'MALFORMED') return 'text-rose-500';
        return 'text-amber-500';
    };

    const getOriginColor = (origin: string) => {
        if (origin === 'CORE') return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        if (origin === 'METRO') return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        if (origin === 'SHARED') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
        return 'bg-muted text-muted-foreground';
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
                                <Fingerprint className="size-6 text-primary" />
                            </div>
                            <h1 className="text-3xl font-extrabold tracking-tight">Genesis Registry</h1>
                        </div>
                        <p className="text-muted-foreground text-sm max-w-2xl">
                            The unified single source of truth for all ZAP components. 
                            Consolidating Core and Metro (M3) into a single architectural contract.
                        </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                        <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={fetchRegistry} 
                            disabled={loading}
                            className="h-10 px-4 font-semibold"
                        >
                            {loading ? <Loader2 className="size-4 animate-spin mr-2" /> : <RefreshCw className="size-4 mr-2" />}
                            Sync Genesis
                        </Button>
                        <Button className="h-8 px-3 text-xs font-bold shadow-sm shadow-primary/20">
                            Genesis Audit
                        </Button>
                    </div>
                </div>

                {/* Genesis Summary Table */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-muted/30 border rounded-xl p-4 flex flex-col gap-1 col-span-1 md:col-span-1">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Genesis Total</span>
                            <Layers className="size-4 text-primary" />
                        </div>
                        <span className="text-3xl font-black">{stats.total}</span>
                        <div className="mt-2 text-[10px] font-medium text-muted-foreground">Components Registered</div>
                    </div>
                    
                    <div className="bg-muted/30 border rounded-xl p-4 flex flex-col gap-1 md:col-span-3 overflow-hidden">
                         <div className="flex items-center justify-between mb-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Origin Breakdown</span>
                            <div className="flex gap-2">
                                <Badge variant="outline" className="text-[9px] font-bold">CORE: {stats.core}</Badge>
                                <Badge variant="outline" className="text-[9px] font-bold border-purple-500/30 text-purple-500">METRO: {stats.metro}</Badge>
                                <Badge variant="outline" className="text-[9px] font-bold border-amber-500/30 text-amber-500">SHARED: {stats.shared}</Badge>
                            </div>
                        </div>
                        <div className="flex h-2 w-full rounded-full overflow-hidden bg-muted">
                            <div className="bg-blue-500 h-full" style={{ width: `${(stats.core / stats.total) * 100}%` }}></div>
                            <div className="bg-purple-500 h-full" style={{ width: `${(stats.metro / stats.total) * 100}%` }}></div>
                            <div className="bg-amber-500 h-full" style={{ width: `${(stats.shared / stats.total) * 100}%` }}></div>
                        </div>
                        <div className="mt-2 flex justify-between text-[9px] font-black uppercase tracking-tighter">
                            <div className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-blue-500"></div> Core Legacy</div>
                            <div className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-purple-500"></div> Metro M3</div>
                            <div className="flex items-center gap-1"><div className="size-1.5 rounded-full bg-amber-500"></div> Shared Infra</div>
                        </div>
                    </div>
                </div>

                {/* Filters & Actions */}
                <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="relative flex-1 w-full">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                            placeholder="Search naming conventions..." 
                            className="pl-10 h-11 bg-muted/20 border-border/50 focus: transition-all"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
                        <div className="flex bg-muted/50 p-1 rounded-lg border">
                            {['ALL', 'CORE', 'METRO', 'SHARED'].map((o) => (
                                <button
                                    key={o}
                                    onClick={() => setFilterOrigin(o)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${filterOrigin === o ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {o}
                                </button>
                            ))}
                        </div>
                        <div className="flex bg-muted/50 p-1 rounded-lg border">
                            {['ALL', 'EXISTS', 'NEEDS_BUILD'].map((s) => (
                                <button
                                    key={s}
                                    onClick={() => setFilterStatus(s)}
                                    className={`px-3 py-1.5 text-[10px] font-bold rounded-md transition-all ${filterStatus === s ? 'bg-background shadow-sm text-primary' : 'text-muted-foreground hover:text-foreground'}`}
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Table */}
                <div className="rounded-2xl border overflow-hidden shadow-sm">
                    <Table>
                        <TableHeader className="bg-muted/40">
                            <TableRow className="hover:bg-transparent border-b h-6">
                                <TableHead className="w-6 px-1"></TableHead>
                                <TableHead className="font-bold text-[9px] uppercase tracking-widest py-1 px-1 h-6">Component</TableHead>
                                <TableHead className="font-bold text-[9px] uppercase tracking-widest hidden md:table-cell py-1 px-1 h-6">Origin</TableHead>
                                <TableHead className="font-bold text-[9px] uppercase tracking-widest hidden md:table-cell py-1 px-1 h-6">Tier</TableHead>
                                <TableHead className="font-bold text-[9px] uppercase tracking-widest hidden lg:table-cell py-1 px-1 h-6">Category</TableHead>
                                <TableHead className="font-bold text-[9px] uppercase tracking-widest text-center py-1 px-1 h-6">Usage</TableHead>
                                <TableHead className="font-bold text-[9px] uppercase tracking-widest py-1 px-1 h-6">Status</TableHead>
                                <TableHead className="font-bold text-[9px] uppercase tracking-widest text-right pr-4 py-1 h-6">Health</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground">
                                            <Loader2 className="size-8 animate-spin text-primary" />
                                            <span className="font-medium">Streaming components from registry...</span>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : filteredComponents.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="h-64 text-center">
                                        <div className="flex flex-col items-center justify-center gap-4 py-12">
                                            <div className="w-16 h-16 rounded-2xl bg-muted flex items-center justify-center text-muted-foreground mx-auto mb-4">
                                                <Search size={32} />
                                            </div>
                                            <h3 className="text-foreground font-bold text-lg">No components found</h3>
                                            <p className="text-sm text-muted-foreground mt-1 text-center max-w-xs mx-auto">Try adjusting your filters or search query to find identifying components.</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                filteredComponents.map((component) => (
                                    <React.Fragment key={component.id}>
                                        <TableRow 
                                            className={`group cursor-pointer transition-colors h-10 ${expandedId === component.id ? 'bg-muted/30' : 'hover:bg-muted/10'}`}
                                            onClick={() => setExpandedId(expandedId === component.id ? null : component.id)}
                                        >
                                            <TableCell className="px-1 py-0.5 w-6 text-center">
                                                {expandedId === component.id ? <ChevronUp className="size-3 text-primary mx-auto" /> : <ChevronDown className="size-3 text-muted-foreground group-hover:text-foreground mx-auto" />}
                                            </TableCell>
                                            <TableCell className="px-2 py-0.5 min-w-[140px]">
                                                <div className="flex flex-col py-0">
                                                    <span className="font-bold text-xs text-foreground leading-tight tracking-tight">{component.name}</span>
 <span className="text-[9px] text-muted-foreground/60 font-dev text-transform-tertiary tracking-tighter leading-none truncate max-w-[120px]">{component.displayName}</span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell px-2 py-0.5">
                                                <Badge variant="outline" className={`font-black text-[8px] px-1 h-3 rounded-sm uppercase tracking-tighter ${getOriginColor(component.genesisOrigin)}`}>
                                                    {component.genesisOrigin}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="hidden md:table-cell px-2 py-0.5">
                                                <Badge variant="outline" className="font-dev text-transform-tertiary text-[9px] px-1 h-3 border-muted-foreground/20 text-muted-foreground">{component.tier}</Badge>
                                            </TableCell>
                                            <TableCell className="hidden lg:table-cell px-2 py-0.5">
                                                <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tight">{component.category}</span>
                                            </TableCell>
                                            <TableCell className="px-2 py-0.5 text-center">
                                                <span className="text-[10px] font-dev text-transform-tertiary font-bold text-muted-foreground">{component.usageCount}</span>
                                            </TableCell>
                                            <TableCell className="px-2 py-0.5">
                                                <Badge variant="secondary" className="font-black text-[8px] px-1 h-3 rounded-sm uppercase tracking-tighter">
                                                    {component.genesisStatus === 'EXISTS' ? 'Live' : 'WIP'}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="pr-4 py-0.5 text-right">
                                                <div className="flex items-center justify-end gap-1.5">
                                                    <span className={`text-[10px] font-black uppercase tracking-widest ${getAuditColor(component.auditFlag)}`}>
                                                        {component.auditFlag}
                                                    </span>
                                                    {component.auditFlag !== 'CLEAN' && <AlertCircle className={`size-3 ${getAuditColor(component.auditFlag)}`} />}
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                        {expandedId === component.id && (
                                            <TableRow className="hover:bg-transparent border-b-2 bg-muted/5">
                                                <TableCell colSpan={8} className="p-0">
                                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                                        
                                                        {/* Source context component */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2 text-primary">
                                                                <Code className="size-4" />
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest">Source Context</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <label className="text-[9px] text-muted-foreground uppercase font-bold block mb-1">Source Path</label>
                                                                    <div className="border p-2 rounded-lg text-[10px] font-dev text-transform-tertiary break-all leading-relaxed shadow-sm text-muted-foreground/80">
                                                                        {component.sourcePath}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[9px] text-muted-foreground uppercase font-bold block mb-1">Import Statement</label>
                                                                    <div className="border p-2 rounded-lg text-[10px] font-dev text-transform-tertiary shadow-sm group relative">
                                                                        {component.sourceImport}
                                                                        <Button variant="ghost" size="icon" className="size-5 absolute right-1.5 top-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                                            <Fingerprint className="size-3" />
                                                                        </Button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Genesis Context component */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2 text-emerald-500">
                                                                <CheckCircle2 className="size-4" />
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest">Genesis Mapping</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <label className="text-[9px] text-muted-foreground uppercase font-bold block mb-1">Target Path</label>
                                                                    <div className="border p-2 rounded-lg text-[10px] font-dev text-transform-tertiary shadow-sm italic text-muted-foreground/60">
                                                                        {component.genesisPath || 'Pending definition in Genesis protocol...'}
                                                                    </div>
                                                                </div>
                                                                <div className="p-3 rounded-lg border border-border/50 shadow-sm">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <span className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">Audit Status</span>
                                                                        <Badge variant="outline" className={`text-[8px] font-black uppercase px-1.5 h-4 border-none ${getAuditColor(component.auditFlag)} bg-muted/50`}>
                                                                            {component.auditFlag}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-[10px] text-muted-foreground leading-tight">
                                                                        {component.auditNotes || 'No specific technical constraints noted for this component audit cycle.'}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>

                                                        {/* Metadata & Pages component */}
                                                        <div className="space-y-4">
                                                            <div className="flex items-center gap-2 text-amber-500">
                                                                <Tag className="size-4" />
                                                                <h4 className="text-[10px] font-black uppercase tracking-widest">Metadata & Usage</h4>
                                                            </div>
                                                            <div className="space-y-3">
                                                                <div>
                                                                    <label className="text-[9px] text-muted-foreground uppercase font-bold block mb-1.5">Tags</label>
                                                                    <div className="flex flex-wrap gap-1.5">
                                                                        {component.tags.length > 0 ? component.tags.map(tag => (
                                                                            <Badge key={tag} variant="secondary" className="text-[8px] font-bold uppercase tracking-tighter px-1.5 rounded-sm">
                                                                                {tag}
                                                                            </Badge>
                                                                        )) : (
                                                                            <span className="text-[9px] italic text-muted-foreground/40">No tags assigned</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div>
                                                                    <label className="text-[9px] text-muted-foreground uppercase font-bold block mb-2">Used In ({component.pages.length} Pages)</label>
                                                                    <div className="grid grid-cols-1 gap-1 max-h-32 overflow-y-auto pr-2 custom-scrollbar">
                                                                        {component.pages.length > 0 ? component.pages.map(pagePath => (
                                                                            <a 
                                                                                key={pagePath} 
                                                                                href={`http://localhost:3002${pagePath}`}
                                                                                target="_blank"
                                                                                className="text-[10px] font-dev text-transform-tertiary text-muted-foreground hover:text-primary hover:bg-muted/50 px-1.5 py-0.5 rounded transition-colors flex items-center justify-between group/page"
                                                                            >
                                                                                {pagePath}
                                                                                <ExternalLink className="size-2 opacity-0 group-hover/page:opacity-100" />
                                                                            </a>
                                                                        )) : (
                                                                            <span className="text-[9px] italic text-muted-foreground/40">No page references detected</span>
                                                                        )}
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



                {/* Pagination */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4 py-4">
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                        Showing <span className="text-foreground">{paginatedComponents.length}</span> of <span className="text-foreground">{filteredComponents.length}</span> Results
                    </p>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === 1}
                            onClick={() => setPage(page - 1)}
                            className="h-9 px-4 font-bold uppercase text-[10px] tracking-widest"
                        >
                            <ChevronLeft className="size-4 mr-2" />
                            Previous
                        </Button>
                        <div className="flex items-center gap-1">
                            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                                let pageNum = page;
                                if (page <= 3) pageNum = i + 1;
                                else if (page >= totalPages - 2) pageNum = totalPages - 4 + i;
                                else pageNum = page - 2 + i;
                                
                                if (pageNum > totalPages || pageNum < 1) return null;

                                return (
                                    <Button
                                        key={pageNum}
                                        variant={page === pageNum ? 'primary' : 'ghost'}
                                        size="sm"
                                        className="size-9 font-bold text-xs"
                                        onClick={() => setPage(pageNum)}
                                    >
                                        {pageNum}
                                    </Button>
                                );
                            })}
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            disabled={page === totalPages}
                            onClick={() => setPage(page + 1)}
                            className="h-9 px-4 font-bold uppercase text-[10px] tracking-widest"
                        >
                            Next
                            <ChevronRight className="size-4 ml-2" />
                        </Button>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
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
