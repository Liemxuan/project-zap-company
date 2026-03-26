'use client';

import React from 'react';
import { cn } from '../../../lib/utils';

export interface ToggleProps {
    className?: string;
    checked: boolean;
    onChange: (checked: boolean) => void;
    disabled?: boolean;
    ariaLabel?: string;
    size?: 'sm' | 'md';
}

export const Toggle: React.FC<ToggleProps> = ({ checked, onChange, disabled = false, className = '', ariaLabel = 'Toggle', size = 'md' }) => {
    const isSm = size === 'sm';
    const containerClasses = isSm 
        ? 'w-[length:var(--toggle-width,32px)] h-[length:var(--toggle-height,16px)] px-0.5' 
        : 'w-[length:var(--toggle-width,56px)] h-[length:var(--toggle-height,28px)] px-1';
    
    // Calculate thumb size based on height minus some padding for the toggle body
    const thumbClasses = isSm 
        ? 'w-[length:calc(var(--toggle-height,16px)-4px)] h-[length:calc(var(--toggle-height,16px)-4px)]' 
        : 'w-[length:calc(var(--toggle-height,28px)-8px)] h-[length:calc(var(--toggle-height,28px)-8px)]';
    
    // Calculate translate based on width minus thumb width and padding
    const translateClasses = isSm 
        ? 'translate-x-[length:calc(var(--toggle-width,32px)-var(--toggle-height,16px))]' 
        : 'translate-x-[length:calc(var(--toggle-width,56px)-var(--toggle-height,28px))]';

    return (
        <button
            type="button"
            className={cn(
                "relative flex items-center transition-colors rounded-[length:var(--toggle-border-radius,var(--layer-border-radius,9999px))]",
                containerClasses,
                disabled
                    ? "bg-layer-dialog border-[length:var(--toggle-border-width,0px)] border-card-border/20 cursor-not-allowed opacity-50"
                    : checked
                        ? "bg-primary border-[length:var(--toggle-border-width,0px)] cursor-pointer shadow-card"
                        : "bg-layer-dialog border-[length:var(--toggle-border-width,0px)] cursor-pointer shadow-card",
                className
            )}
            onClick={(e) => {
                e.stopPropagation();
                if (!disabled) onChange(!checked);
            }}
            role="switch"
            aria-checked={checked}
            aria-disabled={disabled}
            aria-label={ariaLabel}
        >
            <div 
                className={cn(
                    thumbClasses,
                    "transition-all duration-200 ease-in-out rounded-full",
                    disabled
                        ? "bg-layer-panel"
                        : checked
                            ? `bg-theme-inverted ${translateClasses}`
                            : `bg-theme-base/30 translate-x-0`
                )}
            ></div>
        </button>
    );
};
