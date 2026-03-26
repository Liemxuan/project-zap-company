'use client';

import React from 'react';
import { cn } from '../../../lib/utils';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { ToggleGroup, ToggleGroupItem } from '../../../genesis/atoms/interactive/toggle-group';
import { Wrapper } from '../../../components/dev/Wrapper';

export type Platform = 'web' | 'mobile';

interface PlatformToggleProps {
    platform: Platform;
    setPlatform: (p: Platform) => void;
    className?: string;
}

export const PlatformToggle = ({ platform, setPlatform, className }: PlatformToggleProps) => (
    <Wrapper 
        identity={{ displayName: "Platform Toggle", filePath: "genesis/molecules/navigation/PlatformToggle.tsx", type: "Molecule", architecture: "L4: Molecules" }}
        style={Object.assign({}, { borderRadius: 'calc(var(--button-border-radius, 8px) + 4px)' })}
    >
        <div className={cn("flex items-center bg-layer-panel rounded-[calc(var(--button-border-radius,8px)+4px)] p-1", className)}>
            <ToggleGroup 
                type="single"
                value={platform}
                onValueChange={(val: 'web' | 'mobile') => {
                    if (val) setPlatform(val);
                }}
                visualStyle="ghost"
                className="gap-1"
            >
                <ToggleGroupItem value="web" aria-label="Web">
                    <Icon name="language" size={16} />
                    Web
                </ToggleGroupItem>
                <ToggleGroupItem value="mobile" aria-label="Mobile">
                    <Icon name="smartphone" size={16} />
                    Mobile
                </ToggleGroupItem>
            </ToggleGroup>
        </div>
    </Wrapper>
);
