'use client';

import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Icon } from '@/genesis/atoms/icons/Icon';

// Hooks
import { usePromotions } from '@/hooks/promotion/use-promotions';

// Types
import { Promotion } from '@/services/promotion/promotion.model';

// Components
import { getColumns } from './components/columns';
import { getFilterGroups, PROMOTION_LABELS } from './components/filters';
import { PromotionInspector, PromotionDetailInspector } from './components/inspector';

/**
 * Promotion Template
 * Route: /design/[theme]/organisms/promotions
 */
export default function PagePromotionsTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // --- Data Fetching ---
    const {
        promotions,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = usePromotions({
        pageSize: 10
    });

    // --- Handlers ---
    const handleAction = (type: string, item: any) => {
        console.log(`Action: ${type} on item:`, item);
    };

    // --- Selection State ---
    const [selectedPromotion, setSelectedPromotion] = React.useState<Promotion | null>(null);

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'is_active') {
            const val = optionId === 'true';
            handleFilterChange({ is_active: apiFilters.is_active === val ? null : val });
        } else if (groupId === 'discount_type') {
            handleFilterChange({ discount_type: apiFilters.discount_type === optionId ? undefined : optionId });
        } else if (groupId === 'schedule') {
            handleFilterChange({ schedule: apiFilters.schedule === optionId ? undefined : optionId });
        }
    };

    // --- Memorized Data ---
    const columns = useMemo(() => getColumns({ onAction: handleAction }), []);
    const filterGroups = useMemo(() => getFilterGroups(apiFilters), [apiFilters]);

    // --- Shared Components ---
    const TableTable = (
        <ListTable
            initialItems={promotions as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            onRowClick={(item) => {
                setSelectedPromotion(item as Promotion);
                setInspectorState('expanded');
            }}
            columns={columns as any}
            labels={PROMOTION_LABELS}
            defaultColumnVisibility={{ apply_to: false }} //mặc định ẩn hiện cột
        />
    );

    const InspectorPanel = (
        <div className="flex flex-col h-full overflow-hidden">
            {selectedPromotion ? (
                <PromotionDetailInspector
                    promotion={selectedPromotion}
                    onClose={() => setSelectedPromotion(null)}
                />
            ) : (
                <PromotionInspector
                    inspectorState={inspectorState}
                    setInspectorState={setInspectorState}
                    filterGroups={filterGroups}
                    onFilterToggle={handleFilterToggle}
                />
            )}
        </div>
    );

    // --- Layouts ---

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
                <div className="flex-1 py-4 px-3 space-y-1 font-mono text-[11px] tracking-widest text-on-surface opacity-70 text-transform-tertiary">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>Overview</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="loyalty" size={18} />
                        <span>Marketing</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="campaign" size={18} />
                        <span>Promotions</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 tracking-widest text-transform-tertiary">Marketing</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface tracking-widest text-transform-tertiary">Promotions</span>
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
                    <ThemeHeader title="Promotions" badge={null} />
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
            componentName="Promotions"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/promotions/PagePromotion.tsx"
            importPath="@/genesis/templates/tables/promotions/PagePromotion"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={InspectorPanel}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Promotion Management"
                    fullScreenHref={`/design/${activeTheme}/organisms/promotions?fullscreen=true`}
                >
                    {mockShellLayout}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
