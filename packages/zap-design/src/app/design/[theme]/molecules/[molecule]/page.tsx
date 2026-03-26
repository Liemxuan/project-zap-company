'use client';

// Dynamic Molecule Page — Catch-All Route
// Renders at /design/[theme]/molecules/[molecule]
// Resolves a molecule from the registry + validates against theme config.

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTheme } from '../../../../../themes/registry';
import { getMolecule, getMoleculesForTheme } from '../../../../../themes/molecule-registry';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';

export default function DynamicMoleculePage() {
    const params = useParams();
    const themeId = params.theme as string;
    const moleculeId = params.molecule as string;
    const themeConfig = getTheme(themeId);
    const moleculeEntry = getMolecule(moleculeId);

    // ── Theme not found ─────────────────────────────────────────────────
    if (!themeConfig) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center space-y-4">
                    <Icon name="error_outline" size={48} className="text-destructive mx-auto" />
                    <h2 className="text-xl font-bold text-foreground">Theme Not Found</h2>
                    <p className="text-sm text-muted-foreground">
                        Theme <code className="font-dev text-primary">{themeId}</code> is not registered.
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

    // ── Molecule not found in registry ───────────────────────────────────
    if (!moleculeEntry) {
        const available = getMoleculesForTheme(themeConfig.features.hasMolecules);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
                <Icon name="search_off" size={64} className="text-muted-foreground/30" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        <code className="font-dev text-primary">{moleculeId}</code> not found
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        This molecule doesn&apos;t exist in the registry.
                    </p>
                </div>
                {available.length > 0 && (
                    <div className="space-y-3 w-full max-w-lg">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                            AVAILABLE FOR {themeConfig.name.toUpperCase()}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {available.map(mol => (
                                <Link
                                    key={mol.id}
                                    href={`/design/${themeId}/molecules/${mol.id}`}
                                    className="text-xs font-bold px-3 py-2 rounded-lg bg-layer-panel border border-outline-variant/30 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {mol.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Molecule not enabled for this theme ──────────────────────────────
    const isEnabledForTheme = themeConfig.features.hasMolecules.includes(moleculeId);

    if (!isEnabledForTheme) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
                <Icon name="block" size={64} className="text-muted-foreground/30" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        Not Enabled for {themeConfig.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        <code className="font-dev text-primary">{moleculeEntry.label}</code> exists in the registry
                        but isn&apos;t enabled for <strong>{themeConfig.name}</strong>.
                        Add <code className="font-dev">&quot;{moleculeId}&quot;</code> to <code className="font-dev">hasMolecules</code> in the registry.
                    </p>
                </div>
            </div>
        );
    }

    // ── Render the molecule ──────────────────────────────────────────────
    const MoleculeComponent = moleculeEntry.component;

    // 'page' type: self-contained with their own layout (ComponentSandboxTemplate)
    if (moleculeEntry.type === 'page') {
        return <MoleculeComponent />;
    }

    // 'showcase' type: body-only component, we wrap it in a standard layout
    return (
        <ComponentSandboxTemplate
            componentName={moleculeEntry.label}
            tier={moleculeEntry.tier}
            status={moleculeEntry.status}
            filePath={`src/app/design/[theme]/molecules/${moleculeId}`}
            importPath={`@/themes/molecule-registry`}
            foundationInheritance={{
                colorTokens: ['Theme tokens via registry'],
                typographyScales: ['Theme typography via registry'],
            }}
            platformConstraints={{
                web: 'Rendered via dynamic [theme]/molecules/[molecule] route.',
                mobile: 'Responsive — adapts to viewport.',
            }}
            foundationRules={[
                'Component rendered from shared molecule registry.',
                `Theme: ${themeConfig.name} (${themeConfig.engine})`,
            ]}
        >
            <div className="w-full flex flex-col gap-8 py-8">
                <MoleculeComponent />
            </div>
        </ComponentSandboxTemplate>
    );
}
