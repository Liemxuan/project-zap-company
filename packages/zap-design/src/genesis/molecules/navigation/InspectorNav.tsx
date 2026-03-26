'use client';

import React, { useState } from 'react';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { PropertyBox, PropertyRow } from '../../../genesis/atoms/data-display/PropertyBox';
import { Toggle } from '../../../genesis/atoms/interactive/custom-toggle';
import { Panel } from '../../../genesis/atoms/surfaces/panel';
import { ContainerDevWrapper } from '../../../components/dev/ContainerDevWrapper';
import { Wrapper } from '../../../components/dev/Wrapper';
import { useTheme } from '../../../components/ThemeContext';
import { Button } from '../../../genesis/atoms/interactive/buttons';

export interface InspectorNavProps {
    showDevWrapper?: boolean;
}

export const InspectorNav: React.FC<InspectorNavProps> = ({ showDevWrapper = false }) => {
    const { devMode } = useTheme();
    const isDev = showDevWrapper && devMode;
    const [isVisible, setIsVisible] = useState(true);

    const content = (
        <Panel className="w-80 shrink-0 bg-panel-white h-[500px] shadow-[6px_6px_0px_0px_var(--color-black)]">
            <div className="h-14 border-b border-outline-variant/50 flex items-center justify-between px-4 bg-layer-panel">
                <span className="text-xs font-black text-transform-secondary tracking-widest text-theme-base">Properties</span>
                <Wrapper identity={{ displayName: "Inspector Action: Close", type: "Atom/Action", filePath: "genesis/molecules/navigation/InspectorNav.tsx" }}>
                    <Button visualStyle="ghost" variant="flat" size="tiny" aria-label="Close Inspector" className="hover:bg-theme-base hover:text-theme-inverted p-1 text-theme-base">
                        <Icon name="close" size={18} />
                    </Button>
                </Wrapper>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-layer-cover">
                <Wrapper identity={{ displayName: "Inspector Box: Information", type: "Molecule/Action", filePath: "genesis/molecules/navigation/InspectorNav.tsx" }}>
                    <PropertyBox>
                        <div className="bg-layer-panel text-theme-base p-2 border-b-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] text-[10px] font-black text-transform-secondary tracking-widest">
                            Information
                        </div>
                        <div className="p-4 space-y-3">
                            <div className="h-3 w-3/4 bg-surface-container-border/20 border-[length:var(--card-border-width,0px)] border-card-border/20"></div>
                            <div className="h-3 w-1/2 bg-surface-container-border/20 border-[length:var(--card-border-width,0px)] border-card-border/20"></div>
                        </div>
                    </PropertyBox>
                </Wrapper>

                <Wrapper identity={{ displayName: "Inspector Box: Settings", type: "Molecule/Action", filePath: "genesis/molecules/navigation/InspectorNav.tsx" }}>
                    <PropertyBox>
                        <div className="bg-layer-panel text-theme-base p-2 border-b-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] text-[10px] font-black text-transform-secondary tracking-widest">
                            Settings
                        </div>
                        <PropertyRow
                            label="Visible"
                            value={
                                <Wrapper identity={{ displayName: "Inspector Setting Toggle", type: "Atom/Action", filePath: "genesis/molecules/navigation/InspectorNav.tsx" }}>
                                    <Toggle checked={isVisible} onChange={setIsVisible} />
                                </Wrapper>
                            }
                        />
                    </PropertyBox>
                </Wrapper>
            </div>

            {/* Footer */}
            <div className="border-t-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] p-4 bg-layer-cover flex items-center justify-end">
                <Wrapper identity={{ displayName: "Inspector Action: Save", type: "Atom/Action", filePath: "genesis/molecules/navigation/InspectorNav.tsx" }}>
                    <Button visualStyle="solid" variant="flat" className="px-6 py-2 bg-theme-base text-theme-inverted hover:bg-theme-base/80 shadow-card active:translate-x-[2px] active:translate-y-[2px] active:shadow-none">
                        Save Changes
                    </Button>
                </Wrapper>
            </div>
        </Panel>
    );

    if (isDev) {
        return (
            <ContainerDevWrapper
                showClassNames={true}
                align="right"
                identity={{
                    displayName: "InspectorNav",
                    filePath: "genesis/molecules/navigation/InspectorNav.tsx",
                    type: "Molecule/Block",
                    architecture: "SYSTEMS // CORE"
                }}
            >
                {content}
            </ContainerDevWrapper>
        );
    }

    return content;
};
