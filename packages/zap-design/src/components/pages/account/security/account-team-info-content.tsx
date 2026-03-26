'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { BookUser, UsersRound, Building, UserCheck, CreditCard } from 'lucide-react';

export function AccountTeamInfoContent() {
  const resources = [
    {
      icon: BookUser,
      title: 'Management Tools',
      summary: 'Centralize your team information with our directory and audit tools.',
    },
    {
      icon: UsersRound,
      title: 'Cohesive Team',
      summary: 'Craft a unified environment by compiling profiles in one secure place.',
    }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <div className="col-span-1 xl:col-span-2 space-y-6 lg:space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">Team Profile</CardTitle>
            <Building className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Team Nickname</p>
                <p className="text-sm font-bold">ZAP Alpha Fleet</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Primary Region</p>
                <p className="text-sm font-bold">North America / Global</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-muted/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                The ZAP Alpha Fleet is our core engineering and security task force, managing the ZAP Design Engine and Olympus infrastructure.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Recent Activities</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {[1, 2].map((i) => (
               <div key={i} className="flex items-start gap-4 p-3 rounded-xl border-b last:border-0">
                 <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <UserCheck className="w-4 h-4 text-muted-foreground" />
                 </div>
                 <div className="space-y-1 min-w-0">
                    <p className="text-sm font-medium">Workspace standard updated by <span className="font-bold">CSO Zap</span></p>
                    <p className="text-[10px] text-muted-foreground">2 hours ago</p>
                 </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 space-y-6 lg:space-y-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CreditCard className="w-5 h-5 text-primary" />
              Seat Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
               <div className="flex justify-between text-xs font-bold uppercase tracking-wider">
                  <span>Usage</span>
                  <span>12 / 20 Seats</span>
               </div>
               <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary w-[60%]" />
               </div>
            </div>
            <Button variant="primary" size="sm" className="w-full">Upgrade Plan</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Implementation Guides</h3>
          <div className="space-y-3">
            {resources.map((res, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <res.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{res.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">{res.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
