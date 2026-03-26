'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';

import { Button } from '../../../genesis/atoms/interactive/button';
import { UserPlus } from 'lucide-react';

export function NetworkMiniCardsContent() {
  const cards = Array.from({ length: 12 }, (_, i) => ({
    name: `Node ${i + 1}`, role: ['Engineer', 'Designer', 'Analyst', 'Operator'][i % 4], location: ['US-East', 'EU-Central', 'AP-South', 'Global'][i % 4],
  }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Mini Cards</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
        {cards.map((c, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-all cursor-pointer text-center overflow-hidden">
            <CardContent className="pt-5 pb-4 space-y-2">
              <div className="size-12 rounded-full bg-zinc-200 dark:bg-zinc-800 mx-auto flex items-center justify-center text-sm font-black">{c.name.split(' ')[1]}</div>
              <h3 className="text-xs font-bold truncate">{c.name}</h3>
              <p className="text-[9px] text-muted-foreground uppercase">{c.role}</p>
              <Button variant="ghost" size="sm" className="w-full text-[9px] font-bold uppercase opacity-0 group-hover:opacity-100 transition-opacity"><UserPlus size={10} className="mr-1" /> Connect</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
