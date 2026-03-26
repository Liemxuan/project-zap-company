'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';

import { Badge } from '../../../genesis/atoms/interactive/badge';


export function NetworkAuthorContent() {
  const authors = [
    { name: 'Zeus Tom', role: 'Head of Product', articles: 42, followers: '12k', featured: true },
    { name: 'Spike', role: 'Architect', articles: 28, followers: '8.3k' },
    { name: 'Jerry', role: 'Watchdog', articles: 15, followers: '5.1k' },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Authors</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {authors.map((a, i) => (
          <Card key={i} className="group hover:shadow-md transition-all cursor-pointer overflow-hidden">
            <div className="h-20 bg-gradient-to-br from-primary/10 to-primary/5" />
            <CardContent className="-mt-8 text-center space-y-3">
              <div className="size-16 rounded-full bg-zinc-200 dark:bg-zinc-800 border-4 border-white dark:border-zinc-900 mx-auto flex items-center justify-center text-lg font-black shadow-lg">{a.name[0]}</div>
              <div><h3 className="text-sm font-bold">{a.name}</h3><p className="text-[10px] text-muted-foreground uppercase font-medium">{a.role}</p></div>
              {a.featured && <Badge variant="primary" className="text-[8px] font-black uppercase italic">Featured</Badge>}
              <div className="flex justify-center gap-6 pt-2">
                <div className="text-center"><span className="text-sm font-black italic">{a.articles}</span><p className="text-[9px] text-muted-foreground uppercase">Articles</p></div>
                <div className="text-center"><span className="text-sm font-black italic">{a.followers}</span><p className="text-[9px] text-muted-foreground uppercase">Followers</p></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
