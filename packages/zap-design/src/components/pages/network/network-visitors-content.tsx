'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../genesis/molecules/card';


import { Eye, Globe, Clock, TrendingUp } from 'lucide-react';

export function NetworkVisitorsContent() {
  const visitors = Array.from({ length: 5 }, (_, i) => ({
    source: ['Direct', 'Google', 'GitHub', 'Twitter', 'Referral'][i], visits: `${(5 - i) * 1240}`, bounce: `${20 + i * 8}%`, duration: `${3 - i * 0.4 > 0 ? (3 - i * 0.4).toFixed(1) : '0.8'}m`,
  }));
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Visitors</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Visits', value: '24.8k', icon: Eye },
          { label: 'Unique Users', value: '18.2k', icon: Globe },
          { label: 'Avg Duration', value: '2m 34s', icon: Clock },
          { label: 'Growth', value: '+12.4%', icon: TrendingUp },
        ].map((s, i) => (
          <Card key={i}><CardContent className="pt-6 flex items-center gap-4"><div className="p-2 rounded-lg bg-primary/5 text-primary"><s.icon size={20} /></div><div><p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{s.label}</p><p className="text-lg font-black italic">{s.value}</p></div></CardContent></Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-lg">Traffic Sources</CardTitle></CardHeader>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead><tr className="bg-muted/30 border-b">
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Source</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Visits</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Bounce Rate</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Avg Duration</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {visitors.map((v, i) => (
                <tr key={i} className="hover:bg-muted/5"><td className="px-6 py-4 text-sm font-bold">{v.source}</td><td className="px-6 py-4 text-sm font-black italic text-right">{v.visits}</td><td className="px-6 py-4 text-sm text-right">{v.bounce}</td><td className="px-6 py-4 text-sm text-right">{v.duration}</td></tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
