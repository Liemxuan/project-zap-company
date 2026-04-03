'use client';

// Dynamic Atom Page — Catch-All Route
// Renders at /design/[theme]/atoms/[atom]
// Resolves an atom from the registry + validates against theme config.

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTheme } from '../../../../../themes/registry';
import { getAtom, getAtomsForTheme } from '../../../../../themes/atom-registry';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';

export default function DynamicAtomPage() {
    const params = useParams();
    const themeId = params.theme as string;
    const atomId = params.atom as string;
    const themeConfig = getTheme(themeId);
    const atomEntry = getAtom(atomId);

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

    // ── Atom not found in registry ───────────────────────────────────
    if (!atomEntry) {
        const available = getAtomsForTheme(themeConfig.features.hasAtoms);
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
                <Icon name="search_off" size={64} className="text-muted-foreground/30" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        <code className="font-dev text-transform-tertiary text-primary">{atomId}</code> not found
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        This atom doesn&apos;t exist in the registry.
                    </p>
                </div>
                {available.length > 0 && (
                    <div className="space-y-3 w-full max-w-lg">
                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground text-center">
                            AVAILABLE FOR {themeConfig.name.toUpperCase()}
                        </p>
                        <div className="flex flex-wrap gap-2 justify-center">
                            {available.map(atom => (
                                <Link
                                    key={atom.id}
                                    href={`/design/${themeId}/atoms/${atom.id}`}
                                    className="text-xs font-bold px-3 py-2 rounded-lg bg-layer-panel border border-outline-variant/30 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                >
                                    {atom.label}
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    }

    // ── Atom not enabled for this theme ──────────────────────────────
    const isEnabledForTheme = themeConfig.features.hasAtoms.includes(atomId);

    if (!isEnabledForTheme) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-6 px-4">
                <Icon name="block" size={64} className="text-muted-foreground/30" />
                <div className="text-center space-y-2">
                    <h2 className="text-xl font-bold text-foreground">
                        Not Enabled for {themeConfig.name}
                    </h2>
                    <p className="text-sm text-muted-foreground max-w-md">
                        <code className="font-dev text-transform-tertiary text-primary">{atomEntry.label}</code> exists in the registry
                        but isn&apos;t enabled for <strong>{themeConfig.name}</strong>.
                        Add <code className="font-dev text-transform-tertiary">&quot;{atomId}&quot;</code> to <code className="font-dev text-transform-tertiary">hasAtoms</code> in the registry.
                    </p>
                </div>
            </div>
        );
    }

    // ── Render the atom ──────────────────────────────────────────────
    const AtomComponent = atomEntry.component;
    return <AtomComponent />;
}
