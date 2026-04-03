"use client";

import React, { useState } from 'react';
import { useTheme } from '../../../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { L5Inspector } from '../../../../../genesis/organisms/inspector';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { ThemePublisher } from '../../../../../components/dev/ThemePublisher';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';
import { parseCssToNumber } from '../../../../../lib/utils';

export default function InspectorSandboxPage() {
    const { theme: appTheme } = useTheme();

    // 1. Core Config
    const [color, setColor] = useState('primary');
    const [size, setSize] = useState('medium');
    const [disabled, setDisabled] = useState(false);
    
    // Custom Sandbox Variable
    const [mockPanelWidth, setMockPanelWidth] = useState([320]);

    // Structural CSS overrides mimicking NavLink
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([8]);

    const handleLoadedVariables = (variables: Record<string, string>) => {
        if (variables['--input-border-width']) setBorderWidth([parseCssToNumber(variables['--input-border-width'])]);
        if (variables['--input-border-radius']) setBorderRadius([parseCssToNumber(variables['--input-border-radius'])]);
    };

    // Mock Border State (since useBorderProperties hook requires a real context we just mock it for display)
    const mockBorderState = {
        components: {
            'MockComponent': { width: 'token-width-1', radius: 'token-radius-2' }
        }
    };
    const mockEffectiveProps = { width: 'token-width-1', radius: 'token-radius-2' };

    const inspectorControls = (
        <L5Inspector
            componentName="MockComponent"
            activeColor={color}
            onColorChange={setColor}
            activeSize={size}
            onSizeChange={setSize}
            customVariableLabel="--panel-width"
            customVariableValue={mockPanelWidth}
            onCustomVariableChange={setMockPanelWidth}
            customVariableMin={240}
            customVariableMax={600}
            customVariableStep={10}
            borderState={mockBorderState}
            setComponentOverride={() => {}}
            clearComponentOverride={() => {}}
            effectiveProps={mockEffectiveProps}
            disabled={disabled}
            onDisabledChange={setDisabled}
            docsLabel="Inspector Architecture Protocol"
            docsHref="vscode://file/Users/zap/Workspace/olympus/packages/zap-design/src/genesis/organisms/inspector.tsx"
        >
            <Wrapper identity={{ displayName: "Dropdown Structural Settings", type: "Control Row", filePath: "zap/organisms/inspector/page.tsx" }}>
                <div className="space-y-6 pt-4 border-t border-border/50">
                    <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Dropdown Config</h4>
                    
                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-label-small font-secondary text-transform-secondary text-muted-foreground">
                            <span>Input Border Width</span>
                            <span className="font-bold">{borderWidth[0]}px</span>
                        </div>
                        <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={4} step={1} className="w-full" />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between items-center text-label-small font-secondary text-transform-secondary text-muted-foreground">
                            <span>Input Corner Radius</span>
                            <span className="font-bold">{borderRadius[0]}px</span>
                        </div>
                        <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={32} step={1} className="w-full" />
                    </div>
                </div>
            </Wrapper>
        </L5Inspector>
    );

    return (
        <div className="contents" style={Object.assign({
            '--input-border-width': `${borderWidth[0]}px`,
            '--input-border-radius': `${borderRadius[0]}px`,
        })}>
        <ComponentSandboxTemplate
            componentName="L5 Inspector Sandbox"
            tier="L5 ORGANISM"
            status="Verified"
            filePath="src/genesis/organisms/inspector.tsx"
            importPath="@/genesis/organisms/inspector"
            inspectorControls={inspectorControls}
            publishPayload={{
                '--input-border-width': `${borderWidth[0]}px`,
                '--input-border-radius': `${borderRadius[0]}px`,
            }}
            onLoadedVariables={handleLoadedVariables}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['--font-display']
            }}
            platformConstraints={{
                web: "Must adapt width gracefully. The custom variable slider takes arrays since it relies on Radix slider.",
                mobile: "Collapses to bottom sheet or hides inside a settings dialog."
            }}
            foundationRules={[
                "L5Inspector should wrap logical control groupings via Wrapper for transparency.",
                "Custom variables must provide min/max/step values.",
                "Disabled state is optional and will not render if onDisabledChange is undefined."
            ]}
            inspectorFooter={<ThemePublisher theme={appTheme} onPublish={() => {}} filePath="src/genesis/organisms/inspector.tsx" />}
        >
            <div className="w-full h-full flex items-center justify-center p-12 bg-layer-base border border-border/50 rounded-2xl">
                <Wrapper identity={{ displayName: "Inspector Demo Preview", type: "Demo Area", filePath: "zap/organisms/inspector/page.tsx" }}>
                    <div 
                        className="bg-layer-panel border border-border/50 rounded-lg p-8 space-y-4 shadow-lg transition-all duration-300"
                        style={{ width: `${mockPanelWidth[0]}px` }}
                    >
                        <h3 className="font-display font-bold text-titleLarge text-transform-primary opacity-50">
                            Mock Component Area
                        </h3>
                        <p className="font-body text-bodyMedium text-transform-secondary text-surface-foreground/80">
                            The L5 Inspector to the right controls my width and settings in real-time.
                        </p>
                        <div className="flex gap-2 text-label-small font-dev text-transform-tertiary font-bold">
                            <span className="px-2 py-1 bg-surface-base rounded border border-border/50">Color: {color}</span>
                            <span className="px-2 py-1 bg-surface-base rounded border border-border/50">Size: {size}</span>
                        </div>
                        {disabled && (
                            <div className="mt-4 p-2 bg-destructive/10 text-destructive text-body-small font-bold rounded border border-destructive/20 text-center">
                                Component is Disabled
                            </div>
                        )}
                    </div>
                </Wrapper>
            </div>
        </ComponentSandboxTemplate>
        </div>
    );
}
