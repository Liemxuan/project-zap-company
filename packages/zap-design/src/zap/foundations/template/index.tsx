'use client';

import React from 'react';
import { LaboratoryTemplate } from '../../../zap/templates/LaboratoryTemplate';
import { ThemeHeader } from '../../../genesis/molecules/layout/ThemeHeader';

export default function ColorGoalPage() {
    const inspectorWireframe = (
        <div className="w-[340px] h-full bg-layer-panel flex flex-col relative border-l border-border">
            {/* Fixed Header */}
            <div className="w-full h-[var(--sys-header-height,3.5rem)] shrink-0 border-b border-border flex items-center justify-between px-6 bg-layer-dialog relative z-10 overflow-visible">
                 <span className="text-[12px] text-muted-foreground font-dev text-transform-tertiary font-bold">MOLECULE: FIXED HEADER</span>
                 {/* Overlay: Technical Information */}
                 <div className="absolute top-1 right-2 z-50">
 <span className="text-[8px] font-dev text-transform-tertiary text-muted-foreground tracking-widest bg-layer-modal/50 px-2 py-0.5 rounded shadow-sm border border-border">
                         L4: Shell
                     </span>
                 </div>
                 <div className="w-5 h-5 rounded border border-dashed border-outline-variant bg-layer-modal/20 flex items-center justify-center">
                     <span className="text-[10px] text-muted-foreground font-bold cursor-pointer">✕</span>
                 </div>
            </div>

            {/* Scrollable Body Region */}
            <div className="flex-1 w-full overflow-y-auto flex flex-col p-6 gap-6 relative">
                {/* Internal Wiring: Property Block 1 */}
                <div className="w-full h-24 border border-dashed border-border bg-layer-dialog flex flex-col justify-center p-4 gap-3">
                     <span className="text-[9px] text-muted-foreground font-dev text-transform-tertiary">MOLECULE: PROPERTY_GROUP_1</span>
                     <div className="w-full h-2 bg-layer-modal w-full"></div>
                     <div className="w-2/3 h-2 bg-layer-modal"></div>
                </div>

                {/* Internal Wiring: Property Block 2 */}
                <div className="w-full h-32 border border-dashed border-border bg-layer-dialog flex flex-col justify-center p-4 gap-3">
                     <span className="text-[9px] text-muted-foreground font-dev text-transform-tertiary">MOLECULE: PROPERTY_GROUP_2</span>
                     <div className="w-full h-2 bg-layer-modal"></div>
                     <div className="w-3/4 h-2 bg-layer-modal"></div>
                     <div className="w-1/2 h-2 bg-layer-modal"></div>
                </div>
            </div>

            {/* Fixed Footer (Save/Update Action Area) */}
            <div className="w-full px-4 h-[var(--sys-header-height,3.5rem)] shrink-0 border-t border-border bg-layer-panel flex items-center justify-end gap-3 z-10">
                 <div className="px-4 py-2 border border-border bg-layer-dialog rounded flex items-center justify-center cursor-pointer">
                     <span className="text-[10px] text-muted-foreground font-dev text-transform-tertiary font-bold">CANCEL</span>
                 </div>
                 <div className="px-6 py-2 border border-primary bg-primary rounded flex items-center justify-center cursor-pointer">
                     <span className="text-[10px] text-on-primary font-dev text-transform-tertiary font-bold tracking-widest">SAVE / UPDATE</span>
                 </div>
            </div>
        </div>
    );

    return (
        <LaboratoryTemplate
            componentName="Template Lab"
            tier="L4 PAGE"
            filePath="src/app/design/metro/template/page.tsx"
            headerMode={
                <ThemeHeader
                    title="Template Sandbox"
                    badge="L4 PAGE / TEMPLATE MODULE"
                    breadcrumb="ZAP DESIGN ENGINE / METRO / TEMPLATE"
                />
            }
            inspectorConfig={{
                content: inspectorWireframe
            }}
        />
    );
}
