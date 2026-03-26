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
  Gamepad2, 
  Trophy, 
  Swords, 
  Target, 
   
  Facebook, 
  Twitter, 
  Youtube,
  Dribbble,
  PlayCircle,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  MoreVertical
} from 'lucide-react';

export function ProfileGamerContent() {
  const stats = [
    { label: 'Tournaments', value: '164', icon: Trophy, color: 'text-amber-500' },
    { label: 'Win-rate', value: '73.2%', icon: Target, color: 'text-emerald-500' },
    { label: 'Duels Played', value: '257', icon: Swords, color: 'text-rose-500' },
    { label: 'Trophies', value: '19', icon: Trophy, color: 'text-blue-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx} className="bg-zinc-900 border-zinc-800 text-white">
            <CardContent className="pt-6 flex flex-col items-center gap-1 text-center">
               <div className={`p-2 rounded-lg bg-white/5 mb-1 ${stat.color}`}><stat.icon size={20}/></div>
               <span className="text-2xl font-black italic italic tracking-tighter">{stat.value}</span>
               <span className="text-[10px] uppercase font-black text-zinc-500 tracking-widest">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-sm font-black uppercase text-muted-foreground tracking-widest">Favorite Games</CardTitle></CardHeader>
            <CardContent className="grid grid-cols-2 gap-3">
               {[1,2,3,4].map(i => (
                 <div key={i} className="aspect-square rounded-xl bg-muted/20 border border-dashed flex items-center justify-center group cursor-pointer hover:border-primary/50 transition-all">
                    <Gamepad2 size={24} className="text-muted-foreground group-hover:text-primary opacity-20 group-hover:opacity-100 transition-all" />
                 </div>
               ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Network</CardTitle></CardHeader>
            <CardContent className="flex gap-4">
               {[Facebook, Twitter, Youtube, Dribbble].map((Icon, idx) => (
                 <Button key={idx} variant="outline" mode="icon" className="rounded-full shadow-sm hover:text-primary transition-colors">
                    <Icon size={18} />
                 </Button>
               ))}
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-primary/5 border-primary/20">
             <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg flex items-center gap-2 italic uppercase">
                   <PlayCircle className="text-primary" /> Now Playing
                </CardTitle>
                <Badge variant="success" className="animate-pulse shadow-success/20">LIVE</Badge>
             </CardHeader>
             <CardContent className="flex flex-col md:flex-row gap-6">
                <div className="w-full md:w-48 aspect-video rounded-xl bg-black overflow-hidden relative group cursor-pointer">
                   <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
                      <PlayCircle size={40} className="text-white" />
                   </div>
                </div>
                <div className="space-y-4 py-2">
                   <div className="space-y-1">
                      <h3 className="text-xl font-black tracking-tight uppercase italic">Cyber Stealth: Zero Protocol</h3>
                      <p className="text-xs text-muted-foreground">Standardized L5 Segment assembly and stress testing.</p>
                   </div>
                   <div className="flex gap-3">
                      <Button variant="primary" size="sm" className="text-[10px] font-black uppercase italic">Join Squad</Button>
                      <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase">Spectate</Button>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Recent Tournaments</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               {[
                 { name: 'Global Ops Open', rank: '#14', prize: '$1,200', date: 'Mar 10' },
                 { name: 'Nexus Sprint', rank: '#2', prize: '$4,500', date: 'Feb 28' }
               ].map((t, idx) => (
                 <div key={idx} className="flex items-center justify-between p-4 rounded-xl border bg-muted/5 group hover:bg-muted/10 transition-colors">
                    <div className="flex flex-col">
                       <span className="text-sm font-bold">{t.name}</span>
                       <span className="text-[10px] text-muted-foreground uppercase font-medium">{t.date}</span>
                    </div>
                    <div className="flex gap-4 items-center">
                       <Badge variant="outline" className="text-[10px] font-black italic">{t.rank}</Badge>
                       <span className="text-sm font-black text-primary">{t.prize}</span>
                    </div>
                 </div>
               ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
