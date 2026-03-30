'use client';

import React from 'react';
import { MetroPageHeader } from '../../../zap/layout/MetroPageHeader';
import { type TabItem } from '../../../genesis/atoms/interactive/Tabs';
import { type Platform } from '../../../genesis/molecules/navigation/PlatformToggle';
import { Wrapper } from '../../../components/dev/Wrapper';
import { LiveBlinker } from '../../../genesis/atoms/indicators/LiveBlinker';

export interface MetroHeaderProps {
    title: React.ReactNode;
    breadcrumb?: string;
    badge?: string | null;
    tabs?: TabItem[];
    activeTab?: string;
    onTabChange?: (tab: string) => void;
    liveIndicator?: boolean;
    platform?: Platform;
    setPlatform?: (platform: Platform) => void;
    showBackground?: boolean;
    rightSlot?: React.ReactNode;
}

export const MetroHeader = ({
    title,
    breadcrumb,
    badge = 'Experimental Component Preview',
    tabs,
    activeTab,
    onTabChange,
    liveIndicator = false,
    platform,
    setPlatform,
    showBackground = true,
    rightSlot
}: MetroHeaderProps) => {
    return (
        <Wrapper identity={{ displayName: "Metro Header", filePath: "genesis/molecules/layout/MetroHeader.tsx", type: "Wrapped Snippet", architecture: "L4: Molecules" }}>
            <MetroPageHeader
                title={title}
                breadcrumb={breadcrumb}
                badge={badge}
                tabs={tabs}
                activeTab={activeTab}
                onTabChange={onTabChange}
                platform={platform}
                setPlatform={setPlatform}
                showBackground={showBackground}
                rightSlot={
                    rightSlot || (liveIndicator ? <LiveBlinker /> : undefined)
                }
            />
        </Wrapper>
    );
};
