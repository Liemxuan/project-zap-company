'use client';

import React, { useEffect, useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { ProductImage } from '../../../../../genesis/atoms/data-display/ProductImage';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../../../genesis/atoms/interactive/select';
import { Toggle } from '../../../../../genesis/atoms/interactive/toggle';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { useBorderProperties } from '../../../../../zap/sections/atoms/border_radius/use-border-properties';
import { BORDER_RADIUS_TOKENS, BORDER_WIDTH_TOKENS } from '../../../../../zap/sections/atoms/foundations/schema';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';

export default function ProductsImageSandboxPage() {
    const [size, setSize] = useState<'sm' | 'md' | 'lg' | 'xl'>('xl');
    const [interactive, setInteractive] = useState(false);
    
    // ZAP DYNAMIC PROPERTIES PROTOCOL
    const { theme: activeTheme } = useTheme();
    const { state, setComponentOverride, hydrateState, getEffectiveProps } = useBorderProperties();
    
    const effectiveProps = getEffectiveProps('ProductImage');
    const previewRadius = BORDER_RADIUS_TOKENS.find(t => t.token === effectiveProps.radius)?.value.split(' ')[0] || '8px';
    const previewWidth = BORDER_WIDTH_TOKENS.find(t => t.token === effectiveProps.width)?.value.split(' ')[0] || '1px';

    useEffect(() => {
        let mounted = true;
        const loadSettings = async () => {
            try {
                const res = await fetch(`/api/border_radius/publish?theme=${activeTheme || 'metro'}`);
                if (res.ok && mounted) {
                    const data = await res.json();
                    if (data.success && data.data && data.data.state) hydrateState(data.data.state);
                }
            } catch (err) { console.error(err); }
        };
        loadSettings();
        return () => { mounted = false; };
    }, [activeTheme, hydrateState]);

    const inspectorControls = (
        <Wrapper identity={{ displayName: "Products Image Properties", type: "Inspector", filePath: "zap/atoms/products-image/page.tsx" }}>
            <div className="space-y-6">
            <div className="space-y-4 pb-4 border-b border-border/50">
                <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Configuration</h4>
                
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dynamic Border Radius</label>
                        <select 
                            title="Dynamic Border Radius Selection"
                            className={`w-full bg-layer-base border ${effectiveProps.radius !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'} rounded px-2 py-1.5 text-xs text-transform-primary`}
                            value={effectiveProps.radius || ''}
                            onChange={(e) => setComponentOverride('ProductImage', 'radius', e.target.value)}
                        >
                            <option value="">(Inherit Universal L1)</option>
                            {BORDER_RADIUS_TOKENS.map(t => (
                                <option key={t.token} value={t.token}>{t.name} ({t.token})</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Size Base</label>
                        <Select value={size} onValueChange={(val: any) => setSize(val)}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="sm">Small (48px)</SelectItem>
                                <SelectItem value="md">Medium (96px)</SelectItem>
                                <SelectItem value="lg">Large (160px)</SelectItem>
                                <SelectItem value="xl">Extra Large (256px)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Dynamic Border Width</label>
                        <select 
                            title="Dynamic Border Width Selection"
                            className={`w-full bg-layer-base border ${effectiveProps.width !== '' ? 'border-primary/50 text-primary' : 'border-border/30 text-foreground'} rounded px-2 py-1.5 text-xs text-transform-primary`}
                            value={effectiveProps.width || ''}
                            onChange={(e) => setComponentOverride('ProductImage', 'width', e.target.value)}
                        >
                            <option value="">(Inherit Universal L1)</option>
                            {BORDER_WIDTH_TOKENS.map(t => (
                                <option key={t.token} value={t.token}>{t.name} ({t.token})</option>
                            ))}
                        </select>
                    </div>

                    <div className="flex items-center justify-between mt-4 border-t border-border/50 pt-4">
                        <label className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Interactive (Hover)</label>
                        <Toggle pressed={interactive} onPressedChange={setInteractive} />
                    </div>
                </div>
            </div>
            </div>
        </Wrapper>
    );

    return (
        <ComponentSandboxTemplate
            componentName="Product Image"
            tier="L3 ATOM"
            status="Verified"
            filePath="src/genesis/atoms/data-display/ProductImage.tsx"
            importPath="@/genesis/atoms/data-display/ProductImage"
            inspectorControls={inspectorControls}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary']
            }}
            platformConstraints={{
                web: "Fluid intrinsic sizing with object-cover.",
                mobile: "Standard touch targets sizes when interactive."
            }}
            foundationRules={[
                "Product Images inherit Dynamic Properties from the L1 Schema.",
                "Border Colors default to primary when border width is active.",
                "Aspect ratio is rigidly constrained to 1:1."
            ]}
            publishPayload={{
                // Publishing the global component state for border rules
                '--product-image-border-radius': previewRadius,
                '--product-image-border-width': previewWidth
            }}
        >
            <style dangerouslySetInnerHTML={{ __html: `
                .product-image-preview-sandbox {
                    --product-image-border-radius: ${previewRadius};
                    --product-image-border-width: ${previewWidth};
                }
            ` }} />
            <CanvasBody flush={false}>
                <div className="product-image-preview-sandbox w-full">
                <CanvasBody.Section>
                    <SectionHeader id="dynamic-preview" 
                        number="01"
                        title="Dynamic Configuration"
                        icon="image"
                        description="Interactive product image scaling and masking behaviors."
                    />
                    <CanvasBody.Demo centered>
                        <div className="flex items-center justify-center p-8">
                            <ProductImage 
                                src="/lego/keyboard.png"
                                alt="ZAP Signature Mechanical Keyboard"
                                size={size}
                                interactive={interactive}
                            />
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>

                <CanvasBody.Section className="pb-16">
                    <SectionHeader id="ecommerce-samples" 
                        number="02"
                        title="E-Commerce Composition"
                        icon="dashboard"
                        description="Multiple product images arrayed in a catalog context."
                    />
                    <CanvasBody.Demo centered={false}>
                        <div className="flex flex-wrap justify-around items-end gap-12 p-8">
                            <div className="flex flex-col items-center gap-3">
                                <ProductImage 
                                    src="/lego/keyboard.png"
                                    alt="Keyboard"
                                    size="sm"
                                    interactive={interactive}
                                />
                                <span className="text-xs font-medium text-muted-foreground">48 px (sm)</span>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <ProductImage 
                                    src="/lego/apparel.png"
                                    alt="Apparel"
                                    size="md"
                                    interactive={interactive}
                                />
                                <span className="text-xs font-medium text-muted-foreground">96 px (md)</span>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <ProductImage 
                                    src="/lego/hardware.png"
                                    alt="Hardware"
                                    size="lg"
                                    interactive={interactive}
                                />
                                <span className="text-xs font-medium text-muted-foreground">160 px (lg)</span>
                            </div>

                            <div className="flex flex-col items-center gap-3">
                                <ProductImage 
                                    src="/lego/electronics.png"
                                    alt="Electronics"
                                    size="xl"
                                    interactive={interactive}
                                />
                                <span className="text-xs font-medium text-muted-foreground">256 px (xl)</span>
                            </div>
                        </div>
                    </CanvasBody.Demo>
                </CanvasBody.Section>
                </div>
            </CanvasBody>
        </ComponentSandboxTemplate>
    );
}
