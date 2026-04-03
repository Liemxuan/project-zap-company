'use client';

import React from 'react';
import { cn } from '../../../../lib/utils';
import { CanvasBody } from '../../../../zap/layout/CanvasBody';
import { SectionHeader, TokenTable } from '../../../../zap/sections/atoms/foundations/components';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, BORDER_STYLE_TOKENS, OPACITY_TOKENS, COMPONENT_BORDER_MAP } from '../../../../zap/sections/atoms/foundations/schema';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { type UniversalBorderProps, type PerComponentOverride } from './use-border-properties';

interface BorderRadiusBodyProps {
    getEffectiveProps: (componentName: string) => { radius: string; width: string; style: string; opacity: string };
    universal: UniversalBorderProps;
}

export const BorderRadiusBody = ({ getEffectiveProps }: BorderRadiusBodyProps) => {

    const renderComponentDemo = (componentName: string) => {
        const props = getEffectiveProps(componentName);
        const { radius, width, style = 'border-solid', opacity = '100%' } = props;
        
        // Base styling mapping based on component type for demonstration purposes
        let previewStyle = "bg-primary/10 border-primary text-primary flex items-center justify-center font-bold text-xs";
        let containerStyle = "w-full h-24";
        let borderColorVar = "var(--color-primary)";
        
        if (componentName === 'Button') {
            previewStyle = "bg-primary text-on-primary border-primary-container font-medium text-sm flex items-center justify-center";
            containerStyle = "w-32 h-10";
            borderColorVar = "var(--color-primary-container)";
        } else if (componentName === 'Card') {
            previewStyle = "bg-surface-container-low border-border text-on-surface p-4 flex items-start justify-start flex-col gap-2";
            containerStyle = "w-full h-32";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Input Field') {
            previewStyle = "bg-surface-container-highest border-border text-muted-foreground px-3 flex items-center justify-between text-sm";
            containerStyle = "w-full h-[40px]";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Dialog') {
            previewStyle = "bg-surface-container-high border-border text-foreground flex items-center justify-center p-6 shadow-lg";
            containerStyle = "w-full h-40";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Badge') {
            previewStyle = "bg-error text-on-error border-error-container text-[10px] font-black w-6 h-6 flex items-center justify-center";
            containerStyle = "w-6 h-6";
            borderColorVar = "var(--color-error-container)";
        } else if (componentName === 'Checkbox') {
            previewStyle = "bg-primary text-on-primary border-primary flex items-center justify-center";
            containerStyle = "w-5 h-5";
            borderColorVar = "var(--color-primary)";
        } else if (componentName === 'Chip') {
            previewStyle = "bg-secondary-container text-on-secondary-container border-secondary-container px-3 text-xs flex items-center justify-center";
            containerStyle = "w-20 h-8";
            borderColorVar = "var(--color-secondary-container)";
        } else if (componentName === 'Textarea') {
            previewStyle = "bg-surface-container-highest border-border text-muted-foreground px-3 py-2 flex items-start justify-start text-sm";
            containerStyle = "w-full h-20";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Toggle') {
            // Toggle: border props target the OUTER TRACK only, thumb stays circular
            previewStyle = "bg-primary border-outline-variant relative flex items-center px-1 overflow-hidden";
            containerStyle = "w-14 h-7";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Canvas (L1)') {
            previewStyle = "bg-layer-canvas border-border text-foreground p-4 items-center justify-center flex font-bold text-xs";
            containerStyle = "w-full h-24";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Cover (L2)') {
            previewStyle = "bg-layer-cover border-border text-foreground p-6 items-center justify-center flex font-bold";
            containerStyle = "w-full h-32";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Panel (L3)') {
            previewStyle = "bg-layer-panel border-border text-foreground p-6 items-center justify-center flex shadow-md";
            containerStyle = "w-4/5 h-40";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Modal (L5)') {
            previewStyle = "bg-layer-modal border-border text-foreground p-8 items-center justify-center flex shadow-xl shadow-black/20";
            containerStyle = "w-3/4 h-48";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Accordion') {
            previewStyle = "bg-surface-container border-border text-foreground p-3 flex items-center justify-between text-sm";
            containerStyle = "w-full h-12";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Avatar') {
            previewStyle = "bg-primary text-on-primary border-primary-container font-bold text-xs flex items-center justify-center";
            containerStyle = "w-10 h-10";
            borderColorVar = "var(--color-primary-container)";
        } else if (componentName === 'Select') {
            previewStyle = "bg-surface-container-highest border-border text-muted-foreground px-3 flex items-center justify-between text-sm";
            containerStyle = "w-full h-[40px]";
            borderColorVar = "var(--color-outline-variant)";
        } else if (componentName === 'Slider') {
            previewStyle = "bg-primary/20 border-primary flex items-center relative overflow-hidden";
            containerStyle = "w-full h-2";
            borderColorVar = "var(--color-primary)";
        } else if (componentName === 'Tabs') {
            previewStyle = "bg-transparent border-b-2 border-primary text-foreground flex items-end justify-center pb-1 text-xs font-bold";
            containerStyle = "w-full h-10";
            borderColorVar = "var(--color-primary)";
        } else if (componentName === 'Table') {
            previewStyle = "bg-surface-container border-border text-foreground flex flex-col overflow-hidden text-xs";
            containerStyle = "w-full h-24";
            borderColorVar = "var(--color-outline-variant)";
        }

        return (
            <div className="flex flex-col gap-3 p-4 bg-layer-dialog border border-border/40 rounded-xl">
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-foreground">{componentName}</span>
                    <span className="text-[10px] font-dev text-transform-tertiary text-muted-foreground">{radius} · {width} · {style} · {opacity}</span>
                </div>
                <div className="flex-1 flex items-center justify-center p-4 border border-border/20 bg-layer-base rounded-lg min-h-[160px]">
                    <div 
                        className={cn(previewStyle, containerStyle, radius, width, style)}
                        style={Object.assign({}, { borderColor: `color-mix(in srgb, ${borderColorVar} ${opacity}, transparent)` })}
                    >
                        {componentName === 'Card' ? (
                            <>
                                <div className={cn("w-1/2 h-3 bg-foreground/10", radius)}></div>
                                <div className={cn("w-3/4 h-2 bg-foreground/5 mt-2", radius)}></div>
                                <div className={cn("w-full h-2 bg-foreground/5", radius)}></div>
                            </>
                        ) : componentName === 'Input Field' ? (
                            <>
                                <span className="opacity-70 font-dev text-transform-tertiary text-[10px] tracking-wide">bg-surface</span>
                                <div className={cn("bg-layer-modal shadow-sm text-foreground/80 border-border/40 px-1.5 py-0.5 text-[10px] font-dev text-transform-tertiary ml-2", radius !== 'rounded-none' && radius !== 'rounded-[0px]' ? 'rounded-md' : 'rounded-none', width && width !== 'border-0' ? 'border' : 'border-0')} title="bg-layer-modal">
                                    ⌘K
                                </div>
                            </>
                        ) : componentName === 'Badge' ? '3' : componentName === 'Checkbox' ? '✓' : componentName === 'Toggle' ? (
                            <div className={cn("w-4 h-4 bg-on-primary rounded-full ml-auto shadow-sm")} />
                        ) : componentName === 'Textarea' ? (
                            <span className="opacity-50 font-dev text-transform-tertiary text-[10px]">Type here...</span>
                        ) : componentName}
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            {/* ── 01. COMPONENT SHOWCASE ─────────────────────── */}
            <CanvasBody.Section label="01 · UNIVERSAL COMPONENT PREVIEW">
                <SectionHeader
                    number="01"
                    title="Live Shape Validation"
                    icon="category"
                    description="Watch how universal border & radius changes propagate across the entire component ecosystem."
                    id="live-preview"
                />

                <CanvasBody.Demo label="INTERACTIVE COMPONENTS" centered={false} minHeight="min-h-0">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 w-full">
                        {COMPONENT_BORDER_MAP.map(c => (
                            <React.Fragment key={c.component}>
                                {renderComponentDemo(c.component)}
                            </React.Fragment>
                        ))}
                    </div>
                </CanvasBody.Demo>
            </CanvasBody.Section>

            {/* ── 02. DEFINED TOKENS ─────────────────────── */}
            <CanvasBody.Section label="02 · TOKEN REFERENCE">
                <SectionHeader
                    number="02"
                    title="Shape Tokens"
                    icon="data_object"
                    description="The defined CSS variables mapping to M3 & Tailwind standard scale."
                    id="token-reference"
                />

                <CanvasBody.Demo label="RADIUS TOKENS" centered={false} minHeight="min-h-0" className="p-0 overflow-hidden">
                    <TokenTable
                        headers={['Name', 'Tailwind Token', 'Value', 'Usage']}
                        rows={BORDER_RADIUS_TOKENS.map(t => [
                            t.name, t.token, t.value, t.usage
                        ])}
                    />
                </CanvasBody.Demo>
                
                <CanvasBody.Demo label="BORDER WIDTH TOKENS" centered={false} minHeight="min-h-0" className="p-0 border-t-0 overflow-hidden rounded-t-none">
                    <TokenTable
                        headers={['Name', 'Tailwind Token', 'Value', 'Usage']}
                        rows={BORDER_WIDTH_TOKENS.map(t => [
                            t.name, t.token, t.value, t.usage
                        ])}
                    />
                </CanvasBody.Demo>
                
                <CanvasBody.Demo label="BORDER STYLE TOKENS" centered={false} minHeight="min-h-0" className="p-0 border-t-0 overflow-hidden rounded-t-none">
                    <TokenTable
                        headers={['Name', 'Tailwind Token', 'Usage']}
                        rows={BORDER_STYLE_TOKENS.map(t => [
                            t.name, t.token, t.usage
                        ])}
                    />
                </CanvasBody.Demo>
                
                <CanvasBody.Demo label="OPACITY TOKENS" centered={false} minHeight="min-h-0" className="p-0 border-t-0 overflow-hidden rounded-t-none">
                    <TokenTable
                        headers={['Name', 'Tailwind Token', 'Usage']}
                        rows={OPACITY_TOKENS.map(t => [
                            t.name, t.token, t.usage
                        ])}
                    />
                </CanvasBody.Demo>
            </CanvasBody.Section>
        </>
    );
};
