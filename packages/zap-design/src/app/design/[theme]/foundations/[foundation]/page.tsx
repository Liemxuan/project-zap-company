'use client';

// Dynamic Foundation Page — Catch-All Route
// Renders at /design/[theme]/foundations/[foundation]
// Resolves a foundation from the registry + validates against theme config.

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTheme } from '../../../../../themes/registry';
import { getFoundation, getFoundationsForTheme } from '../../../../../themes/foundation-registry';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';

export default function DynamicFoundationPage() {
    const params = useParams();
    const themeId = params.theme as string;
    const foundationId = params.foundation as string;
    const themeConfig = getTheme(themeId);
    const foundationEntry = getFoundation(foundationId);

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

    // ── Foundation not found in registry ───────────────────────────────────
    if (!foundationEntry) {
        const available = getFoundationsForTheme(themeConfig.features.hasFoundations);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
                <Icon name="search_off" size={64} className="text-muted-foreground/30" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        <code className="font-dev text-transform-tertiary text-primary">{foundationId}</code> not found
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        This foundation doesn&apos;t exist in the registry.
                    </p>
                </div>
                {available.length > 0 && (
                    <div className="space-y-3 w-full max-w-lg">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                            AVAILABLE FOR {themeConfig.name.toUpperCase()}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {available.map(found => (
                                <Link
                                    key={found.id}
                                    href={`/design/${themeId}/foundations/${found.id}`}
                                    className="text-xs font-bold px-3 py-2 rounded-lg bg-layer-panel border border-outline-variant/30 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {found.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Foundation not enabled for this theme ──────────────────────────────
    const isEnabledForTheme = themeConfig.features.hasFoundations.includes(foundationId);

    if (!isEnabledForTheme) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
                <Icon name="block" size={64} className="text-muted-foreground/30" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        Not Enabled for {themeConfig.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        <code className="font-dev text-transform-tertiary text-primary">{foundationEntry.label}</code> exists in the registry
                        but isn&apos;t enabled for <strong>{themeConfig.name}</strong>.
                        Add <code className="font-dev text-transform-tertiary">&quot;{foundationId}&quot;</code> to <code className="font-dev text-transform-tertiary">hasFoundations</code> in the registry.
                    </p>
                </div>
            </div>
        );
    }

    // ── Render the foundation ──────────────────────────────────────────────
    const FoundationComponent = foundationEntry.component;
    return <FoundationComponent />;
}
