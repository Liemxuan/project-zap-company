import React from 'react';
import { Inspector } from '@/zap/layout/Inspector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { DataFilter } from '@/genesis/molecules/data-filter';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Tax } from '@/services/tax/tax.model';

interface TaxInspectorProps {
    selectedTax?: Tax | null;
    filters: any[];
    onFilterToggle: (groupId: string, optionId: string) => void;
    t: any;
}

export const TaxInspector: React.FC<TaxInspectorProps> = ({
    selectedTax,
    filters,
    onFilterToggle,
    t
}) => {
    return (
        <Inspector title="TAX INSPECTOR" width={320}>
            <div className="flex flex-col gap-0 w-full px-4 pt-4">
                <Accordion
                    type="single"
                    collapsible
                    variant="navigation"
                    defaultValue="filters"
                    className="bg-transparent w-full space-y-2"
                >
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
                </Accordion>
            </div>
        </Inspector>
    );
};
