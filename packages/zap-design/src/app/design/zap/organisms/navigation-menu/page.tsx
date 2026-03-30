'use client';

import React, { useState } from 'react';
import { NavigationMenu } from '../../../../../genesis/organisms/navigation-menu';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function NavigationMenuSandbox() {  const [dropdownRadius, setDropdownRadius] = useState([16]);
  const [itemRadius, setItemRadius] = useState([12]);
  const inspectorControls = (
    <Wrapper identity={{ displayName: "Inspector Controls", type: "Container", filePath: "zap/organisms/navigation-menu/page.tsx" }}>
      <div className="space-y-4">
        <Wrapper identity={{ displayName: "Navigation Menu Settings", type: "Docs Link", filePath: "zap/organisms/navigation-menu/page.tsx" }}>
          <div className="space-y-6">
            <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Sandbox Variables</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--nav-menu-dropdown-radius</span>
                  <span className="font-bold">{dropdownRadius[0]}px</span>
                </div>
                <Slider value={dropdownRadius} onValueChange={setDropdownRadius} min={0} max={64} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--nav-menu-item-radius</span>
                  <span className="font-bold">{itemRadius[0]}px</span>
                </div>
                <Slider value={itemRadius} onValueChange={setItemRadius} min={0} max={64} step={1} className="w-full" />
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </Wrapper>
  );
  return (
    <ComponentSandboxTemplate
      componentName="Navigation Menu"
      tier="L5 ORGANISM"
      status="Beta"
      filePath="src/genesis/organisms/navigation-menu.tsx"
      importPath="@/genesis/organisms/navigation-menu"
      inspectorControls={inspectorControls}
    >
      <div 
        className="w-full flex justify-center py-20 px-8 min-h-[800px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl overflow-hidden"
        style={{
          '--nav-menu-dropdown-radius': `${dropdownRadius[0]}px`,
          '--nav-menu-item-radius': `${itemRadius[0]}px`,
        } as React.CSSProperties}
      >
        <div className="w-full max-w-6xl flex flex-col rounded-[length:var(--radius-shape-lg)] overflow-hidden border border-outline-variant shadow-[var(--md-sys-elevation-level2)] bg-surface">
          <NavigationMenu />
          {/* Mock Body content to demonstrate the dropdown floating over it */}
          <div className="flex-1 min-h-[500px] bg-surface-container/50 flex flex-col items-center justify-center text-on-surface-variant border-t border-outline-variant/50">
            <h2 className="font-display font-bold text-headlineMedium text-transform-primary mb-2 text-on-surface">
              Main Dashboard View
            </h2>
            <p className="font-body text-bodyLarge text-transform-secondary max-w-md text-center">
              Click &quot;Products&quot; in the navigation menu above to see the Mega-Menu floating panel composed of M3 Cards and L3 layout primitives.
            </p>
          </div>
        </div>
      </div>
    </ComponentSandboxTemplate>
  );
}
