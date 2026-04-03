# ZAP Architecture: Canvas Area Structure & Layer Definition (L1-L5)

This document provides the definitive builder guidance for constructing and auditing the **Canvas Area**. It defines the strict spatial ascension rules for the ZAP 5-Layer System and provides production-ready L5 Template and L4 Body component samples based on the established `foundations/elevation` pattern.

## The Spatial Depth Ascension Rule
When building pages in the ZAP Design Engine, the structural layers **must strictly ascend** in order. You cannot place a lower depth token inside a higher depth token.

1. **L1: `bg-layer-canvas` (z-10)** - The foundational floor of the routing layout (`<Canvas>`).
2. **L2: `bg-layer-cover` (z-100)** - The massive padded wrapper containing the title (`<CanvasBody>`).
3. **L3: `bg-layer-panel` (z-1000+)** - The specific horizontal content section (`<CanvasBody.Section>`).
4. **L4: `bg-layer-dialog` (z-2000+)** - The isolated preview box or demo container (`<CanvasBody.Demo>`).
5. **L5: `bg-layer-modal` (z-3000)** - Modals, popovers, and floating inspector panels.

---

## Typography Hierarchy Rules
Typography must naturally map to the depth of the nested layer:

- **Display Header (L3/L4 Headings)**: `font-display text-transform-primary font-medium text-foreground text-xl`. Used for primary module headings inside a Canvas. 
- **Body Content (L4/L5 Paragraphs)**: `font-body text-transform-secondary text-sm text-foreground/80 leading-[1.6]`. Never use raw `<p>` tags without these classes, or you risk breaking the active M3 theme. Line height must always be explicitly relaxed to maintain ZAP density standards.
- **Microcopy / Labels (Any Layer)**: `font-dev text-transform-tertiary text-xs text-muted-foreground`. Overlines use `text-[10px] font-black font-dev text-transform-tertiary tracking-widest` for maximum scanability.

---

## 1. L5 Sample Component (The Page Mount Template)
The **L5 Page** is responsible for mounting the `LaboratoryTemplate`, fetching the active theme via `useParams()`, wiring up the `ThemeHeader`, configuring the inspector panel on the right, and then injecting the **L4 Body Organism** into the canvas space.

```tsx
'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { LaboratoryTemplate } from '@/zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '@/genesis/molecules/layout/ThemeHeader';
// 1. Import your L4 Body Organism
import { SampleCanvasBody } from '@/genesis/organisms/sample/SampleCanvasBody';
import { type Platform } from '@/zap/sections/atoms/foundations/components';

export default function SampleCanvasPage() {
    const params = useParams();
    const themeId = (params?.theme as string) || 'metro'; // Safe fallback
    
    // Manage platform state for the header toggle if needed
    const [platform, setPlatform] = useState<Platform>('web');

    return (
        <LaboratoryTemplate
            componentName="Sample Component Canvas"
            tier="L1 TOKEN" /* Or L2 PRIMITIVE, L3 MOLECULE depending on what you're building */
            filePath={`app/design/${themeId}/foundations/sample/page.tsx`}
            
            // The Header layer
            headerMode={
                <ThemeHeader
                    title="Sample Component Name"
                    badge="Category Identifier"
                    breadcrumb={`Zap Design Engine / ${themeId} / Foundations`}
                    platform={platform}
                    setPlatform={setPlatform}
                />
            }
            
            // The Inspector layer (Right panel)
            inspectorConfig={{
                title: 'Component Settings',
                width: 320,
                content: (
                    <div className="p-4 text-muted-foreground text-sm font-dev text-transform-tertiary">
                        // Your L5 Inspector Panel Mount Goes Here
                    </div>
                ),
            }}
        >
            {/* The Main Stage Area containing the L4 Organism */}
            <SampleCanvasBody platform={platform} />
        </LaboratoryTemplate>
    );
}
```

---

## 2. L4 Sample Component (The Body Organism)
The **L4 Body Organism** forms the internal content of the canvas. It relies exclusively on `<CanvasBody.Section>` and `<CanvasBody.Demo>` to enforce the correct `bg-layer-panel` (L3) and `bg-layer-dialog` (L4) ascension stack.

```tsx
'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { SectionHeader } from '@/zap/sections/atoms/foundations/components';
import { CanvasBody } from '@/zap/layout/CanvasBody';
import { type Platform } from '@/zap/sections/atoms/foundations/components';

interface SampleCanvasBodyProps {
    platform: Platform;
}

export const SampleCanvasBody = ({ platform }: SampleCanvasBodyProps) => {
    return (
        <>
            {/* ── 01. INTRO / THEORY SECTION ─────────────────────── */}
            {/* L3 Section layer forces bg-layer-panel automatically */}
            <CanvasBody.Section label="01 · ARCHITECTURE CONTEXT">
                <SectionHeader
                    number="01"
                    title="Component Architecture"
                    icon="architecture"
                    description="The foundational logic and rules for this module."
                    id="sample-architecture"
                />

                {/* L4 Demo layer forces bg-layer-dialog automatically */}
                <CanvasBody.Demo label="OVERVIEW" centered={false} minHeight="min-h-0">
                    <p className="font-body text-transform-secondary text-sm text-foreground/80 leading-[1.6] max-w-3xl">
                        This is the narrative explanation layer. It lives inside a <strong>Demo Frame (L4)</strong> 
                        so it sits visibly elevated above the L3 Section Panel. Never place raw text 
                        directly onto the Section without a Demo frame if you want to maintain spatial depth.
                    </p>
                </CanvasBody.Demo>
            </CanvasBody.Section>

            {/* ── 02. INTERACTIVE COMPONENT DEMO ─────────────────────── */}
            <CanvasBody.Section label="02 · COMPONENT PREVIEWS">
                <SectionHeader
                    number="02"
                    title="Live Render Variants"
                    icon="preview"
                    description="Interactive instances of the component mutating based on inspector state."
                    id="sample-preview"
                />

                {/* A standard centered component preview box */}
                <CanvasBody.Demo label="PRIMARY VARIANT" centered={true} minHeight="min-h-[300px]">
                    <div className="p-8 bg-layer-panel border-0 rounded-2xl shadow-[0_4px_12px_rgba(0,0,0,0.05)] text-center w-full max-w-sm">
                        <Icon name="widgets" size={48} className="text-primary mx-auto mb-4" />
                        <h3 className="text-xl font-display text-transform-primary font-medium text-foreground tracking-tight mb-2">Rendered Component</h3>
                        <p className="text-sm text-muted-foreground font-dev text-transform-tertiary">Active Platform: {platform}</p>
                    </div>
                </CanvasBody.Demo>
            </CanvasBody.Section>
            
            {/* ── 03. RULE SETTINGS / TABLES ─────────────────────── */}
            <CanvasBody.Section label="03 · COMPONENT METRICS">
                 {/* Tables should have their default padding stripped from the Demo frame */}
                <CanvasBody.Demo label="METRIC TABLE" centered={false} minHeight="min-h-0" className="p-0 overflow-hidden">
                    <div className="bg-layer-dialog font-dev text-transform-tertiary text-xs text-muted-foreground p-6 text-center">
                        [ Mount Genesis Data Table Here ]
                    </div>
                </CanvasBody.Demo>
            </CanvasBody.Section>
        </>
    );
};
```
