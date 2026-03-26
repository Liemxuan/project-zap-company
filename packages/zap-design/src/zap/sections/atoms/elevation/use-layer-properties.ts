'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import { useParams } from 'next/navigation';

// ─── TYPES ──────────────────────────────────────────────────────────────────

export interface LayerProps {
    bgToken: string;
    bgOpacity: number;       // 0–100
    tintOpacity: number;     // 0–20
}

export interface LayerPropertiesState {
    layers: Record<number, LayerProps>; // keyed by L0–L5
}

// ─── DEFAULTS ───────────────────────────────────────────────────────────────

export const DEFAULT_LAYER_PROPS: LayerProps = {
    bgToken: '',
    bgOpacity: 100,
    tintOpacity: 0,
};

const LAYER_IDS = [0, 1, 2, 3, 4, 5] as const;

const DEFAULT_STATE: LayerPropertiesState = {
    layers: Object.fromEntries(LAYER_IDS.map(id => [id, { ...DEFAULT_LAYER_PROPS }])),
};

// ─── BG TOKEN OPTIONS ───────────────────────────────────────────────────────

export const BG_TOKEN_OPTIONS = [
    { label: 'Layer Default', value: '' },
    { label: 'Surface', value: 'surface' },
    { label: 'Surface Container Lowest', value: 'surface-container-lowest' },
    { label: 'Surface Container Low', value: 'surface-container-low' },
    { label: 'Surface Container', value: 'surface-container' },
    { label: 'Surface Container High', value: 'surface-container-high' },
    { label: 'Surface Container Highest', value: 'surface-container-highest' },
    { label: 'Primary Container', value: 'primary-container' },
    { label: 'Secondary Container', value: 'secondary-container' },
    { label: 'Tertiary Container', value: 'tertiary-container' },
];

// ─── LAYER NAMES ────────────────────────────────────────────────────────────

export const LAYER_NAMES: Record<number, { name: string; token: string; icon: string }> = {
    0: { name: 'L0 · Base', token: 'bg-layer-base', icon: 'grid_view' },
    1: { name: 'L1 · Canvas', token: 'bg-layer-canvas', icon: 'dashboard' },
    2: { name: 'L2 · Cover', token: 'bg-layer-cover', icon: 'crop_square' },
    3: { name: 'L3 · Panels', token: 'bg-layer-panel', icon: 'view_sidebar' },
    4: { name: 'L4 · Dialogs', token: 'bg-layer-dialog', icon: 'picture_in_picture' },
    5: { name: 'L5 · Modals', token: 'bg-layer-modal', icon: 'filter_none' },
};

// ─── HOOK ───────────────────────────────────────────────────────────────────

export function useLayerProperties() {
    const params = useParams();
    const themeId = (params?.theme as string) || 'metro';

    const [state, setState] = useState<LayerPropertiesState>(DEFAULT_STATE);
    const [isDirty, setIsDirty] = useState(false);
    const initialLoadRef = useRef(false);

    // ── Load saved settings on mount ──
    useEffect(() => {
        // Reset ref and state if theme changes
        initialLoadRef.current = true;

        fetch(`/api/elevation/settings?theme=${themeId}`)
            .then(r => {
                if (!r.ok) throw new Error('No saved settings');
                return r.json();
            })
            .then((saved: LayerPropertiesState) => {
                setState({
                    layers: Object.fromEntries(
                        LAYER_IDS.map(id => [id, { ...DEFAULT_LAYER_PROPS, ...(saved.layers?.[id] || {}) }])
                    ),
                });
            })
            .catch(() => {
                // No saved settings — use defaults
            });
    }, [themeId]);

    // ── Inject CSS custom properties on every state change ──
    useEffect(() => {
        const root = document.documentElement;

        // Per-layer overrides
        LAYER_IDS.forEach(id => {
            const layer = state.layers[id];
            if (!layer) return;

            root.style.setProperty(`--layer-${id}-bg-opacity`, `${layer.bgOpacity / 100}`);
            
            if (layer.bgToken) {
                root.style.setProperty(`--layer-${id}-bg-token`, `var(--md-sys-color-${layer.bgToken})`);
            } else {
                root.style.removeProperty(`--layer-${id}-bg-token`);
            }
            
            root.style.setProperty(`--layer-${id}-tint-opacity`, `${layer.tintOpacity / 100}`);
        });
    }, [state]);

    // ── Update per-layer properties ──
    const setLayerOverride = useCallback((layerId: number, key: keyof LayerProps, value: LayerProps[keyof LayerProps]) => {
        setState(prev => ({
            ...prev,
            layers: {
                ...prev.layers,
                [layerId]: { ...prev.layers[layerId], [key]: value },
            },
        }));
        setIsDirty(true);
    }, []);

    // ── Reset all to defaults ──
    const resetAll = useCallback(() => {
        setState({ ...DEFAULT_STATE, layers: Object.fromEntries(LAYER_IDS.map(id => [id, { ...DEFAULT_LAYER_PROPS }])) });
        setIsDirty(true);
    }, []);

    // ── Check if a layer has ANY changes from default ──
    const hasOverrides = useCallback((layerId: number) => {
        const layer = state.layers[layerId];
        if (!layer) return false;
        return layer.bgToken !== DEFAULT_LAYER_PROPS.bgToken || 
               layer.bgOpacity !== DEFAULT_LAYER_PROPS.bgOpacity || 
               layer.tintOpacity !== DEFAULT_LAYER_PROPS.tintOpacity;
    }, [state.layers]);

    // ── Publish to theme ──
    const publish = useCallback(async () => {
        const res = await fetch('/api/elevation/publish', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ theme: themeId, settings: state }),
        });
        if (!res.ok) throw new Error('Publish failed');
        setIsDirty(false);
    }, [state, themeId]);

    return {
        state,
        isDirty,
        setLayerOverride,
        resetAll,
        hasOverrides,
        publish,
    };
}
