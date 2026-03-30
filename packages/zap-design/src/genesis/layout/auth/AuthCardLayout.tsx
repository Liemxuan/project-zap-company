import React from 'react';
import { cn } from '../../../lib/utils';

export interface AuthCardLayoutProps {
    formSlot: React.ReactNode;
    backgroundSlot?: React.ReactNode;
    className?: string;
}

/**
 * L6 Layout: AuthCardLayout
 * A centered auth layout structure (e.g., standard login modal on a background).
 */
export const AuthCardLayout = ({ formSlot, backgroundSlot, className }: AuthCardLayoutProps) => {
    return (
        <div className={cn("relative min-h-full h-full w-full flex items-center justify-center bg-layer-base text-on-surface overflow-hidden p-6 gap-0", className)}>
            {/* Background Layer */}
            {backgroundSlot && (
                <div className="absolute inset-0 z-0 select-none">
                    {backgroundSlot}
                </div>
            )}
            
            {/* Form Container */}
            <div className="relative z-10 w-full max-w-[460px] flex flex-col items-center">
                {formSlot}
            </div>
        </div>
    );
};
