import { useState, useCallback, useMemo, useEffect } from 'react';
import { 
    COMPONENT_BORDER_MAP, 
    BORDER_RADIUS_TOKENS, 
    BORDER_WIDTH_TOKENS, 
    BORDER_STYLE_TOKENS 
} from '../../../../zap/sections/atoms/foundations/schema';

export interface UniversalBorderProps {
    radius: string; // Tailwind rounded-* class
    width: string;  // Tailwind border-* class
    style: string;  // Tailwind border-style class (e.g. border-solid)
    opacity: string; // Tailwind opacity-* class
}

export interface PerComponentOverride {
    radius?: string;
    width?: string;
    style?: string;
    opacity?: string;
}

export type BorderPropertiesState = {
    universal: UniversalBorderProps;
    components: Record<string, PerComponentOverride>;
};

const DEFAULT_UNIVERSAL_PROPS: UniversalBorderProps = {
    radius: 'rounded-md',
    width: 'border',
    style: 'border-solid',
    opacity: '100%',
};

export const COMPONENT_NAMES = COMPONENT_BORDER_MAP.map(c => c.component);

export function useBorderProperties() {
    // 1. Initialize State
    const [state, setState] = useState<BorderPropertiesState>({
        universal: { ...DEFAULT_UNIVERSAL_PROPS },
        components: {},
    });

    // Inject CSS variables globally to apply universal settings to structural cards
    useEffect(() => {
        const root = document.documentElement;
        
        // Match tokens from schema
        const radiusToken = BORDER_RADIUS_TOKENS.find(t => t.token === state.universal.radius);
        const widthToken = BORDER_WIDTH_TOKENS.find(t => t.token === state.universal.width);
        const styleToken = BORDER_STYLE_TOKENS.find(t => t.token === state.universal.style);

        if (radiusToken) {
            // Extract just the CSS value (e.g., "0.5rem" from "0.5rem (8px)")
            const cssRadius = radiusToken.value.split(' ')[0];
            root.style.setProperty('--layer-border-radius', cssRadius);
        }
        
        if (widthToken) {
            root.style.setProperty('--layer-border-width', widthToken.value);
        }
        
        if (styleToken) {
            // "border-dashed" -> "dashed"
            const cssStyle = styleToken.token.replace('border-', '') || 'solid';
            root.style.setProperty('--layer-border-style', cssStyle);
        }
    }, [state.universal]);

    // 2. State Updaters
    const setUniversal = useCallback(<K extends keyof UniversalBorderProps>(key: K, value: UniversalBorderProps[K]) => {
        setState(prev => ({
            ...prev,
            universal: {
                ...prev.universal,
                [key]: value,
            },
        }));
    }, []);

    const setComponentOverride = useCallback(<K extends keyof PerComponentOverride>(
        componentName: string,
        key: K,
        value: PerComponentOverride[K]
    ) => {
        setState(prev => {
            const currentComponent = prev.components[componentName] || {};
            return {
                ...prev,
                components: {
                    ...prev.components,
                    [componentName]: {
                        ...currentComponent,
                        [key]: value,
                    },
                },
            };
        });
    }, []);

    const clearComponentOverride = useCallback(<K extends keyof PerComponentOverride>(
        componentName: string,
        key: K
    ) => {
        setState(prev => {
            const currentComponent = { ...prev.components[componentName] };
            if (currentComponent) {
                delete currentComponent[key];
            }
            return {
                ...prev,
                components: {
                    ...prev.components,
                    [componentName]: currentComponent,
                },
            };
        });
    }, []);

    // 3. Computed Helper
    const hasOverrides = useCallback((componentName: string) => {
        const overrides = state.components[componentName];
        if (!overrides) return false;
        return Object.keys(overrides).length > 0;
    }, [state.components]);

    // Calculate effective properties for a component (override or fallback to universal)
    const getEffectiveProps = useCallback((componentName: string) => {
        const overrides = state.components[componentName] || {};
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const defaults = COMPONENT_BORDER_MAP.find(c => c.component === componentName) || { defaultRadius: 'rounded', defaultWidth: 'border' };
        
        // Wait, should we fallback to the default mapping from schema, or to the universal setting?
        // Let's fallback to the universal setting if they are not overridden.
        // Or in a real system maybe default mapping first?
        // Actually, universal control overrides EVERYTHING unless a specific override exists.
        // So universal is the baseline.
        
        return {
            radius: overrides.radius || state.universal.radius,
            width: overrides.width || state.universal.width,
            style: overrides.style || state.universal.style,
            opacity: overrides.opacity || state.universal.opacity,
        };
    }, [state.universal, state.components]);

    // 4. Reset
    const resetAll = useCallback(() => {
        setState({
            universal: { ...DEFAULT_UNIVERSAL_PROPS },
            components: {},
        });
    }, []);

    const hydrateState = useCallback((loadedState: BorderPropertiesState) => {
        setState(loadedState);
    }, []);

    // 5. Check if dirty
    const isDirty = useMemo(() => {
        const uniChanged = JSON.stringify(state.universal) !== JSON.stringify(DEFAULT_UNIVERSAL_PROPS);
        const hasAnyOverrides = Object.keys(state.components).some(k => Object.keys(state.components[k]).length > 0);
        return uniChanged || hasAnyOverrides;
    }, [state]);

    return {
        state,
        setUniversal,
        setComponentOverride,
        clearComponentOverride,
        hasOverrides,
        getEffectiveProps,
        resetAll,
        hydrateState,
        isDirty,
    };
}
