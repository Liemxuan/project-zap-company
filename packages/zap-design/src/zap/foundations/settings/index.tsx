'use client';

import React, { useState } from 'react';
import { Shield, Bell, User, Palette } from 'lucide-react';
import { Button as GenesisButton } from '../../../genesis/atoms/interactive/buttons';
import { Input as GenesisInput } from '../../../genesis/atoms/interactive/inputs';
import { Card } from '../../../genesis/atoms/surfaces/card';

import { SettingsLayout } from '../../../zap/layout/SettingsLayout';

export default function MetroSettings() {
    const [activeTab, setActiveTab] = useState('profile');

    const sidebarContent = (
        <nav className="flex flex-col gap-1 w-full font-body text-transform-secondary">
            <GenesisButton 
                visualStyle={activeTab === 'profile' ? 'solid' : 'ghost'} variant="flat" 
                className={`justify-start gap-3 w-full ${activeTab === 'profile' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setActiveTab('profile')}
            >
                <User className="size-4" />
                Profile
            </GenesisButton>
            <GenesisButton 
                visualStyle={activeTab === 'appearance' ? 'solid' : 'ghost'} variant="flat" 
                className={`justify-start gap-3 w-full ${activeTab === 'appearance' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setActiveTab('appearance')}
            >
                <Palette className="size-4" />
                Appearance
            </GenesisButton>
            <GenesisButton 
                visualStyle={activeTab === 'notifications' ? 'solid' : 'ghost'} variant="flat" 
                className={`justify-start gap-3 w-full ${activeTab === 'notifications' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setActiveTab('notifications')}
            >
                <Bell className="size-4" />
                Notifications
            </GenesisButton>
            <GenesisButton 
                visualStyle={activeTab === 'security' ? 'solid' : 'ghost'} variant="flat" 
                className={`justify-start gap-3 w-full ${activeTab === 'security' ? 'bg-primary-container text-on-primary-container' : 'text-on-surface-variant hover:text-on-surface'}`}
                onClick={() => setActiveTab('security')}
            >
                <Shield className="size-4" />
                Security
            </GenesisButton>
        </nav>
    );

    return (
        <SettingsLayout sidebar={sidebarContent}>
            
            {activeTab === 'profile' && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-titleLarge text-on-surface text-transform-primary">Public Profile</h2>
                        <p className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                            This is how others will see you on the site.
                        </p>
                    </div>

                    <Card className="p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-2">
                            <label className="font-display text-labelLarge text-on-surface text-transform-primary">Username</label>
                            <GenesisInput defaultValue="zeus_admin" className="max-w-md bg-surface-container-lowest border-border" />
                            <p className="font-body text-bodySmall text-on-surface-variant text-transform-secondary mt-1">This is your public display name.</p>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <label className="font-display text-labelLarge text-on-surface text-transform-primary">Email</label>
                            <GenesisInput defaultValue="zeus@kt.com" type="email" className="max-w-md bg-surface-container-lowest border-border" />
                        </div>

                        <div className="flex flex-col gap-2">
                            <label className="font-display text-labelLarge text-on-surface text-transform-primary">Bio</label>
                            <textarea 
                                className="flex min-h-[100px] w-full max-w-md rounded-btn border-[length:var(--card-border-width,1px)] border-border bg-surface-container-lowest px-3 py-2 font-body text-sm text-on-surface text-transform-secondary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
                                defaultValue="Chief Security Officer @ ZAP Inc."
                            />
                        </div>

                        <div className="pt-4 border-t border-border">
                            <GenesisButton variant="flat" className="bg-primary text-on-primary font-display text-transform-primary">
                                Save changes
                            </GenesisButton>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'appearance' && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-titleLarge text-on-surface text-transform-primary">Appearance</h2>
                        <p className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                            Customize the look and feel of your ZAP workspace.
                        </p>
                    </div>

                    <Card className="p-6 flex flex-col gap-6">
                        <div className="flex flex-col gap-4">
                            <label className="font-display text-labelLarge text-on-surface text-transform-primary">Theme Active</label>
                            <div className="border border-border rounded-lg p-4 bg-surface-container-lowest flex items-center justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="font-body text-bodyLarge text-on-surface">Global Theme Switcher</span>
                                    <span className="font-body text-bodyMedium text-on-surface-variant">Toggle between Core, Brutal, and Metro themes globally.</span>
                                </div>

                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'security' && (
                <div className="flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
                    <div className="flex flex-col gap-1">
                        <h2 className="font-display text-titleLarge text-on-surface text-transform-primary">Security</h2>
                        <p className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                            Manage your password and security infrastructure.
                        </p>
                    </div>

                    <Card className="p-6 flex flex-col gap-6">
                        <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="font-display text-labelLarge text-on-surface text-transform-primary">Multi-Factor Authentication</span>
                                <span className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">Add an extra layer of security to your account.</span>
                            </div>
                            <GenesisButton visualStyle="outline" variant="flat" className="border-border text-on-surface">Enabled</GenesisButton>
                        </div>
                        
                        <div className="pt-4 border-t border-border flex items-start justify-between">
                            <div className="flex flex-col gap-1">
                                <span className="font-display text-labelLarge text-on-surface text-transform-primary">Active Sessions</span>
                                <span className="font-body text-bodyMedium text-on-surface-variant text-transform-secondary">Review and revoke active sessions.</span>
                            </div>
                            <GenesisButton visualStyle="ghost" variant="flat" className="text-error hover:bg-error-container">Revoke All</GenesisButton>
                        </div>
                    </Card>
                </div>
            )}

        </SettingsLayout>
    );
}
