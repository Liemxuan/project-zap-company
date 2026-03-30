'use client';

import React from 'react';
import { cn } from '../../lib/utils';

export const MerchantLayout = ({ 
  children, 
  style 
}: { 
  children: React.ReactNode, 
  style?: React.CSSProperties 
}) => {
  return (
    <div 
      className="bg-layer-base font-body flex transition-all duration-300"
      style={Object.assign({}, style, {
        width: '100%',
        height: '100%'
      })}
    >
      {children}
    </div>
  );
};

export type MerchantNavItem = {
  id: string;
  label: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
};

import { Sheet, SheetContent, SheetTrigger, SheetTitle } from '../molecules/sheet';
import { Menu } from 'lucide-react';
import { Button } from '../atoms/interactive/button';

export const MerchantSideNav = ({ 
  activeDepartment,
  navItems,
  bottomSlot
}: { 
  activeDepartment?: string;
  navItems: MerchantNavItem[];
  bottomSlot?: React.ReactNode;
}) => {
  const NavItemsList = (
    <div className="flex-1 flex flex-col h-full bg-layer-panel">
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-1 scrollbar-hide">
        {navItems.map((item) => {
          const isActive = activeDepartment === item.id;
          return (
            <div 
              key={item.id}
              onClick={item.onClick}
              className={cn(
                "relative flex items-center gap-3 py-2 px-3 rounded-md transition-all duration-300 outline-none w-full text-left cursor-pointer tracking-tight font-body",
                isActive ? "bg-primary-container text-on-primary-container font-bold shadow-[var(--md-sys-elevation-level1)]" : "text-on-surface-variant opacity-70 hover:text-on-surface hover:bg-on-surface/5 hover:opacity-100"
              )}
            >
              {/* Internal indicator for exact ZAP standard match */}
              {isActive && (
                <div className="absolute left-[-16px] top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--sys-color-primary-rgb),0.6)]" />
              )}
              
              <div 
                className={cn(
                  "shrink-0 transition-colors",
                  isActive ? "text-primary" : "text-on-surface-variant opacity-70"
                )}
              >
                {item.icon}
              </div>
              
              <span 
                className={cn(
                  "font-body text-bodyMedium tracking-tight whitespace-nowrap overflow-hidden text-ellipsis transition-colors"
                )}
              >
                {item.label}
              </span>
            </div>
          );
        })}
      </div>
      {bottomSlot && (
        <div className="p-3 border-t border-black/10 dark:border-white/10 shrink-0">
          {bottomSlot}
        </div>
      )}
    </div>
  );

  return (
    <>
      <div className="md:hidden fixed bottom-6 left-6 z-[200]">
        <Sheet>
          <SheetTrigger asChild>
            <Button size="icon" variant="primary" className="rounded-full w-14 h-14 shadow-lg">
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 w-[280px] border-r border-black" showCloseButton={false}>
            <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
            {NavItemsList}
          </SheetContent>
        </Sheet>
      </div>

      <aside 
        className="hidden md:flex shrink-0 border-r border-black bg-layer-panel text-on-surface text-transform-primary flex-col transition-all duration-300 z-[100]"
        style={Object.assign({}, {
          width: 'var(--merchant-sidenav-width, 256px)',
          height: '100%'
        })}
      >
        {NavItemsList}
      </aside>
    </>
  );
};

export const MerchantCanvas = ({ children }: { children: React.ReactNode }) => {
  return (
    <main 
      className="flex-1 overflow-x-hidden overflow-y-auto bg-layer-canvas transition-all duration-300"
      style={Object.assign({}, { 
        padding: 'var(--merchant-canvas-padding, 32px)' 
      })}
    >
      {children}
    </main>
  );
};
