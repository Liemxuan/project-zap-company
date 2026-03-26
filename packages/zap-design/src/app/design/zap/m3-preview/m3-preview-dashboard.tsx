"use client";

import React, { useState, useEffect } from 'react';
import {
  themeFromSourceColor,
  hexFromArgb,
  argbFromHex
} from "@material/material-color-utilities";
import { Copy } from "lucide-react";

const INITIAL_SEED = "#DFFF00"; // ZAP Acid Yellow

// The standard M3 tonal steps
const TONES = [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 95, 99, 100];

export function M3PreviewDashboard() {
  const [seedColor, setSeedColor] = useState(INITIAL_SEED);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [palettes, setPalettes] = useState<any>(null);

  useEffect(() => {
    try {
      // Validate hex
      if (/^#[0-9A-F]{6}$/i.test(seedColor)) {
        const argb = argbFromHex(seedColor);
        const theme = themeFromSourceColor(argb);
        setTimeout(() => setPalettes(theme.palettes), 0);
      }
    } catch (e) {
      console.error("Invalid color generation", e);
    }
  }, [seedColor]);

  if (!palettes) return <div className="p-8">Loading HCT Engine...</div>;

  return (
    <div className="space-y-12">
      {/* 1. Generator Controls */}
      <section className="bg-card border border-border rounded-xl p-8 shadow-sm">
        <h2 className="text-2xl font-semibold mb-6 flex items-center gap-3">
          1. Seed Configuration
        </h2>
        <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">Base Brand Color</label>
            <div className="flex items-center gap-3">
              <input
                type="color"
                value={seedColor}
                onChange={(e) => setSeedColor(e.target.value)}
                className="w-14 h-14 rounded cursor-pointer border-0 p-0"
              />
              <input
                type="text"
                value={seedColor.toUpperCase()}
                onChange={(e) => setSeedColor(e.target.value)}
                className="h-14 px-4 font-dev text-transform-tertiary text-lg border border-border rounded-lg bg-background w-32 focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={7}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground max-w-xl pb-2">
            The ZAP engine takes this single HEX value, converts it to the mathematical HCT (Hue, Chroma, Tone) space, and calculates the exact tonal palettes below to ensure perfect accessibility constraints.
          </p>
        </div>
      </section>

      {/* 2. Tonal Palettes (The Math) */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold border-b border-border pb-4">
          2. Raw HCT Tonal Palettes
        </h2>
        <div className="grid grid-cols-1 gap-8">
          <PaletteRow name="Primary" palette={palettes.primary} />
          <PaletteRow name="Secondary" palette={palettes.secondary} />
          <PaletteRow name="Tertiary" palette={palettes.tertiary} />
          <PaletteRow name="Error" palette={palettes.error} />
          <PaletteRow name="Neutral (Surfaces)" palette={palettes.neutral} />
          <PaletteRow name="Neutral Variant (Outlines)" palette={palettes.neutralVariant} />
        </div>
      </section>

      {/* 3. Component Preview (Simulated CSS Application) */}
      <section className="space-y-6 pt-8 pb-32">
        <h2 className="text-2xl font-semibold border-b border-border pb-4">
          3. Live Component Mapping (ZAP Tokens)
        </h2>
        <p className="text-muted-foreground mb-6">
          This simulates how the M3 mathematical tones structure the UI hierarchy.
          Containers use Tone 90. Text on those containers uses Tone 10 (guaranteeing a {"3:1"} contrast ratio).
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <MockCard
            title="Primary Container Action"
            bgTone={palettes.primary.tone(90)}
            textTone={palettes.primary.tone(10)}
            label="primary-container"
          />
          <MockCard
            title="Secondary Reference"
            bgTone={palettes.secondary.tone(90)}
            textTone={palettes.secondary.tone(10)}
            label="secondary-container"
          />
          <MockCard
            title="Destructive Action"
            bgTone={palettes.error.tone(90)}
            textTone={palettes.error.tone(10)}
            label="error-container"
          />
          <MockCard
            title="Highest Surface"
            bgTone={palettes.neutral.tone(90)}
            textTone={palettes.neutral.tone(10)}
            label="surface-container-highest"
          />
          <MockCard
            title="Variant Surface"
            bgTone={palettes.neutralVariant.tone(90)}
            textTone={palettes.neutralVariant.tone(30)}
            label="surface-variant"
          />
        </div>
      </section>
    </div>
  );
}

// Sub-component: The horizontal color strip for a given palette
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PaletteRow({ name, palette }: { name: string; palette: any }) {
  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-lg text-foreground">{name}</h3>
      <div className="flex w-full h-24 rounded-lg overflow-hidden border border-border shadow-[inset_0_1px_4px_rgba(0,0,0,0.1)]">
        {TONES.map(tone => {
          const hex = hexFromArgb(palette.tone(tone));
          // White text below 60 tone for contrast
          const isDark = tone < 60;
          return (
            <div
              key={tone}
              className="flex-1 flex items-end justify-center pb-2 relative group cursor-pointer hover:flex-[1.5] transition-all duration-200"
              style={{ backgroundColor: hex }}
              onClick={() => navigator.clipboard.writeText(hex)}
            >
              {/* Tooltip on hover */}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Copy className={`w-4 h-4 ${isDark ? 'text-white/70' : 'text-black/70'}`} />
              </div>
              <div className="flex flex-col items-center">
                <span className={`text-xs font-bold ${isDark ? 'text-white' : 'text-black'}`}>
                  {tone}
                </span>
                <span className={`text-[10px] opacity-70 ${isDark ? 'text-white' : 'text-black'}`}>
                  {hex.toUpperCase()}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Sub-component: Mock Component Card mapped strictly to HCT tones
function MockCard({ title, bgTone, textTone, label }: { title: string; bgTone: number; textTone: number; label: string }) {
  const bgHex = hexFromArgb(bgTone);
  const textHex = hexFromArgb(textTone);

  return (
    <div
      className="p-6 rounded-2xl shadow-sm border border-black/5"
      style={{ backgroundColor: bgHex, color: textHex }}
    >
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-lg">{title}</h4>
 <span className="text-[10px] tracking-wider font-dev text-transform-tertiary opacity-60">
          .{label}
        </span>
      </div>
      <p className="opacity-90 leading-relaxed text-sm">
        This demonstrates the programmatic combination of Tones to satisfy M3 contrast guidelines.
      </p>
      <div className="mt-6 flex items-center gap-3">
        <button
          className="px-5 py-2.5 rounded-full font-semibold text-sm transition-opacity hover:opacity-80"
          style={{ backgroundColor: textHex, color: bgHex }}
        >
          Confirm
        </button>
        <button
          className="px-4 py-2 rounded-full font-medium text-sm transition-opacity hover:opacity-80"
          style={{ color: textHex }}
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
