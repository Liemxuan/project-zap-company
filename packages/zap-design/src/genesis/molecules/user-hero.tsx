'use client';

import * as React from 'react';
import Link from 'next/link';
import { LucideIcon, CheckCircle2 } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface UserHeroInfo {
  email?: string;
  label?: string;
  icon?: LucideIcon | null;
}

export interface UserHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  image?: React.ReactNode;
  name?: string;
  info: UserHeroInfo[];
}

export function UserHero({ 
  image, 
  name, 
  info, 
  className,
  ...props 
}: UserHeroProps) {
  return (
    <div
      data-slot="user-hero"
      className={cn(
        "relative w-full overflow-hidden bg-center bg-cover bg-no-repeat rounded-2xl border border-outline-variant/40 shadow-xl",
        className
      )}
      {...props}
    >
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-surface/40 backdrop-blur-[2px]" />
      
      <div className="relative flex flex-col items-center gap-6 py-12 px-6">
        {/* Profile Image Container */}
        <div className="relative z-10 group transition-transform duration-500 hover:scale-105">
          <div className="absolute inset-0 bg-primary/20 rounded-full blur-2xl group-hover:bg-primary/30 transition-colors" />
          <div className="relative">
            {image}
          </div>
        </div>

        {/* Identity Section */}
        <div className="flex flex-col items-center gap-2 text-center z-10">
          <div className="flex items-center gap-2">
            <h1 className="text-3xl font-black tracking-tighter text-on-surface text-transform-primary drop-shadow-sm">
              {name}
            </h1>
            <div className="bg-primary/20 p-1 rounded-full">
              <CheckCircle2 className="size-5 text-primary" fill="currentColor" fillOpacity={0.2} />
            </div>
          </div>

          {/* Info Chips */}
          <div className="flex flex-wrap justify-center gap-4 mt-2">
            {info.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-1.5 px-3 py-1 transparent-blur border border-white/10 rounded-full text-sm font-bold text-on-surface text-transform-primary/80 hover:text-primary transition-colors cursor-default"
              >
                {item.icon && <item.icon className="size-4 opacity-70" />}
                {item.email ? (
                  <Link href={`mailto:${item.email}`} className="hover:underline">
                    {item.email}
                  </Link>
                ) : (
                  <span>{item.label}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .transparent-blur {
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(8px);
        }
        :global(.dark) .transparent-blur {
          background: rgba(0, 0, 0, 0.2);
        }
     `}</style>
    </div>
  );
}
