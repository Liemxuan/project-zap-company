export type PresentationCategory = 'Business' | 'Creative' | 'Technical' | 'Minimalist';

export interface PresentationPreset {
    id: string;
    title: string;
    description: string;
    category: PresentationCategory;
    thumbnailPreview: {
        background: string;    // valid CSS (hex or gradient)
        foreground: string;
        accent: string;
    };
    style_guidelines: {
        color_palette: string;
        typography: string;
        imagery: string;
        layout: string;
        effects?: string;
        visual_language?: string;
    };
    basePrompt?: string;
}

export const PRESENTATION_PRESETS: PresentationPreset[] = [
    {
        id: 'glassmorphism',
        title: 'Glassmorphism',
        description: 'Frosted glass panels, vibrant gradients, floating depth. Ideal for AI product launches.',
        category: 'Technical',
        thumbnailPreview: {
            background: 'linear-gradient(135deg, #667eea 0%, #00d4ff 100%)',
            foreground: '#ffffff',
            accent: 'rgba(255, 255, 255, 0.2)'
        },
        style_guidelines: {
            color_palette: "Vibrant gradient backgrounds (purple #667eea to pink #f093fb, or cyan #4facfe to blue #00f2fe), frosted white panels with 20% opacity, accent colors that pop against the gradient",
            typography: "SF Pro Display or Inter font style, bold 600-700 weight titles, clean 400 weight body, white text with subtle drop shadow for readability on glass",
            imagery: "Abstract 3D shapes floating in space, soft blurred orbs, geometric primitives with glass material, depth through overlapping translucent layers",
            layout: "Floating card panels with backdrop-blur effect, generous padding (48-64px), rounded corners (24-32px radius), layered depth with subtle shadows",
            effects: "Frosted glass blur (backdrop-filter: blur 20px), subtle white border (1px rgba 255,255,255,0.2), soft glow behind panels, floating elements with drop shadows",
            visual_language: "Premium tech aesthetic like Apple Vision Pro UI, depth through transparency, light refracting through glass surfaces"
        }
    },
    {
        id: 'dark-premium',
        title: 'Dark Premium',
        description: 'Rich black backgrounds, luxurious lighting, minimal glow. The executive standard.',
        category: 'Business',
        thumbnailPreview: {
            background: '#0a0a0a',
            foreground: '#ffffff',
            accent: '#00d4ff'
        },
        style_guidelines: {
            color_palette: "Deep black base (#0a0a0a to #121212), luminous accent color (electric blue #00d4ff, neon purple #bf5af2, or gold #ffd700), subtle gray gradients for depth (#1a1a1a to #0a0a0a)",
            typography: "Elegant sans-serif (Neue Haas Grotesk or Suisse Int'l style), dramatic size contrast (72pt+ headlines, 18pt body), letter-spacing -0.02em for headlines, pure white (#ffffff) text",
            imagery: "Dramatic studio lighting, rim lights and edge glow, cinematic product shots, abstract light trails, premium material textures (brushed metal, matte surfaces)",
            layout: "Generous negative space (60%+), asymmetric balance, content anchored to grid but with breathing room, single focal point per slide",
            effects: "Subtle ambient glow behind key elements, light bloom effects, grain texture overlay (2-3% opacity), vignette on edges",
            visual_language: "Luxury tech brand aesthetic (Bang & Olufsen, Porsche Design), sophistication through restraint, every element intentional"
        }
    },
    {
        id: 'black-orange',
        title: 'Black x Orange Agency',
        description: 'Dynamic white/black contrast with blood orange accents. The startup creative deck.',
        category: 'Creative',
        thumbnailPreview: {
            background: '#ffffff',
            foreground: '#111111',
            accent: '#ff4500' // Blood orange
        },
        basePrompt: "Background is white, text is black, accent color is blood orange, stylish design that a creative agency might create, incorporating dynamic and simple photos and English typography",
        style_guidelines: {
            color_palette: "Background is pristine white, text is jet black, accent color is vibrant blood orange (#ff4500)",
            typography: "Dynamic and bold English typography. Mixing modern sans-serifs with hyper-bold structural headlines",
            imagery: "Dynamic and simple photos, often black and white or highly stylized photography interacting with the typography",
            layout: "High-contrast geometric divisions. Brutalist tendencies but extremely clean and polished",
            visual_language: "A dynamic, stylish design that a top-tier creative agency or fashion brand might create. Tension between whitespace and massive text."
        }
    },
    {
        id: 'neo-brutalist',
        title: 'Neo-Brutalist',
        description: 'Raw typography, heavy borders, intentional chaos. Gen-Z targeting and disruptors.',
        category: 'Creative',
        thumbnailPreview: {
            background: '#e0e0e0', // Often beige or raw grey
            foreground: '#000000',
            accent: '#ff0080'      // Hot pink
        },
        style_guidelines: {
            color_palette: "High contrast primaries: stark black, pure white, with bold accent (hot pink #ff0080, electric yellow #ffff00, or raw red #ff0000), optional: Memphis-inspired pastels as secondary",
            typography: "Ultra-bold condensed type (Impact, Druk, or Bebas Neue style), UPPERCASE headlines, extreme size contrast, intentionally tight or overlapping letter-spacing",
            imagery: "Raw unfiltered photography, intentional visual noise, halftone patterns, cut-out collage aesthetic, hand-drawn elements, stickers and stamps",
            layout: "Broken grid, overlapping elements, thick black borders (4-8px), visible structure, anti-whitespace (dense but organized chaos)",
            effects: "Hard shadows (no blur, offset 8-12px), pixelation accents, scan lines, CRT screen effects, intentional 'mistakes'",
            visual_language: "Anti-corporate rebellion, DIY zine aesthetic meets digital, raw authenticity, memorable through boldness"
        }
    },
    {
        id: 'minimal-swiss',
        title: 'Minimal Swiss',
        description: 'Grid-based precision. Timeless modernism for consulting and architecture.',
        category: 'Minimalist',
        thumbnailPreview: {
            background: '#fafaf9',
            foreground: '#000000',
            accent: '#ff0000' // Swiss red
        },
        style_guidelines: {
            color_palette: "Pure white (#ffffff) or off-white (#fafaf9) backgrounds, true black (#000000) text, single bold accent (Swiss red #ff0000, Klein blue #002fa7, or signal yellow #ffcc00)",
            typography: "Helvetica Neue or Aktiv Grotesk, strict type scale (12/16/24/48/96), medium weight for body, bold for emphasis only, flush-left ragged-right alignment",
            imagery: "Objective photography, geometric shapes, clean iconography, mathematical precision, intentional empty space as compositional element",
            layout: "Strict grid adherence (baseline grid visible in spirit), modular compositions, generous whitespace (40%+ of slide), content aligned to invisible grid lines",
            effects: "None - purity of form, no shadows, no gradients, no decorative elements, occasional single hairline rules",
            visual_language: "International Typographic Style, form follows function, timeless modernism, Dieter Rams-inspired restraint"
        }
    },
    {
        id: '3d-isometric',
        title: '3D Isometric',
        description: 'Soft contemporary palette with cute, simplified floating 3D tech primitives.',
        category: 'Technical',
        thumbnailPreview: {
            background: '#fafafa',
            foreground: '#1b1c1a',
            accent: '#8b5cf6' // Muted purple
        },
        style_guidelines: {
            color_palette: "Soft contemporary palette: muted purples (#8b5cf6), teals (#14b8a6), warm corals (#fb7185), with cream or light gray backgrounds (#fafafa), consistent saturation across elements",
            typography: "Friendly geometric sans-serif (Circular, Gilroy, or Quicksand style), medium weight headlines, excellent readability, comfortable 24pt body text",
            imagery: "Clean isometric 3D illustrations, consistent 30° isometric angle, soft clay-render aesthetic, floating platforms and devices, cute simplified objects",
            layout: "Central isometric scene as hero, text balanced around 3D elements, clear visual hierarchy, comfortable margins (64px+)",
            effects: "Soft drop shadows (20px blur, 30% opacity), ambient occlusion on 3D objects, subtle gradients on surfaces, consistent light source (top-left)",
            visual_language: "Friendly tech illustration (Slack, Notion, Asana style), approachable complexity, clarity through simplification"
        }
    },
    {
        id: 'keynote',
        title: 'Keynote Cinematic',
        description: 'The Apple aesthetic. Deep blacks, extreme optical alignment, and massive product shots.',
        category: 'Business',
        thumbnailPreview: {
            background: 'linear-gradient(180deg, #1d1d1f 0%, #000000 100%)',
            foreground: '#ffffff',
            accent: '#0071e3'
        },
        style_guidelines: {
            color_palette: "Deep blacks (#000000 to #1d1d1f), pure white text, signature blue (#0071e3) or gradient accents (purple-pink for creative, blue-teal for tech)",
            typography: "San Francisco Pro Display, extreme weight contrast (bold 80pt+ titles, light 24pt body), negative letter-spacing on headlines (-0.03em), optical alignment",
            imagery: "Cinematic photography, shallow depth of field, dramatic lighting (rim lights, spot lighting), product hero shots with reflections, full-bleed imagery",
            layout: "Maximum negative space, single powerful image or statement per slide, content centered or dramatically offset, no clutter",
            effects: "Subtle gradient overlays, light bloom and glow on key elements, reflection on surfaces, smooth gradient backgrounds",
            visual_language: "Apple WWDC keynote aesthetic, confidence through simplicity, every pixel considered, theatrical presentation"
        }
    }
];

export function getPresetById(id: string): PresentationPreset | undefined {
    return PRESENTATION_PRESETS.find(preset => preset.id === id);
}

export function getPresetsByCategory(): Record<PresentationCategory, PresentationPreset[]> {
    return PRESENTATION_PRESETS.reduce((acc, preset) => {
        if (!acc[preset.category]) {
            acc[preset.category] = [];
        }
        acc[preset.category].push(preset);
        return acc;
    }, {} as Record<PresentationCategory, PresentationPreset[]>);
}
