import React from 'react';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Button } from '../../../../../genesis/atoms/interactive/buttons';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { useButtonProperties } from './use-button-properties';

export function ButtonBody() {
  const { variant, visualStyle, size, platform } = useButtonProperties();

  // If iOS or Android, applying simulated platform container styles
  const isMobile = platform === 'ios' || platform === 'android';

  return (
    <Wrapper identity={{ displayName: "Button Canvas Body", type: "Canvas", filePath: "zap/atoms/button/body.tsx" }}>
      <div className="w-full space-y-12 animate-in fade-in duration-500 pb-16">

        {/* Main Hero Showcase */}
        <section className="space-y-6">
          <div className="flex items-center justify-start gap-2 text-muted-foreground px-2">
            <Icon name="visibility" size={14} className="opacity-60" />
            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary">Interactive Preview</h3>
          </div>
          
          <div className={cn(
            "bg-layer-panel rounded-[24px] border border-border/50 flex justify-center items-center overflow-hidden transition-all duration-300 relative",
            isMobile ? "max-w-sm mx-auto h-[600px] items-end pb-8 bg-surface-container" : "p-16 md:p-24 w-full"
          )}>
            {isMobile && (
               <div className="absolute top-4 w-1/3 h-1.5 bg-border/40 rounded-full" />
            )}
            
            <div className={cn(
               "flex flex-col gap-4 items-center w-full",
               isMobile ? "w-full px-4" : "w-auto"
            )}>
                <Button 
                variant={variant} 
                visualStyle={visualStyle} 
                size={size}
                className={cn(platform === 'ios' && size === 'expanded' && "rounded-full w-full")} // simple specific override just to show platform reactivity
                >
                <Icon name="favorite" size={18} />
                Action Button
                </Button>
            </div>
          </div>
        </section>

        {/* Matrix Row Showcase */}
        <section className="space-y-6 select-none">
          <div className="flex items-center justify-start gap-2 text-muted-foreground px-2">
            <Icon name="grid_view" size={14} className="opacity-60" />
            <h3 className="font-display text-titleSmall tracking-tight text-transform-primary">Component Scale</h3>
          </div>
          
          <div className="bg-layer-panel rounded-[24px] border border-border/50 p-8 md:p-12 overflow-hidden flex flex-col md:flex-row gap-8 justify-center items-center">
            
            <div className="flex flex-col items-center gap-4">
               <span className="text-[10px] font-secondary font-bold text-muted-foreground text-transform-secondary tracking-widest text-center">Icon Only</span>
               <Button variant={variant} visualStyle={visualStyle} size={size === 'expanded' ? 'expanded' : size === 'compact' ? 'compact' : 'icon'} aria-label="Add">
                 <Icon name="add" size={size === 'compact' ? 16 : size === 'expanded' ? 24 : 20} />
               </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
               <span className="text-[10px] font-secondary font-bold text-muted-foreground text-transform-secondary tracking-widest text-center">Text Only</span>
               <Button variant={variant} visualStyle={visualStyle} size={size}>
                 Submit
               </Button>
            </div>

            <div className="flex flex-col items-center gap-4">
               <span className="text-[10px] font-secondary font-bold text-muted-foreground text-transform-secondary tracking-widest text-center">Disabled</span>
               <Button variant={variant} visualStyle={visualStyle} size={size} disabled>
                 <Icon name="block" size={size === 'compact' ? 14 : size === 'expanded' ? 20 : 18} /> Disabled
               </Button>
            </div>

          </div>
        </section>
      </div>
    </Wrapper>
  );
}
