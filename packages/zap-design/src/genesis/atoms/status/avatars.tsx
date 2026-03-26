import React from 'react';
import Image from 'next/image';
import { cn } from '../../../lib/utils';

export const Avatar: React.FC<{ 
    src?: string; 
    initials?: string; 
    fallback?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}> = ({ src, initials, fallback, size = 'md', className = '' }) => {
    const displayInitials = initials || fallback || 'Z';
    
    const sizes = {
        sm: "w-[length:var(--avatar-size-sm,32px)] h-[length:var(--avatar-size-sm,32px)] text-[10px]",
        md: "w-[length:var(--avatar-size-md,48px)] h-[length:var(--avatar-size-md,48px)] text-xs",
        lg: "w-[length:var(--avatar-size-lg,64px)] h-[length:var(--avatar-size-lg,64px)] text-sm",
        xl: "w-[length:var(--avatar-size-xl,96px)] h-[length:var(--avatar-size-xl,96px)] text-lg"
    };

    const base = "relative border-[length:var(--avatar-border-width,0px)] border-border flex items-center justify-center overflow-hidden bg-surface-container-highest text-on-surface rounded-[length:var(--avatar-border-radius,999px)] transition-all shrink-0";

    return (
        <div className={cn(base, sizes[size], className)}>
            {src ? (
                <Image src={src} fill sizes="(max-width: 768px) 100vw, 40px" className="object-cover" alt="avatar" />
            ) : (
                <span className="font-display text-titleMedium text-transform-primary tracking-tighter">{displayInitials}</span>
            )}
        </div>
    );
};
