'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../../../genesis/atoms/icons/Icon';

interface InteractiveColorBoxProps {
    cssVars: string[];
    fallbackHex: string;
    className?: string;
    children?: React.ReactNode;
}

export const InteractiveColorBox = ({ cssVars, fallbackHex, className = '', children }: InteractiveColorBoxProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [currentColor, setCurrentColor] = useState(`#${fallbackHex}`);
    const [originalColor, setOriginalColor] = useState(`#${fallbackHex}`);
    const popoverRef = useRef<HTMLDivElement>(null);
    const boxRef = useRef<HTMLDivElement>(null);
    const previewRef = useRef<HTMLDivElement>(null);

    // Apply dynamic color via ref to avoid React inline style props
    useEffect(() => {
        if (boxRef.current) boxRef.current.style.backgroundColor = currentColor;
        if (previewRef.current) previewRef.current.style.backgroundColor = currentColor;
    }, [currentColor]);

    // Initial load from CSS computed values based on the primary css var
    useEffect(() => {
        if (typeof window !== 'undefined' && cssVars.length > 0) {
            const rootStyle = getComputedStyle(document.documentElement);
            const val = rootStyle.getPropertyValue(cssVars[0]).trim();
            if (val) {
                // eslint-disable-next-line react-hooks/set-state-in-effect
                setCurrentColor(val);
                 
                setOriginalColor(val);
            }
        }
    }, [cssVars]);

    // Handle click outside to close popover
    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
                setIsOpen(false);
            }
        };
        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isOpen]);

    const updateVars = (color: string) => {
        const root = document.documentElement;
        cssVars.forEach(v => root.style.setProperty(v, color));
    };

    const handleApply = () => {
        updateVars(currentColor);
    };

    const handleSave = () => {
        updateVars(currentColor);
        setOriginalColor(currentColor);
        setIsOpen(false);
    };

    const handleRevert = () => {
        setCurrentColor(originalColor);
        updateVars(originalColor);
    };

    return (
        <div className="relative group flex w-full h-full max-w-full">
            <div
                ref={boxRef}
                className={`cursor-pointer transition-all hover:-translate-y-[2px] hover:shadow-[var(--card-shadow,none)] focus:outline-none focus:ring-2 focus:ring-brand-midnight rounded-[var(--btn-radius,0px)] ${className}`}
                onClick={() => setIsOpen(!isOpen)}
                role="button"
                tabIndex={0}
                title="Click to open color picker"
            >
                {children}
            </div>

            {isOpen && (
                <div ref={popoverRef} className="absolute z-50 top-full mt-3 left-0 w-72 bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] rounded-card p-4 shadow-dialog flex flex-col gap-4">
                    <div className="flex items-center justify-between border-b-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] pb-2 text-brand-midnight">
                        <span className="font-bold text-sm uppercase tracking-tighter">Color Picker</span>
                        <button onClick={() => setIsOpen(false)} className="hover:text-theme-error transition-colors p-1" title="Close"><Icon name="close" size={18} /></button>
                    </div>

                    <div className="flex items-center gap-4 bg-layer-cover p-3 border-[length:var(--card-border-width,0px)] border-card-border-[length:var(--card-border-width,0px)] rounded-card">
                        <div className="relative w-14 h-14 shrink-0 border-[length:var(--input-border-width,0px)] border-input-border-[length:var(--card-border-width,0px)] shadow-btn rounded-input">
                            <input
                                type="color"
                                value={currentColor}
                                aria-label="Choose color"
                                onChange={(e) => setCurrentColor(e.target.value)}
                                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                            />
                            <div ref={previewRef} className="w-full h-full pointer-events-none rounded-[inherit]" />
                        </div>
                        <div className="flex flex-col gap-1 overflow-hidden text-brand-midnight">
                            <span className="text-[10px] font-black text-theme-base/50 uppercase tracking-wider truncate w-full" title={cssVars.join(', ')}>
                                {cssVars[0]} {cssVars.length > 1 && '+ deeper layers'}
                            </span>
 <span className="font-dev text-transform-tertiary font-black text-lg bg-layer-canvas border-[length:var(--input-border-width,0px)] border-input-border-[length:var(--card-border-width,0px)] rounded-input px-1.5 py-0.5 inline-block w-min shadow-btn">
                                {currentColor}
                            </span>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 mt-2">
                        <button onClick={handleApply} className="w-full bg-theme-main text-theme-inverted text-xs uppercase font-black tracking-widest py-2.5 border-[length:var(--btn-border-width,0px)] border-btn-border-[length:var(--card-border-width,0px)] rounded-btn hover:bg-theme-active transition-colors shadow-btn hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                            Apply
                        </button>
                        <div className="flex gap-2">
                            <button onClick={handleSave} className="flex-1 flex items-center justify-center gap-1.5 bg-theme-success text-theme-inverted text-xs uppercase font-black tracking-widest py-2.5 border-[length:var(--btn-border-width,0px)] border-btn-border-[length:var(--card-border-width,0px)] rounded-btn hover:opacity-90 transition-opacity shadow-btn hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]">
                                <Icon name="check" size={14} /> Save
                            </button>
                            <button onClick={handleRevert} className="flex-1 flex items-center justify-center gap-1.5 bg-layer-canvas text-brand-midnight text-xs uppercase font-black tracking-widest py-2.5 border-[length:var(--btn-border-width,0px)] border-btn-border-[length:var(--card-border-width,0px)] rounded-btn hover:bg-layer-cover transition-colors shadow-btn hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px]" title="Revert to original">
                                <Icon name="undo" size={14} /> Revert
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
