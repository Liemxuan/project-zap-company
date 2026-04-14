import React from 'react';
import { Inspector } from '@/zap/layout/Inspector';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/genesis/molecules/accordion';
import { DataFilter, FilterGroup } from '@/genesis/molecules/data-filter';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Country } from '@/services/country/country.model';
import { Text } from '@/genesis/atoms/typography/text';
import { Globe, X, Phone, DollarSign, Calendar, Clock } from "lucide-react";

interface CountryInspectorProps {
    inspectorState: 'expanded' | 'collapsed';
    setInspectorState: (state: 'expanded' | 'collapsed') => void;
    filterGroups: FilterGroup[];
    onFilterToggle: (groupId: string, optionId: string) => void;
}

/**
 * Inspector component for Country page
 */
export const CountryInspector: React.FC<CountryInspectorProps> = ({
    inspectorState,
    setInspectorState,
    filterGroups,
    onFilterToggle
}) => {
    if (inspectorState !== 'expanded') return null;

    return (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-20 relative">
            <Inspector title="COUNTRY LAB" width={320}>
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

interface CountryDetailInspectorProps {
    country: Country;
    onClose: () => void;
}

export const CountryDetailInspector: React.FC<CountryDetailInspectorProps> = ({
    country,
    onClose
}) => {
    return (
        <div className="h-full border-l border-border bg-layer-panel hidden md:flex flex-col shrink-0 z-30 relative animate-in slide-in-from-right duration-300">
            <Inspector title="COUNTRY DETAILS" width={320}>
                <div className="flex flex-col h-full">
                    <div className="p-8 border-b border-border bg-gradient-to-br from-primary/5 to-transparent relative">
                        <button 
                          onClick={onClose}
                          className="absolute top-4 right-4 p-2 hover:bg-surface-variant rounded-full transition-colors"
                        >
                            <X size={18} />
                        </button>
                        
                        <div className="space-y-6 mt-2">
                            <div className="w-20 h-14 rounded-xl border-4 border-layer-base bg-layer-base shadow-lg overflow-hidden flex items-center justify-center">
                                {country.flag_url ? (
                                    <img src={country.flag_url} alt={country.name} className="w-full h-full object-cover" />
                                ) : (
                                    <Globe size={32} className="text-primary/40" />
                                )}
                            </div>
                            <div>
                                <div className="flex items-center gap-2 mb-1">
                                    <Text size='label-small' className='font-mono tracking-widest text-primary font-bold uppercase'>
                                        {country.code}
                                    </Text>
                                    <div className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-tighter ${
                                        country.is_active ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                                    }`}>
                                        {country.is_active ? 'Active' : 'Inactive'}
                                    </div>
                                </div>
                                <h2 className="text-2xl font-bold tracking-tight text-on-surface">{country.name}</h2>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-8 space-y-8">
                        <div className="space-y-5">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 block">
                                Detailed Info
                            </label>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-surface-variant/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                        <Phone size={18} />
                                    </div>
                                    <div>
                                        <Text size='label-small' className='text-muted-foreground/70 block leading-none mb-1'>Phone Code</Text>
                                        <Text size='body-medium' className='font-mono font-medium'>{country.phone_code}</Text>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 rounded-xl bg-surface-variant/50 flex items-center justify-center text-muted-foreground group-hover:text-emerald-500 transition-colors">
                                        <DollarSign size={18} />
                                    </div>
                                    <div>
                                        <Text size='label-small' className='text-muted-foreground/70 block leading-none mb-1'>Currency</Text>
                                        <Text size='body-medium' className='font-mono font-medium'>{country.currency}</Text>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60 block">
                                System Tracking
                            </label>
                            <div className="space-y-4">
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <Calendar size={14} />
                                    <span>Created: Jan 12, 2024</span>
                                </div>
                                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                    <Clock size={14} />
                                    <span>Updated: 2 hours ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="p-6 border-t border-border bg-layer-panel mt-auto">
                        <button className="w-full h-11 bg-primary text-primary-foreground rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] transition-all">
                            Update Country
                        </button>
                    </div>
                </div>
            </Inspector>
        </div>
    );
};
