'use client';

import * as React from 'react';
import { useTheme } from '../../components/ThemeContext';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { DataFilter, FilterGroup } from '../../genesis/molecules/data-filter';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '../../genesis/molecules/accordion';
import { Inspector } from '../layout/Inspector';
import { ItemTable, type Item } from '../organisms/item-table';

const SAMPLE_ITEMS: Item[] = [
    { id: 'ITM-001', name: 'ZAP Auth Module', description: 'Enterprise authentication block', status: 'active', price: '$199.00' },
    { id: 'ITM-002', name: 'Identity Provider', description: 'SSO and generic OAuth provider mapping', status: 'active', price: '$299.00' },
    { id: 'ITM-003', name: 'Biometric Login', description: 'Fingerprint and FaceID integration (Beta)', status: 'pending', price: '$149.00' },
    { id: 'ITM-004', name: 'Legacy LDAP Connector', description: 'Active Directory sync tool', status: 'inactive', price: '$99.00' },
    { id: 'ITM-005', name: 'Hardware Token Sync', description: 'YubiKey and FIDO2 physical token support', status: 'active', price: '$49.00' }
];

interface Filters {
    status: string[];
}

/**
 * L6 Item Management Page
 * Uses ItemTable for a high-fidelity operational experience.
 */
export function ItemManagementPage() {
    const { theme: appTheme, inspectorState, setInspectorState } = useTheme();

    const [filters, setFilters] = React.useState<Filters>({
        status: [],
    });

    const baseGroups: FilterGroup[] = [
        {
            id: 'status',
            title: 'Status',
            options: Array.from(new Set(SAMPLE_ITEMS.map((l) => l.status))).map(status => ({
                id: status,
                label: status.charAt(0).toUpperCase() + status.slice(1),
            }))
        }
    ];

    const filterGroups = baseGroups.map(group => ({
        ...group,
        options: group.options.map(opt => ({
            ...opt,
            selected: filters.status.includes(opt.id)
        }))
    }));

    const handleFilterToggle = (groupId: string, optionId: string) => {
        setFilters((current: Filters) => {
            const currentList = current.status;
            const updatedList = currentList.includes(optionId)
                ? currentList.filter((id: string) => id !== optionId)
                : [...currentList, optionId];
            return {
                ...current,
                status: updatedList
            };
        });
    };

    const filteredItems = SAMPLE_ITEMS.filter(item => {
        if (filters.status.length > 0 && !filters.status.includes(item.status)) return false;
        return true;
    });

    const rightDrawerContent = inspectorState === 'expanded' && (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="ITEM VAULT LAB" width={320}>
                <div className="flex flex-col gap-0 w-full px-4 pt-4">
                    <Accordion type="single" collapsible variant="navigation" value={inspectorState === 'expanded' ? "item-1" : ""} onValueChange={(val: string) => { if (val !== "item-1") setInspectorState('collapsed'); }} className="bg-transparent w-full space-y-2">
                        <AccordionItem value="item-1" className="border-none m-0">
                            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-[11px] uppercase tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
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

    return (
        <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <Icon name="bolt" size={14} className="text-primary-foreground" />
                    </div>
                    <span className="font-bold text-sm tracking-widest uppercase font-display text-on-surface">ZAP OS</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 text-sm text-on-surface cursor-pointer transition-colors">
                        <Icon name="dashboard" size={18} className="text-on-surface-variant shrink-0" />
                        <span className="font-medium">Overview</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 text-sm cursor-pointer border border-primary/20 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md"></div>
                        <Icon name="inventory_2" size={18} className="shrink-0" />
                        <span className="font-medium">Item Management</span>
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

            <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-4 lg:px-6 justify-between shrink-0 shadow-sm z-10 relative">
                    <div className="flex items-center">
                        <button className="md:hidden mr-2 -ml-2 shrink-0 p-2 hover:bg-surface-variant rounded-md transition-colors text-on-surface-variant">
                            <Icon name="menu" size={20} />
                        </button>
                        <div className="flex items-center text-xs lg:text-sm">
                            <span className="text-on-surface-variant hover:text-on-surface cursor-pointer transition-colors">Enterprise</span>
                            <Icon name="chevron_right" size={16} className="text-on-surface-variant/50 mx-1 shrink-0" />
                            <span className="font-medium text-on-surface">Item Management</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3 lg:gap-4">
                        <button className="relative w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors text-on-surface-variant">
                            <Icon name="notifications" size={18} />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-auto pt-8 px-4 lg:pt-11 lg:px-12 pb-16 flex flex-col relative z-0">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-2xl font-bold font-display text-on-surface">Items</h2>
                        <button 
                            className="p-2 hover:bg-surface-variant rounded-md text-on-surface-variant transition-colors"
                            onClick={() => setInspectorState(inspectorState === 'expanded' ? 'collapsed' : 'expanded')}
                            data-state={inspectorState === 'expanded' ? 'active' : 'inactive'}
                        >
                            <Icon name="filter_list" size={20} className={inspectorState === 'expanded' ? 'text-primary' : ''} />
                        </button>
                    </div>
                    <ItemTable 
                        items={filteredItems} 
                        onEdit={(item: Item) => console.log('Edit', item)}
                        onDelete={(item: Item) => console.log('Delete', item)}
                        onDuplicate={(item: Item) => console.log('Duplicate', item)}
                    />
                </div>
            </div>

            {rightDrawerContent}
        </div>
    );
}

