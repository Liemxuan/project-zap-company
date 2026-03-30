
'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Badge, BadgeButton, BadgeDot } from '../../../../../genesis/atoms/interactive/badge';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { Select } from '../../../../../genesis/atoms/interactive/option-select';
import { toast } from 'sonner';

export default function BadgeSandboxPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const [height, setHeight] = useState([40]);
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

    // Live preview values
    const effectiveProps = getEffectiveProps('Badge');
    
    // Extract pixel values from schema tokens to feed into inline styles for instant preview
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '9999px';
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

    const handleLoadedVariables = React.useCallback((variables: Record<string, string>) => {
        if (variables['--badge-height']) setHeight([parseCssToNumber(variables['--badge-height'])]);
    }, []);

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // Publish specific height
            const res1 = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables: { '--badge-height': height[0] + 'px' }})
            });

            // Publish border radius globally
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Badge Settings Published`, { description: `Successfully synced values to the ${activeTheme} theme.` });
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
            filePath={`app/design/zap/atoms/badge/page.tsx`}
        />
    );

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/badge/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Badge Structural Settings", type: "Docs Link", filePath: "zap/atoms/badge/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--badge-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={16} max={128} step={1} className="w-full" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Badge']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Badge', 'width');
                                        else setComponentOverride('Badge', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Badge']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Badge', 'radius');
                                        else setComponentOverride('Badge', 'radius', val);
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Badge"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/components/ui/badge.tsx"
            importPath="@/components/ui/badge"
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
                .badge-preview-sandbox {
                    --badge-height: ${height[0]}px;
                    --badge-border-width: ${previewWidth};
                    --badge-border-radius: ${previewRadius};
                }
            ` }} />
            <div 
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 badge-preview-sandbox"
            >
                <div className="p-12 bg-layer-panel shadow-sm border-[length:var(--card-border-width)] border-outline-variant rounded-[length:var(--card-radius)] flex flex-col items-center justify-center gap-4 text-on-surface w-full">
                   <div className="flex gap-4 items-center flex-wrap justify-center">
                       <Badge>Primary</Badge>
                       <Badge variant="secondary">Secondary</Badge>
                       <Badge variant="success" appearance="light">Success Light</Badge>
                       <Badge variant="warning" appearance="outline">Warning Outline</Badge>
                       <Badge variant="destructive" appearance="ghost">Destructive Ghost</Badge>
                       <Badge shape="circle">Circle</Badge>
                       <Badge>
                           <BadgeDot className="mr-1" />
                           With Dot
                       </Badge>
                       <Badge variant="info">
                           Dismissible
                           <BadgeButton className="ml-1" />
                       </Badge>
                   </div>
                   <span className="font-display font-medium mt-4">Badge Sandbox Mounted (M3 Token Verification)</span>
                   <span className="text-label-small font-mono">Dynamically mapped to Global Theme (Border: {previewWidth}, Radius: {previewRadius})</span>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

