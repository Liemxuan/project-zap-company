'use client';

import React, { useState } from 'react';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { ContainerDevWrapper } from '../../../components/dev/ContainerDevWrapper';
import { Wrapper } from '../../../components/dev/Wrapper';
import { useTheme } from '../../../components/ThemeContext';
import { Button } from '../../../genesis/atoms/interactive/buttons';

import { Logo } from '../../../genesis/atoms/icons/logo';

export interface MainNavBarProps {
    showDevWrapper?: boolean;
}

export const MainNavBar: React.FC<MainNavBarProps> = ({
    showDevWrapper = false
}) => {
    const { devMode } = useTheme();
    const isDev = showDevWrapper && devMode;
    const [searchQuery, setSearchQuery] = useState('');

    const content = (
        <Wrapper identity={{ displayName: "Global Nav Header Core", type: "Organism/Shell", filePath: "genesis/molecules/navigation/MainNavBar.tsx", architecture: "SYSTEMS // CORE" }}>
            <div className="border-b-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] bg-layer-panel h-[60px] w-full px-6 flex items-center justify-between z-[1000] relative">

                {/* Left side: Brand + Context */}
                <div className="flex items-center gap-6">
                    <Wrapper className="w-fit inline-block" identity={{ displayName: "User Profile Avatar", type: "Atom/Action", filePath: "genesis/molecules/navigation/MainNavBar.tsx" }}>
                        <Logo className="text-theme-base cursor-pointer w-[75px] h-[75px] flex items-center justify-center text-[28px]" />
                    </Wrapper>

                    <div className="h-6 w-[1px] bg-surface-container-border-[length:var(--card-border-width,1px)]"></div>

                    <Wrapper className="w-fit inline-block" identity={{ displayName: "Context Selector Button", type: "Atom/Action", filePath: "genesis/molecules/navigation/MainNavBar.tsx" }}>
                        <Button visualStyle="ghost" variant="flat" size="tiny" className="gap-2 px-2 text-theme-base hover:bg-layer-cover h-auto py-1">
                            <span className="font-display font-extrabold text-transform-primary text-[12px] tracking-wide">Site</span>
                            <Icon name="expand_more" size={14} className="text-theme-base" />
                        </Button>
                    </Wrapper>
                </div>

                {/* Right side: Search + Upgrade */}
                <div className="flex items-center gap-6">
                    <Wrapper identity={{ displayName: "Global Search Container", type: "Molecule/Action", filePath: "genesis/molecules/navigation/MainNavBar.tsx" }}>
                        <div className="relative w-[320px] hidden sm:block">
                            <div className="relative h-12 border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] bg-layer-cover flex items-center px-4 rounded-[calc(var(--card-radius)/2)]">
                                <Icon name="search" size={20} className="text-theme-base/40 mr-3" />
                                <input
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full bg-transparent text-sm font-bold text-brand-midnight font-body text-transform-secondary focus:outline-none placeholder:text-theme-base/40"
                                    placeholder="Search workspace..."
                                    aria-label="Default search input"
                                />
                                <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center justify-center">
                                    <kbd className="inline-flex items-center justify-center w-[20px] h-[20px] rounded-[calc(var(--card-radius)/2)] border-[length:var(--card-border-width,1px)] border-card-border-[length:var(--card-border-width,0px)] bg-layer-panel text-[10px] text-theme-muted font-bold text-transform-tertiary pb-[1px]">
                                        /
                                    </kbd>
                                </div>
                            </div>
                        </div>
                    </Wrapper>

                    <Wrapper className="w-fit inline-block" identity={{ displayName: "Primary Upgrade Action", type: "Atom/Action", filePath: "genesis/molecules/navigation/MainNavBar.tsx" }}>
                        <Button visualStyle="solid" variant="flat" className="h-[38px] px-5 gap-2 bg-theme-base text-theme-canvas hover:bg-theme-muted shadow-btn hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none">
                            <Icon name="diamond" size={16} className="text-theme-canvas" />
                            <span className="text-[12px] font-black text-transform-primary tracking-wide">Upgrade</span>
                        </Button>
                    </Wrapper>
                </div>
            </div>
        </Wrapper>
    );

    if (isDev) {
        return (
            <ContainerDevWrapper
                showClassNames={true}
                identity={{
                    displayName: "MainNavBar",
                    filePath: "genesis/molecules/navigation/MainNavBar.tsx",
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
