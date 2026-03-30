'use client';

import React, { useState, useEffect } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { DialogsSection } from '../../../../../zap/sections/molecules/containment/DialogsSection';
import { Select as ZapSelect } from '../../../../../genesis/atoms/interactive/option-select';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { toast } from 'sonner';

export default function DialogsPage() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
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

    const effectiveProps = getEffectiveProps('Dialog');
    
    // We only need Radius and Width
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps?.radius)?.value.split(' ')[0] || '28px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps?.width)?.value.split(' ')[0] || '1px';

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
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-outline-variant/30 text-on-surface text-transform-primary'}`}
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
                className={`w-full bg-layer-base ${value !== '' ? 'border-primary/50 text-primary' : 'border-outline-variant/30 text-on-surface text-transform-primary'}`}
            />
        );
    };

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/molecules/dialogs/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "Dialog Structural Settings", type: "Docs Link", filePath: "zap/molecules/dialogs/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-label-small text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider uppercase">Sandbox Variables</h4>
                        <div className="space-y-4">
                            <div className="space-y-1">
                                <span className="text-label-small text-on-surface-variant text-transform-secondary flex justify-between">
                                    <span>Width Override</span>
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
                                <span className="text-label-small text-on-surface-variant text-transform-secondary flex justify-between">
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
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // Trigger local publish for any direct CSS vars if they ever exist, currently empty for Dialogs
            const variables = {};
            const res1 = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables })
            });

            // Publish global border radius for the L1 override map
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, state })
            });

            if (res1.ok && res2.ok) {
                toast.success(`Published Dialog border properties to ${activeTheme}`);
            } else {
                toast.error('Failed to publish dialog overrides');
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
            componentName="Dialogs"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="src/zap/sections/molecules/containment/DialogsSection.tsx"
            importPath="@/zap/sections/molecules/containment/DialogsSection"
            inspectorControls={inspectorControls}
            inspectorFooter={
                <ThemePublisher 
                    theme={activeTheme} 
                    filePath="src/zap/sections/molecules/containment/DialogsSection.tsx" 
                    onPublish={handlePublish} 
                    isLoading={isSubmitting} 
                />
            }
            foundationInheritance={{
                colorTokens: [
                    'bg-layer-panel (L3 backdrop container)',
                    'bg-surface-container (dialog body)',
                    'bg-error-container / text-on-error-container (icon badge)',
                    'bg-error / text-error-foreground (destructive action)',
                ],
                typographyScales: ['text-on-surface text-transform-primary', 'text-on-surface-variant text-transform-secondary'],
            }}
            platformConstraints={{
                web: 'Dialog is max-w-md centered inside an L3 container. Buttons are rounded-full pill style.',
                mobile: 'Dialog goes full-width with reduced padding. Action buttons stack vertically on narrow screens.',
            }}
            foundationRules={[
                'The backdrop container uses bg-layer-panel (L3 surface).',
                'The dialog body uses bg-surface-container — a semantic alias that inherits correctly from the theme.',
                'Buttons inside dialogs are EXEMPT from layer tagging.',
                'Dialog corners use rounded-3xl for M3 compliance.',
                'Destructive actions use bg-error with text-error-foreground — never hardcoded hex.',
            ]}
        >
            <div 
                className="w-full flex flex-col gap-8 py-8"
                style={Object.assign({}, {
                    '--dialog-border-width': previewWidth,
                    '--dialog-border-radius': previewRadius,
                } as React.CSSProperties)}
            >
                <DialogsSection />
            </div>
        </ComponentSandboxTemplate>
    );
}
