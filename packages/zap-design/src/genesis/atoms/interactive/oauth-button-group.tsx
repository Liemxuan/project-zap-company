'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';
import { Button } from '../../../genesis/atoms/interactive/button';

interface OAuthButtonGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function OAuthButtonGroup({ children, className, ...props }: OAuthButtonGroupProps) {
  return (
    <div 
      data-slot="oauth-button-group"
      className={cn("flex flex-col gap-3", className)} 
      {...props}
    >
      {children}
    </div>
  );
}

interface OAuthButtonProps extends React.ComponentProps<typeof Button> {
  icon?: React.ReactNode;
}

export function OAuthButton({ children, icon, className, ...props }: OAuthButtonProps) {
  return (
    <Button
      variant="outline"
      className={cn(
        "h-11 w-full flex items-center justify-center gap-3 font-bold border-border/60 hover:border-primary/40 hover:bg-primary/5 transition-all",
        className
      )}
      {...props}
    >
      {icon && <span className="size-5 flex items-center justify-center">{icon}</span>}
      {children}
    </Button>
  );
}
