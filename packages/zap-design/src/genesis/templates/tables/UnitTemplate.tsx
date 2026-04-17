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

export interface Unit {
    id: string;
    name: string;
    abbreviation: string;
    type: string;
    base_unit: string;
    conversion_factor: number;
    status: string;
}

const SAMPLE_UNITS: Unit[] = [
    { id: "UOM-001", name: "Piece",        abbreviation: "pc",   type: "Count",   base_unit: "Piece",     conversion_factor: 1,      status: "Active"   },
    { id: "UOM-002", name: "Dozen",        abbreviation: "dz",   type: "Count",   base_unit: "Piece",     conversion_factor: 12,     status: "Active"   },
    { id: "UOM-003", name: "Kilogram",     abbreviation: "kg",   type: "Weight",  base_unit: "Gram",      conversion_factor: 1000,   status: "Active"   },
    { id: "UOM-004", name: "Gram",         abbreviation: "g",    type: "Weight",  base_unit: "Gram",      conversion_factor: 1,      status: "Active"   },
    { id: "UOM-005", name: "Pound",        abbreviation: "lb",   type: "Weight",  base_unit: "Gram",      conversion_factor: 453.59, status: "Active"   },
    { id: "UOM-006", name: "Liter",        abbreviation: "L",    type: "Volume",  base_unit: "Milliliter",conversion_factor: 1000,   status: "Active"   },
    { id: "UOM-007", name: "Milliliter",   abbreviation: "mL",   type: "Volume",  base_unit: "Milliliter",conversion_factor: 1,      status: "Active"   },
    { id: "UOM-008", name: "Hour",         abbreviation: "hr",   type: "Time",    base_unit: "Minute",    conversion_factor: 60,     status: "Active"   },
    { id: "UOM-009", name: "Minute",       abbreviation: "min",  type: "Time",    base_unit: "Minute",    conversion_factor: 1,      status: "Active"   },
    { id: "UOM-010", name: "Box",          abbreviation: "box",  type: "Package", base_unit: "Piece",     conversion_factor: 24,     status: "Active"   },
    { id: "UOM-011", name: "Pallet",       abbreviation: "plt",  type: "Package", base_unit: "Piece",     conversion_factor: 480,    status: "Hidden"   },
    { id: "UOM-012", name: "Square Meter", abbreviation: "m²",   type: "Area",    base_unit: "Square Meter", conversion_factor: 1,  status: "Active"   },
];

/**
 * Unit of Measure Template
 * Route: /design/[theme]/organisms/units
 */
export default function UnitTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // Map Units to generic ListItem
    const MAPPED_DATA: ListItem[] = SAMPLE_UNITS.map(unit => ({
        id: unit.id,
        media_url: '',
        variant_name: unit.name,
        sku_code: unit.abbreviation,
        barcode: `×${unit.conversion_factor}`,
        category_id: unit.type,
        product_type: unit.base_unit,
        sale_price: unit.conversion_factor,
        qty_on_hand: unit.conversion_factor,
        uom_id: unit.abbreviation,
        warehouse_id: unit.type,
        status_id: unit.status,
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
                    Unit Name
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex flex-col min-w-0">
                        <span className="font-semibold text-foreground text-sm truncate uppercase tracking-tight">{row.original.variant_name}</span>
                        <span className="font-dev font-normal text-xs text-muted-foreground uppercase tracking-wide truncate mt-0.5 opacity-70">Internal ID: {row.original.id}</span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "uom_id",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Abbr
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 truncate text-muted-foreground text-left py-2.5 font-dev font-bold">
                    {row.original.uom_id}
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
                    Type
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
            header: () => <div className="w-28 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">Base Unit</div>,
            cell: ({ row }) => (
                <div className="w-28 py-2.5 font-dev text-[11px] opacity-70">
                    {row.original.product_type}
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
                    Factor
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5 pr-4 flex items-center justify-end gap-1">
                    <span className="text-[10px] opacity-40">×</span>
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
        addItem: "Add Unit",
        itemName: "Unit Name",
        itemCode: "Abbreviation",
        category: "Type",
        type: "Base Unit",
        inventory: "Factor",
        price: "Internal ID",
    };

    const baseGroups: FilterGroup[] = [
        {
            id: 'category',
            title: 'Unit Type',
            options: Array.from(new Set(MAPPED_DATA.map(u => u.category_id).filter(Boolean))).map(type => ({
                id: type as string,
                label: type as string,
            })),
        },
        {
            id: 'productType',
            title: 'Base Unit',
            options: Array.from(new Set(MAPPED_DATA.map(u => u.product_type).filter(Boolean))).map(base => ({
                id: base as string,
                label: base as string,
            })),
        },
        {
            id: 'status',
            title: 'Visibility',
            options: Array.from(new Set(MAPPED_DATA.map(u => u.status_id).filter(Boolean))).map(status => ({
                id: status as string,
                label: status as string,
            })),
        },
    ];

    const filterGroups = baseGroups.map(group => ({
        ...group,
        options: group.options.map(opt => ({
            ...opt,
            selected: filters[group.id as keyof Filters]?.includes(opt.id),
        })),
    }));

    const handleFilterToggle = (groupId: string, optionId: string) => {
        setFilters(current => {
            const currentList = current[groupId as keyof Filters] || [];
            const updatedList = currentList.includes(optionId)
                ? currentList.filter(id => id !== optionId)
                : [...currentList, optionId];
            return { ...current, [groupId as keyof Filters]: updatedList };
        });
    };

    const tableComponent = (
        <ListTable
            initialItems={MAPPED_DATA}
            filters={filters}
            onFilterChange={setFilters}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            labels={labels}
            columns={columns} // Use custom columns
        />
    );

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="UNIT LAB" width={320}>
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
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer opacity-100">
                        <Icon name="straighten" size={18} />
                        <span>Units</span>
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
                        <span className="font-bold text-on-surface uppercase tracking-widest">Units of Measure</span>
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
                    <ThemeHeader title="UNIT ASSEMBLY" badge="data grid" />
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
            componentName="units"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/UnitTemplate.tsx"
            importPath="@/genesis/templates/tables/UnitTemplate"
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
                    title="Units of Measure // Catalog"
                    fullScreenHref={`/design/${activeTheme}/organisms/units?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
