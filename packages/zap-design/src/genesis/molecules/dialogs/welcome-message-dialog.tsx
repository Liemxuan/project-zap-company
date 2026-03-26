'use client';

import * as React from 'react';
import Link from 'next/link';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogBody } from '../../../genesis/molecules/dialog';

export interface WelcomeMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function WelcomeMessageDialog({ open, onOpenChange }: WelcomeMessageDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[500px]">
        <DialogHeader className="border-0">
          <DialogTitle className="sr-only">Welcome to ZAP</DialogTitle>
          <DialogDescription className="sr-only">Welcome greeting and onboarding options.</DialogDescription>
        </DialogHeader>
        <DialogBody className="flex flex-col items-center pt-10 pb-10">
          <div className="mb-10 w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
             {/* M3 Placeholder Graphic for the illustration */}
            <span className="text-5xl font-black text-primary drop-shadow-sm">Z</span>
          </div>

          <h3 className="text-2xl font-black tracking-tight text-on-surface text-transform-primary text-center mb-3">
            Welcome to ZAP
          </h3>

          <div className="text-base text-center text-on-surface-variant text-transform-secondary mb-7 font-medium">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            We're thrilled to have you on board and excited for <br />
            the journey ahead together.
          </div>

          <div className="flex flex-col w-full max-w-xs gap-3">
            <Link 
              href="/" 
              className="flex items-center justify-center bg-primary text-primary-foreground hover:bg-primary/90 rounded-lg px-4 py-2.5 font-bold transition-colors"
              onClick={() => onOpenChange(false)}
            >
              Show me around
            </Link>

            <button
              onClick={() => onOpenChange(false)}
              className="text-sm font-bold text-on-surface-variant text-transform-secondary hover:text-on-surface text-transform-primary py-2 transition-colors"
            >
              Skip the tour
            </button>
          </div>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
}
