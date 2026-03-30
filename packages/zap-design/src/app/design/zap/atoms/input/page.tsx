'use client';

import React, { useState } from 'react';
import { parseCssToNumber } from '../../../../../lib/utils';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Input } from '../../../../../genesis/atoms/interactive/inputs';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Switch } from '../../../../../genesis/atoms/interactive/switch';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { useTheme } from '../../../../../components/ThemeContext';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, ZAP_LAYER_MAP, COLOR_GROUPS } from '../../../../../zap/sections/atoms/foundations/schema';
import { Select } from '../../../../../genesis/atoms/interactive/option-select';
import { toast } from 'sonner';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const sandboxSchema = z.object({
  sandboxError: z.string().min(5, { message: "Simulated Error: Must be 5+ characters." }),
  validInput: z.string()
});



export default function InputSandboxPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const [disabled, setDisabled] = useState(false);
    const [height, setHeight] = useState([48]);
    
    // Color overrides
    const [focusOverride, setFocusOverride] = useState('');
    const [errorOverride, setErrorOverride] = useState('');

    // Setup mock form context purely for testing the error state
    const methods = useForm({
        resolver: zodResolver(sandboxSchema),
        defaultValues: { sandboxError: "Bad", validInput: "" },
        mode: "onChange"
    });

    // Fire validation immediately on mount to show the error
    const [isSubmitting, setIsSubmitting] = useState(false);
    const {
        state,
        setComponentOverride,
        clearComponentOverride,
        hydrateState,
        getEffectiveProps
    } = useBorderProperties();

    React.useEffect(() => {
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

    const effectiveProps = getEffectiveProps('Input');
    
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

    const previewBgLayer = state.components['Input']?.bg || '';
    const previewBgTokenDef = ZAP_LAYER_MAP.find(L => L.zapToken === previewBgLayer);
    const previewBgCssVar = previewBgTokenDef 
        ? `var(--color-${previewBgTokenDef.m3Token.replace('bg-', '')})` 
        : ''; // Fallback omitted to let CSS variable fallback handle it

    const renderBgSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit Universal)', value: 'inherit' },
            ...ZAP_LAYER_MAP.map(L => ({ label: `${L.zapLayer} (${L.zapToken})`, value: L.zapToken }))
        ];
        return (
            <div className="[--input-height:32px]">
                <Select 
                    value={safeValue} 
                    onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                    options={options}
                    placeholder="(Inherit Universal)"
                    className={`w-full bg-layer-base text-label-small ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
                />
            </div>
        );
    };

    const renderColorSelect = (value: string, onChange: (val: string) => void, placeholder: string) => {
        const safeValue = value === '' ? 'inherit' : value;
        const colorOptions = [
            { label: placeholder, value: 'inherit' },
            ...COLOR_GROUPS.flatMap(group => 
                group.roles.map(role => ({
                    label: `${group.group}: ${role.name}`,
                    value: `var(${role.cssVar})`
                }))
            )
        ];
        return (
            <div className="[--input-height:32px]">
                <Select 
                    value={safeValue} 
                    onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                    options={colorOptions}
                    placeholder={placeholder}
                    className={`w-full bg-layer-base text-label-small ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
                />
            </div>
        );
    };

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--input-height']) setHeight([parseCssToNumber(variables['--input-height'])]);
        if (variables['--input-focus-border']) setFocusOverride(variables['--input-focus-border']);
        if (variables['--input-error-border']) setErrorOverride(variables['--input-error-border']);
    };

    React.useEffect(() => {
        methods.trigger("sandboxError");
    }, [methods]);

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/input/page.tsx" }}>
            <div className="space-y-4">
                {/* Structure Theme Section */}
                <Wrapper identity={{ displayName: "Input Structural Settings", type: "Docs Link", filePath: "zap/atoms/input/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--input-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={32} max={72} step={1} className="w-full" />
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Input']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Input', 'width');
                                        else setComponentOverride('Input', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Input']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Input', 'radius');
                                        else setComponentOverride('Input', 'radius', val);
                                    }
                                )}
                            </div>
                        </div>

                        {/* Color Overrides Section */}
                        <div className="pt-4 mt-4 border-t border-border/50 space-y-4">
                            <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Color Overrides</h4>
                            
                            <div className="space-y-1">
                                <label className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Background / Layer</span>
                                    <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px]">{previewBgTokenDef ? previewBgTokenDef.zapLayer : 'Default'}</span>
                                </label>
                                {renderBgSelect(
                                    state.components['Input']?.bg || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Input', 'bg');
                                        else setComponentOverride('Input', 'bg', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Focus Border/Ring</span>
                                    <span className="font-bold font-dev opacity-50">{focusOverride ? 'Custom' : 'Default'}</span>
                                </label>
                                {renderColorSelect(focusOverride, setFocusOverride, '(Inherit Universal)')}
                            </div>

                            <div className="space-y-1">
                                <label className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Error State</span>
                                    <span className="font-bold font-dev opacity-50">{errorOverride ? 'Custom' : 'Default'}</span>
                                </label>
                                {renderColorSelect(errorOverride, setErrorOverride, '(Inherit Universal)')}
                            </div>
                        </div>

                    </div>
                </Wrapper>

                <Wrapper identity={{ displayName: "Disabled State Toggle Row", type: "Control Row", filePath: "zap/atoms/input/page.tsx" }}>
                    <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <span className="text-label-medium font-bold font-display text-transform-primary text-muted-foreground">Disabled State</span>
                        <Switch size="sm" checked={disabled} onCheckedChange={setDisabled} />
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            const customVars: Record<string, string> = {
                '--input-height': height[0] + 'px'
            };
            
            // Send colors if set, or empty to clear
            customVars['--input-focus-border'] = focusOverride || '';
            customVars['--input-focus-ring'] = focusOverride ? `color-mix(in srgb, ${focusOverride} 80%, transparent)` : '';
            customVars['--input-error-border'] = errorOverride || '';
            customVars['--input-error-text'] = errorOverride || '';
            customVars['--input-error-ring'] = errorOverride ? `color-mix(in srgb, ${errorOverride} 80%, transparent)` : '';

            // Publish specific height
            const res1 = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables: customVars })
            });

            // Publish border radius & width globally
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Input Settings Published`, { description: `Successfully synced values to the ${activeTheme} theme.` });
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

    return (
        <ComponentSandboxTemplate
            componentName="Input"
            tier="L3 ATOM"
            status="In Progress"
            filePath="src/genesis/atoms/interactive/inputs.tsx"
            importPath="@/genesis/atoms/interactive/inputs"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-surface-container', '--md-sys-color-on-surface', '--md-sys-color-outline'],
                typographyScales: ['--font-body (bodyLarge)']
            }}
            platformConstraints={{
                web: "Inputs maintain a readable height (default 48px) with accessible touch targets and clear focus indicators.",
                mobile: "Touch targets require a minimum 48px height. Input fonts must be at least 16px to prevent iOS auto-zoom."
            }}
            foundationRules={[
                "Inputs must clearly indicate focus state with a prominent border or ring.",
                "Disabled states must use reduced opacity (38%) and a not-allowed cursor.",
                "Placeholder text must have sufficient contrast (e.g. text-muted-foreground).",
                "Ensure inputs handle overflow text gracefully."
            ]}
            inspectorFooter={
                <ThemePublisher
                    theme={activeTheme}
                    onPublish={handlePublish}
                    isLoading={isSubmitting}
                    filePath={`app/design/zap/atoms/input/page.tsx`}
                />
            }
            onLoadedVariables={handleLoadedVariables}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .input-preview-sandbox {
                    --input-height: ${height[0]}px;
                    --input-border-width: ${previewWidth};
                    --input-border-radius: ${previewRadius};
                    ${previewBgCssVar ? `--input-bg: ${previewBgCssVar};` : ''}
                    ${focusOverride ? `--input-focus-border: ${focusOverride}; --input-focus-ring: color-mix(in srgb, ${focusOverride} 80%, transparent);` : ''}
                    ${errorOverride ? `--input-error-border: ${errorOverride}; --input-error-text: ${errorOverride}; --input-error-ring: color-mix(in srgb, ${errorOverride} 80%, transparent);` : ''}
                }
            ` }} />
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16 input-preview-sandbox"
            >

                {/* Standard Inputs Section */}
                <section className="space-y-6">
                    <div className="flex items-center justify-start gap-2 text-muted-foreground pb-2 px-2">
                        <Icon name="info" size={14} className="opacity-60" />
                        <h3 className="font-display text-titleSmall tracking-tight text-transform-primary">Standard Inputs</h3>
                    </div>

                    <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 md:p-12 relative overflow-hidden">
                        <div className="grid grid-cols-1 select-none md:grid-cols-2 gap-8 md:gap-12 justify-items-stretch items-start">

                            {/* Column Headers */}
                            <div className="text-labelSmall font-body text-transform-secondary text-theme-muted text-transform-primary tracking-widest text-left w-full pb-4 border-b border-border/50">Default</div>
                            <div className="text-labelSmall font-body text-transform-secondary text-theme-muted text-transform-primary tracking-widest text-left w-full pb-4 border-b border-border/50">With Icons</div>

                            {/* Standard */}
                            <div className="space-y-6 w-full max-w-sm">
                                <div className="space-y-2">
                                    <label className="text-labelMedium font-body text-transform-secondary opacity-80 pl-1 block">Default Input</label>
                                    <Input
                                        disabled={disabled}
                                        placeholder="Enter your text here..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-labelMedium font-body text-transform-secondary opacity-80 pl-1 block">Filled Variant</label>
                                    <Input
                                        variant="filled"
                                        disabled={disabled}
                                        placeholder="Filled background"
                                    />
                                </div>
                                <div className="space-y-2 opacity-50 select-none">
                                    <label className="text-labelMedium font-body text-transform-secondary pl-1 block cursor-not-allowed">Disabled Config</label>
                                    <Input
                                        disabled={true}
                                        placeholder="Disabled input"
                                    />
                                </div>
                            </div>

                            {/* With Icons / Statuses */}
                            <div className="space-y-6 w-full max-w-sm">
                                <div className="space-y-2">
                                    <label className="text-labelMedium font-body text-transform-secondary opacity-80 pl-1 block">Leading Icon</label>
                                    <Input
                                        disabled={disabled}
                                        placeholder="Search here..."
                                        leadingIcon="search"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-labelMedium font-body text-transform-secondary opacity-80 pl-1 block">Trailing Icon</label>
                                    <Input
                                        disabled={disabled}
                                        placeholder="Enter password..."
                                        type="password"
                                        trailingIcon="visibility"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-labelMedium font-body text-transform-secondary opacity-80 pl-1 block">Context-Aware Error State</label>
                                    
                                    <FormProvider {...methods}>
                                        <form className="space-y-4">
                                            <Input
                                                disabled={disabled}
                                                placeholder="Needs 5+ chars..."
                                                {...methods.register("sandboxError")}
                                            />
                                            <p className="text-label-small text-muted-foreground italic px-1 pt-1 opacity-60">
                                                * Try typing above to clear the error.
                                            </p>
                                        </form>
                                    </FormProvider>
                                </div>
                            </div>

                        </div>
                    </div>
                </section>

                {/* Interactive Cloud Icon Warning */}
                <div className="mt-8 flex justify-center opacity-40">
                    <div className="flex items-center gap-2 bg-warning-container text-on-warning-container px-3 py-1.5 rounded-full text-label-small font-dev tracking-widest text-transform-tertiary">
                        <Icon name="cloud_download" size={14} className="text-current" />
                        Sync to Layer 3 ZAP Global Template
                    </div>
                </div>

            </div>
        </ComponentSandboxTemplate>
    );
}
