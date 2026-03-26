'use client';

import * as React from 'react';
import Link from 'next/link';
import { LucideIcon, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { Card } from '../../genesis/molecules/card';

export interface OptionsCardItem {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  badge?: string;
}

interface OptionsCardProps extends React.HTMLAttributes<HTMLDivElement> {
  item: OptionsCardItem;
  href?: string;
}

export function OptionsCard({ item, href, className, ...props }: OptionsCardProps) {
  const targetHref = href || item.path;

  return (
    <Card
      data-slot="options-card"
      className={cn(
        "group relative overflow-hidden p-6 hover:shadow-[var(--md-sys-elevation-level2)] transition-all duration-300 border-outline-variant/40 hover:border-primary/40 rounded-3xl",
        className
      )}
      {...props}
    >
      <div className="flex flex-col gap-5">
        <div className="flex items-center justify-between">
          <div className="size-12 rounded-2xl bg-primary/5 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-500">
            <item.icon className="size-6" />
          </div>
          {item.badge && (
            <span className="px-2.5 py-0.5 rounded-full bg-secondary text-[10px] font-black uppercase tracking-wider text-secondary-foreground">
              {item.badge}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <Link
            href={targetHref}
            className="text-lg font-black tracking-tight text-on-surface text-transform-primary group-hover:text-primary transition-colors flex items-center gap-1"
          >
            {item.title}
            <ChevronRight className="size-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
          </Link>
          <p className="text-sm text-on-surface-variant text-transform-secondary/80 leading-relaxed max-w-[240px]">
            {item.description}
          </p>
        </div>
      </div>
      
      {/* Subtle background glow on hover */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </Card>
  );
}

export function OptionsGrid({ children, className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div 
      className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", className)}
      {...props}
    >
      {children}
    </div>
  );
}
