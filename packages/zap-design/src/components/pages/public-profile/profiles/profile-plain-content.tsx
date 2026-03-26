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

import { 
  Network, 
   
   
   
  Zap, 
  Mail, 
  Twitter, 
  Youtube, 
  Dribbble,
  Globe,
  Settings,
  
  Plus
} from 'lucide-react';

export function ProfilePlainContent() {
  const stats = [
    { number: '249', label: 'Connections' },
    { number: '1.2k', label: 'Uploads' },
    { number: '1M+', label: 'Gross Sales' },
    { number: '27', label: 'Rank' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <div key={idx} className="flex flex-col items-center justify-center p-8 bg-layer-dialog border rounded-3xl shadow-sm hover:shadow-md transition-all group">
             <span className="text-4xl font-black italic tracking-tighter group-hover:text-primary transition-colors">{stat.number}</span>
             <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mt-1 opacity-60 group-hover:opacity-100">{stat.label}</span>
          </div>
        ))}
      </div>

      <Card className="bg-zinc-900 border-zinc-800 text-white overflow-hidden relative shadow-2xl">
         <div className="absolute top-0 right-0 p-12 opacity-5 scale-[2] pointer-events-none"><Zap size={200}/></div>
         <CardContent className="p-12 space-y-8 relative z-10">
            <div className="space-y-4 max-w-2xl">
               <h2 className="text-4xl font-black italic tracking-tighter uppercase italic leading-[0.9]">Start Scaling Your <br/><span className="text-primary italic">Agent Fleet</span> Today.</h2>
               <p className="text-zinc-400 text-base leading-relaxed">
                  The infrastructure is ready. The nodes are humming. All we need is your deployment signal. Master the galaxy of distributed systems.
               </p>
            </div>
            <div className="flex flex-wrap gap-4">
               <Button variant="primary" size="lg" className="px-10 h-14 font-black italic uppercase tracking-widest text-xs shadow-xl shadow-primary/20">Initialize Fleet</Button>
               <Button variant="ghost" className="text-white hover:bg-white/5 uppercase text-xs font-bold tracking-widest px-8 h-14 border border-white/10 italic">Documentation</Button>
            </div>
         </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 flex flex-row items-center justify-between">
               <CardTitle className="text-xl font-black italic uppercase tracking-tighter italic">Entity Network</CardTitle>
               <Button variant="outline" size="sm" mode="icon"><Settings size={14}/></Button>
            </CardHeader>
            <CardContent className="px-0 grid grid-cols-1 sm:grid-cols-2 gap-4">
               {[
                 { label: 'Primary Node', value: 'US-EAST-1', icon: Globe },
                 { label: 'Fleet Status', value: 'Active Scan', icon: Network },
                 { label: 'Security Tier', value: 'CSO Standard', icon: Zap }
               ].map((item, idx) => (
                  <div key={idx} className="flex items-center gap-4 p-5 bg-layer-dialog border rounded-2xl group hover:border-primary/50 transition-all cursor-pointer shadow-sm">
                     <div className="p-3 rounded-xl bg-muted/50 group-hover:bg-primary/5 group-hover:text-primary transition-colors"><item.icon size={20}/></div>
                     <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-black text-muted-foreground opacity-60 tracking-widest">{item.label}</span>
                        <span className="text-sm font-bold tracking-tight">{item.value}</span>
                     </div>
                  </div>
               ))}
               <div className="flex items-center justify-center p-5 border-2 border-dashed rounded-2xl hover:bg-primary/5 hover:border-primary/50 transition-all cursor-pointer">
                  <Plus size={20} className="text-muted-foreground" />
               </div>
            </CardContent>
         </Card>

         <Card className="border-0 bg-transparent shadow-none">
            <CardHeader className="px-0 flex flex-row items-center justify-between">
               <CardTitle className="text-xl font-black italic uppercase tracking-tighter italic">About Me</CardTitle>
               <Button mode="link" underlined="dashed" size="sm">Update Bio</Button>
            </CardHeader>
            <CardContent className="px-0">
               <div className="p-8 bg-layer-dialog border rounded-3xl shadow-sm space-y-6">
                  <p className="text-base text-zinc-600 dark:text-zinc-400 leading-relaxed font-medium italic">
                     {/* eslint-disable-next-line react/no-unescaped-entities */}
                     "I build the bridges between complex codebases and the agents that maintain them. Security is my priority, scalability is my mission."
                  </p>
                  <div className="flex gap-4 pt-4 border-t border-border/50">
                     {[Twitter, Youtube, Dribbble, Mail].map((I, i) => (
                        <Button key={i} variant="outline" mode="icon" className="rounded-full shadow-sm hover:text-primary"><I size={18}/></Button>
                     ))}
                  </div>
               </div>
            </CardContent>
         </Card>
      </div>
    </div>
  );
}
