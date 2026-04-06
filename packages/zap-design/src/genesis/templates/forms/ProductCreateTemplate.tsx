import React, { useState } from 'react';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { ThemeHeader } from '../../molecules/layout/ThemeHeader';
import { SideNav } from '../../molecules/navigation/SideNav';
import { ChevronRight, Save, Image as ImageIcon, X } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Button } from '../../atoms/interactive/button';
import { Input } from '../../atoms/interactive/input';

/**
 * Product Create Template
 * References the "Remix of Location Admin" aesthetic (Tonal Layering, No-Line rule, Inter/Manrope).
 */
export default function ProductCreateTemplate({ onCancel }: { onCancel?: () => void }) {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    const formContent = (
        <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
            <ThemeHeader
                breadcrumb="catalog / products"
                title="CREATE NEW"
                badge={null}
                showBackground={false}
                rightSlot={
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={onCancel} className="font-dev text-transform-tertiary text-muted-foreground uppercase tracking-widest text-[10px]">
                            <X size={14} className="mr-1.5" /> Cancel
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground font-dev uppercase tracking-widest text-[10px] h-8 px-4 border-none shadow-md rounded-[8px]">
                            <Save size={14} className="mr-1.5" /> Save Product
                        </Button>
                    </div>
                }
            />

            {/* Form Content - Tonal Layering & No-line aesthetic */}
            <div className="flex-1 overflow-auto p-12 flex justify-center bg-[#F7FBEF]">
                <div className="w-full max-w-4xl space-y-8 pb-20">
                                    {/* Page Title */}
                                    <div className="mb-10">
                                        <h1 className="font-display text-4xl font-bold text-[#570013] tracking-tight">Create Product</h1>
                                        <p className="font-sans text-sm text-[#4F6354] mt-2">Add a new item to standard inventory.</p>
                                    </div>

                                    {/* General Information Section */}
                                    <div className="bg-[#EBEFE3] p-8 rounded-[12px] space-y-6">
                                        <h2 className="font-display text-xl font-semibold text-[#181D16]">General Information</h2>
                                        
                                        <div className="bg-[#FFFFFF] p-6 rounded-[8px] space-y-5 shadow-[0px_12px_32px_rgba(24,29,22,0.04)]">
                                            <div>
                                                <label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Product Name</label>
                                                <input 
                                                    type="text" 
                                                    placeholder="E.g., Wireless Noise-Cancelling Headphones"
                                                    className="w-full bg-[#FAFAFA] border-none border-b-2 border-transparent focus:border-[#570013] outline-none text-sm text-[#181D16] px-4 py-3 rounded-t-[8px] transition-colors placeholder:text-muted-foreground"
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-5">
                                                <div>
                                                    <label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Internal SKU</label>
                                                    <input 
                                                        type="text" 
                                                        placeholder="PRD-0000"
                                                        className="w-full bg-[#FAFAFA] border-none border-b-2 border-transparent focus:border-[#570013] outline-none text-sm font-dev text-[#181D16] px-4 py-3 rounded-t-[8px] transition-colors placeholder:text-muted-foreground"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Category</label>
                                                    <select className="w-full bg-[#FAFAFA] border-none border-b-2 border-transparent focus:border-[#570013] outline-none text-sm text-[#181D16] px-4 py-3 rounded-t-[8px] transition-colors appearance-none">
                                                        <option value="">Select Category...</option>
                                                        <option value="electronics">Electronics</option>
                                                        <option value="apparel">Apparel</option>
                                                    </select>
                                                </div>
                                            </div>
                                            
                                            <div>
                                                <label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Description</label>
                                                <textarea 
                                                    rows={4}
                                                    placeholder="Detailed description of the product..."
                                                    className="w-full bg-[#FAFAFA] border-none border-b-2 border-transparent focus:border-[#570013] outline-none text-sm text-[#181D16] px-4 py-3 rounded-t-[8px] transition-colors resize-y placeholder:text-muted-foreground"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Pricing & Inventory Section */}
                                    <div className="bg-[#EBEFE3] p-8 rounded-[12px] space-y-6">
                                        <h2 className="font-display text-xl font-semibold text-[#181D16]">Pricing & Inventory</h2>
                                        
                                        <div className="bg-[#FFFFFF] p-6 rounded-[8px] space-y-5 shadow-[0px_12px_32px_rgba(24,29,22,0.04)] grid grid-cols-2 gap-x-5 gap-y-0 items-start">
                                            <div className="col-span-1">
                                                <label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Base Price (USD)</label>
                                                <div className="relative">
                                                    <span className="absolute left-3 top-3 text-muted-foreground">$</span>
                                                    <input 
                                                        type="number" 
                                                        placeholder="0.00"
                                                        className="w-full bg-[#FAFAFA] border-none border-b-2 border-transparent focus:border-[#570013] outline-none text-sm font-dev text-[#181D16] px-8 py-3 rounded-t-[8px] transition-colors placeholder:text-muted-foreground"
                                                    />
                                                </div>
                                            </div>
                                            
                                            <div className="col-span-1">
                                                <label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Initial Stock</label>
                                                <input 
                                                    type="number" 
                                                    placeholder="0"
                                                    className="w-full bg-[#FAFAFA] border-none border-b-2 border-transparent focus:border-[#570013] outline-none text-sm font-dev text-[#181D16] px-4 py-3 rounded-t-[8px] transition-colors placeholder:text-muted-foreground"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Media Section */}
                                    <div className="bg-[#EBEFE3] p-8 rounded-[12px] space-y-6">
                                        <h2 className="font-display text-xl font-semibold text-[#181D16]">Product Media</h2>
                                        
                                        <div className="bg-[#FFFFFF] p-8 rounded-[8px] border-2 border-dashed border-[#8C7071]/30 hover:border-[#570013]/50 transition-colors flex flex-col items-center justify-center text-center cursor-pointer min-h-[200px]">
                                            <div className="h-12 w-12 rounded-full bg-[#F1F5E9] flex items-center justify-center text-[#4F6354] mb-4">
                                                <ImageIcon size={24} />
                                            </div>
                                            <p className="font-sans text-sm font-medium text-[#181D16]">Click to upload or drag and drop</p>
                                            <p className="font-sans text-xs text-muted-foreground mt-1">SVG, PNG, JPG or GIF (max. 800x400px)</p>
                                        </div>
                                    </div>

                                </div>
                            </div>
        </div>
    );

    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                {/* True Side Navigation */}
                <SideNav />
                {formContent}
            </div>
        );
    }

    return (
        <ComponentSandboxTemplate
            componentName="product-create"
            tier="L6 LAYOUT"
            status="In Progress"
            filePath="src/genesis/templates/forms/ProductCreateTemplate.tsx"
            importPath="@/genesis/templates/forms/ProductCreateTemplate"
            hideDataTerminal={true}
            fullWidth={true}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Products // Create"
                    fullScreenHref={`/design/${activeTheme}/organisms/product-create?fullscreen=true`}
                >
                    <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border">
                        {/* Mock Nav */}
                        <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm relative">
                            <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                                <div className="w-6 h-6 rounded bg-primary flex items-center justify-center text-primary-foreground">
                                    <span className="font-bold text-[10px]">ZP</span>
                                </div>
                                <span className="font-bold text-sm tracking-widest font-display text-on-surface uppercase">ZAP OS</span>
                            </div>
                            <div className="flex-1 py-4 px-3 space-y-1 uppercase font-mono text-[11px] tracking-widest text-on-surface opacity-70">
                                <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                                    Overview
                                </div>
                                <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 transition-colors cursor-pointer">
                                    Categories
                                </div>
                                <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 border border-primary/20 cursor-pointer">
                                    Products
                                </div>
                            </div>
                        </div>

                        {formContent}
                    </div>
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
