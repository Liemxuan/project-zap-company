'use client';

import * as React from 'react';
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '../../../genesis/atoms/interactive/inputs';

import { cn } from '../../../lib/utils';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface PasswordInputGroupProps extends React.ComponentProps<typeof Input> {
  // Any additional props can go here
}

export function PasswordInputGroup({ className, ...props }: PasswordInputGroupProps) {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  return (
    <div data-slot="password-input-group" className="relative group">
      <Input
        {...props}
        type={isVisible ? 'text' : 'password'}
        className={cn("pr-12", className)}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-0 top-0 h-full px-4 flex items-center justify-center text-muted-foreground hover:text-primary transition-colors focus:outline-none"
        aria-label={isVisible ? "Hide password" : "Show password"}
      >
        {isVisible ? (
          <EyeOff className="size-4 animate-in fade-in zoom-in-75 duration-200" aria-hidden="true" />
        ) : (
          <Eye className="size-4 animate-in fade-in zoom-in-75 duration-200" aria-hidden="true" />
        )}
      </button>
    </div>
  );
}
