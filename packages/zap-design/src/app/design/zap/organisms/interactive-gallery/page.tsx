'use client';

import React, { useState } from 'react';
import { InteractiveGallery } from '../../../../../genesis/organisms/interactive-gallery';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function InteractiveGallerySandbox() {  const [cardRadius, setCardRadius] = useState([16]);
  const [cardBorderWidth, setCardBorderWidth] = useState([1]);
  const inspectorControls = (
    <Wrapper identity={{ displayName: "Inspector Controls", type: "Container", filePath: "zap/organisms/interactive-gallery/page.tsx" }}>
      <div className="space-y-4">
        <Wrapper identity={{ displayName: "Gallery Structural Settings", type: "Docs Link", filePath: "zap/organisms/interactive-gallery/page.tsx" }}>
          <div className="space-y-6">
            <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Sandbox Variables</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--interactive-gallery-card-radius</span>
                  <span className="font-bold">{cardRadius[0]}px</span>
                </div>
                <Slider value={cardRadius} onValueChange={setCardRadius} min={0} max={64} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--interactive-gallery-card-border-width</span>
                  <span className="font-bold">{cardBorderWidth[0]}px</span>
                </div>
                <Slider value={cardBorderWidth} onValueChange={setCardBorderWidth} min={0} max={8} step={1} className="w-full" />
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </Wrapper>
  );
  return (
    <ComponentSandboxTemplate
      componentName="Interactive Elements Gallery"
      tier="L5: Organisms"
      status="Beta"
      filePath="src/genesis/organisms/interactive-gallery.tsx"
      importPath="@/genesis/organisms/interactive-gallery"
      inspectorControls={inspectorControls}
    >
      <div 
        className="w-full flex items-center justify-center min-h-[800px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl overflow-hidden py-16 px-4 md:px-8"
        style={{
          '--interactive-gallery-card-radius': `${cardRadius[0]}px`,
          '--interactive-gallery-card-border-width': `${cardBorderWidth[0]}px`,
        } as React.CSSProperties}
      >
        <InteractiveGallery />
      </div>
    </ComponentSandboxTemplate>
  );
}
