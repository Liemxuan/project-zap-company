import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono, Pacifico } from "next/font/google";
import fs from "fs";
import path from "path";
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

const pacifico = Pacifico({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-pacifico",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ZAP Merchant Hub",
  description: "Digital Workspace for Merchants",
};

/**
 * 0-Flicker SSR Theme Hydration
 * Reads the literal compiled theme.json payload from the core engine to ensure
 * downstream apps perfectly mirror the active Sandbox.
 */
function getActiveThemeMetrics(theme: string = 'METRO'): React.CSSProperties {
  try {
    const themePath = path.join(process.cwd(), '../../packages/zap-design/src/themes', theme.toUpperCase(), 'theme.json');
    if (fs.existsSync(themePath)) {
      const data = JSON.parse(fs.readFileSync(themePath, 'utf-8'));
      if (data.metrics) {
        const styles: Record<string, string> = {};
        for (const [key, value] of Object.entries(data.metrics)) {
          if (typeof value === 'string') {
            // Convert camelCase to kebab-case payload (e.g. merchantRadius -> --merchant-radius)
            const kebab = key.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
            styles[`--${kebab}`] = value.replace(' !important', '');
          }
        }
        return styles as React.CSSProperties;
      }
    }
  } catch (error) {
    console.warn(`[ MERCHANT APP ] SSR Theme Read Failed for ${theme}:`, error);
  }
  return {};
}

import { ThemeProvider } from "zap-design/src/components/ThemeContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Pull the active theme configuration
  const themeMetrics = getActiveThemeMetrics('METRO');

  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} ${pacifico.variable} h-full antialiased theme-metro`}
      style={themeMetrics}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
