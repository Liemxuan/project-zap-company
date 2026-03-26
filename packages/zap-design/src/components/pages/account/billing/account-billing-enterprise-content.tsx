'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CardFooter
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import {  Building2, ShieldCheck, Mail, Globe, Zap, Download } from 'lucide-react';

export function AccountBillingEnterpriseContent() {
  const stats = [
    { label: 'Active Seats', value: '128 / 250', icon: Building2, color: 'text-blue-500' },
    { label: 'Cloud API Usage', value: '89.4%', icon: Zap, color: 'text-amber-500' },
    { label: 'Compliance Score', value: '99.9%', icon: ShieldCheck, color: 'text-green-500' },
  ];

  return (
    <div className="space-y-6">
      {/* Enterprise Upgrade Banner */}
      <Card className="bg-zinc-900 border-zinc-800 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Building2 size={120} />
        </div>
        <CardContent className="pt-8 pb-10 space-y-4 relative z-10">
          <Badge variant="primary" className="bg-primary text-primary-foreground font-black italic uppercase text-[10px]">Tier: Galactic Enterprise</Badge>
          <div className="space-y-2">
            <h2 className="text-3xl font-black tracking-tighter uppercase italic">Scale without limits.</h2>
            <p className="text-zinc-400 max-w-md text-sm">You are currently on our top-tier plan. Need custom infrastructure or dedicated nodes? Talk to your representative.</p>
          </div>
          <div className="flex gap-3 pt-4">
            <Button variant="primary" className="font-black italic uppercase text-xs">Request expansion</Button>
            <Button variant="ghost" className="text-white hover:bg-white/10 uppercase text-xs font-bold">View Cluster Health</Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-2xl bg-muted/50 ${stat.color}`}>
                  <stat.icon size={20} />
                </div>
                <div className="space-y-0.5">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{stat.label}</p>
                  <p className="text-lg font-black italic tracking-tight">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Billing Invoicing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { id: 'ENT-2024-MAR', amount: '$4,999.00', date: 'Mar 01, 2026' },
              { id: 'ENT-2024-FEB', amount: '$4,999.00', date: 'Feb 01, 2026' }
            ].map((inv) => (
              <div key={inv.id} className="flex items-center justify-between p-4 rounded-xl border bg-muted/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded bg-muted/50"><Download size={14} /></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{inv.id}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{inv.date}</span>
                  </div>
                </div>
                <span className="text-sm font-black uppercase italic">{inv.amount}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Enterprise Identity</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/5">
               <div className="p-2 rounded bg-muted/50"><Mail size={16} /></div>
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Admin Contact</span>
                  <span className="text-sm font-medium">enterprise@zap.inc</span>
               </div>
            </div>
            <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/5">
               <div className="p-2 rounded bg-muted/50"><Globe size={16} /></div>
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">Region</span>
                  <span className="text-sm font-medium">Multi-Region (AWS US-East-1 / EU-Central-1)</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
