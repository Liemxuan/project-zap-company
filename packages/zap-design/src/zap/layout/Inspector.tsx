'use client';

import React from 'react';
import { Icon } from '../../genesis/atoms/icons/Icon';

import { useTheme } from '../../components/ThemeContext';
import { ContainerDevWrapper } from '../../components/dev/ContainerDevWrapper';
import { Wrapper } from '../../components/dev/Wrapper';
import { Switch } from '../../genesis/atoms/interactive/switch';

interface InspectorProps {
    title?: string;
    children?: React.ReactNode;
    footer?: React.ReactNode;
    isOpen?: boolean;
    width?: number;
}

export const Inspector = ({
    title = 'Inspector',
    children,
    footer,
    width = 280,
}: Omit<InspectorProps, 'isOpen'>) => {
    const { devMode, setDevMode, inspectorState, setInspectorState } = useTheme();

    if (inspectorState === 'collapsed') return null;

    return (
        <ContainerDevWrapper
            showClassNames={devMode}
            identity={{
                displayName: "Inspector Sidebar",
                filePath: "zap/layout/Inspector.tsx",
                parentComponent: "MasterVerticalShell",
                type: "Organism/Shell",
                architecture: "ZAP // LAYOUT"
            }}
            className="flex-shrink-0 h-full flex flex-col"
            style={{ width }}
            align="right"
        >
            <aside
                className="group relative bg-layer-panel flex flex-col w-full flex-1 overflow-hidden"
            >

                {/* Header */}
                <Wrapper identity={{ displayName: title.toUpperCase(), type: "Wrapped Snippet", filePath: "zap/layout/Inspector.tsx" }}>
                    <div className="h-14 px-4 flex items-center justify-between shrink-0 bg-layer-base/50 backdrop-blur-md">
                        <div className="flex items-center gap-2">
                            <Icon name="palette" size={18} className="text-on-surface" />
                            <h2 className="font-black text-on-surface text-[11px] tracking-widest font-display text-transform-primary ">
                                {title}
                            </h2>
                            <button
                                onClick={() => setInspectorState('collapsed')}
                                title="Collapse Inspector"
                                className="ml-1.5 px-1 py-0.5 text-on-surface-variant hover:text-on-surface hover:bg-surface-variant/50 border border-outline rounded-[4px] flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-200 outline-none"
                            >
                                <div className="flex items-center justify-center">
                                    <Icon name="chevron_right" size={12} weight={700} />
                                </div>
                            </button>
                        </div>
                        <div className="flex items-center" title="Toggle Dev Mode">
                            <Switch
                                checked={devMode}
                                onCheckedChange={setDevMode}
                                className="scale-75 cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
                            />
                        </div>
                    </div>
                </Wrapper>

                {/* Content Container */}
                <div className="flex-1 py-4 overflow-y-auto scrollbar-hide relative">
                    <Wrapper identity={{ displayName: "Inspector Body", type: "Wrapped Snippet", filePath: "zap/layout/Inspector.tsx" }}>
                        <div className="px-4 space-y-4">
                            {children || (
                                <div className="flex flex-col items-center justify-center h-32 opacity-30">
                                    <span className="text-[9px] font-bold text-gray-400 font-secondary text-transform-primary tracking-widest">No Selection</span>
                                </div>
                            )}
                        </div>
                    </Wrapper>
                </div>

                {/* Footer Section */}
                {footer && (
                    <div
                        className="shrink-0 relative z-10 bg-layer-panel"
                    >
                        <section className="p-4 border-t border-border/50">
                            {footer}
                        </section>
                    </div>
                )}
            </aside>
        </ContainerDevWrapper>
    );
};
