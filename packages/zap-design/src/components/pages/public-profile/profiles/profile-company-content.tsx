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
  Building2, 
  Users, 
  TrendingUp, 
  Globe, 
   
   
   
   
  
  
  MapPin,
  ExternalLink
} from 'lucide-react';

export function ProfileCompanyContent() {
  const stats = [
    { label: 'Employees', value: '624', icon: Users },
    { label: 'Users', value: '60.7M', icon: Globe },
    { label: 'Revenue', value: '$369M', icon: TrendingUp },
    { label: 'Rank', value: '27', icon: Building2 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat, idx) => (
          <Card key={idx}>
            <CardContent className="pt-6 flex flex-col items-center gap-1 text-center">
               <div className="p-2 rounded-lg bg-primary/5 text-primary mb-1"><stat.icon size={20}/></div>
               <span className="text-2xl font-black italic tracking-tighter">{stat.value}</span>
               <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">{stat.label}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Highlights</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/5">
                  <div className="size-10 rounded bg-layer-dialog border flex items-center justify-center"><Building2 size={20}/></div>
                  <div className="flex flex-col">
                     <span className="text-sm font-bold">Fortune 500</span>
                     <span className="text-[10px] text-muted-foreground uppercase font-medium">Technology Sector</span>
                  </div>
               </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
               <CardTitle className="text-lg">Open Jobs</CardTitle>
               <Badge variant="primary" className="text-[10px] font-black">12</Badge>
            </CardHeader>
            <CardContent className="space-y-2">
               {['Security Engineer', 'Solutions Architect', 'Product Designer'].map(job => (
                 <div key={job} className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/10 transition-colors group cursor-pointer">
                    <span className="text-xs font-bold group-hover:text-primary">{job}</span>
                    <ChevronRight size={14} className="text-muted-foreground" />
                 </div>
               ))}
               <Button variant="ghost" className="w-full text-[10px] uppercase font-black italic py-3 h-auto" mode="link">View All Positions</Button>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-2 space-y-6">
          <Card>
             <CardHeader><CardTitle className="text-xl font-black italic tracking-tighter uppercase italic">Company Profile</CardTitle></CardHeader>
             <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground leading-relaxed">
                   ZAP Inc. is a global leader in agentic infrastructure and cybersecurity automation. Our mission is to empower developers with real-time intelligence and unbreakable systems.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                   <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/5">
                      <MapPin size={18} className="text-muted-foreground"/>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-black text-muted-foreground">Headquarters</span>
                         <span className="text-xs font-bold">Cyber City, Global</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-3 p-3 rounded-xl border bg-muted/5">
                      <ExternalLink size={18} className="text-muted-foreground"/>
                      <div className="flex flex-col">
                         <span className="text-[10px] uppercase font-black text-muted-foreground">Website</span>
                         <span className="text-xs font-bold">www.zap.inc</span>
                      </div>
                   </div>
                </div>
             </CardContent>
          </Card>

          <Card>
             <CardHeader><CardTitle className="text-lg">Global Presence</CardTitle></CardHeader>
             <CardContent className="h-48 rounded-2xl bg-muted/20 border border-dashed flex flex-col items-center justify-center gap-2 text-muted-foreground">
                <Globe size={40} className="opacity-10"/>
                <span className="text-[10px] font-black uppercase tracking-widest">Interactive Network Map</span>
             </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { ChevronRight } from 'lucide-react';
