"use client";

import React, { useState } from 'react';
import { Wrapper } from '../../components/dev/Wrapper';
import { Button } from '../atoms/interactive/buttons';
import { Slider } from '../atoms/interactive/slider';
import { Switch } from '../atoms/interactive/switch';
import { Select } from '../atoms/interactive/option-select';
import { cn } from '../../lib/utils';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../zap/sections/atoms/foundations/schema';
import { toast } from 'sonner';
import { Icon } from '../atoms/icons/Icon';
import { ThemePublisher } from '../../components/dev/ThemePublisher';
import { InspectorAccordion } from '../../zap/organisms/laboratory/InspectorAccordion';

export interface InspectorProps {
    /** 
     * The name of the component being inspected, used to link to MongoDB token overrides.
     * Example: 'Checkbox', 'Button', 'Dialog'
     */
    componentName: string;

    /** 
     * Semantic Colors 
     */
    activeColor?: string;
    onColorChange?: (color: string) => void;
    colors?: string[]; // Defaults to standard 4

    /** 
     * Scale & Density 
     */
    activeSize?: string;
    onSizeChange?: (size: string) => void;
    sizes?: string[]; // Defaults to standard 4

    /** 
     * Sandbox Custom Numeric Variable (e.g., width, padding, spacing)
     */
    customVariableLabel?: string;
    customVariableValue?: number[];
    onCustomVariableChange?: (val: number[]) => void;
    customVariableMin?: number;
    customVariableMax?: number;
    customVariableStep?: number;

    /**
     * MongoDB Border Property Handlers (From useBorderProperties hook)
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    borderState: any;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    setComponentOverride: (componentName: string, property: any, value: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clearComponentOverride: (componentName: string, property: any) => void;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    effectiveProps: Record<string, any>;

    /** 
     * Disabled Toggle 
     */
    disabled?: boolean;
    onDisabledChange?: (val: boolean) => void;

    /** 
     * Architecture Header/Docs 
     */
    docsLabel?: string;
    docsHref?: string;

    /**
     * ZAP Publishing Pipeline 
     */
    publishContext?: {
        activeTheme: string;
        filePath: string;
        customVariables?: Record<string, string>;
    };

    /**
     * Additional Custom Accordions / Properties
     */
    children?: React.ReactNode;
}

export const L5InspectorFooter: React.FC<{
    publishContext?: {
        activeTheme: string;
        filePath: string;
        customVariables?: Record<string, string>;
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    borderState?: any;
}> = ({ publishContext, borderState }) => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePublish = async () => {
        if (!publishContext) return;
        setIsSubmitting(true);
        try {
            const promises = [];

            // 1. Custom Structural Variables (e.g., width, size, paddings)
            if (publishContext.customVariables && Object.keys(publishContext.customVariables).length > 0) {
                promises.push(
                    fetch('/api/theme/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: publishContext.activeTheme, variables: publishContext.customVariables })
                    })
                );
            }

            // 2. Global DB Border Constraints (Radius/Width overrides)
            if (borderState && Object.keys(borderState).length > 0) {
                promises.push(
                    fetch('/api/border_radius/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: publishContext.activeTheme, state: borderState })
                    })
                );
            }

            const results = await Promise.all(promises);
            const passed = results.every(r => r.ok);
            
            if (passed) {
                toast.success(`Sandbox Blueprint Published`, { description: `Successfully synced parameters to the ${publishContext.activeTheme.toUpperCase()} theme.` });
            } else {
                throw new Error("One or more publishing services failed.");
            }
        } catch (err) {
            console.error(err);
            toast.error(`Publish Failed`, { description: `Ensure Next server and MongoDB are active.` });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!publishContext) return null;

    return (
        <ThemePublisher
            theme={publishContext.activeTheme}
            filePath={publishContext.filePath}
            onPublish={handlePublish}
            isLoading={isSubmitting}
        />
    );
};

export const L5Inspector: React.FC<InspectorProps> = ({
    componentName,
    activeColor,
    onColorChange,
    colors = ['primary', 'secondary', 'tertiary', 'destructive'],
    activeSize,
    onSizeChange,
    sizes = ['tiny', 'compact', 'medium', 'expanded'],
    customVariableLabel,
    customVariableValue,
    onCustomVariableChange,
    customVariableMin = 8,
    customVariableMax = 64,
    customVariableStep = 1,
    borderState,
    setComponentOverride,
    clearComponentOverride,
    effectiveProps,
    disabled,
    onDisabledChange,
    docsLabel,
    docsHref,
    children
}) => {


    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '12px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '0px';

    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <Select 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const renderWidthSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...BORDER_WIDTH_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <Select 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    return (
        <Wrapper identity={{ displayName: `${componentName} L5 Inspector`, type: "Container", filePath: "zap/organisms/inspector.tsx" }}>
            <div className="space-y-4">
                
                {onColorChange && (
                    <Wrapper identity={{ displayName: "Semantic Color", type: "Control Row", filePath: "zap/organisms/inspector.tsx" }}>
                        <div className="space-y-4 pb-4 border-b border-border/50">
                            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Semantic Color</h4>
                            <div className="flex bg-layer-panel p-1 border border-border/50 rounded-lg">
                                {colors.map((c) => (
                                    <Button
                                        key={c}
                                        onClick={() => onColorChange(c)}
                                        // visualStyle prop handled organically
                                        visualStyle={activeColor === c ? 'solid' : 'ghost'}
                                        // @ts-expect-error dynamic color prop casting
                                        color={c}
                                        size="tiny"
                                        className={cn("flex-1", activeColor !== c && "text-muted-foreground")}
                                    >
                                        {c}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </Wrapper>
                )}

                {onSizeChange && (
                    <Wrapper identity={{ displayName: "Scale & Density", type: "Control Row", filePath: "zap/organisms/inspector.tsx" }}>
                        <div className="space-y-4 pb-4 border-b border-border/50">
                            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Scale & Density</h4>
                            <div className="flex flex-wrap gap-1 bg-layer-panel p-1 border border-border/50 rounded-lg">
                                {sizes.map((s) => (
                                    <Button
                                        key={s}
                                        onClick={() => onSizeChange(s)}
                                        // visualStyle prop handled organically
                                        visualStyle={activeSize === s ? 'solid' : 'ghost'}
                                        // @ts-expect-error dynamic color binding
                                        color={activeColor || 'primary'}
                                        size="tiny"
                                        className={cn("flex-1", activeSize !== s && "text-muted-foreground")}
                                    >
                                        {s}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </Wrapper>
                )}

                <InspectorAccordion title="Dynamic Properties" icon="tune" defaultOpen={true}>
                    <Wrapper identity={{ displayName: "Dynamic Properties", type: "Control Group", filePath: "zap/organisms/inspector.tsx" }}>
                        <div className="space-y-4 pt-2">
                            {onCustomVariableChange && customVariableLabel && customVariableValue !== undefined && (
                                <div className="space-y-2">
 <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground ">
                                        <span>{customVariableLabel}</span>
                                        <span className="font-bold">{customVariableValue[0]}</span>
                                    </div>
                                    <Slider 
                                        value={customVariableValue} 
                                        onValueChange={onCustomVariableChange} 
                                        min={customVariableMin} 
                                        max={customVariableMax} 
                                        step={customVariableStep} 
                                        className="w-full" 
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    borderState.components[componentName]?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride(componentName, 'width');
                                        else setComponentOverride(componentName, 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-[10px] text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    borderState.components[componentName]?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride(componentName, 'radius');
                                        else setComponentOverride(componentName, 'radius', val);
                                    }
                                )}
                            </div>
                        </div>
                    </Wrapper>
                </InspectorAccordion>

                {onDisabledChange !== undefined && disabled !== undefined && (
                    <Wrapper identity={{ displayName: "Disabled State Toggle Row", type: "Control Row", filePath: "zap/organisms/inspector.tsx" }}>
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                            <span className="text-[11px] font-bold font-display text-transform-primary text-muted-foreground">Disabled State</span>
                            <Switch size="sm" checked={disabled} onCheckedChange={onDisabledChange} />
                        </div>
                    </Wrapper>
                )}

            {/* Injected Custom Controls / Structural Properties */}
            {children}

            {/* Architecture Protocol Document */}
            {docsHref && (
                <InspectorAccordion title="Architecture Docs" icon="menu_book" defaultOpen={true}>
                    <div className="space-y-4 pt-2">
                        <div className="space-y-1">
                            <p className="text-[10px] font-black tracking-widest text-transform-secondary text-muted-foreground uppercase opacity-60 pb-1">{docsLabel || "Architecture Specifications"}</p>
                            <a href={docsHref} className="text-[10px] uppercase font-bold text-primary hover:text-primary/80 transition-colors w-full flex items-center gap-1.5 p-2 bg-primary/5 rounded-md border border-primary/20">
                                <Icon name="open_in_new" size={14} />
                                OPEN PROTOCOL.MD
                            </a>
                        </div>
                    </div>
                </InspectorAccordion>
            )}

        </div>
    </Wrapper>
    );
};
