'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import {  LayoutGrid, List, FileText, ChevronRight, Clock } from 'lucide-react';

export function SearchResultsListContent() {
  const items = Array.from({ length: 8 }, (_, i) => ({
    title: `Search Result ${i + 1}`, snippet: 'Relevant content snippet from the indexed document matching your search query...', category: ['Docs', 'Components', 'API', 'Config'][i % 4], updated: `${i + 1}d ago`,
  }));
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Search Results</h1>
        <div className="flex gap-2"><Button variant="outline" size="sm" mode="icon"><LayoutGrid size={14} /></Button><Button variant="primary" size="sm" mode="icon"><List size={14} /></Button></div>
      </div>
      <div className="space-y-3">
        {items.map((item, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2 rounded-lg bg-muted/30 mt-0.5"><FileText size={16} className="text-muted-foreground group-hover:text-primary" /></div>
              <div className="flex-1 min-w-0 space-y-1">
                <div className="flex items-center gap-2"><h3 className="text-sm font-bold group-hover:text-primary transition-colors truncate">{item.title}</h3><Badge variant="outline" className="text-[7px] font-bold uppercase shrink-0">{item.category}</Badge></div>
                <p className="text-xs text-muted-foreground line-clamp-2">{item.snippet}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground"><Clock size={10} /> Updated {item.updated}</div>
              </div>
              <ChevronRight size={16} className="text-muted-foreground shrink-0 mt-1 group-hover:text-primary" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
