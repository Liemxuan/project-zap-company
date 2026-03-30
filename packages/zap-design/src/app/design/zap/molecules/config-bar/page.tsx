'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { ConfigBar } from '../../../../../genesis/molecules/forms/ConfigBar';

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
            <div className="flex flex-col gap-8 p-6">
                <div className="space-y-4">
                    <h3 className="text-labelLarge text-on-surface font-display">Interactive</h3>
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
            </div>
        </ComponentSandboxTemplate>
    );
}
