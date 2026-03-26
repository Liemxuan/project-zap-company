'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { Tabs, TabItem } from '../../../../../genesis/atoms/interactive/Tabs';
import { TypographyWildPreview } from '../../../../../zap/sections/atoms/typography/wild-preview';
import { TypographyBody } from '../../../../../zap/sections/atoms/typography/body';
import { TypographyInspector, TypographyTemplate } from '../../../../../zap/sections/atoms/typography/inspector';
import { TypographyPlaygroundShell } from '../../../../../zap/sections/atoms/typography/playground-shell';
import { ALL_THEMES, TypographyThemeSchema } from '../../../../../zap/sections/atoms/typography/schema';
import { Canvas } from '../../../../../genesis/atoms/surfaces/canvas';
import { Wrapper } from '../../../../../components/dev/Wrapper';

const TYPOGRAPHY_TABS: TabItem[] = [
  { id: 'preview', label: 'LIVE PREVIEW' },
  { id: 'details', label: 'FONT DETAILS' },
  { id: 'playground', label: 'PLAYGROUND' },
];

export default function ZapTypographyPage() {
  const [activeTab, setActiveTab] = useState<string>('preview');

  // Playground state
  const [activeTemplate, setActiveTemplate] = useState<TypographyTemplate>('basic');
  const [customThemes, setCustomThemes] = useState<Record<string, TypographyThemeSchema>>({});

  const currentThemeData = customThemes[activeTemplate] || ALL_THEMES.find(t => t.id === activeTemplate) || ALL_THEMES[0];

  const handleUpdateTheme = (updatedTheme: TypographyThemeSchema) => {
    setCustomThemes(prev => ({ ...prev, [activeTemplate]: updatedTheme }));
  };

  const breadcrumbs = [
    { label: 'SYSTEMS' },
    { label: 'CORE' },
    { label: 'TYPOGRAPHY', active: true }
  ];

  return (
    <MasterVerticalShell
      breadcrumbs={breadcrumbs}
      inspectorTitle="Stylization Engine"
      inspectorContent={
        <TypographyInspector
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
        />
      }
    >
      <Wrapper
        identity={{
          displayName: "TypographyPage (L1)",
          filePath: "zap/atoms/typography/page.tsx",
          type: "Template/Canvas",
          architecture: "L1: CANVAS"
        }}
      >
        <Canvas
          className="transition-all duration-300 origin-center min-h-full flex flex-col pt-0"
        >
          {/* GLOBAL HEADER WRAPPING TABS & BACKGROUND */}
          <div className="relative w-full border-b-[3px] border-brand-midnight flex flex-col bg-layer-canvas overflow-hidden">
            {/* Dotted Background */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[radial-gradient(circle,var(--color-brand-midnight)_1.5px,transparent_1.5px)] [background-size:16px_16px] [background-position:center]" />

            <Wrapper title="Global Header">
              <Wrapper title="Header Title Block">
                <div className="relative z-10 w-full flex justify-between items-end px-12 pt-12 pb-8">
                  <Wrapper title="Typography Title" className="w-auto">
                    <div className="flex flex-col items-start pl-2">
                      <h1 className="text-[64px] font-black uppercase tracking-tighter text-brand-midnight leading-[0.8] mb-3 [text-shadow:4px_4px_0px_var(--color-brand-yellow)]">
                        {activeTab === 'preview' && activeTemplate === 'fun' ? 'FUN MODE' : null}
                        {activeTab === 'preview' && activeTemplate !== 'fun' ? 'WILD MODE' : null}
                        {activeTab === 'details' && 'TYPOGRAPHY'}
                        {activeTab === 'playground' && 'PLAYGROUND'}
                      </h1>
                      <div className="bg-brand-midnight text-white px-3 py-1.5 text-[13px] font-bold uppercase tracking-wide">
                        {activeTab === 'preview' && 'EXPERIMENTAL TYPOGRAPHY PREVIEW'}
                        {activeTab === 'details' && 'FOUNDATIONAL TYPE SYSTEM (LEVEL 1)'}
                        {activeTab === 'playground' && 'STYLIZATION LAB'}
                      </div>
                    </div>
                  </Wrapper>

                  <Wrapper title="Live Status Indicator" className="w-auto">
                    <div className="flex items-center gap-2 pr-2">
                      {activeTab === 'preview' && (
                        <>
                          <motion.div
                            animate={{ opacity: [1, 0.4, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                            className="w-3.5 h-3.5 rounded-full bg-red-500 border-2 border-brand-midnight"
                          />
                          <span className="text-[11px] font-black uppercase text-brand-midnight tracking-widest">LIVE PREVIEW</span>
                        </>
                      )}
                    </div>
                  </Wrapper>
                </div>
              </Wrapper>

              <Wrapper title="Header Tabs">
                <div className="relative z-10 px-12 pb-0">
                  <Tabs
                    tabs={TYPOGRAPHY_TABS}
                    activeTab={activeTab}
                    onChange={setActiveTab}
                    className="w-full"
                  />
                </div>
              </Wrapper>
            </Wrapper>
          </div>

          <div className="p-12 flex-1 w-full flex flex-col items-center">
            {activeTab === 'preview' && <TypographyWildPreview themeData={currentThemeData} />}

            {activeTab === 'details' && <TypographyBody themeData={currentThemeData} />}

            {activeTab === 'playground' && (
              <div className="w-full max-w-5xl mx-auto">
                <TypographyPlaygroundShell
                  key={currentThemeData.id}
                  initialTheme={currentThemeData}
                  onUpdateGlobalTheme={handleUpdateTheme}
                />
              </div>
            )}
          </div>
        </Canvas>
      </Wrapper>
    </MasterVerticalShell>
  );
}
