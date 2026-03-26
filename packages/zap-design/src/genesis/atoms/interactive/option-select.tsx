import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { InputWrapper } from '../../../genesis/atoms/interactive/input';
import { cn } from '../../../lib/utils';

export interface SelectOption {
    label: string;
    value: string;
}

export interface SelectProps {
    options: SelectOption[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
}

import { createPortal } from 'react-dom';

export const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = "Select...", className = '' }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [rect, setRect] = useState<DOMRect | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const dropdownRef = useRef<HTMLUListElement>(null);

    const activeOption = options.find(o => o.value === value);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as Node;
            const inContainer = containerRef.current?.contains(target);
            const inDropdown = dropdownRef.current?.contains(target);
            if (!inContainer && !inDropdown) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (!isOpen) {
            const timer = setTimeout(() => setRect(null), 0);
            return () => clearTimeout(timer);
        }

        const updateRect = () => {
            if (containerRef.current) {
                setRect(containerRef.current.getBoundingClientRect());
            }
        };

        updateRect();
        
        window.addEventListener('scroll', updateRect, true);
        window.addEventListener('resize', updateRect);
        
        return () => {
            window.removeEventListener('scroll', updateRect, true);
            window.removeEventListener('resize', updateRect);
        };
    }, [isOpen]);

    const dropdownProps = rect ? {
        style: {
            top: rect.bottom + 4,
            left: rect.left,
            width: rect.width
        }
    } : {};

    return (
        <div className={`relative ${className}`} ref={containerRef}>
            <InputWrapper 
                className={cn(
                    "w-full focus-within:ring-1 focus-within:ring-primary focus-within:border-primary cursor-pointer transition-colors hover:bg-layer-dialog",
                    isOpen ? 'ring-1 ring-primary border-primary' : '',
                    "h-[var(--select-height,40px)] rounded-[length:var(--select-border-radius,var(--rounded-input,8px))] border-[length:var(--select-border-width,1px)]"
                )}
                onClick={() => setIsOpen(!isOpen)}
            >
                <button
                    type="button"
                    className="w-full h-full focus:outline-none flex items-center justify-between px-3 bg-transparent text-on-surface font-body"
                    aria-haspopup="listbox"
                    aria-expanded={isOpen ? true : false}
                    aria-label={placeholder || "Select option"}
                >
                    <span className={`block truncate text-transform-tertiary text-[length:var(--select-font-size,0.875rem)] leading-[var(--select-line-height,1.25rem)] tracking-[var(--select-letter-spacing,normal)] font-[number:var(--select-font-weight,400)] ${!activeOption && placeholder ? 'text-on-surface-variant/70' : ''}`}
                    >
                        {activeOption ? activeOption.label : (placeholder || 'Select option')}
                    </span>
                    <Icon name="expand_more" size={16} className={`text-on-surface-variant transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
            </InputWrapper>

            {isOpen && rect && typeof document !== 'undefined' && createPortal(
                <ul
                    ref={dropdownRef}
                    className={cn(
                        "fixed border-outline-variant bg-layer-dialog z-[99999] max-h-60 overflow-y-auto outline-none shadow-lg text-on-surface",
                        "rounded-[length:var(--select-border-radius,var(--rounded-card,8px))] border-[length:var(--select-border-width,1px)]"
                    )}
                    role="listbox"
                    aria-label="Options"
                    {...dropdownProps}
                >
                    {options.map((option) => (
                        <li
                            key={option.value}
                            role="option"
                            aria-selected={option.value === value ? true : false}
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange(option.value);
                                setIsOpen(false);
                            }}
                            className={cn(
                                "px-3 py-2 text-transform-tertiary cursor-pointer transition-colors border-b border-outline-variant/30 last:border-b-0",
                                "text-[length:var(--select-font-size,0.875rem)] leading-[var(--select-line-height,1.25rem)] tracking-[var(--select-letter-spacing,normal)] font-[number:var(--select-font-weight,400)]",
                                option.value === value
                                    ? 'bg-primary text-on-primary hover:bg-primary/90'
                                    : 'hover:bg-layer-panel'
                            )}
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>,
                document.body
            )}
        </div>
    );
};

