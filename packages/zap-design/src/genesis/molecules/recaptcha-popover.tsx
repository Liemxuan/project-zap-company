'use client';

import * as React from 'react';
import { RiErrorWarningFill } from '@remixicon/react';
import { toast } from 'sonner';
import { useRecaptchaV2 } from '../../hooks/use-recaptcha-v2';
import { Alert, AlertIcon, AlertTitle } from '../../genesis/molecules/alert';
import { Button } from '../../genesis/atoms/interactive/button';
import { Popover, PopoverTrigger, PopoverContent } from '../../genesis/molecules/popover';
import { cn } from '../../lib/utils';

interface RecaptchaPopoverProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onVerify: (token: string) => void;
  trigger: React.ReactNode;
  verifyButtonText?: string;
  className?: string;
}

export function RecaptchaPopover({
  open,
  onOpenChange,
  onVerify,
  trigger,
  verifyButtonText = 'Verify & Submit',
  className,
}: RecaptchaPopoverProps) {
  const { containerRef, getToken, resetCaptcha, initializeRecaptcha } =
    useRecaptchaV2(process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || '');

  const handleOpenChange = (newOpen: boolean) => {
    onOpenChange(newOpen);
    if (newOpen) {
      resetCaptcha();
      // Small delay to ensure the popover content is rendered
      setTimeout(() => {
        initializeRecaptcha();
      }, 100);
    }
  };

  const handleVerify = () => {
    try {
      const token = getToken();
      if (!token) {
        toast.custom(
          () => (
            <Alert variant="destructive" className="max-w-xs shadow-2xl">
              <AlertIcon>
                <RiErrorWarningFill className="size-5" />
              </AlertIcon>
              <AlertTitle>
                Please complete the reCAPTCHA verification.
              </AlertTitle>
            </Alert>
          ),
          {
            position: 'top-center',
          },
        );
        return;
      }
      onVerify(token);
    } catch (error) {
      console.error('Error getting reCAPTCHA token:', error);
      toast.custom(
        () => (
          <Alert variant="destructive" className="max-w-xs shadow-2xl">
            <AlertIcon>
              <RiErrorWarningFill className="size-5" />
            </AlertIcon>
            <AlertTitle>Verification failed. Try again.</AlertTitle>
          </Alert>
        ),
        {
          position: 'top-center',
        },
      );
      return;
    }
  };

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>{trigger}</PopoverTrigger>

      <PopoverContent
        className={cn("w-auto p-6 bg-surface rounded-2xl shadow-[var(--md-sys-elevation-level3)] border-outline-variant/40 z-[100]", className)}
        sideOffset={12}
        align="end"
        onInteractOutside={(e) => {
          // Prevent closing when interacting with reCAPTCHA iframe
          if ((e.target as HTMLElement).tagName === 'IFRAME') {
            e.preventDefault();
          }
        }}
      >
        <div className="flex flex-col gap-6">
          <div className="space-y-1">
            <h3 className="text-sm font-black uppercase tracking-wider text-on-surface-variant text-transform-secondary/80">Security Check</h3>
            <p className="text-xs text-on-surface-variant text-transform-secondary">Please prove you&apos;re not a bot.</p>
          </div>
          
          <div ref={containerRef} className="min-h-[78px] bg-surface-variant/5 rounded-lg flex items-center justify-center border border-dashed border-outline-variant/60" />
          
          <Button
            type="button"
            onClick={handleVerify}
            className="w-full h-11 font-black uppercase tracking-widest text-xs"
          >
            {verifyButtonText}
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
