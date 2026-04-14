import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { useUnits } from '@/hooks/unit/use-units';
import { Unit } from '@/services/unit/unit.model';
import { getUnitColumns } from './components/columns';
import { getUnitFilterGroups } from './components/filters';
import { UnitInspector } from './components/inspector';

/**
 * PageUnitTemplate
 * Standardized Administrative Module for Units of Measure (UOM)
 */
export default function PageUnitTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // --- State ---
    const [selectedItem, setSelectedItem] = useState<Unit | null>(null);

    // --- Data Fetching ---
    const {
        units,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useUnits({
        pageSize: 10
    });

    // --- Handlers ---
    const handleEdit = (item: Unit) => {
        setSelectedItem(item);
        setInspectorState('expanded');
    };

    const handleDelete = (item: Unit) => {
        console.log('Delete item:', item);
    };

    const handleFilterToggle = (groupId: string, optionId: string) => {
        const currentVal = (apiFilters as any)[groupId];
        handleFilterChange({ [groupId]: currentVal === optionId ? null : optionId });
    };

    const handleRowClick = (item: any) => {
        setSelectedItem(item as Unit);
        setInspectorState('expanded');
    };

    // --- Mapped Data & Columns ---
    const columns = useMemo(() => getUnitColumns(handleEdit, handleDelete), [handleEdit, handleDelete]);
    const filterGroups = useMemo(() => getUnitFilterGroups(apiFilters), [apiFilters]);

    const tableComponent = (
        <ListTable
            initialItems={units as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(p) => handlePageChange(p + 1)}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            columns={columns as any}
            labels={{
                addItem: "Add Unit",
                itemName: "Unit Name",
                type: "Status"
            }}
            onRowClick={handleRowClick}
        />
    );

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <UnitInspector 
                selectedUnit={selectedItem}
                filters={filterGroups}
                onFilterToggle={handleFilterToggle}
            />
        </div>
    );

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
            {/* Sidebar Mock */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase">ZAP OS</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>Overview</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="settings" size={18} />
                        <span>Settings</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="straighten" size={18} />
                        <span>Units of Measure</span>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">Inventory</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">Units</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {tableComponent}
                </div>
            </div>
            {rightDrawerContent}
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title="Units of Measure" badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {tableComponent}
                    </div>
                </div>
                {rightDrawerContent}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="Units-Management"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/units/PageUnit.tsx"
            importPath="@/genesis/templates/tables/units/PageUnit"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <UnitInspector 
                        selectedUnit={selectedItem}
                        filters={filterGroups}
                        onFilterToggle={handleFilterToggle}
                    />
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Units // Inventory Module"
                    fullScreenHref={`/design/${activeTheme}/organisms/units?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
