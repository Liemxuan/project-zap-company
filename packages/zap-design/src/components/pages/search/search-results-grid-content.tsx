'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import {  LayoutGrid, List, FileText, Image, Video, Music } from 'lucide-react';

export function SearchResultsGridContent() {
  const items = Array.from({ length: 9 }, (_, i) => ({
    title: `Result ${i + 1}`, type: ['Document', 'Image', 'Video', 'Audio'][i % 4], updated: `${i + 1}d ago`,
  }));
  const typeIcon = { Document: FileText, Image: Image, Video: Video, Audio: Music };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Search Results</h1>
        <div className="flex gap-2"><Button variant="primary" size="sm" mode="icon"><LayoutGrid size={14} /></Button><Button variant="outline" size="sm" mode="icon"><List size={14} /></Button></div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, i) => {
          const Icon = typeIcon[item.type as keyof typeof typeIcon] || FileText;
          return (
            <Card key={i} className="group hover:border-primary/30 hover:shadow-sm transition-all cursor-pointer">
              <CardContent className="pt-6 space-y-3">
                <div className="size-12 rounded-xl bg-muted/30 flex items-center justify-center"><Icon size={20} className="text-muted-foreground group-hover:text-primary transition-colors" /></div>
                <div><h3 className="text-sm font-bold group-hover:text-primary transition-colors">{item.title}</h3><p className="text-[10px] text-muted-foreground uppercase">Updated {item.updated}</p></div>
                <Badge variant="outline" className="text-[8px] font-bold uppercase">{item.type}</Badge>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
