'use client';

/**
 * CanvasBody — M3 Spatial Depth Layer System
 *
 * Enforces the ZAP layer hierarchy inside any page canvas.
 * Never use arbitrary bg-layer-* classes in page files — use these instead.
 *
 * Layer Stack:
 *   L1 Canvas (bg-layer-canvas)     ← outermost, from the Canvas atom
 *   L2 CoverCard (bg-layer-cover)   ← CanvasBody root — the main rounded content card
 *   L3 Section (bg-layer-panel)     ← CanvasBody.Section — each content section
 *   L4 DemoFrame (bg-layer-dialog)  ← CanvasBody.Demo — the demo/preview box
 *
 * M3 Token Map:
 *   bg-layer-canvas  = surface-container-low     (floor)
 *   bg-layer-cover   = surface-container         (cover card)
 *   bg-layer-panel   = surface-container-high    (panel)
 *   bg-layer-dialog  = surface-container-highest (dialog / demo)
 */

import React from 'react';
import { cn } from '../../lib/utils';
import { Wrapper } from '../../components/dev/Wrapper';

// ─────────────────────────────────────────────────────────────────────────────
// L2 — Cover Card Root
// ─────────────────────────────────────────────────────────────────────────────

interface CanvasBodyProps {
    children: React.ReactNode;
    className?: string;
    /** Override max content width. Default: 1080px */
    maxWidth?: string;
    /** Title shown in the Cover card header (e.g. "Elevation Sandbox") */
    coverTitle?: string;
    /** Architecture badge text shown in the pill (e.g. "L2 Cover // Elevation") */
    coverBadge?: string;
    /** Remove padding, backgrounds, and boundaries for full-bleed content */
    flush?: boolean;
}

export const CanvasBody = ({
    children,
    className,
    maxWidth = 'max-w-[1080px]',
    coverTitle,
    coverBadge,
    flush = false,
}: CanvasBodyProps) => {
    return (
        <Wrapper identity={{
            displayName: 'Canvas Body (L2)',
            filePath: 'zap/layout/CanvasBody.tsx',
            type: 'Layout Shell',
            architecture: 'L2: Cover',
        }} className="flex-1 w-full flex flex-col">
            {/* L1 → L2 transition: padding establishes the gap between canvas floor and cover card */}
            <div className={cn('flex-1 w-full flex flex-col items-center', !flush && 'p-6 md:p-12', className)}>
                {/* L2 Cover Card — bg-layer-cover = surface-container */}
                <div className={cn(
                    'w-full flex-1 flex flex-col',
                    !flush ? maxWidth : 'max-w-none',
                    !flush && 'bg-layer-cover',
                    'overflow-hidden',
                )}>
                    <div className={cn("flex-1 w-full flex flex-col gap-4", !flush && "p-8 md:p-12")}>
                        {/* Cover Card Header — only renders when title or badge is provided */}
                        {(coverTitle || coverBadge) && (
                            <>
                                <div className="flex items-center justify-between mb-4">
                                    {coverTitle && (
                                        <h2 className="text-2xl font-bold text-foreground tracking-tight">{coverTitle}</h2>
                                    )}
                                    {coverBadge && (
                                        <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-surface rounded-full border border-border shadow-sm">
                                            <span className="text-xs font-dev text-transform-tertiary font-medium text-surface-foreground tracking-wider">
                                                {coverBadge}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <hr className="border-border mb-4" />
                            </>
                        )}
                        {children}
                    </div>
                </div>
            </div>
        </Wrapper>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// L3 — Section Panel
// ─────────────────────────────────────────────────────────────────────────────

interface SectionProps {
    children: React.ReactNode;
    className?: string;
    /** Optional label shown above the section content */
    label?: string;
    /** Remove padding for full-bleed content */
    flush?: boolean;
}

const Section = ({ children, className, label, flush = false }: SectionProps) => {
    return (
        <Wrapper identity={{
            displayName: 'Canvas Section (L3)',
            filePath: 'zap/layout/CanvasBody.tsx',
            type: 'Layout Section',
            architecture: 'L3: Panel',
        }}>
            {/* L3 Panel — bg-layer-panel = surface-container-high */}
            <section className={cn(
                'w-full',
                // Hardcoded borders removed to allow --layer-3-border-* to govern
                'bg-layer-panel',
                !flush && 'p-6 md:p-8',
                className,
            )}>
                {label && (
                    <p className="text-[10px] font-bold tracking-widest text-on-surface-variant/60 font-dev text-transform-tertiary mb-4">
                        {label}
                    </p>
                )}
                {children}
            </section>
        </Wrapper>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// L4 — Demo Frame (the preview box)
// ─────────────────────────────────────────────────────────────────────────────

interface DemoProps {
    children: React.ReactNode;
    className?: string;
    /** Variant label shown above the demo box */
    label?: string;
    /** Min height of the demo area. Default: min-h-[280px] */
    minHeight?: string;
    /** Center content. Default: true */
    centered?: boolean;
}

const Demo = ({
    children,
    className,
    label,
    minHeight = 'min-h-[280px]',
    centered = true,
}: DemoProps) => {
    return (
        <Wrapper identity={{
            displayName: 'Demo Frame (L4)',
            filePath: 'zap/layout/CanvasBody.tsx',
            type: 'Demo Container',
            architecture: 'L4: Dialog',
        }}>
            <div className="flex flex-col gap-2 w-full">
                {label && (
                    <span className="text-[10px] font-bold tracking-widest text-on-surface-variant/60 font-dev text-transform-tertiary px-1">
                        {label}
                    </span>
                )}
                {/* L4 Dialog — bg-layer-dialog = surface-container-highest */}
                <div className={cn(
                    'w-full',
                    // Hardcoded borders removed to allow --layer-4-border-* to govern
                    'bg-layer-dialog',
                    'shadow-sm',
                    minHeight,
                    centered && 'flex flex-col items-center justify-center',
                    'p-8 md:p-12',
                    className,
                )}>
                    {children}
                </div>
            </div>
        </Wrapper>
    );
};

// ─────────────────────────────────────────────────────────────────────────────
// Attach sub-components
// ─────────────────────────────────────────────────────────────────────────────

CanvasBody.Section = Section;
CanvasBody.Demo = Demo;
