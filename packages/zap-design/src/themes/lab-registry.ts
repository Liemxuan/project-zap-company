import dynamic from 'next/dynamic';
import { type ComponentType } from 'react';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

export type LabStatus = 'Verified' | 'In Progress' | 'Beta' | 'Legacy';

export interface LabEntry {
    id: string;
    label: string;
    tier: string;
    status: LabStatus;
    /** Lazy-loaded component — standard sandbox page for the lab */
    component: ComponentType;
    icon?: string;
    category?: string;
}

// ─── DYNAMIC IMPORTS ────────────────────────────────────────────────────────────

const ColorArchitectLab = dynamic(() => import('../genesis/labs/ColorArchitectLab'), { ssr: false });
const TypographyArchitectLab = dynamic(() => import('../genesis/labs/TypographyArchitectLab'), { ssr: false });
const SwarmLab = dynamic(() => import('../genesis/labs/SwarmLab'), { ssr: false });

// ─── REGISTRY ───────────────────────────────────────────────────────────────────

export const LAB_REGISTRY: Record<string, LabEntry> = {
    'color-architect':      { id: 'color-architect',      label: 'Color Architect',       tier: 'L7 LAB', status: 'Verified', component: ColorArchitectLab,      icon: 'palette',      category: 'Design Tools' },
    'typography-architect': { id: 'typography-architect', label: 'Typography Architect',  tier: 'L7 LAB', status: 'Verified', component: TypographyArchitectLab, icon: 'text_fields',  category: 'Design Tools' },
    'swarm':                { id: 'swarm',                label: 'Swarm Intelligence',    tier: 'L7 LAB', status: 'Verified', component: SwarmLab,               icon: 'group_work',   category: 'Monitoring' },
};

// ─── HELPERS ────────────────────────────────────────────────────────────────────

export function getLab(labId: string): LabEntry | undefined {
    return LAB_REGISTRY[labId];
}

export function getAllLabs(): LabEntry[] {
    return Object.values(LAB_REGISTRY);
}

export function getLabsForTheme(labIds: string[]): LabEntry[] {
    return labIds
        .map(id => LAB_REGISTRY[id])
        .filter((entry): entry is LabEntry => entry !== undefined);
}

export function getLabsByCategory(labIds: string[]): Record<string, LabEntry[]> {
    const labs = getLabsForTheme(labIds);
    return labs.reduce((acc, f) => {
        const cat = f.category || 'Other';
        if (!acc[cat]) acc[cat] = [];
        acc[cat].push(f);
        return acc;
    }, {} as Record<string, LabEntry[]>);
}
