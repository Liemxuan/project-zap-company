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

import { MoreVertical, UserPlus, Check } from 'lucide-react';

export function AccountUserConnectionsContent() {
  const connections = [
    { id: '1', name: 'Tyler Hero', meta: '26 connections', active: true },
    { id: '2', name: 'Esther Howard', meta: '639 connections', active: false },
    { id: '3', name: 'Jacob Jones', meta: '125 connections', active: false },
    { id: '4', name: 'Cody Fisher', meta: '81 connections', active: true },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Social Connections</CardTitle>
        <Button variant="ghost" size="sm" mode="icon">
          <MoreVertical className="w-4 h-4 text-muted-foreground" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/50">
          {connections.map((conn) => (
            <div key={conn.id} className="flex items-center justify-between p-4 hover:bg-muted/5 transition-colors">
              <div className="flex items-center gap-3">
                 <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xs">
                    {conn.name.split(' ').map(n => n[0]).join('')}
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-bold">{conn.name}</span>
                    <span className="text-[10px] text-muted-foreground font-medium">{conn.meta}</span>
                 </div>
              </div>
              <Button 
                variant={conn.active ? 'primary' : 'outline'} 
                size="sm" 
                mode="icon" 
                className={`rounded-full shadow-md transition-all active:scale-90 ${conn.active ? 'bg-primary' : 'hover:bg-primary/5 hover:border-primary/50'}`}
              >
                {conn.active ? <Check size={14} className="text-primary-foreground" /> : <UserPlus size={14} className="text-primary" />}
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-2 pb-4">
        <Button variant="ghost" size="sm" className="w-full text-[10px] uppercase font-black text-muted-foreground tracking-tighter hover:text-primary">
          View all 64 more connections
        </Button>
      </CardFooter>
    </Card>
  );
}
