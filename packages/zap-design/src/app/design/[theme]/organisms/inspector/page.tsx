"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { LaboratoryTemplate } from "@/zap/templates/LaboratoryTemplate";
import { ThemeHeader } from "@/genesis/molecules/layout/ThemeHeader";
import { ContainerDevWrapper } from "@/components/dev/ContainerDevWrapper";
import { L5Inspector, L5InspectorFooter } from "@/genesis/organisms/inspector";
import { useBorderProperties } from "@/zap/sections/atoms/border_radius/use-border-properties";

export default function InspectorOrganismPage() {
    const { theme } = useParams() as { theme: string };

    const [activeColor, setActiveColor] = useState('primary');
    const [activeSize, setActiveSize] = useState('medium');
    const [customVar, setCustomVar] = useState([16]);
    const [disabled, setDisabled] = useState(false);

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
                const res = await fetch(`/api/border_radius/publish?theme=${theme}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data && data.state && mounted) {
                        hydrateState(data.state);
                    }
                }
            } catch (e) {
                console.error("Failed to load border settings", e);
            }
        };
        loadSettings();
        return () => { mounted = false; };
    }, [theme, hydrateState]);

    const effectiveProps = getEffectiveProps('Inspector');

    return (
        <LaboratoryTemplate
            componentName="Inspector Architecture"
            tier="L4/L5 TEMPLATE"
            coverTitle="Inspector"
            coverBadge="[ L5 System Layout ]"
            headerMode={
                <ThemeHeader
                    title="Inspector Structure"
                    breadcrumb="organism / layout"
                    badge="L4/L5 Standard"
                    liveIndicator={false}
                />
            }
            inspectorConfig={{
                title: "Inspector Panel",
                width: 360,
                footer: (
                    <L5InspectorFooter 
                        borderState={state}
                        publishContext={{
                            activeTheme: theme,
                            filePath: "app/design/zap/organisms/inspector/page.tsx",
                            customVariables: { '--demo-spacing': customVar[0] + 'px' }
                        }}
                    />
                ),
                content: (
                    <ContainerDevWrapper 
                        identity={{
                            displayName: "InspectorDemoPanel",
                            type: "Info/Legend",
                            filePath: "components/InspectorPanel.tsx",
                            architecture: "GENESIS / M3"
                        }}
                    >
                        <L5Inspector 
                            componentName="Inspector"
                            activeColor={activeColor}
                            onColorChange={setActiveColor}
                            activeSize={activeSize}
                            onSizeChange={setActiveSize}
                            customVariableLabel="--demo-spacing"
                            customVariableValue={customVar}
                            onCustomVariableChange={setCustomVar}
                            borderState={state}
                            setComponentOverride={setComponentOverride}
                            clearComponentOverride={clearComponentOverride}
                            effectiveProps={effectiveProps}
                            disabled={disabled}
                            onDisabledChange={setDisabled}
                            docsLabel="Inspector Reference Protocol"
                            docsHref="vscode://file/Users/zap/Workspace/olympus/packages/zap-design/src/genesis/organisms/inspector.tsx"
                            publishContext={{
                                activeTheme: theme,
                                filePath: "app/design/zap/organisms/inspector/page.tsx",
                                customVariables: { '--demo-spacing': customVar[0] + 'px' }
                            }}
                        />
                    </ContainerDevWrapper>
                )
            }}
        >
            <div className="w-full h-full flex flex-col items-center justify-center py-16 px-12 space-y-8 bg-layer-panel border-r border-border scrollbar-hide">
                <div className="max-w-2xl text-center space-y-6">
                    <h1 className="text-4xl font-display text-transform-primary font-medium text-foreground tracking-tight">The Inspector Framework</h1>
                    <p className="font-body text-transform-secondary text-muted-foreground text-lg leading-relaxed">
                        This laboratory page demonstrates the standard L4-L7 Inspector protocol using authentic ZAP components.
                        The panel on the right runs a connected <code>&lt;L5Inspector&gt;</code> with standard bindings.
                    </p>
                    
                    <div className="mt-8 p-8 bg-layer-dialog border border-outline-variant rounded-[32px] mx-auto w-fit" 
                        style={Object.assign({}, {
                            padding: `${customVar[0]}px`,
                            backgroundColor: `var(--color-${activeColor}-container, var(--color-${activeColor}))`,
                            color: `var(--color-on-${activeColor}-container, var(--color-on-${activeColor}))`,
                            opacity: disabled ? 0.5 : 1,
                            borderRadius: effectiveProps.radius === 'inherit' ? 'var(--radius-md)' : `var(${effectiveProps.radius})`
                        }) as React.CSSProperties}
                    >
                        <h3 className="font-display text-transform-primary font-bold text-2xl mb-2">Live Demo Sandbox</h3>
                        <p className="font-body text-transform-secondary opacity-80">Adjust properties in the Inspector to see real-time updates.</p>
                    </div>
                </div>
            </div>
        </LaboratoryTemplate>
    );
}
