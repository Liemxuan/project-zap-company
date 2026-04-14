import React from 'react';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';
import { Inspector } from '@/zap/layout/Inspector';
import { ModifierGroup } from '@/services/modifier-group/modifier-group.model';

interface ModifierGroupInspectorProps {
    selectedItem: ModifierGroup | null;
    filters: FilterGroup[];
    onFilterToggle: (groupId: string, optionId: string) => void;
}

export const ModifierGroupInspector = ({
    selectedItem,
    filters,
    onFilterToggle
}: ModifierGroupInspectorProps) => {
    return (
        <Inspector title="MODIFIER LAB" width={320}>
            <div className="flex flex-col gap-0 w-full px-4 pt-4">
                <Accordion
                    type="multiple"
                    defaultValue={["filters", "details"]}
                    variant="navigation"
                    className="bg-transparent w-full space-y-2"
                >
                    {/* Filters Section */}
                    <AccordionItem value="filters" className="border-none m-0">
                        <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                            <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                                <span className="truncate uppercase">FILTERS</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
                            <DataFilter
                                title=""
                                groups={filters}
                                onToggle={onFilterToggle}
                            />
                        </AccordionContent>
                    </AccordionItem>

                    {/* Selected Item Details */}
                    {selectedItem && (
                        <AccordionItem value="details" className="border-none m-0">
                            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                                <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                    <Icon name="settings_input_component" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                                    <span className="truncate uppercase">DETAILS</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
                                <div className="space-y-4">
                                    <div className="flex flex-col gap-1.5 pt-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Group ID</label>
                                        <div className="flex items-center gap-2 bg-surface-variant/50 border border-border rounded-md px-3 py-2">
                                            <span className="text-xs font-mono text-primary">{selectedItem.id}</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1.5 pt-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Group Name</label>
                                        <input
                                            type="text"
                                            value={selectedItem.name}
                                            readOnly
                                            className="w-full bg-surface-variant/50 border border-border rounded-md px-3 py-2 text-sm text-foreground focus:outline-none focus:border-primary/50 transition-colors"
                                        />
                                    </div>
                                    <div className="space-y-1.5 pt-2">
                                        <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Display Type</label>
                                        <div className="w-full bg-surface-variant/50 border border-border rounded-md px-3 py-2 text-sm text-foreground uppercase font-mono tracking-wider">
                                            {selectedItem.display_type}
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 pt-2">
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Min</label>
                                            <div className="bg-surface-variant/50 border border-border rounded-md px-3 py-2 text-sm">{selectedItem.minSelect}</div>
                                        </div>
                                        <div className="space-y-1.5">
                                            <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground ml-1">Max</label>
                                            <div className="bg-surface-variant/50 border border-border rounded-md px-3 py-2 text-sm">{selectedItem.maxSelect}</div>
                                        </div>
                                    </div>
                                </div>
                            </AccordionContent>
                        </AccordionItem>
                    )}
                </Accordion>
            </div>
        </Inspector>
    );
};
