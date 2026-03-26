import * as React from 'react';
import { cn } from '../../../lib/utils';

export interface NavbarProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

export function Navbar({ children, className, ...props }: NavbarProps) {
  return (
    <header className={cn("sticky top-0 z-40 w-full border-b border-outline-variant bg-surface/95 backdrop-blur supports-[backdrop-filter]:bg-surface/60", className)} {...props}>
      <div className="container flex h-16 items-center flex-wrap gap-4 justify-between">
        {children}
      </div>
    </header>
  );
}

export function NavbarBrand({ children, className, ...props }: NavbarProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      {children}
    </div>
  );
}

export function NavbarNav({ children, className, ...props }: NavbarProps) {
  return (
    <nav className={cn("flex items-center gap-6 text-sm font-medium", className)} {...props}>
      {children}
    </nav>
  );
}

export function NavbarActions({ children, className, ...props }: NavbarProps) {
  return (
    <div className={cn("flex flex-1 items-center justify-end gap-2", className)} {...props}>
      {children}
    </div>
  );
}
