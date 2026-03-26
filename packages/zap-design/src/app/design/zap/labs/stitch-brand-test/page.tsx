'use client';

import { useTheme } from '../../../../../components/ThemeContext';
import React from 'react';
import { MasterVerticalShell } from '../../../../../zap/layout/MasterVerticalShell';
import { ContainerDevWrapper } from '../../../../../components/dev/ContainerDevWrapper';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';

export default function StitchMoleculeTestPage() {
    const { devMode } = useTheme();

    return (
        <MasterVerticalShell
            breadcrumbs={[
                { label: 'SYSTEMS' },
                { label: 'LAB' },
                { label: 'MOLECULE PROOF OF CONCEPT', active: true }
            ]}
            activeItem="Stitch Dropzone"
            inspectorTitle="Protocol Wash Results"
            inspectorContent={
                <div className="p-4 space-y-4 text-brand-midnight">
                    <div className="bg-layer-panel border-[length:var(--card-border-width,0px)] border-card-border p-4 shadow-card rounded-card">
                        <h4 className="font-bold uppercase text-xs mb-2">Phase 3 Complete</h4>
                        <p className="text-[11px] font-medium leading-relaxed">
                            This layout was automatically mapped from the Stitch Brand Page prototype using the new <strong>Google M3 Matrix</strong>.
                            <br /><br />
                            Switching themes between CORE, NEO, and METRO will now cascade perfectly down into the structure.
                        </p>
                    </div>
                </div>
            }
        >
            <div className="flex-1 font-display text-transform-primary text-on-surface antialiased overflow-y-auto">
                <ContainerDevWrapper showClassNames={devMode} identity={{ displayName: "Brand Page Transpiled", filePath: "stitch-brand-test/page.tsx", type: "Page", architecture: "ZAP LAYOUT ENGINE" }}>

                    {/* Header Navigation */}
                    <header className="sticky top-0 z-50 w-full border-b-[length:var(--card-border-width,1px)] border-outline bg-surface/80 backdrop-blur-md">
                        <div className="max-w-[1440px] mx-auto px-10 flex h-16 items-center justify-between">
                            <div className="flex items-center gap-8">
                                <div className="flex items-center gap-3">
                                    <div className="size-8 bg-primary rounded-shape-small flex items-center justify-center text-on-primary">
                                        <Icon name="dataset" size={20} />
                                    </div>
                                    <h2 className="text-on-surface text-lg font-bold tracking-tight">SystemCore</h2>
                                </div>
                                <nav className="hidden md:flex items-center gap-8">
                                    <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Design</a>
                                    <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Components</a>
                                    <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Tokens</a>
                                    <a className="text-sm font-medium hover:text-primary transition-colors" href="#">Showcase</a>
                                </nav>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="relative hidden sm:block text-on-surface-variant">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-lg"><Icon name="search" size={18} /></span>
                                    <input className="h-9 w-64 rounded-shape-medium border-none bg-surface-variant pl-10 text-sm focus:ring-2 focus:ring-primary/20 text-on-surface" placeholder="Search system docs..." />
                                </div>
                                <button className="bg-primary text-on-primary text-sm font-bold h-9 px-5 rounded-shape-medium hover:opacity-90 transition-opacity">
                                    v2.4.0
                                </button>
                            </div>
                        </div>
                    </header>

                    <main className="max-w-[1440px] mx-auto pb-12">
                        {/* Hero Section */}
                        <section className="p-6">
                            <div className="relative overflow-hidden rounded-shape-large bg-primary p-12 md:p-24 text-center">
                                <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-8">
                                    <h1 className="text-on-primary text-5xl md:text-7xl font-black leading-tight tracking-[-0.03em]">
                                        Build Consistent Experiences
                                    </h1>
                                    <p className="text-on-primary/90 text-lg md:text-xl font-normal max-w-2xl leading-relaxed">
                                        The ultimate foundation for your digital products. Scale your UI with confidence using our comprehensive design language.
                                    </p>
                                    <div className="flex flex-wrap gap-4 justify-center">
                                        <button className="h-12 px-8 bg-surface text-primary font-bold rounded-shape-medium shadow-elevation-2 hover:bg-surface-variant transition-colors border-[length:var(--card-border-width,0px)] border-outline">
                                            Get Started
                                        </button>
                                        <button className="h-12 px-8 bg-transparent text-on-primary font-bold border-[length:var(--btn-border-width,2px)] border-on-primary/30 rounded-shape-medium hover:bg-surface/10 transition-colors">
                                            View Documentation
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Brand Identity Section */}
                        <section className="px-10 py-16">
                            <h2 className="text-3xl font-black text-on-surface mb-10 tracking-tight flex items-center gap-3">
                                <span className="w-8 h-1 bg-primary rounded-full"></span>
                                Brand Identity
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* Colors Card */}
                                <div className="p-6 rounded-shape-medium border-[length:var(--card-border-width,1px)] border-outline bg-surface shadow-elevation-1">
                                    <div className="flex items-center gap-2 mb-6">
                                        <div className="text-primary"><Icon name="palette" size={24} /></div>
                                        <h3 className="font-bold text-lg">Colors</h3>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between p-2 rounded-shape-small bg-surface-variant">
                                            <div className="flex items-center gap-3">
                                                <div className="size-8 rounded-shape-small bg-primary border-[length:var(--card-border-width,0px)] border-outline"></div>
                                                <span className="text-sm font-medium">Primary</span>
                                            </div>
                                            <Icon name="content_copy" size={16} className="text-on-surface-variant cursor-pointer" />
                                        </div>
                                    </div>
                                </div>

                                {/* Typography Card */}
                                <div className="p-6 rounded-shape-medium border-[length:var(--card-border-width,1px)] border-outline bg-surface shadow-elevation-1">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="text-primary"><Icon name="text_fields" size={24} /></div>
                                        <h3 className="font-bold text-lg">Typography</h3>
                                    </div>
                                    <div className="text-center py-4">
                                        <div className="text-6xl font-black mb-2 text-on-surface">Aa</div>
                                        <p className="text-sm font-bold text-on-surface-variant">ZAP Engine Sans</p>
                                    </div>
                                    <div className="mt-4 space-y-1">
                                        <p className="text-xs uppercase tracking-widest text-on-surface-variant font-bold">Stack</p>
                                        <p className="text-xs font-dev text-transform-tertiary bg-surface-variant p-2 rounded-shape-small">var(--font-display)</p>
                                    </div>
                                </div>

                                {/* Components Showcase */}
                                <div className="p-6 rounded-shape-medium border-[length:var(--card-border-width,1px)] border-outline bg-surface shadow-elevation-1 lg:col-span-2">
                                    <div className="flex items-center gap-2 mb-4">
                                        <div className="text-primary"><Icon name="widgets" size={24} /></div>
                                        <h3 className="font-bold text-lg">Washed Buttons</h3>
                                    </div>
                                    <div className="flex gap-4">
                                        <button className="h-10 px-4 bg-primary text-on-primary rounded-btn font-bold text-sm shadow-elevation-1 border-[length:var(--btn-border-width,0px)] border-outline">Primary Action</button>
                                        <button className="h-10 px-4 bg-surface border-[length:var(--btn-border-width,1px)] border-outline text-on-surface rounded-btn font-bold text-sm hover:bg-surface-variant transition-colors">Ghost Hover</button>
                                        <button className="h-10 px-4 bg-surface-variant text-on-surface-variant rounded-btn font-bold text-sm cursor-not-allowed">Disabled State</button>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </main>
                </ContainerDevWrapper>
            </div>
        </MasterVerticalShell>
    );
}
