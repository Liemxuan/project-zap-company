'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import { useTheme, type AppTheme } from 'zap-design/src/components/ThemeContext';

// L1 — Atoms
import { Text } from 'zap-design/src/genesis/atoms/typography/text';

// L2 — Molecules
import { SideNav } from 'zap-design/src/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'zap-design/src/genesis/molecules/accordion';
import { DataFilter, FilterGroup } from 'zap-design/src/genesis/molecules/data-filter';

// L3 — Organisms / Layouts
import { Inspector } from 'zap-design/src/zap/layout/Inspector';
import { CanvasDesktop } from 'zap-design/src/components/dev/CanvasDesktop';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';

// Feature Components & Hooks
import { ProductTableExpanded, type ProductFilters } from '@/feature/product/components/ProductTableExpanded';
import { useProducts } from '@/feature/product/hooks/use-products';
import { loadTranslations, t as translate } from '@/lib/i18n';
import type { SupportedLang } from '@/const';

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AuthProductManagementPage() {
    const params = useParams();
    const searchParams = useSearchParams();
    const router = useRouter();
    const { inspectorState, setInspectorState, setTheme } = useTheme();
    
    const theme = params.theme as string;
    const lang = (searchParams.get('lang') || 'en') as SupportedLang;
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // ── Localization ────────────────────────────────────────────────────────
    const [translations, setTranslations] = useState<Record<string, string>>({});
    const [loadingTranslations, setLoadingTranslations] = useState(true);

    useEffect(() => {
        if (theme) {
            setTheme(theme as AppTheme);
        }
    }, [theme, setTheme]);

    useEffect(() => {
        loadTranslations(lang, 'product')
            .then(setTranslations)
            .finally(() => setLoadingTranslations(false));
    }, [lang]);

    const t = (key: string, fallback?: string) => translate(translations, key) || fallback || key;

    // ── Table State ─────────────────────────────────────────────────────────
    const [filters, setFilters] = useState<ProductFilters>({
        category: [],
        status: [],
    });
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const { products, loading, totalRecords, totalPages } = useProducts(currentPage, pageSize);

    // ── Filter Derived Data ─────────────────────────────────────────────────
    const filterGroups = useMemo(() => {
        const categories = Array.from(new Set(products.map(p => p.cate_name).filter(Boolean)));
        const statuses = Array.from(new Set(products.map(p => p.status?.toString()))).filter(Boolean);

        return [
            {
                id: 'category',
                title: t('table_category', 'Category'),
                options: categories.map(cat => ({
                    id: cat,
                    label: cat,
                    selected: filters.category.includes(cat)
                }))
            },
            {
                id: 'status',
                title: t('table_status', 'Status'),
                options: statuses.map(status => ({
                    id: status,
                    label: t(`status_${status}`, `Status ${status}`),
                    selected: filters.status.includes(status)
                }))
            }
        ];
    }, [products, filters, translations]);

    const handleFilterToggle = (groupId: string, optionId: string) => {
        setFilters(current => {
            const key = groupId as keyof ProductFilters;
            const currentList = current[key];
            const updatedList = currentList.includes(optionId)
                ? currentList.filter(id => id !== optionId)
                : [...currentList, optionId];
            setCurrentPage(1);
            return { ...current, [key]: updatedList };
        });
    };

    // ── Inspector Content ───────────────────────────────────────────────────
    const inspectorContent = (
        <Inspector title={t('inspector_title', 'PRODUCTS LAB')} width={320}>
            <div className="flex flex-col gap-0 w-full px-4 pt-4">
                <Accordion
                    type="single"
                    collapsible
                    variant="navigation"
                    value={inspectorState === 'expanded' ? "filters" : ""}
                    onValueChange={(val) => setInspectorState(val === "filters" ? 'expanded' : 'collapsed')}
                    className="bg-transparent w-full space-y-2"
                >
                    <AccordionItem value="filters" className="border-none m-0">
                        <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-[11px] uppercase tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                            <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                                <span className="truncate">{t('filter', 'Filters')}</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
                            <DataFilter
                                groups={filterGroups as FilterGroup[]}
                                onToggle={handleFilterToggle}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </Inspector>
    );

    const tableContent = (
        <ProductTableExpanded
            products={products}
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
    );

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
            <SideNav />

            <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
                <ThemeHeader
                    title={t('title', 'products assembly')}
                    breadcrumb={`zap auth / ${theme} / product vault`}
                    badge={t('badge', 'verified')}
                    liveIndicator={true}
                    showBackground={false}
                />

                <div className="flex-1 flex overflow-hidden">
                    <div className="flex-1 overflow-auto pt-8 px-4 lg:px-12 pb-24 flex flex-col relative z-0">
                        {!isFullscreen ? (
                            <CanvasDesktop
                                title={t('canvas_title', 'Product Datagrid // Assembly')}
                                fullScreenHref="?fullscreen=true"
                            >
                                <div className="w-full flex-1 flex flex-col rounded-b-xl overflow-visible min-h-[600px] p-6 lg:p-8 pb-24">
                                    {tableContent}
                                </div>
                            </CanvasDesktop>
                        ) : (
                            <div className="flex-1 flex flex-col min-h-0 bg-white rounded-xl shadow-lg border border-border">
                                {tableContent}
                            </div>
                        )}
                    </div>

                    {inspectorContent}
                </div>
            </div>
        </div>
    );
}
