'use client';

import React, { useState } from 'react';
import { Button } from '../../../genesis/atoms/interactive/buttons';
import { AuthLayoutSplit } from '../../../zap/layout/AuthLayoutSplit';
import { EmptyStateContainer } from '../../../zap/layout/EmptyStateContainer';
import { SettingsLayout } from '../../../zap/layout/SettingsLayout';

const PlaceholderBlock = ({ title, desc }: { title: string, desc?: string }) => (
    <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center border-4 border-dashed border-primary/50 text-primary bg-primary/5 p-12 text-center rounded-3xl">
        <h2 className="text-2xl font-black uppercase tracking-widest mb-2">{title}</h2>
        {desc && <p className="text-sm font-medium opacity-70">{desc}</p>}
    </div>
);

const Container = ({ children, activeTemplate, setActiveTemplate }: { children: React.ReactNode, activeTemplate: 'auth' | 'empty' | 'settings', setActiveTemplate: (t: 'auth' | 'empty' | 'settings') => void }) => (
    <div className="flex flex-col h-screen relative">
        <div className="p-4 bg-muted/50 border-b flex gap-4 z-[9999] absolute top-0 w-full justify-center shadow-sm">
            <Button visualStyle="ghost" variant="flat" onClick={() => setActiveTemplate('auth')} className={`px-4 py-2 font-bold text-xs uppercase rounded border ${activeTemplate === 'auth' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground'}`}>Auth Split</Button>
            <Button visualStyle="ghost" variant="flat" onClick={() => setActiveTemplate('empty')} className={`px-4 py-2 font-bold text-xs uppercase rounded border ${activeTemplate === 'empty' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground'}`}>Empty State</Button>
            <Button visualStyle="ghost" variant="flat" onClick={() => setActiveTemplate('settings')} className={`px-4 py-2 font-bold text-xs uppercase rounded border ${activeTemplate === 'settings' ? 'bg-primary text-primary-foreground border-primary' : 'bg-background text-foreground'}`}>Settings Layout</Button>
        </div>
        <div className="flex-1 w-full h-full relative">
            {children}
        </div>
    </div>
);

export default function L6NewShowcasePage() {
    const [activeTemplate, setActiveTemplate] = useState<'auth' | 'empty' | 'settings'>('auth');

    if (activeTemplate === 'auth') {
        return (
            <Container activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate}>
                <AuthLayoutSplit
                    title="Welcome to Phase 6"
                    description="This entire right panel is the brand injection zone, safely abstracted."
                    brandContent={<div className="w-[300px] h-[300px] rounded-full bg-gradient-to-br from-primary/20 to-primary/60 blur-3xl mix-blend-multiply"></div>}
                >
                    <PlaceholderBlock title="Auth Form Area" desc="LoginForm or SignupForm organisms go here." />
                </AuthLayoutSplit>
            </Container>
        );
    }
    
    if (activeTemplate === 'empty') {
        return (
            <Container activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate}>
                <EmptyStateContainer>
                    <PlaceholderBlock title="Nothing Here" desc="404, No Data, or Onboarding graphics center perfectly here." />
                </EmptyStateContainer>
            </Container>
        );
    }

    if (activeTemplate === 'settings') {
        return (
            <Container activeTemplate={activeTemplate} setActiveTemplate={setActiveTemplate}>
                <SettingsLayout
                    sidebar={<PlaceholderBlock title="Sticky Sidebar" desc="ScrollspyMenu goes here." />}
                >
                    <PlaceholderBlock title="Settings Block 1" />
                    <PlaceholderBlock title="Settings Block 2" />
                    <PlaceholderBlock title="Settings Block 3" />
                </SettingsLayout>
            </Container>
        );
    }

    return null;
}
