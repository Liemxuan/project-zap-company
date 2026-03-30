'use client';

import React, { useState } from 'react';
import { UserProfileHeader } from '../../../../../genesis/organisms/user-profile-header';
import { ComponentSandboxTemplate } from '../../../../../zap/layout/ComponentSandboxTemplate';
import { Slider } from '../../../../../genesis/atoms/interactive/slider';

import { Wrapper } from '../../../../../components/dev/Wrapper';

export default function UserProfileHeaderSandbox() {  const [headerRadius, setHeaderRadius] = useState([16]); // var(--radius-shape-xl)
  const [headerBorder, setHeaderBorder] = useState([1]);
  const [avatarRadius, setAvatarRadius] = useState([9999]); // huge for full
  const inspectorControls = (
    <Wrapper identity={{ displayName: "Inspector Controls", type: "Container", filePath: "zap/organisms/user-profile-header/page.tsx" }}>
      <div className="space-y-4">
        <Wrapper identity={{ displayName: "User Profile Structural Settings", type: "Docs Link", filePath: "zap/organisms/user-profile-header/page.tsx" }}>
          <div className="space-y-6">
            <h4 className="text-label-small text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Sandbox Variables</h4>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--profile-header-radius</span>
                  <span className="font-bold">{headerRadius[0]}px</span>
                </div>
                <Slider value={headerRadius} onValueChange={setHeaderRadius} min={0} max={64} step={1} className="w-full" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--profile-header-border-width</span>
                  <span className="font-bold">{headerBorder[0]}px</span>
                </div>
                <Slider value={headerBorder} onValueChange={setHeaderBorder} min={0} max={8} step={1} className="w-full" />
              </div>
              <div className="space-y-2 pt-2">
                <div className="flex justify-between items-center text-label-small font-dev text-transform-tertiary text-muted-foreground">
                  <span>--profile-header-avatar-radius</span>
                  <span className="font-bold">{avatarRadius[0] > 1000 ? '9999px (Full)' : `${avatarRadius[0]}px`}</span>
                </div>
                <Slider value={avatarRadius} onValueChange={setAvatarRadius} min={0} max={9999} step={1} className="w-full" />
              </div>
            </div>
          </div>
        </Wrapper>
      </div>
    </Wrapper>
  );
  return (
    <ComponentSandboxTemplate
      componentName="User Profile Header"
      tier="L5: Organisms"
      status="Beta"
      filePath="src/genesis/organisms/user-profile-header.tsx"
      importPath="@/genesis/organisms/user-profile-header"
      inspectorControls={inspectorControls}
    >
      <div 
        className="w-full flex items-center justify-center min-h-[400px] p-12 bg-layer-panel shadow-sm border border-outline-variant rounded-xl overflow-hidden"
        style={{
          '--profile-header-radius': `${headerRadius[0]}px`,
          '--profile-header-border-width': `${headerBorder[0]}px`,
          '--profile-header-avatar-radius': `${avatarRadius[0]}px`,
        } as React.CSSProperties}
      >
        <UserProfileHeader />
      </div>
    </ComponentSandboxTemplate>
  );
}
