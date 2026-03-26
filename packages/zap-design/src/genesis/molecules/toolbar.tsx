'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

interface ToolbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

function Toolbar({ children, className, ...props }: ToolbarProps) {
  return (
    <div 
      data-slot="toolbar"
      className={cn(
        "flex items-center justify-between flex-wrap gap-4 py-6 border-b border-outline-variant/40",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

function ToolbarActions({ children, className, ...props }: ToolbarProps) {
  return (
    <div 
      data-slot="toolbar-actions"
      className={cn("flex items-center flex-wrap gap-2", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ToolbarHeading({ children, className, ...props }: ToolbarProps) {
  return (
    <div 
      data-slot="toolbar-heading"
      className={cn("flex flex-col gap-0.5", className)}
      {...props}
    >
      {children}
    </div>
  );
}

function ToolbarTitle({ children, className, ...props }: ToolbarProps) {
  return (
    <h1 
      data-slot="toolbar-title"
      className={cn(
        "text-2xl font-black tracking-tighter text-on-surface text-transform-primary drop-shadow-sm",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

function ToolbarDescription({ children, className, ...props }: ToolbarProps) {
  return (
    <p 
      data-slot="toolbar-description"
      className={cn(
        "text-sm font-medium text-on-surface-variant text-transform-secondary leading-none",
        className
      )}
      {...props}
    >
      {children}
    </p>
  );
}

function ToolbarPageTitle({ children, className, ...props }: ToolbarProps) {
  return (
    <div 
      data-slot="toolbar-page-title"
      className={cn(
        "flex items-center gap-2 text-sm font-bold text-on-surface-variant text-transform-secondary uppercase tracking-widest",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export { 
  Toolbar, 
  ToolbarActions, 
  ToolbarHeading, 
  ToolbarTitle, 
  ToolbarDescription, 
  ToolbarPageTitle 
};
