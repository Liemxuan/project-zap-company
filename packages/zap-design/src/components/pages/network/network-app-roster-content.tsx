'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import {  Search, LayoutGrid } from 'lucide-react';

export function NetworkAppRosterContent() {
  const users = Array.from({ length: 8 }, (_, i) => ({
    name: `Agent ${String.fromCharCode(65 + i)}`,
    role: ['Security', 'Architect', 'Engineer', 'Designer'][i % 4],
    status: i < 6 ? 'Active' : 'Idle',
    email: `agent${String.fromCharCode(97 + i)}@zap.inc`,
  }));
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">App Roster</h1>
        <div className="flex items-center gap-3">
          <div className="relative md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input className="w-full h-10 pl-10 pr-4 rounded-xl border bg-layer-dialog text-sm placeholder:text-muted-foreground outline-none" placeholder="Search roster..." /></div>
          <Button variant="outline" size="sm" mode="icon"><LayoutGrid size={16} /></Button>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {users.map((u, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-all cursor-pointer text-center">
            <CardContent className="pt-6 space-y-3">
              <div className="size-16 rounded-full bg-zinc-200 dark:bg-zinc-800 mx-auto flex items-center justify-center text-lg font-black">{u.name[0]}{u.name.split(' ')[1]?.[0]}</div>
              <div><h3 className="text-sm font-bold">{u.name}</h3><p className="text-[10px] text-muted-foreground uppercase font-medium">{u.role}</p></div>
              <Badge variant={u.status === 'Active' ? 'success' : 'secondary'} className="text-[8px] font-black uppercase">{u.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
