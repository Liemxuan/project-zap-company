'use client';

import React, { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Wrapper } from '../../../../components/dev/Wrapper';
import { Card } from '../../../../genesis/atoms/surfaces/card';
import { Icon } from '../../../../genesis/atoms/icons/Icon';
import { motion, AnimatePresence } from 'framer-motion';

import { TypographyThemeSchema } from './schema';
import { CORE_FONTS } from './inspector';
import { SectionHeader, TokenTable } from '../../../../zap/sections/atoms/foundations/components';
import { CanvasBody } from '../../../../zap/layout/CanvasBody';
import {
    M3_ROLE_ORDER,
    M3_ROLE_META,
    L2_COMPONENT_MAP,
    TYPOGRAPHY_REGISTRY,
    type M3Role,
    type TypographyTokenMap,
} from '../../../../genesis/utilities/typography-registry';

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
    // Return base name without forced uppercase
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
    primary: { label: 'primary', scope: 'display + headline + title', icon: 'star' },
    secondary: { label: 'secondary', scope: 'body + label', icon: 'menu_book' },
    tertiary: { label: 'tertiary', scope: 'dev overlay', icon: 'code' },
};

const TRANSFORM_TO_INDICATOR: Record<TextTransform, string> = {
    uppercase: 'AA',
    lowercase: 'aa',
    capitalize: 'Ab',
    none: 'Aa',
};

// ─── FONT PICKER POPUP ─────────────────────────────────────────────────────────

const FontPickerPopup = ({
    role,
    currentFont,
    currentTransform = 'none',
    onSelect,
    onTransform,
    onClose,
    anchorRef,
}: {
    role: FontFamilyRole;
    currentFont: string;
    currentTransform?: TextTransform;
    onSelect: (font: string) => void;
    onTransform?: (transform: TextTransform) => void;
    onClose: () => void;
    anchorRef: React.RefObject<HTMLDivElement | null>;
}) => {
    const popupRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number; width: number }>({ top: 0, left: 0, width: 300 });

    // Position the portal popup relative to the anchor card
    useEffect(() => {
        const updatePos = () => {
            if (anchorRef.current) {
                const rect = anchorRef.current.getBoundingClientRect();
                setPos({
                    top: rect.bottom + window.scrollY + 8,
                    left: rect.left + window.scrollX,
                    width: rect.width,
                });
            }
        };
        updatePos();
        window.addEventListener('scroll', updatePos, true);
        window.addEventListener('resize', updatePos);
        return () => {
            window.removeEventListener('scroll', updatePos, true);
            window.removeEventListener('resize', updatePos);
        };
    }, [anchorRef]);

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

    return createPortal(
        <motion.div
            ref={popupRef}
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="bg-layer-dialog border-2 border-card-border rounded-xl shadow-xl overflow-hidden"
            style={Object.assign({}, {
                position: 'absolute' as const,
                top: pos.top,
                left: pos.left,
                width: pos.width,
                zIndex: 10000,
            })}
        >
            {/* Header */}
            <div className="px-4 py-3 bg-on-surface/5 border-b border-card-border/50">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Icon name={meta.icon} size={16} className="text-primary" />
                        <span className="text-[10px] font-black text-transform-secondary tracking-widest text-foreground">
                            {meta.label} FONT
                        </span>
                    </div>
                    <span className="text-[9px] font-dev text-transform-tertiary text-muted-foreground tracking-wider">
                        {meta.scope}
                    </span>
                </div>
            </div>

            {/* Text Casing — first */}
            {onTransform && (
                <div className="px-4 py-3 bg-on-surface/5 border-b border-card-border/50">
                    <span className="text-[9px] font-black text-transform-secondary tracking-widest text-muted-foreground block mb-2">TEXT CASING</span>
                    <div className="grid grid-cols-4 gap-1">
                        {([['uppercase', 'AA'], ['lowercase', 'aa'], ['capitalize', 'Ab'], ['none', 'Aa']] as const).map(([value, label]) => (
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
                                style={Object.assign({}, { fontFamily: font.value, textTransform: currentTransform || 'none' })}
                            >
                                Aa
                            </span>
                            <div className="flex flex-col min-w-0">
                                <span
                                    className="text-sm font-bold text-foreground truncate"
                                    style={Object.assign({}, { fontFamily: font.value, textTransform: currentTransform || 'none' })}
                                >
                                    {shortName}
                                </span>
                                <span className="text-[10px] text-muted-foreground font-dev text-transform-tertiary truncate">{font.value.split(',')[0]}</span>
                            </div>
                            {isActive && (
                                <Icon name="check_circle" size={18} className="text-primary ml-auto shrink-0" />
                            )}
                        </button>
                    );
                })}
            </div>
        </motion.div>,
        document.body
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
    const cardRef = useRef<HTMLDivElement>(null);
    const meta = FAMILY_META[role];

    const pangrams: Record<FontFamilyRole, string> = {
        primary: 'Sphinx of black quartz, judge my vow.',
        secondary: 'Pack my box with five dozen liquor jugs.',
        tertiary: '{ code: "clean" }',
    };

    // Resolve the raw CSS font name for inline style injection
    const rawFontName = fontValue.split(',')[0].trim();

    return (
        <Wrapper identity={{ displayName: `${meta.label} Font Card`, filePath: "zap/sections/atoms/typography/body.tsx", type: "Atom/Card", architecture: "L3: PANEL" }} className="h-full">
            <div ref={cardRef} className="relative h-full">
                <Card className="bg-layer-panel flex flex-col items-center justify-center p-6 relative group text-brand-midnight hover:translate-x-[-2px] hover:translate-y-[-2px] transition-transform shadow-[4px_4px_0px_0px_var(--color-card-border)] hover:shadow-[6px_6px_0px_0px_var(--color-card-border)] h-full">
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

                    {/* Role label — inherits dev font and tertiary casing */}
                    <span className="text-[10px] font-dev text-transform-tertiary font-black text-on-surface-variant/50 mb-2 tracking-widest">
                        {meta.label} · {meta.scope}
                    </span>

                    {/* Font name — uses THIS role's font + transform only */}
                    <div
                        className="text-4xl font-black tracking-tight leading-[1.1] border border-transparent"
                        style={Object.assign({}, { fontFamily: `${rawFontName}, sans-serif`, textTransform: transform })}
                    >
                        {getFontName(fontValue)}
                    </div>

                    {/* Casing indicator */}
                    <div className="flex flex-col items-center gap-1 mt-3">
                        <span className="text-7xl font-black leading-none" style={Object.assign({}, { fontFamily: fontValue, textTransform: 'none' })}>
                            {TRANSFORM_TO_INDICATOR[transform || 'none']}
                        </span>
                        {transform && transform !== 'none' && (
                            <span className="text-[9px] font-dev text-transform-tertiary font-black tracking-widest px-2 py-[3px] rounded bg-primary/10 text-primary mt-2" style={Object.assign({}, { textTransform: 'none' })}>
                                {transform}
                            </span>
                        )}
                    </div>

                    {/* Pangram preview — uses THIS role's transform only */}
                    <p
                        className="text-xs font-bold text-center mt-3 max-w-[200px] leading-tight text-on-surface-variant/60"
                        style={Object.assign({}, { fontFamily: fontValue, textTransform: transform })}
                    >
                        {pangrams[role]}
                    </p>
                </Card>

                {/* Popup — portaled to document.body to escape overflow:hidden */}
                <AnimatePresence>
                    {isOpen && onFontChange && (
                        <FontPickerPopup
                            role={role}
                            currentFont={fontValue}
                            currentTransform={transform}
                            onSelect={(font) => onFontChange(role, font)}
                            onTransform={onTransformChange ? (t) => onTransformChange(role, t) : undefined}
                            onClose={() => setIsOpen(false)}
                            anchorRef={cardRef}
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
                <span className="text-[10px] font-bold text-muted-foreground text-transform-secondary font-secondary tracking-wider">{token.m3Name}</span>
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
                style={Object.assign({}, {
                    fontSize: token.fontSize,
                    lineHeight: `${token.lineHeight}px`,
                    fontWeight: token.fontWeight,
                    letterSpacing: token.letterSpacing,
                    fontFamily,
                    textTransform: textTransform || 'none'
                })}
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
        <CanvasBody.Section flush={true} className="rounded-xl border border-outline-variant/40 overflow-hidden">
            <SectionHeader
                number={ROLE_NUMBERS[role]}
                icon={ROLE_ICONS[role]}
                title={meta.label}
                description={meta.description}
                id={`type-${role}`}
            />

            {/* Card body */}
            <div className="p-6 space-y-6">
                <div className="space-y-1 rounded-lg overflow-hidden border border-outline-variant/20">
                    {tokens.map(token => (
                        <LiveSampleRow key={token.id} token={token} fontFamily={fontFamily} textTransform={textTransform} sampleText={sampleText} />
                    ))}
                </div>

                <div className="font-body text-transform-secondary" style={Object.assign({}, { textTransform: 'none' })}>
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
                    <div className="bg-layer-dialog rounded-lg p-4 border border-outline-variant/30">
                        <p className="text-[10px] text-on-surface-variant font-dev text-transform-tertiary tracking-wider">
                            Legacy mapping: {tokens.filter(t => t.legacyId).map(t => `${t.legacyId} → ${t.m3Name}`).join(' · ')}
                        </p>
                    </div>
                )}
            </div>
        </CanvasBody.Section>
    );
};

// ─── MAIN COMPONENT ─────────────────────────────────────────────────────────────

export const TypographyBody = ({ themeData, onFontChange, onTransformChange, transforms }: TypographyBodyProps) => {
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
            <div className="max-w-5xl mx-auto space-y-8 pb-24 font-secondary">

                {/* ── 01. FONT FAMILY SHOWCASE ────────────────────────── */}
                <CanvasBody.Section flush={true} className="rounded-xl border border-outline-variant/40 overflow-hidden">
                    <SectionHeader
                        number="01"
                        title="Font Families"
                        icon="font_download"
                        description="Primary (impact), Secondary (readable), Tertiary (dev). Click the tune icon to swap fonts."
                        id="type-families"
                    />

                    <div className="p-6 space-y-6">
                        <div className="bg-layer-dialog rounded-xl p-5 border border-outline-variant/20">
                            <p className="text-sm text-on-surface leading-relaxed">
                                M3 assigns fonts by <strong>role</strong>: Primary drives Display + Headline + Title (brand impact),
                                Secondary handles Body + Label (readability), and Tertiary is reserved for dev/code overlays.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                            <FontFamilyCard role="primary" fontValue={themeData.global.primaryFont} transform={transforms?.primary} onFontChange={onFontChange} onTransformChange={onTransformChange} />
                            <FontFamilyCard role="secondary" fontValue={themeData.global.secondaryFont} transform={transforms?.secondary} onFontChange={onFontChange} onTransformChange={onTransformChange} />
                            <FontFamilyCard role="tertiary" fontValue={themeData.global.tertiaryFont} transform={transforms?.tertiary} onFontChange={onFontChange} onTransformChange={onTransformChange} />
                        </div>
                    </div>
                </CanvasBody.Section>

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
                <CanvasBody.Section flush={true} className="rounded-xl border border-outline-variant/40 overflow-hidden">
                    <SectionHeader
                        number="08"
                        title="Component → Token Mapping"
                        icon="link"
                        description="Defines which M3 type token each UI component consumes. This is the L2 contract."
                        id="type-l2-mapping"
                    />

                    <div className="p-6 space-y-6">
                        <div className="bg-layer-dialog rounded-xl p-5 border border-outline-variant/20">
                            <p className="text-sm text-on-surface leading-relaxed">
                                Component developers reference this table — <strong>not raw pixel values</strong>.
                                Each mapping connects a UI component to its designated M3 type token, ensuring
                                consistent typography across the entire system.
                            </p>
                        </div>

                        <div style={Object.assign({}, { fontFamily: themeData.global.tertiaryFont, textTransform: transforms?.tertiary || 'none' })}>
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
                    </div>
                </CanvasBody.Section>

            </div>
        </Wrapper>
    );
};
