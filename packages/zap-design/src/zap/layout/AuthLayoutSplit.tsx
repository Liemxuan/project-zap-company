'use client';

import React, { ReactNode } from 'react';

interface AuthLayoutSplitProps {
    children: ReactNode;
    brandContent?: ReactNode; // Optional injected visual content for the right pane
    title?: string;
    description?: ReactNode;
}

export const AuthLayoutSplit = ({ children, brandContent, title, description }: AuthLayoutSplitProps) => {
    return (
        <div className="flex min-h-screen grow overflow-hidden bg-background items-stretch text-foreground">
            {/* Left Column: Form Content */}
            <div className="w-full lg:w-[50%] flex justify-center items-center p-8 lg:p-12 relative z-10">
                <div className="w-full max-w-[450px]">
                    {children}
                </div>
            </div>

            {/* Right Column: Brand Imagery */}
            <div className="hidden lg:flex lg:w-[50%] bg-surface-container-high border-l border-border relative overflow-hidden flex-col items-center justify-center p-12">
                {brandContent ? (
                    <div className="absolute inset-0 w-full h-full flex items-center justify-center pointer-events-none opacity-50">
                        {brandContent}
                    </div>
                ) : null}
                
                {/* Brand Message Overlay */}
                {(title || description) && (
                    <div className="relative z-20 max-w-lg text-center bg-background/80 backdrop-blur-md p-8 rounded-3xl border border-border/50 shadow-sm mt-auto mb-16">
                        {title && <h3 className="text-2xl font-bold font-display text-transform-primary text-primary mb-3">{title}</h3>}
                        {description && <div className="text-sm text-muted-foreground font-body text-transform-secondary">{description}</div>}
                    </div>
                )}
            </div>
        </div>
    );
};
