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
import { useCustomers } from '@/hooks/customer/use-customers';

// Components
import { getColumns } from './components/columns';
import { getFilterGroups, CUSTOMER_LABELS } from './components/filters';
import { CustomerInspector } from './components/inspector';
// Locales
import customerEn from '@/locale/customer/en';
import customerVi from '@/locale/customer/vi';


/**
 * Customer Template
 * Route: /design/[theme]/organisms/customers
 */
export default function PageCustomerTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';
    const pathname = usePathname();
    const router = useRouter();
    const lang = searchParams.get('lang');
    const t = lang === 'vi' ? customerVi : customerEn;

    // --- Data Fetching ---
    const {
        customers,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useCustomers({
        pageSize: 10
    });

    // --- Handlers ---
    const handleAction = (type: string, item: any) => {
        console.log(`Action: ${type} on item:`, item);
    };

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'is_active') {
            const val = optionId === 'true';
            handleFilterChange({ is_active: apiFilters.is_active === val ? null : val });
        }
        if (groupId === 'membership') {
            handleFilterChange({ membership: apiFilters.membership === optionId ? undefined : optionId });
        }
    };

    // --- Memorized Data ---
    const columns = useMemo(() => getColumns({ onAction: handleAction, t }), [t]);
    const filterGroups = useMemo(() => getFilterGroups(apiFilters, t), [apiFilters, t]);

    // --- Shared Components ---
    const TableTable = (
        <ListTable
            initialItems={customers as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            columns={columns as any}
            lang={lang === 'vi' ? 'vi' : 'en'}
            labels={{
                addItem: t.label_addCustomer,
                itemName: t.label_customerName,
                itemCode: t.label_email,
                category: t.label_membership,
                type: t.label_status,
                inventory: t.label_totalSpend,
                price: t.label_lastVisit,
                searchPlaceholder: t.label_search || "Search customers...",
                filterButton: t.label_filter || "Filter"
            }}
            onReorder={(newOrder) => console.log('Reordered:', newOrder)}
            isDraggable={true}
        />
    );

    const InspectorPanel = (
        <CustomerInspector
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
                <div className="flex-1 py-4 px-3 space-y-1 uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>{t.nav_overview}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="groups" size={18} />
                        <span>{t.nav_customers}</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">{t.nav_management}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">{t.nav_customers}</span>
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
                    <ThemeHeader title={t.title_customers} badge={null} />
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
            componentName={t.title_customers}
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/customers/PageCustomer.tsx"
            importPath="@/genesis/templates/tables/customers/PageCustomer"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <CustomerInspector
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
                    title={t.title_customers}
                    fullScreenHref={`/design/${activeTheme}/organisms/customers?fullscreen=true`}
                >
                    {mockShellLayout}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
