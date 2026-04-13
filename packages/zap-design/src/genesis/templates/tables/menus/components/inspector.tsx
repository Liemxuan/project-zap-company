import React from 'react';
import { Inspector } from '@/zap/layout/Inspector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';
import { Icon } from '@/genesis/atoms/icons/Icon';

interface MenuInspectorProps {
    inspectorState: 'expanded' | 'collapsed';
    setInspectorState: (state: 'expanded' | 'collapsed') => void;
    filterGroups: FilterGroup[];
    onFilterToggle: (groupId: string, optionId: string) => void;
}

/**
 * Inspector component for Menu page
 */
export const MenuInspector: React.FC<MenuInspectorProps> = ({
    inspectorState,
    setInspectorState,
    filterGroups,
    onFilterToggle
}) => {
    if (inspectorState !== 'expanded') return null;

    return (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="MENU LAB" width={320}>
                <div className="flex flex-col gap-0 w-full px-4 pt-4">
                    <Accordion
                        type="single"
                        collapsible
                        variant="navigation"
                        defaultValue="item-1"
                        onValueChange={(val: string) => { 
                            if (val !== "item-1") setInspectorState('collapsed'); 
                        }}
                        className="bg-transparent w-full space-y-2"
                    >
                        <AccordionItem value="item-1" className="border-none m-0">
                            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                                <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                    <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 transition-colors" />
                                    <span className="truncate uppercase">FILTERS</span>
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
                                <DataFilter
                                    title=""
                                    groups={filterGroups}
                                    onToggle={onFilterToggle}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>
            </Inspector>
        </div>
    );
};
