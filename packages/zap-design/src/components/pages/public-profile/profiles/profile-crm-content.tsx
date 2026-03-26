'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { 
   
  Key, 
  Activity, 
  FileText, 
  MoreVertical,
  CheckCircle2,
  
  Hash,
  
  Plus
} from 'lucide-react';

export function ProfileCRMContent() {
  const deals = [
    { name: 'Infrastructure Scale XP', value: '$84,000', status: 'Closed', color: 'success' },
    { name: 'Fleet Security Audit', value: '$12,500', status: 'Negotiation', color: 'primary' },
    { name: 'Agent Training Node', value: '$45,000', status: 'Proposal', color: 'secondary' },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader><CardTitle className="text-lg">General Information</CardTitle></CardHeader>
          <CardContent className="space-y-4">
             {[
               { label: 'Customer ID', value: 'CUS-8123-XP' },
               { label: 'Tier', value: 'Strategic Partner' },
               { label: 'Source', value: 'Direct Outreach' }
             ].map(info => (
               <div key={info.label} className="space-y-0.5">
                  <p className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{info.label}</p>
                  <p className="text-sm font-bold">{info.value}</p>
               </div>
             ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest"><Key size={14} className="inline mr-1"/> API Credentials</CardTitle></CardHeader>
          <CardContent className="space-y-3">
             <div className="p-3 rounded-lg border bg-muted/5 font-mono text-transform-tertiary text-[10px] truncate opacity-60">zap_live_8192_xxxxxxxxxxxx</div>
             <Button variant="outline" className="w-full text-[10px] uppercase font-black italic shadow-sm h-8" size="sm">Rotate Keys</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest flex items-center gap-2"><Hash size={14}/> Attributes</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
             {['Enterprise', 'B2B', 'Scaling', 'Vetted', 'Priority'].map(attr => (
               <Badge key={attr} variant="secondary" className="px-3 py-1 bg-muted/20 border-0 text-[10px] font-bold uppercase">{attr}</Badge>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-black italic tracking-tighter uppercase italic">Active Deals</CardTitle>
            <Button variant="primary" size="sm" mode="icon" className="rounded-full shadow-lg shadow-primary/20"><Plus size={14}/></Button>
          </CardHeader>
          <CardContent className="p-0">
             <table className="w-full text-left">
                <thead>
                   <tr className="bg-muted/30 border-y border-border/50">
                      <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground italic tracking-widest">Deal Name</th>
                      <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground italic tracking-widest">Status</th>
                      <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground italic tracking-widest text-right">Value</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                   {deals.map((deal, idx) => (
                      <tr key={idx} className="hover:bg-muted/5 transition-colors">
                         <td className="px-6 py-4 text-xs font-bold">{deal.name}</td>
                         <td className="px-6 py-4">
                            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                            <Badge variant={deal.color as any} className="text-[8px] font-black uppercase italic tracking-tighter shadow-sm">{deal.status}</Badge>
                         </td>
                         <td className="px-6 py-4 text-xs font-black italic text-right">{deal.value}</td>
                      </tr>
                   ))}
                </tbody>
             </table>
          </CardContent>
          <CardFooter className="py-4 justify-center bg-muted/5 border-t">
             <Button variant="ghost" className="text-[10px] uppercase font-black hover:text-primary">Load Sales Pipeline</Button>
          </CardFooter>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <Card>
              <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Activity className="text-primary" size={18}/> Activity Feed</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                 {[1,2].map(i => (
                    <div key={i} className="flex gap-3">
                       <div className="size-8 rounded-full bg-muted/50 flex items-center justify-center shrink-0"><CheckCircle2 className="text-green-500" size={16}/></div>
                       <div className="flex flex-col">
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">Mar {11-i}, 2026</span>
                          <span className="text-xs font-medium">Agreement signed for node expansion {i}</span>
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>

           <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                 <CardTitle className="text-lg">Recent Invoices</CardTitle>
                 <Button variant="ghost" size="sm" mode="icon"><MoreVertical size={16}/></Button>
              </CardHeader>
              <CardContent className="space-y-3">
                 {[1,2].map(i => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl border bg-muted/5 hover:bg-muted/10 transition-colors cursor-pointer group">
                       <div className="flex items-center gap-3">
                          <FileText size={16} className="text-muted-foreground group-hover:text-primary"/>
                          <span className="text-xs font-bold font-mono text-transform-tertiary">INV-2026-0{i}</span>
                       </div>
                       <span className="text-xs font-black italic">$4,500</span>
                    </div>
                 ))}
              </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
