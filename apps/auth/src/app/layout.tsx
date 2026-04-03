import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import * as fs from 'fs';
import * as path from 'path';
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZAP Auth | User Vault",
  description: "User Vault Master Authentication for ZAP OS",
};

import { ThemeProvider } from 'zap-design/src/components/ThemeContext';
import { ThemeManager } from 'zap-design/src/components/ThemeManager';
import { TooltipProvider } from 'zap-design/src/genesis/atoms/interactive/tooltip';
import { Toaster } from 'zap-design/src/genesis/atoms/interactive/sonner';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialCss = '';

  try {
    const settingsDir = path.join(process.cwd(), '../../packages/zap-design/.zap-settings');

    // Load Typography for all themes
    const settingsFiles = fs.existsSync(settingsDir) ? fs.readdirSync(settingsDir) : [];

    // SSR Colors
    const colorFiles = settingsFiles.filter(f => f.startsWith('colors-') && f.endsWith('.json'));
    for (const file of colorFiles) {
      const colorsPath = path.join(settingsDir, file);
      if (fs.existsSync(colorsPath)) {
        try {
          const colorsData = JSON.parse(fs.readFileSync(colorsPath, 'utf-8'));
          if (colorsData.cssOutput) initialCss += '\n' + colorsData.cssOutput;
        } catch (e) { }
      }
    }

    // SSR Typography
    const typoFiles = settingsFiles.filter(f => f.startsWith('typography-') && f.endsWith('.json'));
    for (const file of typoFiles) {
      const typoPath = path.join(settingsDir, file);
      const themeId = file.replace('typography-', '').replace('.json', '');

      let typoData: Record<string, string> | null = null;
      if (fs.existsSync(typoPath)) {
        const typoRaw = fs.readFileSync(typoPath, 'utf-8');
        try {
          typoData = JSON.parse(typoRaw);
        } catch (e) { }
      }

      if (typoData) {
        const typoVarsCss = `
          [data-zap-theme="${themeId}"] {
            --heading-transform: ${typoData.primaryTransform || 'none'};
            --body-transform: ${typoData.secondaryTransform || 'none'};
            --dev-transform: ${typoData.tertiaryTransform || 'none'};
            --font-display: ${typoData.primaryFont || 'var(--font-space-grotesk)'};
            --font-body: ${typoData.secondaryFont || 'var(--font-inter)'};
            --font-dev: ${typoData.tertiaryFont || 'var(--font-jetbrains)'};
          }
        `;
        initialCss += '\n' + typoVarsCss;
      }
    }

    // SSR Geometry (border-radius, spacing, elevation)
    const geoFiles = settingsFiles.filter(f => f.startsWith('geometry-') && f.endsWith('.json') || f.startsWith('border_radius-') || f.startsWith('spacing-') || f.startsWith('elevation-'));
    for (const file of geoFiles) {
      const geoPath = path.join(settingsDir, file);
      if (fs.existsSync(geoPath)) {
        try {
          const geoData = JSON.parse(fs.readFileSync(geoPath, 'utf-8'));
          if (geoData.cssOutput) initialCss += '\n' + geoData.cssOutput;
        } catch (e) { }
      }
    }
  } catch (e) {
    console.error("Failed to load SSR typography settings:", e);
  }

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased theme-metro font-sans`}
      data-zap-theme="metro"
      suppressHydrationWarning
    >
      <head>
        {initialCss && <style id="m3-dynamic-theme" dangerouslySetInnerHTML={{ __html: initialCss }} />}
      </head>
      <body className="antialiased h-screen overflow-hidden bg-layer-base text-on-surface selection:bg-primary/20" suppressHydrationWarning>
        <ThemeProvider>
          <ThemeManager />
          <TooltipProvider>
            {children}
          </TooltipProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
