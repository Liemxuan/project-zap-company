import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { ListTable, SAMPLE_DATA, ListItem, Filters } from '../../../zap/organisms/list-table';
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
import { ProductImage } from '@/genesis/atoms/data-display/ProductImage';

/**
 * Reusable Filter Panel component to reduce duplication
 */
function FilterPanel({ filterGroups, onToggle }: { filterGroups: FilterGroup[], onToggle: (groupId: string, optionId: string) => void }) {
  return (
    <Accordion type="single" collapsible variant="navigation" defaultValue="item-1" className="bg-transparent w-full space-y-2">
      <AccordionItem value="item-1" className="border-none m-0">
        <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
          <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
            <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
            <span className="truncate">FILTERS</span>
          </div>
        </AccordionTrigger>
        <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
          <DataFilter title="" groups={filterGroups} onToggle={onToggle} />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

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
                    Product Name
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        <ProductImage src={row.original.media_url} alt={row.original.variant_name} className="w-10 h-10 object-cover rounded-md border-[1.5px] border-border shrink-0 bg-surface-variant" />
                        <div className="flex flex-col min-w-0">
                            <span className="font-semibold text-foreground text-sm truncate uppercase tracking-tight">{row.original.variant_name}</span>
                            <span className="font-dev font-normal text-xs text-muted-foreground uppercase tracking-wide truncate mt-0.5 opacity-70">SKU: {row.original.sku_code}</span>
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
                    Category
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 truncate text-muted-foreground text-left py-2.5">
                    {row.original.category_id}
                </div>
            ),
        },
        {
            accessorKey: "product_type",
            header: () => <div className="w-28 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Type</div>,
            cell: ({ row }) => (
                <div className="w-28 py-2.5">
                    <Pill variant="neutral" className="w-fit px-1.5 py-0.5 text-[10px]">
                        {row.original.product_type}
                    </Pill>
                </div>
            ),
        },
        {
            accessorKey: "sale_price",
            header: ({ column }) => (
                <div
                    className="w-32 text-right pr-4 font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5 pr-4">
                    <span className="font-bold text-foreground font-mono text-sm">${row.original.sale_price.toFixed(2)}</span>
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

    // Derive filter groups from the SAMPLE_DATA
    const baseGroups: FilterGroup[] = [
        {
            id: 'category',
            title: 'Category',
            options: Array.from(new Set(SAMPLE_DATA.map(p => p.category_id))).map(cat => ({
                id: cat,
                label: cat,
            }))
        },
        {
            id: 'productType',
            title: 'Product Type',
            options: Array.from(new Set(SAMPLE_DATA.map(p => p.product_type))).map(type => ({
                id: type,
                label: type,
            }))
        },
        {
            id: 'status',
            title: 'Status',
            options: Array.from(new Set(SAMPLE_DATA.map(p => p.status_id))).map(status => ({
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
            <Inspector title="E-COMMERCE LAB" width={320}>
                <div className="flex flex-col gap-0 w-full px-4 pt-4">
                    <FilterPanel filterGroups={filterGroups} onToggle={handleFilterToggle} />
                </div>
            </Inspector>
        </div>
    );

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border">
            {/* Sidebar Navigation */}
            <aside className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <Icon name="bolt" size={14} className="text-primary-foreground" />
                    </div>
                    <span className="font-bold text-sm tracking-widest font-display text-transform-primary text-on-surface">ZAP OS</span>
                </div>
                <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    {[
                        { icon: 'dashboard', label: 'Overview' },
                        { icon: 'list_alt', label: 'System Logs' },
                        { icon: 'inventory-2', label: 'Product List', active: true },
                        { icon: 'settings', label: 'Configuration' },
                    ].map((item) => (
                        <div
                            key={item.label}
                            className={`px-3 py-2.5 rounded-md flex items-center gap-3 text-sm cursor-pointer transition-colors relative ${
                                item.active
                                    ? 'bg-primary/10 text-primary border border-primary/20'
                                    : 'text-on-surface hover:bg-surface-variant/40'
                            }`}
                        >
                            {item.active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md"></div>}
                            <Icon name={item.icon} size={18} className={`shrink-0 ${item.active ? '' : 'text-on-surface-variant'}`} />
                            <span className="font-medium">{item.label}</span>
                        </div>
                    ))}
                </nav>
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
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                {/* Header */}
                <header className="h-14 border-b border-border bg-layer-base flex items-center px-4 lg:px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center gap-2 min-w-0">
                        <button title="Menu" aria-label="Menu" className="md:hidden shrink-0 p-2 hover:bg-surface-variant rounded-md transition-colors text-on-surface-variant">
                            <Icon name="menu" size={20} />
                        </button>
                        <nav className="flex items-center gap-1 text-xs lg:text-sm min-w-0">
                            <span className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors truncate">Catalog</span>
                            <Icon name="chevron_right" size={16} className="text-on-surface-variant/50 shrink-0" />
                            <span className="font-medium text-on-surface truncate">Product List</span>
                        </nav>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4 shrink-0">
                        <button title="Notifications" aria-label="Notifications" className="relative w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors text-on-surface-variant">
                            <Icon name="notifications" size={18} />
                        </button>
                        <div className="h-6 w-px bg-border hidden sm:block" />
                        <div className="hidden sm:flex flex-col items-end gap-0.5">
                            <span className="text-xs font-bold leading-tight">us-west-1</span>
                            <span className="text-[9px] tracking-widest text-green-500 font-dev text-transform-tertiary flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                                Healthy
                            </span>
                        </div>
                    </div>
                </header>

                {/* Table Content */}
                <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    <ListTable
                        initialItems={SAMPLE_DATA}

                        filters={filters}
                        onFilterChange={setFilters}
                        onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
                        isFilterActive={inspectorState === 'expanded'}
                        columns={columns}
                    />
                </div>
            </div>

            {/* Inspector Drawer */}
            {rightDrawerContent}
        </div>
    );

    const inspectorContent = (
        <div className="flex flex-col gap-0 w-full min-w-[320px] px-4 pt-4">
            <FilterPanel filterGroups={filterGroups} onToggle={handleFilterToggle} />
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader
                        title="PRODUCT LIST ASSEMBLY"
                        breadcrumb="zap design engine / metro / layout"
                        badge="component sandbox"
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
                        />
                    </div>
                </div>
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
