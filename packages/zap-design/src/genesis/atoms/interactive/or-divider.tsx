'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

interface OrDividerProps extends React.HTMLAttributes<HTMLDivElement> {
  label?: string;
}

export function OrDivider({ label = 'or', className, ...props }: OrDividerProps) {
  return (
    <div 
      data-slot="or-divider"
      className={cn("relative py-4", className)} 
      {...props}
    >
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t border-border/60" />
      </div>
      <div className="relative flex justify-center text-[10px] font-black uppercase tracking-[0.2em]">
        <span className="bg-background px-4 text-muted-foreground/60 drop-shadow-sm">
          {label}
        </span>
      </div>
    </div>
  );
}
