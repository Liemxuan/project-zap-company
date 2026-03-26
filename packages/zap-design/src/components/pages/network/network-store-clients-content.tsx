'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Badge } from '../../../genesis/atoms/interactive/badge';

import { Store, Search, MapPin } from 'lucide-react';

export function NetworkStoreClientsContent() {
  const clients = Array.from({ length: 6 }, (_, i) => ({
    name: `Client Store ${i + 1}`, region: ['US-East', 'EU-Central', 'AP-South'][i % 3], transactions: `${(i + 1) * 420}`, tier: ['Bronze', 'Silver', 'Gold'][i % 3],
  }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Store Clients</h1>
        <div className="relative md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input className="w-full h-10 pl-10 pr-4 rounded-xl border bg-layer-dialog text-sm outline-none" placeholder="Search clients..." /></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((c, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-muted/30 flex items-center justify-center"><Store size={20} className="text-muted-foreground group-hover:text-primary" /></div>
                <div><h3 className="text-sm font-bold">{c.name}</h3><p className="text-[10px] text-muted-foreground uppercase flex items-center gap-1"><MapPin size={10} /> {c.region}</p></div>
              </div>
              <div className="flex justify-between">
                <Badge variant="outline" className="text-[8px] font-bold uppercase">{c.tier}</Badge>
                <span className="text-xs font-black italic">{c.transactions} txns</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
