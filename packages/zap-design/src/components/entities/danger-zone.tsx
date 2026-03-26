'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../genesis/molecules/card';
import { Button } from '../../genesis/atoms/interactive/button';
import { Checkbox } from '../../genesis/atoms/interactive/checkbox';
import { Label } from '../../genesis/atoms/interactive/label';
import { cn } from '../../lib/utils';

interface DangerZoneProps {
  title?: string;
  description?: string;
  confirmLabel?: string;
  actionLabel?: string;
  secondaryActionLabel?: string;
  onAction?: () => void;
  onSecondaryAction?: () => void;
  className?: string;
}

export function DangerZone({
  title = 'Delete Account',
  description = 'We regret to see you leave. Confirm account deletion below. Your data will be permanently removed.',
  confirmLabel = 'Confirm account deletion',
  actionLabel = 'Delete Account',
  secondaryActionLabel = 'Deactivate Instead',
  onAction,
  onSecondaryAction,
  className
}: DangerZoneProps) {
  const [confirmed, setConfirmed] = React.useState(false);

  return (
    <Card className={cn("border-destructive/20", className)}>
      <CardHeader>
        <CardTitle className="text-destructive">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4">
          <div className="text-sm text-muted-foreground leading-relaxed">
            {description}
            {""}Please check our{''}
            <Link href="#" className="text-primary font-semibold hover:underline">
              Setup Guidelines
            </Link>{''}
            if you still wish continue.
          </div>
          
          <div className="flex items-center space-x-2 bg-destructive/5 p-3 rounded-lg border border-destructive/10">
            <Checkbox 
              id="danger-confirm" 
              checked={confirmed}
              onCheckedChange={(val) => setConfirmed(!!val)}
            />
            <Label 
              htmlFor="danger-confirm"
              className="text-sm font-medium cursor-pointer"
            >
              {confirmLabel}
            </Label>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button 
            variant="outline" 
            onClick={onSecondaryAction}
            asChild
          >
            <Link href="#">{secondaryActionLabel}</Link>
          </Button>
          <Button 
            variant="destructive" 
            disabled={!confirmed}
            onClick={onAction}
            asChild
          >
            <Link href="#">{actionLabel}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
