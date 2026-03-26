'use client';

import * as React from 'react';
import Link from 'next/link';
import { Checkbox } from '../../genesis/atoms/interactive/checkbox';
import { cn } from '../../lib/utils';

interface AuthPrivacyPolicyProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function AuthPrivacyPolicy({
  id = 'accept',
  checked,
  onCheckedChange,
  className
}: AuthPrivacyPolicyProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(val) => onCheckedChange?.(!!val)}
      />
      <div className="flex items-center gap-1.5 leading-none">
        <label
          htmlFor={id}
          className="text-sm text-muted-foreground font-medium cursor-pointer"
        >
          I agree to the
        </label>
        <Link
          href="/privacy-policy"
          target="_blank"
          className="text-sm font-semibold text-foreground hover:text-primary transition-colors"
        >
          Privacy Policy
        </Link>
      </div>
    </div>
  );
}
