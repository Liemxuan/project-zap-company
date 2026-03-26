'use client';

import * as React from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '../../genesis/atoms/interactive/button';
import { cn } from '../../lib/utils';

interface AuthBackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export function AuthBackButton({ 
  href = '/signin', 
  label = 'Back', 
  className 
}: AuthBackButtonProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <Button type="button" variant="outline" className="w-full" asChild>
        <Link href={href}>
          <ArrowLeft className="size-3.5" /> {label}
        </Link>
      </Button>
    </div>
  );
}
