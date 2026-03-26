'use client';

import React, { useState } from 'react';
import { Button } from '../../../../genesis/atoms/interactive/buttons';
import { DebugAuditor } from '../../../../components/debug/auditor';
import { Dialog, DialogHeader, DialogFooter, DialogTitle, DialogDescription, DialogContent } from '../../../../genesis/molecules/dialog';
import { CanvasBody } from '../../../../zap/layout/CanvasBody';
import { ThemeHeader } from '../../../../genesis/molecules/layout/ThemeHeader';
import { type Platform } from '../../../../genesis/molecules/navigation/PlatformToggle';

export const DialogsSection = () => {
    const [platform, setPlatform] = useState<Platform>('web');

    return (
        <DebugAuditor
            componentName="Dialogs & Modals"
            tier="L3 MOLECULE"
            status="Verified"
            filePath="src/zap/sections/molecules/containment/DialogsSection.tsx"
            importPath="@/zap/sections/molecules/containment/DialogsSection"
        >
            <div className="min-h-screen flex flex-col items-center bg-layer-canvas text-foreground overflow-y-auto w-full">
                <div className="w-full flex-none">
                    <ThemeHeader
                        title="Dialog Modules"
                        breadcrumb="Zap Design Engine / Metro / Molecules"
                        badge="L3 Molecule"
                        liveIndicator={false}
                        platform={platform}
                        setPlatform={setPlatform}
                    />
                </div>
                <CanvasBody
                    maxWidth="max-w-7xl"
                >
                    <div className="space-y-6 mb-8">
                        <p className="text-muted-foreground max-w-2xl">
                            Standardized M3 dialog anatomies rendered statically. These structural modules represent common system interruptions, confirmations, and concentrated forms.
                        </p>
                    </div>
                    
                    {/* Layer 3 Panel for Showcase */}
                    <CanvasBody.Section label="Interactive Showcase" className="grid grid-cols-1 xl:grid-cols-2 gap-8 items-start rounded-[32px] border border-border/50">
                        
                        {/* 1. Basic Confirmation Dialog */}
                        <Dialog>
                            <DialogHeader>
                                <DialogTitle>Discard unsaved changes?</DialogTitle>
                                <DialogDescription>
                                    You have unsaved changes in your document. If you close this now, any edits made in the last 15 minutes will be permanently lost.
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter>
                                <Button visualStyle="ghost" color="primary">Cancel</Button>
                                <Button visualStyle="tonal" color="primary">Discard</Button>
                            </DialogFooter>
                        </Dialog>

                        {/* 2. Destructive Alert with Icon */}
                        <div className="flex-1 relative border border-border/50 rounded-[24px] overflow-hidden"><Dialog>
                            <DialogHeader className="flex flex-col items-center text-center">
                                <div className="w-12 h-12 flex items-center justify-center rounded-full bg-error-container/80 text-error mb-4">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                                        <line x1="12" y1="9" x2="12" y2="13"/>
                                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                                    </svg>
                                </div>
                                <DialogTitle>Terminate active session?</DialogTitle>
                                <DialogDescription className="max-w-sm mx-auto">
                                    This action physically disconnects all current subagents and terminates the web socket loop. Are you absolutely sure?
                                </DialogDescription>
                            </DialogHeader>
                            <DialogFooter className="justify-center border-t border-border/30 mt-2 bg-layer-panel/30">
                                <Button visualStyle="ghost" color="primary">Keep Running</Button>
                                <Button visualStyle="solid" color="destructive">Terminate</Button>
                            </DialogFooter>
                        </Dialog>
                        </div>

                        {/* 3. Form / Complex Action Dialog */}
                        <div className="xl:col-span-2 max-w-2xl mx-auto mt-4 xl:mt-0 relative border border-border/50 rounded-[24px] overflow-hidden"><Dialog>
                            <DialogHeader className="border-b border-border/50 pb-4">
                                <DialogTitle className="mb-0">Share access</DialogTitle>
                                <p className="text-sm text-muted-foreground mt-1">Invited users will have full write access to this deployment.</p>
                            </DialogHeader>
                            <DialogContent className="space-y-4">
                                <div className="flex gap-3">
                                    <input 
                                        type="email" 
                                        placeholder="Add people, groups, or emails..." 
                                        className="flex-1 bg-layer-panel border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-foreground"
                                        readOnly
                                    />
                                    <Button visualStyle="tonal" color="primary" className="shrink-0">Invite</Button>
                                </div>
                                
                                <div className="space-y-3 pt-4 border-t border-border/30">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border border-border bg-surface-container-highest flex items-center justify-center font-medium text-foreground">Z</div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Zeus Tom</p>
                                                <p className="text-xs text-muted-foreground">Workspace Owner</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-muted-foreground bg-layer-panel px-2.5 py-1 rounded-md border border-border">Owner</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full border border-border bg-surface-container-highest flex items-center justify-center font-medium text-foreground">A</div>
                                            <div>
                                                <p className="text-sm font-medium text-foreground">Antigravity AI</p>
                                                <p className="text-xs text-muted-foreground">System Subagent</p>
                                            </div>
                                        </div>
                                        <span className="text-xs font-medium text-primary bg-primary/10 px-2.5 py-1 rounded-md">Editor</span>
                                    </div>
                                </div>
                            </DialogContent>
                            <DialogFooter className="justify-between items-center border-t border-border/50 bg-layer-panel/30">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-muted-foreground"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4"/><path d="M12 8h.01"/></svg>
                                    Public directory link
                                </div>
                                <div className="flex gap-2">
                                    <Button visualStyle="ghost" color="primary">Copy Link</Button>
                                    <Button visualStyle="tonal" color="primary">Done</Button>
                                </div>
                            </DialogFooter>
                        </Dialog>
                        </div>

                    </CanvasBody.Section>
                </CanvasBody>
            </div>
        </DebugAuditor>
    );
};
