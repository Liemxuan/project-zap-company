import type { Metadata } from "next";
import localFont from 'next/font/local';
import "./globals.css";
import * as fs from 'fs';
import * as path from 'path';

// 1. Core UI Font (Readable)
const inter = localFont({
  src: '../../public/fonts/inter-latin.woff2',
  variable: '--font-inter',
  display: 'swap',
});

// 2. Brand Font (Headers)
const spaceGrotesk = localFont({
  src: '../../public/fonts/space-grotesk-latin.woff2',
  variable: '--font-space-grotesk',
  display: 'swap',
});

// 3. Technical Data Font (Code, Logs)
const jetbrainsMono = localFont({
  src: '../../public/fonts/jetbrains-mono-latin.woff2',
  variable: '--font-jetbrains',
  display: 'swap',
});

// 4. Playful Google Fonts
import { Roboto, Playfair_Display, Bricolage_Grotesque, Comic_Neue, Pacifico, Geist, Syncopate, Space_Mono } from 'next/font/google';

const roboto = Roboto({
  weight: ['400', '500', '700', '900'],
  subsets: ['latin'],
  variable: '--font-roboto',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const bricolage = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-bricolage',
  display: 'swap',
});

const comicNeue = Comic_Neue({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-comic-neue',
  display: 'swap',
});

const pacifico = Pacifico({
  weight: ['400'],
  subsets: ['latin'],
  variable: '--font-pacifico',
  display: 'swap',
});

const syncopate = Syncopate({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-syncopate',
  display: 'swap',
});

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "ZAP Design Engine",
  description: "The 7-Level Atomic React Factory for ZAP OS",
};

import { ThemeProvider } from '../components/ThemeContext';
import { ThemeManager } from '../components/ThemeManager';
import { TooltipProvider } from '../genesis/atoms/interactive/tooltip';
import { Toaster } from '../genesis/atoms/interactive/sonner';
import { cn } from '../lib/utils';

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' });


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  let initialCss = '';

  try {
    const settingsDir = path.join(process.cwd(), '.zap-settings');
    
    // Load Colors for all available themes
    const settingsFiles = fs.existsSync(settingsDir) ? fs.readdirSync(settingsDir) : [];
    const colorFiles = settingsFiles.filter(f => f.startsWith('colors-') && f.endsWith('.json'));
    
    for (const file of colorFiles) {
      const colorsPath = path.join(settingsDir, file);
      if (fs.existsSync(colorsPath)) {
        const colorsRaw = fs.readFileSync(colorsPath, 'utf-8');
        try {
          const colorsData = JSON.parse(colorsRaw);
          if (colorsData.cssOutput) {
            initialCss += '\n' + colorsData.cssOutput;
          }
        } catch (e) {
          console.error(`Failed to parse ${file}:`, e);
        }
      }
    }

    // Load Typography for all themes
    const typoFiles = settingsFiles.filter(f => f.startsWith('typography-') && f.endsWith('.json'));
    for (const file of typoFiles) {
      const typoPath = path.join(settingsDir, file);
      const themeId = file.replace('typography-', '').replace('.json', '');
      
      let typoData: Record<string, string> | null = null;
      if (fs.existsSync(typoPath)) {
        const typoRaw = fs.readFileSync(typoPath, 'utf-8');
        try {
          typoData = JSON.parse(typoRaw);
        } catch (e) {
          console.error(`Failed to parse ${file}:`, e);
        }
      }
  
      if (typoData) {
        // If it's old format, inject CSS. If it's new theme.json format, it might already have cssOutput, but let's assume it needs construction.
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

    // Load Geometry for all themes
    const geoFiles = settingsFiles.filter(f => f.startsWith('geometry-') && f.endsWith('.json') || f.startsWith('border_radius-') || f.startsWith('spacing-') || f.startsWith('elevation-'));
    for (const file of geoFiles) {
      const geoPath = path.join(settingsDir, file);
      if (fs.existsSync(geoPath)) {
        const geoRaw = fs.readFileSync(geoPath, 'utf-8');
        try {
          const geoData = JSON.parse(geoRaw);
          if (geoData.cssOutput) {
            initialCss += '\n' + geoData.cssOutput;
          }
        } catch (e) {
          console.error(`Failed to parse ${file}:`, e);
        }
      }
    }
  } catch (e) {
    console.error("Failed to load initial theme settings for SSR:", e);
  }

    // Set to true to enable neon L0-L5 layer diagnostic colors
    const TEST_DIAGNOSTIC_MODE = false;

  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans theme-metro", geist.variable)} data-zap-theme="metro">
      <head>
        {/* Material Symbols loaded entirely locally via globals.css @font-face */}
        {initialCss && <style id="m3-dynamic-theme" dangerouslySetInnerHTML={{ __html: initialCss }} />}
      </head>
      <body
        className={cn(
          `${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable} ${roboto.variable} ${playfair.variable} ${bricolage.variable} ${comicNeue.variable} ${pacifico.variable} ${syncopate.variable} ${spaceMono.variable} antialiased`,
          TEST_DIAGNOSTIC_MODE && "theme-diagnostic"
        )}
        suppressHydrationWarning
      >
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
