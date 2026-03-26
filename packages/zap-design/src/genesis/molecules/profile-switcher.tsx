'use client';

import * as React from 'react';
import { Avatar } from '../../genesis/atoms/status/avatars';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { cn } from '../../lib/utils';
import { Wrapper } from '../../components/dev/Wrapper';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '../../genesis/molecules/dropdown-menu';

export interface Profile {
    id: string;
    name: string;
    email: string;
    avatarUrl?: string;
}

export interface ProfileSwitcherProps extends React.HTMLAttributes<HTMLDivElement> {
    profiles: Profile[];
    activeProfileId: string;
    onProfileChange?: (profileId: string) => void;
}

export function ProfileSwitcher({
    profiles,
    activeProfileId,
    onProfileChange,
    className,
    ...props
}: ProfileSwitcherProps) {
    console.log("PROFILE SWITCHER RENDER:", profiles.length); const activeProfile = profiles.find(p => p.id === activeProfileId) || profiles[0];

    // Determine fallback initials based on user name
    const getInitials = (name: string) => {
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <Wrapper identity={{ displayName: 'ProfileSwitcher', filePath: 'components/ui/profile-switcher.tsx', type: 'Molecule', architecture: 'L4: Molecules' }}>
            <div className={cn("flex flex-col gap-2 w-full max-w-[320px]", className)} {...props}>
                <span className="font-body text-[12px] font-bold tracking-wider text-transform-tertiary uppercase">
                    PROFILE SWITCHER
                </span>
                
                <div className="w-64 h-32 bg-red-500 text-white font-bold flex items-center justify-center text-xl">DROPDOWN PLACEHOLDER</div><DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <button className="flex items-center justify-between w-full p-3 rounded-lg border-2 border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] bg-surface outline-hidden focus-visible:ring-[length:var(--input-focus-width,2px)] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))]">
                            <div className="flex items-center gap-3 text-left">
                                <Avatar 
                                    size="md" 
                                    src={activeProfile?.avatarUrl}
                                    initials={activeProfile ? getInitials(activeProfile.name) : "?"}
                                    className="border border-outline shrink-0 shadow-sm"
                                />
                                <div className="flex flex-col overflow-hidden">
                                    <span className="font-display text-[15px] font-semibold text-on-surface text-transform-primary truncate">
                                        {activeProfile?.name}
                                    </span>
                                    <span className="font-body text-[13px] text-on-surface-variant text-transform-secondary truncate">
                                        {activeProfile?.email}
                                    </span>
                                </div>
                            </div>
                            <Icon name="expand_less" size="md" className="text-on-surface-variant text-transform-secondary mr-1 h-5 w-5 opacity-70 shrink-0" />
                        </button>
                    </DropdownMenuTrigger>
                    
                    <DropdownMenuContent className="w-[320px] rounded-xl p-2 bg-surface shadow-xl border-outline-variant" align="start">
                        {profiles.map((profile) => (
                            <DropdownMenuItem 
                                key={profile.id}
                                className={cn(
                                    "flex items-center justify-between w-full p-3 mb-1 cursor-pointer rounded-lg hover:bg-surface-variant transition-colors data-[highlighted]:bg-surface-variant",
                                )}
                                onClick={() => onProfileChange?.(profile.id)}
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <Avatar 
                                        size="md" 
                                        src={profile.avatarUrl}
                                        initials={getInitials(profile.name)}
                                        className="shrink-0 shadow-sm"
                                    />
                                    <div className="flex flex-col overflow-hidden">
                                        <span className="font-display text-[15px] font-semibold text-on-surface text-transform-primary truncate">
                                            {profile.name}
                                        </span>
                                        <span className="font-body text-[13px] text-on-surface-variant text-transform-secondary truncate">
                                            {profile.email}
                                        </span>
                                    </div>
                                </div>
                                
                                {profile.id === activeProfileId && (
                                    <Icon name="check" size="sm" className="text-primary h-5 w-5 shrink-0" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Wrapper>
    );
}

export default ProfileSwitcher;
