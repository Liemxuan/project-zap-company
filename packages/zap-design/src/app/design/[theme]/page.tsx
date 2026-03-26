'use client';

/**
 * Dynamic Theme Home Page
 *
 * Renders at /design/[theme]/ — shows an overview of the theme
 * with quick links to all foundation pages and available features.
 */

import React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { getTheme, FOUNDATION_PAGES } from '../../../themes/registry';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { Card } from '../../../genesis/atoms/surfaces/card';
import { Canvas } from '../../../genesis/atoms/surfaces/canvas';
import { CanvasBody } from '../../../zap/layout/CanvasBody';
import { DebugAuditor } from '../../../components/debug/auditor';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';

export default function ThemeHomePage() {
    const params = useParams();
    const themeId = params.theme as string;
    const theme = getTheme(themeId);

    if (!theme) return null;

    return (
        <DebugAuditor
            componentName={`${theme.name} Home`}
            tier="L2 THEME"
            status="Verified"
            filePath="src/app/design/[theme]/page.tsx"
            importPath="@/themes/registry"
        >
            <Canvas className="transition-all duration-300 origin-center flex flex-col pt-0 min-h-full">
                <ThemeHeader
                    title="Materials"
                    badge={`Engine: ${theme.engine.toUpperCase()}`}
                    breadcrumb={`design / ${themeId}`}
                    liveIndicator={true}
                />

                <CanvasBody coverTitle="Materials" coverBadge={`Theme: ${themeId}`}>
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
                        <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">Foundation Pages</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {FOUNDATION_PAGES.map(page => (
                                <Link key={page.id} href={`/design/${themeId}/${page.id}`}>
                                    <Card className="bg-layer-panel p-5 group hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform shadow-[3px_3px_0px_0px_var(--color-card-border)] hover:shadow-[5px_5px_0px_0px_var(--color-card-border)]">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                                <Icon name={page.icon} size={20} className="text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{page.label}</p>
                                                <p className="text-[10px] font-dev text-transform-tertiary text-muted-foreground">
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
                            <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">
                                Molecules ({theme.features.hasMolecules.length})
                            </h3>
                            <div className="flex flex-wrap gap-2">
                                {theme.features.hasMolecules.map(mol => (
                                    <Link
                                        key={mol}
                                        href={`/design/${themeId}/molecules/${mol}`}
                                        className="text-xs font-bold px-3 py-2 rounded-lg bg-layer-panel border border-outline-variant/30 text-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                                    >
                                        {mol}
                                    </Link>
                                ))}
                            </div>
                        </section>
                    )}


                    {/* Token Summary */}
                    <section>
                        <h3 className="text-lg font-bold text-foreground mb-4 tracking-tight">Token Summary</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-layer-panel rounded-xl p-5 border border-outline-variant/20">
                                <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground mb-2">COLORS</p>
                                <p className="text-sm text-foreground">Source: <code className="font-dev text-primary">{theme.tokens.colors.sourceColor}</code></p>
                                <p className="text-sm text-foreground">Scheme: <code className="font-dev text-primary">{theme.tokens.colors.scheme}</code></p>
                            </div>
                            <div className="bg-layer-panel rounded-xl p-5 border border-outline-variant/20">
                                <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground mb-2">TYPOGRAPHY</p>
                                <p className="text-sm text-foreground">Primary: <code className="font-dev text-primary">{theme.tokens.typography.primaryFont.split(',')[0]}</code></p>
                                <p className="text-sm text-foreground">Secondary: <code className="font-dev text-primary">{theme.tokens.typography.secondaryFont.split(',')[0]}</code></p>
                            </div>
                            <div className="bg-layer-panel rounded-xl p-5 border border-outline-variant/20">
                                <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground mb-2">GEOMETRY</p>
                                <p className="text-sm text-foreground">Radius: <code className="font-dev text-primary">{theme.tokens.geometry.borderRadius}</code></p>
                                <p className="text-sm text-foreground">Border: <code className="font-dev text-primary">{theme.tokens.geometry.cardBorderWidth}px</code></p>
                            </div>
                            <div className="bg-layer-panel rounded-xl p-5 border border-outline-variant/20">
                                <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground mb-2">MOTION</p>
                                <p className="text-sm text-foreground">Curve: <code className="font-dev text-primary">{theme.tokens.motion.curve}</code></p>
                                <p className="text-sm text-foreground">Duration: <code className="font-dev text-primary">{theme.tokens.motion.durationMs}ms</code></p>
                            </div>
                        </div>
                    </section>
                </CanvasBody>
            </Canvas>
        </DebugAuditor>
    );
}
