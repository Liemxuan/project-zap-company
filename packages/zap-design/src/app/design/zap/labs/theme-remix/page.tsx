"use client";

import React from "react";
import { Canvas } from '../../../../../genesis/atoms/surfaces/canvas';
import { Card } from '../../../../../genesis/atoms/surfaces/card';
import { Panel } from '../../../../../genesis/atoms/surfaces/panel';

export default function ThemeRemixBlast() {
    return (
        <div className="w-full min-h-screen bg-iso-gray-900 text-white flex flex-col font-sans p-8">
            <h1 className="text-4xl font-black uppercase mb-8 text-center text-acid-yellow">Theme Remix Engine Test (4-State)</h1>
            <p className="text-center mb-12 max-w-2xl mx-auto opacity-70">
                This demonstrates the structural neutrality of the ZAP Design Engine.
                Below are four identical React functional components: one naked (Core Wireframe) and three fully skinned via the CSS Cascade.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                {/* NEUTRAL CORE (NO THEME) */}
                <div className="theme-core flex flex-col w-full h-full relative">
 <div className="absolute -top-6 left-0 text-label-small font-dev text-transform-tertiary text-white/50 bg-black/50 px-2 py-1 tracking-widest">
                        GLOBAL.CSS (Neutral Base)
                    </div>
                    <Canvas className="flex-1 p-8 overflow-hidden rounded-t-card border-[length:var(--card-border-width,0px)] border-card-border">
                        <Card className="p-8 flex flex-col gap-6 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                            <h2 className="text-3xl font-black uppercase text-brand-midnight">Unskinned Core</h2>
                            <p className="text-brand-midnight/70 font-medium tracking-tight">
                                Pure infrastructure. Zero opinionated brand identity. Wireframe mode.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <button className="px-6 py-3 bg-brand-teal text-white font-bold uppercase rounded-btn border-[length:var(--card-border-width,0px)] border-card-border shadow-card transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                                    Primary Action
                                </button>
                                <button className="px-6 py-3 bg-layer-panel text-brand-midnight font-bold uppercase rounded-btn border-[length:var(--card-border-width,0px)] border-card-border shadow-card transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                                    Secondary
                                </button>
                            </div>
                        </Card>
                        <Panel className="mt-8 p-6 flex flex-col gap-4 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                            <div className="flex items-center justify-between text-brand-midnight">
                                <span className="font-bold uppercase tracking-tight">System Active</span>
                                <span className="text-theme-base/50 font-black">200ms</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-state-success rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Success"></div>
                                <div className="w-6 h-6 bg-state-warning rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Warning"></div>
                                <div className="w-6 h-6 bg-state-error rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Danger"></div>
                                <div className="w-6 h-6 bg-state-info rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Info"></div>
                            </div>
                        </Panel>
                    </Canvas>
                </div>

                {/* METRO THEME */}
                <div className="theme-metro flex flex-col w-full h-full relative">
 <div className="absolute -top-6 left-0 text-label-small font-dev text-transform-tertiary text-white/50 bg-black/50 px-2 py-1 tracking-widest">
                        METRO.JSON (Core Reset)
                    </div>
                    <Canvas className="flex-1 p-8 overflow-hidden rounded-t-card border-[length:var(--card-border-width,0px)] border-card-border">
                        <Card className="p-8 flex flex-col gap-6 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                            <h2 className="text-3xl font-black uppercase text-brand-midnight">Enterprise Flat</h2>
                            <p className="text-brand-midnight/70 font-medium tracking-tight">
                                Clean, squared edges with no shadows. High predictability.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <button className="px-6 py-3 bg-brand-teal text-white font-bold uppercase rounded-btn border-[length:var(--card-border-width,0px)] border-card-border shadow-card transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                                    Primary Action
                                </button>
                                <button className="px-6 py-3 bg-layer-panel text-brand-midnight font-bold uppercase rounded-btn border-[length:var(--card-border-width,0px)] border-card-border shadow-card transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                                    Secondary
                                </button>
                            </div>
                        </Card>
                        <Panel className="mt-8 p-6 flex flex-col gap-4 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                            <div className="flex items-center justify-between text-brand-midnight">
                                <span className="font-bold uppercase tracking-tight">System Active</span>
                                <span className="text-theme-base/50 font-black">200ms</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-state-success rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Success"></div>
                                <div className="w-6 h-6 bg-state-warning rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Warning"></div>
                                <div className="w-6 h-6 bg-state-error rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Danger"></div>
                                <div className="w-6 h-6 bg-state-info rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Info"></div>
                            </div>
                        </Panel>
                    </Canvas>
                </div>

                {/* NEO THEME */}
                <div className="theme-neo flex flex-col w-full h-full relative">
 <div className="absolute -top-6 left-0 text-label-small font-dev text-transform-tertiary text-acid-yellow bg-black px-2 py-1 tracking-widest font-black">
                        NEO.JSON (Zap-OS)
                    </div>
                    <Canvas className="flex-1 p-8 overflow-hidden rounded-t-card border-[length:var(--card-border-width,0px)] border-card-border">
                        <Card className="p-8 flex flex-col gap-6 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                            <h2 className="text-3xl font-black uppercase text-brand-midnight">Neo-Brutalism</h2>
                            <p className="text-brand-midnight/70 font-medium tracking-tight">
                                High contrast, 4px hard shadows, vibrant technical colors.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <button className="px-6 py-3 bg-brand-teal text-white font-bold uppercase rounded-btn border-[length:var(--card-border-width,0px)] border-card-border shadow-card transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                                    Primary Action
                                </button>
                                <button className="px-6 py-3 bg-layer-panel text-brand-midnight font-bold uppercase rounded-btn border-[length:var(--card-border-width,0px)] border-card-border shadow-card transition-all hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none">
                                    Secondary
                                </button>
                            </div>
                        </Card>
                        <Panel className="mt-8 p-6 flex flex-col gap-4 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                            <div className="flex items-center justify-between text-brand-midnight">
                                <span className="font-bold uppercase tracking-tight">System Active</span>
                                <span className="text-theme-base/50 font-black">200ms</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-state-success rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Success"></div>
                                <div className="w-6 h-6 bg-state-warning rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Warning"></div>
                                <div className="w-6 h-6 bg-state-error rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Danger"></div>
                                <div className="w-6 h-6 bg-state-info rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Info"></div>
                            </div>
                        </Panel>
                    </Canvas>
                </div>

                {/* WIX THEME */}
                <div className="theme-wix flex flex-col w-full h-full relative">
 <div className="absolute -top-6 left-0 text-label-small font-dev text-transform-tertiary text-cyan-400 bg-black/50 px-2 py-1 tracking-widest">
                        WIX.JSON (Competitor)
                    </div>
                    <Canvas className="flex-1 p-8 overflow-hidden rounded-t-card border-[length:var(--card-border-width,0px)] border-card-border">
                        <Card className="p-8 flex flex-col gap-6 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                            <h2 className="text-3xl font-black uppercase text-brand-midnight">Soft & Rounded</h2>
                            <p className="text-brand-midnight/70 font-medium tracking-tight">
                                Consumer-friendly, rounded corners, soft drop shadows.
                            </p>
                            <div className="flex gap-4 mt-4">
                                <button className="px-6 py-3 bg-brand-teal text-white font-bold uppercase rounded-btn border-[length:var(--card-border-width,0px)] border-card-border shadow-card transition-all hover:-translate-y-1 hover:shadow-card">
                                    Primary Action
                                </button>
                                <button className="px-6 py-3 bg-layer-panel text-brand-midnight font-bold uppercase rounded-btn border-[length:var(--card-border-width,0px)] border-card-border shadow-card transition-all hover:-translate-y-1 hover:shadow-card">
                                    Secondary
                                </button>
                            </div>
                        </Card>
                        <Panel className="mt-8 p-6 flex flex-col gap-4 rounded-card border-[length:var(--card-border-width,0px)] border-card-border shadow-card">
                            <div className="flex items-center justify-between text-brand-midnight">
                                <span className="font-bold uppercase tracking-tight">System Active</span>
                                <span className="text-theme-base/50 font-black">200ms</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-6 h-6 bg-state-success rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Success"></div>
                                <div className="w-6 h-6 bg-state-warning rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Warning"></div>
                                <div className="w-6 h-6 bg-state-error rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Danger"></div>
                                <div className="w-6 h-6 bg-state-info rounded-full border-[length:var(--card-border-width,0px)] border-card-border shadow-card" title="Info"></div>
                            </div>
                        </Panel>
                    </Canvas>
                </div>

            </div>
        </div>
    );
}
