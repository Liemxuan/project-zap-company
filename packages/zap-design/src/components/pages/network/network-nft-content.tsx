'use client';

import * as React from 'react';


import { Button } from '../../../genesis/atoms/interactive/button';
import { Box, Heart } from 'lucide-react';

export function NetworkNFTContent() {
  const items = Array.from({ length: 8 }, (_, i) => ({
    name: `Artifact #${100 + i}`, price: `${(0.1 + i * 0.08).toFixed(2)} ETH`, creator: `Creator ${i + 1}`,
  }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">NFT Directory</h1>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((item, i) => (
          <div key={i} className="p-2 rounded-2xl border bg-layer-dialog group hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer">
            <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-3 relative overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center"><Box className="text-muted-foreground/10" size={32} /></div>
              <Button variant="ghost" size="sm" mode="icon" className="absolute top-2 right-2 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500"><Heart size={14} /></Button>
            </div>
            <div className="px-1 pb-1 space-y-0.5">
              <h3 className="text-[10px] font-bold truncate">{item.name}</h3>
              <p className="text-[9px] text-muted-foreground truncate">{item.creator}</p>
              <p className="text-xs font-black italic text-primary">{item.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
