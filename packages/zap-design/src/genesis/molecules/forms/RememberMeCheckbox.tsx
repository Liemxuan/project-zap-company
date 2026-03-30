'use client';

import React from 'react';
import { Text } from '../../../genesis/atoms/typography/text';

interface RememberMeCheckboxProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    className?: string;
}

/**
 * L4 Molecule — Remember Me Checkbox
 * Animated custom checkbox with fill + checkmark SVG.
 */
export const RememberMeCheckbox: React.FC<RememberMeCheckboxProps> = ({
    checked,
    onChange,
    label = 'Remember Me',
    className = '',
}) => {
    return (
        <label className={`flex items-center gap-2 cursor-pointer group ${className}`}>
            <div className="relative flex items-center justify-center w-4 h-4 rounded border border-outline-variant group-hover:border-primary transition-colors bg-surface overflow-hidden">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={(e) => onChange(e.target.checked)}
                    className="peer absolute opacity-0 w-full h-full cursor-pointer z-20"
                />
                <div className="absolute inset-0 bg-primary scale-0 peer-checked:scale-100 transition-transform origin-center duration-200"></div>
                <svg
                    className="w-3 h-3 text-on-primary absolute scale-0 peer-checked:scale-100 transition-transform delay-75 duration-200 z-10"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={3}
                >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
            </div>
            <Text
                size="body-small"
                className="text-on-surface/80 group-hover:text-on-surface transition-colors select-none font-medium text-transform-secondary"
            >
                {label}
            </Text>
        </label>
    );
};
