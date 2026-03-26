'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from '../../genesis/molecules/menubar';

export interface PageMenuItem {
  title: string;
  path?: string;
  children?: PageMenuItem[];
}

interface PageMenuProps {
  items: PageMenuItem[];
  className?: string;
}

export function PageMenu({ items, className }: PageMenuProps) {
  const pathname = usePathname();

  const isActive = (path?: string) => {
    if (!path) return false;
    return pathname === path || pathname.startsWith(path + '/');
  };

  const hasActiveChild = (children?: PageMenuItem[]): boolean => {
    if (!children) return false;
    return children.some(child => isActive(child.path) || hasActiveChild(child.children));
  };

  const renderItems = (menuItems: PageMenuItem[]) => {
    return menuItems.map((item, index) => {
      const active = isActive(item.path);
      const here = hasActiveChild(item.children);

      if (item.children) {
        return (
          <MenubarMenu key={index}>
            <MenubarTrigger
              className={cn(
                "relative flex items-center gap-2 px-4 h-12 text-sm font-bold transition-all duration-300 rounded-none border-b-2 bg-transparent!",
                "hover:text-primary hover:bg-transparent focus:text-primary focus:bg-transparent",
                "data-[state=open]:text-primary",
                (active || here) ? "text-primary border-primary" : "text-on-surface-variant text-transform-secondary/80 border-transparent"
              )}
            >
              {item.title}
              <ChevronDown className="size-3.5 transition-transform duration-300 group-data-[state=open]:rotate-180" />
              {(active || here) && (
                <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary animate-in fade-in slide-in-from-bottom-1" />
              )}
            </MenubarTrigger>
            <MenubarContent className="min-w-[200px] p-2 rounded-2xl shadow-[var(--md-sys-elevation-level3)] border-outline-variant/40">
              {renderSubMenu(item.children)}
            </MenubarContent>
          </MenubarMenu>
        );
      }

      return (
        <MenubarMenu key={index}>
          <MenubarTrigger
            asChild
            className={cn(
              "relative flex items-center px-4 h-12 text-sm font-bold transition-all duration-300 rounded-none border-b-2 bg-transparent!",
              "hover:text-primary hover:bg-transparent focus:text-primary focus:bg-transparent",
              active ? "text-primary border-primary" : "text-on-surface-variant text-transform-secondary/80 border-transparent"
            )}
          >
            <Link href={item.path || '#'}>
              {item.title}
              {active && (
                <span className="absolute bottom-[-2px] left-0 right-0 h-[2px] bg-primary animate-in fade-in slide-in-from-bottom-1" />
              )}
            </Link>
          </MenubarTrigger>
        </MenubarMenu>
      );
    });
  };

  const renderSubMenu = (menuItems: PageMenuItem[]) => {
    return menuItems.map((item, index) => {
      const active = isActive(item.path);
      const here = hasActiveChild(item.children);

      if (item.children) {
        return (
          <MenubarSub key={index}>
            <MenubarSubTrigger
              className={cn(
                "rounded-xl font-medium",
                (active || here) && "text-primary bg-primary/5"
              )}
            >
              {item.title}
            </MenubarSubTrigger>
            <MenubarSubContent className="min-w-[200px] p-2 rounded-2xl shadow-[var(--md-sys-elevation-level3)] border-outline-variant/40">
              {renderSubMenu(item.children)}
            </MenubarSubContent>
          </MenubarSub>
        );
      }

      return (
        <MenubarItem
          key={index}
          asChild
          className={cn(
            "rounded-xl font-medium cursor-pointer",
            active && "text-primary bg-primary/5"
          )}
        >
          <Link href={item.path || '#'}>{item.title}</Link>
        </MenubarItem>
      );
    });
  };

  return (
    <div className={cn("w-full border-b border-outline-variant/40 bg-surface/60 backdrop-blur-md", className)}>
      <Menubar className="flex items-stretch gap-2 border-none bg-transparent p-0 h-auto overflow-x-auto no-scrollbar">
        {renderItems(items)}
      </Menubar>
    </div>
  );
}
