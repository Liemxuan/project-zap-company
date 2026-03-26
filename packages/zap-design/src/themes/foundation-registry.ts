import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

export type FoundationStatus = 'Verified' | 'In Progress' | 'Beta' | 'Legacy';

export interface FoundationEntry {
    id: string;
    label: string;
    tier: string;
    status: FoundationStatus;
    /** Lazy-loaded component — standard sandbox page for the foundation */
    component: ComponentType;
    icon?: string;
    category?: string;
}

// ─── DYNAMIC IMPORTS ────────────────────────────────────────────────────────────

const Colors = dynamic(() => import('../zap/foundations/colors/index'), { ssr: false });
const Typography = dynamic(() => import('../zap/foundations/typography/index'), { ssr: false });
const Elevation = dynamic(() => import('../zap/foundations/elevation/index'), { ssr: false });
const Spacing = dynamic(() => import('../zap/foundations/spacing/index'), { ssr: false });
const BorderRadius = dynamic(() => import('../zap/foundations/border_radius/index'), { ssr: false });
const Icons = dynamic(() => import('../zap/foundations/icons/index'), { ssr: false });
const Layout = dynamic(() => import('../zap/foundations/layout/index'), { ssr: false });
const Overlay = dynamic(() => import('../zap/foundations/overlay/index'), { ssr: false });
const Motion = dynamic(() => import('../zap/foundations/motion/index'), { ssr: false });

// ─── REGISTRY ───────────────────────────────────────────────────────────────────

export const FOUNDATION_REGISTRY: Record<string, FoundationEntry> = {
    // L1: Tokens
    'colors':     { id: 'colors',     label: 'Colors',            tier: 'L1 TOKEN', status: 'Verified', component: Colors,     icon: 'palette',      category: 'L1: Tokens' },
    'typography': { id: 'typography', label: 'Typography',        tier: 'L1 TOKEN', status: 'Verified', component: Typography, icon: 'text_fields',  category: 'L1: Tokens' },
    'elevation':  { id: 'elevation',  label: 'Elevation/Shadows', tier: 'L1 TOKEN', status: 'Verified', component: Elevation,  icon: 'layers',       category: 'L1: Tokens' },
    'spacing':    { id: 'spacing',    label: 'Spacing/Sizing',    tier: 'L1 TOKEN', status: 'Verified', component: Spacing,    icon: 'space_bar',    category: 'L1: Tokens' },
    'border_radius': { id: 'border_radius', label: 'Border & Radius', tier: 'L1 TOKEN', status: 'Verified', component: BorderRadius, icon: 'rounded_corner', category: 'L1: Tokens' },

    // L2: Primitives
    'icons':      { id: 'icons',      label: 'Icons',             tier: 'L2 PRIMITIVE', status: 'Verified', component: Icons,   icon: 'insert_emoticon', category: 'L2: Primitives' },
    'layout':     { id: 'layout',     label: 'Layout Grid',       tier: 'L2 PRIMITIVE', status: 'Verified', component: Layout,  icon: 'grid_on',         category: 'L2: Primitives' },
    'overlay':    { id: 'overlay',    label: 'Overlays / Scrims', tier: 'L2 PRIMITIVE', status: 'Verified', component: Overlay, icon: 'flip_to_front',   category: 'L2: Primitives' },
    'motion':     { id: 'motion',     label: 'Motion',            tier: 'L2 PRIMITIVE', status: 'Verified', component: Motion,  icon: 'animation',       category: 'L2: Primitives' },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────────

export function getFoundation(foundationId: string): FoundationEntry | undefined {
    return FOUNDATION_REGISTRY[foundationId];
}

export function getAllFoundations(): FoundationEntry[] {
    return Object.values(FOUNDATION_REGISTRY);
}

export function getFoundationsForTheme(foundationIds: string[]): FoundationEntry[] {
    return foundationIds
        .map(id => FOUNDATION_REGISTRY[id])
        .filter((entry): entry is FoundationEntry => entry !== undefined);
}

export function getFoundationsByCategory(foundationIds: string[]): Record<string, FoundationEntry[]> {
    const foundations = getFoundationsForTheme(foundationIds);
    return foundations.reduce((acc, f) => {
        const cat = f.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(f);
        return acc;
    }, {} as Record<string, FoundationEntry[]>);
}
