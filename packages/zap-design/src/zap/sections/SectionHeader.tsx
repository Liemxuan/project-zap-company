'use client';

import React from 'react';
import { Icon } from '../../genesis/atoms/icons/Icon';

interface SectionHeaderProps {
    number: string;
    title: string;
    icon: string;
    description: string;
    id: string;
}

export const SectionHeader = ({ number, title, icon, description, id }: SectionHeaderProps) => (
    <div id={id} className="scroll-mt-20 flex items-center justify-between px-4 py-3 bg-layer-panel rounded-t-xl border-b border-outline-variant/30">
        {/* Left: number pill + icon + title */}
        <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary text-on-primary text-[10px] font-black tracking-widest">
                <Icon name={icon} size={12} />
                {number}
            </span>
            <span className="text-sm font-black tracking-tight text-on-surface text-transform-secondary leading-none font-secondary">
                {title}
            </span>
        </div>
        {/* Right: description metadata */}
        <span className="text-[10px] text-on-surface-variant font-secondary tracking-wide opacity-70">
            {description}
        </span>
    </div>
);
