'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { ConfigBar } from '../../../../../genesis/molecules/forms/ConfigBar';
import { CanvasBody } from '../../../../../zap/layout/CanvasBody';
import { SectionHeader } from '../../../../../zap/sections/SectionHeader';

export default function ConfigBarPage() {
    const [isDark, setIsDark] = useState(false);
    const [lang, setLang] = useState('🇺🇸 EN');
    const languages = ['🇺🇸 EN', '🇻🇳 VI', '🇫🇷 FR', '🇯🇵 JA'];

    const cycleLang = () => {
        const idx = (languages.indexOf(lang) + 1) % languages.length;
        setLang(languages[idx]);
    };

    return (
        <ComponentSandboxTemplate
            componentName="Config Bar"
            tier="L4 MOLECULE"
            status="Verified"
            filePath="genesis/molecules/forms/ConfigBar.tsx"
            importPath="@/genesis/molecules/forms/ConfigBar"
        >
            <CanvasBody flush={false}>
                <CanvasBody.Section>
                    <SectionHeader number="1" id="config-bar" title="Config Bar Sandbox" description="Interactive components for Config Bar" icon="widgets" />
                    <CanvasBody.Demo className="flex flex-col gap-8 p-6">
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display text-transform-primary">Interactive</h3>
                    <ConfigBar
                        activeLang={lang}
                        onCycleLang={cycleLang}
                        isDarkMode={isDark}
                        onToggleTheme={() => setIsDark(!isDark)}
                    />
                    <p className="text-bodySmall text-on-surface-variant">
                        Lang: {lang} | Theme: {isDark ? 'Dark' : 'Light'}
                    </p>
                </div>
                </CanvasBody.Demo>
                </CanvasBody.Section>
            </CanvasBody>
        
        </ComponentSandboxTemplate>
    );
}
