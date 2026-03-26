'use client';

import React from 'react';

interface TextProps {
    children: React.ReactNode;
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'iso-100' | 'iso-200' | 'iso-300' | 'iso-400' | 'iso-500' | 'iso-600' | 'body-large' | 'body-main' | 'body-small' | 'body-tiny' | 'dev-wrapper' | 'dev-note' | 'dev-metric';
    className?: string;
    as?: 'p' | 'span' | 'div';
    weight?: 'regular' | 'medium' | 'bold' | 'black';
    style?: React.CSSProperties;
}

export const Text = ({
    children,
    size = 'iso-300',
    className = '',
    as: Component = 'span',
    weight = 'regular',
    style
}: TextProps) => {
    const sizeMap: Record<NonNullable<TextProps['size']>, string> = {
        'xs': 'text-[10px] tracking-widest',
        'sm': 'text-[12px] tracking-tight',
        'md': 'text-[14px] leading-relaxed',
        'lg': 'text-[16px] leading-relaxed font-bold',
        'xl': 'text-[18px] leading-tight font-black uppercase tracking-tighter',
        'iso-100': 'text-[10px] tracking-widest leading-normal',
        'iso-200': 'text-[12px] tracking-tight leading-normal',
        'iso-300': 'text-[13px] leading-relaxed',
        'iso-400': 'text-[15px] leading-relaxed tracking-tight',
        'iso-500': 'text-[18px] leading-relaxed tracking-tight',
        'iso-600': 'text-[21px] leading-snug tracking-tighter',
        'body-large': 'text-[length:var(--type-body-large-mobile,16px)] md:text-[length:var(--type-body-large-desktop,18px)] leading-relaxed',
        'body-main': 'text-[length:var(--type-body-main-mobile,16px)] md:text-[length:var(--type-body-main-desktop,16px)] leading-relaxed',
        'body-small': 'text-[length:var(--type-body-small-mobile,12px)] md:text-[length:var(--type-body-small-desktop,14px)] leading-relaxed',
        'body-tiny': 'text-[length:var(--type-body-tiny-mobile,10px)] md:text-[length:var(--type-body-tiny-desktop,12px)] leading-tight',
 'dev-wrapper': 'text-[11px] md:text-[13px] font-mono text-transform-tertiary bg-surface-container-high text-on-surface-variant px-1.5 py-0.5 rounded-sm tracking-wider',
 'dev-note': 'text-[11px] md:text-[13px] font-mono text-transform-tertiary font-bold bg-tertiary text-on-tertiary px-2 py-0.5 rounded-sm tracking-wide',
        'dev-metric': 'text-[9px] md:text-[11px] font-mono text-transform-tertiary bg-secondary text-on-secondary px-1.5 py-0.5 rounded-sm tabular-nums'
    };

    const weightMap = {
        'regular': 'font-normal',
        'medium': 'font-medium',
        'bold': 'font-bold',
        'black': 'font-black'
    };

    return (
        <Component className={`${sizeMap[size]} ${weightMap[weight]} ${className}`} style={style}>
            {children}
        </Component>
    );
};
