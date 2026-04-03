'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { InspectorAccordion } from '../../../../../zap/organisms/laboratory/InspectorAccordion';
import { ProfileSwitcher, Profile } from '../../../../../genesis/molecules/profile-switcher';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

const MOCK_PROFILES: Profile[] = [
    {
        id: '1',
        name: 'Alicia Keys',
        email: 'alicia.keys@music.com',
        avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: '2',
        name: 'Bryan Adams',
        email: 'bryan.adams@music.com',
        avatarUrl: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: '3',
        name: 'Charlie Puth',
        email: 'charlie.puth@music.com',
        avatarUrl: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    {
        id: '4',
        name: 'Diana Ross',
        email: 'diana.ross@music.com',
        avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    }
];

export default function ProfileSwitcherSandbox() {
    const [activeId, setActiveId] = useState<string>('1');

    return (
        <ComponentSandboxTemplate
            componentName="Profile Switcher"
            status="Verified"
            tier="Molecules"
            filePath="zap/molecules/profile-switcher/page.tsx"
            importPath="@/components/ui/profile-switcher"
            inspectorControls={
                <InspectorAccordion title="Switcher Data">
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="profile-switcher" title="Profile Switcher Sandbox" description="Interactive components for Profile Switcher" icon="widgets" />
                    <CanvasBody.Demo className="flex flex-col gap-4">
                        <div className="flex flex-col gap-2">
                            <span className="text-body-small font-semibold text-on-surface text-transform-primary">Current Active ID</span>
                            <span className="text-label-small font-mono text-transform-tertiary text-on-surface-variant text-transform-secondary bg-surface-variant p-2 rounded">{activeId}</span>
                        </div>
                        </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
                </InspectorAccordion>
            }
        >
            <ProfileSwitcher 
                profiles={MOCK_PROFILES}
                activeProfileId={activeId}
                onProfileChange={setActiveId}
            />
        </ComponentSandboxTemplate>
    );
}
