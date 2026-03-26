'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Award, Zap, MessagesSquare, Truck, MoreVertical } from 'lucide-react';

export function AccountUserBadgesContent() {
  const badges = [
    { title: 'Expert Contributor', icon: Award, color: 'text-primary' },
    { title: 'Innovation Trailblazer', icon: Zap, color: 'text-orange-500' },
    { title: 'Impact Recognition', icon: MessagesSquare, color: 'text-green-500' },
    { title: 'Performance Honor', icon: Truck, color: 'text-violet-500' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Achievements & Badges</CardTitle>
        <Button variant="ghost" size="sm" mode="icon">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3">
        {badges.map((badge, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl border bg-muted/5 group hover:bg-muted/10 transition-colors cursor-pointer">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-layer-dialog border shadow-sm group-hover:scale-110 transition-transform">
                  <badge.icon className={badge.color} size={20} />
               </div>
               <span className="text-sm font-bold">{badge.title}</span>
            </div>
            <Button variant="ghost" size="sm" mode="icon" className="text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] font-black italic">Details</span>
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
