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
  Award, 
   
  Briefcase, 
  Tags as TagsIcon, 
   
  Rocket, 
   
  Heart,
  MoreVertical,
  Plus
} from 'lucide-react';

export function ProfileDefaultContent() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-1 space-y-6">
        {/* Badges */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground">Community Badges</CardTitle>
            <Button variant="ghost" size="sm" mode="icon"><MoreVertical size={14}/></Button>
          </CardHeader>
          <CardContent className="space-y-3">
             {[
               { name: 'Expert Contributor', color: 'text-blue-500', icon: Award },
               { name: 'Impact recognition', color: 'text-green-500', icon: Heart }
             ].map((badge) => (
               <div key={badge.name} className="flex items-center gap-3 p-2 rounded-lg border bg-muted/5 hover:bg-muted/10 transition-colors">
                  <div className={`p-2 rounded bg-layer-dialog shadow-sm ${badge.color}`}><badge.icon size={16}/></div>
                  <span className="text-xs font-bold">{badge.name}</span>
               </div>
             ))}
          </CardContent>
        </Card>

        {/* About */}
        <Card>
          <CardHeader><CardTitle className="text-lg">About</CardTitle></CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Passionate Chief Security Officer at ZAP. Focused on building unbreakable infrastructure and scaling global agent fleets.
            </p>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Experience</CardTitle>
            <Button variant="outline" size="sm" mode="icon"><Plus size={14}/></Button>
          </CardHeader>
          <CardContent className="space-y-6">
             {[
               { role: 'Chief Security Officer', company: 'ZAP Inc.', date: '2024 - Present', icon: Briefcase },
               { role: 'Security Architect', company: 'Olympus Ops', date: '2022 - 2024', icon: Briefcase }
             ].map((exp, idx) => (
               <div key={idx} className="flex gap-4">
                  <div className="size-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary"><exp.icon size={20}/></div>
                  <div className="flex flex-col">
                     <span className="text-sm font-bold tracking-tight">{exp.role}</span>
                     <span className="text-[10px] text-muted-foreground font-medium uppercase">{exp.company} • {exp.date}</span>
                  </div>
               </div>
             ))}
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardHeader><CardTitle className="text-sm font-black uppercase tracking-widest text-muted-foreground flex items-center gap-2"><TagsIcon size={14}/> Skills</CardTitle></CardHeader>
          <CardContent className="flex flex-wrap gap-2">
             {['Cybersecurity', 'Infrastructure', 'React', 'Next.js', 'Distributed Systems'].map(skill => (
               <Badge key={skill} variant="secondary" className="bg-muted/50 border-0 hover:bg-primary/10 text-[10px] font-bold uppercase">{skill}</Badge>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-2 space-y-6">
        {/* Partnership Hero */}
        <Card className="bg-primary/5 border-primary/20 overflow-hidden relative">
          <div className="absolute -right-16 -top-16 p-24 bg-primary/10 rounded-full blur-3xl" />
          <CardContent className="pt-8 pb-10 space-y-4 relative z-10">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase italic">Unlock Partnerships</h2>
            <p className="text-muted-foreground max-w-md text-sm">Collaborate with the ZAP team on cutting-edge security research and infrastructure scaling.</p>
            <Button variant="primary" className="font-black italic uppercase text-xs tracking-widest shadow-lg shadow-primary/20">Get Started Now</Button>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle className="text-lg">Collaborators</CardTitle></CardHeader>
            <CardContent className="space-y-4">
               {[
                 { name: 'Zeus Tom', role: 'Head of Product' },
                 { name: 'Jerry', role: 'Watchdog' },
                 { name: 'Spike', role: 'Architect' }
               ].map(user => (
                 <div key={user.name} className="flex items-center justify-between p-3 rounded-xl border bg-muted/5 hover:bg-muted/10 transition-colors">
                    <div className="flex items-center gap-3">
                       <div className="size-10 rounded-full bg-zinc-200 dark:bg-zinc-800 flex items-center justify-center text-xs font-black uppercase">{user.name[0]}</div>
                       <div className="flex flex-col">
                          <span className="text-sm font-bold">{user.name}</span>
                          <span className="text-[10px] text-muted-foreground font-medium uppercase">{user.role}</span>
                       </div>
                    </div>
                    <Button variant="outline" size="sm">Profile</Button>
                 </div>
               ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle className="text-lg">Support Contributions</CardTitle></CardHeader>
            <CardContent className="flex items-center justify-center h-48 bg-muted/20 border border-dashed rounded-xl">
               <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <Rocket className="opacity-20" size={40}/>
                  <span className="text-[10px] font-black uppercase tracking-widest">Growth Analytics Coming Soon</span>
               </div>
            </CardContent>
          </Card>
        </div>

        {/* Projects */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Active Nodes & Projects</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs">View All</Button>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-6">
             {[
               { name: 'Olympus Core', status: 'Healthy', version: 'v3.2.1-stable' },
               { name: 'Zap Claw', status: 'Scanning', version: 'v2.0.0-beta' }
             ].map(project => (
               <div key={project.name} className="p-4 rounded-2xl border bg-muted/5 group hover:border-primary/50 transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                     <span className="text-sm font-black italic uppercase tracking-tighter">{project.name}</span>
                     <Badge variant="success" className="text-[8px] font-black">{project.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                     <span className="text-[10px] text-muted-foreground font-mono text-transform-tertiary">{project.version}</span>
                     <div className="flex -space-x-2">
                        {[1,2,3].map(i => <div key={i} className="size-6 rounded-full border-2 border-white dark:border-zinc-900 bg-zinc-300 dark:bg-zinc-700"/>)}
                     </div>
                  </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
