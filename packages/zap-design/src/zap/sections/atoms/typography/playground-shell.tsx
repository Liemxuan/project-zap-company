'use client';

import React from 'react';
import { Text } from '../../../../genesis/atoms/typography/text';
import { SectionHeader } from '../../../../zap/sections/atoms/foundations/components';
import { Select } from '../../../../genesis/atoms/interactive/option-select';


import { Wrapper } from '../../../../components/dev/Wrapper';
import { LayeredStylizationSettings, CORE_FONTS } from './inspector';
import { TypographyThemeSchema } from './schema';
import { TYPOGRAPHY_REGISTRY, M3_ROLE_META, type TypographyTokenMap, type M3Role } from '../../../../genesis/utilities/typography-registry';

// Build sections from registry, one per M3 role
const FONT_WEIGHT_CLASS: Record<number, string> = {
    400: 'font-normal', 500: 'font-medium', 600: 'font-semibold', 700: 'font-bold', 800: 'font-extrabold', 900: 'font-black',
};

const SAMPLE_TEXT: Record<string, string> = {
    display: 'Sphinx of black quartz, judge my vow.',
    headline: 'Sphinx of black quartz, judge my vow.',
    title: 'Sphinx of black quartz, judge my vow.',
    body: 'Pack my box with five dozen liquor jugs. How vexingly quick daft zebras jump.',
    label: 'Pack my box with five dozen liquor jugs.',
    dev: '{ code: "clean" }',
};

const TAG_MAP: Record<string, keyof React.JSX.IntrinsicElements> = {
    'display-large': 'h1', 'display-medium': 'h2', 'display-small': 'h3',
    'headline-large': 'h2', 'headline-medium': 'h3', 'headline-small': 'h4',
    'title-large': 'h5', 'title-medium': 'h6', 'title-small': 'h6',
    'body-large': 'p', 'body-medium': 'p', 'body-small': 'p',
    'label-large': 'span', 'label-medium': 'span', 'label-small': 'span',
    'dev-wrapper': 'span', 'dev-note': 'span', 'dev-metric': 'span',
};

const FONT_KEY_MAP: Record<string, 'primaryFont' | 'secondaryFont' | 'tertiaryFont'> = {
    primary: 'primaryFont', secondary: 'secondaryFont', tertiary: 'tertiaryFont',
};

function buildRawClasses(token: TypographyTokenMap): string {
    const parts = [
        `text-[${token.fontSize}px]`,
        FONT_WEIGHT_CLASS[token.fontWeight] || 'font-normal',
        `leading-[${token.lineHeight}px]`,
    ];
    if (token.letterSpacing !== 0) parts.push(`tracking-[${token.letterSpacing}px]`);
    if (token.m3Role === 'body') parts.push('text-muted-foreground');
    else parts.push('text-foreground');
    return parts.join(' ');
}

const REGISTRY_ENTRIES: TypographyTokenMap[] = Object.values(TYPOGRAPHY_REGISTRY);

/** Convert camelCase m3Name to spaced label, e.g. 'displayLarge' → 'display Large' */
function formatTokenLabel(m3Name: string): string {
    return m3Name.replace(/([A-Z])/g, ' $1').trim();
}

function buildCodeSnippet(tag: string, raw: string, text: string): string {
    const open = '<' + tag + ' className="' + raw + '">';
    const close = '</' + tag + '>';
    return open + '\n  ' + text + '\n' + close;
}

const ROLE_ICONS: Record<M3Role, string> = {
    display: 'title', headline: 'format_h1', title: 'format_h2',
    body: 'article', label: 'label', dev: 'code',
};

const ROLE_NUMBERS: Record<M3Role, string> = {
    display: '01', headline: '02', title: '03',
    body: '04', label: '05', dev: '06',
};

interface PlaygroundSection {
    role: M3Role;
    label: string;
    description: string;
    icon: string;
    number: string;
    fontKey: 'primaryFont' | 'secondaryFont' | 'tertiaryFont';
    entries: { token: TypographyTokenMap; tag: keyof React.JSX.IntrinsicElements; raw: string; sampleText: string }[];
}

const ALL_ROLES: M3Role[] = ['display', 'headline', 'title', 'body', 'label', 'dev'];

const PLAYGROUND_SECTIONS: PlaygroundSection[] = ALL_ROLES.map(role => {
    const meta = M3_ROLE_META[role];
    return {
        role,
        label: meta.label,
        description: meta.description,
        icon: ROLE_ICONS[role],
        number: ROLE_NUMBERS[role],
        fontKey: FONT_KEY_MAP[meta.fontFamily],
        entries: REGISTRY_ENTRIES.filter(t => t.m3Role === role).map(t => ({
            token: t, tag: TAG_MAP[t.id] || 'span', raw: buildRawClasses(t), sampleText: SAMPLE_TEXT[role],
        })),
    };
});

interface TypographyPlaygroundShellProps {
    theme: TypographyThemeSchema;
    onUpdateTheme: (theme: TypographyThemeSchema) => void;
    activeAtom: string | null;
    setActiveAtom: (atom: string | null) => void;
}

const getLayerStyles = (settings?: LayeredStylizationSettings): React.CSSProperties => {
    if (!settings) return {};
    const styles: React.CSSProperties = { fontFamily: settings.fontFamily };
    if (settings.fontSize) styles.fontSize = `${settings.fontSize}px`;
    if (settings.box?.enabled) {
        styles.backgroundColor = settings.box.backgroundColor;
        styles.padding = `${settings.box.padding}px`;
        styles.borderRadius = '8px';
    }
    if (settings.layer0.enabled) {
        styles.color = settings.layer0.color;
        styles.opacity = settings.layer0.opacity;
    }
    if (settings.layer1.enabled) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (styles as any).WebkitTextStroke = `${settings.layer1.strokeWidth}px ${settings.layer1.color}`;
    }
    const shadows = [];
    if (settings.layer2.enabled) shadows.push(`${settings.layer2.x}px ${settings.layer2.y}px ${settings.layer2.blur}px ${settings.layer2.color}`);
    if (settings.layer3.enabled) shadows.push(`${settings.layer3.x}px ${settings.layer3.y}px ${settings.layer3.blur}px ${settings.layer3.color}`);
    styles.textShadow = shadows.length > 0 ? shadows.join(', ') : 'none';
    if (settings.effects?.enabled) {
        if (settings.effects.kineticTilt) {
            styles.transform = `rotate(${settings.effects.kineticTilt}deg)`;
            styles.display = 'inline-block';
        }
        if (settings.effects.characterCrush) styles.letterSpacing = `${settings.effects.characterCrush}px`;
        if (settings.effects.uppercase) styles.textTransform = 'uppercase';
        if (settings.effects.animation && settings.effects.animation !== 'none') {
            const animMap: Record<string, string> = { pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite', bounce: 'bounce 1s infinite', spin: 'spin 1s linear infinite', wiggle: 'wiggle 1s ease-in-out infinite' };
            if (animMap[settings.effects.animation]) styles.animation = animMap[settings.effects.animation];
        }
    }
    return styles;
};

const FontSelector = ({ value, onChange, label }: { value: string, onChange: (val: string) => void, label: string }) => (
    <label className="flex items-center gap-2 bg-white px-3 py-1 border-[length:var(--card-border-width,2px)] border-brand-midnight rounded-full shadow-[2px_2px_0_0_var(--color-brand-midnight)]">
        <span className="text-[10px] font-dev text-transform-tertiary font-bold text-gray-500">{label}:</span>
        <Select
            options={CORE_FONTS.map(f => ({ label: f.name, value: f.value }))}
            value={value}
            onChange={onChange}
            className="text-[11px] font-dev text-transform-tertiary font-black text-brand-midnight bg-transparent w-32"
        />
    </label>
);

export const TypographyPlaygroundShell = ({ theme, onUpdateTheme, activeAtom, setActiveAtom }: TypographyPlaygroundShellProps) => {

    const handleAtomClick = (id: string, e?: React.MouseEvent) => {
        e?.stopPropagation();
        setActiveAtom(activeAtom === id ? null : id);
    };

    const handleGlobalFontChange = (type: 'primaryFont' | 'secondaryFont' | 'tertiaryFont', val: string) => {
        const newElements = { ...theme.elements };

        const roleMap: Record<string, string> = { primaryFont: 'primary', secondaryFont: 'secondary', tertiaryFont: 'tertiary' };
        const targetRole = roleMap[type];
        REGISTRY_ENTRIES
            .filter(t => t.fontFamilyRole === targetRole)
            .forEach(t => {
                if (newElements[t.m3Name]) {
                    newElements[t.m3Name] = { ...newElements[t.m3Name], fontFamily: val };
                }
            });

        const newTheme: TypographyThemeSchema = {
            ...theme,
            global: { ...theme.global, [type]: val },
            elements: newElements
        };

        onUpdateTheme(newTheme);
    };

    return (
        <Wrapper identity={{ displayName: `Shell - ${theme.name}`, filePath: "zap/sections/atoms/typography/playground-shell.tsx", type: "Atom/View" }}>
            <div className="relative overflow-hidden transition-all duration-300 border border-border/50 rounded-md bg-layer-panel shadow-sm">
                <div className="p-12 space-y-16">

                    {/* DECORATIONS */}
                    {theme.decorations?.map(deco => {
                        if (deco.type === 'blob' || deco.type === 'sticker' || deco.type === 'tag') {
                            return <div key={deco.id} className={deco.className}>{deco.content}</div>;
                        }
                        return null;
                    })}

                    {/* REGISTRY-DRIVEN SECTIONS */}
                    {PLAYGROUND_SECTIONS.map((section) => (
                        <section key={section.role} className="space-y-8 relative z-10 bg-layer-dialog p-8 border-[length:var(--card-border-width,2px)] border-brand-midnight rounded-card shadow-sm">
                            <div className="flex items-center justify-between">
                                <SectionHeader
                                    number={section.number}
                                    title={section.label}
                                    icon={section.icon}
                                    description={section.description}
                                    id={`playground-${section.role}`}
                                />
                                <FontSelector label={section.fontKey.replace('Font', '')} value={theme.global[section.fontKey]} onChange={(v) => handleGlobalFontChange(section.fontKey, v)} />
                            </div>

                            <div className="space-y-6 relative z-10">
                                {section.entries.map((entry) => {
                                    const settings = theme.elements[entry.token.m3Name];
                                    if (!settings) return null;
                                    const Tag = entry.tag;

                                    return (
                                        <Wrapper key={entry.token.id} identity={{
                                            displayName: `${entry.token.m3Name} Raw Stitch`,
                                            filePath: "zap/sections/atoms/typography/playground-shell.tsx",
                                            type: "Wrapped Snippet",
                                            codeSnippet: buildCodeSnippet(entry.tag, entry.raw, entry.sampleText)
                                        }}>
                                            <div className={`grid grid-cols-12 gap-4 ${entry.token.fontFamilyRole === 'primary' ? 'items-center' : 'items-start'} border-b-[length:var(--card-border-width,2px)] border-brand-midnight/20 pb-4 border-dashed relative`}>
                                                <div className="col-span-3 text-pink-500 pt-1">
                                                    <Text size="iso-100" weight="bold" className="font-display text-transform-primary tracking-widest text-pink-500">
                                                        {formatTokenLabel(entry.token.m3Name)} ({entry.token.fontSize}px)
                                                    </Text>
                                                </div>
                                                <div className="col-span-9 transition-transform group cursor-pointer" onClick={(e) => handleAtomClick(entry.token.m3Name, e)}>
                                                    <div style={Object.assign({}, getLayerStyles(settings), settings ? {} : { color: 'black' })}>
                                                        <Tag
                                                            className={`${entry.raw} relative z-10 transition-all duration-200 ${entry.token.fontFamilyRole === 'tertiary' ? 'block' : ''}`}
                                                        >
                                                            {entry.sampleText}
                                                        </Tag>
                                                    </div>
                                                </div>
                                            </div>
                                        </Wrapper>
                                    );
                                })}
                            </div>
                        </section>
                    ))}
                </div>
            </div>
        </Wrapper>
    );
};
