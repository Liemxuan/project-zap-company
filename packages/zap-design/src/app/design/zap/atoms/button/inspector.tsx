import React from 'react';
import { Wrapper } from '../../../../../components/dev/Wrapper';
import { Icon } from '../../../../../genesis/atoms/icons/Icon';
import { cn } from '../../../../../lib/utils';
import { useButtonProperties } from './use-button-properties';
import { ButtonState } from './schema';

export function ButtonInspector() {
  const { variant, visualStyle, size, platform, setVariant, setVisualStyle, setSize, setPlatform } = useButtonProperties();

  return (
    <Wrapper identity={{ displayName: "Button Inspector Controls", type: "Container", filePath: "zap/atoms/button/inspector.tsx" }}>
      <div className="space-y-4">

        {/* Variant Style Section */}
        <Wrapper identity={{ displayName: "Button Variant Style", type: "Control Row", filePath: "zap/atoms/button/inspector.tsx" }}>
          <div className="space-y-4 pb-4 border-b border-border/50">
            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Variant Style</h4>
            <div className="grid grid-cols-2 gap-2">
              {(
                [
                  { id: 'flat', label: 'FLAT', icon: 'check_box_outline_blank' },
                  { id: 'soft', label: 'SOFT', icon: 'water_drop' },
                  { id: 'neo', label: 'NEO', icon: 'layers' },
                  { id: 'glow', label: 'GLOW', icon: 'bolt' }
                ] as const
              ).map((v) => (
                <button
                  key={v.id}
                  onClick={() => setVariant(v.id as ButtonState['variant'])}
                  className={cn(
                    "flex flex-col items-center justify-center py-4 gap-2 rounded-xl transition-all",
                    variant === v.id
                      ? "bg-primary/5 border-[1.5px] border-primary shadow-sm"
                      : "bg-layer-panel border border-border/50 text-muted-foreground hover:bg-surface-variant hover:text-foreground"
                  )}
                >
                  <Icon name={v.icon} size={20} className={variant === v.id ? "text-primary" : "opacity-60"} />
                  <span className={cn(
                    "text-[10px] tracking-widest font-secondary text-transform-secondary",
                    variant === v.id ? "text-primary font-black" : "font-bold"
                  )}>
                    {v.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </Wrapper>

        {/* Visual Style Section */}
        <Wrapper identity={{ displayName: "Button Visual Style", type: "Control Row", filePath: "zap/atoms/button/inspector.tsx" }}>
          <div className="space-y-4 pb-4 border-b border-border/50">
            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Visual Style</h4>
            <div className="flex bg-layer-panel p-1 border border-border/50 rounded-[calc(var(--button-border-radius,8px)+4px)]">
              {(['solid', 'outline', 'ghost'] as const).map((v) => (
                <button
                  key={v}
                  onClick={() => setVisualStyle(v as ButtonState['visualStyle'])}
                  className={cn(
                    "flex-1 py-1.5 text-[11px] font-bold font-display text-transform-primary rounded-md transition-all",
                    visualStyle === v
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-muted-foreground hover:bg-surface-variant hover:text-foreground"
                  )}
                >
                  {v}
                </button>
              ))}
            </div>
          </div>
        </Wrapper>

        {/* Size Selection */}
        <Wrapper identity={{ displayName: "Button Size", type: "Control Row", filePath: "zap/atoms/button/inspector.tsx" }}>
          <div className="space-y-4 pb-4 border-b border-border/50">
            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Size</h4>
            <div className="flex bg-layer-panel p-1 border border-border/50 rounded-lg">
              {(['default', 'tiny', 'compact', 'medium', 'expanded'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s as ButtonState['size'])}
                  className={cn(
                    "flex-1 py-1.5 text-[11px] font-bold font-display text-transform-primary rounded-md transition-all",
                    size === s
                      ? "bg-primary text-on-primary shadow-sm"
                      : "text-muted-foreground hover:bg-surface-variant hover:text-foreground"
                  )}
                >
                  {s === 'default' ? 'Dynamic' : s}
                </button>
              ))}
            </div>
          </div>
        </Wrapper>

        {/* Platform Simulator */}
        <Wrapper identity={{ displayName: "Platform Simulator", type: "Control Row", filePath: "zap/atoms/button/inspector.tsx" }}>
          <div className="space-y-4 pb-4 border-b border-border/50">
            <h4 className="text-[10px] text-transform-primary font-display font-bold text-muted-foreground tracking-wider">Platform Constraints</h4>
            <div className="flex gap-2">
              {(['agnostic', 'ios', 'android'] as const).map((p) => (
                <button
                  key={p}
                  onClick={() => setPlatform(p as ButtonState['platform'])}
                  className={cn(
                    "px-3 py-1.5 text-[11px] font-bold font-display text-transform-primary rounded-md transition-all border border-border/50",
                    platform === p
                      ? "bg-primary/10 text-primary border-primary"
                      : "bg-layer-panel text-muted-foreground hover:bg-surface-variant"
                  )}
                >
                  {p === 'ios' ? 'iOS' : p === 'android' ? 'Android' : 'Agnostic'}
                </button>
              ))}
            </div>
          </div>
        </Wrapper>

      </div>
    </Wrapper>
  );
}
