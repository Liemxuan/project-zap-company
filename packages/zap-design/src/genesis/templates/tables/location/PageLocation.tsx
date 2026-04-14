import React, { useState, useCallback, useEffect } from 'react';
import { locationService } from '@/services/location/location.service';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '@/components/ThemeContext';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '@/components/dev/CanvasDesktop';
import { ListTable, ListItem, Filters } from '@/zap/organisms/list-table';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Button } from '@/genesis/atoms/interactive/button';
import { ChevronDown, X, Map, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { SideNav } from '@/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
import { Inspector } from '@/zap/layout/Inspector';
import { Avatar } from '@/genesis/atoms/status/avatars';

import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/genesis/molecules/dialog';
import { Heading } from '@/genesis/atoms/typography/headings';

import { Text } from '@/genesis/atoms/typography/text';
import { Location, OperatingHours } from '@/services/location/location.model';
import LocationDetail from './Component/LocationDetail';
import { useLocations, useLocationDetail } from '@/hooks/location/use-locations';

/** 
 * Locations (Layout) Showcase
 * Renders ListTable inside the L6 CanvasDesktop layout
 * Route: /design/[theme]/organisms/locations
 */

/* ── Detail panel key-value row ── */
function DetailRow({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-outline-variant/30 last:border-b-0">
            <Text size='body-small'>{label}</Text>
            <Text size='body-small'>{value || '\u2014'}</Text>
        </div>
    );
}

/* ── Business hours detail row ── */
function HoursDetailRow({ day, value }: { day: string; value: string }) {
    return (
        <div className="flex items-center justify-between py-2.5 border-b border-outline-variant/30 last:border-b-0">
            <Text size='body-small'>{day}</Text>
            <Text size='body-small' className={`${value === 'Closed' ? 'text-muted-foreground' : 'text-foreground'}`}>{value}</Text>
        </div>
    );
}


/* ── Helper to format operating hours ── */
function formatHours(dayHours?: any) {
    if (!dayHours || dayHours.is_closed) return 'Closed';
    const open = dayHours.open?.substring(0, 5) || '00:00';
    const close = dayHours.close?.substring(0, 5) || '00:00';
    return `${open} - ${close}`;
}


export default function PageLocationsTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';
    const {
        locations,
        isLoading,
        pagination,
        handlePageChange,
        handlePageSizeChange,
        handleSearch,
        handleFilterChange,
        filters: apiFilters,
        search: apiSearch
    } = useLocations();

    const [selectedLocationId, setSelectedLocationId] = useState<string | null>(null);
    const { location: selectedLocation, isLoading: isDetailLoading } = useLocationDetail(selectedLocationId);

    const [isCreating, setIsCreating] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    // Map Locations to generic ListItem
    const MAPPED_LOCATIONS: ListItem[] = locations.map((loc: Location) => ({
        id: loc.serial_id?.toString() || loc.id || '',
        media_url: loc.logo_url || '',
        variant_name: loc.name || '',
        acronymn: loc.acronymn || '',
        phone: loc.phone_number || '',
        email: loc.email || '',
        sku_code: loc.address_line_1 || '',
        barcode: loc.phone_number || '',
        category_id: loc.province_name || '',
        product_type: loc.location_type_text || '',
        sale_price: 0,
        qty_on_hand: 0,
        uom_id: loc.transfer_account || '', // Using as manager
        warehouse_id: typeof loc.operating_hours === 'string' ? loc.operating_hours : 'Schedule',
        status_id: loc.status_id === 2 ? 'Hidden' : (loc.status_id === 0 ? 'Deactive' : 'Active')
    }));

    const columns = React.useMemo<ColumnDef<ListItem>[]>(() => [
        {
            id: "select",
            name: "Select",
            disabled: true,
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
        },
        {
            id: "id",
            name: "ID",
            header: ({ column }) => (
                <div
                    className="text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate uppercase">ID</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 px-4 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground">
                    {row.original.id}
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },

        {
            accessorKey: "variant_name",
            name: "Name",
            disabled: true,
            header: ({ column }) => (
                <div
                    className="w-80 text-left cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-medium' className='font-semibold '>Name</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar
                                src={row.original.media_url}
                                initials={row.original.acronymn}
                                size="sm"
                                fallback={row.original.acronymn}
                                className="w-full h-full object-cover border-[1px] border-border"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Text size='label-small' className='font-semibold text-foreground truncate'>
                                {row.original.variant_name}
                            </Text>
                            <Text size='label-small' className='text-muted-foreground truncate'>
                                {row.original.address_line_1}
                            </Text>
                        </div>
                    </div>
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            id: "product_type",
            name: "Type",
            header: () => <Text size='label-small' className="w-30 text-left font-semibold tracking-widest text-muted-foreground">Type</Text>,
            cell: ({ row }) => (
                <div className="w-30 py-2.5">
                    <Pill variant="neutral" className="w-fit px-1.5 py-0.5">
                        {row.original.product_type}
                    </Pill>
                </div>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "phone",
            name: "Phone",
            disabled: false,
            header: ({ column }) => (
                <div
                    className="w-40 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate">Phone</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='body-small' className="w-40 text-left py-2.5">
                    {row.original.phone}
                </Text>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "email",
            name: "Email",
            disabled: false,
            header: ({ column }) => (
                <div
                    className="w-40 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate">Email</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='body-small' className="w-40 truncate text-left py-2.5">
                    {row.original.email}
                </Text>
            ),
            enableSorting: true,
            enableHiding: true,
        },

        {
            accessorKey: "status_id",
            name: "Status",
            disabled: true,
            header: ({ column }) => (
                <div
                    className="w-24 tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate">Status</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 py-2.5">
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
            enableHiding: false,
        },
    ], []);

    // Derive filter groups from the MAPPED_LOCATIONS
    const baseGroups: FilterGroup[] = [
        {
            id: 'productType',
            title: 'Location Type',
            options: Array.from(new Set(MAPPED_LOCATIONS.map(p => p.product_type).filter(Boolean) as string[])).map(type => ({
                id: type,
                label: type,
            }))
        },
        {
            id: 'status',
            title: 'Status',
            options: Array.from(new Set(MAPPED_LOCATIONS.map(p => p.status_id).filter(Boolean) as string[])).map(status => ({
                id: status,
                label: status,
            }))
        }
    ];

    // Map current dynamic state onto filter groups
    const filterGroups = baseGroups.map(group => {
        const fieldMap: Record<string, string> = {
            'productType': 'location_type_id',
            'status': 'status_id',
            'category': 'province_id'
        };
        const field = fieldMap[group.id];
        const selectedValues = (apiFilters as any)[field] || [];

        return {
            ...group,
            options: group.options.map(opt => ({
                ...opt,
                selected: Array.isArray(selectedValues)
                    ? selectedValues.includes(opt.id)
                    : selectedValues === opt.id
            }))
        };
    });

    const handleFilterToggle = (groupId: string, optionId: string) => {
        const fieldMap: Record<string, string> = {
            'productType': 'location_type_id',
            'status': 'status_id',
            'category': 'province_id'
        };
        const field = fieldMap[groupId];
        if (!field) return;

        const currentValues = (apiFilters as any)[field] || [];
        const updatedValues = Array.isArray(currentValues)
            ? (currentValues.includes(optionId)
                ? currentValues.filter(v => v !== optionId)
                : [...currentValues, optionId])
            : [optionId];

        handleFilterChange({ [field]: updatedValues });
    };

    const labels = {
        addItem: "Add Location",
        itemName: "Location Name",
        itemCode: "Address",
        category: "Region",
        type: "Loc Type",
        inventory: "Manager / Hours",
        price: "Revenue"
    };

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="LOCATIONS LAB" width={320}>
                <div className="flex flex-col gap-0 w-full px-4 pt-4">
                    <Accordion type="single" collapsible variant="navigation" value={inspectorState === 'expanded' ? "item-1" : ""} onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }} className="bg-transparent w-full space-y-2">
                        <AccordionItem value="item-1" className="border-none m-0">
                            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-primary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
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

    const handleRowClick = useCallback((row: ListItem) => {
        const loc = locations.find(l => l.location_code === row.id || l.id === row.id);
        if (loc) {
            setSelectedLocationId(loc.id);
        }
    }, [locations]);

    const tableComponent = (
        <ListTable
            initialItems={MAPPED_LOCATIONS}
            filters={apiFilters as any}
            onFilterChange={handleFilterChange as any}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            labels={labels}
            columns={columns}
            onAddClick={() => setIsCreating(true)}
            onRowClick={handleRowClick}
            pageIndex={pagination.page_index - 1}
            pageSize={pagination.page_size}
            pageCount={pagination.total_page}
            onPageChange={(idx) => handlePageChange(idx + 1)}
            onPageSizeChange={handlePageSizeChange}
            isLoading={isLoading}
            onSearch={handleSearch}
        />
    );

    /* ── Detail Panel (right side) ── */
    const detailPanel = (
        <AnimatePresence>
            {selectedLocation && (
                <>
                    <motion.div
                        key="detail-backdrop"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="absolute inset-0 bg-black/30 z-10 hidden md:block"
                        onClick={() => setSelectedLocationId(null)}
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
                            {/* Header */}
                            <div className="flex items-center justify-between px-5 py-4 shrink-0">
                                <button
                                    onClick={() => setSelectedLocationId(null)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-foreground"
                                >
                                    <X size={16} />
                                </button>
                                <div className="flex items-center gap-2">
                                    {isDetailLoading && (
                                        <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                                    )}
                                    <Button
                                        variant="primary"
                                        size="sm"
                                        className="font-display text-transform-primary text-xs h-8 px-5 rounded-lg shadow-sm"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        Edit location
                                    </Button>
                                </div>
                            </div>

                            <div className="px-6 pt-2 pb-4">
                                <h2 className="font-display text-transform-primary text-lg font-semibold text-foreground tracking-tight">{selectedLocation.name}</h2>
                                <p className="font-dev text-transform-primary text-[10px] tracking-widest text-muted-foreground opacity-70 mt-0.5">{selectedLocation.location_code || 'NO-CODE'}</p>
                            </div>

                            <div className="px-6 pb-6 space-y-1">
                                <h3 className="font-display text-transform-primary text-xs font-bold text-muted-foreground tracking-widest mb-3 mt-2">Location details</h3>
                                <DetailRow label="Name" value={selectedLocation.name || ''} />
                                <DetailRow label="Location type" value={selectedLocation.location_type_text || 'Standard'} />
                                <DetailRow label="Address" value={selectedLocation.address_line_1 || ''} />
                                <DetailRow label="Location" value={`${selectedLocation.ward_name ? selectedLocation.ward_name + ', ' : ''}${selectedLocation.district_name ? selectedLocation.district_name + ', ' : ''}${selectedLocation.province_name || ''}`} />
                                <DetailRow label="Phone" value={selectedLocation.phone_number || ''} />
                                <DetailRow label="Email" value={selectedLocation.email || ''} />
                                {/* <DetailRow label="Manager" value={selectedLocation.transfer_account || 'N/A'} /> */}
                            </div>

                            {/* Separator */}
                            <div className="border-t border-outline-variant/40 mx-6" />

                            {/* Business Hours */}
                            <div className="px-6 py-6 space-y-1">
                                <h3 className="font-display text-transform-primary text-xs font-bold text-muted-foreground tracking-widest mb-3 mt-2">Business hours</h3>
                                <HoursDetailRow day="Monday" value={formatHours(selectedLocation.operating_hours?.mon)} />
                                <HoursDetailRow day="Tuesday" value={formatHours(selectedLocation.operating_hours?.tue)} />
                                <HoursDetailRow day="Wednesday" value={formatHours(selectedLocation.operating_hours?.wed)} />
                                <HoursDetailRow day="Thursday" value={formatHours(selectedLocation.operating_hours?.thu)} />
                                <HoursDetailRow day="Friday" value={formatHours(selectedLocation.operating_hours?.fri)} />
                                <HoursDetailRow day="Saturday" value={formatHours(selectedLocation.operating_hours?.sat)} />
                                <HoursDetailRow day="Sunday" value={formatHours(selectedLocation.operating_hours?.sun)} />
                            </div>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );

    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border relative">
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
                        <Icon name="inventory_2" size={18} className="shrink-0" />
                        <span className="font-medium">Locations</span>
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
                            <span className="font-medium text-on-surface">Locations</span>
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
                    {tableComponent}
                </div>
            </div>

            {/* Fake Inspector Drawer */}
            {rightDrawerContent}

            {/* Row Detail Panel */}
            {detailPanel}
        </div>
    );

    const inspectorContent = (
        <div className="flex flex-col gap-0 w-full min-w-[320px] px-4 pt-4">
            <Accordion type="single" collapsible variant="navigation" value={inspectorState === 'expanded' ? "item-1" : ""} onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }} className="bg-transparent w-full space-y-2">
                <AccordionItem value="item-1" className="border-none m-0">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-primary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
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

    const createDialog = (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogContent
                className="max-w-none w-screen h-screen p-0 border-none rounded-none bg-white"
                showClose={true}
                closeButtonPosition="header-left"
                closeButtonShape='circle'
            >
                <DialogHeader className='relative' closeButtonPosition="header-left">
                    <div className='max-w-lg mx-auto text-center'>
                        <Heading level={2} className='text-transform-primary text-on-surface py-4'>Location Detail</Heading>
                    </div>
                    <div className='absolute right-4 top-2'>
                        <Button variant="primary" size="lg" className="text-transform-primary text-xs px-5 rounded-lg shadow-sm">
                            Save
                        </Button>
                    </div>
                </DialogHeader>
                <DialogBody className="flex-1 flex flex-col">
                    <LocationDetail onCancel={() => setIsCreating(false)} />
                </DialogBody>
            </DialogContent>
        </Dialog>
    );



    const editDialog = (
        <Dialog open={isEditing} onOpenChange={setIsEditing}>
            <DialogContent
                className="max-w-none w-screen h-screen p-0 border-none rounded-none bg-white"
                showClose={true}
                closeButtonPosition="header-left"
                closeButtonShape='circle'
            >
                <DialogHeader className='relative' closeButtonPosition="header-left">
                    <div className='max-w-lg mx-auto text-center'>
                        <Heading level={2} className='text-transform-primary text-on-surface py-4'>Location Detail</Heading>
                    </div>
                    <div className='absolute right-4 top-2'>
                        <Button variant="destructive" size="md" className="text-transform-primary px-5 rounded-lg shadow-sm border border-border">
                            Deactive
                        </Button>
                        &nbsp;
                        <Button variant="primary" size="lg" className="text-transform-primary text-xs px-5 rounded-lg shadow-sm">
                            Save
                        </Button>
                    </div>
                </DialogHeader>
                <DialogBody className="flex-1 flex flex-col">
                    <LocationDetail location={selectedLocation as Location} onCancel={() => setIsEditing(false)} />
                </DialogBody>
            </DialogContent>
        </Dialog>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                {/* True Side Navigation */}
                <SideNav />

                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative">
                    {/* True Main Header */}
                    <ThemeHeader
                        title="Locations"
                        badge={null}
                        showBackground={false}
                    />

                    <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0 bg-layer-base min-w-0">
                        {/* <ListEmpty
                            icon={Map}
                            title="No locations found"
                            description="Get started by creating your first location."
                            actions={[
                                {
                                    label: 'Add Location',
                                    onClick: () => setIsCreating(true),
                                    variant: 'outline',
                                },
                                {
                                    label: 'Add Location',
                                    onClick: () => setIsCreating(true),
                                    icon: Plus,
                                    variant: 'primary',
                                },
                            ]}
                        /> */}
                        {tableComponent}
                    </div>
                </div>

                {/* True Inspector Drawer */}
                {rightDrawerContent}
                {detailPanel}
                {createDialog}
                {editDialog}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="Locations"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/location/PageLocation.tsx"
            importPath="@/genesis/templates/tables/location/PageLocation"
            inspectorControls={inspectorContent}
            hideDataTerminal={true}
            fullWidth={true}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Locations // Catalog"
                    fullScreenHref={`/design/${activeTheme}/organisms/locations?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
            {createDialog}
            {editDialog}
        </ComponentSandboxTemplate>
    );
}
