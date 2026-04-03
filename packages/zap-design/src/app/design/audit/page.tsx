'use client';

import React, { useState, useCallback, useEffect } from 'react';
import Link from 'next/link';
import { DebugAuditor } from '../../../components/debug/auditor';
import { Inspector } from '../../../zap/layout/Inspector';
import { Check, AlertCircle, Database, ShieldCheck, Clock } from 'lucide-react';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';
import { Canvas } from '../../../genesis/atoms/surfaces/canvas';
import { type TabItem } from '../../../genesis/atoms/interactive/Tabs';
import { motion, AnimatePresence } from 'framer-motion';

const HEADER_TABS: TabItem[] = [
    { id: 'overview', label: 'Overview' },
    { id: 'registry', label: 'Component Registry' },
    { id: 'needs_action', label: 'Needs Action' },
];

interface AuditPage {
    universalId: string;
    path: string;
    category: string;
    theme: string;
    fonts: boolean;
    colors: boolean;
    spacing: boolean;
    layers: boolean;
    icons: boolean;
    props: boolean;
    m3Mobile: boolean;
    m3Desktop: boolean;
    proofUrl: string | null;
    lastSync: string | null;
    createdAt: string | null;
}

interface ComponentRegistryItem {
    id: string;
    name: string;
    description: string | null;
    level: string;
    category: string;
    status: string;
    usageCount: number;
    extractionId: string | null;
    tags: string[];
    pages: string[];
}

export default function DesignAuditPage() {
    const customInspector = (
        <Inspector title="Audit Metrics" width={340}>
            <div className="p-4 space-y-6 min-h-full font-sans text-[var(--md-sys-color-on-surface)]">
                <div className="space-y-2 p-4 rounded-xl border flex flex-col bg-[var(--md-sys-color-surface-container-high)] border-[var(--md-sys-color-outline-variant)]">
                    <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface-variant)]">Status</p>
                        <div className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-widest bg-[var(--md-sys-color-primary-container)] text-[var(--md-sys-color-on-primary-container)]">
                            Verified
                        </div>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface-variant)]">Tier</p>
                        <p className="text-xs font-dev text-transform-tertiary font-medium text-[var(--md-sys-color-on-surface)]">L7</p>
                    </div>
                </div>

                <div className="space-y-2 p-4 rounded-xl bg-[var(--md-sys-color-secondary-container)] text-[var(--md-sys-color-on-secondary-container)]">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-70">Architecture Rule</p>
                    <p className="text-[12px] leading-relaxed">
                        This Inspector actively monitors the Genesis 29 Core Pages for M3 Layer compliance. Clean shells automatically defer to Layer 1.
                    </p>
                </div>

                <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-[var(--md-sys-color-on-surface-variant)]">Import Path</p>
                    <code className="text-[10px] block p-3 rounded-lg border font-dev text-transform-tertiary break-all bg-[var(--md-sys-color-surface-container-highest)] border-[var(--md-sys-color-outline-variant)] text-[var(--md-sys-color-on-surface)]">
                        import &#123; DesignAuditPage &#125; from &apos;@/app/design/audit/page.tsx&apos;;
                    </code>
                </div>
            </div>
        </Inspector>
    );

    const [data, setData] = useState<AuditPage[]>([]);
    const [components, setComponents] = useState<ComponentRegistryItem[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchAudit = useCallback(async () => {
        try {
            const res = await fetch('/api/audit');
            const result = await res.json();

            if (result.pages && Array.isArray(result.pages)) {
                setData(result.pages);
            }
            if (result.components && Array.isArray(result.components)) {
                setComponents(result.components);
            }
        } catch (err) {
            console.error("Fetch error:", err);
            setData([]);
            setComponents([]);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { fetchAudit(); }, [fetchAudit]);

    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('All');
    const [themeFilter, setThemeFilter] = useState('All');
    const [activeTab, setActiveTab] = useState('overview');

    const categories = ['All', ...Array.from(new Set(
        activeTab === 'registry' 
            ? components.map(c => c.category) 
            : data.map(p => p.category)
    ))].sort();

    const getStatusInfo = (page: AuditPage) => {
        const checks = [page.fonts, page.colors, page.spacing, page.layers, page.icons, page.props, page.m3Mobile, page.m3Desktop];
        const trueCount = checks.filter(Boolean).length;
        if (trueCount === 8) return { label: 'ZEUS', color: 'bg-green-500/10 text-green-500 border-green-500/20' };
        if (trueCount >= 5) return { label: 'ZAP', color: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' };
        if (trueCount >= 1) return { label: 'SPIKE', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' };
        return { label: 'PENDING', color: 'bg-surface-container-highest text-on-surface-variant border-outline-variant/50' };
    };

    const getComponentStatusColor = (status: string) => {
        switch (status) {
            case 'EXISTS': return 'bg-green-500/10 text-green-500 border-green-500/20';
            case 'NEEDS_BUILD': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
            case 'NEEDS_IMPROVEMENT': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
            case 'NOT_NEEDED': return 'bg-surface-container-highest text-on-surface-variant border-outline-variant/50';
            default: return 'bg-surface-container-highest text-on-surface-variant border-outline-variant/50';
        }
    };

    const filteredData = data.filter(page => {
        const matchesSearch = 
            page.path.toLowerCase().includes(searchTerm.toLowerCase()) || 
            page.universalId.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || page.category === categoryFilter;
        const matchesTheme = themeFilter === 'All' || page.theme === themeFilter;
        return matchesSearch && matchesCategory && matchesTheme;
    }).filter(page => activeTab !== 'needs_action' || getStatusInfo(page).label !== 'ZEUS');

    const filteredComponents = components.filter(comp => {
        const matchesSearch = 
            comp.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            comp.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = categoryFilter === 'All' || comp.category === categoryFilter;
        return matchesSearch && matchesCategory;
    });

    const complianceRate = data.length ? Math.round((data.filter(p => p.fonts && p.colors && p.spacing && p.layers && p.icons && p.props && p.m3Mobile && p.m3Desktop).length / data.length) * 100) : 0;

    return (
        <DebugAuditor
            componentName="Design Audit Dashboard"
            tier="L7"
            status="Verified"
            filePath="design/audit/page.tsx"
            importPath="/design/audit"
            inspector={customInspector}
        >
            <Canvas 
                className="transition-all duration-300 origin-center flex flex-col pt-0 min-h-full"
            >
                {/* Header Level - Stretches 100% */}
                <div className="z-10 relative">
                    <ThemeHeader
                        title="ZAP Audit Logs"
                        breadcrumb="ZAP DESIGN ENGINE / ISO REGISTRY"
                        tabs={HEADER_TABS}
                        activeTab={activeTab}
                        onTabChange={(tab) => {
                            setActiveTab(tab);
                            setCategoryFilter('All');
                            setThemeFilter('All');
                            setSearchTerm('');
                        }}
                        showBackground={true}
                    />
                </div>

                {/* Canvas Main Content mapped to L4 Highest */}
                <div className="flex-1 w-full p-6 md:p-12 flex flex-col items-center">
                    
                    {/* Creative Molecule Dashboards - L1 Base aligned */}
                    <div className="w-full max-w-[1080px] grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        {/* Card 1: Inventory */}
                        <motion.div 
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            className="bg-surface-container rounded-3xl border border-outline-variant p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group hover:border-primary/50"
                        >
                            <div className="absolute -right-6 -top-6 text-primary/5 group-hover:text-primary/10 transition-colors rotate-12">
                                <Database size={100} strokeWidth={1} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                                <Database size={20} />
                            </div>
                            <div className="space-y-1 z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-primary">Inventory</p>
                                <p className="text-4xl font-black tracking-tighter text-on-surface">{data.length} <span className="text-xl text-on-surface-variant font-medium tracking-normal">Pages</span></p>
                            </div>
                        </motion.div>

                        {/* Card 2: Component Registry */}
                        <motion.div 
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.05 }}
                            className="bg-surface-container rounded-3xl border border-outline-variant p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group hover:border-[#5A6B29]/50"
                        >
                            <div className="absolute -right-6 -top-6 text-[#5A6B29]/5 group-hover:text-[#5A6B29]/10 transition-colors rotate-12">
                                <ShieldCheck size={100} strokeWidth={1} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-[#5A6B29]/10 text-[#5A6B29] flex items-center justify-center">
                                <ShieldCheck size={20} />
                            </div>
                            <div className="space-y-1 z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#5A6B29]">Registry</p>
                                <p className="text-4xl font-black tracking-tighter text-on-surface">
                                    {components.length} <span className="text-xl text-on-surface-variant font-medium tracking-normal">Atoms</span>
                                </p>
                            </div>
                        </motion.div>

                        {/* Card 3: Compliance */}
                        <motion.div 
                            whileHover={{ y: -4, scale: 1.02 }}
                            transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
                            className="bg-surface-container rounded-3xl border border-outline-variant p-6 flex flex-col gap-4 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group hover:border-on-surface-variant/50"
                        >
                            <div className="absolute -right-6 -top-6 text-on-surface-variant/5 group-hover:text-on-surface-variant/10 transition-colors rotate-12">
                                <Clock size={100} strokeWidth={1} />
                            </div>
                            <div className="w-10 h-10 rounded-full bg-surface-container-highest text-on-surface-variant flex items-center justify-center">
                                <Clock size={20} />
                            </div>
                            <div className="space-y-1 z-10">
                                <p className="text-[10px] font-black uppercase tracking-widest text-[#5A6B29]">Compliance</p>
                                <p className="text-4xl font-black tracking-tighter text-on-surface">{complianceRate}%</p>
                            </div>
                        </motion.div>
                    </div>

                    <div className="w-full max-w-[1080px] flex-1 rounded-[32px] border bg-surface-container border-outline-variant overflow-hidden flex flex-col shadow-sm">
                        <div className="flex-1 p-8 md:p-12 flex flex-col">
                            {/* Page Level Title */}
                            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-8 border-b border-outline-variant">
                                <div>
                                    <h2 className="text-2xl font-bold text-on-surface tracking-tight">Dashboard</h2>
                                    <p className="text-sm text-on-surface-variant mt-1">Detailed breakdown of component status</p>
                                </div>
 <div className="text-[10px] bg-background border border-outline-variant text-on-surface px-3 py-1 rounded-full font-dev text-transform-tertiary opacity-80 tracking-widest self-start md:self-auto">
                                    [ L2 Cover // Main Content Canvas ]
                                </div>
                            </div>
                            
                            <div className="flex flex-col md:flex-row gap-4 items-center mb-6 w-full">
                                <input 
                                    type="text" 
                                    placeholder="Search by Path or ID..."
                                    className="flex-1 bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface focus:outline-none focus:border-primary transition-colors min-w-0"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <div className="flex gap-4 w-full md:w-auto">
                                    <select
                                        aria-label="Filter by theme"
                                        title="Filter by theme"
                                        className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface font-medium focus:outline-none focus:border-primary transition-colors flex-1 md:flex-none"
                                        value={themeFilter}
                                        onChange={(e) => setThemeFilter(e.target.value)}
                                    >
                                        <option value="All">All Themes</option>
                                        <option value="Metro">Metro Theme</option>
                                        <option value="Core">Core Theme</option>
                                    </select>
                                    <select
                                        aria-label="Filter by category"
                                        title="Filter by category"
                                        className="bg-surface-container-low border border-outline-variant rounded-lg px-4 py-3 text-sm text-on-surface font-medium focus:outline-none focus:border-primary transition-colors flex-1 md:flex-none"
                                        value={categoryFilter}
                                        onChange={(e) => setCategoryFilter(e.target.value)}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat} value={cat}>{cat}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-hidden rounded-2xl border border-outline-variant bg-surface overflow-x-auto flex-1 h-[600px]">
                                {activeTab === 'registry' ? (
                                    <table className="w-full text-sm text-left relative min-w-[800px]">
                                        <thead className="bg-surface-container-highest text-on-surface-variant font-black uppercase text-[10px] tracking-widest border-b border-outline-variant whitespace-nowrap sticky top-0 z-20">
                                            <tr>
                                                <th className="px-6 py-4">Component</th>
                                                <th className="px-6 py-4">Level</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-center">Usage</th>
                                                <th className="px-6 py-4">Tags</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant bg-surface-container-lowest font-medium">
                                            {loading ? (
                                                <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant animate-pulse font-black uppercase tracking-widest">Scanning Registry...</td></tr>
                                            ) : filteredComponents.length === 0 ? (
                                                <tr><td colSpan={6} className="px-6 py-12 text-center text-on-surface-variant font-medium">No components found.</td></tr>
                                            ) : filteredComponents.map((comp, i) => (
                                                <motion.tr 
                                                    key={comp.id}
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ duration: 0.2, delay: i * 0.01 }}
                                                    className="hover:bg-on-surface/5 transition-colors group"
                                                >
                                                    <td className="px-6 py-5">
                                                        <p className="text-on-surface font-bold tracking-tight">{comp.name}</p>
                                                        <p className="text-[10px] font-dev text-transform-tertiary text-on-surface-variant/60">{comp.id}</p>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="text-[11px] font-dev text-transform-tertiary font-bold text-primary">{comp.level}</span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-2 py-1 bg-surface-container border border-outline-variant rounded text-[10px] font-black uppercase text-on-surface-variant">
                                                            {comp.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2 py-1 border rounded text-[10px] font-black uppercase tracking-widest ${getComponentStatusColor(comp.status)}`}>
                                                            {comp.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center font-dev text-transform-tertiary font-bold">
                                                        {comp.usageCount}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <div className="flex flex-wrap gap-1">
                                                            {comp.tags.slice(0, 2).map(tag => (
                                                                <span key={tag} className="px-1.5 py-0.5 bg-surface-container-highest text-[9px] rounded text-on-surface-variant/80">
                                                                    {tag}
                                                                </span>
                                                            ))}
                                                            {comp.tags.length > 2 && <span className="text-[9px] text-on-surface-variant/40">+{comp.tags.length - 2}</span>}
                                                        </div>
                                                    </td>
                                                </motion.tr>
                                            ))}
                                        </tbody>
                                    </table>
                                ) : (
                                    <table className="w-full text-sm text-left relative min-w-[800px]">
                                        <thead className="bg-surface-container-highest text-on-surface-variant font-black uppercase text-[10px] tracking-widest border-b border-outline-variant whitespace-nowrap sticky top-0 z-20">
                                            <tr>
                                                <th className="px-6 py-4">ID</th>
                                                <th className="px-6 py-4">Page Path</th>
                                                <th className="px-6 py-4">Theme</th>
                                                <th className="px-6 py-4">Category</th>
                                                <th className="px-6 py-4">Status</th>
                                                <th className="px-6 py-4 text-center">Proof</th>
                                                <th className="px-2 py-4 text-center">Fonts</th>
                                                <th className="px-2 py-4 text-center">Color</th>
                                                <th className="px-2 py-4 text-center">Space</th>
                                                <th className="px-2 py-4 text-center">Layer</th>
                                                <th className="px-2 py-4 text-center">Icon</th>
                                                <th className="px-2 py-4 text-center">Props</th>
                                                <th className="px-2 py-4 text-center">M3:M</th>
                                                <th className="px-2 py-4 text-center">M3:D</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-outline-variant bg-surface-container-lowest font-medium">
                                            <AnimatePresence>
                                            {loading ? (
                                                <tr><td colSpan={12} className="px-6 py-12 text-center text-on-surface-variant animate-pulse font-black uppercase tracking-widest">Compiling Telemetry...</td></tr>
                                            ) : filteredData.length === 0 ? (
                                                <tr><td colSpan={12} className="px-6 py-12 text-center text-on-surface-variant font-medium">No pages found matching criteria.</td></tr>
                                            ) : filteredData.map((page, i) => (
                                                <motion.tr 
                                                    layout
                                                    initial={{ opacity: 0, y: 10 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, scale: 0.95 }}
                                                    transition={{ duration: 0.2, delay: typeof i === 'number' ? i * 0.02 : 0 }}
                                                    key={page.path} 
                                                    className="hover:bg-on-surface/5 transition-colors group"
                                                >
                                                    <td className="px-6 py-5 font-dev text-transform-tertiary text-primary text-[11px] font-bold">
                                                        {page.universalId}
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <Link href={page.path} className="text-on-surface hover:text-primary transition-colors font-bold tracking-tight">
                                                            {page.path}
                                                        </Link>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2 py-1 border rounded text-[10px] font-black uppercase tracking-widest ${page.theme === 'Metro' ? 'bg-[#5A6B29]/10 text-[#5A6B29] border-[#5A6B29]/20' : 'bg-primary/10 text-primary border-primary/20'}`}>
                                                            {page.theme}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className="px-2 py-1 bg-surface-container border border-outline-variant rounded text-[10px] font-black uppercase text-on-surface-variant">
                                                            {page.category}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5">
                                                        <span className={`px-2 py-1 border rounded text-[10px] font-black uppercase tracking-widest ${getStatusInfo(page).color}`}>
                                                            {getStatusInfo(page).label}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-5 text-center">
                                                        {page.proofUrl ? (
                                                            <a href={page.proofUrl} target="_blank" rel="noreferrer" className="text-primary hover:underline font-bold text-[10px] tracking-widest uppercase">
                                                                View
                                                            </a>
                                                        ) : (
                                                            <span className="text-on-surface-variant/40 text-[10px] tracking-widest uppercase">None</span>
                                                        )}
                                                    </td>
                                                    <td className="px-2 py-5 text-center">
                                                        {page.fonts ? <Check className="mx-auto text-primary" size={16} /> : <AlertCircle className="mx-auto text-on-surface-variant/20" size={16} />}
                                                    </td>
                                                    <td className="px-2 py-5 text-center">
                                                        {page.colors ? <Check className="mx-auto text-primary" size={16} /> : <AlertCircle className="mx-auto text-on-surface-variant/20" size={16} />}
                                                    </td>
                                                    <td className="px-2 py-5 text-center">
                                                        {page.spacing ? <Check className="mx-auto text-primary" size={16} /> : <AlertCircle className="mx-auto text-on-surface-variant/20" size={16} />}
                                                    </td>
                                                    <td className="px-2 py-5 text-center">
                                                        {page.layers ? <Check className="mx-auto text-primary" size={16} /> : <AlertCircle className="mx-auto text-on-surface-variant/20" size={16} />}
                                                    </td>
                                                    <td className="px-2 py-5 text-center">
                                                        {page.icons ? <Check className="mx-auto text-primary" size={16} /> : <AlertCircle className="mx-auto text-on-surface-variant/20" size={16} />}
                                                    </td>
                                                    <td className="px-2 py-5 text-center border-l border-outline-variant/30">
                                                        {page.props ? <Check className="mx-auto text-primary" size={16} /> : <AlertCircle className="mx-auto text-on-surface-variant/20" size={16} />}
                                                    </td>
                                                    <td className="px-2 py-5 text-center border-l border-outline-variant/30">
                                                        {page.m3Mobile ? <Check className="mx-auto text-primary" size={16} /> : <AlertCircle className="mx-auto text-on-surface-variant/20" size={16} />}
                                                    </td>
                                                    <td className="px-2 py-5 text-center">
                                                        {page.m3Desktop ? <Check className="mx-auto text-primary" size={16} /> : <AlertCircle className="mx-auto text-on-surface-variant/20" size={16} />}
                                                    </td>
                                                </motion.tr>
                                            ))}
                                            </AnimatePresence>
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </Canvas>
        </DebugAuditor>
    );
}
