'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { Key, Copy, Trash2, Plus } from 'lucide-react';

export function AccountApiKeysContent() {
  const keys = [
    { name: 'Production Key', prefix: 'zap_live_8192', created: 'Jan 15, 2026', lastUsed: '2 hours ago', status: 'Active' },
    { name: 'Staging Key', prefix: 'zap_test_4096', created: 'Feb 01, 2026', lastUsed: '3 days ago', status: 'Active' },
    { name: 'Legacy Key', prefix: 'zap_old_2048', created: 'Dec 01, 2025', lastUsed: 'Never', status: 'Revoked' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">API Keys</h1>
        <Button variant="primary" size="sm" className="text-[10px] font-black uppercase italic"><Plus size={14} className="mr-1" /> Generate Key</Button>
      </div>
      <div className="space-y-4">
        {keys.map((k, i) => (
          <Card key={i}>
            <CardContent className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-muted/30"><Key size={20} className="text-muted-foreground" /></div>
                <div><h3 className="text-sm font-bold">{k.name}</h3><p className="text-[10px] text-muted-foreground font-mono text-transform-tertiary">{k.prefix}_xxxxxxxxxxxx</p></div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right hidden md:block"><p className="text-[10px] text-muted-foreground uppercase">Last used: {k.lastUsed}</p></div>
                <Badge variant={k.status === 'Active' ? 'success' : 'destructive'} className="text-[8px] font-black uppercase">{k.status}</Badge>
                <Button variant="outline" size="sm" mode="icon"><Copy size={14} /></Button>
                <Button variant="ghost" size="sm" mode="icon" className="hover:text-destructive"><Trash2 size={14} /></Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
