import React from 'react';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Text } from '@/genesis/atoms/typography/text';
import { Accordion, AccordionItem, AccordionContent, AccordionTrigger } from '@/genesis/molecules/accordion';
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';
import { Inspector } from '@/zap/layout/Inspector';
import { Promotion } from '@/services/promotion/promotion.model';
import { InspectorState } from '@/components/ThemeContext';

export interface PromotionInspectorProps {
    inspectorState: InspectorState;
    setInspectorState: (state: InspectorState) => void;
    filterGroups: FilterGroup[];
    onFilterToggle: (groupId: string, optionId: string) => void;
}

/**
 * Filter Inspector for Promotion page
 */
export function PromotionInspector({
    inspectorState,
    setInspectorState,
    filterGroups = [],
    onFilterToggle
}: PromotionInspectorProps) {

    return (
        <Inspector 
            title="PROMOTION LAB" 
            width={320}
        >
            <Accordion
                type="single"
                collapsible
                variant="navigation"
                defaultValue="item-1"
                className="bg-transparent w-full space-y-2"
            >
                <AccordionItem value="item-1" className="border-none m-0">
                    <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                        <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                            <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 transition-colors" />
                            <span className="truncate text-transform-tertiary">FILTER OPTIONS</span>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="bg-transparent px-0 pb-2 pt-2">
                        <DataFilter
                            groups={filterGroups}
                            onToggle={onFilterToggle}
                        />
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Inspector>
    );
}

/**
 * Detail Inspector for a specific promotion
 */
export function PromotionDetailInspector({ 
    promotion,
    onClose 
}: { 
    promotion: Promotion | null;
    onClose?: () => void;
}) {
    if (!promotion) return null;

    return (
        <Inspector 
            title="PROMOTION DETAILS" 
            width={360}
        >
            <div className="flex flex-col gap-8">
                {/* Header Info */}
                <div className="space-y-1">
                    <Text size="iso-600" className="font-bold text-on-surface text-transform-tertiary tracking-widest leading-tight">
                        {promotion.name}
                    </Text>
                    <div className="flex items-center gap-2">
                         <span className="text-[10px] tracking-tighter font-mono bg-surface-variant px-1.5 py-0.5 rounded text-on-surface-variant">
                            ID: {promotion.id}
                        </span>
                    </div>
                </div>

                {/* Quick Stats / Highlights */}
                <div className="grid grid-cols-2 gap-3">
                    <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl flex flex-col gap-1">
                        <Text size="xs" className="text-primary font-bold text-transform-tertiary tracking-widest opacity-60">Value</Text>
                        <Text size="iso-400" className="font-bold text-primary">
                            {promotion.discount_type === 'Percentage' ? `${promotion.discount_value}%` : `${new Intl.NumberFormat('vi-VN').format(promotion.discount_value)}₫`}
                        </Text>
                    </div>
                    <div className="bg-surface-variant/30 border border-border p-3 rounded-xl flex flex-col gap-1">
                        <Text size="xs" className="text-on-surface-variant font-bold text-transform-tertiary tracking-widest opacity-60">Type</Text>
                        <Text size="iso-400" className="font-bold text-on-surface">{promotion.discount_type}</Text>
                    </div>
                </div>

                {/* Configuration Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-2 text-primary">
                        <Icon name="schedule" size={16} />
                        <Text size="iso-300" className="font-bold text-transform-tertiary tracking-widest">Configuration</Text>
                    </div>
                    <div className="p-4 rounded-xl border border-border bg-surface-variant/10 space-y-4">
                        <div className="flex flex-col gap-1">
                            <Text size="xs" className="text-on-surface-variant font-bold text-transform-tertiary tracking-widest opacity-60">Schedule</Text>
                            <Text size="iso-300" className="font-bold text-on-surface">{promotion.schedule || 'Daily'}</Text>
                        </div>
                        <div className="pt-2 border-t border-border/50">
                            <Text size="xs" className="text-on-surface-variant font-bold text-transform-tertiary tracking-widest mb-2 opacity-60">Locations</Text>
                            <div className="flex flex-wrap gap-1.5">
                                {promotion.locations?.map((loc: string) => (
                                    <span key={loc} className="px-2 py-0.5 bg-surface-variant rounded text-[10px] font-medium text-on-surface">
                                        {loc}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Status Indicator */}
                <div className="p-4 rounded-xl border border-border bg-surface-variant/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${promotion.is_active ? 'bg-green-500' : 'bg-red-500'}`} />
                        <Text size="label-small" className="font-bold text-on-surface">Current Status</Text>
                    </div>
                    <div className="flex items-center">
                        <Text size="label-small" className={`font-bold text-transform-tertiary ${promotion.is_active ? 'text-green-600' : 'text-red-600'}`}>
                            {promotion.is_active ? 'Active' : 'Inactive'}
                        </Text>
                    </div>
                </div>
            </div>
        </Inspector>
    );
}
