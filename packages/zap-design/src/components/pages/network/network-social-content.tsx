'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';

import { Button } from '../../../genesis/atoms/interactive/button';
import { MessageSquare, Users } from 'lucide-react';

export function NetworkSocialContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Social Network</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }, (_, i) => (
          <Card key={i} className="group hover:shadow-md transition-all overflow-hidden">
            <div className="h-24 bg-gradient-to-br from-primary/10 to-primary/5" />
            <CardContent className="-mt-8 text-center space-y-3 pb-6">
              <div className="size-16 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 mx-auto flex items-center justify-center text-lg font-black shadow">{i + 1}</div>
              <div><h3 className="text-sm font-bold">Social Node {i + 1}</h3><p className="text-[10px] text-muted-foreground uppercase">Digital Nomad</p></div>
              <div className="flex justify-center gap-4 text-muted-foreground">
                <span className="flex items-center gap-1 text-[10px]"><Users size={12} /> 1.{i}k</span>
                <span className="flex items-center gap-1 text-[10px]"><MessageSquare size={12} /> {42 + i}</span>
              </div>
              <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase">Follow</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
