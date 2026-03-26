'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Badge } from '../../../genesis/atoms/interactive/badge';

import {   Search } from 'lucide-react';

export function NetworkSaasUsersContent() {
  const users = Array.from({ length: 6 }, (_, i) => ({
    name: `SaaS User ${i + 1}`, plan: ['Free', 'Pro', 'Enterprise'][i % 3], mrr: `$${(i + 1) * 49}`, status: i < 4 ? 'Active' : 'Churned',
  }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">SaaS Users</h1>
        <div className="relative md:w-64"><Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} /><input className="w-full h-10 pl-10 pr-4 rounded-xl border bg-layer-dialog text-sm outline-none" placeholder="Search users..." /></div>
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead><tr className="bg-muted/30 border-b">
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">User</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Plan</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">MRR</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Status</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {users.map((u, i) => (
                <tr key={i} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4"><div className="flex items-center gap-3"><div className="size-8 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold">{u.name.split(' ').pop()?.[0]}</div><span className="text-sm font-bold">{u.name}</span></div></td>
                  <td className="px-6 py-4"><Badge variant="outline" className="text-[8px] font-bold uppercase">{u.plan}</Badge></td>
                  <td className="px-6 py-4 text-sm font-black italic">{u.mrr}</td>
                  <td className="px-6 py-4"><Badge variant={u.status === 'Active' ? 'success' : 'destructive'} className="text-[8px] font-black uppercase">{u.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
