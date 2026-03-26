'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import { Megaphone, BarChart3, Eye, TrendingUp, Plus, MoreVertical } from 'lucide-react';

export function CampaignsContent() {
  const campaigns = [
    { name: 'Agent Fleet Launch', status: 'Active', reach: '24.8k', clicks: '3.2k', conversion: '12.4%' },
    { name: 'M3 Token Awareness', status: 'Scheduled', reach: '-', clicks: '-', conversion: '-' },
    { name: 'Q1 Security Audit Promo', status: 'Completed', reach: '18.1k', clicks: '2.8k', conversion: '15.2%' },
  ];
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Campaigns</h1>
        <Button variant="primary" size="sm" className="text-[10px] font-black uppercase italic"><Plus size={14} className="mr-1" /> New Campaign</Button>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Reach', value: '42.9k', icon: Eye },
          { label: 'Total Clicks', value: '6.0k', icon: TrendingUp },
          { label: 'Avg Conversion', value: '13.8%', icon: BarChart3 },
          { label: 'Active Campaigns', value: '1', icon: Megaphone },
        ].map((s, i) => (
          <Card key={i}><CardContent className="pt-6 flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/5 text-primary"><s.icon size={20} /></div><div><p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{s.label}</p><p className="text-lg font-black italic">{s.value}</p></div></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead><tr className="bg-muted/30 border-b">
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Campaign</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Status</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Reach</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Clicks</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Conv.</th>
              <th className="px-6 py-3 w-12"></th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {campaigns.map((c, i) => (
                <tr key={i} className="hover:bg-muted/5 transition-colors">
                  <td className="px-6 py-4 text-sm font-bold">{c.name}</td>
                  <td className="px-6 py-4"><Badge variant={c.status === 'Active' ? 'success' : c.status === 'Scheduled' ? 'primary' : 'secondary'} className="text-[8px] font-black uppercase">{c.status}</Badge></td>
                  <td className="px-6 py-4 text-sm font-black italic text-right">{c.reach}</td>
                  <td className="px-6 py-4 text-sm text-right">{c.clicks}</td>
                  <td className="px-6 py-4 text-sm font-bold text-right">{c.conversion}</td>
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
