import React from 'react';
import { ContainerDevWrapper } from '../../../components/dev/ContainerDevWrapper';
import { SideNav } from '../navigation/SideNav';
import { Canvas } from '../../atoms/surfaces/canvas';

export function CleanShell({ children }: { children?: React.ReactNode }) {
  // Generated natively via SOP-016 Drop & Scan workflow from clean-shell.fig
  return (
    <ContainerDevWrapper identity={{ displayName: "CleanShell", filePath: "zap-design/src/genesis/molecules/clean-shell/CleanShell.tsx", type: "Shell", architecture: "ZAP LAYOUT ENGINE" }} showClassNames={false}>
      <div className="w-[1440px] h-[1024px] flex bg-layer-1 overflow-hidden relative font-body text-foreground">
        
        {/* LEFT SIDEBAR: Navigation / Controls */}
        <SideNav showDevWrapper={false} />

        {/* MAIN CANVAS PIPELINE */}
        <Canvas className="flex-1 flex h-full bg-layer-base min-w-0">
          <div className="flex-1 relative flex overflow-hidden">
             {children || (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 text-center space-y-4 bg-layer-cover">
                   <div className="w-full max-w-2xl h-full bg-layer-cover/10 border border-dashed border-border/50 rounded-lg flex flex-col items-center justify-center p-8">
                      <span className="font-display font-bold text-lg text-foreground mb-2">Content Canvas</span>
                      <p className="text-sm text-muted-foreground max-w-sm mb-6">
                         Inject child components here. This area scales dynamically within the 1440x1024 strict bounds.
                      </p>
                      <p className="text-center text-xs text-muted-foreground/60 font-body italic opacity-80 mt-auto">
                         &quot;Make everything as simple as possible, but not simpler.&quot; — Albert Einstein
                      </p>
                   </div>
                </div>
             )}
          </div>
        </Canvas>

      </div>
    </ContainerDevWrapper>
  );
}
