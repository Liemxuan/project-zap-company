import type { Metadata } from "next";
import { Space_Grotesk, Inter, JetBrains_Mono } from "next/font/google";
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
  return (
    <html
      lang="en"
      className={`${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable} h-full antialiased theme-core font-sans`}
      data-zap-theme="core"
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
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
