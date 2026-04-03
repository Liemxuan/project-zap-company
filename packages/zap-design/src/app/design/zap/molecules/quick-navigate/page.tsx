'use client';
import { parseCssToNumber } from '../../../../../lib/utils';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import React, { useState, useEffect } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { Label } from '../../../../../genesis/atoms/interactive/label';
import { Heading } from '../../../../../genesis/atoms/typography/headings';
import { Text } from '../../../../../genesis/atoms/typography/text';
import { QuickNavigate } from '../../../../../genesis/molecules/quick-navigate';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { toast } from 'sonner';

export default function QuickNavigateSandboxPage() {
    const [height, setHeight] = useState([32]);
    const { state, setComponentOverride, hydrateState, getEffectiveProps } = useBorderProperties();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Sync with DB on mount
    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const res = await fetch('/api/border_radius/publish?theme=metro');
                if (res.ok && mounted) {
                    const data = await res.json();
                    if (data.success && data.data && data.data.state) hydrateState(data.data.state);
                }
            } catch (err) { console.error(err); }
        };
        loadSettings();
        return () => { mounted = false; };
    }, [hydrateState]);

    const effectiveProps = getEffectiveProps('Select'); // QuickNavigate uses Select tokens
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '8px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '1px';

    const handlePublish = async () => {
        setIsSubmitting(true);
        try {
            // 1. Publish height
            await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: 'metro', variables: { '--select-height': height[0] + 'px' }})
            });

            // 2. Publish border radius & width globally
            const res2 = await fetch('/api/border_radius/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: 'metro', state })
            });

            if (res2.ok) {
                toast.success(`Settings Published`);
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderRadiusSelect = (value: string, onChange: (val: string) => void) => (
        <select 
            className={`w-full bg-layer-base border ${value !== '' ? 'border-primary/50 text-on-surface' : 'border-outline-variant/30 text-on-surface/50'} rounded px-2 py-1 text-label-small font-dev text-transform-tertiary outline-none`}
            style={{ backgroundColor: 'var(--color-surface-container-highest)' }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">(Inherit Universal)</option>
            {BORDER_RADIUS_TOKENS.map(t => (
                <option key={t.token} value={t.token}>{t.name} ({t.token})</option>
            ))}
        </select>
    );

    const renderWidthSelect = (value: string, onChange: (val: string) => void) => (
        <select 
            className={`w-full bg-layer-base border ${value !== '' ? 'border-primary/50 text-on-surface' : 'border-outline-variant/30 text-on-surface/50'} rounded px-2 py-1 text-label-small font-dev text-transform-tertiary outline-none`}
            style={{ backgroundColor: 'var(--color-surface-container-highest)' }}
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">(Inherit Universal)</option>
            {BORDER_WIDTH_TOKENS.map(t => (
                <option key={t.token} value={t.token}>{t.name} ({t.token})</option>
            ))}
        </select>
    );

    const inspectorControls = (
        
            <div className="space-y-4">
                
                    <div className="space-y-6">
 <Text size="label-small" className="text-transform-primary font-display font-bold text-on-surface-variant text-transform-secondary tracking-wider block">Quick Navigate Variables</Text>

                        <div className="space-y-4">
                            <div className="space-y-2">
 <div className="flex justify-between items-center font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary ">
                                    <Text size="label-small">--select-height</Text>
                                    <Text size="label-small" className="font-bold">{height[0]}px</Text>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={24} max={64} step={2} className="w-full" />
                            </div>

                            <div className="space-y-2">
 <div className="flex justify-between items-center font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary pb-1">
                                    <Text size="label-small">Border Radius</Text>
                                    <Text size="label-small" className="font-bold opacity-50">{effectiveProps.radius}</Text>
                                </div>
                                {renderRadiusSelect(state.components['Select']?.radius || '', (val) => setComponentOverride('Select', 'radius', val))}
                            </div>

                            <div className="space-y-2">
 <div className="flex justify-between items-center font-dev text-transform-tertiary text-on-surface-variant text-transform-secondary pb-1">
                                    <Text size="label-small">Border Width</Text>
                                    <Text size="label-small" className="font-bold opacity-50">{effectiveProps.width}</Text>
                                </div>
                                {renderWidthSelect(state.components['Select']?.width || '', (val) => setComponentOverride('Select', 'width', val))}
                            </div>
                        </div>
                    </div>
                
            </div>
        
    );

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--select-height']) setHeight([parseCssToNumber(variables['--select-height'])]);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Quick Navigate"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="genesis/molecules/quick-navigate"
            importPath="@/genesis/molecules/quick-navigate"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--color-surface-container-highest', '--color-primary'],
                typographyScales: ['--font-body (body-small)']
            }}
            platformConstraints={{
                web: "Renders as an inline dropdown (Popover).",
                mobile: "Search overlay could trigger a full screen modal."
            }}
            foundationRules={[
                "Adheres to Select Atom border and radius tokens.",
                "Hover states map to hover:bg-layer-panel.",
            ]} 
            onLoadedVariables={handleLoadedVariables}
            inspectorFooter={
                <ThemePublisher 
                    theme="metro"
                    isLoading={isSubmitting}
                    onPublish={handlePublish}
                    filePath="packages/zap-design/src/app/design/zap/molecules/quick-navigate/page.tsx"
                />
            }
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="quick-navigate" title="Quick Navigate Sandbox" description="Interactive components for Quick Navigate" icon="widgets" />
                    <CanvasBody.Demo className="w-full">
            <div
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16"
                style={{
                    '--select-height': `${height[0]}px`,
                    '--select-border-radius': previewRadius,
                    '--select-border-width': previewWidth
                } as React.CSSProperties}
            >
                <div className="space-y-6">
                    
                        <div className="flex items-center justify-start gap-2 text-on-surface-variant text-transform-secondary pb-2 px-2">
                            <Icon name="search" size={14} className="opacity-60" />
                            <Heading level={3} className="tracking-tight text-transform-primary uppercase">Quick Navigate Search</Heading>
                        </div>
                    

                    <div className="bg-layer-panel rounded-[24px] border border-outline-variant/50 p-8 md:p-12 relative overflow-visible h-[400px]">
                        
                            <div className="max-w-xs space-y-4">
                                <div className="space-y-2">
                                    <Label className="text-on-surface-variant text-transform-secondary font-bold tracking-widest uppercase mb-2 block"><Text size="label-medium" className="inline">Quick Navigate</Text></Label>
                                    <QuickNavigate className="w-full" />
                                </div>
                            </div>
                        
                    </div>
                </div>
            </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}

