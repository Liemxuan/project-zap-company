'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from 'zap-design/src/zap/layout/AppShell';
import { Inspector } from 'zap-design/src/zap/layout/Inspector';
import { useTheme } from 'zap-design/src/components/ThemeContext';
import { AuthUserManagementView } from 'zap-design/src/genesis/organisms/auth/AuthUserManagementView';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from 'zap-design/src/genesis/molecules/accordion';
import { DataFilter } from 'zap-design/src/genesis/molecules/data-filter';
import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { ContainerDevWrapper } from 'zap-design/src/components/dev/ContainerDevWrapper';
import { Heading } from "zap-design/src/genesis/atoms/typography/headings";
import { Text } from "zap-design/src/genesis/atoms/typography/text";

type Filters = {
    role: string[];
};

export default function AuthUserManagementPage() {
    const { inspectorState, setInspectorState, devMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState("");
    const [filters, setFilters] = useState<Filters>({ role: [] });
    const [roles, setRoles] = useState<string[]>([]);
    
    // Ensure inspector is closed strictly on mount to meet requirements
    useEffect(() => {
        setInspectorState('collapsed');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const isFilterActive = inspectorState === 'expanded';
    const activeFiltersCount = filters.role.length;

    const toggleFilter = (category: keyof Filters, value: string) => {
        const current = filters[category];
        const updated = current.includes(value)
            ? current.filter((entry) => entry !== value)
            : [...current, value];

        setFilters({
            ...filters,
            [category]: updated,
        });
    };

    const clearAll = () => setFilters({ role: [] });

    const handleFilterToggle = () => {
        setInspectorState(isFilterActive ? 'collapsed' : 'expanded');
    };

    const header = (
        <ThemeHeader
            title="User Vault"
            breadcrumb="Zap Auth / Master Identity Vault"
            badge="Identity Access Management"
            liveIndicator={true}
        />
    );

    const inspectorContent = (
        <ContainerDevWrapper
            showClassNames={devMode}
            identity={{
                displayName: `Global Filter Store`,
                filePath: "zap-design/src/app/auth/metro/user-management/page.tsx",
                type: "Inspector Panel",
                architecture: "ZAP // Data"
            }}
        >
            <div className="flex flex-col gap-0">
                <Accordion type="single" collapsible defaultValue="item-1" className="bg-transparent w-full space-y-2" variant="navigation">
                    <AccordionItem value="item-1" className="border-none m-0">
                        <AccordionTrigger className="px-4 py-3 flex items-center gap-2 rounded-lg bg-surface-variant hover:bg-surface-variant/80 font-mono text-[11px] uppercase tracking-widest text-on-surface font-bold transition-colors m-0 w-full min-w-0">
                            <div className="flex items-center gap-2 overflow-hidden flex-1 text-left min-w-0">
                                <Icon name="filter_list" size={16} className="shrink-0 text-on-surface-variant opacity-70 group-data-[state=open]:text-primary transition-colors" />
                                <span className="truncate">DATA FILTERS</span>
                            </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-transparent px-4 pb-4 pt-2">
                            <DataFilter
                                groups={[
                                    {
                                        id: 'role',
                                        title: 'ROLE ASSIGNMENT',
                                        options: roles.map(role => ({
                                            id: role,
                                            label: role,
                                            selected: filters.role.includes(role)
                                        }))
                                    }
                                ]}
                                onToggle={(groupId, optionId) => toggleFilter(groupId as any, optionId)}
                            />
                            {activeFiltersCount > 0 && (
                                <div className="mt-4 flex justify-between items-center border-t border-outline-variant/30 pt-3">
                                    <Text size="label-small" className="text-muted-foreground uppercase tracking-widest font-bold text-[9px]">
                                        {activeFiltersCount} Active
                                    </Text>
                                    <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 px-2 text-primary hover:bg-primary/10 transition-colors">
                                        <Text size="label-small" className="text-inherit uppercase tracking-widest font-bold text-[9px]">Clear</Text>
                                    </Button>
                                </div>
                            )}
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
            </div>
        </ContainerDevWrapper>
    );

    return (
        <AppShell
            inspector={
                <Inspector title="Vault Configuration" width={320}>
                    {inspectorContent}
                </Inspector>
            }
        >
            <div className="transition-all duration-300 origin-center flex flex-col pt-0 w-full h-full">
                <div className="w-full flex-none">
                    {header}
                </div>
                <div className="flex-1 relative flex justify-center w-full bg-layer-canvas overflow-hidden items-stretch px-12 pt-8 pb-0">
                    <AuthUserManagementView
                        searchQuery={searchQuery}
                        setSearchQuery={setSearchQuery}
                        filters={filters}
                        activeFiltersCount={activeFiltersCount}
                        onFilterToggle={handleFilterToggle}
                        isFilterActive={isFilterActive}
                        onRolesLoaded={setRoles}
                    />
                </div>
            </div>
        </AppShell>
    );
}
