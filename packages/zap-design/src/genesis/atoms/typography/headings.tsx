'use client';

import React, { forwardRef } from 'react';

export interface TitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
    children: React.ReactNode;
    level?: 1 | 2 | 3 | 4 | 5 | 6;
    className?: string;
    style?: React.CSSProperties;
    transform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
}

export const Heading = forwardRef<HTMLHeadingElement, TitleProps>(
    ({ level = 1, children, className = '', style, transform, ...props }, ref) => {
        const Component = `h${level}` as keyof React.JSX.IntrinsicElements;

        const styles: Record<number, string> = {
            1: 'text-[length:var(--type-h1-mobile,32px)] md:text-[length:var(--type-h1-desktop,48px)] font-black tracking-tighter leading-[1.1]',
            2: 'text-[length:var(--type-h2-mobile,28px)] md:text-[length:var(--type-h2-desktop,38px)] font-black tracking-tight leading-[1.1]',
            3: 'text-[length:var(--type-h3-mobile,24px)] md:text-[length:var(--type-h3-desktop,31px)] font-bold tracking-tight leading-[1.2]',
            4: 'text-[length:var(--type-h4-mobile,20px)] md:text-[length:var(--type-h4-desktop,25px)] font-bold tracking-tight leading-[1.2]',
            5: 'text-[length:var(--type-h5-mobile,18px)] md:text-[length:var(--type-h5-desktop,20px)] font-bold tracking-tight leading-[1.3]',
            6: 'text-[length:var(--type-h6-mobile,14px)] md:text-[length:var(--type-h6-desktop,16px)] font-bold tracking-widest leading-[1.3]',
        };

        const transformClass = transform ? (transform === 'none' ? 'normal-case' : transform) : '';

        return React.createElement(
            Component,
            {
                ref,
                className: `${styles[level]} ${transformClass} ${className}`,
                style: { fontFamily: 'var(--font-display)', ...style },
                ...props
            },
            children
        );
    }
);

Heading.displayName = 'Heading';
