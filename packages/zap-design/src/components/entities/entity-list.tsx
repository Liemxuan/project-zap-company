'use client';

import * as React from 'react';
import { LayoutGrid, List } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '../../genesis/atoms/interactive/toggle-group';
import { Button } from '../../genesis/atoms/interactive/button';
import { cn } from '../../lib/utils';

export interface EntityListProps<T> {
  title?: string;
  items: T[];
  renderCard: (item: T, index: number) => React.ReactNode;
  renderRow: (item: T, index: number) => React.ReactNode;
  showMoreLabel?: string;
  onShowMore?: () => void;
  className?: string;
  gridClassName?: string;
}

export function EntityList<T>({
  title,
  items,
  renderCard,
  renderRow,
  showMoreLabel = 'Show more',
  onShowMore,
  className,
  gridClassName
}: EntityListProps<T>) {
  const [view, setView] = React.useState<'cards' | 'list'>('cards');

  return (
    <div className={cn("flex flex-col gap-6", className)}>
      <div className="flex flex-wrap items-center gap-5 justify-between">
        {title && (
          <h3 className="text-lg font-semibold text-foreground">
            {title}
          </h3>
        )}
        <ToggleGroup
          type="single"
          visualStyle="outline"
          value={view}
          onValueChange={(v) => v && setView(v as 'cards' | 'list')}
        >
          <ToggleGroupItem value="cards" aria-label="Card view">
            <LayoutGrid className="size-4" />
          </ToggleGroupItem>
          <ToggleGroupItem value="list" aria-label="List view">
            <List className="size-4" />
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {view === 'cards' ? (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6", gridClassName)}>
          {items.map((item, index) => renderCard(item, index))}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {items.map((item, index) => renderRow(item, index))}
        </div>
      )}

      {onShowMore && (
        <div className="flex justify-center pt-4">
          <Button variant="ghost" className="font-semibold" onClick={onShowMore}>
            {showMoreLabel}
          </Button>
        </div>
      )}
    </div>
  );
}
