'use client';

import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { IconographyBody } from '../../../../../zap/sections/atoms/icons/body';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function IconographyPage() {
    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'CORE' },
                { label: 'ICONOGRAPHY', active: true }
            ]}
            activeItem="Iconography"
            inspectorTitle="Icon Implementation"
            inspectorContent={
                <div className="space-y-6">
                    {/* Icon Implementation - Local Font Card */}
                    <Wrapper identity={{ displayName: "Inspector: Font Implementation", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/icons/page.tsx" }}>
                        <div className="border border-black p-4 bg-primary/10 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon name="code" size={16} fill={0} className=" text-primary bg-black p-1" />
                                <h3 className="text-xs font-black uppercase tracking-tighter">Icon Implementation</h3>
                            </div>
                            <div className="space-y-2">
                                <div className="bg-white border border-black p-2">
                                    <p className="text-[10px] font-dev text-transform-tertiary text-slate-500 mb-1">LOCAL VARIABLE FONT</p>
                                    <code className="text-[10px] break-all block text-slate-800">
                                        /public/icons/material-symbols-outlined-variable.woff2
                                    </code>
                                </div>
                                <div className="bg-zinc-100 border border-black p-2">
                                    <p className="text-[10px] font-dev text-transform-tertiary text-slate-500 mb-1">CSS DEFINITION</p>
                                    <code className="text-[9px] leading-tight block text-slate-800 whitespace-pre">
                                        {`@font-face {
  font-family: "Material Symbols Outlined";
  src: url("/icons/material-symbols-outlined-variable.woff2");
}`}
                                    </code>
                                </div>
                            </div>
                        </div>
                    </Wrapper>

                    {/* Styling Rules Card */}
                    <Wrapper identity={{ displayName: "Inspector: Styling Rules", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/icons/page.tsx" }}>
                        <div className="border border-black p-4 space-y-4">
                            <div className="flex items-center gap-2 mb-2">
                                <Icon name="palette" size={16} />
                                <h3 className="text-xs font-black uppercase tracking-tighter">Styling Rules</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="p-2 border border-black bg-zinc-50 text-center">
 <span className="block text-[10px] font-dev text-transform-tertiary text-slate-500 ">Weight</span>
                                    <span className="block text-lg font-black">400</span>
                                </div>
                                <div className="p-2 border border-black bg-zinc-50 text-center">
 <span className="block text-[10px] font-dev text-transform-tertiary text-slate-500 ">Optical</span>
                                    <span className="block text-lg font-black">24px</span>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <p className="text-[10px] font-bold uppercase mb-1">Color Tokens</p>
                                <div className="flex items-center justify-between text-xs border-b border-dashed border-slate-300 pb-1">
                                    <span className="text-slate-500">Default</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-900 border border-black"></div>
                                        <span>text-slate-900</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs border-b border-dashed border-slate-300 pb-1">
                                    <span className="text-slate-500">Interactive</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-primary border border-black"></div>
                                        <span>text-primary</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between text-xs">
                                    <span className="text-slate-500">Disabled</span>
                                    <div className="flex items-center gap-2">
                                        <div className="w-3 h-3 bg-slate-300 border border-black"></div>
                                        <span>text-slate-300</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Wrapper>

                    {/* Technical Specs */}
                    <Wrapper identity={{ displayName: "Inspector: Technical Specs", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/icons/page.tsx" }}>
                        <div className="border border-black p-4 space-y-3">
                            <h3 className="text-xs font-black uppercase tracking-tighter mb-4 border-b border-black pb-2">Technical Specs</h3>
                            {[
                                { label: 'Library', value: 'Material Symbols' },
                                { label: 'Style', value: 'Outlined' },
                                { label: 'Fill', value: '0 (None)' },
                                { label: 'Format', value: 'SVG / WOFF2' },
                            ].map((row) => (
                                <div key={row.label} className="flex justify-between items-center text-[11px]">
                                    <span className="text-slate-500">{row.label}</span>
                                    <span className="font-bold">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </Wrapper>

                    {/* Custom Request CTA */}
                    <Wrapper identity={{ displayName: "Inspector: Action CTA", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/icons/page.tsx" }}>
                        <div className="bg-black text-white border border-black p-4">
                            <p className="text-[11px] font-bold italic mb-2">&quot;Need a custom icon that isn&apos;t in the library?&quot;</p>
                            <a className="text-[10px] font-black uppercase text-primary underline underline-offset-4" href="#">Submit Request</a>
                        </div>
                    </Wrapper>
                </div>
            }
        >
            <IconographyBody />
        </MasterVerticalShell>
    );
}
