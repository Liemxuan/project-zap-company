'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';

import { Alert, AlertContent, AlertDescription, AlertTitle } from '../../../../../genesis/molecules/alert';
import { CheckCircle, AlertTriangle, Info, XCircle } from 'lucide-react';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../genesis/atoms/interactive/select';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

const VARIANT_CONTENT = {
    secondary: { title: "System Notice", desc: "This is a secondary alert providing additional context.", icon: Info },
    primary: { title: "Important Update", desc: "Our system is undergoing scheduled maintenance.", icon: Info },
    destructive: { title: "Connection Failed", desc: "Unstable network detected. Trying to reconnect...", icon: XCircle },
    success: { title: "Payment Successful", desc: "Your transaction has been processed properly. Reference #12345.", icon: CheckCircle },
    info: { title: "New Feature", desc: "Check out the updated dashboard for better analytics insights.", icon: Info },
    warning: { title: "Subscription Expiring", desc: "Your pro plan expires in 3 days. Renew now to avoid interruption.", icon: AlertTriangle },
    outline: { title: "Heads up", desc: "This is an outlined alert.", icon: Info },
};


const M3_COLORS = [
    { label: 'Surface (L1)', value: 'var(--m3-sys-light-surface)' },
    { label: 'Surface Container High (L2)', value: 'var(--m3-sys-light-surface-container-high)' },
    { label: 'Surface Container Highest (L3)', value: 'var(--m3-sys-light-surface-container-highest)' },
    { label: 'Primary Container', value: 'var(--color-primary-container)' },
    { label: 'Error Container', value: 'var(--color-error-container)' },
    { label: 'Success Container', value: 'var(--color-success-container)' },
];

const M3_TEXT_COLORS = [
    { label: 'On Surface', value: 'var(--m3-sys-light-on-surface)' },
    { label: 'On Surface Variant', value: 'var(--m3-sys-light-on-surface-variant)' },
    { label: 'On Primary Container', value: 'var(--color-on-primary-container)' },
    { label: 'On Error Container', value: 'var(--color-on-error-container)' },
    { label: 'On Success Container', value: 'var(--color-on-success-container)' },
];

const M3_BORDER_COLORS = [
    { label: 'Outline Variant', value: 'var(--m3-sys-light-outline-variant)' },
    { label: 'Primary Fixed', value: 'var(--color-primary-fixed)' },
    { label: 'Error', value: 'var(--color-error)' },
    { label: 'Success', value: 'var(--color-success)' },
    { label: 'Transparent', value: 'transparent' },
];

export default function AlertSandboxPage() {
    const [padding, setPadding] = useState([16]);
    const [gap, setGap] = useState([12]);
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([8]);
    const [calloutBorder, setCalloutBorder] = useState([4]);
    const [visualStyle, setVisualStyle] = useState<'standard' | 'callout'>('standard');
    const [selectedVariant, setSelectedVariant] = useState<keyof typeof VARIANT_CONTENT>('secondary');

    const [alertBg, setAlertBg] = useState<string>('default');
    const [alertText, setAlertText] = useState<string>('default');
    const [alertBorder, setAlertBorder] = useState<string>('default');

    const [l1Bg, setL1Bg] = useState<string>('default');
    const [l2Bg, setL2Bg] = useState<string>('default');
    const [l3Bg, setL3Bg] = useState<string>('default');

    const { resolvedTheme } = useTheme();
    const activeTheme = (resolvedTheme === 'metro' || resolvedTheme === 'core') ? resolvedTheme : 'metro';
    const [isSubmitting, setIsSubmitting] = useState(false);

    const CurrentIcon = VARIANT_CONTENT[selectedVariant].icon;

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            const variables: Record<string, string> = {
                '--alert-padding': `${padding[0]}px`,
                '--alert-gap': `${gap[0]}px`,
                '--alert-border-width': `${borderWidth[0]}px`,
                '--alert-radius': `${borderRadius[0]}px`,
                '--alert-callout-border': `${calloutBorder[0]}px`,
            };
            if (alertBg && alertBg !== 'default') variables['--alert-bg'] = alertBg;
            if (alertText && alertText !== 'default') variables['--alert-text'] = alertText;
            if (alertBorder && alertBorder !== 'default') variables['--alert-border'] = alertBorder;

            const res = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables })
            });

            if (res.ok) {
                toast.success(`Published Alert properties to ${activeTheme}`);
            } else {
                toast.error('Failed to publish alert overrides');
            }
        } catch (err) {
            console.error(err);
            toast.error('Network error during publish');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Fetch initial settings
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/alert" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Alert Structural Settings", type: "Docs Link", filePath: "zap/molecules/alert/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--alert-padding</span>
                                    <span className="font-bold">{padding[0]}px</span>
                                </div>
                                <Slider value={padding} onValueChange={setPadding} min={0} max={64} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--alert-gap</span>
                                    <span className="font-bold">{gap[0]}px</span>
                                </div>
                                <Slider value={gap} onValueChange={setGap} min={0} max={64} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--alert-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--alert-radius</span>
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                </div>
                                <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={64} step={1} className="w-full" />
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                    <span>--alert-callout-border</span>
                                    <span className="font-bold">{calloutBorder[0]}px</span>
                                </div>
                                <Slider value={calloutBorder} onValueChange={setCalloutBorder} min={0} max={16} step={1} className="w-full" disabled={visualStyle !== 'callout'} />
                            </div>
                        </div>
                    </div>
                </Wrapper>

                <Wrapper identity={{ displayName: "Contextual View Options", type: "Style Selection", filePath: "zap/molecules/alert/page.tsx" }}>
                    <div className="space-y-4 pt-4 border-t border-outline-variant">
                            <span className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Semantic Overrides</span>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                        <span>--alert-bg</span>
                                    </div>
                                    <Select value={alertBg} onValueChange={setAlertBg}>
                                        <SelectTrigger className="w-full text-xs h-8">
                                            <SelectValue placeholder="Default (Inherit from Variant)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            {M3_COLORS.map(color => (
                                                <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                        <span>--alert-border</span>
                                    </div>
                                    <Select value={alertBorder} onValueChange={setAlertBorder}>
                                        <SelectTrigger className="w-full text-xs h-8">
                                            <SelectValue placeholder="Default (Inherit from Variant)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            {M3_BORDER_COLORS.map(color => (
                                                <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary">
                                        <span>--alert-text</span>
                                    </div>
                                    <Select value={alertText} onValueChange={setAlertText}>
                                        <SelectTrigger className="w-full text-xs h-8">
                                            <SelectValue placeholder="Default (Inherit from Variant)" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="default">Default</SelectItem>
                                            {M3_TEXT_COLORS.map(color => (
                                                <SelectItem key={color.value} value={color.value}>{color.label}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                        <div className="flex flex-col gap-2 pt-4 border-t border-outline-variant">
                            <span className="text-[10px] text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider">Visual Style</span>
                            <div className="flex bg-surface-variant p-1 rounded-md">
                                <button
                                    onClick={() => setVisualStyle('standard')}
                                    className={`flex-1 text-[11px] font-bold py-1.5 px-3 rounded text-center transition-all ${visualStyle === 'standard' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant text-transform-secondary hover:text-on-surface text-transform-primary'}`}
                                >
                                    Standard
                                </button>
                                <button
                                    onClick={() => setVisualStyle('callout')}
                                    className={`flex-1 text-[11px] font-bold py-1.5 px-3 rounded text-center transition-all ${visualStyle === 'callout' ? 'bg-surface text-on-surface shadow-sm' : 'text-on-surface-variant text-transform-secondary hover:text-on-surface text-transform-primary'}`}
                                >
                                    Callout
                                </button>
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );
    return (
        <ComponentSandboxTemplate
            componentName="Alert"
            tier="L4 MOLECULE"
            status="In Progress"
            filePath="src/components/ui/alert.tsx"
            importPath="@/components/ui/alert"
            inspectorControls={inspectorControls}
            inspectorFooter={
                <ThemePublisher 
                    theme={activeTheme} 
                    filePath="src/components/ui/alert.tsx" 
                    onPublish={handlePublish} 
                    isLoading={isSubmitting} 
                />
            }
            foundationInheritance={{
                colorTokens: [],
                typographyScales: ["font-display", "font-body", "text-transform-primary"]
            }}
            platformConstraints={{ web: "N/A", mobile: "N/A" }}
            foundationRules={[]}
        >
            <div 
                className="w-full p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl flex items-center justify-center animate-in fade-in duration-500 pb-16"
                style={Object.assign({}, {
                    '--alert-padding': `${padding[0]}px`,
                    '--alert-gap': `${gap[0]}px`,
                    '--alert-border-width': `${borderWidth[0]}px`,
                    '--alert-radius': `${borderRadius[0]}px`,
                    '--alert-callout-border': `${calloutBorder[0]}px`,
                    ...(alertBg && alertBg !== 'default' ? { '--alert-bg': alertBg } : {}),
                    ...(alertText && alertText !== 'default' ? { '--alert-text': alertText } : {}),
                    ...(alertBorder && alertBorder !== 'default' ? { '--alert-border': alertBorder } : {}),
                } as React.CSSProperties)}
            >
                <div className="w-full max-w-4xl grid grid-cols-1 gap-6">
                    {/* Dynamic Interactive Sandbox */}
                    <div className="p-8 pb-12 rounded-xl bg-layer-panel border-b-4 border-outline-variant/30 flex flex-col gap-4 shadow-sm relative overflow-visible">
                        <div className="absolute top-0 right-0 p-2 bg-layer-2 rounded-bl-lg border-b border-l border-outline-variant/30 text-[10px] font-bold text-on-surface-variant text-transform-secondary font-dev tracking-widest uppercase">Interactive Sandbox</div>
                        <Alert variant={selectedVariant} visualStyle={visualStyle} style={Object.assign({}, {
                            ...(alertBg && alertBg !== 'default' ? { '--alert-bg': alertBg } : {}),
                            ...(alertText && alertText !== 'default' ? { '--alert-text': alertText } : {}),
                            ...(alertBorder && alertBorder !== 'default' ? { '--alert-border': alertBorder } : {}),
                        } as React.CSSProperties)}>
                            <CurrentIcon className="h-4 w-4" />
                            <AlertContent>
                                <AlertTitle>{VARIANT_CONTENT[selectedVariant].title} (Dynamic Overrides)</AlertTitle>
                                <AlertDescription>
                                    This alert inherits the exact custom CSS variables and variant selected in the inspector.
                                </AlertDescription>
                            </AlertContent>
                        </Alert>
                    </div>

                    <div className="w-full flex items-center gap-4 py-4">
                        <div className="h-px bg-outline-variant flex-1" />
                        <span className="text-xs font-bold text-on-surface-variant text-transform-secondary font-display uppercase tracking-wider">L1-L3 Assemblies (Static Variants)</span>
                        <div className="h-px bg-outline-variant flex-1" />
                    </div>

                    {/* L1 Surface Assembly */}
                    <div className="p-8 rounded-xl bg-layer-1 border border-outline-variant/30 flex flex-col gap-4 shadow-sm relative overflow-visible">
                        <div className="absolute top-0 right-0 py-1 pl-3 pr-2 bg-layer-2 rounded-bl-lg border-b border-l border-outline-variant/30 flex items-center gap-3">
                            <span className="text-[10px] font-bold text-on-surface-variant text-transform-secondary font-dev tracking-widest uppercase">L1 Surface</span>
                            <Select value={l1Bg} onValueChange={setL1Bg}>
                                <SelectTrigger className="h-6 text-[10px] w-32 border-outline-variant/50">
                                    <SelectValue placeholder="Alert Bg" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default" className="text-[10px]">Inherit Default</SelectItem>
                                    {M3_COLORS.map(color => (
                                        <SelectItem key={color.value} value={color.value} className="text-[10px]">{color.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Alert variant="success" visualStyle={visualStyle} style={Object.assign({}, { ...(l1Bg !== 'default' ? { '--alert-bg': l1Bg } : {}) } as React.CSSProperties)}>
                            <CheckCircle className="h-4 w-4" />
                            <AlertContent>
                                <AlertTitle>{VARIANT_CONTENT["success"].title}</AlertTitle>
                                <AlertDescription>
                                    {VARIANT_CONTENT["success"].desc}
                                </AlertDescription>
                            </AlertContent>
                        </Alert>
                    </div>

                    {/* L2 Surface Assembly */}
                    <div className="p-8 rounded-xl bg-layer-2 border border-outline-variant/30 flex flex-col gap-4 shadow-md relative overflow-visible">
                        <div className="absolute top-0 right-0 py-1 pl-3 pr-2 bg-layer-3 rounded-bl-lg border-b border-l border-outline-variant/30 flex items-center gap-3">
                            <span className="text-[10px] font-bold text-on-surface-variant text-transform-secondary font-dev tracking-widest uppercase">L2 Surface</span>
                            <Select value={l2Bg} onValueChange={setL2Bg}>
                                <SelectTrigger className="h-6 text-[10px] w-32 border-outline-variant/50">
                                    <SelectValue placeholder="Alert Bg" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default" className="text-[10px]">Inherit Default</SelectItem>
                                    {M3_COLORS.map(color => (
                                        <SelectItem key={color.value} value={color.value} className="text-[10px]">{color.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Alert variant="info" visualStyle={visualStyle} style={Object.assign({}, { ...(l2Bg !== 'default' ? { '--alert-bg': l2Bg } : {}) } as React.CSSProperties)}>
                            <Info className="h-4 w-4" />
                            <AlertContent>
                                <AlertTitle>{VARIANT_CONTENT["info"].title}</AlertTitle>
                                <AlertDescription>
                                    {VARIANT_CONTENT["info"].desc}
                                </AlertDescription>
                            </AlertContent>
                        </Alert>
                    </div>

                    {/* L3 Surface Assembly */}
                    <div className="p-8 rounded-xl bg-layer-3 border border-outline-variant/30 flex flex-col gap-4 shadow-lg relative overflow-visible">
                        <div className="absolute top-0 right-0 py-1 pl-3 pr-2 bg-surface text-on-surface rounded-bl-lg border-b border-l border-outline-variant/30 flex items-center gap-3">
                            <span className="text-[10px] font-bold font-dev tracking-widest uppercase">L3 Surface</span>
                            <Select value={l3Bg} onValueChange={setL3Bg}>
                                <SelectTrigger className="h-6 text-[10px] w-32 border-outline-variant/50">
                                    <SelectValue placeholder="Alert Bg" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default" className="text-[10px]">Inherit Default</SelectItem>
                                    {M3_COLORS.map(color => (
                                        <SelectItem key={color.value} value={color.value} className="text-[10px]">{color.label}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Alert variant="destructive" visualStyle={visualStyle} style={Object.assign({}, { ...(l3Bg !== 'default' ? { '--alert-bg': l3Bg } : {}) } as React.CSSProperties)}>
                            <XCircle className="h-4 w-4" />
                            <AlertContent>
                                <AlertTitle>{VARIANT_CONTENT["destructive"].title}</AlertTitle>
                                <AlertDescription>
                                    {VARIANT_CONTENT["destructive"].desc}
                                </AlertDescription>
                            </AlertContent>
                        </Alert>
                    </div>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}