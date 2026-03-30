"use client";

import React from "react";
import { Canvas } from '../../../../../genesis/atoms/surfaces/canvas';
import { Card } from '../../../../../genesis/atoms/surfaces/card';
import { Panel } from '../../../../../genesis/atoms/surfaces/panel';

export default function WixCompetitorBlast() {
    return (
        <div className="theme-wix w-full min-h-screen bg-layer-canvas text-brand-midnight flex flex-col font-sans transition-colors duration-200">
            {/* Website Header */}
            <Panel className="w-full flex justify-between items-center px-8 py-4 bg-layer-cover border-b-card-border-width border-brand-midnight">
                <div className="text-title-large font-black uppercase tracking-tighter text-brand-teal">
                    HyperWix
                </div>
                <div className="flex gap-6 text-body-small font-bold uppercase">
                    <button className="hover:text-brand-magenta transition-colors">Templates</button>
                    <button className="hover:text-brand-magenta transition-colors">Features</button>
                    <button className="hover:text-brand-magenta transition-colors">Resources</button>
                    <button className="hover:text-brand-magenta transition-colors">Pricing</button>
                </div>
                <div className="flex gap-4">
                    <button className="px-5 py-2 font-bold uppercase text-body-small focus:outline-none">
                        Login
                    </button>
                    <button className="px-5 py-2 bg-brand-teal text-white font-bold uppercase flex items-center justify-center border-card-border-width border-brand-midnight rounded-btn-radius shadow-card-shadow hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                        Get Started
                    </button>
                </div>
            </Panel>

            <Canvas className="flex-1 flex flex-col">
                {/* Hero Section */}
                <section className="w-full py-24 px-8 flex flex-col items-center justify-center text-center">
                    <h1 className="text-7xl font-black uppercase tracking-tight mb-6 max-w-4xl text-brand-midnight leading-none">
                        Create a website <br />
                        <span className="text-brand-magenta">without limits</span>
                    </h1>
                    <p className="text-title-medium max-w-2xl text-brand-midnight/70 mb-10 font-medium">
                        Discover the platform that gives you the freedom to create, design, manage and develop your web presence exactly the way you want.
                    </p>

                    <div className="flex gap-6">
                        <button className="px-8 py-4 bg-brand-midnight text-white font-black uppercase text-title-small border-card-border-width border-brand-midnight rounded-btn-radius shadow-card-shadow hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#D3D3D3] transition-all">
                            Start Creating
                        </button>
                        <button className="px-8 py-4 bg-transparent text-brand-midnight font-black uppercase text-title-small border-card-border-width border-brand-midnight rounded-btn-radius shadow-card-shadow hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_#D3D3D3] transition-all bg-layer-cover">
                            Read the Docs
                        </button>
                    </div>
                </section>

                {/* Services Section */}
                <section className="w-full bg-layer-cover py-24 px-8 border-t-card-border-width border-brand-midnight">
                    <div className="max-w-7xl mx-auto">
                        <h2 className="text-4xl font-black uppercase mb-16 text-center tracking-tight">One Platform, <br /> Infinite Possibilities.</h2>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {/* Feature Card 1 */}
                            <Card className="flex flex-col gap-4 p-8 bg-brand-yellow">
                                <div className="w-12 h-12 bg-brand-teal rounded-full border-card-border-width border-brand-midnight shadow-card-shadow flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h3 className="text-title-large font-black uppercase">Intuitive Design</h3>
                                <p className="text-brand-midnight/70 font-medium leading-relaxed">
                                    Drag and drop elements freely with our visual editor. No restrictive grids, just pure creative freedom.
                                </p>
                            </Card>

                            {/* Feature Card 2 */}
                            <Card className="flex flex-col gap-4 p-8 bg-brand-teal text-white border-brand-midnight shadow-card-shadow">
                                <div className="w-12 h-12 bg-brand-magenta rounded-full border-card-border-width border-brand-midnight shadow-card-shadow flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                    </svg>
                                </div>
                                <h3 className="text-title-large font-black uppercase">Dev Scalable</h3>
                                <p className="text-white/80 font-medium leading-relaxed">
                                    Need more power? Drop into the code. Connect APIs, write custom JS, and deploy seamlessly.
                                </p>
                            </Card>

                            {/* Feature Card 3 */}
                            <Card className="flex flex-col gap-4 p-8 bg-brand-midnight text-white border-brand-midnight shadow-card-shadow">
                                <div className="w-12 h-12 bg-brand-yellow rounded-full border-card-border-width border-brand-midnight shadow-card-shadow flex items-center justify-center mb-4">
                                    <svg className="w-6 h-6 text-brand-midnight" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>
                                <h3 className="text-title-large font-black uppercase">Lightning Fast</h3>
                                <p className="text-white/80 font-medium leading-relaxed">
                                    Optimized for performance out of the box. Your site loads instantly anywhere in the world.
                                </p>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="w-full py-24 px-8 bg-brand-magenta text-brand-midnight border-t-card-border-width border-brand-midnight">
                    <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div className="flex flex-col">
                            <span className="text-6xl font-black tracking-tighter">250M+</span>
                            <span className="font-bold uppercase tracking-widest mt-2 text-brand-midnight/80">Users worldwide</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-6xl font-black tracking-tighter">190</span>
                            <span className="font-bold uppercase tracking-widest mt-2 text-brand-midnight/80">Countries</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-6xl font-black tracking-tighter">1k+</span>
                            <span className="font-bold uppercase tracking-widest mt-2 text-brand-midnight/80">Features</span>
                        </div>
                        <div className="flex flex-col">
                            <span className="text-6xl font-black tracking-tighter">24/7</span>
                            <span className="font-bold uppercase tracking-widest mt-2 text-brand-midnight/80">Support</span>
                        </div>
                    </div>
                </section>
            </Canvas>

            {/* Footer */}
            <footer className="w-full py-12 px-8 bg-brand-midnight text-white border-t-card-border-width border-brand-midnight flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="text-title-large font-black uppercase tracking-tighter text-brand-yellow">
                    HyperWix
                </div>
                <div className="flex gap-6 text-body-small font-bold uppercase text-white/50">
                    <span className="hover:text-white transition-colors cursor-pointer">About</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Careers</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Terms</span>
                    <span className="hover:text-white transition-colors cursor-pointer">Privacy</span>
                </div>
                <div className="font-bold uppercase text-white/30 text-label-small text-center md:text-right">
                    © 2026 ZAP Design Engine. <br /> All rights reserved.
                </div>
            </footer>
        </div>
    );
}
