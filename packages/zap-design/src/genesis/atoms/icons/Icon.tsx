/**
 * Icon.tsx — Level 1 Atom: Iconography Primitive
 *
 * Single source of truth for all Material Symbols Outlined icons in the ZAP Design System.
 * Every icon rendered in the app MUST go through this component.
 *
 * @see /debug/zap/icons — Icon reference page
 */

import React from 'react';

// ------------------------------------------------------------------
// Token maps — consumed by the Icons reference page
// ------------------------------------------------------------------

export const ICON_SIZES = {
    sm: 16,
    md: 24,
    lg: 32,
} as const;

export type IconSize = keyof typeof ICON_SIZES;

/**
 * The 12 core ZAP Brand Icons — approved icon vocabulary.
 * The /debug/zap/icons page renders this exact array.
 */
export const CORE_ICONS: { name: string; label: string }[] = [
    { name: 'bolt', label: 'Bolt' },
    { name: 'settings', label: 'Settings' },
    { name: 'search', label: 'Search' },
    { name: 'notifications', label: 'Notifications' },
    { name: 'person', label: 'Person' },
    { name: 'palette', label: 'Palette' },
    { name: 'code', label: 'Code' },
    { name: 'grid_view', label: 'Grid View' },
    { name: 'widgets', label: 'Widgets' },
    { name: 'layers', label: 'Layers' },
    { name: 'check_circle', label: 'Check Circle' },
    { name: 'warning', label: 'Warning' },
];

// ------------------------------------------------------------------
// Icon Component
// ------------------------------------------------------------------

export interface IconProps {
    /** Material Symbols icon name e.g. "bolt", "settings" */
    name: string;
    /** Size token (sm=16px, md=24px, lg=32px) or explicit px value */
    size?: IconSize | number;
    /** Fill: 0 = outline, 1 = filled */
    fill?: 0 | 1;
    /** Weight axis 100–700 */
    weight?: number;
    /** Optical size axis: 20 | 24 | 40 | 48 */
    opsz?: 20 | 24 | 40 | 48;
    /** Additional Tailwind/CSS classes */
    className?: string;
    /** aria-label for a11y — required when icon is standalone (no surrounding text) */
    label?: string;
    /** Click handler */
    onClick?: () => void;
}

export const Icon = ({
    name,
    size = 'md',
    fill = 0,
    weight = 400,
    opsz,
    className = '',
    label,
    onClick,
}: IconProps) => {
    const px = typeof size === 'number' ? size : ICON_SIZES[size];

    // Auto-derive optical size from px for correct rendering weight
    const resolvedOpsz = opsz ?? (
        px <= 18 ? 20 :
            px <= 28 ? 24 :
                px <= 36 ? 40 : 48
    );

    const dynamicProps = {
        style: Object.assign({}, {
            // Enforce square 1:1 aspect ratio — icon font chars are square
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: px,
            height: px,
            fontSize: px,
            lineHeight: 1,
            flexShrink: 0,
            fontVariationSettings: `'FILL' ${fill}, 'wght' ${weight}, 'GRAD' 0, 'opsz' ${resolvedOpsz}`,
        })
    };

    return (
        <span
            className={`material-symbols-outlined select-none${className ? ` ${className}` : ''}`}
            {...dynamicProps}
            aria-label={label}
            aria-hidden={label ? false : true}
            {...(onClick ? { role: 'button', tabIndex: 0 } : {})}
        >
            {name}
        </span>
    );
};

export default Icon;
