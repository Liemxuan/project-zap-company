'use client';

import React from 'react';
import { InspectorAccordion } from '../../../../zap/organisms/laboratory/InspectorAccordion';
import { ToggleGroup, ToggleGroupItem } from '../../../../genesis/atoms/interactive/toggle-group';
import { Select } from '../../../../genesis/atoms/interactive/option-select';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, BORDER_STYLE_TOKENS, OPACITY_TOKENS, COMPONENT_BORDER_MAP, type ComponentBorderMapping } from '../../../../zap/sections/atoms/foundations/schema';
import { type BorderPropertiesState, type UniversalBorderProps, type PerComponentOverride } from './use-border-properties';

interface BorderRadiusInspectorProps {
    state: BorderPropertiesState;
    setUniversal: <K extends keyof UniversalBorderProps>(key: K, value: UniversalBorderProps[K]) => void;
    setComponentOverride: (componentName: string, key: keyof PerComponentOverride, value: string) => void;
    clearComponentOverride: (componentName: string, key: keyof PerComponentOverride) => void;
    hasOverrides: (componentName: string) => boolean;
}

export const BorderRadiusInspector = ({
    state,
    setUniversal,
    setComponentOverride,
    clearComponentOverride,
    hasOverrides,
}: BorderRadiusInspectorProps) => {

    const renderRadiusSelect = (value: string, onChange: (val: string) => void, isOverride = false) => {
        const options = isOverride ? [{ label: '(Inherit Universal)', value: '' }] : [];
        options.push(...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token })));

        return (
            <Select 
                options={options}
                value={value}
                onChange={onChange}
                className={isOverride && value !== '' ? '[&>*]:!border-primary/50 [&_button]:!text-primary' : ''}
            />
        );
    };

    const renderWidthSelect = (value: string, onChange: (val: string) => void, isOverride = false) => {
        if (!isOverride) {
            return (
                <ToggleGroup visualStyle="segmented" type="single" value={value} onValueChange={(val) => { if (val) onChange(val); }} className="w-full bg-layer-base">
                    {BORDER_WIDTH_TOKENS.map(t => (
                        <ToggleGroupItem key={t.token} value={t.token} size="sm" className="flex-1 h-7 px-1 text-[10px]" title={t.name}>
                            {t.name.split(' ')[0]} {/* Keep it concise */}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            );
        }
        const options = [
            { label: '(Inherit Universal)', value: '' },
            ...BORDER_WIDTH_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];

        return (
            <Select 
                options={options}
                value={value}
                onChange={onChange}
                className={value !== '' ? '[&>*]:!border-primary/50 [&_button]:!text-primary' : ''}
            />
        );
    };

    const renderStyleSelect = (value: string, onChange: (val: string) => void, isOverride = false) => {
        if (!isOverride) {
            return (
                <ToggleGroup visualStyle="segmented" type="single" value={value} onValueChange={(val) => { if (val) onChange(val); }} className="w-full bg-layer-base">
                    {BORDER_STYLE_TOKENS.map(t => (
                        <ToggleGroupItem key={t.token} value={t.token} size="sm" className="flex-1 h-7 px-1 text-[10px]" title={t.name}>
                            {t.name}
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            );
        }
        const options = [
            { label: '(Inherit Universal)', value: '' },
            ...BORDER_STYLE_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];

        return (
            <Select 
                options={options}
                value={value}
                onChange={onChange}
                className={value !== '' ? '[&>*]:!border-primary/50 [&_button]:!text-primary' : ''}
            />
        );
    };

    const renderOpacitySelect = (value: string, onChange: (val: string) => void, isOverride = false) => {
        const options = isOverride ? [{ label: '(Inherit Universal)', value: '' }] : [];
        options.push(...OPACITY_TOKENS.map(t => ({ label: `${t.name} (${t.usage})`, value: t.token })));

        return (
            <Select 
                options={options}
                value={value}
                onChange={onChange}
                className={isOverride && value !== '' ? '[&>*]:!border-primary/50 [&_button]:!text-primary' : ''}
            />
        );
    };

    return (
        <div className="font-body text-transform-secondary select-none pb-4 flex flex-col gap-1">
            {/* ── Universal Controls ── */}
            <InspectorAccordion title="Universal Settings" icon="tune" defaultOpen={true}>
                <div className="p-3 bg-layer-dialog rounded-lg border border-border/20 space-y-4">
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                        These settings globally apply to all components unless locally overridden.
                    </p>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-dev text-transform-tertiary font-bold tracking-wide text-foreground">Universal Radius</span>
                        </div>
                        {renderRadiusSelect(state.universal.radius, (val) => setUniversal('radius', val))}
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-dev text-transform-tertiary font-bold tracking-wide text-foreground">Universal Border Width</span>
                        </div>
                        {renderWidthSelect(state.universal.width, (val) => setUniversal('width', val))}
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-dev text-transform-tertiary font-bold tracking-wide text-foreground">Universal Border Style</span>
                        </div>
                        {renderStyleSelect(state.universal.style, (val) => setUniversal('style', val))}
                    </div>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[10px] font-dev text-transform-tertiary font-bold tracking-wide text-foreground">Universal Opacity</span>
                        </div>
                        {renderOpacitySelect(state.universal.opacity, (val) => setUniversal('opacity', val))}
                    </div>
                </div>
            </InspectorAccordion>

            {/* ── Per-Component Advanced Controls ── */}
            <InspectorAccordion title="Component Overrides" icon="extension" defaultOpen={false}>
                <div className="space-y-1 pt-1">
                    <p className="text-[9px] text-muted-foreground mb-3 leading-relaxed">
                        Override universal settings for individual components. Overrides are highlighted in primary color.
                    </p>
                    {COMPONENT_BORDER_MAP.map((comp) => {
                        const overrides = state.components[comp.component] || {};
                        const isOverridden = hasOverrides(comp.component);
                        
                        return (
                            <div key={comp.component} className={`p-3 rounded-lg border transition-colors ${isOverridden ? 'bg-primary/5 border-primary/20' : 'bg-layer-dialog border-border/10'}`}>
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-xs font-bold text-foreground flex items-center gap-1.5">
                                        {comp.component}
                                        {isOverridden && <span className="w-1.5 h-1.5 rounded-full bg-primary" />}
                                    </span>
                                    {isOverridden && (
                                        <button 
                                            onClick={() => {
                                                clearComponentOverride(comp.component, 'radius');
                                                clearComponentOverride(comp.component, 'width');
                                            }}
                                            className="text-[9px] font-black text-error hover:text-error/80 uppercase tracking-widest"
                                        >
                                            Reset
                                        </button>
                                    )}
                                </div>
                                <div className="space-y-3">
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-dev text-transform-tertiary text-muted-foreground tracking-wide">Radius Override</span>
                                        {renderRadiusSelect(
                                            overrides.radius || '', 
                                            (val) => {
                                                if (val === '') clearComponentOverride(comp.component, 'radius');
                                                else setComponentOverride(comp.component, 'radius', val);
                                            },
                                            true
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-dev text-transform-tertiary text-muted-foreground tracking-wide">Width Override</span>
                                        {renderWidthSelect(
                                            overrides.width || '', 
                                            (val) => {
                                                if (val === '') clearComponentOverride(comp.component, 'width');
                                                else setComponentOverride(comp.component, 'width', val);
                                            },
                                            true
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-dev text-transform-tertiary text-muted-foreground tracking-wide">Style Override</span>
                                        {renderStyleSelect(
                                            overrides.style || '', 
                                            (val) => {
                                                if (val === '') clearComponentOverride(comp.component, 'style');
                                                else setComponentOverride(comp.component, 'style', val);
                                            },
                                            true
                                        )}
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[9px] font-dev text-transform-tertiary text-muted-foreground tracking-wide">Opacity Override</span>
                                        {renderOpacitySelect(
                                            overrides.opacity || '', 
                                            (val) => {
                                                if (val === '') clearComponentOverride(comp.component, 'opacity');
                                                else setComponentOverride(comp.component, 'opacity', val);
                                            },
                                            true
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </InspectorAccordion>
        </div>
    );
};
