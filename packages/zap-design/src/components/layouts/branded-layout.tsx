'use client';

import * as React from 'react';
import Link from 'next/link';

export function BrandedLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="grid lg:grid-cols-2 grow min-h-screen">
        <div className="flex justify-center items-center p-8 lg:p-10 order-2 lg:order-1 bg-background">
          <div className="w-full max-w-[400px]">
            {children}
          </div>
        </div>

        <div className="lg:rounded-xl lg:border lg:border-border lg:m-5 order-1 lg:order-2 bg-top xxl:bg-center xl:bg-cover bg-no-repeat bg-muted/30 relative overflow-hidden flex flex-col p-8 lg:p-16 gap-4">
          {/* M3 Ambient Background Gradient instead of a static image */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-background to-secondary/10 pointer-events-none" />
          
          <div className="relative z-10 flex flex-col gap-6 h-full justify-between">
            <Link href="/" className="inline-block">
              {/* Replace with Zap logo or icon */}
              <div className="size-10 bg-primary rounded-xl flex items-center justify-center text-primary-foreground font-black text-xl shadow-sm">
                Z
              </div>
            </Link>

            <div className="flex flex-col gap-3 max-w-md mt-auto mb-10">
              <h3 className="text-3xl font-black text-foreground drop-shadow-sm tracking-tight leading-tight">
                Secure Dashboard Access
              </h3>
              <div className="text-base font-medium text-muted-foreground/80 leading-relaxed">
                A robust authentication gateway ensuring
                <br /> secure &nbsp;
                <span className="text-foreground font-bold">
                  efficient user access
                </span>
                &nbsp; to the ZAP
                <br /> Dashboard interface.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
