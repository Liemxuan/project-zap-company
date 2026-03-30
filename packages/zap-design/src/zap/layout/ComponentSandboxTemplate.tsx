'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import { LaboratoryTemplate } from '../../zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '../../genesis/molecules/layout/ThemeHeader';
import { Wrapper } from '../../components/dev/Wrapper';
import { ContainerDevWrapper } from '../../components/dev/ContainerDevWrapper';
import { useTheme } from '../../components/ThemeContext';
import { type Platform } from '../../zap/sections/atoms/foundations/components';
import { InspectorAccordion } from '../../zap/organisms/laboratory/InspectorAccordion';
import { ThemePublisher } from '../../components/dev/ThemePublisher';

export interface ComponentSandboxTemplateProps {
    componentName: string;
    tier: string;
    status: 'Verified' | 'In Progress' | 'Beta' | 'Legacy' | 'Refactor Required';
    filePath: string;
    importPath: string;
    children: React.ReactNode;
    inspectorControls?: React.ReactNode;
    inspectorFooter?: React.ReactNode;
    publishPayload?: Record<string, string>;
    onLoadedVariables?: (variables: Record<string, string>) => void;
    foundationInheritance?: {
        colorTokens?: string[];
        typographyScales?: string[];
    };
    platformConstraints?: {
        web?: string;
        mobile?: string;
    };
    foundationRules?: string[]; // zap_foundation.md mandates
    terminalData?: {
        databaseType?: string;
        databaseLocation?: string;
    };
    fullWidth?: boolean;
    hideDataTerminal?: boolean;
}

export const ComponentSandboxTemplate = ({
    componentName,
    tier,
    status,
    filePath,
    importPath,
    children,
    inspectorControls,
    inspectorFooter,
    foundationInheritance,
    platformConstraints,
    foundationRules,
    publishPayload,
    onLoadedVariables,
    terminalData,
    fullWidth = false,
    hideDataTerminal = false
}: ComponentSandboxTemplateProps) => {
    const { devMode, theme } = useTheme();
    const [platform, setPlatform] = useState<Platform>('web');
    const activeTheme = theme === 'core' ? 'core' : 'metro';

    // Global Registry Rehydration
    React.useEffect(() => {
        if (!onLoadedVariables) return;
        let mounted = true;
        async function fetchSettings() {
            try {
                const res = await fetch(`/api/theme/publish?theme=${activeTheme}`);
                if (res.ok && mounted) {
                    const data = await res.json();
                    if (data.variables) {
                        onLoadedVariables?.(data.variables);
                    }
                }
            } catch (error) {
                console.error("Failed to fetch component settings:", error);
            }
        }
        fetchSettings();
        return () => { mounted = false; };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [activeTheme]); // Intentionally omitting onLoadedVariables to prevent infinite loops from inline functions

    // Global Registry Dispatch
    const handlePublish = async () => {
        if (!publishPayload) return;
        try {
            const res = await fetch('/api/theme/publish', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ theme: activeTheme, variables: publishPayload })
            });

            if (res.ok) {
                alert(`${componentName} structural parameters successfully saved to ${activeTheme.toUpperCase()} Global Source.`);
            } else {
                const data = await res.json();
                alert(`Error publishing theme: ${data.error}`);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to publish. Check console.');
        }
    };

    const breadcrumbCategory = tier.split(' ').pop() || 'COMPONENT';

    const header = (
        <ThemeHeader
            title={`${componentName} Assembly`}
            breadcrumb={`Zap Design Engine / Metro / ${breadcrumbCategory}`}
            badge="Component Sandbox"
            liveIndicator={false}
            platform={platform}
            setPlatform={setPlatform}
        />
    );

    const inspectorContent = (
        <ContainerDevWrapper
            showClassNames={devMode}
            identity={{
                displayName: `${componentName} Inspector`,
                filePath: "zap/layout/ComponentSandboxTemplate.tsx",
                type: "Inspector Panel",
                architecture: "ZAP // Lab"
            }}
        >
            <div className="flex flex-col gap-0">
                
                {/* The DebugAuditor Default Status Block */}
                {!hideDataTerminal && (
                    <Wrapper identity={{ displayName: "Data Terminal (Metadata)", filePath: "zap/layout/ComponentSandboxTemplate.tsx", type: "Wrapped Snippet", architecture: "Metadata" }}>
                        <InspectorAccordion title="Data Terminal" icon="database" defaultOpen={true}>
                            <div className="space-y-4 p-4 bg-layer-dialog rounded-lg border border-border/50">
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground opacity-60">Status</p>
                                    <div className={cn(
                                        "inline-flex items-center px-2.5 py-1 rounded text-[10px] font-bold text-transform-secondary",
                                        status === 'Verified' ? "bg-green-500/10 text-green-500 border border-green-500/20" :
                                        status === 'Beta' || status === 'In Progress' ? "bg-amber-500/10 text-amber-500 border border-amber-500/20" :
                                        "bg-red-500/10 text-red-500 border border-red-500/20"
                                    )}>
                                        {status}
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground opacity-60">Tier</p>
                                    <p className="text-xs font-dev text-transform-tertiary font-medium text-on-surface">{tier}</p>
                                </div>
                                <div className="space-y-1">
                                    <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground opacity-60">Import</p>
                                    <code className="text-[10px] leading-tight block p-2 bg-on-surface/5 rounded-md border border-border/50 font-dev text-transform-tertiary break-all text-on-surface-variant">
                                        import &#123; {componentName} &#125; from &apos;{importPath}&apos;;
                                    </code>
                                </div>
                                {terminalData && (
                                    <>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground opacity-60">Database</p>
                                            <p className="text-xs font-dev text-transform-tertiary font-medium text-on-surface">{terminalData.databaseType}</p>
                                        </div>
                                        <div className="space-y-1">
                                            <p className="text-[10px] font-black text-transform-secondary tracking-widest text-muted-foreground opacity-60">Location</p>
                                            <p className="text-[10px] leading-tight block p-2 bg-on-surface/5 rounded-md border border-border/50 font-dev text-transform-tertiary break-all text-on-surface-variant">
                                                {terminalData.databaseLocation}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </InspectorAccordion>
                    </Wrapper>
                )}

                {/* Component Specific Controls — slot 2, right below Data Terminal */}
                {inspectorControls && (
                    <Wrapper identity={{ displayName: "Interactive Controls", filePath: "zap/layout/ComponentSandboxTemplate.tsx", type: "Wrapped Snippet", architecture: "Sandbox" }}>
                        <InspectorAccordion title="Dynamic Properties" icon="tune" defaultOpen={true}>
                            <div className="pt-2">
                                {inspectorControls}
                            </div>
                        </InspectorAccordion>
                    </Wrapper>
                )}

                {/* Foundation Rules (zap_foundation.md) */}
                {foundationRules && foundationRules.length > 0 && (
                    <Wrapper identity={{ displayName: "M3 Foundation Directives", filePath: "zap/layout/ComponentSandboxTemplate.tsx", type: "Wrapped Snippet", architecture: "Compliance" }}>
                        <InspectorAccordion title="Foundation Rules" icon="security" defaultOpen={true}>
                            <ul className="space-y-2 mt-2">
                                {foundationRules.map((rule, idx) => (
                                    <li key={idx} className="text-[11px] font-body text-transform-secondary text-on-surface-variant leading-relaxed pl-2 border-l-2 border-primary/20">
                                        {rule}
                                    </li>
                                ))}
                            </ul>
                        </InspectorAccordion>
                    </Wrapper>
                )}

                {/* Foundation Inheritance L1/L2 */}
                {(foundationInheritance?.colorTokens || foundationInheritance?.typographyScales) && (
                    <Wrapper identity={{ displayName: "L1/L2 Inheritance Map", filePath: "zap/layout/ComponentSandboxTemplate.tsx", type: "Wrapped Snippet", architecture: "Architecture" }}>
                        <InspectorAccordion title="Inheritance Map" icon="account_tree" defaultOpen={true}>
                            <div className="space-y-4 pt-2">
                                {foundationInheritance.colorTokens && (
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold text-transform-secondary text-on-surface-variant">Colors (L1):</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {foundationInheritance.colorTokens.map(t => (
                                                <span key={t} className="px-2 py-1 bg-primary-container text-on-primary-container border border-primary/20 rounded-[4px] text-[10px] font-dev text-transform-tertiary">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                                {foundationInheritance.typographyScales && (
                                    <div className="space-y-2">
                                        <span className="text-[10px] font-bold text-transform-secondary text-on-surface-variant">Typography (L1/L2):</span>
                                        <div className="flex flex-wrap gap-1.5">
                                            {foundationInheritance.typographyScales.map(t => (
                                                <span key={t} className="px-2 py-1 bg-secondary-container text-on-secondary-container border border-secondary/20 rounded-[4px] text-[10px] font-dev text-transform-tertiary">{t}</span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </InspectorAccordion>
                    </Wrapper>
                )}

                {/* Cross-Platform Rules */}
                {(platformConstraints?.web || platformConstraints?.mobile) && (
                    <Wrapper identity={{ displayName: "Platform Parity", filePath: "zap/layout/ComponentSandboxTemplate.tsx", type: "Wrapped Snippet", architecture: "Platform" }}>
                        <InspectorAccordion title="Platform Context" icon="devices" defaultOpen={true}>
                            <div className="mt-2 rounded-lg border border-border bg-layer-dialog overflow-hidden">
                                <div className="flex items-center gap-2 px-3 py-2 bg-layer-dialog/50 border-b border-border">
                                    <span className="text-[11px] font-bold tracking-wide text-transform-secondary text-on-surface">
                                        {platform === 'web' ? 'Web (Desktop) Implementation' : 'Mobile Implementation'}
                                    </span>
                                </div>
                                <div className="p-3 text-[11px] font-body text-transform-secondary text-on-surface-variant leading-relaxed">
                                    {platform === 'web'
                                        ? (platformConstraints.web || "No specific web constraints defined.")
                                        : (platformConstraints.mobile || "No specific mobile constraints defined.")
                                    }
                                </div>
                            </div>
                        </InspectorAccordion>
                    </Wrapper>
                )}

            </div>
        </ContainerDevWrapper>
    );

    return (
        <LaboratoryTemplate
            componentName={componentName}
            tier={tier}
            filePath={filePath}
            headerMode={header}
            inspectorConfig={{
                title: `${componentName} Lab`,
                content: inspectorContent,
                footer: inspectorFooter || (publishPayload ? (
                    <ThemePublisher 
                        theme={theme} 
                        onPublish={handlePublish} 
                        filePath={filePath}
                    />
                ) : undefined)
            }}
            coverTitle=""
            coverBadge=""
            flush={true}
        >
            {/* Component Sandbox Canvas */}
            <div className={`flex-1 relative flex items-start justify-center w-full h-full bg-layer-base overflow-hidden items-stretch pt-3 ${fullWidth ? 'px-0' : 'px-12'} pb-8`}>
                <div className="w-full flex flex-col h-full items-stretch relative">
                    {children}
                </div>
            </div>
        </LaboratoryTemplate>
    );
};
