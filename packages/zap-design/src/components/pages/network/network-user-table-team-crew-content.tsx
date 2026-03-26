'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import { Button } from '../../../genesis/atoms/interactive/button';
import {  Search, MoreVertical } from 'lucide-react';

export function NetworkUserTableTeamCrewContent() {
  const crew = Array.from({ length: 6 }, (_, i) => ({
    name: `Team Member ${i + 1}`, role: ['Engineer', 'Designer', 'Analyst', 'Operator'][i % 4], email: `member${i + 1}@zap.inc`, status: i < 5 ? 'Active' : 'Away',
  }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Team Crew (Table)</h1>
        <div className="relative md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input className="w-full h-10 pl-10 pr-4 rounded-xl border bg-layer-dialog text-sm outline-none" placeholder="Search crew..." /></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead><tr className="bg-muted/30 border-b">
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Member</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Role</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Status</th>
              <th className="px-6 py-3 w-12"></th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {crew.map((m, i) => (
                <tr key={i} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="size-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">{m.name.split(' ').pop()?.[0]}</div><div><p className="text-sm font-bold">{m.name}</p><p className="text-[10px] text-muted-foreground">{m.email}</p></div></div></td>
                  <td className="px-6 py-4"><Badge variant="outline" className="text-[8px] font-bold uppercase">{m.role}</Badge></td>
                  <td className="px-6 py-4"><Badge variant={m.status === 'Active' ? 'success' : 'secondary'} className="text-[8px] font-black uppercase">{m.status}</Badge></td>
                  <td className="px-6 py-4"><Button variant="ghost" size="sm" mode="icon"><MoreVertical size={14} /></Button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
