'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import {  Star, Search } from 'lucide-react';

export function NetworkMarketAuthorsContent() {
  const authors = Array.from({ length: 6 }, (_, i) => ({
    name: `Market Author ${i + 1}`, items: 12 + i * 7, rating: (4 + ((i % 5) / 5) * 0.9).toFixed(1), sales: `${(i + 1) * 1.2}k`,
  }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Market Authors</h1>
        <div className="relative md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input className="w-full h-10 pl-10 pr-4 rounded-xl border bg-layer-dialog text-sm outline-none" placeholder="Search authors..." /></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {authors.map((a, i) => (
          <Card key={i} className="group hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-2xl bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xl font-black">{a.name.split(' ').pop()?.[0]}</div>
                <div><h3 className="text-sm font-bold">{a.name}</h3><div className="flex items-center gap-1"><Star size={12} className="text-amber-400 fill-amber-400" /><span className="text-xs font-bold">{a.rating}</span></div></div>
              </div>
              <div className="flex justify-between text-[10px] uppercase font-black text-muted-foreground tracking-widest">
                <span>{a.items} Items</span><span>{a.sales} Sales</span>
              </div>
              <Button variant="outline" className="w-full text-[10px] uppercase font-bold">View Portfolio</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
