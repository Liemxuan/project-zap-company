'use client';

import { useTheme } from '../../../../../components/ThemeContext';
import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { ContainerDevWrapper } from '../../../../../components/dev/ContainerDevWrapper';

export default function StitchMagicTestPage() {
    const { devMode } = useTheme();

    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'LAB' },
                { label: 'STITCH MAGIC TEST', active: true }
            ]}
            activeItem="Stitch Magic Test"
            inspectorTitle="The Magic Variables"
            inspectorContent={
                <div className="p-4 space-y-4 text-brand-midnight">
                    <div className="bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border p-4 shadow-card rounded-card">
                        <h4 className="font-bold uppercase text-label-small mb-2">The ZAP Bridge</h4>
                        <p className="text-label-medium font-medium leading-relaxed">
                            This page exists to prove a concept against actual Stitch prototypes.
                            <br /><br />
                            On the left is the raw, hardcoded HTML from a Stitch-generated view (from the Minimalist Login Wireframe project) using absolute tailwind classes like <span className="font-dev text-transform-tertiary bg-white px-1 border border-black/10 rounded">bg-[#bdf2d5]</span> and <span className="font-dev text-transform-tertiary bg-white px-1 border border-black/10 rounded">border-[#1e293b]</span>. It is frozen in time.
                            <br /><br />
                            On the right is the exact same markup, translated to use your <span className="font-black">Global Engine Tokens</span> (e.g. <span className="font-dev text-transform-tertiary bg-white px-1 border border-black/10 rounded">bg-layer-panel</span>, <span className="font-dev text-transform-tertiary bg-white px-1 border border-black/10 rounded">shadow-card</span>).
                            <br /><br />
                            Change the Theme in the bottom left corner to watch the right side instantly adapt, while the left side stays rigid.
                        </p>
                    </div>
                </div>
            }
        >
            <div className="p-8 max-w-[1600px] font-display text-transform-primary space-y-12 text-brand-midnight">

                {/* Header */}
                <div className="space-y-4 max-w-2xl">
                    <h1 className="text-5xl font-black uppercase tracking-tighter leading-none">
                        Stitch Magic Test
                        <span className="text-theme-main text-stroke-black block text-title-large mt-2">(Actual Stitch Layout Validation)</span>
                    </h1>
                    <p className="text-title-small font-medium text-slate-500">
                        Comparing raw Stitch prototyping against ZAP&apos;s Global CSS Token Engine. Change your active theme in the sidebar to test.
                    </p>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-12 items-start">

                    {/* LEFT COLUMN: RAW STITCH */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b-2 border-slate-200 pb-2">
                            <h2 className="text-title-medium font-black uppercase flex items-center gap-2 text-slate-400">
                                <Icon name="texture" size={24} />
                                01. Raw Stitch HTML (Mini Neo)
                            </h2>
                            <span className="text-label-small font-bold uppercase tracking-widest bg-slate-200 text-slate-500 px-2 py-1 rounded">Static</span>
                        </div>

                        {/* Raw Stitch Login Component (Exact markup from Stitch) */}
                        <div className="bg-slate-50 p-4 border border-slate-200 rounded-xl relative overflow-hidden flex justify-center">
                            {/* Embedded style specific to Stitch mockup */}
                            <style dangerouslySetInnerHTML={{
                                __html: `
                                .stitch-shadow-playful { box-shadow: 4px 4px 0px 0px rgba(30, 41, 59, 1); }
                                .stitch-shadow-playful-sm { box-shadow: 2px 2px 0px 0px rgba(30, 41, 59, 1); }
                                .stitch-ink { border-color: #1e293b; color: #1e293b; }
                                .stitch-bg-ink { background-color: #1e293b; }
                                .stitch-mint { background-color: #bdf2d5; }
                                .stitch-yellow { background-color: #fdf6b0; }
                                .stitch-pink-bg { background-color: #ff577f; color: white; }
                                .stitch-pink-text { color: #ff577f; }
                           `}} />

                            <div className="relative flex flex-col stitch-mint w-full max-w-[480px] min-h-[850px] border-4 stitch-ink rounded-3xl overflow-hidden shrink-0">
                                <div className="flex items-center p-4 pb-2 justify-between">
                                    <button title="Back" className="flex size-12 shrink-0 items-center justify-center bg-white border-2 stitch-ink rounded-full stitch-shadow-playful-sm hover:translate-y-[2px] hover:shadow-none transition-all">
                                        <Icon name="arrow_back" size={24} className="text-[#1e293b]" />
                                    </button>
                                    <h2 className="text-[#1e293b] text-title-medium font-bold leading-tight flex-1 text-center pr-12 font-display text-transform-primary tracking-wide">Login</h2>
                                </div>
                                <div className="px-4 py-8 mt-4">
                                    <div className="flex flex-col items-center justify-center gap-6">
                                        <div className="w-32 h-32 rounded-3xl stitch-yellow flex items-center justify-center border-4 stitch-ink stitch-shadow-playful rotate-3 hover:rotate-6 transition-transform">
                                            <Icon name="local_cafe" size={64} className="stitch-pink-text" />
                                        </div>
                                        <div className="text-center mt-2">
                                            <h1 className="text-4xl font-bold font-display text-transform-primary text-[#1e293b] tracking-wide">Welcome Back!</h1>
                                            <p className="text-[#1e293b]/80 text-body-medium mt-2 font-semibold">Time for your daily brew ☕</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-col gap-2 px-6 mt-4">
                                    <div className="flex flex-wrap items-end gap-4 py-3">
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-[#1e293b] text-title-small font-bold leading-normal pb-2 font-display text-transform-primary tracking-wide">Email</p>
                                            <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-2xl text-[#1e293b] focus:outline-none border-4 stitch-ink bg-white h-16 placeholder:text-[#1e293b]/40 p-[15px] text-title-small font-semibold stitch-shadow-playful transition-all" placeholder="coffee@lover.com" type="email" />
                                        </label>
                                    </div>
                                    <div className="flex flex-wrap items-end gap-4 py-3">
                                        <label className="flex flex-col min-w-40 flex-1">
                                            <p className="text-[#1e293b] text-title-small font-bold leading-normal pb-2 font-display text-transform-primary tracking-wide">Password</p>
                                            <div className="flex w-full flex-1 items-stretch rounded-2xl border-4 stitch-ink bg-white overflow-hidden stitch-shadow-playful focus-within:translate-y-[2px] focus-within:shadow-none transition-all">
                                                <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden border-none outline-none bg-transparent h-14 text-[#1e293b] placeholder:text-[#1e293b]/40 p-[15px] text-title-small font-bold tracking-widest" placeholder="••••••••" type="password" />
                                                <div className="text-[#1e293b] flex items-center justify-center pr-[15px] cursor-pointer hover:text-[#ff577f] transition-colors">
                                                    <Icon name="visibility" size={24} />
                                                </div>
                                            </div>
                                        </label>
                                    </div>
                                    <div className="flex justify-end pt-2">
                                        <a className="text-[#1e293b]/80 text-body-medium font-bold hover:text-[#ff577f] transition-colors underline underline-offset-4 decoration-2" href="#">Forgot Password?</a>
                                    </div>
                                </div>
                                <div className="mt-auto px-6 pb-12 pt-8 flex flex-col gap-8">
                                    <button className="w-full h-16 stitch-pink-bg font-display text-transform-primary font-bold text-title-large tracking-wide rounded-2xl border-4 stitch-ink flex items-center justify-center stitch-shadow-playful active:translate-y-[4px] active:shadow-none transition-all hover:bg-[#ff3b6a]">
                                        Login
                                    </button>
                                    <div className="flex items-center justify-center gap-2 stitch-yellow opacity-90 py-4 rounded-2xl border-2 stitch-ink border-dashed">
                                        <p className="text-[#1e293b] text-body-medium font-bold">New around here?</p>
                                        <a className="stitch-pink-text text-body-medium font-bold underline underline-offset-4 decoration-[#ff577f] decoration-2 hover:text-[#1e293b] transition-colors font-display text-transform-primary tracking-wide" href="#">Sign Up</a>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* RIGHT COLUMN: ZAP MASTER */}
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between border-b-[length:var(--card-border-width,0px)] border-card-border pb-2">
                            <h2 className="text-title-medium font-black uppercase flex items-center gap-2">
                                <Icon name="auto_awesome" size={24} className="text-brand-magenta" />
                                02. ZAP Token Master
                            </h2>
                            <span className="text-label-small font-bold uppercase tracking-widest bg-brand-magenta text-white px-2 py-1 rounded-[calc(var(--btn-radius)/2)]">Dynamic</span>
                        </div>

                        {/* ZAP Translated Component */}
                        <ContainerDevWrapper showClassNames={devMode} identity={{ displayName: "ZAP Translated Login Framework", filePath: "zap/stitch-test/page.tsx", type: "Proof of Concept", architecture: "ZAP LAYOUT ENGINE" }}>
                            <div className="bg-layer-cover p-4 border-[length:var(--card-border-width,0px)] border-card-border rounded-xl flex justify-center relative bg-[url('/grid.svg')] min-h-[850px]">

                                {/* The exactly identical ZAP Card mapped to tokens */}
                                <div className="relative flex flex-col w-full max-w-[480px] bg-layer-canvas border-[length:var(--card-border-width,2px)] border-card-border rounded-card shrink-0">

                                    <div className="flex items-center p-4 pb-2 justify-between">
                                        <button title="Back" className="flex size-12 shrink-0 items-center justify-center bg-layer-cover border-[length:var(--card-border-width,2px)] border-card-border rounded-full shadow-card hover:translate-y-[2px] hover:shadow-none transition-all text-brand-midnight">
                                            <Icon name="arrow_back" size={24} />
                                        </button>
                                        <h2 className="text-brand-midnight text-title-medium font-bold leading-tight flex-1 text-center pr-12 tracking-wide font-display text-transform-primary">Login</h2>
                                    </div>

                                    <div className="px-4 py-8 mt-4">
                                        <div className="flex flex-col items-center justify-center gap-6">
                                            <div className="w-32 h-32 rounded-card bg-brand-primary flex items-center justify-center border-[length:var(--card-border-width,2px)] border-card-border shadow-card rotate-3 hover:rotate-6 transition-transform">
                                                <Icon name="local_cafe" size={64} className="text-brand-midnight" />
                                            </div>
                                            <div className="text-center mt-2">
                                                <h1 className="text-4xl font-bold font-display text-transform-primary text-brand-midnight tracking-wide">Welcome Back!</h1>
                                                <p className="text-iso-gray-500 text-body-medium mt-2 font-semibold">Time for your daily brew ☕</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col gap-2 px-6 mt-4">
                                        <div className="flex flex-wrap items-end gap-4 py-3">
                                            <label className="flex flex-col min-w-40 flex-1">
                                                <p className="text-brand-midnight text-title-small font-bold leading-normal pb-2 tracking-wide font-display text-transform-primary">Email</p>
                                                <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-input text-brand-midnight focus:outline-none border-[length:var(--card-border-width,2px)] border-card-border bg-layer-cover h-16 placeholder:text-iso-gray-400 p-[15px] text-title-small font-semibold shadow-card transition-all" placeholder="coffee@lover.com" type="email" />
                                            </label>
                                        </div>
                                        <div className="flex flex-wrap items-end gap-4 py-3">
                                            <label className="flex flex-col min-w-40 flex-1">
                                                <p className="text-brand-midnight text-title-small font-bold leading-normal pb-2 tracking-wide font-display text-transform-primary">Password</p>
                                                <div className="flex w-full flex-1 items-stretch rounded-input border-[length:var(--card-border-width,2px)] border-card-border bg-layer-cover overflow-hidden shadow-card focus-within:translate-y-[2px] focus-within:shadow-none transition-all">
                                                    <input className="flex w-full min-w-0 flex-1 resize-none overflow-hidden border-none outline-none bg-transparent h-[52px] text-brand-midnight placeholder:text-iso-gray-400 p-[15px] text-title-small font-bold tracking-widest" placeholder="••••••••" type="password" />
                                                    <div className="text-iso-gray-500 flex items-center justify-center pr-[15px] cursor-pointer hover:text-brand-magenta transition-colors">
                                                        <Icon name="visibility" size={24} />
                                                    </div>
                                                </div>
                                            </label>
                                        </div>
                                        <div className="w-full text-right pt-1">
                                            <a href="#" className="text-iso-gray-500 text-body-medium font-bold hover:text-brand-magenta transition-colors underline underline-offset-4 decoration-2">Forgot Password?</a>
                                        </div>
                                    </div>

                                    <div className="mt-auto px-6 pb-12 pt-8 flex flex-col gap-8">
                                        <button className="w-full h-16 bg-brand-magenta text-white font-display text-transform-primary font-bold text-title-large tracking-wide rounded-btn border-[length:var(--card-border-width,2px)] border-card-border flex items-center justify-center shadow-card active:translate-y-[4px] active:shadow-none transition-all">
                                            Login
                                        </button>
                                        <div className="flex items-center justify-center gap-2 bg-layer-panel py-4 rounded-input border-[length:var(--card-border-width,2px)] border-card-border border-dashed">
                                            <p className="text-brand-midnight text-body-medium font-bold">New around here?</p>
                                            <a className="text-brand-magenta text-body-medium font-bold underline underline-offset-4 decoration-brand-magenta decoration-2 hover:text-brand-midnight transition-colors font-display text-transform-primary tracking-wide" href="#">Sign Up</a>
                                        </div>
                                    </div>

                                </div>

                            </div>
                        </ContainerDevWrapper>
                    </div>

                </div>
            </div>
        </MasterVerticalShell>
    );
}

