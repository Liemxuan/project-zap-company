import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { ThemeHeader } from '../../molecules/layout/ThemeHeader';
import { SideNav } from '../../molecules/navigation/SideNav';
import { Save, X } from "lucide-react";
import { useSearchParams } from 'next/navigation';
import { Button } from '../../atoms/interactive/button';
import { Input } from '../../atoms/interactive/input';
import { Textarea } from '../../atoms/interactive/textarea';
import { Label } from '../../atoms/interactive/label';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '../../atoms/interactive/select';

/**
 * Location Create Template
 * References the "Remix of Location Admin" aesthetic (Tonal Layering, No-Line rule, Inter/Manrope).
 */
export default function LocationCreateTemplate({ onCancel }: { onCancel?: () => void }) {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    const formContent = (
        <div className="flex-1 flex flex-col min-w-0 bg-layer-base/50 relative">
            <ThemeHeader
                breadcrumb="facilities / locations"
                title="LOCATION DETAILS"
                badge="Add a new location to your organization"
                showBackground={false}
                rightSlot={
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={onCancel} className="font-dev text-transform-tertiary text-muted-foreground uppercase tracking-widest text-[10px]">
                            <X size={14} className="mr-1.5" /> Cancel
                        </Button>
                        <Button size="sm" className="bg-primary hover:bg-primary/90 text-white font-dev uppercase tracking-widest text-[10px] h-8 px-4 border-none shadow-md rounded-[8px]">
                            <Save size={14} className="mr-1.5" /> Save Location
                        </Button>
                    </div>
                }
            />

            {/* Form Content - Tonal Layering & No-line aesthetic */}
            <div className="flex-1 overflow-auto p-12 flex justify-center bg-[#F7FBEF]">
                <div className="w-full max-w-4xl space-y-8 pb-20">
                    <div className="mb-10">
                        <h1 className="font-display text-4xl font-bold text-[#570013] tracking-tight">Create Location</h1>
                        <p className="font-sans text-sm text-[#4F6354] mt-2">Add a new facility to operations.</p>
                    </div>

                    {/* General Information Section */}
                    <div className="bg-[#EBEFE3] p-8 rounded-[12px] space-y-6">
                        <h2 className="font-display text-xl font-semibold text-[#181D16]">General Information</h2>

                        <div className="bg-[#FFFFFF] p-6 rounded-[8px] space-y-5 shadow-[0px_12px_32px_rgba(24,29,22,0.04)]">
                            <div>
                                <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Location Name</Label>
                                <Input type="text" placeholder="E.g., Downtown Distribution Center" />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Location Code</Label>
                                    <Input placeholder="LOC-0000" />
                                </div>
                                <div>
                                    <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Status</Label>
                                    <Select>
                                        <SelectTrigger className="w-full h-[length:var(--input-height,36px)]">
                                            <SelectValue placeholder="Select Status..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="active">Active</SelectItem>
                                            <SelectItem value="renovation">Renovation</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>

                            <div>
                                <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Description</Label>
                                <Textarea rows={4} placeholder="Detailed description of the product..." />
                            </div>
                        </div>
                    </div>

                    {/* Address Details Section */}
                    <div className="bg-[#EBEFE3] p-8 rounded-[12px] space-y-6">
                        <h2 className="font-display text-xl font-semibold text-[#181D16]">Address Details</h2>

                        <div className="bg-[#FFFFFF] p-6 rounded-[8px] space-y-5 shadow-[0px_12px_32px_rgba(24,29,22,0.04)]">
                            <div>
                                <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Street Address</Label>
                                <Input type="text" placeholder="123 Storage Way" />
                            </div>

                            <div className="grid grid-cols-2 gap-5">
                                <div>
                                    <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">City</Label>
                                    <Input type="text" placeholder="San Francisco" />
                                </div>
                                <div>
                                    <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Postal Code</Label>
                                    <Input type="text" placeholder="94103" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information Section */}
                    <div className="bg-[#EBEFE3] p-8 rounded-[12px] space-y-6">
                        <h2 className="font-display text-xl font-semibold text-[#181D16]">Contact Information</h2>

                        <div className="bg-[#FFFFFF] p-6 rounded-[8px] shadow-[0px_12px_32px_rgba(24,29,22,0.04)] grid grid-cols-2 gap-x-5 gap-y-5 items-start">
                            <div className="col-span-1">
                                <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Primary Phone</Label>
                                <Input type="tel" placeholder="(555) 123-4567" />
                            </div>

                            <div className="col-span-1">
                                <Label className="block font-sans text-[11px] font-semibold tracking-wide uppercase text-[#4F6354] mb-2">Facility Manager</Label>
                                <Input type="text" placeholder="Jane Doe" />
                            </div>
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
            componentName="location-create"
            tier="L6 LAYOUT"
            status="In Progress"
            filePath="src/genesis/templates/forms/LocationCreateTemplate.tsx"
            importPath="@/genesis/templates/forms/LocationCreateTemplate"
            hideDataTerminal={true}
            fullWidth={true}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Locations // Create"
                    fullScreenHref={`/design/${activeTheme}/organisms/location-create?fullscreen=true`}
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
