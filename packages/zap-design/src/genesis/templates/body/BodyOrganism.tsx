'use client';

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTheme, FOUNDATION_PAGES } from '../../../themes/registry';
import { Icon } from '../../atoms/icons/Icon';
import { Card } from '../../atoms/surfaces/card';

export function BodyOrganism() {
    const params = useParams();
    const themeId = (params.theme as string) || 'core';
    const theme = getTheme(themeId);

    if (!theme) return null;

    return (
        <div className="w-full flex flex-col pt-0 min-h-full">
            {/* Theme Description */}
            <div className="bg-layer-dialog rounded-xl p-6 border border-outline-variant/20 mb-8">
                <p className="text-sm text-on-surface leading-relaxed">
                    {theme.description}
                </p>
                <div className="flex gap-3 mt-4">
 <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground bg-on-surface/5 px-2 py-1 rounded">
                        Engine: {theme.engine}
                    </span>
 <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground bg-on-surface/5 px-2 py-1 rounded">
                        Shell: {theme.layout.shell}
                    </span>
 <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground bg-on-surface/5 px-2 py-1 rounded">
                        Sidebar: {theme.layout.sidebar}
                    </span>
                </div>
            </div>

            {/* Foundation Pages Grid */}
            <section className="mb-8">
                <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight uppercase">Foundation Pages</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {FOUNDATION_PAGES.map((page: { id: string, label: string, icon: string }) => (
                        <Link key={page.id} href={`/design/${themeId}/${page.id}`}>
                            <Card className="bg-layer-panel p-5 group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform shadow-[3px_3px_0px_0px_var(--color-card-border)] hover:shadow-[5px_5px_0px_0px_var(--color-card-border)]">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Icon name={page.icon} size={20} className="text-primary" />
                                    </div>
                                    <div className="min-w-0 flex-1">
                                        <p className="text-sm font-bold text-foreground truncate lowercase">{page.label}</p>
                                        <p className="text-[10px] font-dev text-transform-tertiary text-muted-foreground truncate">
                                            /design/{themeId}/{page.id}
                                        </p>
                                    </div>
                                </div>
                            </Card>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Molecules (if theme has them) */}
            {theme.features.hasMolecules.length > 0 && (
                <section className="mb-8">
                    <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight uppercase">
                        Molecules ({theme.features.hasMolecules.length})
                    </h3>
                    <div className="flex flex-wrap gap-2">
                        {theme.features.hasMolecules.map((mol: string) => (
                            <Link
                                key={mol}
                                href={`/design/${themeId}/molecules/${mol}`}
                                className="text-xs font-bold px-3 py-2 rounded-lg bg-layer-panel border border-outline-variant/30 text-foreground hover:bg-primary/10 hover:text-primary transition-colors lowercase"
                            >
                                {mol}
                            </Link>
                        ))}
                    </div>
                </section>
            )}

            {/* Token Summary */}
            <section>
                <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight uppercase">L1-L5 Architecture Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-layer-panel rounded-xl p-5 border border-outline-variant/20">
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground mb-2">COLORS</p>
                        <p className="text-sm text-foreground">Source: <code className="font-dev text-transform-tertiary text-primary">{theme.tokens.colors.sourceColor}</code></p>
                        <p className="text-sm text-foreground">Scheme: <code className="font-dev text-transform-tertiary text-primary">{theme.tokens.colors.scheme}</code></p>
                    </div>
                    <div className="bg-layer-panel rounded-xl p-5 border border-outline-variant/20">
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground mb-2">TYPOGRAPHY</p>
                        <p className="text-sm text-foreground">Primary: <code className="font-dev text-transform-tertiary text-primary">{theme.tokens.typography.primaryFont.split(',')[0]}</code></p>
                        <p className="text-sm text-foreground">Secondary: <code className="font-dev text-transform-tertiary text-primary">{theme.tokens.typography.secondaryFont.split(',')[0]}</code></p>
                    </div>
                    <div className="bg-layer-panel rounded-xl p-5 border border-outline-variant/20">
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground mb-2">GEOMETRY</p>
                        <p className="text-sm text-foreground">Radius: <code className="font-dev text-transform-tertiary text-primary">{theme.tokens.geometry.borderRadius}</code></p>
                        <p className="text-sm text-foreground">Border: <code className="font-dev text-transform-tertiary text-primary">{theme.tokens.geometry.cardBorderWidth}px</code></p>
                    </div>
                    <div className="bg-layer-panel rounded-xl p-5 border border-outline-variant/20">
                        <p className="text-[10px] font-black tracking-widest text-muted-foreground mb-2">MOTION</p>
                        <p className="text-sm text-foreground">Curve: <code className="font-dev text-transform-tertiary text-primary">{theme.tokens.motion.curve}</code></p>
                        <p className="text-sm text-foreground">Duration: <code className="font-dev text-transform-tertiary text-primary">{theme.tokens.motion.durationMs}ms</code></p>
                    </div>
                </div>
            </section>
        </div>
    );
}

