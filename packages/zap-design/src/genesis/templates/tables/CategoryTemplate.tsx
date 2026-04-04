import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { ListTable, ListItem, Filters } from '../../../zap/organisms/list-table';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '../../atoms/status/pills';
import { Button } from '../../atoms/interactive/button';
import { ChevronDown, MoreHorizontal } from "lucide-react";
import { motion } from "framer-motion";
import { DataFilter, FilterGroup } from '../../molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../molecules/accordion';
import { Icon } from '../../atoms/icons/Icon';
import { SideNav } from '../../molecules/navigation/SideNav';
import { ThemeHeader } from '../../molecules/layout/ThemeHeader';
import { Inspector } from '../../../zap/layout/Inspector';

export interface Category {
    id: string;
    media_url: string;
    name: string;
    slug: string;
    parent: string;
    item_count: number;
    status: string;
}

const SAMPLE_CATEGORIES: Category[] = [
    { id: "CAT-001", name: "Iphone 16 Series", slug: "/iphone-16", parent: "Electronics", item_count: 54, media_url: "https://images.unsplash.com/photo-1616348436168-de43ad0db179?q=80&w=256&h=256&auto=format&fit=crop", status: "Active" },
    { id: "CAT-002", name: "Samsung S24 Series", slug: "/samsung-s24", parent: "Electronics", item_count: 32, media_url: "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?q=80&w=256&h=256&auto=format&fit=crop", status: "Active" },
    { id: "CAT-003", name: "Office Furniture", slug: "/office-furniture", parent: "Furniture", item_count: 12, media_url: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?q=80&w=256&h=256&auto=format&fit=crop", status: "Hidden" },
    { id: "CAT-004", name: "Cloud Services", slug: "/cloud-services", parent: "Software", item_count: 7, media_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=256&h=256&auto=format&fit=crop", status: "Active" },
    { id: "CAT-005", name: "Home Audio", slug: "/home-audio", parent: "Electronics", item_count: 24, media_url: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?q=80&w=256&h=256&auto=format&fit=crop", status: "Active" },
];

/**
 * Category Template
 * Route: /design/[theme]/organisms/categories
 */
export default function CategoryTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // Map Categories to generic ListItem
    const MAPPED_DATA: ListItem[] = SAMPLE_CATEGORIES.map(cat => ({
        id: cat.id,
        media_url: cat.media_url,
        variant_name: cat.name,
        sku_code: cat.slug,
        barcode: cat.parent,
        category_id: cat.parent,
        product_type: cat.status,
        sale_price: 0,
        qty_on_hand: cat.item_count,
        uom_id: "Items",
        warehouse_id: "Root Catalog",
        status_id: cat.status
    }));

    const [filters, setFilters] = useState<Filters>({
        category: [],
        productType: [],
        status: [],
    });

    const columns = React.useMemo<ColumnDef<ListItem>[]>(() => [
        {
            id: "expander",
            header: () => <div className="w-12 px-7" />,
            cell: ({ row }) => (
                <div className="px-7 w-12 py-2.5">
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
            accessorKey: "variant_name",
            header: ({ column }) => (
                <div
                    className="w-80 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Category Name
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        <img src={row.original.media_url} alt={row.original.variant_name} className="w-10 h-10 object-cover rounded-full border-[1.5px] border-border shrink-0" />
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground text-sm truncate">{row.original.variant_name}</span>
                            <span className="font-dev font-normal text-xs text-muted-foreground uppercase tracking-wide truncate mt-0.5">{row.original.sku_code}</span>
                        </div>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "category_id",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Parent
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 truncate text-muted-foreground text-left py-2.5">
                    {row.original.category_id}
                </div>
            ),
        },
        {
            accessorKey: "qty_on_hand",
            header: ({ column }) => (
                <div
                    className="w-32 text-right pr-4 font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Items
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5 pr-4">
                    <span className="font-bold text-foreground">{row.original.qty_on_hand}</span>
                </div>
            ),
        },
        {
            accessorKey: "status_id",
            header: ({ column }) => (
                <div
                    className="w-32 text-right font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
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
        },
        {
            id: "actions",
            header: () => <div className="w-24 pr-7" />,
            cell: () => (
                <div className="w-24 pr-7 py-2.5 text-right">
                    <div className="flex items-center justify-end text-muted-foreground">
                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            ),
        },
    ], []);

    const labels = {
        addItem: "Add Category",
        itemName: "Category Name",
        itemCode: "Slug",
        category: "Parent",
        type: "Status",
        inventory: "Items",
        price: "Internal ID"
    };

    const baseGroups: FilterGroup[] = [
        {
            id: 'category',
            title: 'Parent Category',
            options: Array.from(new Set(MAPPED_DATA.map(p => p.category_id))).map(parent => ({
                id: parent,
                label: parent,
            }))
        },
        {
            id: 'productType',
            title: 'Status',
            options: Array.from(new Set(MAPPED_DATA.map(p => p.product_type))).map(status => ({
                id: status,
                label: status,
            }))
        },
        {
            id: 'status',
            title: 'Visibility',
            options: Array.from(new Set(MAPPED_DATA.map(p => p.status_id))).map(status => ({
                id: status,
                label: status,
            }))
        }
    ];

    const filterGroups = baseGroups.map(group => ({
        ...group,
        options: group.options.map(opt => ({
            ...opt,
            selected: filters[group.id as keyof Filters]?.includes(opt.id)
        }))
    }));

    const handleFilterToggle = (groupId: string, optionId: string) => {
        setFilters(current => {
            const currentList = current[groupId as keyof Filters] || [];
            const updatedList = currentList.includes(optionId)
                ? currentList.filter(id => id !== optionId)
                : [...currentList, optionId];
            return {
                ...current,
                [groupId as keyof Filters]: updatedList
            };
        });
    };

    const tableComponent = (
        <ListTable
            initialItems={MAPPED_DATA}
            filters={filters}
            onFilterChange={setFilters}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            //labels={labels}
            columns={columns}
        />
    );

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="CATEGORY LAB" width={320}>
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
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border">
            {/* Nav */}
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
                        <Icon name="category" size={18} />
                        <span>Categories</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                        <Icon name="inventory" size={18} />
                        <span>Products</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">Catalog</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">Categories</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {tableComponent}
                </div>
            </div>

            {/* Side Drawer Filter */}
            {rightDrawerContent}
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title="CATEGORY ASSEMBLY" badge="data grid" />
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
            componentName="categories"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/CategoryTemplate.tsx"
            importPath="@/genesis/templates/tables/CategoryTemplate"
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
                    title="Categories // Collection"
                    fullScreenHref={`/design/${activeTheme}/organisms/categories?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
