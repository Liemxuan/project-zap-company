'use client';

import React, { useMemo } from 'react';
import { useSearchParams, usePathname, useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Icon } from '@/genesis/atoms/icons/Icon';

// Hooks
import { useGroupProducts } from '@/hooks/group-product/use-group-products';

// Components
import { getColumns } from './components/columns';
import { getFilterGroups, GROUP_PRODUCT_LABELS } from './components/filters';
import { GroupProductInspector } from './components/inspector';
// Locales
import groupProductEn from '@/locale/group-product/en';
import groupProductVi from '@/locale/group-product/vi';

/**
 * Group Product Template - Optimized Version
 * Route: /design/[theme]/organisms/group-products
 */
export default function PageGroupProductTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';
    const pathname = usePathname();
    const router = useRouter();
    const lang = searchParams.get('lang');
    const t = lang === 'vi' ? groupProductVi : groupProductEn;

    // --- Data Fetching ---
    const {
        groupProducts,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useGroupProducts({
        pageSize: 10
    });

    // --- Handlers ---
    const handleAction = (type: string, item: any) => {
        console.log(`Action: ${type} on item:`, item);
        // Implement logic for edit, duplicate, delete here
    };

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'is_active') {
            const val = optionId === 'true';
            handleFilterChange({ is_active: apiFilters.is_active === val ? null : val });
        }
    };

    // --- Memorized Data ---
    const columns = useMemo(() => getColumns({ onAction: handleAction, t }), [t]);
    const filterGroups = useMemo(() => getFilterGroups(apiFilters, t), [apiFilters, t]);

    // --- Shared Components ---
    const TableTable = (
        <ListTable
            initialItems={groupProducts as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(p) => handlePageChange(p + 1)}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            columns={columns as any}
            lang={lang === 'vi' ? 'vi' : 'en'}
            labels={{
                addItem: t.label_addGroupProduct,
                itemName: t.label_groupProductName,
                itemCode: t.label_sku,
                category: t.label_category,
                type: t.label_status,
                inventory: t.label_itemsCount,
                price: t.label_price
            }}
            defaultColumnVisibility={{ Location: false }}
        />
    );

    const InspectorPanel = (
        <GroupProductInspector
            inspectorState={inspectorState}
            setInspectorState={setInspectorState}
            filterGroups={filterGroups}
            onFilterToggle={handleFilterToggle}
        />
    );

    // --- Layouts ---

    // 1. Mock Shell Layout (Internal to the template)
    const mockShellLayout = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
            {/* Nav */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase text-transform-none">ZAP OS</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>{t.nav_overview}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="category" size={18} />
                        <span>{t.nav_categories}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="inventory" size={18} />
                        <span>{t.nav_groupProducts}</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">{t.nav_catalog}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">{t.nav_groupProducts}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {TableTable}
                </div>
            </div>

            {InspectorPanel}
        </div>
    );

    // --- Rendering ---

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title={t.title_groupProducts} badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {TableTable}
                    </div>
                </div>
                {InspectorPanel}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName={t.title_groupProducts}
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/group-product/PageGroupProduct.tsx"
            importPath="@/genesis/templates/tables/group-product/PageGroupProduct"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <GroupProductInspector
                        inspectorState={inspectorState}
                        setInspectorState={setInspectorState}
                        filterGroups={filterGroups}
                        onFilterToggle={handleFilterToggle}
                    />
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title={t.title_groupProducts}
                    fullScreenHref={`/design/${activeTheme}/organisms/group-products?fullscreen=true`}
                >
                    {mockShellLayout}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
