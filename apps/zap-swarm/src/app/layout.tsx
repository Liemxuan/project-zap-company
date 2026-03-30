import "./globals.css";
import { ReactNode } from "react";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
import * as fs from "fs";
import * as path from "path";

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

export const metadata = {
  title: "ZAP Swarm Command",
  description: "Standalone Swarm Command Center",
};

import { ThemeProvider } from 'zap-design/src/components/ThemeContext';
import { ThemeManager } from 'zap-design/src/components/ThemeManager';
import { TooltipProvider } from 'zap-design/src/genesis/atoms/interactive/tooltip';
import { Toaster } from 'zap-design/src/genesis/atoms/interactive/sonner';
import { SwarmAuthGate } from '../components/SwarmAuthGate';

export default function RootLayout({ children }: { children: ReactNode }) {
  let initialCss = '';

  try {
    const settingsDir = path.join(process.cwd(), '../../packages/zap-design/.zap-settings');
    
    const settingsFiles = fs.existsSync(settingsDir) ? fs.readdirSync(settingsDir) : [];
    const colorFiles = settingsFiles.filter(f => f.startsWith('colors-') && f.endsWith('.json'));
    
    for (const file of colorFiles) {
      const colorsPath = path.join(settingsDir, file);
      if (fs.existsSync(colorsPath)) {
        const colorsRaw = fs.readFileSync(colorsPath, 'utf-8');
        try {
          const colorsData = JSON.parse(colorsRaw);
          if (colorsData.cssOutput) initialCss += '\n' + colorsData.cssOutput;
        } catch (e) {}
      }
    }

    const typoFiles = settingsFiles.filter(f => f.startsWith('typography-') && f.endsWith('.json'));
    for (const file of typoFiles) {
      const typoPath = path.join(settingsDir, file);
      const themeId = file.replace('typography-', '').replace('.json', '');
      
      let typoData: Record<string, string> | null = null;
      if (fs.existsSync(typoPath)) {
        try {
          typoData = JSON.parse(fs.readFileSync(typoPath, 'utf-8'));
        } catch (e) {}
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

    const geoFiles = settingsFiles.filter(f => f.startsWith('geometry-') && f.endsWith('.json') || f.startsWith('border_radius-') || f.startsWith('spacing-') || f.startsWith('elevation-'));
    for (const file of geoFiles) {
      const geoPath = path.join(settingsDir, file);
      if (fs.existsSync(geoPath)) {
        try {
          const geoData = JSON.parse(fs.readFileSync(geoPath, 'utf-8'));
          if (geoData.cssOutput) initialCss += '\n' + geoData.cssOutput;
        } catch (e) {}
      }
    }
  } catch (e) {
    console.error("Failed to load initial theme settings for SSR:", e);
  }

  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} theme-metro`} data-zap-theme="metro" suppressHydrationWarning>
      <head>
        {initialCss && <style id="m3-dynamic-theme" dangerouslySetInnerHTML={{ __html: initialCss }} />}
      </head>
      <body className="antialiased h-screen overflow-hidden bg-layer-base text-on-surface selection:bg-primary/20" suppressHydrationWarning>
        <ThemeProvider>
          <ThemeManager />
          <TooltipProvider>
            <SwarmAuthGate>
              {children}
            </SwarmAuthGate>
          </TooltipProvider>
          <Toaster position="bottom-right" richColors />
        </ThemeProvider>
      </body>
    </html>
  );
}
