'use client';

import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { InteractiveElementsBody } from '../../../../../zap/sections/atoms/interactive/body';

import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function InteractiveElementsPage() {

    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'CORE' },
                { label: 'INTERACTIVE ELEMENTS', active: true }
            ]}
            activeItem="Interactive Elements"
            inspectorTitle="Button States"
            inspectorContent={
                <div className="space-y-6">
                    {/* Button States */}
                    <div className="space-y-4">
                        {/* Hover State */}
                        <Wrapper identity={{ displayName: "Hover State", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/interactive/page.tsx" }}>
                            <div className="border border-black p-4 bg-white shadow-[2px_2px_0px_0px_black] space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <h4 className="text-label-small font-black uppercase tracking-widest">Hover</h4>
                                </div>
                                <p className="text-label-small text-slate-500 font-medium leading-relaxed">
                                    Translates toward the viewer by 2px. Background and border may transition. Gives physical pressed feedback.
                                </p>
                                <code className="text-[9px] bg-zinc-50 border border-black/10 px-2 py-1 block font-dev text-transform-tertiary">
                                    translate(-2px, -2px); box-shadow: 2px 2px 0 black;
                                </code>
                            </div>
                        </Wrapper>

                        {/* Active State */}
                        <Wrapper identity={{ displayName: "Active State", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/interactive/page.tsx" }}>
                            <div className="border border-black p-4 bg-white shadow-[2px_2px_0px_0px_black] space-y-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    <h4 className="text-label-small font-black uppercase tracking-widest">Active</h4>
                                </div>
                                <p className="text-label-small text-slate-500 font-medium leading-relaxed">
                                    Provides tactile feedback on click. Background color darkens slightly for visual confirmation.
                                </p>
                                <code className="text-[9px] bg-zinc-50 border border-black/10 px-2 py-1 block font-dev text-transform-tertiary">
                                    translate(0, 0); box-shadow: none;
                                </code>
                            </div>
                        </Wrapper>
                    </div>



                    {/* Technical Specs */}
                    <Wrapper identity={{ displayName: "Specifications", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/interactive/page.tsx" }}>
                        <div className="border border-black p-4 space-y-3">
                            <h3 className="text-label-small font-black uppercase tracking-widest border-b border-black pb-2">Specifications</h3>
                            {[
                                { label: 'Border Radius', value: '0px' },
                                { label: 'Border Weight', value: '1–2px' },
                                { label: 'Shadow', value: '2px 2px black' },
                                { label: 'Font', value: 'Space Grotesk' },
                                { label: 'Min Height', value: '40px' },
                            ].map((row) => (
                                <div key={row.label} className="flex justify-between items-center text-label-medium">
                                    <span className="text-slate-500">{row.label}</span>
                                    <span className="font-black">{row.value}</span>
                                </div>
                            ))}
                        </div>
                    </Wrapper>

                    {/* CTA */}
                    <Wrapper identity={{ displayName: "Form Patterns CTA", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/interactive/page.tsx" }}>
                        <div className="bg-black text-white border border-black p-4">
                            <p className="text-label-medium font-bold italic mb-2">&quot;Using these in a form?&quot;</p>
                            <a className="text-label-small font-black uppercase text-primary underline underline-offset-4" href="#">
                                View Form Patterns →
                            </a>
                        </div>
                    </Wrapper>
                </div>
            }
        >
            <InteractiveElementsBody />
        </MasterVerticalShell>
    );
}
