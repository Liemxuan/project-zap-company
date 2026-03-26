'use client';

import * as React from 'react';
import { Checkbox } from '../../genesis/atoms/interactive/checkbox';
import { cn } from '../../lib/utils';

interface AuthRememberMeProps {
  id?: string;
  label?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export function AuthRememberMe({
  id = 'remember-me',
  label = 'Remember me',
  checked,
  onCheckedChange,
  className
}: AuthRememberMeProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(val) => onCheckedChange?.(!!val)}
      />
      <label
        htmlFor={id}
        className="text-sm leading-none text-muted-foreground font-medium cursor-pointer"
      >
        {label}
      </label>
    </div>
  );
}
