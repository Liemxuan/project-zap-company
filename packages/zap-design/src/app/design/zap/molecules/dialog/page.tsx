'use client';

import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import React, { useState, useEffect } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { useTheme } from '../../../../../components/ThemeContext';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS, ZAP_LAYER_MAP } from '../../../../../zap/sections/atoms/foundations/schema';
import { Select } from '../../../../../genesis/atoms/interactive/option-select';
import { toast } from 'sonner';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter
} from '../../../../../genesis/molecules/dialog';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Input } from '../../../../../genesis/atoms/interactive/inputs';
import { Label } from '../../../../../genesis/atoms/typography/label';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

export default function DialogSandboxPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const [gap, setGap] = useState([24]);
    const [padding, setPadding] = useState([32]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Global Registry Link
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

    const effectiveProps = getEffectiveProps('Dialog');
    
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '24px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '0px';

    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit L4)', value: 'inherit' },
            ...BORDER_RADIUS_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <Select 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit L4)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const renderWidthSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit L4)', value: 'inherit' },
            ...BORDER_WIDTH_TOKENS.map(t => ({ label: `${t.name} (${t.token})`, value: t.token }))
        ];
        return (
            <Select 
                value={safeValue} 
                onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                options={options}
                placeholder="(Inherit L4)"
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
            />
        );
    };

    const previewBgLayer = state.components['Dialog']?.bg || '';
    const previewBgTokenDef = ZAP_LAYER_MAP.find(L => L.zapToken === previewBgLayer);
    const previewBgCssVar = previewBgTokenDef 
        ? `var(--color-${previewBgTokenDef.m3Token.replace('bg-', '')})` 
        : ''; // Fallback to CSS inline var

    const renderBgSelect = (value: string, onChange: (val: string) => void) => {
        const safeValue = value === '' ? 'inherit' : value;
        const options = [
            { label: '(Inherit L4)', value: 'inherit' },
            ...ZAP_LAYER_MAP.map(L => ({ label: `${L.zapLayer} (${L.zapToken})`, value: L.zapToken }))
        ];
        return (
            <div className="[--input-height:32px]">
                <Select 
                    value={safeValue} 
                    onChange={(val) => onChange(val === 'inherit' ? '' : val)}
                    options={options}
                    placeholder="(Inherit L4)"
                    className={`w-full bg-layer-base text-label-small ${value !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'}`}
                />
            </div>
        );
    };

    const inspectorControls = (
        <>
            <div className="space-y-4">
                
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dialog-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={0} max={64} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--dialog-padding</span>
                                    <span className="font-bold">{padding[0]}px</span>
                                </div>
                                <Slider value={padding} onValueChange={setPadding} min={0} max={64} step={1} className="w-full" />
                            </div>

                            <div className="space-y-1 mt-4 border-t border-border/50 pt-4">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Radius Override</span>
                                    <span className="font-bold">{previewRadius}</span>
                                </span>
                                {renderRadiusSelect(
                                    state.components['Dialog']?.radius || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Dialog', 'radius');
                                        else setComponentOverride('Dialog', 'radius', val);
                                    }
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                <span className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Border Width Override</span>
                                    <span className="font-bold">{previewWidth}</span>
                                </span>
                                {renderWidthSelect(
                                    state.components['Dialog']?.width || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Dialog', 'width');
                                        else setComponentOverride('Dialog', 'width', val);
                                    }
                                )}
                            </div>

                            <div className="space-y-1">
                                <label className="text-label-small text-muted-foreground flex justify-between">
                                    <span>Background / Layer</span>
                                    <span className="font-bold whitespace-nowrap overflow-hidden text-ellipsis ml-2 max-w-[120px]">{previewBgTokenDef ? previewBgTokenDef.zapLayer : 'Default'}</span>
                                </label>
                                {renderBgSelect(
                                    state.components['Dialog']?.bg || '', 
                                    (val) => {
                                        if (val === '') clearComponentOverride('Dialog', 'bg');
                                        else setComponentOverride('Dialog', 'bg', val);
                                    }
                                )}
                            </div>
                        </div>
                    </div>
                
            </div>
        </>
    );

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            const customVars: Record<string, string> = {
                '--dialog-gap': gap[0] + 'px',
                '--dialog-padding': padding[0] + 'px'
            };

            const res1 = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables: customVars })
            });

            // Publish border radius, width, and background globally
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Dialog Settings Published`, { description: `Successfully synced values to the ${activeTheme} theme.` });
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
            componentName="Dialog"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/dialog.tsx"
            importPath="@/components/ui/dialog"
            inspectorControls={inspectorControls}
            inspectorFooter={
                <ThemePublisher
                    theme={activeTheme}
                    onPublish={handlePublish}
                    isLoading={isSubmitting}
                    filePath={`app/design/zap/molecules/dialog/page.tsx`}
                />
            }
            foundationInheritance={{
                colorTokens: [],
                typographyScales: ["font-display", "font-body", "text-transform-primary", "text-transform-secondary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .dialog-preview-sandbox {
                    --dialog-gap: ${gap[0]}px;
                    --dialog-padding: ${padding[0]}px;
                    --dialog-border-radius: ${previewRadius};
                    --dialog-border-width: ${previewWidth};
                    ${previewBgCssVar ? `--dialog-bg: ${previewBgCssVar};` : ''}
                }
            ` }} />
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="dialog" title="Dialog Sandbox" description="Interactive components for Dialog" icon="widgets" />
                    <CanvasBody.Demo className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl dialog-preview-sandbox">
                <Dialog modal={false}>
                    <DialogTrigger asChild>
                        <Button variant="flat">Open Dialog</Button>
                    </DialogTrigger>
                    <DialogContent 
                        className="sm:max-w-[425px]"
                        onInteractOutside={(e) => e.preventDefault()}
                    >
                        <DialogHeader>
                            <DialogTitle>Edit Profile</DialogTitle>
                            <DialogDescription>
                                Make changes to your profile here. Click save when you&apos;re done.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-4 py-4">
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="name">
                                    Name
                                </Label>
                                <Input aria-label="Input component" id="name" defaultValue="Pedro Duarte" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="username">
                                    Username
                                </Label>
                                <Input aria-label="Input component" id="username" defaultValue="@peduarte" type="text" />
                            </div>
                            <div className="flex flex-col gap-2">
                                <Label htmlFor="email">
                                    Email
                                </Label>
                                <Input aria-label="Input component" id="email" defaultValue="pedro@zeus.com" type="email" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="flat" type="submit">Save changes</Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}