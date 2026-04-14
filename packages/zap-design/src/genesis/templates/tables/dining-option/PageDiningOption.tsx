import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable, Filters } from '@/zap/organisms/list-table';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Pencil, Copy, Trash2 } from "lucide-react";
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Inspector } from '@/zap/layout/Inspector';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { useDiningOptions } from '@/hooks/dining-option/use-dining-options';

import { Text } from '@/genesis/atoms/typography/text';

/**
 * Dining Option Template
 */
export default function PageDiningOptionTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // --- Data Fetching ---
    const {
        diningOptions,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useDiningOptions({
        pageSize: 10
    });

    // --- Data Mapping ---
    const MAPPED_DINING_OPTIONS = useMemo(() => diningOptions.map(option => ({
        ...option,
        id: option.id,
        name: option.name,
        is_active: option.status === 'Active'
    })), [diningOptions]);

    const columns = useMemo<ColumnDef<any>[]>(() => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="w-12 px-7">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="translate-y-0.5"
                    /></div>
            ),
            cell: ({ row }) => (
                <div className="w-12 px-7">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    /></div>
            ),
            enableSorting: false,
            enableHiding: false,
        }, {
            id: "id",
            header: ({ column }) => (
                <div
                    className="w-14 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate uppercase">ID</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-14 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
                    {row.original.id}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "Name",
            accessorKey: "name",
            header: ({ column }) => (
                <div
                    className="w-80 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Name</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar
                                initials={row.original.acronymn}
                                size="sm"
                                fallback={row.original.acronymn}
                                className="w-full h-full object-cover border-[1px] border-border"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Text size='label-small' className='font-semibold text-foreground truncate'>
                                {row.original.name}
                            </Text>
                        </div>
                    </div>
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            id: "Type",
            accessorKey: "type",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Type</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground">
                    {row.original.type}
                </div>
            ),
        },
        {
            id: "Status",
            accessorKey: "is_active",
            header: ({ column }) => (
                <div
                    className="w-20 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Status</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-20 text-left py-2.5">
                    <Pill
                        variant={row.original.is_active ? 'success' : 'warning'}
                        className="whitespace-nowrap w-fit ml-auto"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                        {row.original.is_active ? 'Active' : 'Inactive'}
                    </Pill>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            header: () => <div className="w-24 pr-7" />,
            cell: ({ row }) => (
                <div className="w-24 pr-7 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end">
                        <QuickActionsDropdown
                            actions={[
                                { label: 'Edit', icon: Pencil, onClick: () => { } },
                                { label: 'Delete', icon: Trash2, onClick: () => { }, variant: 'destructive' },
                            ]}
                        />
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ], []);

    const labels = {
        addItem: "Add Option",
        itemName: "Option Name",
        type: "Status"
    };

    const filterGroups: FilterGroup[] = [
        {
            id: 'status',
            title: 'Status',
            options: [
                { id: 'Active', label: 'Active', selected: apiFilters.status === 'Active' },
                { id: 'Inactive', label: 'Inactive', selected: apiFilters.status === 'Inactive' },
            ]
        }
    ];

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'status') {
            handleFilterChange({ status: apiFilters.status === optionId ? null : optionId });
        }
    };

    const tableComponent = (
        <ListTable
            initialItems={MAPPED_DINING_OPTIONS as any}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(p) => handlePageChange(p + 1)}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            columns={columns as any}
            labels={labels}
        />
    );

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="DINING OPTION LAB" width={320}>
                <div className="flex flex-col gap-0 w-full px-4 pt-4">
                    <Accordion
                        type="single"
                        collapsible
                        variant="navigation"
                        value={inspectorState === 'expanded' ? "item-1" : ""}
                        onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }}
                        className="bg-transparent w-full space-y-2"
                    >
                        <AccordionItem value="item-1" className="border-none m-0">
                            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                                <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                    <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                                    <span className="truncate uppercase">FILTERS</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
                                <DataFilter
                                    title=""
                                    groups={filterGroups}
                                    onToggle={handleFilterToggle}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </Inspector>
        </div>
    );

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
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
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="restaurant" size={18} />
                        <span>Dining Options</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">Setup</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">Dining Options</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {tableComponent}
                </div>
            </div>
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title="Dining options" badge={null} />
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
            componentName="Dining-options"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/dining-option/PageDiningOption.tsx"
            importPath="@/genesis/templates/tables/dining-option/PageDiningOption"
            hideDataTerminal={true}
            fullWidth={true}
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px] px-4 pt-4">
                    <Accordion
                        type="single"
                        collapsible
                        variant="navigation"
                        value={inspectorState === 'expanded' ? "item-1" : ""}
                        onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }}
                        className="bg-transparent w-full space-y-2"
                    >
                        <AccordionItem value="item-1" className="border-none m-0">
                            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                                <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                    <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                                    <span className="truncate uppercase">FILTERS</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
                                <DataFilter
                                    title=""
                                    groups={filterGroups}
                                    onToggle={handleFilterToggle}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            }
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Dining Options // Collection"
                    fullScreenHref={`/design/${activeTheme}/organisms/dining-options?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
