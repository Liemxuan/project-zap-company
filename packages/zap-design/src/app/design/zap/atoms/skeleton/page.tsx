'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Skeleton } from '../../../../../genesis/atoms/interactive/skeleton';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { Select } from '../../../../../genesis/atoms/interactive/option-select';
import { toast } from 'sonner';

export default function SkeletonSandbox() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    
    // Dynamic Properties State
    const [opacity, setOpacity] = useState([50]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const {
        state,
        setComponentOverride,
        clearComponentOverride,
        hydrateState,
        getEffectiveProps
    } = useBorderProperties();

    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/border_radius/publish?theme=${activeTheme}`);
                if (res.ok && mounted) {
                    const data = await res.json();
                    if (data.success && data.data && data.data.state) {
                        hydrateState(data.data.state);
                    }
                }
            } catch (err) {
                console.error("Failed to load border radius settings:", err);
            }
        };
        loadSettings();
        return () => { mounted = false; };
    }, [activeTheme, hydrateState]);

    const effectiveProps = getEffectiveProps('Skeleton');
    
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

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/skeleton/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Skeleton Structural Settings", type: "Docs Link", filePath: "zap/atoms/skeleton/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--skeleton-opacity</span>
                                    <span className="font-bold">{opacity[0]}%</span>
                                </div>
                                <Slider value={opacity} onValueChange={setOpacity} min={10} max={100} step={10} className="w-full" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Skeleton']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Skeleton', 'width');
                                        else setComponentOverride('Skeleton', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Skeleton']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Skeleton', 'radius');
                                        else setComponentOverride('Skeleton', 'radius', val);
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
            const handleLoadedVariables = React.useCallback((variables: Record<string, string>) => {
                if (variables['--skeleton-opacity']) setOpacity([parseFloat(variables['--skeleton-opacity']) * 100]);
            }, []);
        
            const handlePublish = async () => {
                setIsSubmitting(true);
                try {
                    // Publish specific opacity
                    const res1 = await fetch('/api/theme/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: activeTheme, variables: { '--skeleton-opacity': String(opacity[0] / 100) }})
                    });

                    // Publish border radius & width globally
                    const res2 = await fetch('/api/border_radius/publish', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ theme: activeTheme, state })
                    });

                    if (res1.ok && res2.ok) {
                        toast.success(`Skeleton Settings Published`, { description: `Successfully synced values to the ${activeTheme} theme.` });
                    } else {
                        throw new Error("Failed to publish one or more services");
                    }
                } catch (error) {
                    console.error("Publish Error:", error);
                    toast.error(`Publish Failed`, { description: `Failed to sync values.` });
                } finally {
                    setIsSubmitting(false);
                }
            };

            const inspectorFooter = (
                <ThemePublisher
                    theme={activeTheme}
                    onPublish={handlePublish}
                    isLoading={isSubmitting}
                    filePath={`app/design/zap/atoms/skeleton/page.tsx`}
                />
            );

    return (
        <ComponentSandboxTemplate
            componentName="Skeleton"
            tier="L3 ATOM"
            status="Beta"
            importPath="@/components/ui/skeleton"
            filePath="src/components/ui/skeleton.tsx"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "N/A",
                mobile: "N/A"
            }}
            foundationRules={[
                "Arbitrary Token Syntax Only."
            ]}
            inspectorFooter={inspectorFooter}
            onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .skeleton-preview-sandbox {
                    --skeleton-opacity: ${opacity[0] / 100};
                    --skeleton-border-radius: ${previewRadius};
                    --skeleton-border-width: ${previewWidth};
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 skeleton-preview-sandbox"
            >
                <div className="w-full flex items-center justify-center p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-[length:var(--card-border-radius,12px)] min-h-[400px]">
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-12 w-12" />
                        <div className="space-y-2">
                            <Skeleton className="h-4 w-[250px]" />
                            <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}
