'use client';
import { parseCssToNumber } from '../../../../../lib/utils';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Select as ZapSelect } from '../../../../../genesis/atoms/interactive/option-select';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../../../../genesis/atoms/interactive/select';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, ZAP_LAYER_MAP } from '../../../../../zap/sections/atoms/foundations/schema';
import { toast } from 'sonner';

export default function SelectSandboxPage() {
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

    const effectiveProps = getEffectiveProps('Select');
    
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '8px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '1px';
    const previewBgLayer = state.components['Select']?.bg || '';
    const previewBgTokenDef = ZAP_LAYER_MAP.find(L => L.zapToken === previewBgLayer);
    const previewBgCssVar = previewBgTokenDef 
        ? `var(--color-${previewBgTokenDef.m3Token.replace('bg-', '')})` 
        : 'var(--color-surface-container-highest)';

    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <ZapSelect 
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
            <ZapSelect 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit Universal)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const renderBgSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(L4 Default)', value: 'inherit' },
            ...ZAP_LAYER_MAP.map(L => ({ label: `${L.zapLayer} (${L.zapToken})`, value: L.zapToken }))
        ];
        return (
            <ZapSelect 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(L4 Default)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };


    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/select/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Select Structural Settings", type: "Docs Link", filePath: "zap/atoms/select/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--select-height</span>
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
                                    state.components['Select']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Select', 'width');
                                        else setComponentOverride('Select', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Select']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Select', 'radius');
                                        else setComponentOverride('Select', 'radius', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Color / Layer</span>
                                    <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px]">{previewBgTokenDef ? previewBgTokenDef.zapLayer : 'L4 Default'}</span>
                                </span>
                                {renderBgSelect(
                                    state.components['Select']?.bg || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Select', 'bg');
                                        else setComponentOverride('Select', 'bg', val);
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
        if (variables['--select-height']) setHeight([parseCssToNumber(variables['--select-height'])]);
    }, []);

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // Publish local component values
            const variables = {
                '--select-height': `${height[0]}px`
            };
            const res1 = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables })
            });

            // Publish global border radius
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Published Select to ${activeTheme}`);
            } else {
                toast.error('Failed to publish');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error during publish');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <ComponentSandboxTemplate
            componentName="Select"
            tier="L3 ATOM"
            status="Beta"
            filePath="src/components/ui/select.tsx"
            importPath="@/components/ui/select"
            inspectorControls={inspectorControls}
            inspectorFooter={
                <ThemePublisher 
                    theme={activeTheme} 
                    filePath="src/components/ui/select.tsx" 
                    onPublish={handlePublish} 
                    isLoading={isSubmitting} 
                />
            }
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
            onLoadedVariables={handleLoadedVariables}
        >
            <style 
                key={`sandbox-styles-${previewWidth}-${previewRadius}-${height[0]}-${previewBgLayer}`}
                dangerouslySetInnerHTML={{ __html: `
                :root {
                    --select-border-width: ${previewWidth};
                    --select-border-radius: ${previewRadius};
                    --select-height: ${height[0]}px;
                    --select-bg: ${previewBgCssVar};
                }
            ` }} />
            <div 
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 select-preview-sandbox"
            >
                <div className="p-12 bg-layer-panel shadow-sm border-[length:var(--card-border-width)] border-outline-variant rounded-[length:var(--card-radius)] flex flex-col items-center justify-center text-on-surface w-full min-h-[160px]">
                   <div className="flex justify-center w-full">
                       <Select defaultValue="1">
                           <SelectTrigger className="w-80">
                               <SelectValue placeholder="Select an option" />
                           </SelectTrigger>
                           <SelectContent>
                               <SelectItem value="1">Primary Option</SelectItem>
                               <SelectItem value="2">Secondary Option</SelectItem>
                           </SelectContent>
                       </Select>
                   </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

