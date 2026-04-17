import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { ListTable, SAMPLE_DATA, ListItem, Filters } from '../../../zap/organisms/list-table';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '../../atoms/status/pills';
import { ChevronDown, ChevronRight, Plus, Map } from "lucide-react";
import { motion } from "framer-motion";
import { QuickActionsDropdown } from '../../molecules/quick-actions-dropdown';
import { Pencil, Copy, Archive, Trash2 } from 'lucide-react';
import { DataFilter, FilterGroup } from '../../molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../molecules/accordion';
import { Icon } from '../../atoms/icons/Icon';
import { SideNav } from '../../molecules/navigation/SideNav';
import { ThemeHeader } from '../../molecules/layout/ThemeHeader';
import { Inspector } from '../../../zap/layout/Inspector';
import ProductCreateTemplate from '../forms/ProductCreateTemplate';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Checkbox } from '../../atoms/interactive/checkbox';
import { Text } from '../../atoms/typography/text';
import { ListEmpty } from '@/zap/organisms/list-empty';
/**
 * Product List (Layout) Showcase
 * Renders ListTable inside the L6 CanvasDesktop layout
 * Route: /design/[theme]/organisms/product-list
 */
export default function ProductListTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    const [isCreating, setIsCreating] = useState(false);

    const [filters, setFilters] = useState<Filters>({
        category: [],
        productType: [],
        status: [],
    });

    const columns = React.useMemo<ColumnDef<ListItem>[]>(() => [
        {
            id: "expander",
            name: "Expander",
            header: () => <div className="w-10" />,
            cell: ({ row }) => (
                <div
                    className="w-10 py-2.5 flex items-center justify-center"
                    style={{ paddingLeft: row.depth > 0 ? `${row.depth * 16 + 4}px` : undefined }}
                >
                    {row.getCanExpand() ? (
                        <motion.div
                            animate={{ rotate: row.getIsExpanded() ? 90 : 0 }}
                            transition={{ duration: 0.2 }}
                            className="flex-shrink-0 w-4 cursor-pointer inline-flex"
                            onClick={(e) => { e.stopPropagation(); row.toggleExpanded(); }}
                        >
                            <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                    ) : (
                        <div className="w-4" />
                    )}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "select",
            name: "Select",
            header: ({ table }) => (
                <div className="w-10 text-center">
                    <Checkbox
                        checked={
                            table.getIsAllPageRowsSelected() ||
                            (table.getIsSomePageRowsSelected() && "indeterminate")
                        }
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                        className="translate-y-0.5 inline-flex"
                    /></div>
            ),
            cell: ({ row }) => (
                <div className="w-10 text-center">
                    {row.depth === 0 && (
                        <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) => row.toggleSelected(!!value)}
                            aria-label="Select row"
                            className="translate-y-0.5 inline-flex"
                        />
                    )}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "id",
            name: "ID",
            header: ({ column }) => (
                <div
                    className="w-20 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold  text-center'>ID</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-20 py-2.5 text-center truncate">
                    {row.depth === 0 && (
                        (row.original.id || '').split('-')[1] || row.original.id
                    )}
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "variant_name",
            name: "Product Name",
            header: ({ column }) => (
                <div
                    className="w-72 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>
                        Product Name
                    </Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-72 py-2.5 text-left" style={{ paddingLeft: row.depth > 0 ? `${row.depth * 1}rem` : undefined }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar src={row.original.media_url}
                                className="w-full h-full object-cover border-[1px] border-border"
                                initials={row.original.variant_name?.split(' ').map(n => n[0]).join('')}
                                size="sm"
                                fallback={row.original.variant_name?.split(' ').map(n => n[0]).join('')}
                            />
                        </div>
                        <div className="flex flex-col min-w-0 flex flex-col gap-2">
                            <Text size='label-small' className='font-semibold truncate'>{row.original.variant_name}</Text>
                            {/* <Text size='label-small' className='truncate'>SKU: {row.original.sku_code}</Text> */}
                        </div>
                    </div>
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            accessorKey: "sku_code",
            name: "SKU",
            header: () => (
                <div className="w-32 text-left tracking-widest">
                    <Text size='label-small' className='font-semibold'>SKU</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='label-small' className="w-32 font-mono text-muted-foreground truncate py-2.5">
                    {row.original.sku_code}
                </Text>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "category_id",
            name: "Category",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>
                        Category
                    </Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='label-small' className="w-32 truncate text-left py-2.5">
                    {row.original.category_id}
                </Text>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "sale_price",
            name: "Price",
            header: ({ column }) => (
                <div
                    className="w-28 text-right pr-4 tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>
                        Price
                    </Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-28 text-right py-2.5 pr-4">
                    <Text size='label-small'>${row.original.sale_price?.toFixed(2)}</Text>
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "warehouse_id",
            name: "Locations",
            header: ({ column }) => (
                <div
                    className="w-28 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Locations</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='label-small' className="w-28 truncate text-left py-2.5 text-muted-foreground">
                    {row.original.warehouse_id}
                </Text>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "qty_on_hand",
            name: "Stock",
            header: ({ column }) => (
                <div
                    className="w-24 text-right pr-4 tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Stock</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 text-right py-2.5 pr-4">
                    <Text size='label-small' className={row.original.qty_on_hand === 0 ? 'text-destructive font-bold' : ''}>
                        {row.original.qty_on_hand}
                    </Text>
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "uom_id",
            name: "Unit",
            header: () => (
                <div className="w-20 text-left tracking-widest">
                    <Text size='label-small' className='font-semibold'>Unit</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='label-small' className="w-20 truncate text-left py-2.5 text-muted-foreground">
                    {row.original.uom_id}
                </Text>
            ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "barcode",
            name: "Barcode",
            header: () => (
                <div className="w-32 text-left tracking-widest">
                    <Text size='label-small' className='font-semibold'>Barcode</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='label-small' className="w-32 font-mono text-muted-foreground truncate py-2.5">
                    {row.original.barcode}
                </Text>
            ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "product_type",
            name: "Type",
            header: () => <div className="w-28 text-left tracking-widest"><Text size='label-small' className='font-semibold'>Type</Text></div>,
            cell: ({ row }) => (
                <div className="w-28 py-2.5">
                    <Pill variant="neutral" className="w-fit px-1.5 py-0.5 text-[10px]">
                        {row.original.product_type}
                    </Pill>
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "status_id",
            name: "Status",
            header: ({ column }) => (
                <div
                    className="w-32 text-right tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>
                        Status
                    </Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5">
                    <Pill
                        variant={row.original.status_id === 'Active' ? 'success' : 'warning'}
                        className="whitespace-nowrap w-fit ml-auto"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                        {row.original.status_id}
                    </Pill>
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "actions",
            name: "Actions",
            header: () => <div className="w-24 pr-7" />,
            cell: ({ row }) => (
                <div className="w-24 pr-7 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end">
                        <QuickActionsDropdown
                            label={row.original.variant_name}
                            actions={[
                                { label: 'Edit', icon: Pencil, onClick: () => { } },
                                { label: 'Duplicate', icon: Copy, onClick: () => { } },
                                { label: 'Archive', icon: Archive, onClick: () => { } },
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

    // Derive filter groups from the SAMPLE_DATA
    const baseGroups: FilterGroup[] = [
        {
            id: 'category',
            title: 'Category',
            options: Array.from(new Set(SAMPLE_DATA.map(p => p.category_id).filter(Boolean))).map(cat => ({
                id: cat as string,
                label: cat as string,
            }))
        },
        {
            id: 'productType',
            title: 'Product Type',
            options: Array.from(new Set(SAMPLE_DATA.map(p => p.product_type).filter(Boolean))).map(type => ({
                id: type as string,
                label: type as string,
            }))
        },
        {
            id: 'status',
            title: 'Status',
            options: Array.from(new Set(SAMPLE_DATA.map(p => p.status_id).filter(Boolean))).map(status => ({
                id: status as string,
                label: status as string,
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
            <Inspector title="E-COMMERCE LAB" width={320}>
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
                    <div className="px-3 py-2.5 rounded-md text-on-surface hover:bg-surface-variant/40 flex items-center gap-3 text-sm cursor-pointer transition-colors">
                        <Icon name="list_alt" size={18} className="shrink-0 text-on-surface-variant" />
                        <span className="font-medium">System Logs</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 text-sm cursor-pointer border border-primary/20 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md"></div>
                        <Icon name="inventory-2" size={18} className="shrink-0" />
                        <span className="font-medium">Product List</span>
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
                        <button title="Menu" aria-label="Menu" className="md:hidden mr-2 -ml-2 shrink-0 p-2 hover:bg-surface-variant rounded-md transition-colors text-on-surface-variant">
                            <Icon name="menu" size={20} />
                        </button>
                        <div className="flex items-center text-xs lg:text-sm">
                            <span className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Catalog</span>
                            <Icon name="chevron_right" size={16} className="text-on-surface-variant/50 mx-1 shrink-0" />
                            <span className="font-medium text-on-surface">Product List</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button title="Notifications" aria-label="Notifications" className="relative w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors text-on-surface-variant">
                            <Icon name="notifications" size={18} />
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
                <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    <ListTable
                        initialItems={SAMPLE_DATA}
                        filters={filters}
                        onFilterChange={setFilters}
                        onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
                        isFilterActive={inspectorState === 'expanded'}
                        columns={columns}
                        onAddClick={() => setIsCreating(true)}
                        defaultColumnVisibility={{ id: false, sku_code: false, uom_id: false, barcode: false, category_id: false }}
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

    if (isCreating) {
        return <ProductCreateTemplate onCancel={() => setIsCreating(false)} />;
    }

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                {/* True Side Navigation */}
                <SideNav />

                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    {/* True Main Header */}
                    <ThemeHeader
                        title="products"
                        breadcrumb="zap design engine / metro / layout"
                        //badge="component sandbox"
                        showBackground={false}
                    />

                    <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        <ListTable
                            initialItems={SAMPLE_DATA}
                            filters={filters}
                            onFilterChange={setFilters}
                            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
                            isFilterActive={inspectorState === 'expanded'}
                            columns={columns}
                            onAddClick={() => setIsCreating(true)}
                            defaultColumnVisibility={{ id: false, sku_code: false, uom_id: false, barcode: false, category_id: false }}
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
            componentName="product list"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/ProductListTemplate.tsx"
            importPath="@/genesis/templates/tables/ProductListTemplate"
            inspectorControls={inspectorContent}
            hideDataTerminal={true}
            fullWidth={true}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Product List // Catalog"
                    fullScreenHref={`/design/${activeTheme}/organisms/product-list?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
