'use client';

import { useTheme } from '../../../../../components/ThemeContext';
import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { ContainerDevWrapper } from '../../../../../components/dev/ContainerDevWrapper';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';

export default function StitchPlayfulTestPage() {
    const { devMode } = useTheme();

    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'LAB' },
                { label: 'ABOUT ME WIREFRAME', active: true }
            ]}
            activeItem="Stitch Playful"
            inspectorTitle="Playful Wash Results"
            inspectorContent={
                <div className="p-4 space-y-4 text-brand-midnight">
                    <div className="bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border p-4 shadow-card rounded-card">
                        <h4 className="font-bold uppercase text-label-small mb-2">Protocol: Playful Wash</h4>
                        <p className="text-label-medium font-medium leading-relaxed">
                            This layout was automatically transpiled from the Stitch Playful About Me prototype.
                            <br /><br />
                            Custom arbitrary colors (mint, peach, lavender) are retained via JIT compilation while the structure is securely dropped into the ZAP Shell.
                        </p>
                    </div>
                </div>
            }
        >
            <div className="flex-1 bg-[#FDFCF0] font-body text-transform-secondary text-[#2D3436] antialiased overflow-y-auto min-h-full selection:bg-[#E1BAFF] selection:text-[#2D3436] relative">
                <style dangerouslySetInnerHTML={{
                    __html: `
                    .organic-blob {
                        border-radius: 30% 70% 70% 30% / 30% 30% 70% 70%;
                    }
                    .bubbly-shadow {
                        box-shadow: 8px 8px 0px 0px rgba(0,0,0,0.05);
                    }
                    .floating {
                        animation: float 6s ease-in-out infinite;
                    }
                    @keyframes float {
                        0% { transform: translateY(0px); }
                        50% { transform: translateY(-20px); }
                        100% { transform: translateY(0px); }
                    }
               `}} />

                <ContainerDevWrapper showClassNames={devMode} identity={{ displayName: "Playful About Me", filePath: "stitch-playful-test/page.tsx", type: "Page", architecture: "ZAP LAYOUT ENGINE" }}>

                    <div className="relative min-h-screen flex flex-col overflow-hidden">
                        {/* Background Blobs */}
                        <div className="absolute top-[-10%] left-[-5%] w-[400px] h-[400px] bg-[#BAFFD9]/40 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute bottom-[5%] right-[-5%] w-[500px] h-[500px] bg-[#E1BAFF]/30 rounded-full blur-3xl -z-10"></div>
                        <div className="absolute top-[20%] right-[10%] w-[150px] h-[150px] bg-[#FFD1BA]/50 organic-blob floating -z-10"></div>

                        {/* Header Navigation */}
                        <header className="flex items-center justify-between px-10 py-8 mx-auto w-full max-w-7xl relative z-10">
                            <div className="flex items-center gap-3">
                                <div className="size-12 bg-[#E1BAFF] rounded-2xl flex items-center justify-center rotate-3 bubbly-shadow">
                                    <span className="text-white font-bold"><Icon name="celebration" /></span>
                                </div>
                                <h2 className="text-title-large font-bold font-display text-transform-primary tracking-tight text-[#2D3436]">Hello.Studio</h2>
                            </div>
                            <nav className="hidden md:flex items-center gap-8 bg-white/60 backdrop-blur-md px-8 py-3 rounded-full bubbly-shadow border-[length:var(--card-border-width,1px)] border-white/40">
                                <a className="font-bold hover:text-[#E1BAFF] transition-colors" href="#">Home</a>
                                <a className="font-bold hover:text-[#FFD1BA] transition-colors" href="#">Works</a>
                                <a className="font-bold text-[#E1BAFF]" href="#">About</a>
                                <a className="font-bold hover:text-[#BAFFD9] transition-colors" href="#">Contact</a>
                            </nav>
                            <div className="md:hidden">
                                <span className="text-4xl"><Icon name="menu" /></span>
                            </div>
                        </header>

                        <main className="flex-1 flex items-center justify-center p-6 relative z-10">
                            <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                                {/* Left Image/Blob Area */}
                                <div className="lg:col-span-5 relative group">
                                    <div className="absolute inset-0 bg-[#FFD1BA] rounded-[60%_40%_70%_30%/40%_50%_60%_40%] rotate-6 scale-105 group-hover:rotate-12 transition-transform duration-500"></div>
                                    <div className="absolute inset-0 bg-[#BAFFD9] rounded-[60%_40%_70%_30%/40%_50%_60%_40%] -rotate-3 scale-105 group-hover:-rotate-6 transition-transform duration-500"></div>
                                    <div className="relative aspect-square bg-white rounded-[60%_40%_70%_30%/40%_50%_60%_40%] overflow-hidden border-8 border-white bubbly-shadow">
                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                        <img alt="Profile" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBa667ZE4SipoA29ucmd2oh2ojJmGIGqR358WHnGsVrbe0qOmrvqzVvNdFOBI7hpIa13NpkCOCiIth2SVzAbPLxmaGr9a5I63TBWx_-2G-UtSV0OPqBexig0gWBlVDELeiYZjGAdZqanEPfesmRPv5_Bz6zKC28IcNdxp-cW5BcXg5KXbTtq-b_e39cmPCKgwwGu00RgquI76lbJ-UZvdK0LPxqcVzMxs58dBBOzhDtCBOUS8vwrrevJyKSGuynHyxDWdsZ396n1l9X" />
                                    </div>
                                    <div className="absolute -bottom-6 -right-6 size-24 bg-[#FFF6BA] rounded-full flex items-center justify-center bubbly-shadow floating" style={{ animationDelay: '-2s' }}>
                                        <span className="text-4xl text-yellow-600"><Icon name="star" /></span>
                                    </div>
                                </div>

                                {/* Right Content Area */}
                                <div className="lg:col-span-7 flex flex-col gap-10">

                                    <section className="relative">
                                        <div className="inline-block px-6 py-2 bg-[#FFBADA]/20 text-pink-700 rounded-full font-bold text-body-small mb-6 uppercase tracking-widest border border-[#FFBADA]/30">
                                            ✨ Creative Explorer
                                        </div>
                                        <h1 className="text-6xl md:text-8xl font-display text-transform-primary font-bold leading-[1.1] mb-8 relative">
                                            Hi, I&apos;m <span className="text-[#E1BAFF] relative">Alex!
                                                <svg className="absolute -bottom-2 left-0 w-full" preserveAspectRatio="none" viewBox="0 0 100 20">
                                                    <path d="M0,10 Q25,0 50,10 T100,10" fill="none" stroke="#E1BAFF" strokeWidth="4"></path>
                                                </svg>
                                            </span>
                                        </h1>
                                        <p className="text-title-medium md:text-2xl text-[#2D3436]/80 leading-relaxed font-medium max-w-2xl">
                                            I&apos;m a designer and developer who loves building <span className="bg-[#BAFFD9] px-2 rounded-lg">digital playgrounds</span>. I believe websites should be as fun to use as they are beautiful to look at.
                                        </p>
                                    </section>

                                    <section className="bg-white/40 backdrop-blur-sm p-8 rounded-[2rem] border-[length:var(--card-border-width,1px)] border-white/60 bubbly-shadow">
                                        <h3 className="text-title-large font-display text-transform-primary font-bold mb-6 flex items-center gap-3">
                                            <span className="size-10 bg-[#BAE8FF] rounded-xl flex items-center justify-center text-white">
                                                <Icon name="rocket_launch" />
                                            </span>
                                            Superpowers
                                        </h3>
                                        <div className="flex flex-wrap gap-4">
                                            <div className="px-6 py-3 bg-[#BAFFD9] rounded-2xl font-bold text-[#2D3436] border-b-[4px] border-emerald-300 hover:-translate-y-1 transition-transform cursor-default">
                                                UI Design
                                            </div>
                                            <div className="px-6 py-3 bg-[#FFD1BA] rounded-2xl font-bold text-[#2D3436] border-b-[4px] border-orange-300 hover:-translate-y-1 transition-transform cursor-default">
                                                Motion Magic
                                            </div>
                                            <div className="px-6 py-3 bg-[#E1BAFF] rounded-2xl font-bold text-[#2D3436] border-b-[4px] border-purple-300 hover:-translate-y-1 transition-transform cursor-default">
                                                React Fun
                                            </div>
                                            <div className="px-6 py-3 bg-[#FFF6BA] rounded-2xl font-bold text-[#2D3436] border-b-[4px] border-yellow-300 hover:-translate-y-1 transition-transform cursor-default">
                                                Illustration
                                            </div>
                                            <div className="px-6 py-3 bg-[#BAE8FF] rounded-2xl font-bold text-[#2D3436] border-b-[4px] border-blue-300 hover:-translate-y-1 transition-transform cursor-default">
                                                Storytelling
                                            </div>
                                        </div>
                                    </section>

                                    <section className="flex flex-wrap items-center gap-8">
                                        <div className="flex gap-4">
                                            <a className="size-14 bg-white rounded-2xl flex items-center justify-center bubbly-shadow hover:bg-[#FFBADA] group transition-all" href="#" title="Email">
                                                <span className="text-[#2D3436] group-hover:text-white transition-colors"><Icon name="alternate_email" /></span>
                                            </a>
                                            <a className="size-14 bg-white rounded-2xl flex items-center justify-center bubbly-shadow hover:bg-[#BAE8FF] group transition-all" href="#" title="Camera">
                                                <span className="text-[#2D3436] group-hover:text-white transition-colors"><Icon name="camera" /></span>
                                            </a>
                                            <a className="size-14 bg-white rounded-2xl flex items-center justify-center bubbly-shadow hover:bg-[#BAFFD9] group transition-all" href="#" title="Bot">
                                                <span className="text-[#2D3436] group-hover:text-white transition-colors"><Icon name="smart_toy" /></span>
                                            </a>
                                        </div>
                                        <a className="px-10 py-5 bg-[#2D3436] text-white rounded-full font-bold text-title-small hover:scale-105 transition-transform flex items-center gap-3 bubbly-shadow" href="#">
                                            Let&apos;s Chat! <span><Icon name="send" /></span>
                                        </a>
                                    </section>
                                </div>
                            </div>
                        </main>

                        {/* Footer */}
                        <footer className="p-12 mt-12 relative">
                            <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6 border-t-[length:var(--card-border-width,1px)] border-[#2D3436]/10 pt-10">
                                <div className="flex items-center gap-2">
                                    <span className="size-2 bg-[#E1BAFF] rounded-full"></span>
                                    <p className="font-bold text-[#2D3436]/60">© 2024 Made with joy &amp; lots of caffeine</p>
                                </div>
                                <div className="flex gap-8 font-bold text-[#2D3436]/40">
                                    <a className="hover:text-[#FFD1BA] transition-colors" href="#">Privacy</a>
                                    <a className="hover:text-[#BAFFD9] transition-colors" href="#">Cookies</a>
                                    <a className="hover:text-[#E1BAFF] transition-colors" href="#">Remote Life</a>
                                </div>
                            </div>
                            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-2 bg-gradient-to-r from-[#BAFFD9] via-[#FFD1BA] to-[#E1BAFF] rounded-full opacity-30"></div>
                        </footer>
                    </div>
                </ContainerDevWrapper>
            </div>
        </MasterVerticalShell>
    );
}
