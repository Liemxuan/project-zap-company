'use client';

import React from 'react';
import { MapPin, Link as LinkIcon, CalendarDays, Mail, Building, Grid, Image as ImageIcon, Briefcase } from 'lucide-react';
import { Button as GenesisButton } from '../../../genesis/atoms/interactive/buttons';
import { Card } from '../../../genesis/atoms/surfaces/card';
import { Avatar } from '../../../genesis/atoms/status/avatars';
import { Badge } from '../../../genesis/atoms/status/badges';
import { SideNav } from '../../../genesis/molecules/navigation/SideNav';

export default function ProfileTemplate() {
    return (
        <div className="flex h-screen w-full overflow-hidden relative font-body text-on-surface text-transform-secondary bg-surface">
            {/* Global Left Navigation */}
            <SideNav showDevWrapper={true} />

            {/* Center Area (Header + Main) */}
            <div className="flex flex-col flex-1 overflow-hidden relative z-10">
                
                <main className="flex-1 overflow-y-auto bg-surface-container-lowest pb-12">
                    
                    {/* Header Banner - Layer 1 */}
                    <div className="w-full h-64 bg-primary-container relative">
                        {/* Faux pattern or gradient could go here */}
                        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-surface-container-lowest to-transparent" />
                    </div>

                    {/* Profile Information Container */}
                    <div className="max-w-[1100px] mx-auto px-6 lg:px-10 -mt-16 relative z-10">
                        
                        <div className="flex flex-col md:flex-row gap-8 items-start">
                            
                            {/* Left Column: Avatar & Quick Info */}
                            <div className="flex flex-col gap-6 w-full md:w-[320px] shrink-0">
                                
                                <Card className="p-6 flex flex-col items-center text-center gap-4 bg-surface shadow-md">
                                    <div className="relative">
                                        <Avatar initials="Z" size="lg" className="h-32 w-32 text-4xl bg-primary text-on-primary font-display text-transform-primary border-[length:var(--card-border-width,4px)] border-surface shadow-sm" />
                                        <div className="absolute bottom-2 right-2 w-5 h-5 bg-success rounded-full border-2 border-surface" title="Online" />
                                    </div>
                                    
                                    <div className="flex flex-col gap-1">
                                        <h1 className="font-display text-headlineMedium text-on-surface text-transform-primary">Zeus Admin</h1>
                                        <p className="font-body text-titleMedium text-on-surface-variant text-transform-secondary">@zeus_sec</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Badge className="bg-inverse-surface text-inverse-on-surface">Chief Security Officer</Badge>
                                        <Badge className="bg-surface-variant text-on-surface-variant">Core Team</Badge>
                                    </div>

                                    <p className="font-body text-bodyMedium text-on-surface text-transform-secondary mt-2">
                                        Keeping the walls up and the infrastructure safe. Period. ZAP Ecosystem Guardian.
                                    </p>

                                    <div className="flex w-full gap-3 mt-2">
                                        <GenesisButton visualStyle="solid" className="flex-1 bg-primary text-on-primary">Follow</GenesisButton>
                                        <GenesisButton visualStyle="outline" className="flex-1 border-border text-on-surface">Message</GenesisButton>
                                    </div>

                                    {/* Meta info list */}
                                    <div className="flex flex-col gap-3 w-full mt-4 text-left border-t border-border pt-6">
                                        <div className="flex items-center gap-3 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                            <Building className="size-4" />
                                            <span>ZAP Inc.</span>
                                        </div>
                                        <div className="flex items-center gap-3 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                            <MapPin className="size-4" />
                                            <span>Vietnam / Remote</span>
                                        </div>
                                        <div className="flex items-center gap-3 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                            <Mail className="size-4" />
                                            <a href="mailto:zeus@kt.com" className="hover:text-primary transition-colors">zeus@kt.com</a>
                                        </div>
                                        <div className="flex items-center gap-3 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                            <LinkIcon className="size-4" />
                                            <a href="#" className="hover:text-primary transition-colors">zap.network/zeus</a>
                                        </div>
                                        <div className="flex items-center gap-3 font-body text-bodyMedium text-on-surface-variant text-transform-secondary">
                                            <CalendarDays className="size-4" />
                                            <span>Joined March 2026</span>
                                        </div>
                                    </div>
                                </Card>
                            </div>

                            {/* Right Column: Activity / Tabs */}
                            <div className="flex flex-col gap-6 grow min-w-0 mt-16 md:mt-20">
                                
                                {/* Inner Tabs */}
                                <div className="flex gap-2 border-b border-border pb-px overflow-x-auto no-scrollbar">
                                    <GenesisButton visualStyle="ghost" className="rounded-none border-b-2 border-primary text-primary font-display text-transform-primary px-4 py-2 hover:bg-surface-variant">
                                        <Grid className="size-4 mr-2 inline" /> Activity
                                    </GenesisButton>
                                    <GenesisButton visualStyle="ghost" className="rounded-none border-b-2 border-transparent text-on-surface-variant font-display text-transform-primary px-4 py-2 hover:bg-surface-variant hover:text-on-surface">
                                        <Briefcase className="size-4 mr-2 inline" /> Projects
                                    </GenesisButton>
                                    <GenesisButton visualStyle="ghost" className="rounded-none border-b-2 border-transparent text-on-surface-variant font-display text-transform-primary px-4 py-2 hover:bg-surface-variant hover:text-on-surface">
                                        <ImageIcon className="size-4 mr-2 inline" /> Media
                                    </GenesisButton>
                                </div>

                                {/* Timeline / Content Area */}
                                <div className="flex flex-col gap-6 mt-4">
                                    <Card className="p-6 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <Avatar initials="Z" size="sm" className="bg-primary text-on-primary" />
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-display text-labelLarge text-on-surface text-transform-primary">Zeus Admin</span>
                                                        <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">deployed a massive fleet patch</span>
                                                    </div>
                                                    <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">2 hours ago</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pl-11 pr-4">
                                            <p className="font-body text-bodyMedium text-on-surface text-transform-secondary">
                                                Successfully locked down the gateway overflow and pushed the Clean Shell Protocol to 12 production nodes. Zero fluff.
                                            </p>
                                            <div className="mt-4 p-4 rounded-btn border border-border bg-surface-container flex items-center justify-between">
                                                <div className="flex flex-col">
                                                    <span className="font-display text-labelMedium text-on-surface text-transform-primary">Patch-v2.9.4a</span>
                                                    <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">14 files changed, 203 insertions</span>
                                                </div>
                                                <GenesisButton visualStyle="outline" className="h-8 px-3 text-xs border-border">Review</GenesisButton>
                                            </div>
                                        </div>
                                    </Card>

                                    <Card className="p-6 flex flex-col gap-4">
                                        <div className="flex justify-between items-start">
                                            <div className="flex gap-3">
                                                <Avatar initials="Z" size="sm" className="bg-primary text-on-primary" />
                                                <div className="flex flex-col">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-display text-labelLarge text-on-surface text-transform-primary">Zeus Admin</span>
                                                        <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">reviewed a pull request</span>
                                                    </div>
                                                    <span className="font-body text-bodySmall text-on-surface-variant text-transform-secondary">Yesterday</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="pl-11 pr-4">
                                            <p className="font-body text-bodyMedium text-on-surface text-transform-secondary italic text-success border-l-2 border-success pl-3">
                                                &quot;That&apos;s f***ing brilliant. LGTM, ship it.&quot;
                                            </p>
                                        </div>
                                    </Card>

                                </div>
                            </div>

                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
