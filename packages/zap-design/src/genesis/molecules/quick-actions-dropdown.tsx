'use client';

import * as React from 'react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '../../genesis/molecules/dropdown-menu';
import { cn } from '../../lib/utils';
import { LucideIcon, MoreHorizontal } from 'lucide-react';

export interface QuickAction {
  label: string;
  icon?: LucideIcon;
  onClick?: () => void;
  variant?: 'default' | 'destructive';
  shortcut?: string;
  disabled?: boolean;
}

interface QuickActionsDropdownProps {
  trigger?: React.ReactNode;
  actions: QuickAction[];
  label?: string;
  align?: 'start' | 'center' | 'end';
  className?: string;
}

export function QuickActionsDropdown({ 
  trigger, 
  actions, 
  label,
  align = 'end',
  className 
}: QuickActionsDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger || (
          <button title="Quick Actions" className="flex items-center justify-center size-9 rounded-full hover:bg-surface-variant transition-colors outline-none focus-visible:ring-[length:var(--input-focus-width,2px)] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))]">
            <MoreHorizontal className="size-5 text-on-surface-variant text-transform-secondary" />
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align={align} 
        className={cn("w-56 p-2 rounded-2xl shadow-[var(--md-sys-elevation-level3)] border-outline-variant/40", className)}
      >
        {label && (
          <>
            <DropdownMenuLabel className="px-3 py-2 text-[10px] font-black uppercase tracking-widest text-on-surface-variant text-transform-secondary/60">
              {label}
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="opacity-50" />
          </>
        )}
        <div className="flex flex-col gap-0.5">
          {actions.map((action, index) => (
            <DropdownMenuItem
              key={index}
              disabled={action.disabled}
              onClick={action.onClick}
              className={cn(
                "rounded-xl px-3 py-2.5 flex items-center gap-3 font-semibold transition-all cursor-pointer",
                action.variant === 'destructive' && "text-error hover:bg-error/10 focus:bg-error/10"
              )}
            >
              {action.icon && <action.icon className={cn("size-4 opacity-70", action.variant === 'destructive' && "text-error")} />}
              <span className="flex-1">{action.label}</span>
              {action.shortcut && (
                <span className="text-[10px] font-black uppercase opacity-40 ml-auto tracking-widest">
                  {action.shortcut}
                </span>
              )}
            </DropdownMenuItem>
          ))}
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
