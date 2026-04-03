'use client';

import React from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { DataReadout, type DataReadoutItem } from '../../../../../genesis/molecules/data-readout';
import { DataFilter, type FilterGroup } from '../../../../../genesis/molecules/data-filter';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../../../../../genesis/molecules/accordion';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function DataReadoutSandbox() {

    // ── DATA PRESETS ────────────────────────────────────────────────────────
    
    const terminalData: DataReadoutItem[] = [
        { id: '1', label: 'status', value: 'verified', type: 'badge', badgeVariant: 'success' },
        { id: '2', label: 'tier', value: 'l6 layout', type: 'text' },
        { id: '3', label: 'import', value: "import { systemLogs } from '@/genesis/templates/tables/SystemLogsTemplate';", type: 'code' },
        { id: '4', label: 'database', value: 'postgresql (cloud sql)', type: 'text' },
        { id: '5', label: 'location', value: '34.44.230.32:5432 / olympus', type: 'code' },
    ];

    const profileData: DataReadoutItem[] = [
        { id: '1', label: 'role', value: 'Security Operator', type: 'badge', badgeVariant: 'primary' },
        { id: '2', label: 'department', value: 'Infrastructure', type: 'text' },
        { id: '3', label: 'clearance level', value: 'Level 6 (L6)', type: 'text' },
        { id: '4', label: 'last access', value: '2026-03-28 08:14:00', type: 'code' },
    ];

    const systemData: DataReadoutItem[] = [
        { id: '1', label: 'cpu / mem', value: '42.1% / 2.1GB', type: 'badge', badgeVariant: 'secondary' },
        { id: '2', label: 'disk ops / io', value: '1.2M reads / 400K writes', type: 'text' },
        { id: '3', label: 'redis cache hit', value: '99.98%', type: 'badge', badgeVariant: 'success' },
        { id: '4', label: 'docker image', value: 'gcr.io/zap-infra/blast-engine:v5.0.2', type: 'code' },
    ];

    const inheritanceData: DataReadoutItem[] = [
        { id: '1', label: 'colors (l1):', tags: ['bg-surface-variant', 'border-outline-variant'], type: 'tags', tagColor: 'primary' },
 { id: '2', label: 'typography (l1/l2):', tags: ['text-label-medium tracking-widest', 'font-mono text-transform-tertiary text-label-medium'], type: 'tags', tagColor: 'secondary' },
    ];

    const filterData: FilterGroup[] = [
        {
            id: 'level',
            title: 'LEVEL',
            options: [
                { id: 'info', label: 'info' },
                { id: 'warning', label: 'warning' },
                { id: 'error', label: 'error' },
            ],
        },
        {
            id: 'service',
            title: 'SERVICE',
            options: [
                { id: 'api-gateway', label: 'api-gateway' },
                { id: 'cache-service', label: 'cache-service' },
                { id: 'database', label: 'database' },
                { id: 'auth-service', label: 'auth-service' },
                { id: 'payment-service', label: 'payment-service' },
                { id: 'search-service', label: 'search-service' },
            ],
        },
        {
            id: 'status',
            title: 'STATUS',
            options: [
                { id: '200', label: '200' },
                { id: 'warning', label: 'warning' },
                { id: '503', label: '503' },
                { id: '201', label: '201' },
                { id: '502', label: '502' },
                { id: '429', label: '429' },
            ],
        }
    ];

    const [selectedFilters, setSelectedFilters] = React.useState<Record<string, Record<string, boolean>>>({});

    const handleFilterToggle = (groupId: string, optionId: string) => {
        setSelectedFilters(prev => ({
            ...prev,
            [groupId]: {
                ...prev[groupId],
                [optionId]: !prev[groupId]?.[optionId]
            }
        }));
    };

    // Map selected state onto the filter group data
    const runtimeFilterData = filterData.map(group => ({
        ...group,
        options: group.options.map(opt => ({
            ...opt,
            selected: !!selectedFilters[group.id]?.[opt.id]
        }))
    }));

    const [layoutMode, setLayoutMode] = React.useState<'default' | 'transparent' | 'pill'>('default');

    const getAccordionProps = () => {
        switch(layoutMode) {
            case 'transparent':
                return {
                    accordion: "bg-transparent w-full",
                    item: "border-none",
 trigger: "px-4 py-3 hover:no-underline hover:bg-surface-variant font-mono text-transform-tertiary text-body-small font-bold tracking-tight text-on-surface",
                    content: "bg-transparent px-4 pb-4 pt-1",
                    variant: "default" as const
                };
            case 'pill':
                return {
                    accordion: "bg-transparent w-full space-y-2",
                    item: "border-none",
 trigger: "px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-transform-tertiary text-label-medium tracking-widest text-on-surface font-bold transition-colors m-0",
                    content: "bg-transparent px-4 pb-4 pt-2",
                    variant: "navigation" as const
                };
            case 'default':
            default:
                return {
                    accordion: "bg-surface-container rounded-t-lg border border-outline-variant shadow-sm w-full",
                    item: "border-none",
 trigger: "px-4 py-3 hover:no-underline hover:bg-surface-variant font-mono text-transform-tertiary text-body-small font-bold tracking-tight text-on-surface",
                    content: "bg-surface rounded-b-lg px-4 pb-4 pt-1",
                    variant: "default" as const
                };
        }
    };

    const layout = getAccordionProps();

    return (
        <ComponentSandboxTemplate
            componentName="DataReadout"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/genesis/molecules/data-readout.tsx"
            importPath="@/genesis/molecules/data-readout"
            publishPayload={{ '--zap-accordion-layout': layoutMode }}
            onLoadedVariables={(vars) => {
                if (vars['--zap-accordion-layout']) {
                    const saved = vars['--zap-accordion-layout'].trim();
                    if (['default', 'transparent', 'pill'].includes(saved)) {
                        setLayoutMode(saved as 'default' | 'transparent' | 'pill');
                    }
                }
            }}
            inspectorControls={
                <div className="flex flex-col gap-6 w-full">
                    <div className="flex flex-col gap-2">
                        <label className="text-label-small font-bold tracking-widest text-on-surface-variant uppercase">
                            LAYOUT MODE
                        </label>
                        <div className="flex p-0.5 bg-surface-variant/50 rounded-md border border-outline-variant/50 w-full">
                            <button 
                                type="button"
                                onClick={() => setLayoutMode('default')}
                                className={`flex-1 p-1.5 py-2 overflow-hidden rounded-[4px] flex items-center justify-center gap-1.5 text-label-small font-bold uppercase tracking-widest transition-all ${layoutMode === 'default' ? 'bg-surface shadow-sm text-on-surface ring-1 ring-black/5' : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5'}`}
                            >
                                <Icon name="view_agenda" size={14} />
                                <span className="truncate">Default</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setLayoutMode('transparent')}
                                className={`flex-1 p-1.5 py-2 overflow-hidden rounded-[4px] flex items-center justify-center gap-1.5 text-label-small font-bold uppercase tracking-widest transition-all ${layoutMode === 'transparent' ? 'bg-surface shadow-sm text-on-surface ring-1 ring-black/5' : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5'}`}
                            >
                                <Icon name="layers_clear" size={14} />
                                <span className="truncate">Trans</span>
                            </button>
                            <button 
                                type="button"
                                onClick={() => setLayoutMode('pill')}
                                className={`flex-1 p-1.5 py-2 overflow-hidden rounded-[4px] flex items-center justify-center gap-1.5 text-label-small font-bold uppercase tracking-widest transition-all ${layoutMode === 'pill' ? 'bg-surface shadow-sm text-on-surface ring-1 ring-black/5' : 'text-on-surface-variant hover:text-on-surface hover:bg-on-surface/5'}`}
                            >
                                <Icon name="smart_button" size={14} />
                                <span className="truncate">Pill</span>
                            </button>
                        </div>
                    </div>
                </div>
            }
            foundationInheritance={{
                colorTokens: ['bg-surface-variant', 'border-outline-variant'],
 typographyScales: ['text-label-medium tracking-widest', 'font-mono text-transform-tertiary text-label-medium'],
            }}
            platformConstraints={{
                web: 'Responsive container block. Scrolls horizontally on long code values.',
                mobile: 'Scrolls horizontally.'
            }}
            foundationRules={[
                'Data Terminal aesthetic requires tracking-widest lowercase labels.',
                'Code values must use monospace font.',
            ]}
        >
            
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="data-readout" title="DataReadout Sandbox" description="Interactive components for DataReadout" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex flex-col gap-10 py-8 items-center bg-surface-container-lowest">

                {/* ── VARIANT 1: Data Terminal */}
                <div className="w-full max-w-sm flex flex-col gap-2">
                    <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                        VARIANT — DATA TERMINAL
                    </span>
                    <Accordion type="single" collapsible defaultValue="item-1" className={layout.accordion} variant={layout.variant}>
                        <AccordionItem value="item-1" className={layout.item}>
                            <AccordionTrigger className={layout.trigger}>
                                <div className="flex items-center gap-2">
                                    <Icon name="database" size={16} />
                                    DATA TERMINAL
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className={layout.content}>
                                <DataReadout items={terminalData} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* ── VARIANT 2: Identity Record */}
                <div className="w-full max-w-sm flex flex-col gap-2">
                    <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                        VARIANT — USER PROFILE
                    </span>
                    <Accordion type="single" collapsible defaultValue="item-1" className={layout.accordion} variant={layout.variant}>
                        <AccordionItem value="item-1" className={layout.item}>
                            <AccordionTrigger className={layout.trigger}>
                                <div className="flex items-center gap-2">
                                    <Icon name="person" size={16} />
                                    IDENTITY RECORD
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className={layout.content}>
                                <DataReadout items={profileData} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* ── VARIANT 3: Telemetry */}
                <div className="w-full max-w-sm flex flex-col gap-2">
                    <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                        VARIANT — SYSTEM SPEC
                    </span>
                    <Accordion type="single" collapsible defaultValue="item-1" className={layout.accordion} variant={layout.variant}>
                        <AccordionItem value="item-1" className={layout.item}>
                            <AccordionTrigger className={layout.trigger}>
                                <div className="flex items-center gap-2">
                                    <Icon name="memory" size={16} />
                                    TELEMETRY
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className={layout.content}>
                                <DataReadout items={systemData} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* ── VARIANT 4: Data Filter */}
                <div className="w-full max-w-sm flex flex-col gap-2">
 <span className="text-label-small font-bold tracking-widest text-on-surface-variant font-dev text-transform-tertiary px-1">
                        VARIANT — DATA FILTER
                    </span>
                    <Accordion type="single" collapsible defaultValue="item-1" className={layout.accordion} variant={layout.variant}>
                        <AccordionItem value="item-1" className={layout.item}>
                            <AccordionTrigger className={layout.trigger}>
                                <div className="flex items-center gap-2">
                                    <Icon name="filter_list" size={16} />
                                    FILTERS
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className={layout.content}>
                                <DataFilter 
                                    groups={runtimeFilterData}
                                    onToggle={handleFilterToggle}
                                />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                {/* ── VARIANT 5: Inheritance Map */}
                <div className="w-full max-w-sm flex flex-col gap-2">
                    <span className="text-label-small font-bold tracking-widest text-on-surface-variant text-transform-secondary font-dev text-transform-tertiary px-1">
                        VARIANT — INHERITANCE MAP
                    </span>
                    <Accordion type="single" collapsible defaultValue="item-1" className={layout.accordion} variant={layout.variant}>
                        <AccordionItem value="item-1" className={layout.item}>
                            <AccordionTrigger className={layout.trigger}>
                                <div className="flex items-center gap-2">
                                    <Icon name="account_tree" size={16} />
                                    INHERITANCE MAP
                                </div>
                            </AccordionTrigger>
                            <AccordionContent className={layout.content}>
                                <DataReadout items={inheritanceData} />
                            </AccordionContent>
                        </AccordionItem>
                    </Accordion>
                </div>

                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}
