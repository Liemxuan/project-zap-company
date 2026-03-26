'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Wrapper } from '../../../components/dev/Wrapper';
import { Heading } from '../../../genesis/atoms/typography/headings';
import { Card } from '../../../genesis/atoms/surfaces/card';
import { Icon } from '../../../genesis/atoms/icons/Icon';
import { motion, AnimatePresence } from 'framer-motion';

import { TypographyThemeSchema } from '../../../zap/sections/atoms/typography/schema';
import { CORE_FONTS } from '../../../zap/organisms/typography_factory/FontInspectorPanel';
import { SectionHeader, TokenTable } from '../../../zap/sections/atoms/foundations/components';
import {
    M3_ROLE_ORDER,
    M3_ROLE_META,
    L2_COMPONENT_MAP,
    TYPOGRAPHY_REGISTRY,
    type M3Role,
    type TypographyTokenMap,
} from '../../../genesis/utilities/typography-registry';

// ─── TYPES ──────────────────────────────────────────────────────────────────────

type FontFamilyRole = 'primary' | 'secondary' | 'tertiary';

type TextTransform = 'uppercase' | 'lowercase' | 'capitalize' | 'none';

interface TypographyBodyProps {
    themeData: TypographyThemeSchema;
    onFontChange?: (role: FontFamilyRole, fontValue: string) => void;
    onTransformChange?: (role: FontFamilyRole, transform: TextTransform) => void;
    transforms?: Record<FontFamilyRole, TextTransform | undefined>;
}

// ─── HELPERS ────────────────────────────────────────────────────────────────────

const getFontName = (fontVal: string) => {
    const found = CORE_FONTS.find(f => f.value === fontVal);
    if (found) {
        const match = found.name.match(/\((.*?)\)/);
        return match ? match[1] : found.name;
    }
    return fontVal.split(',')[0].replace('var(--font-', '').replace(')', '');
};

const WEIGHT_LABELS: Record<number, string> = {
    300: 'Light', 400: 'Regular', 500: 'Medium',
    600: 'SemiBold', 700: 'Bold', 900: 'Black',
};

const ROLE_ICONS: Record<M3Role, string> = {
    display: 'title', headline: 'format_h1', title: 'format_h2',
    body: 'article', label: 'label', dev: 'code',
};

const ROLE_NUMBERS: Record<M3Role, string> = {
    display: '02', headline: '03', title: '04',
    body: '05', label: '06', dev: '07',
};

const FAMILY_META: Record<FontFamilyRole, { label: string; scope: string; icon: string }> = {
    primary: { label: 'Primary', scope: 'Display + Headline + Title', icon: 'star' },
    secondary: { label: 'Secondary', scope: 'Body + Label', icon: 'menu_book' },
    tertiary: { label: 'Tertiary', scope: 'Dev Overlay', icon: 'code' },
};

// ─── FONT PICKER POPUP ─────────────────────────────────────────────────────────

const FontPickerPopup = ({
    role,
    currentFont,
    currentTransform = 'none',
    onSelect,
    onTransform,
    onClose,
}: {
    role: FontFamilyRole;
    currentFont: string;
    currentTransform?: TextTransform;
    onSelect: (font: string) => void;
    onTransform?: (transform: TextTransform) => void;
    onClose: () => void;
}) => {
    const popupRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (popupRef.current && !popupRef.current.contains(e.target as Node)) onClose();
        };
        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('keydown', handleEsc);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('keydown', handleEsc);
        };
    }, [onClose]);

    const meta = FAMILY_META[role];

    return (
        <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 z-50 bg-surface border-2 border-card-border rounded-xl shadow-xl overflow-hidden"
        >
            {/* Header */}
            <div className="px-4 py-3 bg-surface-container-lowest">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon name={meta.icon} size={16} className="text-primary" />
                        <span className="text-[10px] font-black text-transform-secondary tracking-widest text-foreground">
                            {meta.label} Font
                        </span>
                    </div>
                    <span className="text-[9px] font-dev text-transform-tertiary text-muted-foreground tracking-wider">
                        {meta.scope}
                    </span>
                </div>
            </div>

            {/* Text Casing — first */}
            {onTransform && (
                <div className="px-4 py-3 bg-surface-container-lowest">
                    <span className="text-[9px] font-black text-transform-secondary tracking-widest text-muted-foreground block mb-2">Text Casing</span>
                    <div className="grid grid-cols-4 gap-1">
                        {([['uppercase', 'AB'], ['lowercase', 'ab'], ['capitalize', 'Ab'], ['none', 'Aa']] as const).map(([value, label]) => (
                            <button
                                key={value}
                                onClick={() => onTransform(value)}
                                className={`
                                    py-2 rounded-lg text-xs font-bold transition-all text-center
                                    ${currentTransform === value
                                        ? 'bg-primary text-on-primary shadow-sm'
                                        : 'bg-on-surface/5 text-foreground hover:bg-on-surface/10'
                                    }
                               `}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Font list */}
            <div className="max-h-[320px] overflow-y-auto">
                {CORE_FONTS.map(font => {
                    const isActive = font.value === currentFont;
                    const shortName = getFontName(font.value);
                    return (
                        <button
                            key={font.value}
                            onClick={() => onSelect(font.value)}
                            className={`
                                w-full px-4 py-3 flex items-center gap-4 text-left transition-colors
                                ${isActive
                                    ? 'bg-primary/10 border-l-4 border-primary'
                                    : 'hover:bg-on-surface/5 border-l-4 border-transparent'
                                }
                           `}
                        >
                            <span
                                className="text-2xl font-bold text-foreground w-16 shrink-0"
                                style={{ fontFamily: font.value }}
                            >
                                Aa
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span 
                                    className="text-transform-primary text-titleSmall text-foreground truncate"
                                    style={{ fontFamily: font.value }}
                                >
                                    {shortName}
                                </span>
                                <span className="text-labelSmall text-muted-foreground font-dev text-transform-tertiary truncate">{font.value.split(',')[0]}</span>
                            </div>
                            {isActive && (
                                <Icon name="check_circle" size={18} className="text-primary ml-auto shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
};

// ─── FONT FAMILY CARD ───────────────────────────────────────────────────────────

const FontFamilyCard = ({
    role,
    fontValue,
    transform = 'none',
    onFontChange,
    onTransformChange,
}: {
    role: FontFamilyRole;
    fontValue: string;
    transform?: TextTransform;
    onFontChange?: (role: FontFamilyRole, font: string) => void;
    onTransformChange?: (role: FontFamilyRole, transform: TextTransform) => void;
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const meta = FAMILY_META[role];

    const pangrams: Record<FontFamilyRole, string> = {
        primary: 'SPHINX OF BLACK QUARTZ, JUDGE MY VOW.',
        secondary: 'PACK MY BOX WITH FIVE DOZEN LIQUOR JUGS.',
        tertiary: '{ code: "clean" }',
    };

    return (
        <Wrapper identity={{ displayName: `${meta.label} Font Card`, filePath: "zap/sections/atoms/typography/body.tsx", type: "Atom/Card", architecture: "L3: PANEL" }} className="h-full">
            <div className="relative h-full">
                <Card className="flex flex-col items-center justify-center p-6 relative group text-brand-midnight hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform shadow-[4px_4px_0px_0px_var(--color-card-border)] hover:shadow-[6px_6px_0px_0px_var(--color-card-border)] h-full">
                    {/* Settings icon */}
                    {onFontChange && (
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="absolute top-3 right-3 w-8 h-8 rounded-lg bg-on-surface/5 hover:bg-primary hover:text-on-primary flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                            title={`Change ${meta.label.toLowerCase()} font`}
                        >
                            <Icon name="tune" size={18} />
                        </button>
                    )}

                    <span className="text-[8px] font-body font-black text-transform-secondary tracking-widest text-on-surface-variant/50 mb-2">
                        {meta.label} · {meta.scope}
                    </span>
                    <Heading level={2} className="text-4xl font-black text-transform-primary" style={{ fontFamily: fontValue, textTransform: transform || '' }}>
                        {getFontName(fontValue)}
                    </Heading>
                    <div className="flex items-baseline gap-1 mt-3">
                        <span className="text-7xl font-black" style={{ fontFamily: fontValue, textTransform: transform || 'none' }}>Aa</span>
                    </div>
                    <p className={`text-xs font-bold text-center mt-3 max-w-[200px] leading-tight text-on-surface-variant/60 ${role === 'tertiary' ? 'font-dev text-transform-tertiary' : ''}`} style={{ textTransform: transform || 'none' }}>
                        {pangrams[role]}
                    </p>
                </Card>

                {/* Popup */}
                <AnimatePresence>
                    {isOpen && onFontChange && (
                        <FontPickerPopup
                            role={role}
                            currentFont={fontValue}
                            currentTransform={transform}
                            onSelect={(font) => onFontChange(role, font)}
                            onTransform={onTransformChange ? (t) => onTransformChange(role, t) : undefined}
                            onClose={() => setIsOpen(false)}
                        />
                    )}
                </AnimatePresence>
            </div>
        </Wrapper>
    );
};

// Pangrams per font family — same text at every size so you see the scale differences
const FAMILY_PANGRAMS: Record<FontFamilyRole, string> = {
    primary: 'Sphinx of black quartz, judge my vow.',
    secondary: 'Pack my box with five dozen liquor jugs.',
    tertiary: '{ code: "clean" }',
};

const TRANSFORM_LABELS: Record<string, string> = {
    uppercase: 'UPPERCASE',
    lowercase: 'lowercase',
    capitalize: 'Capitalize',
    none: 'None',
};

const LiveSampleRow = ({ token, fontFamily, textTransform, sampleText }: { token: TypographyTokenMap; fontFamily: string; textTransform?: TextTransform; sampleText: string }) => (
    <>
        <div className="py-4 px-4 hover:bg-on-surface/3 transition-colors group">
            {/* Meta row */}
            <div className="flex items-center gap-3 mb-2">
                <span className="text-[10px] font-bold text-muted-foreground text-transform-secondary tracking-wider">{token.m3Name}</span>
                <span className="text-[10px] text-muted-foreground font-dev text-transform-tertiary">
                    {token.fontSize}px / {token.lineHeight} · w{token.fontWeight} · {token.letterSpacing}px
                </span>
                {textTransform && textTransform !== 'none' && (
                    <span className="text-[10px] font-dev text-transform-tertiary text-primary px-2 py-0.5 rounded bg-primary/8">
                        {TRANSFORM_LABELS[textTransform]}
                    </span>
                )}
            </div>
            {/* Sample text */}
            <p
                className="text-foreground"
                style={{
                    fontSize: token.fontSize,
                    lineHeight: `${token.lineHeight}px`,
                    fontWeight: token.fontWeight,
                    letterSpacing: token.letterSpacing,
                    fontFamily,
                    textTransform: textTransform || 'none',
                }}
            >
                {sampleText}
            </p>
        </div>
        <hr className="border-border/20 last:hidden" />
    </>
);

// ─── ROLE SECTION ───────────────────────────────────────────────────────────────

const RoleSection = ({
    role,
    tokens,
    themeData,
    transforms,
}: {
    role: M3Role;
    tokens: TypographyTokenMap[];
    themeData: TypographyThemeSchema;
    transforms?: Record<FontFamilyRole, TextTransform | undefined>;
}) => {
    const meta = M3_ROLE_META[role];
    const familyRole = meta.fontFamily as FontFamilyRole;
    const fontFamily = familyRole === 'primary'
        ? themeData.global.primaryFont
        : familyRole === 'secondary'
            ? themeData.global.secondaryFont
            : themeData.global.tertiaryFont;
    const textTransform = transforms?.[familyRole];

    const sampleText = FAMILY_PANGRAMS[familyRole];

    return (
        <section className="space-y-8">
            <SectionHeader
                number={ROLE_NUMBERS[role]}
                icon={ROLE_ICONS[role]}
                title={meta.label}
                description={meta.description}
                id={`type-${role}`}
            />

            <div className="space-y-1">
                {tokens.map(token => (
                    <LiveSampleRow key={token.id} token={token} fontFamily={fontFamily} textTransform={textTransform} sampleText={sampleText} />
                ))}
            </div>

            <div style={{ fontFamily, textTransform }}>
                <TokenTable
                    headers={['Token', 'Alias', 'Size (px)', 'Weight', 'Line Height', 'Letter Spacing', 'Component']}
                    rows={tokens.map(t => [
                        t.m3Name,
                        t.alias,
                        t.fontSize,
                        `${t.fontWeight} ${WEIGHT_LABELS[t.fontWeight] || ''}`,
                        t.lineHeight,
                        `${t.letterSpacing > 0 ? '+' : ''}${t.letterSpacing}px`,
                        `${t.component} ${t.propValue}`,
                    ])}
                    highlight={0}
                />
            </div>

            {tokens.some(t => t.legacyId) && (
                <div className="bg-surface-container-lowest rounded-lg p-4 border border-border/30">
                    <p className="text-[10px] text-muted-foreground font-dev text-transform-tertiary tracking-wider">
                        Legacy mapping: {tokens.filter(t => t.legacyId).map(t => `${t.legacyId} → ${t.m3Name}`).join(' · ')}
                    </p>
                </div>
            )}
        </section>
    );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export const TypographyTokenStage = ({ themeData, onFontChange, onTransformChange, transforms }: TypographyBodyProps) => {
    const tokensByRole = (role: M3Role): TypographyTokenMap[] =>
        Object.values(TYPOGRAPHY_REGISTRY).filter(t => t.m3Role === role);

    const devTokens = tokensByRole('dev');

    return (
        <Wrapper
            identity={{
                displayName: "TypographyBody",
                filePath: "zap/sections/atoms/typography/body.tsx",
                parentComponent: "TypographyPage",
                type: "Organism/Page",
                architecture: "SYSTEMS // M3 L1"
            }}
        >
            <div className="max-w-5xl mx-auto space-y-20 pb-24">

                {/* ── 01. FONT FAMILY SHOWCASE ────────────────────────── */}
                <section className="space-y-8">
                    <SectionHeader
                        number="01"
                        title="Font Families"
                        icon="font_download"
                        description="Primary (impact), Secondary (readable), Tertiary (dev). Click the tune icon to swap fonts."
                        id="type-families"
                    />

                    <div className="bg-surface-container-lowest rounded-xl p-6 border border-border/30">
                        <p className="text-sm text-foreground leading-relaxed">
                            M3 assigns fonts by <strong>role</strong>: Primary drives Display + Headline + Title (brand impact),
                            Secondary handles Body + Label (readability), and Tertiary is reserved for dev/code overlays.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <FontFamilyCard role="primary" fontValue={themeData.global.primaryFont} transform={transforms?.primary} onFontChange={onFontChange} onTransformChange={onTransformChange} />
                        <FontFamilyCard role="secondary" fontValue={themeData.global.secondaryFont} transform={transforms?.secondary} onFontChange={onFontChange} onTransformChange={onTransformChange} />
                        <FontFamilyCard role="tertiary" fontValue={themeData.global.tertiaryFont} transform={transforms?.tertiary} onFontChange={onFontChange} onTransformChange={onTransformChange} />
                    </div>
                </section>

                {/* ── 02–06. M3 TYPE SCALE (5 roles) ────────────────────── */}
                {M3_ROLE_ORDER.map(role => (
                    <RoleSection
                        key={role}
                        role={role}
                        tokens={tokensByRole(role)}
                        themeData={themeData}
                        transforms={transforms}
                    />
                ))}

                {/* ── 07. DEV TOKENS (ZAP Extension) ─────────────────── */}
                <RoleSection
                    role="dev"
                    tokens={devTokens}
                    themeData={themeData}
                    transforms={transforms}
                />

                {/* ── 08. L2 COMPONENT MAPPING ───────────────────────── */}
                <section className="space-y-8">
                    <SectionHeader
                        number="08"
                        title="Component → Token Mapping"
                        icon="link"
                        description="Defines which M3 type token each UI component consumes. This is the L2 contract."
                        id="type-l2-mapping"
                    />

                    <div className="bg-surface-container-lowest rounded-xl p-6 border border-border/30">
                        <p className="text-sm text-foreground leading-relaxed">
                            Component developers reference this table — <strong>not raw pixel values</strong>.
                            Each mapping connects a UI component to its designated M3 type token, ensuring
                            consistent typography across the entire system.
                        </p>
                    </div>

                    <div style={{ fontFamily: themeData.global.tertiaryFont, textTransform: transforms?.tertiary }}>
                        <TokenTable
                            headers={['Component', 'M3 Token', 'Size', 'Weight', 'Notes']}
                            rows={L2_COMPONENT_MAP.map(mapping => {
                                const token = Object.values(TYPOGRAPHY_REGISTRY).find(t => t.m3Name === mapping.m3Token);
                                return [
                                    mapping.component,
                                    mapping.m3Token,
                                    token?.fontSize || '—',
                                    token?.fontWeight || '—',
                                    mapping.notes,
                                ];
                            })}
                            highlight={1}
                        />
                    </div>
                </section>

            </div>
        </Wrapper>
    );
};
