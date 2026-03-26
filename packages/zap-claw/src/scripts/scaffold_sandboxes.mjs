import fs from 'fs';
import path from 'path';

const targets = [
    { name: 'Canvas', exportName: 'Canvas', file: 'surfaces/canvas', route: 'canvas' },
    { name: 'Card', exportName: 'Card', file: 'surfaces/card', route: 'card' },
    { name: 'Panel', exportName: 'Panel', file: 'surfaces/panel', route: 'panel' },
    { name: 'Toggle', exportName: 'Toggle', file: 'interactive/Toggle', route: 'toggle' },
    { name: 'Select', exportName: 'Select', file: 'interactive/Select', route: 'select' },
    { name: 'SearchInput', exportName: 'SearchInput', file: 'interactive/SearchInput', route: 'search-input' },
    { name: 'Badge', exportName: 'Badge', file: 'status/badges', route: 'badge' },
    { name: 'Pill', exportName: 'Pill', file: 'status/pills', route: 'pill' },
    { name: 'Avatar', exportName: 'Avatar', file: 'status/avatars', route: 'avatar' },
    { name: 'StatusDot', exportName: 'StatusDot', file: 'status/indicators', route: 'indicator' },
    { name: 'AccordionItem', exportName: 'AccordionItem', file: 'layout/AccordionItem', route: 'accordion' }
];

const BASE_DIR = '/Users/zap/Workspace/olympus/packages/zap-design/src/app/design/zap/atoms';

const template = (target) => `
'use client';

import React, { useState } from 'react';
import { ComponentSandboxTemplate } from '@/zap/layout/ComponentSandboxTemplate';
import { Wrapper } from '@/components/dev/Wrapper';
// import { ${target.exportName} } from '@/genesis/atoms/${target.file}';
import { Slider } from '@/components/ui/slider';

export default function ${target.name}SandboxPage() {
    const [height, setHeight] = useState([40]);
    const [borderWidth, setBorderWidth] = useState([1]);
    const [borderRadius, setBorderRadius] = useState([8]);
    
    const inspectorControls = (
        <Wrapper identity={{ displayName: "Inspector Controls Container", type: "Container", filePath: "zap/atoms/${target.route}/page.tsx" }}>
            <div className="space-y-4">
                <Wrapper identity={{ displayName: "${target.name} Structural Settings", type: "Docs Link", filePath: "zap/atoms/${target.route}/page.tsx" }}>
                    <div className="space-y-6">
                        <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider uppercase">Sandbox Variables</h4>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--${target.route}-height</span>
                                    <span className="font-bold">{height[0]}px</span>
                                </div>
                                <Slider value={height} onValueChange={setHeight} min={16} max={128} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--${target.route}-border-width</span>
                                    <span className="font-bold">{borderWidth[0]}px</span>
                                </div>
                                <Slider value={borderWidth} onValueChange={setBorderWidth} min={0} max={8} step={1} className="w-full" />
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-center text-[10px] font-dev text-transform-tertiary text-muted-foreground uppercase">
                                    <span>--${target.route}-border-radius</span>
                                    <span className="font-bold">{borderRadius[0]}px</span>
                                </div>
                                <Slider value={borderRadius} onValueChange={setBorderRadius} min={0} max={64} step={1} className="w-full" />
                            </div>
                        </div>
                    </div>
                </Wrapper>
            </div>
        </Wrapper>
    );

    const handlePublish = async () => {
        alert(\`${target.name} structural parameters successfully saved.\\n\\nHeight: \${height[0]}px\\nBorder: \${borderWidth[0]}px\\nRadius: \${borderRadius[0]}px\`);
    };

    const inspectorFooter = (
        <Wrapper identity={{ displayName: "Theme Publisher", type: "Publish Action", filePath: "zap/atoms/${target.route}/page.tsx" }}>
            <div className="w-full flex flex-col gap-3">
                <button
                    onClick={handlePublish}
                    className="group relative w-full overflow-hidden rounded bg-primary p-3 transition-all hover:translate-y-[-2px] active:translate-y-0 shadow-lg hover:shadow-primary/20"
                >
                    <span className="relative z-10 font-black text-on-primary uppercase tracking-widest text-[11px]">Publish to Global Source</span>
                    <div className="absolute inset-0 translate-y-[100%] bg-on-primary/10 transition-transform group-hover:translate-y-0" />
                </button>
            </div>
        </Wrapper>
    );

    return (
        <ComponentSandboxTemplate
            componentName="${target.name}"
            tier="L3 ATOM"
            status="Refactored (M3)"
            filePath="src/genesis/atoms/${target.file}.tsx"
            importPath="@/genesis/atoms/${target.file}"
            inspectorControls={inspectorControls}
            inspectorFooter={inspectorFooter}
            foundationInheritance={{
                colorTokens: ['--md-sys-color-primary'],
                typographyScales: ['--font-body']
            }}
            platformConstraints={{
                web: "N/A",
                mobile: "N/A"
            }}
            foundationRules={[
                "Arbitrary Token Syntax Only."
            ]}
        >
            <div 
                className="w-full space-y-12 animate-in fade-in duration-500 pb-16"
                style={{
                    '--card-border-width': \`\${borderWidth[0]}px\`,
                    '--input-border-width': \`\${borderWidth[0]}px\`,
                    '--rounded-card': \`\${borderRadius[0]}px\`,
                    '--rounded-btn': \`\${borderRadius[0]}px\`,
                    '--rounded-input': \`\${borderRadius[0]}px\`
                }}
            >
                <div className="p-12 border border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center gap-4 text-muted-foreground w-full">
                   {/* To be replaced with actual component import later */}
                   <span className="font-display font-medium">Sandbox Mounted</span>
                   <span className="text-xs font-mono">Dynamically mapped to CSS Properties (Border: {borderWidth[0]}px, Radius: {borderRadius[0]}px)</span>
                </div>
            </div>
        </ComponentSandboxTemplate>
    );
}

`;

for (const target of targets) {
    const dir = path.join(BASE_DIR, target.route);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
    const file = path.join(dir, 'page.tsx');
    fs.writeFileSync(file, template(target));
    console.log("Created sandbox for " + target.name + " at " + file);
}
