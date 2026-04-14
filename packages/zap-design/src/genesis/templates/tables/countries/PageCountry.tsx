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
import { useCountries } from '@/hooks/country/use-countries';

// Types
import { Country } from '@/services/country/country.model';

// Components
import { getColumns } from './components/columns';
import { getFilterGroups, COUNTRY_LABELS } from './components/filters';
import { CountryInspector, CountryDetailInspector } from './components/inspector';

/**
 * Country Template
 * Route: /design/[theme]/organisms/countries
 */
export default function PageCountryTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // --- Data Fetching ---
    const {
        countries,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useCountries({
        pageSize: 10
    });

    // --- Handlers ---
    const handleAction = (type: string, item: any) => {
        console.log(`Action: ${type} on item:`, item);
    };

    // --- Selection State ---
    const [selectedCountry, setSelectedCountry] = React.useState<Country | null>(null);

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'is_active') {
            const val = optionId === 'true';
            handleFilterChange({ is_active: apiFilters.is_active === val ? null : val });
        }
    };

    // --- Memorized Data ---
    const columns = useMemo(() => getColumns({ onAction: handleAction }), []);
    const filterGroups = useMemo(() => getFilterGroups(apiFilters), [apiFilters]);

    // --- Shared Components ---
    const TableTable = (
        <ListTable
            initialItems={countries as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(p) => handlePageChange(p + 1)}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            onRowClick={(item) => {
                setSelectedCountry(item as Country);
                setInspectorState('expanded');
            }}
            columns={columns as any}
            labels={COUNTRY_LABELS}
            isDraggable={true}
            onReorder={(newOrder) => console.log('Reordered:', newOrder)}
        />
    );

    const InspectorPanel = selectedCountry ? (
        <CountryDetailInspector
            country={selectedCountry}
            onClose={() => setSelectedCountry(null)}
        />
    ) : (
        <CountryInspector
            inspectorState={inspectorState}
            setInspectorState={setInspectorState}
            filterGroups={filterGroups}
            onFilterToggle={handleFilterToggle}
        />
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
                        <Icon name="settings" size={18} />
                        <span>Settings</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="public" size={18} />
                        <span>Countries</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 tracking-widest text-transform-tertiary">Settings</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface tracking-widest text-transform-tertiary">Countries</span>
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
                    <ThemeHeader title="Countries" badge={null} />
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
            componentName="Countries"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/countries/PageCountry.tsx"
            importPath="@/genesis/templates/tables/countries/PageCountry"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={InspectorPanel}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Country Management"
                    fullScreenHref={`/design/${activeTheme}/organisms/countries?fullscreen=true`}
                >
                    {mockShellLayout}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
