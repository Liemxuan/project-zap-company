'use client';

import React, { useState } from 'react';
import { AuthScaffold } from '../../../../../genesis/organisms/auth-scaffold';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function AuthScaffoldSandbox() {  const [scaffoldRadius, setScaffoldRadius] = useState([16]); // var(--radius-shape-xl)
  const [scaffoldBorder, setScaffoldBorder] = useState([1]);
  const inspectorControls = (
    <Wrapper identity={{ displayName: "Inspector Controls", type: "Container", filePath: "zap/organisms/auth-scaffold/page.tsx" }}>
      <div className="space-y-4">
        <Wrapper identity={{ displayName: "Auth Scaffold Structural Settings", type: "Docs Link", filePath: "zap/organisms/auth-scaffold/page.tsx" }}>
          <div className="space-y-6">
            <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Sandbox Variables</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--auth-scaffold-radius</span>
                  <span className="font-bold">{scaffoldRadius[0]}px</span>
                </div>
                <Slider value={scaffoldRadius} onValueChange={setScaffoldRadius} min={0} max={64} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--auth-scaffold-border-width</span>
                  <span className="font-bold">{scaffoldBorder[0]}px</span>
                </div>
                <Slider value={scaffoldBorder} onValueChange={setScaffoldBorder} min={0} max={8} step={1} className="w-full" />
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </Wrapper>
  );
  return (
    <ComponentSandboxTemplate
      componentName="Authentication Scaffolds"
      tier="L5: Organisms"
      status="Beta"
      filePath="src/genesis/organisms/auth-scaffold.tsx"
      importPath="@/genesis/organisms/auth-scaffold"
      inspectorControls={inspectorControls}
    >
      <div 
        className="w-full flex items-center justify-center min-h-[800px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl overflow-hidden py-16 px-4 md:px-8"
        style={{
          '--auth-scaffold-radius': `${scaffoldRadius[0]}px`,
          '--auth-scaffold-border-width': `${scaffoldBorder[0]}px`,
        } as React.CSSProperties}
      >
        <AuthScaffold />
      </div>
    </ComponentSandboxTemplate>
  );
}
