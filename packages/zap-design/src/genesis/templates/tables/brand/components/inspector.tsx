import React from 'react';
import { Inspector } from '@/zap/layout/Inspector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';

interface BrandInspectorProps {
    inspectorState: 'expanded' | 'collapsed';
    setInspectorState: (state: 'expanded' | 'collapsed') => void;
    filterGroups: FilterGroup[];
    onFilterToggle: (groupId: string, optionId: string) => void;
    t: any;
    title?: string;
}

export const BrandInspector = ({
    inspectorState,
    setInspectorState,
    filterGroups,
    onFilterToggle,
    t,
    title
}: BrandInspectorProps) => {
    return (
        <Inspector title={title || t.nav_brandLab} width={320}>
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
                                <span className="truncate uppercase">{t.nav_filters}</span>
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
    );
};
