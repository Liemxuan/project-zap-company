'use client';

import React from 'react';

export const DialogsSection = () => {
    return (
        <section>
            <h3 className="text-lg font-semibold text-foreground mb-4">Dialogs &amp; Modals</h3>
            <div className="bg-layer-panel p-8 rounded-xl border border-border flex items-center justify-center min-h-[400px]">
                {/* Simulated Basic Dialog */}
                <div className="bg-card rounded-3xl w-full max-w-md shadow-lg border border-border overflow-hidden flex flex-col">
                    <div className="p-6 pb-4">
                        <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><line x1="12" x2="12" y1="8" y2="12" /><line x1="12" x2="12.01" y1="16" y2="16" /></svg>
                        </div>
                        <h3 className="text-2xl font-normal text-foreground text-center mb-4">Reset settings?</h3>
                        <p className="text-sm text-muted-foreground text-center">
                            This will reset all your device and network settings back to their factory defaults. You cannot undo this action.
                        </p>
                    </div>

                    <div className="p-6 pt-0 flex gap-2 justify-end mt-4">
                        <button className="px-5 py-2.5 text-foreground rounded-full font-medium hover:bg-surface-container-highest transition-colors">Cancel</button>
                        <button className="px-5 py-2.5 bg-error text-error-foreground rounded-full font-medium hover:bg-error/90 transition-colors">Reset</button>
                    </div>
                </div>
            </div>
        </section>
    );
};
