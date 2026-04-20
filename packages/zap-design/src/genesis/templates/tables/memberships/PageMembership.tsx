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
import { X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Hooks
import { useMemberships, useMembershipDetail } from '@/hooks/membership/use-memberships';

// Components
import { getColumns } from './components/columns';
import { getFilterGroups } from './components/filters';
import { MembershipInspector, MembershipDetailInspector } from './components/inspector';
import { Membership } from '@/services/membership/membership.model';
import { Text } from '@/genesis/atoms/typography/text';

// Locales
import membershipEn from '@/locale/membership/en';
import membershipVi from '@/locale/membership/vi';

/**
 * Membership Template
 * Route: /design/[theme]/organisms/memberships
 */
export default function PageMembershipTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';
    const pathname = usePathname();
    const router = useRouter();
    const lang = searchParams.get('lang');
    const t = lang === 'vi' ? membershipVi : membershipEn;

    const [selectedMembershipId, setSelectedMembershipId] = React.useState<string | null>(null);
    const { membership: selectedMembership, isLoading: isDetailLoading } = useMembershipDetail(selectedMembershipId);

    // --- Data Fetching ---
    const {
        memberships,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useMemberships({
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
        if (groupId === 'billing_cycle') {
            handleFilterChange({ billing_cycle: apiFilters.billing_cycle === optionId ? undefined : optionId });
        }
    };

    const handleRowClick = (item: any) => {
        setSelectedMembershipId(item.id);
    };

    // --- Memorized Data ---
    const columns = useMemo(() => getColumns({ onAction: handleAction, t }), [t]);
    const filterGroups = useMemo(() => getFilterGroups(apiFilters, t), [apiFilters, t]);

    // --- Shared Components ---
    const TableTable = (
        <ListTable
            initialItems={memberships as any}
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
                addItem: t.label_addMembership,
                itemName: t.label_membershipName,
                type: t.label_status,
                searchPlaceholder: t.label_search,
                filterButton: t.label_filter,
            }}
            onReorder={(newOrder) => console.log('Reordered:', newOrder)}
            isDraggable={true}
            onRowClick={handleRowClick}
        />
    );

    const InspectorPanel = (
        <MembershipInspector
            title={t.title_membershipLab}
            inspectorState={inspectorState}
            setInspectorState={setInspectorState}
            filterGroups={filterGroups}
            onFilterToggle={handleFilterToggle}
            t={t}
        />
    );

    // --- Layouts ---

    const mockShellLayout = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-body border border-border relative">
            {/* Nav */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                        <Icon name="bolt" size={14} />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-on-surface text-transform-tertiary">{t.nav_zapOs}</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 text-transform-tertiary font-dev text-[10px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>{t.nav_overview}</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="loyalty" size={18} />
                        <span>{t.nav_memberships}</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 text-transform-tertiary tracking-widest">{t.nav_management}</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface text-transform-tertiary tracking-widest">{t.nav_memberships}</span>
                    </div>
                </div>
                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {TableTable}
                </div>
            </div>

            {InspectorPanel}

            <AnimatePresence>
                {selectedMembership && (
                    <>
                        <motion.div
                            key="detail-backdrop"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            className="absolute inset-0 bg-black/30 z-10 hidden md:block"
                            onClick={() => setSelectedMembershipId(null)}
                        />
                        <motion.div
                            key="detail-panel"
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: 380, opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            transition={{ duration: 0.25, ease: 'easeInOut' }}
                            className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative overflow-hidden"
                        >
                            <div className="flex flex-col h-full w-[380px] overflow-y-auto">
                                <div className="flex items-center justify-between px-5 py-4 shrink-0">
                                    <button
                                        onClick={() => setSelectedMembershipId(null)}
                                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-foreground"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="flex items-center gap-2">
                                        {isDetailLoading && (
                                            <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                                        )}
                                        <Text size="label-small" className="text-on-surface-variant font-bold tracking-widest text-transform-tertiary">DETAILS</Text>
                                    </div>
                                </div>
                                <MembershipDetailInspector item={selectedMembership as Membership} t={t} />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );

    // --- Rendering ---

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-body">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title={t.title_memberships} badge={null} />
                    <div className="flex-1 overflow-auto pt-8 px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {TableTable}
                    </div>
                </div>
                {InspectorPanel}
                <AnimatePresence>
                    {selectedMembership && (
                        <>
                            <motion.div
                                key="detail-backdrop-fs"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="absolute inset-0 bg-black/30 z-10 hidden md:block"
                                onClick={() => setSelectedMembershipId(null)}
                            />
                            <motion.div
                                key="detail-panel-fs"
                                initial={{ width: 0, opacity: 0 }}
                                animate={{ width: 380, opacity: 1 }}
                                exit={{ width: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: 'easeInOut' }}
                                className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative overflow-hidden"
                            >
                                <div className="flex flex-col h-full w-[380px] overflow-y-auto">
                                    <div className="flex items-center justify-between px-5 py-4 shrink-0">
                                        <button
                                            onClick={() => setSelectedMembershipId(null)}
                                            className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-foreground"
                                        >
                                            <X size={16} />
                                        </button>
                                        <div className="flex items-center gap-2">
                                            {isDetailLoading && (
                                                <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                                            )}
                                            <Text size="label-small" className="text-on-surface-variant font-bold tracking-widest text-transform-tertiary">DETAILS</Text>
                                        </div>
                                    </div>
                                    <MembershipDetailInspector item={selectedMembership as Membership} t={t} />
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName={t.title_memberships}
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/memberships/PageMembership.tsx"
            importPath="@/genesis/templates/tables/memberships/PageMembership"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px]">
                    <MembershipInspector
                        inspectorState={inspectorState}
                        setInspectorState={setInspectorState}
                        filterGroups={filterGroups}
                        onFilterToggle={handleFilterToggle}
                        t={t}
                    />
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title={t.title_memberships}
                    fullScreenHref={`/design/${activeTheme}/organisms/memberships?fullscreen=true`}
                >
                    {mockShellLayout}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
