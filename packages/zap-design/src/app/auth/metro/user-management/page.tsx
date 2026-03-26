'use client';

import React, { useState, useEffect } from 'react';
import { AppShell } from '../../../../zap/layout/AppShell';
import { Inspector } from '../../../../zap/layout/Inspector';
import { useTheme } from '../../../../components/ThemeContext';
import { AuthUserManagementView } from '@/genesis/organisms/auth/AuthUserManagementView';
import { ThemeHeader } from '../../../../genesis/molecules/layout/ThemeHeader';
import { InspectorAccordion } from '../../../../zap/organisms/laboratory/InspectorAccordion';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { ContainerDevWrapper } from '../../../../components/dev/ContainerDevWrapper';

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
                <InspectorAccordion title="Data Filters" icon="filter_list" defaultOpen={true}>
                    <div className="flex h-full flex-col space-y-6 bg-layer-panel p-4 pt-2">
                        <div className="flex items-center justify-between">
                            <h3 className="text-sm font-display text-transform-primary font-semibold text-foreground">Active Filters</h3>
                            {activeFiltersCount > 0 && (
                                <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 text-xs text-primary">
                                    Clear
                                </Button>
                            )}
                        </div>
                        <div className="space-y-3">
                            <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                                Role Assignment
                            </p>
                            <div className="space-y-2">
                                {roles.map((role) => {
                                    const selected = filters.role.includes(role);
                                    return (
                                        <motion.button
                                            key={role}
                                            type="button"
                                            whileHover={{ x: 2 }}
                                            onClick={() => toggleFilter("role", role)}
                                            aria-pressed={selected}
                                            className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-body text-transform-secondary ${selected
                                                ? "border-primary bg-primary/10 text-primary"
                                                : "border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40"
                                                }`}
                                        >
                                            <span>{role}</span>
                                            {selected && <Check className="h-3.5 w-3.5" />}
                                        </motion.button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </InspectorAccordion>
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
            <div className="transition-all duration-300 origin-center flex flex-col pt-0 h-[calc(100vh-theme(spacing.16))] overflow-y-auto">
                <div className="w-full flex-none">
                    {header}
                </div>
                <div className="flex-1 relative flex items-start justify-center w-full h-full bg-layer-base overflow-hidden items-stretch px-12 py-8">
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
