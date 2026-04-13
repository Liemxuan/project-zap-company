import React, { useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable } from '@/zap/organisms/list-table';
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
import { useBrands } from '@/hooks/brand/use-brands';
import { AvatarFallback, AvatarImage } from '@/genesis/atoms/interactive/avatar';
import { Text } from '@/genesis/atoms/typography/text';
/**
 * Brand Template
 */
export default function PageBrandTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    // --- Data Fetching ---
    const {
        brands,
        isLoading,
        pagination,
        handlePageChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters
    } = useBrands({
        pageSize: 10
    });

    // --- Data Mapping ---
    const MAPPED_BRANDS = useMemo(() => brands.map(brand => ({
        ...brand,
        id: brand.id,
        name: brand.name,
        media_url: brand.logo_url,
        is_active: brand.status_id === 1
    })), [brands]);

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
            id: "BrandId",
            accessorKey: "id",
            header: ({ column }) => (
                <div
                    className="w-24 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    ID
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
                    {row.original.id}
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            id: "BrandName",
            accessorKey: "name",
            header: ({ column }) => (
                <div
                    className="w-80 text-left cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-medium' className='font-semibold'>Name</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-72 py-2.5 text-left" style={{ paddingLeft: row.depth > 0 ? `${row.depth * 1}rem` : undefined }}>
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar src={row.original.media_url}
                                className="w-full h-full object-cover border-[1px] border-border"
                                initials={(row.original.name || 'B').split(' ').map((n: string) => n[0]).join('')}
                                size="sm"
                                fallback={(row.original.name || 'B').split(' ').map((n: string) => n[0]).join('')}
                            />
                        </div>
                        <div className="flex flex-col min-w-0 gap-2">
                            <Text size='label-small' className='font-semibold truncate'>{row.original.name}</Text>
                            <Text size='label-small' className='truncate'>{row.original.reference_id}</Text>
                        </div>
                    </div>
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            id: "ApplyItem",
            accessorKey: "apply_item_count",
            header: ({ column }) => (
                <div
                    className="w-32 text-right font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Apply Item
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5">
                    <span className="font-bold text-foreground">
                        {row.original.apply_item_count ?? 0}
                    </span>
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "Status",
            accessorKey: "status_id",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-left py-2.5">
                    <Pill
                        variant={row.original.status_id === 1 ? 'success' : 'warning'}
                        className="whitespace-nowrap w-fit ml-auto"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                        {row.original.status_id === 1 ? 'Active' : 'Inactive'}
                    </Pill>
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            id: "Action",
            header: () => <div className="w-24 pr-4 font-mono text-[10px] tracking-widest text-muted-foreground uppercase text-right"></div>,
            cell: ({ row }) => (
                <div className="w-24 pr-4 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                    <QuickActionsDropdown
                        actions={[
                            { label: 'Edit', icon: Pencil, onClick: () => { } },
                            { label: 'Duplicate', icon: Copy, onClick: () => { } },
                            { label: 'Delete', icon: Trash2, onClick: () => { }, variant: 'destructive' },
                        ]}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ], []);

    const labels = {
        addItem: "Add Brand",
        itemName: "Brand Name",
        type: "Status"
    };

    const filterGroups: FilterGroup[] = [
        {
            id: 'status_id',
            title: 'Status',
            options: [
                { id: '1', label: 'Active', selected: apiFilters.status_id === 1 },
                { id: '0', label: 'Inactive', selected: apiFilters.status_id === 0 },
            ]
        }
    ];

    const handleFilterToggle = (groupId: string, optionId: string) => {
        if (groupId === 'status_id') {
            const val = parseInt(optionId);
            handleFilterChange({ status_id: apiFilters.status_id === val ? null : val });
        }
    };

    const tableComponent = (
        <ListTable
            initialItems={MAPPED_BRANDS as any}
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

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
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
                        <Icon name="verified_user" size={18} />
                        <span>Brands</span>
                    </div>
                </div>
            </div>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center text-xs gap-1 font-dev text-transform-tertiary">
                        <span className="opacity-50 uppercase tracking-widest">Catalog</span>
                        <Icon name="chevron_right" size={14} className="opacity-30" />
                        <span className="font-bold text-on-surface uppercase tracking-widest">Brands</span>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-11 px-12 pb-16 flex flex-col relative z-0 min-w-0">
                    {tableComponent}
                </div>
            </div>
        </div>
    );
    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="Brand lab" width={320}>
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
                                    <span className="truncate uppercase">filters</span>
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

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    <ThemeHeader title="Brands" badge={null} />
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
            componentName="brands"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/brand/PageBrand.tsx"
            importPath="@/genesis/templates/tables/brand/PageBrand"
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
                                    <span className="truncate uppercase">filters</span>
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
            <div className="w-full h-full flex items-center justify-center py-8">
                <CanvasDesktop
                    title="Brands // Collection"
                    fullScreenHref={`/design/${activeTheme}/organisms/brands?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
