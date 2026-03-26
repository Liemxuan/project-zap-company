'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import { Button } from '../../../genesis/atoms/interactive/button';
import {  UserPlus } from 'lucide-react';

export function NetworkUserCardsTeamCrewContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Team Crew</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }, (_, i) => (
          <Card key={i} className="text-center group hover:shadow-md transition-all overflow-hidden">
            <div className="h-16 bg-gradient-to-br from-primary/10 to-transparent" />
            <CardContent className="-mt-6 space-y-3 pb-6">
              <div className="size-14 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 mx-auto flex items-center justify-center text-sm font-black shadow">{i + 1}</div>
              <div><h3 className="text-sm font-bold">Crew Member {i + 1}</h3><p className="text-[10px] text-muted-foreground uppercase">Specialist</p></div>
              <div className="flex justify-center gap-2">
                <Badge variant="outline" className="text-[8px] font-bold uppercase">{['Frontend', 'Backend', 'DevOps', 'Security'][i % 4]}</Badge>
              </div>
              <Button variant="outline" size="sm" className="w-full text-[10px] font-bold uppercase"><UserPlus size={12} className="mr-1" /> Connect</Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
