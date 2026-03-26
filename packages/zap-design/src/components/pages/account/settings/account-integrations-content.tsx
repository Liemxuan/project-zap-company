'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { Puzzle, Check, RefreshCw } from 'lucide-react';

export function AccountIntegrationsContent() {
  const integrations = [
    { name: 'GitHub', desc: 'Repository & CI/CD', connected: true },
    { name: 'Slack', desc: 'Team notifications', connected: true },
    { name: 'Jira', desc: 'Issue tracking', connected: false },
    { name: 'MongoDB', desc: 'Database management', connected: true },
    { name: 'Figma', desc: 'Design files', connected: false },
    { name: 'Vercel', desc: 'Deployment platform', connected: true },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Integrations</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {integrations.map((int, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-all">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-xl bg-muted/30 flex items-center justify-center"><Puzzle size={18} className="text-muted-foreground" /></div>
                  <div><h3 className="text-sm font-bold">{int.name}</h3><p className="text-[10px] text-muted-foreground">{int.desc}</p></div>
                </div>
              </div>
              {int.connected ? (
                <div className="flex items-center justify-between">
                  <Badge variant="success" className="text-[8px] font-black uppercase"><Check size={10} className="mr-0.5" /> Connected</Badge>
                  <Button variant="ghost" size="sm" className="text-[10px] font-bold text-muted-foreground"><RefreshCw size={12} className="mr-1" /> Sync</Button>
                </div>
              ) : (
                <Button variant="outline" className="w-full text-[10px] font-bold uppercase">Connect</Button>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
