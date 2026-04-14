import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { ListTable, ListItem, Filters } from '../../../zap/organisms/list-table';
import { SAMPLE_LOGS } from '../../../zap/organisms/system-logs-table';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '../../atoms/status/pills';
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { DataFilter, FilterGroup } from '../../molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../molecules/accordion';
import { Icon } from '../../atoms/icons/Icon';
import { SideNav } from '../../molecules/navigation/SideNav';
import { ThemeHeader } from '../../molecules/layout/ThemeHeader';
import { Inspector } from '../../../zap/layout/Inspector';
import { Text } from '@/genesis/atoms/typography/text';

/**
 * System Logs (Layout) Showcase
 * Renders SystemLogsTable inside the L6 CanvasDesktop layout
 * Route: /design/[theme]/organisms/system-logs-layout
 */
export default function SystemLogsTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    const [filters, setFilters] = useState<Filters>({
        category: [], // Map level to category
        productType: [], // Map service to productType
        status: [], // Map status to status
    });

    // Map System Logs to generic ListItem
    interface LogListItem extends ListItem {
        timestamp?: string;
    }

    const MAPPED_DATA: LogListItem[] = SAMPLE_LOGS.map(log => ({
        id: log.id,
        media_url: '',
        variant_name: log.message,
        sku_code: log.service,
        barcode: log.duration,
        category_id: log.level,
        product_type: log.service,
        sale_price: 0,
        qty_on_hand: 0,
        uom_id: log.status,
        warehouse_id: log.service,
        status_id: log.status,
        timestamp: log.timestamp,
    }));

    const columns = React.useMemo<ColumnDef<LogListItem>[]>(() => [
        {
            id: "expander",
            header: () => <div className="w-12 px-7" />,
            cell: ({ row }) => (
                <div className="px-7 w-12 py-3">
                    <motion.div
                        animate={{ rotate: row.getIsExpanded() ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                        className="flex-shrink-0 w-4 cursor-pointer"
                        onClick={() => row.toggleExpanded()}
                    >
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                    </motion.div>
                </div>
            ),
        },
        {
            accessorKey: "category_id",
            header: ({ column }) => (
                <div
                    className="w-28 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Level</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-28 py-3">
                    <Pill
                        variant={row.original.category_id === 'info' ? 'info' : row.original.category_id === 'warning' ? 'warning' : 'error'}
                        className="min-w-16 block text-center"
                    >
                        {row.original.category_id}
                    </Pill>
                </div>
            ),
        },
        {
            accessorKey: "timestamp",
            header: () => <div className="w-28 text-left tracking-widest transition-colors"><Text size='label-small' className='font-semibold'>Time</Text></div>,
            cell: ({ row }) => (
                <div className="w-28 font-dev text-transform-tertiary text-muted-foreground text-left py-3">
                    {new Date(row.original.timestamp as string).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                    })}
                </div>
            ),
        },
        {
            accessorKey: "product_type",
            header: ({ column }) => (
                <div
                    className="w-48 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Service</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-48 truncate font-medium text-foreground text-left py-3">
                    {row.original.product_type}
                </div>
            ),
        },
        {
            accessorKey: "variant_name",
            header: () => <div className="text-left tracking-widest transition-colors"><Text size='label-small' className='font-semibold'>Message</Text></div>,
            cell: ({ row }) => (
                <div className="truncate max-w-[400px] text-muted-foreground text-left py-3 pr-4">
                    {row.original.variant_name}
                </div>
            ),
        },
        {
            accessorKey: "status_id",
            header: ({ column }) => (
                <div
                    className="w-24 text-right tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Status</Text>
                </div>
            ),
            cell: ({ row }) => {
                const status = row.original.status_id;
                const statusColor = status === '200' || status === '201' ? 'text-success' :
                    status === 'warning' || status === '429' ? 'text-warning' : 'text-destructive';
                return (
                    <div className={`w-24 text-right font-dev text-transform-tertiary font-semibold py-3 ${statusColor}`}>
                        {status}
                    </div>
                );
            },
        },
        {
            accessorKey: "barcode",
            header: () => <div className="w-24 pr-7 text-right tracking-widest transition-colors"><Text size='label-small' className='font-semibold'>Duration</Text></div>,
            cell: ({ row }) => (
                <div className="w-24 pr-7 text-right font-dev text-transform-tertiary text-muted-foreground py-3">
                    {row.original.barcode}
                </div>
            ),
        },
    ], []);

    // Derive filter groups from the SAMPLE_LOGS
    const baseGroups: FilterGroup[] = [
        {
            id: 'category',
            title: 'Level',
            options: Array.from(new Set(SAMPLE_LOGS.map(l => l.level))).map(level => ({
                id: level,
                label: level,
            }))
        },
        {
            id: 'productType',
            title: 'Service',
            options: Array.from(new Set(SAMPLE_LOGS.map(l => l.service))).map(service => ({
                id: service,
                label: service,
            }))
        },
        {
            id: 'status',
            title: 'Status',
            options: Array.from(new Set(SAMPLE_LOGS.map(l => l.status))).map(status => ({
                id: status,
                label: status,
            }))
        }
    ];

    // Map current dynamic state onto filter groups
    const filterGroups = baseGroups.map(group => ({
        ...group,
        options: group.options.map(opt => ({
            ...opt,
            selected: filters[group.id as keyof Filters].includes(opt.id)
        }))
    }));

    const handleFilterToggle = (groupId: string, optionId: string) => {
        setFilters(current => {
            const currentList = current[groupId as keyof Filters];
            const updatedList = currentList.includes(optionId)
                ? currentList.filter(id => id !== optionId)
                : [...currentList, optionId];
            return {
                ...current,
                [groupId as keyof Filters]: updatedList
            };
        });
    };

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="SYSTEM LOGS LAB" width={320}>
                <div className="flex flex-col gap-0 w-full px-4 pt-4">
                    <Accordion type="single" collapsible variant="navigation" value={inspectorState === 'expanded' ? "item-1" : ""} onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }} className="bg-transparent w-full space-y-2">
                        <AccordionItem value="item-1" className="border-none m-0">
                            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                                <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                    <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                                    <span className="truncate">FILTERS</span>
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
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border">
            {/* Fake Side Navigation */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <Icon name="bolt" size={14} className="text-primary-foreground" />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-transform-primary text-on-surface">ZAP OS</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 text-sm text-on-surface cursor-pointer transition-colors">
                        <Icon name="dashboard" size={18} className="text-on-surface-variant shrink-0" />
                        <span className="font-medium">Overview</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 text-sm cursor-pointer border border-primary/20 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md"></div>
                        <Icon name="list_alt" size={18} className="shrink-0" />
                        <span className="font-medium">System Logs</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 text-sm text-on-surface cursor-pointer transition-colors">
                        <Icon name="shield" size={18} className="text-on-surface-variant shrink-0" />
                        <span className="font-medium">Security Alerts</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 text-sm text-on-surface cursor-pointer transition-colors">
                        <Icon name="settings" size={18} className="text-on-surface-variant shrink-0" />
                        <span className="font-medium">Configuration</span>
                    </div>
                </div>
                <div className="p-4 border-t border-border mt-auto bg-surface-variant/30">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-layer-base border border-border flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold">ZT</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate text-on-surface">Zeus Tom</span>
                            <span className="text-[10px] text-on-surface-variant truncate tracking-wide">CSO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                {/* Fake Header */}
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-4 lg:px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center">
                        <button className="md:hidden mr-2 -ml-2 shrink-0 p-2 hover:bg-surface-variant rounded-md transition-colors text-on-surface-variant">
                            <Icon name="menu" size={20} />
                        </button>
                        <div className="flex items-center text-xs lg:text-sm">
                            <span className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Infrastructure</span>
                            <Icon name="chevron_right" size={16} className="text-on-surface-variant/50 mx-1 shrink-0" />
                            <span className="font-medium text-on-surface">System Logs</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button className="relative w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors text-on-surface-variant">
                            <Icon name="notifications" size={18} />
                            <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-error rounded-full"></span>
                        </button>
                        <div className="h-6 w-px bg-border my-auto hidden sm:block" />
                        <div className="hidden sm:flex flex-col items-end">
                            <span className="text-xs font-bold leading-tight">us-west-1</span>
                            <span className="text-[9px] tracking-widest text-green-500 font-dev text-transform-tertiary mt-0.5 flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Healthy
                            </span>
                        </div>
                    </div>
                </div>

                {/* Table Content */}
                <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0">
                    <ListTable
                        initialItems={MAPPED_DATA}
                        filters={filters}
                        onFilterChange={setFilters}
                        onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
                        isFilterActive={inspectorState === 'expanded'}
                        columns={columns}
                    />
                </div>
            </div>

            {/* Fake Inspector Drawer */}
            {rightDrawerContent}
        </div>
    );

    const inspectorContent = (
        <div className="flex flex-col gap-0 w-full min-w-[320px] px-4 pt-4">
            <Accordion type="single" collapsible variant="navigation" value={inspectorState === 'expanded' ? "item-1" : ""} onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }} className="bg-transparent w-full space-y-2">
                <AccordionItem value="item-1" className="border-none m-0">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                        <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                            <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                            <span className="truncate">FILTERS</span>
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
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                {/* True Side Navigation */}
                <SideNav />

                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    {/* True Main Header */}
                    <ThemeHeader
                        title="SYSTEM LOGS ASSEMBLY"
                        breadcrumb="zap design engine / metro / layout"
                        badge="component sandbox"
                        showBackground={false}
                    />

                    <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0 bg-layer-base">
                        <ListTable
                            initialItems={MAPPED_DATA}
                            filters={filters}
                            onFilterChange={setFilters}
                            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
                            isFilterActive={inspectorState === 'expanded'}
                            columns={columns}
                        />
                    </div>
                </div>

                {/* True Inspector Drawer */}
                {rightDrawerContent}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="system logs"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/SystemLogsTemplate.tsx"
            importPath="@/genesis/templates/tables/SystemLogsTemplate"
            inspectorControls={inspectorContent}
            hideDataTerminal={true}
            fullWidth={true}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="System Logs // Datagrid"
                    fullScreenHref={`/design/${activeTheme}/organisms/system-logs-layout?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
