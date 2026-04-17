import React, { useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { ListTable, ListItem, Filters } from '../../../zap/organisms/list-table';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '../../atoms/status/pills';
import { Button } from '../../atoms/interactive/button';
import { ChevronDown, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { DataFilter, FilterGroup } from '../../molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../molecules/accordion';
import { Icon } from '../../atoms/icons/Icon';
import { SideNav } from '../../molecules/navigation/SideNav';
import { ThemeHeader } from '../../molecules/layout/ThemeHeader';
import { Inspector } from '../../../zap/layout/Inspector';
import { Avatar, AvatarFallback, AvatarImage } from '../../atoms/interactive/avatar';

import LocationCreateTemplate from '../forms/LocationCreateTemplate';
import { Checkbox } from '../../atoms/interactive/checkbox';
import { Dialog, DialogBody, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../molecules/dialog';
import { Heading } from '../../atoms/typography/headings';

import { ListEmpty } from '../../../zap/organisms/list-empty';
import { Map, Plus } from 'lucide-react';
import { Text } from '../../atoms/typography/text';
import { tr } from 'date-fns/locale';

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

export interface Location {
    id: string; // ID
    media_url: string; // Image
    location_name: string; // Item Name
    address: string; // Address
    phone: string; // Phone
    email: string; // Email
    region: string; // Region
    location_type: string; // Retail vs Warehouse
    operating_hours: string; // Info
    manager: string; // Info
    status_id: string; // Status
}

export default function LocationsTemplate() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';
    const [isCreating, setIsCreating] = useState(false);
    const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

    const SAMPLE_LOCATIONS: Location[] = [
        {
            id: "loc-1",
            media_url: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=200&h=200&fit=crop",
            location_name: "Flagship LA",
            address: "123 Rodeo Drive, Beverly Hills, CA",
            phone: "+1 (310) 555-0199",
            email: "abc@gmail.com",
            region: "West Coast",
            location_type: "Retail",
            operating_hours: "10am - 8pm",
            manager: "Sarah Jenkins",
            status_id: "Active"
        },
        {
            id: "loc-2",
            media_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop",
            location_name: "NYC Hub",
            address: "450 5th Ave, New York, NY",
            phone: "+1 (212) 555-8842",
            email: "abc@gmail.com",
            region: "East Coast",
            location_type: "HQ",
            operating_hours: "9am - 6pm",
            manager: "Michael Chang",
            status_id: "Active"
        },
        {
            id: "loc-3",
            media_url: "https://images.unsplash.com/photo-1586528116311-ad8ed7fc5117?w=200&h=200&fit=crop",
            location_name: "Texas Fulfillment",
            address: "9900 Logistics Way, Austin, TX",
            phone: "+1 (512) 555-1122",
            email: "abc@gmail.com",
            region: "South",
            location_type: "Warehouse",
            operating_hours: "24/7",
            manager: "David Ross",
            status_id: "Active"
        },
        {
            id: "loc-4",
            media_url: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=200&h=200&fit=crop",
            location_name: "Seattle Downtown",
            address: "400 Pine St, Seattle, WA",
            phone: "+1 (206) 555-3344",
            email: "abc@gmail.com",
            region: "West Coast",
            location_type: "Retail",
            operating_hours: "11am - 7pm",
            manager: "Emma Watson",
            status_id: "Renovation"
        },
        {
            id: "loc-5",
            media_url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=200&h=200&fit=crop",
            location_name: "Miami Popup",
            address: "800 Ocean Dr, Miami Beach, FL",
            phone: "+1 (305) 555-9090",
            email: "abc@gmail.com",
            region: "South",
            location_type: "Popup",
            operating_hours: "12pm - 10pm",
            manager: "Carlos Ruiz",
            status_id: "Closed"
        }
    ];
    // Map Locations to generic ListItem
    const MAPPED_LOCATIONS: ListItem[] = SAMPLE_LOCATIONS.map(loc => ({
        id: loc.id,
        media_url: loc.media_url,
        variant_name: loc.location_name,
        phone: loc.phone,
        email: loc.email,
        sku_code: loc.address,
        barcode: loc.phone,
        category_id: loc.region,
        product_type: loc.location_type,
        sale_price: 0,
        qty_on_hand: 0,
        uom_id: loc.manager,
        warehouse_id: loc.operating_hours,
        status_id: loc.status_id === 'Renovation' ? 'Hidden' : (loc.status_id === 'Closed' ? 'Out of Stock' : loc.status_id)
    }));



    const [filters, setFilters] = useState<Filters>({
        category: [],
        productType: [],
        status: [],
    });

    const columns = React.useMemo<ColumnDef<ListItem>[]>(() => [
        {
            id: "select",
            name: "Select",
            disabled: "true",
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
                    <Text size='label-small' className="font-semibold text-foreground truncate">ID</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='body-small' className="w-20 truncate text-left py-2.5">
                    {row.original.id}
                </Text>
            ),
            enableSorting: true,
            enableHiding: false,
        },

        {
            accessorKey: "variant_name",
            name: "Location Name",
            disabled: "true",
            header: ({ column }) => (
                <div
                    className="w-80 text-left cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-medium' className='font-semibold '>Location Name</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        {/* <div className="flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar className="rounded-full overflow-hidden" size='default'>
                                <AvatarImage src={row.original.media_url} alt={row.original.variant_name} />
                                <AvatarFallback className="font-display text-headlineLarge text-transform-primary bg-primary/20 text-primary">{row.original.variant_name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                        </div> */}
                        <div className="flex flex-col min-w-0">
                            <Text size='label-small' className="font-semibold text-foreground text-sm truncate">{row.original.variant_name}</Text>
                            <Text size='label-small' className="font-dev font-normal text-xs text-muted-foreground uppercase tracking-wide truncate mt-0.5">{row.original.sku_code}</Text>
                        </div>
                    </div>
                </div>
            ),
            enableSorting: true,
            enableHiding: false,
        },
        {
            accessorKey: "product_type",
            name: "Type",
            disabled: "false",
            header: () => <Text size='label-small' className="w-28 text-left font-semibold tracking-widest text-muted-foreground">Type</Text>,
            cell: ({ row }) => (
                <div className="w-28 py-2.5">
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
            disabled: "false",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate">Phone</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='body-small' className="w-32 truncate text-left py-2.5">
                    {row.original.barcode}
                </Text>
            ),
            enableSorting: true,
            enableHiding: true,
        },
        {
            id: "email",
            name: "Email",
            disabled: "false",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate">Email</Text>
                </div>
            ),
            cell: ({ row }) => (
                <Text size='body-small' className="w-32 truncate text-left py-2.5">
                    {row.original.email}
                </Text>
            ),
            enableSorting: true,
            enableHiding: true,
        },

        {
            accessorKey: "status_id",
            name: "Status",
            disabled: "true",
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
            enableHiding: true,
        },
    ], []);

    // Derive filter groups from the MAPPED_LOCATIONS
    const baseGroups: FilterGroup[] = [
        {
            id: 'category',
            title: 'Region',
            options: Array.from(new Set(MAPPED_LOCATIONS.map(p => p.category_id).filter(Boolean))).map(region => ({
                id: region as string,
                label: region as string,
            }))
        },
        {
            id: 'productType',
            title: 'Location Type',
            options: Array.from(new Set(MAPPED_LOCATIONS.map(p => p.product_type).filter(Boolean))).map(type => ({
                id: type as string,
                label: type as string,
            }))
        },
        {
            id: 'status',
            title: 'Status',
            options: Array.from(new Set(MAPPED_LOCATIONS.map(p => p.status_id).filter(Boolean))).map(status => ({
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

    const handleRowClick = useCallback((row: ListItem) => {
        const loc = SAMPLE_LOCATIONS.find(l => l.id === row.id) ?? null;
        setSelectedLocation(loc);
    }, []);

    const tableComponent = (
        <ListTable
            initialItems={MAPPED_LOCATIONS}
            filters={filters}
            onFilterChange={setFilters}
            onToggleFilters={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
            isFilterActive={inspectorState === 'expanded'}
            labels={labels}
            columns={columns}
            onAddClick={() => setIsCreating(true)}
            onRowClick={handleRowClick}
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
                        onClick={() => setSelectedLocation(null)}
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
                                    onClick={() => setSelectedLocation(null)}
                                    className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-foreground"
                                >
                                    <X size={16} />
                                </button>
                                <Button variant="primary" size="sm" className="font-display text-transform-primary text-xs h-8 px-5 rounded-lg shadow-sm">
                                    Edit location
                                </Button>
                            </div>

                            {/* Location Name */}
                            <div className="px-6 pt-2 pb-4">
                                <h2 className="font-display text-transform-primary text-lg font-semibold text-foreground">{selectedLocation.location_name}</h2>
                                <p className="font-body text-transform-secondary text-sm text-muted-foreground mt-0.5">{selectedLocation.location_name}</p>
                            </div>

                            {/* Location Details */}
                            <div className="px-6 pb-6 space-y-1">
                                <h3 className="font-display text-transform-primary text-sm font-semibold text-foreground mb-3">Location details</h3>
                                <DetailRow label="Nickname" value={selectedLocation.location_name} />
                                <DetailRow label="Location type" value={selectedLocation.location_type} />
                                <DetailRow label="Address" value={selectedLocation.address} />
                                <DetailRow label="Location" value={selectedLocation.region} />
                                <DetailRow label="Phone" value={selectedLocation.phone} />
                                <DetailRow label="Email" value="" />
                                <DetailRow label="Preferred language" value="English" />
                            </div>

                            {/* Separator */}
                            <div className="border-t border-outline-variant/40 mx-6" />

                            {/* Business Hours */}
                            <div className="px-6 py-6 space-y-1">
                                <h3 className="font-display text-transform-primary text-sm font-semibold text-foreground mb-3">Business hours</h3>
                                <HoursDetailRow day="Monday" value={selectedLocation.operating_hours} />
                                <HoursDetailRow day="Tuesday" value="Closed" />
                                <HoursDetailRow day="Wednesday" value="Closed" />
                                <HoursDetailRow day="Thursday" value="Closed" />
                                <HoursDetailRow day="Friday" value="Closed" />
                                <HoursDetailRow day="Saturday" value="Closed" />
                                <HoursDetailRow day="Sunday" value="Closed" />
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
                        <Icon name="inventory-2" size={18} className="shrink-0" />
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
                        <Heading level={2} className='text-transform-primary text-on-surface py-4'>Create Location</Heading>
                    </div>
                    <div className='absolute right-4 top-2'>
                        <Button variant="primary" size="lg" className="text-transform-primary text-xs px-5 rounded-lg shadow-sm">
                            Create
                        </Button>
                    </div>
                </DialogHeader>
                <DialogBody className="flex-1 flex flex-col">
                    <LocationCreateTemplate onCancel={() => setIsCreating(false)} />
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
                        title="LOCATIONS ASSEMBLY"
                        breadcrumb="zap design engine / metro / layout"
                        badge="component sandbox"
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
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="locations"
            tier="L6 LAYOUT"
            status="Verified"
            filePath="src/genesis/templates/tables/LocationsTemplate.tsx"
            importPath="@/genesis/templates/tables/LocationsTemplate"
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
        </ComponentSandboxTemplate>
    );
}
