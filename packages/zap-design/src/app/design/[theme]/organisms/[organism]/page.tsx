'use client';

// Dynamic Organism & Layout Page — Catch-All Route
// Renders at /design/[theme]/organisms/[organism]
// Resolves an organism/template from the registry + validates against theme config.

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTheme } from '../../../../../themes/registry';
import { getOrganism, getOrganismsForTheme } from '../../../../../themes/organism-registry';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';

export default function DynamicOrganismPage() {
    const params = useParams();
    const themeId = params.theme as string;
    const organismId = params.organism as string;
    const themeConfig = getTheme(themeId);
    const organismEntry = getOrganism(organismId);

    // ── Theme not found ─────────────────────────────────────────────────
    if (!themeConfig) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Icon name="error_outline" size={48} className="text-destructive mx-auto" />
                    <h2 className="text-xl font-bold text-foreground">Theme Not Found</h2>
                    <p className="text-sm text-muted-foreground">
                        Theme <code className="font-dev text-transform-tertiary text-primary">{themeId}</code> is not registered.
                    </p>
                    <Link
                        href="/design"
                        className="inline-block text-xs font-bold px-4 py-2 rounded-lg bg-primary text-on-primary hover:opacity-90 transition-opacity"
                    >
                        Back to Design
                    </Link>
                </div>
            </div>
        );
    }

    // ── Organism not found in registry ───────────────────────────────────
    if (!organismEntry) {
        const available = getOrganismsForTheme(themeConfig.features.hasOrganisms);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
                <Icon name="search_off" size={64} className="text-muted-foreground/30" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        <code className="font-dev text-transform-tertiary text-primary">{organismId}</code> not found
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        This layout template or organism doesn&apos;t exist in the registry.
                    </p>
                </div>
                {available.length > 0 && (
                    <div className="space-y-3 w-full max-w-lg">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                            AVAILABLE FOR {themeConfig.name.toUpperCase()}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {available.map(org => (
                                <Link
                                    key={org.id}
                                    href={`/design/${themeId}/organisms/${org.id}`}
                                    className="text-xs font-bold px-3 py-2 rounded-lg bg-layer-panel border border-outline-variant/30 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {org.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Organism not enabled for this theme ──────────────────────────────
    const isEnabledForTheme = themeConfig.features.hasOrganisms.includes(organismId);

    if (!isEnabledForTheme) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
                <Icon name="block" size={64} className="text-muted-foreground/30" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        Not Enabled for {themeConfig.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        <code className="font-dev text-transform-tertiary text-primary">{organismEntry.label}</code> exists in the registry
                        but isn&apos;t enabled for <strong>{themeConfig.name}</strong>.
                        Add <code className="font-dev text-transform-tertiary">&quot;{organismId}&quot;</code> to <code className="font-dev text-transform-tertiary">hasOrganisms</code> in the registry.
                    </p>
                </div>
            </div>
        );
    }

    // ── Render the organism/template ──────────────────────────────────────
    const OrganismComponent = organismEntry.component;

    // 'page' type: self-contained with their own structural layout (AppShell, etc.)
    if (organismEntry.type === 'page') {
        return <OrganismComponent />;
    }

    // 'showcase' type: body-only component, we wrap it in a standard layout
    const isDbConnected = organismId === 'user-management' || organismId === 'system-logs';

    return (
        <ComponentSandboxTemplate
            componentName={organismEntry.label}
            tier={organismEntry.tier}
            status={organismEntry.status}
            filePath={`src/app/design/[theme]/organisms/${organismId}`}
            importPath={`@/themes/organism-registry`}
            terminalData={isDbConnected ? {
                databaseType: "PostgreSQL (Cloud SQL)",
                databaseLocation: "34.44.230.32:5432 / olympus"
            } : undefined}
            foundationInheritance={{
                colorTokens: ['Theme tokens via registry'],
                typographyScales: ['Theme typography via registry'],
            }}
            platformConstraints={{
                web: 'Rendered via dynamic [theme]/organisms/[organism] route.',
                mobile: 'Responsive — adapts to viewport.',
            }}
            foundationRules={[
                'Component rendered from shared organism registry.',
                `Theme: ${themeConfig.name} (${themeConfig.engine})`,
            ]}
        >
            <div className="w-full flex flex-col gap-8 py-8">
                <OrganismComponent />
            </div>
        </ComponentSandboxTemplate>
    );
}
