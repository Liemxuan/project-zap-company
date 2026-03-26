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
import { 
  Plus, 
   
   
  Award, 
  Tags as  
  
  
  Zap,
  LayoutGrid
} from 'lucide-react';

export function ProfileCreatorContent() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Releases', value: '397', icon: LayoutGrid },
             { label: 'Earnings', value: '$89k', icon: Zap }
           ].map(stat => (
             <Card key={stat.label}>
                <CardContent className="pt-6 pb-4 flex flex-col items-center gap-2">
                   <div className="p-2 rounded-lg bg-muted/50"><stat.icon size={16} className="text-muted-foreground"/></div>
                   <span className="text-xl font-black italic">{stat.value}</span>
                   <span className="text-[10px] uppercase font-black text-muted-foreground italic tracking-widest">{stat.label}</span>
                </CardContent>
             </Card>
           ))}
        </div>

        {/* Members */}
        <Card>
           <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Members</CardTitle>
              <Button variant="ghost" size="sm" mode="icon"><Plus size={14}/></Button>
           </CardHeader>
           <CardContent>
              <div className="flex -space-x-3 overflow-hidden py-2">
                 {[1,2,3,4,5,6,7,8].map(i => (
                    <div key={i} className="inline-block size-9 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-[10px] font-bold ring-2 ring-transparent hover:ring-primary transition-all cursor-pointer">
                       {i}
                    </div>
                 ))}
                 <div className="inline-block size-9 rounded-full border-2 border-white dark:border-zinc-900 bg-muted flex items-center justify-center text-[10px] font-black italic">+64</div>
              </div>
           </CardContent>
        </Card>

        {/* Summary Card */}
        <Card className="bg-zinc-950 text-white border-zinc-800 italic overflow-hidden relative">
           <div className="absolute top-0 right-0 p-8 opacity-5"><Zap size={100}/></div>
           <CardContent className="pt-6 space-y-3 relative z-10 text-center">
              <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest leading-none">Creator Mode</p>
              <h3 className="text-xl font-black tracking-tighter uppercase italic leading-tight">Mastering infrastructure through code.</h3>
              <Button variant="primary" className="w-full text-[10px] uppercase font-black italic py-1 h-8">View Roadmap</Button>
           </CardContent>
        </Card>

        {/* Common Components (Reused) */}
        <Card>
           <CardHeader><CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Community Badges</CardTitle></CardHeader>
           <CardContent className="space-y-2">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-muted/5 border">
                 <div className="p-1.5 bg-layer-dialog rounded shadow-sm text-primary"><Award size={14}/></div>
                 <span className="text-[10px] font-bold">Innovation Trailblazer</span>
              </div>
           </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2 space-y-6">
        {/* Creator Hero */}
        <Card className="overflow-hidden bg-muted/5">
           <CardContent className="p-0">
              <div className="grid md:grid-cols-5 h-[280px]">
                 <div className="md:col-span-2 bg-gradient-to-br from-primary/10 to-primary/5 p-8 flex flex-col justify-center items-center text-center space-y-4">
                    <div className="size-20 rounded-full border-4 border-white shadow-xl bg-zinc-200 overflow-hidden">
                       {/* eslint-disable-next-line @next/next/no-img-element */}
                       <img src="/media/avatars/300-1.png" className="w-full h-full object-cover" alt="creator"/>
                    </div>
                    <div className="space-y-0.5">
                       <h2 className="text-lg font-black italic uppercase tracking-tighter">Esther Howard</h2>
                       <p className="text-[10px] font-bold text-muted-foreground uppercase">Top Tier Creator</p>
                    </div>
                 </div>
                 <div className="md:col-span-3 p-8 flex flex-col justify-center space-y-6">
                    <div className="space-y-2">
                       <h2 className="text-2xl font-black tracking-tighter uppercase italic">Restyle Your Space</h2>
                       <p className="text-sm text-muted-foreground">Transform your creative workflow with our curated toolsets and specialized AI agents.</p>
                    </div>
                    <div className="flex gap-4">
                       <div className="flex flex-col">
                          <span className="text-xs font-black uppercase italic text-primary">Easy Revamp</span>
                          <span className="text-[10px] text-muted-foreground">Budget Friendly</span>
                       </div>
                       <div className="flex flex-col">
                          <span className="text-xs font-black uppercase italic text-primary">Time-Saving</span>
                          <span className="text-[10px] text-muted-foreground">Fresh Look</span>
                       </div>
                    </div>
                 </div>
              </div>
           </CardContent>
        </Card>

        {/* Recent Works */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase font-black tracking-widest text-muted-foreground">Recent Portfolio</h2>
              <Button mode="link" underlined="dashed" size="sm">See All Portfolios</Button>
           </div>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { name: 'Abstract Art Nodes', category: 'Infrastructure', date: 'Feb 2026' },
                { name: 'Vector Flow Engine', category: 'Design Engine', date: 'Jan 2026' }
              ].map(work => (
                <Card key={work.name} className="group hover:border-primary/50 transition-all cursor-pointer overflow-hidden">
                   <div className="aspect-video bg-muted/30 relative">
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/5 backdrop-blur-sm">
                         <Button variant="primary" size="sm" className="text-[9px] font-black uppercase italic">View Prototype</Button>
                      </div>
                   </div>
                   <CardContent className="pt-4 pb-4">
                      <div className="flex justify-between items-start mb-1">
                         <h3 className="text-sm font-bold tracking-tight">{work.name}</h3>
                         <Badge variant="outline" className="text-[8px] font-black uppercase">{work.category}</Badge>
                      </div>
                      <p className="text-[10px] text-muted-foreground font-medium italic">{work.date}</p>
                   </CardContent>
                </Card>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
