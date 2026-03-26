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
   
  Upload, 
  MessageSquare, 
  ThumbsUp, 
  Share2, 
  Hash, 
  MoreHorizontal,
  Flame,
  Zap,
  Globe,
  Plus
} from 'lucide-react';

export function ProfileFeedsContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <div className="grid grid-cols-2 gap-4">
           {[
             { label: 'Connections', value: '5.3k', icon: Globe },
             { label: 'Uploads', value: '28.9k', icon: Upload }
           ].map(stat => (
             <Card key={stat.label}>
                <CardContent className="pt-6 pb-4 flex flex-col items-center gap-1">
                   <div className="p-2 rounded bg-muted/50 mb-1"><stat.icon size={16} className="text-muted-foreground"/></div>
                   <span className="text-xl font-black italic tracking-tighter">{stat.value}</span>
                   <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{stat.label}</span>
                </CardContent>
             </Card>
           ))}
        </div>

        <Card>
          <CardHeader><CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest">About Activity</CardTitle></CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground leading-relaxed italic">
               {/* eslint-disable-next-line react/no-unescaped-entities */}
               "Systematic extraction of L5 segments is not just work, it's a security requirement."
            </p>
          </CardContent>
        </Card>

        <Card className="bg-primary shadow-lg shadow-primary/20 text-primary-foreground italic overflow-hidden relative group cursor-pointer border-0">
           <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-125 transition-transform"><Flame size={120}/></div>
           <CardContent className="pt-6 pb-6 space-y-2 relative z-10">
              <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Open to Work</span>
              <h3 className="text-xl font-black italic tracking-tighter uppercase italic leading-tight">Infrastructure Architect</h3>
              <p className="text-[10px] font-medium uppercase opacity-70">Mar 2026 Batch</p>
           </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest"><Hash size={14} className="inline mr-1"/> Trending Skills</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
             {['Next.js 15', 'Node.js', 'Cybersecurity', 'M3 Design'].map(s => (
               <Badge key={s} variant="outline" className="text-[10px] font-bold uppercase py-1 px-3 border-border/50 hover:border-primary/50 transition-colors cursor-pointer">{s}</Badge>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-8">
        <div className="flex items-center justify-between">
           <h2 className="text-2xl font-black italic tracking-tighter uppercase italic">Recent Transmissions</h2>
           <Button variant="outline" size="sm" className="rounded-full shadow-sm"><Plus size={14} className="mr-1"/> Create Post</Button>
        </div>

        <div className="space-y-6">
           {[1, 2, 3].map(i => (
             <Card key={i} className="group hover:border-primary/20 transition-all cursor-pointer overflow-hidden border-border/50">
                <CardContent className="pt-6 pb-6 space-y-6">
                   <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                         <div className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800 border-2 border-white dark:border-zinc-950 shadow-sm" />
                         <div className="flex flex-col">
                            <span className="text-sm font-black italic uppercase tracking-tighter">Chief Security Officer</span>
                            <span className="text-[10px] text-muted-foreground font-medium uppercase">Posted 2 hours ago</span>
                         </div>
                      </div>
                      <Button variant="ghost" size="sm" mode="icon"><MoreHorizontal size={18}/></Button>
                   </div>
                   
                   <p className="text-sm text-zinc-800 dark:text-zinc-200 leading-relaxed font-medium">
                      Operational update: All L5 segments for Sprint 3.3 have been standardized using the high-fidelity ZAP Design Engine protocol. 
                      Standardizing components {i} of 18... 🚀
                   </p>

                   <div className="aspect-video rounded-2xl bg-muted/30 border border-dashed border-border/50 flex flex-col items-center justify-center gap-2 text-muted-foreground overflow-hidden">
                      <div className="opacity-10 scale-[2]"><Zap size={100}/></div>
                   </div>

                   <div className="flex items-center justify-between pt-4 border-t border-border/30">
                      <div className="flex gap-6">
                         <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors italic tracking-widest"><ThumbsUp size={14}/> Like</button>
                         <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors italic tracking-widest"><MessageSquare size={14}/> Comment (4)</button>
                      </div>
                      <button className="flex items-center gap-1.5 text-[10px] font-black uppercase text-muted-foreground hover:text-primary transition-colors italic tracking-widest"><Share2 size={14}/> Repost</button>
                   </div>
                </CardContent>
             </Card>
           ))}
        </div>

        <Button variant="ghost" className="w-full text-xs font-black uppercase italic tracking-widest py-8 h-auto border-dashed border hover:bg-muted/5 transition-all text-muted-foreground hover:text-primary opacity-60">
           Syncing more transmissions...
        </Button>
      </div>
    </div>
  );
}
