'use client';

import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { StatusIndicatorsBody } from '../../../../../zap/sections/atoms/status/body';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function StatusIndicatorsPage() {
    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'CORE' },
                { label: 'STATUS & INDICATORS', active: true }
            ]}
            activeItem="Status & Indicators"
            inspectorTitle="Pill Logic"
            inspectorContent={
                <div className="space-y-6">
                    {/* Pill Logic Card */}
                    <Wrapper identity={{ displayName: "Pill Logic", filePath: "app/debug/zap/atoms/status/page.tsx", type: "Wrapped Snippet", architecture: "SYSTEMS // STATUS" }}>
                        <div className="border border-black p-4 bg-primary/10 space-y-4">
                            <Wrapper className="w-fit" identity={{ displayName: "Inspector Header: Pill Logic", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name="palette" size={16} fill={0} className=" text-primary bg-black p-1" />
                                    <h3 className="text-xs font-black uppercase tracking-tighter">Pill Logic</h3>
                                </div>
                            </Wrapper>
                            <div className="space-y-2">
                                <div className="bg-white border border-black p-3">
                                    <Wrapper identity={{ displayName: "Inspector Subheader: Status Mapping", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                        <p className="text-[10px] font-dev text-transform-tertiary text-slate-500 mb-2 border-b border-slate-200 pb-1">Status Mapping</p>
                                    </Wrapper>
                                    <div className="space-y-2">
                                        {[
                                            { label: 'ACTIVE', value: 'border-[var(--color-state-success)]', color: 'text-[var(--color-state-success)]' },
                                            { label: 'WARNING', value: 'border-[var(--color-state-warning)]', color: 'text-[var(--color-state-warning)]' },
                                            { label: 'ERROR', value: 'border-[var(--color-state-error)]', color: 'text-[var(--color-state-error)]' },
                                            { label: 'INFO', value: 'border-[var(--color-state-info)]', color: 'text-[var(--color-state-info)]' },
                                        ].map((row) => (
                                            <Wrapper key={row.label} identity={{ displayName: `Status Map: ${row.label}`, type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                                <div className="flex justify-between items-center">
                                                    <span className="text-[10px] font-bold text-slate-700">{row.label}</span>
                                                    <span className={`text-[10px] font-dev text-transform-tertiary ${row.color}`}>{row.value}</span>
                                                </div>
                                            </Wrapper>
                                        ))}
                                    </div>
                                </div>
                                <Wrapper identity={{ displayName: "Button: Copy SCSS Map", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                    <button className="w-full text-[10px] font-black uppercase bg-black text-white py-2 border border-black hover:bg-primary hover:text-black transition-colors">
                                        Copy SCSS Map
                                    </button>
                                </Wrapper>
                            </div>
                        </div>
                    </Wrapper>

                    {/* Avatar Scaling Card */}
                    <Wrapper identity={{ displayName: "Avatar Scaling", filePath: "app/debug/zap/atoms/status/page.tsx", type: "Wrapped Snippet", architecture: "SYSTEMS // STATUS" }}>
                        <div className="border border-black p-4 space-y-4">
                            <Wrapper className="w-fit" identity={{ displayName: "Inspector Header: Avatar Scaling", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                <div className="flex items-center gap-2 mb-2">
                                    <Icon name="photo_size_select_large" size={16} />
                                    <h3 className="text-xs font-black uppercase tracking-tighter">Avatar Scaling</h3>
                                </div>
                            </Wrapper>
                            <div className="space-y-3">
                                {[
                                    { icon: 'face', label: 'Profile Large', size: '64px' },
                                    { icon: 'account_circle', label: 'Card Header', size: '48px' },
                                    { icon: 'person', label: 'Inline / Table', size: '32px' },
                                ].map((row) => (
                                    <Wrapper key={row.label} identity={{ displayName: `Avatar Size: ${row.label}`, type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                        <div className="flex items-center justify-between p-2 border border-black bg-zinc-50">
                                            <div className="flex items-center gap-2">
                                                <Icon name={row.icon} size={16} className=" text-slate-500" />
                                                <span className="text-[11px] font-bold">{row.label}</span>
                                            </div>
                                            <span className="text-[10px] font-dev text-transform-tertiary bg-white border border-black px-1">{row.size}</span>
                                        </div>
                                    </Wrapper>
                                ))}
                            </div>
                            <Wrapper identity={{ displayName: "Inspector Text: Avatar Scaling Description", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                <p className="text-[11px] text-slate-500 leading-tight mt-2 font-sans">
                                    Avatars maintain a fixed aspect ratio of 1:1. Border-radius is always 100%.
                                </p>
                            </Wrapper>
                        </div>
                    </Wrapper>

                    {/* CTA */}
                    <Wrapper identity={{ displayName: "Fallback Logic CTA", filePath: "app/debug/zap/atoms/status/page.tsx", type: "Wrapped Snippet", architecture: "SYSTEMS // STATUS" }}>
                        <div className="bg-black text-white border border-black p-4">
                            <Wrapper className="w-fit mb-2 block" identity={{ displayName: "CTA Question Text", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                <p className="text-[11px] font-bold italic">&quot;Is the image failing to load?&quot;</p>
                            </Wrapper>
                            <Wrapper className="w-fit" identity={{ displayName: "Link: Check Fallback Logic", type: "Wrapped Snippet", filePath: "app/debug/zap/atoms/status/page.tsx" }}>
                                <a className="text-[10px] font-black uppercase text-primary underline underline-offset-4" href="#">
                                    Check Fallback Logic
                                </a>
                            </Wrapper>
                        </div>
                    </Wrapper>
                </div>
            }
        >
            <StatusIndicatorsBody />
        </MasterVerticalShell>
    );
}
