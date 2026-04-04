'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useTheme, type AppTheme } from 'zap-design/src/components/ThemeContext';

// L1 — Atoms
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';

// L2 — Molecules
import { SideNav } from 'zap-design/src/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'zap-design/src/genesis/molecules/accordion';
import { DataFilter, FilterGroup } from 'zap-design/src/genesis/molecules/data-filter';

// L3 — Organisms / Layouts
import { Inspector } from 'zap-design/src/zap/layout/Inspector';
import { CanvasDesktop } from 'zap-design/src/components/dev/CanvasDesktop';
import { ComponentSandboxTemplate } from 'zap-design/src/zap/layout/ComponentSandboxTemplate';

// Feature Components & Hooks
import { UnitTableExpanded, type UnitFilters } from '@/feature/unit/components/UnitTableExpanded';
import { useUnits } from '@/feature/unit/hooks/use-units';
import { loadTranslations, t as translate } from '@/lib/i18n';
import type { SupportedLang } from '@/const';

// ── Shared Filter Panel ───────────────────────────────────────────────────
function FilterPanel({ 
    filterGroups, 
    onToggle, 
    t 
}: { 
    filterGroups: FilterGroup[], 
    onToggle: (groupId: string, optionId: string) => void,
    t: (key: string, fallback?: string) => string 
}) {
  return (
    <Accordion type="single" collapsible variant="navigation" defaultValue="item-1" className="bg-transparent w-full space-y-2">
      <AccordionItem value="item-1" className="border-none m-0">
        <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-display text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
          <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
            <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
            <span className="truncate">{t('filter', 'filters')}</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
          <DataFilter title="" groups={filterGroups} onToggle={onToggle} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

interface Props {
  merchant?: string;
  lang?: string;
}

export function UnitPage({ merchant, lang: propLang }: Props) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    
    // In actual app we receive 'lang' from props if it exists, else search params
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const lang = (propLang || searchParams.get('lang') || 'en') as SupportedLang;
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // ── Localization ────────────────────────────────────────────────────────
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [loadingTranslations, setLoadingTranslations] = useState(true);

    useEffect(() => {
        loadTranslations(lang, 'unit')
            .then(setTranslations)
            .finally(() => setLoadingTranslations(false));
    }, [lang]);

    const t = (key: string, fallback?: string) => translate(translations, key) || fallback || key;

    // ── Table State ─────────────────────────────────────────────────────────
    const [filters, setFilters] = useState<UnitFilters>({
        status: [],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { units, loading, total: totalRecords } = useUnits(currentPage, pageSize);
    const totalPages = Math.ceil(totalRecords / pageSize);

    // ── Filter Derived Data ─────────────────────────────────────────────────
    const baseGroups = useMemo(() => [
        {
            id: 'status',
            title: t('table_status', 'status'),
            options: [
                { id: 'active', label: t('status_active', 'active') },
                { id: 'inactive', label: t('status_inactive', 'inactive') }
            ]
        }
    ], [t]);

    const filterGroups = useMemo(() => baseGroups.map(group => ({
        ...group,
        options: group.options.map(opt => ({
            ...opt,
            selected: filters.status.includes(opt.id as any)
        }))
    })), [baseGroups, filters.status]);

    const handleFilterToggle = (groupId: string, optionId: string) => {
        setFilters(current => {
            const currentList = current.status;
            const updatedList = currentList.includes(optionId as any)
                ? currentList.filter(id => id !== optionId)
                : [...currentList as any, optionId];
            setCurrentPage(1);
            return {
                ...current,
                status: updatedList as any
            };
        });
    };

    // ── Pre-build Components ────────────────────────────────────────────────
    
    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title={t('lbl_inspector_title', 'unit lab')} width={320}>
                <div className="flex flex-col gap-0 w-full px-4 pt-4">
                    <FilterPanel filterGroups={filterGroups} onToggle={handleFilterToggle} t={t} />
                </div>
            </Inspector>
        </div>
    );

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-body border border-border">
            {/* Sidebar Navigation */}
            <aside className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <Icon name="bolt" size={14} className="text-primary-foreground" />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-transform-primary text-on-surface">zap os</span>
                </div>
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {[
                        { icon: 'inventory_2', label: 'Product', href: `/${merchant || 'zap'}/${lang || 'en'}/products` },
                        { icon: 'category', label: 'Category', href: `/${merchant || 'zap'}/${lang || 'en'}/categories` },
                        { icon: 'straighten', label: 'Unit', active: true, href: `/${merchant || 'zap'}/${lang || 'en'}/units` },
                        { icon: 'branding_watermark', label: 'Brand', href: `/${merchant || 'zap'}/${lang || 'en'}/brands` },
                    ].map((item) => (
                        <Link
                            href={item.href}
                            key={item.label}
                            className={`px-3 py-2.5 rounded-md flex items-center gap-3 text-sm cursor-pointer transition-colors relative ${
                                item.active
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-on-surface hover:bg-surface-variant/40'
                            }`}
                        >
                            {item.active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md"></div>}
                            <Icon name={item.icon} size={18} className={`shrink-0 ${item.active ? '' : 'text-on-surface-variant'}`} />
                            <span className="font-medium font-body text-transform-secondary">{item.label}</span>
                        </Link>
                    ))}
                </nav>
                <div className="p-4 border-t border-border mt-auto bg-surface-variant/30">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-layer-base border border-border flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold">ZT</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate text-on-surface text-transform-secondary">zeus tom</span>
                            <span className="text-[10px] text-on-surface-variant truncate tracking-wide text-transform-secondary font-dev">cso</span>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                {/* Header */}
                <header className="h-14 border-b border-border bg-layer-base flex items-center px-4 lg:px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center gap-2 min-w-0">
                        <button title={t('menu', 'menu')} aria-label={t('menu', 'menu')} className="md:hidden shrink-0 p-2 hover:bg-surface-variant rounded-md transition-colors text-on-surface-variant">
                            <Icon name="menu" size={20} />
                        </button>
                        <nav className="flex items-center gap-1 text-xs lg:text-sm min-w-0">
                            <span className="font-body text-transform-secondary text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors truncate">{t('nav_catalog', 'catalog')}</span>
                            <Icon name="chevron_right" size={16} className="text-on-surface-variant/50 shrink-0" />
                            <span className="font-medium font-display text-transform-primary text-on-surface truncate">{t('nav_units', 'unit list')}</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                        <button title={t('notifications', 'notifications')} aria-label={t('notifications', 'notifications')} className="relative w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors text-on-surface-variant">
                            <Icon name="notifications" size={18} />
                        </button>
                        <div className="h-6 w-px bg-border hidden sm:block" />
                        <div className="hidden sm:flex flex-col items-end gap-0.5">
                            <span className="text-xs font-bold leading-tight font-dev text-transform-tertiary">us-west-1</span>
                            <span className="text-[9px] tracking-widest text-success font-dev text-transform-tertiary flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                                {t('status_healthy', 'healthy')}
                            </span>
                        </div>
                    </div>
                </header>

                {/* Table Content */}
                <main className="flex-1 overflow-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-8 flex flex-col relative z-0 min-w-0">
                    <UnitTableExpanded
                        units={units}
                        loading={loading || loadingTranslations}
                        filters={filters}
                        currentPage={currentPage}
                        pageSize={pageSize}
                        totalRecords={totalRecords}
                        totalPages={totalPages}
                        onFilterChange={(newFilters) => {
                            setFilters(newFilters);
                            setCurrentPage(1);
                        }}
                        onPageChange={setCurrentPage}
                        onPageSizeChange={(newSize) => {
                            setPageSize(newSize);
                            setCurrentPage(1);
                        }}
                        onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
                        isFilterActive={inspectorState === 'expanded'}
                        t={t}
                        lang={lang}
                    />
                </main>
            </div>

            {/* Inspector Drawer */}
            {rightDrawerContent}
        </div>
    );

    const inspectorContent = (
        <div className="flex flex-col gap-0 w-full min-w-[320px] px-4 pt-4">
            <FilterPanel filterGroups={filterGroups} onToggle={handleFilterToggle} t={t} />
        </div>
    );

    // ── Render ───────────────────────────────────────────────────────────────
    
    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-body">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader
                        title={t('title', 'unit list assembly')}
                        breadcrumb={t('breadcrumb', 'zap design engine / metro / layout')}
                        badge={t('badge', 'component sandbox')}
                        showBackground={false}
                    />
                    <main className="flex-1 overflow-auto px-4 sm:px-6 lg:px-12 py-6 lg:py-8 flex flex-col relative z-0 bg-layer-base min-w-0">
                        <UnitTableExpanded
                            units={units}
                            loading={loading || loadingTranslations}
                            filters={filters}
                            currentPage={currentPage}
                            pageSize={pageSize}
                            totalRecords={totalRecords}
                            totalPages={totalPages}
                            onFilterChange={(newFilters) => {
                                setFilters(newFilters);
                                setCurrentPage(1);
                            }}
                            onPageChange={setCurrentPage}
                            onPageSizeChange={(newSize) => {
                                setPageSize(newSize);
                                setCurrentPage(1);
                            }}
                            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
                            isFilterActive={inspectorState === 'expanded'}
                            t={t}
                            lang={lang}
                        />
                    </main>
                </div>
                {rightDrawerContent}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName={t('title', 'unit list')}
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/feature/unit/pages/UnitPage.tsx"
            importPath="@/feature/unit/pages/UnitPage"
            inspectorControls={inspectorContent}
            hideDataTerminal={true}
            fullWidth={true}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title={t('canvas_title', 'unit list // catalog')}
                    fullScreenHref={(merchant && lang) ? `/${merchant}/${lang}/units?fullscreen=true` : `/auth/${activeTheme}/units?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
