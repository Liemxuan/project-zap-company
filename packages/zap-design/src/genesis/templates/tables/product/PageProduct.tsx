import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable, ListItem } from '@/zap/organisms/list-table';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { ChevronRight, Pencil, Copy, Archive, Trash2, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { FilterGroup, DataFilter } from '@/genesis/molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Inspector } from '@/zap/layout/Inspector';
import ProductCreateTemplate from '../../forms/ProductCreateTemplate';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { Text } from '@/genesis/atoms/typography/text';
import { useProducts } from '@/hooks/product/use-products';
import { Product } from '@/services/product/product.model';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/genesis/molecules/dropdown-menu';
import { Download, Upload } from 'lucide-react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/genesis/atoms/interactive/buttons';


/**
 * Product List (Layout) Showcase
 * Renders ListTable inside the L6 CanvasDesktop layout
 * Route: /design/[theme]/organisms/product-list
 */
export default function PageProductListTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    const [isCreating, setIsCreating] = useState(false);

    // --- Data Fetching ---
    const {
        products,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useProducts({
        pageSize: 10
    });

    // --- Data Mapping ---
    const mapProductToListItem = (p: Product): ListItem => ({
        id: p.id,
        variant_name: p.name || 'Unnamed Product',
        media_url: p.image,
        sku_code: p.sku,
        barcode: p.barcode,
        category_id: p.cate_name,
        product_type: p.productType || 'PHYSICAL',
        sale_price: p.price || 0,
        qty_on_hand: p.stock || 0,
        uom_id: p.unit,
        warehouse_id: p.location,
        status_id: p.status === 1 || p.status === 'Active' ? 'Active' : 'Inactive',
        subRows: p.subRows ? p.subRows.map(mapProductToListItem) : undefined,
    });

    const MAPPED_PRODUCTS = useMemo(() => products.map(mapProductToListItem), [products]);

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
            id: "id",
            header: ({ column }) => (
                <div
                    className="w-20 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate uppercase">ID</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-20 truncate text-left py-2.5 font-dev text-transform-tertiary text-muted-foreground">
                    {row.original.id}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "variant_name",
            name: "Name",
            header: ({ column }) => (
                <div
                    className="w-72 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>
                        Name
                    </Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-72 py-2.5 text-left" style={{ paddingLeft: row.depth > 0 ? `${row.depth * 1}rem` : undefined }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar src={row.original.media_url}
                                className="w-full h-full object-cover border-[1px] border-border"
                                initials={(row.original.variant_name || 'P').split(' ').map(n => n[0]).join('')}
                                size="sm"
                                fallback={(row.original.variant_name || 'P').split(' ').map(n => n[0]).join('')}
                            />
                        </div>
                        <div className="flex flex-col min-w-0 gap-2">
                            <Text size='label-small' className='font-semibold truncate'>{row.original.variant_name}</Text>
                            <Text size='label-small' className='truncate'>{row.original.sku_code}</Text>
                        </div>
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
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
                <div className="w-32 truncate text-left py-2.5">
                    <Text size='label-small'>{row.original.category_id}</Text>
                </div>
            ),
            enableSorting: false,
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
                    <Text size='label-small'>${(row.original.sale_price || 0).toFixed(2)}</Text>
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            accessorKey: "warehouse_id",
            name: "Location",
            header: ({ column }) => (
                <div
                    className="w-28 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Location</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-28 truncate text-left py-2.5 text-muted-foreground">
                    <Text size='label-small'>{row.original.warehouse_id}</Text>
                </div>
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
                <div className="w-20 truncate text-left py-2.5 text-muted-foreground">
                    <Text size='label-small'>{row.original.uom_id}</Text>
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: "barcode",
            name: "Barcode",
            header: () => (
                <div className="w-32 text-left tracking-widest">
                    <Text size='label-small' className='font-semibold'>Barcode</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 font-mono text-muted-foreground truncate py-2.5">
                    <Text size='label-small'>{row.original.barcode}</Text>
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            accessorKey: "product_type",
            name: "Product type",
            header: () => <div className="w-28 text-left tracking-widest"><Text size='label-small' className='font-semibold'>Type</Text></div>,
            cell: ({ row }) => (
                <div className="w-28 py-2.5 text-left">
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
                    className="w-20 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>
                        Status
                    </Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-20 text-left py-2.5">
                    <Pill
                        variant={row.original.status_id === 'Active' ? 'success' : 'warning'}
                        className="whitespace-nowrap w-fit mr-auto"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                        {row.original.status_id}
                    </Pill>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
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

    const labels = {
        addItem: "Add Product",
        itemName: "Product Name",
        type: "Status"
    };

    const filterGroups: FilterGroup[] = [
        {
            id: 'status',
            title: 'Status',
            options: [
                { id: '1', label: 'Active', selected: String(apiFilters.status) === '1' || apiFilters.status === 'Active' },
                { id: '0', label: 'Inactive', selected: String(apiFilters.status) === '0' || apiFilters.status === 'Inactive' },
            ]
        }
    ];

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'status') {
            const currentStatus = String(apiFilters.status);
            const nextStatus = currentStatus === optionId ? null : (isNaN(Number(optionId)) ? optionId : Number(optionId));
            handleFilterChange({ status: nextStatus as any });
        }
    };
    const actionDropdown = (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="primary" className="h-[var(--input-height,var(--button-height,48px))] px-6">
                    <span className="font-display font-medium text-xs text-transform-primary">Actions</span>
                    <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Upload className="h-4 w-4" />
                    <span className="font-display text-xs text-transform-primary">Import</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2 cursor-pointer">
                    <Download className="h-4 w-4" />
                    <span className="font-display text-xs text-transform-primary">Export</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
    const tableComponent = (
        <ListTable
            initialItems={MAPPED_PRODUCTS}
            isLoading={isLoading}
            onSearch={handleSearch}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(p) => handlePageChange(p + 1)}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            columns={columns}
            onAddClick={() => setIsCreating(true)}
            labels={labels}
            defaultColumnVisibility={{ stock: false, uom_id: false, barcode: false, product_type: false }} //mặc định ẩn hiện cột
            extraActions={actionDropdown}// nut action
        />
    );

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="E-COMMERCE LAB" width={320}>
                <div className="flex flex-col gap-0 w-full px-4 pt-4">
                    <Accordion type="single" collapsible variant="navigation" value={inspectorState === 'expanded' ? "item-1" : ""} onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }} className="bg-transparent w-full space-y-2">
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
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border">
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <Icon name="bolt" size={14} className="text-primary-foreground" />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-transform-primary text-on-surface uppercase">ZAP OS</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="dashboard" size={18} />
                        <span>Overview</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                        <Icon name="inventory-2" size={18} />
                        <span>Product List</span>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">Catalog</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">Product List</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {tableComponent}
                </div>
            </div>
        </div>
    );

    if (isCreating) {
        return <ProductCreateTemplate onCancel={() => setIsCreating(false)} />;
    }

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title="Products" badge={null} />
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
            componentName="Product list"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/product/PageProduct.tsx"
            importPath="@/genesis/templates/tables/product/PageProduct"
            inspectorControls={
                <div className="flex flex-col gap-0 w-full min-w-[320px] px-4 pt-4">
                    <Accordion type="single" collapsible variant="navigation" value={inspectorState === 'expanded' ? "item-1" : ""} onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }} className="bg-transparent w-full space-y-2">
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
