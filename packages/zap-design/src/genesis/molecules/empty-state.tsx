'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent 
} from '../../genesis/molecules/card';
import { Button } from '../../genesis/atoms/interactive/button';
import { cn } from '../../lib/utils';

interface EmptyStateProps {
  image?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
  secondaryActionLabel?: string;
  secondaryActionHref?: string;
  className?: string;
}

export function EmptyState({
  image = '/media/illustrations/11.svg',
  title = 'No records found',
  description = 'There are no items to show here right now.',
  actionLabel = 'Get Started',
  actionHref = '#',
  secondaryActionLabel,
  secondaryActionHref,
  className
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-stretch gap-6", className)}>
      <Card className="p-8 lg:p-14">
        <CardContent className="flex flex-col items-center text-center gap-6">
          <div className="flex justify-center py-4 bg-surface-variant/30 rounded-full p-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              className="max-h-[160px] opacity-90 drop-shadow-sm"
              alt="No data"
            />
          </div>
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold tracking-tight text-on-surface text-transform-primary">
              {title}
            </h3>
            <p className="text-sm text-on-surface-variant text-transform-secondary max-w-[280px] mx-auto leading-relaxed">
              {description}
            </p>
          </div>

          <Button asChild size="lg" className="rounded-full px-8 shadow-md">
            <Link href={actionHref}>
              {actionLabel}
            </Link>
          </Button>
        </CardContent>
      </Card>

      {secondaryActionLabel && (
        <div className="flex grow justify-center pt-2">
          <Button variant="ghost" className="font-semibold text-primary" asChild>
            <Link href={secondaryActionHref || "#"}>
              {secondaryActionLabel}
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
