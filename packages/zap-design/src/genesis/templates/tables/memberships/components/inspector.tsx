'use client';

import React from 'react';
import { Membership } from '@/services/membership/membership.model';
import { Text } from '@/genesis/atoms/typography/text';
import { CreditCard, Calendar, Gift, Info } from 'lucide-react';
import { Inspector } from '@/zap/layout/Inspector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';
import { Icon } from '@/genesis/atoms/icons/Icon';

interface MembershipDetailInspectorProps {
    item: Membership;
    t: any;
}

/**
 * Component for viewing Membership details
 */
export const MembershipDetailInspector = ({ item, t }: MembershipDetailInspectorProps) => {
    return (
        <div className="flex flex-col gap-6 p-6 font-body">
            <div className="flex flex-col gap-1">
                <Text size='iso-500' className='font-bold font-display text-on-surface'>
                    {item.tier}
                </Text>
                <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${item.is_active ? 'bg-success' : 'bg-error'}`} />
                    <Text size='body-small' className='text-on-surface-variant text-transform-tertiary tracking-widest font-bold'>
                        {item.is_active ? t.status_active : t.status_inactive}
                    </Text>
                </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
                <div className="p-4 rounded-2xl bg-layer-panel/50 border border-border/50 flex flex-col gap-3 shadow-sm">
                    <div className="flex items-center gap-2 text-primary">
                        <CreditCard size={18} />
                        <Text size='label-small' className='text-transform-tertiary font-bold tracking-wider'>{t.label_pricingDetails}</Text>
                    </div>
                    <div className="flex justify-between items-center">
                        <Text size="body-medium" className="text-on-surface-variant">Price</Text>
                        <Text size="body-large" className="font-dev font-bold text-on-surface">
                            {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(item.tier_price)}
                        </Text>
                    </div>
                </div>

                <div className="p-4 rounded-2xl bg-layer-panel/50 border border-border/50 flex flex-col gap-3 shadow-sm">
                    <div className="flex items-center gap-2 text-info">
                        <Calendar size={18} />
                        <Text size='label-small' className='text-transform-tertiary font-bold tracking-wider'>{t.label_billingCycle}</Text>
                    </div>
                    <Text size="body-medium" className="font-semibold text-on-surface">{item.billing_cycle}</Text>
                </div>

                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/10 flex flex-col gap-3">
                    <div className="flex items-center gap-2 text-primary">
                        <Gift size={18} />
                        <Text size='label-small' className='text-transform-tertiary font-bold tracking-wider'>{t.label_includedBenefits}</Text>
                    </div>
                    <Text size="body-small" className="text-on-surface-variant leading-relaxed italic">
                        "{item.benefit}"
                    </Text>
                </div>
            </div>

            <div className="mt-4 p-4 rounded-2xl border border-dashed border-border flex flex-col gap-2">
                <div className="flex items-start gap-3">
                    <Info size={16} className="text-on-surface-variant mt-0.5 opacity-50" />
                    <Text size="body-small" className="text-on-surface-variant leading-relaxed opacity-70">
                        {t.label_appliedNote}
                    </Text>
                </div>
            </div>
        </div>
    );
};

interface MembershipInspectorProps {
    inspectorState: any;
    setInspectorState: any;
    filterGroups: FilterGroup[];
    onFilterToggle: (groupId: string, optionId: string) => void;
    title?: string;
    t: any;
}

/**
 * Inspector component for Membership page (Filters)
 */
export const MembershipInspector: React.FC<MembershipInspectorProps> = ({
    inspectorState,
    setInspectorState,
    filterGroups,
    onFilterToggle,
    title,
    t
}) => {
    if (inspectorState !== 'expanded') return null;

    return (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title={title || t.title_membershipLab || "MEMBERSHIP LAB"} width={320}>
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
                            <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-layer-panel border border-border/50 hover:bg-layer-panel/80 font-dev text-transform-tertiary text-[11px] tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                                <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                    <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 transition-colors" />
                                    <span className="truncate text-transform-tertiary">{t.nav_filters}</span>
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
