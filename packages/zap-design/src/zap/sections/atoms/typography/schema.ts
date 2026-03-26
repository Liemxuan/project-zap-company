import { LayeredStylizationSettings } from './inspector';

export interface TypographyThemeDecoration {
    id: string;
    type: 'blob' | 'sticker' | 'tag' | 'text';
    content?: string;
    className?: string; // Tailwind overrides
    style?: React.CSSProperties; // Inline style overrides
}

export interface TypographyThemeSchema {
    id: 'basic' | 'corp' | 'fun' | 'wild' | 'metro';
    name: string;
    description: string;
    global: {
        backgroundColor: string;
        containerBorder?: string;
        containerShadow?: string;
        containerRadius?: string;
        primaryFont: string;
        secondaryFont: string;
        tertiaryFont: string;
        primaryTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
        secondaryTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
        tertiaryTransform?: 'uppercase' | 'lowercase' | 'capitalize' | 'none';
    };
    decorations?: TypographyThemeDecoration[];
    elements: Record<string, LayeredStylizationSettings>;
}

// Internal factory for base settings to keep JSON payloads clean
export const createBaseElementSettings = (fontFamily: string, fontSize?: number): LayeredStylizationSettings => ({
    fontFamily,
    fontSize,
    box: { enabled: false, backgroundColor: '#ffffff', padding: 8 },
    layer0: { enabled: true, color: 'var(--color-black)', opacity: 1 },
    layer1: { enabled: false, color: 'var(--color-black)', opacity: 1, strokeWidth: 2 },
    layer2: { enabled: false, color: 'var(--color-black)', opacity: 1, x: 4, y: 4, blur: 0 },
    layer3: { enabled: false, color: 'var(--color-black)', opacity: 1, x: 0, y: 0, blur: 0 },
    effects: { enabled: false }
});

// BASIC THEME
export const basicThemeData: TypographyThemeSchema = {
    id: 'basic',
    name: 'The Basic Standard',
    description: 'Clean, unopinionated, reliable.',
    global: {
        backgroundColor: 'var(--color-layer-canvas)',
        primaryFont: 'var(--font-space-grotesk), sans-serif',
        secondaryFont: 'var(--font-inter), sans-serif',
        tertiaryFont: 'var(--font-jetbrains), monospace',
        containerBorder: 'length:var(--card-border-width,2px)',
        containerRadius: 'calc(var(--card-radius) * 1.5)',
    },
    elements: {
        displayLarge: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 57),
        displayMedium: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 45),
        displaySmall: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 36),
        headlineLarge: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 32),
        headlineMedium: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 28),
        headlineSmall: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 24),
        titleLarge: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 22),
        titleMedium: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 16),
        titleSmall: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 14),
        bodyLarge: createBaseElementSettings('var(--font-inter), sans-serif', 16),
        bodyMedium: createBaseElementSettings('var(--font-inter), sans-serif', 14),
        bodySmall: createBaseElementSettings('var(--font-inter), sans-serif', 12),
        labelLarge: createBaseElementSettings('var(--font-inter), sans-serif', 14),
        labelMedium: createBaseElementSettings('var(--font-inter), sans-serif', 12),
        labelSmall: createBaseElementSettings('var(--font-inter), sans-serif', 11),
        devWrapper: createBaseElementSettings('var(--font-jetbrains), monospace', 13),
        devNote: createBaseElementSettings('var(--font-jetbrains), monospace', 13),
        devMetric: createBaseElementSettings('var(--font-jetbrains), monospace', 11),
    }
};

// CORP THEME
export const corpThemeData: TypographyThemeSchema = {
    id: 'corp',
    name: 'Corp Trust',
    description: 'Professional, sharp, authoritative.',
    global: {
        backgroundColor: '#f8fafc', // slate-50
        primaryFont: 'var(--font-roboto), sans-serif',
        secondaryFont: 'var(--font-inter), sans-serif',
        tertiaryFont: 'var(--font-jetbrains), monospace',
        containerBorder: 'length:var(--card-border-width,1px)',
        containerRadius: '0px',
        containerShadow: 'none',
    },
    elements: {
        displayLarge: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 57), layer0: { enabled: true, color: '#0f172a', opacity: 1 } },
        displayMedium: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 45), layer0: { enabled: true, color: '#0f172a', opacity: 1 } },
        displaySmall: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 36), layer0: { enabled: true, color: '#0f172a', opacity: 1 } },
        headlineLarge: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 32), layer0: { enabled: true, color: '#1e293b', opacity: 1 } },
        headlineMedium: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 28), layer0: { enabled: true, color: '#334155', opacity: 1 } },
        headlineSmall: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 24), layer0: { enabled: true, color: '#334155', opacity: 1 } },
        titleLarge: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 22), layer0: { enabled: true, color: '#475569', opacity: 1 } },
        titleMedium: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 16), layer0: { enabled: true, color: '#475569', opacity: 1 }, effects: { enabled: true, uppercase: true } },
        titleSmall: { ...createBaseElementSettings('var(--font-roboto), sans-serif', 14), layer0: { enabled: true, color: '#64748b', opacity: 1 }, effects: { enabled: true, uppercase: true } },
        bodyLarge: createBaseElementSettings('var(--font-inter), sans-serif', 16),
        bodyMedium: createBaseElementSettings('var(--font-inter), sans-serif', 14),
        bodySmall: createBaseElementSettings('var(--font-inter), sans-serif', 12),
        labelLarge: createBaseElementSettings('var(--font-inter), sans-serif', 14),
        labelMedium: createBaseElementSettings('var(--font-inter), sans-serif', 12),
        labelSmall: createBaseElementSettings('var(--font-inter), sans-serif', 11),
        devWrapper: createBaseElementSettings('var(--font-jetbrains), monospace', 13),
        devNote: createBaseElementSettings('var(--font-jetbrains), monospace', 13),
        devMetric: createBaseElementSettings('var(--font-jetbrains), monospace', 11),
    }
};

// FUN THEME
export const funThemeData: TypographyThemeSchema = {
    id: 'fun',
    name: 'Fun & Bouncy',
    description: 'Playful, vibrant, energetic.',
    global: {
        backgroundColor: '#ffe6f2',
        primaryFont: 'var(--font-comic-neue), cursive',
        secondaryFont: 'var(--font-space-grotesk), sans-serif',
        tertiaryFont: 'var(--font-jetbrains), monospace',
        containerBorder: 'length:var(--card-border-width,4px)',
        containerRadius: '2rem',
        containerShadow: '8px 8px 0px 0px var(--color-brand-midnight)',
    },
    decorations: [
        { id: 'blob1', type: 'blob', className: 'absolute top-1/4 right-1/4 w-64 h-32 bg-[#00ffff] rounded-full opacity-60 mix-blend-multiply blur-md -rotate-12 pointer-events-none' },
        { id: 'blob2', type: 'blob', className: 'absolute bottom-1/4 left-1/4 w-48 h-48 bg-brand-yellow rounded-full opacity-60 mix-blend-multiply blur-md rotate-45 pointer-events-none' },
        { id: 'blob3', type: 'blob', className: 'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-40 bg-[#ff007f] rounded-full opacity-40 mix-blend-multiply blur-lg pointer-events-none' },
        { id: 'sticker1', type: 'sticker', content: '?!', className: 'absolute top-8 left-8 border-[length:var(--card-border-width,4px)] border-brand-midnight w-20 h-20 rounded-full flex items-center justify-center font-black text-3xl rotate-12 bg-[#00ffff] z-20 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]' },
        { id: 'sticker2', type: 'sticker', content: 'WOW!', className: 'absolute top-8 right-8 bg-[#ff007f] text-white font-black px-4 py-2 border-[length:var(--card-border-width,4px)] border-brand-midnight -rotate-12 rounded-full z-20 text-xl drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]' },
        { id: 'sticker3', type: 'sticker', content: 'YEAH!', className: 'absolute top-24 right-16 bg-[#39ff14] text-brand-midnight font-black px-3 py-1 border-[length:var(--card-border-width,4px)] border-brand-midnight rounded-full rotate-45 z-20 text-lg drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]' },
    ],
    elements: {
        displayLarge: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 57), effects: { enabled: true, kineticTilt: -2 } },
        displayMedium: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 45), effects: { enabled: true, kineticTilt: 1 } },
        displaySmall: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 36) },
        headlineLarge: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 32) },
        headlineMedium: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 28) },
        headlineSmall: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 24) },
        titleLarge: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 22), box: { enabled: true, backgroundColor: 'transparent', padding: 4 }, layer1: { enabled: true, strokeWidth: 2, color: 'var(--color-brand-midnight)', opacity: 1 }, effects: { enabled: true, kineticTilt: -1 } },
        titleMedium: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 16), box: { enabled: true, backgroundColor: 'transparent', padding: 4 }, layer1: { enabled: true, strokeWidth: 2, color: 'var(--color-brand-midnight)', opacity: 1 }, effects: { enabled: true, kineticTilt: 1 } },
        titleSmall: { ...createBaseElementSettings('var(--font-comic-neue), cursive', 14) },
        bodyLarge: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 16),
        bodyMedium: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 14),
        bodySmall: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 12),
        labelLarge: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 14),
        labelMedium: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 12),
        labelSmall: createBaseElementSettings('var(--font-space-grotesk), sans-serif', 11),
        devWrapper: createBaseElementSettings('var(--font-jetbrains), monospace', 13),
        devNote: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 13), box: { enabled: true, backgroundColor: 'var(--color-brand-yellow)', padding: 4 } },
        devMetric: createBaseElementSettings('var(--font-jetbrains), monospace', 11),
    }
};

// WILD THEME
export const wildThemeData: TypographyThemeSchema = {
    id: 'wild',
    name: 'Wild Chaos',
    description: 'Experimental, dense, unpredictable.',
    global: {
        backgroundColor: '#0a0a0a',
        primaryFont: 'var(--font-bricolage), sans-serif',
        secondaryFont: 'var(--font-jetbrains), monospace',
        tertiaryFont: 'var(--font-jetbrains), monospace',
        containerBorder: 'length:var(--card-border-width,2px)',
        containerRadius: '0px',
        containerShadow: '4px 4px 0px 0px #ff007f',
    },
    decorations: [
        { id: 'bg1', type: 'blob', className: 'absolute inset-0 bg-[url("https://www.transparenttextures.com/patterns/stardust.png")] opacity-20 pointer-events-none' },
        { id: 'sticker1', type: 'sticker', content: 'ERR:500', className: 'absolute top-4 right-4 bg-red-600 text-white font-dev text-transform-tertiary font-black px-2 py-1 rotate-[15deg] border-[3px] border-black shadow-[4px_4px_0_0_#fff] z-30' },
    ],
    elements: {
        displayLarge: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 57), layer0: { enabled: true, color: '#ffffff', opacity: 1 }, layer1: { enabled: true, strokeWidth: 2, color: '#000000', opacity: 1 }, layer2: { enabled: true, x: 4, y: 4, blur: 0, color: '#ff007f', opacity: 1 }, effects: { enabled: true, uppercase: true, characterCrush: -1, kineticTilt: -2 } },
        displayMedium: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 45), layer0: { enabled: true, color: '#00ffff', opacity: 1 }, layer2: { enabled: true, x: 2, y: 2, blur: 0, color: '#000000', opacity: 1 }, effects: { enabled: true, uppercase: true, kineticTilt: 1 } },
        displaySmall: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 36), layer0: { enabled: true, color: '#39ff14', opacity: 1 } },
        headlineLarge: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 32), layer0: { enabled: true, color: '#ffffff', opacity: 1 } },
        headlineMedium: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 28), layer0: { enabled: true, color: '#ff007f', opacity: 1 }, effects: { enabled: true, uppercase: true } },
        headlineSmall: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 24), layer0: { enabled: true, color: '#00ffff', opacity: 1 }, effects: { enabled: true, uppercase: true, characterCrush: 4 } },
        titleLarge: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 22), layer0: { enabled: true, color: '#ffffff', opacity: 1 } },
        titleMedium: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 16), layer0: { enabled: true, color: '#ff007f', opacity: 1 } },
        titleSmall: { ...createBaseElementSettings('var(--font-bricolage), sans-serif', 14), layer0: { enabled: true, color: '#00ffff', opacity: 1 } },
        bodyLarge: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 16), layer0: { enabled: true, color: '#e5e5e5', opacity: 1 } },
        bodyMedium: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 14), layer0: { enabled: true, color: '#cccccc', opacity: 1 } },
        bodySmall: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 12), layer0: { enabled: true, color: '#999999', opacity: 1 } },
        labelLarge: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 14), layer0: { enabled: true, color: '#cccccc', opacity: 1 } },
        labelMedium: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 12), layer0: { enabled: true, color: '#999999', opacity: 1 } },
        labelSmall: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 11), layer0: { enabled: true, color: '#666666', opacity: 1 } },
        devWrapper: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 13), layer0: { enabled: true, color: '#00ffff', opacity: 1 } },
        devNote: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 13), layer0: { enabled: true, color: '#000000', opacity: 1 }, box: { enabled: true, backgroundColor: '#39ff14', padding: 4 } },
        devMetric: { ...createBaseElementSettings('var(--font-jetbrains), monospace', 11), layer0: { enabled: true, color: '#ff007f', opacity: 1 } },
    }
};

// METRO THEME
export const metroThemeData: TypographyThemeSchema = {
    id: 'metro',
    name: 'Metro Standard',
    description: 'The definitive Pacifico script + JetsBrains monospace combination for ZAP Phase 3.',
    global: {
        backgroundColor: 'var(--color-layer-canvas)',
        primaryFont: 'var(--font-pacifico), cursive',
        secondaryFont: 'var(--font-inter), sans-serif',
        tertiaryFont: 'var(--font-jetbrains), monospace',
        primaryTransform: 'none',
        secondaryTransform: 'none',
        tertiaryTransform: 'none',
        containerBorder: 'length:var(--card-border-width,2px)',
        containerRadius: 'calc(var(--card-radius) * 1.5)',
    },
    elements: {
        displayLarge: createBaseElementSettings('var(--font-pacifico), cursive', 57),
        displayMedium: createBaseElementSettings('var(--font-pacifico), cursive', 45),
        displaySmall: createBaseElementSettings('var(--font-pacifico), cursive', 36),
        headlineLarge: createBaseElementSettings('var(--font-pacifico), cursive', 32),
        headlineMedium: createBaseElementSettings('var(--font-pacifico), cursive', 28),
        headlineSmall: createBaseElementSettings('var(--font-pacifico), cursive', 24),
        titleLarge: createBaseElementSettings('var(--font-pacifico), cursive', 22),
        titleMedium: createBaseElementSettings('var(--font-pacifico), cursive', 16),
        titleSmall: createBaseElementSettings('var(--font-pacifico), cursive', 14),
        bodyLarge: createBaseElementSettings('var(--font-jetbrains), monospace', 16),
        bodyMedium: createBaseElementSettings('var(--font-jetbrains), monospace', 14),
        bodySmall: createBaseElementSettings('var(--font-jetbrains), monospace', 12),
        labelLarge: createBaseElementSettings('var(--font-jetbrains), monospace', 14),
        labelMedium: createBaseElementSettings('var(--font-jetbrains), monospace', 12),
        labelSmall: createBaseElementSettings('var(--font-jetbrains), monospace', 11),
        devWrapper: createBaseElementSettings('var(--font-jetbrains), monospace', 13),
        devNote: createBaseElementSettings('var(--font-jetbrains), monospace', 13),
        devMetric: createBaseElementSettings('var(--font-jetbrains), monospace', 11),
    }
};

export const ALL_THEMES = [basicThemeData, corpThemeData, funThemeData, wildThemeData, metroThemeData];
