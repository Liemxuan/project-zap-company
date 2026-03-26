'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import { Search, SlidersHorizontal, Star, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

export function AllProductsContent() {
  const categories = ['All', 'Security', 'Infrastructure', 'Development', 'Design', 'Enterprise'];
  const products = Array.from({ length: 9 }, (_, i) => ({
    name: `Product ${i + 1}`,
    price: `$${(i + 1) * 29}`,
    rating: (4 + ((i % 5) / 5) * 0.9).toFixed(1),
    reviews: Math.floor(50 + ((i % 7) / 7) * 300),
    category: categories[1 + (i % 5)],
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">All Products</h1>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input className="w-full h-10 pl-10 pr-4 rounded-xl border bg-layer-dialog text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Search..." />
          </div>
          <Button variant="outline" size="sm" mode="icon"><SlidersHorizontal size={16} /></Button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat, idx) => (
          <Button key={cat} variant={idx === 0 ? 'primary' : 'outline'} size="sm" className="text-[10px] font-black uppercase italic whitespace-nowrap">{cat}</Button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((p, idx) => (
          <Card key={idx} className="group overflow-hidden hover:shadow-md hover:border-primary/30 transition-all cursor-pointer">
            <div className="aspect-[4/3] bg-muted/15 relative">
              <Button variant="ghost" size="sm" mode="icon" className="absolute top-3 right-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500"><Heart size={16} /></Button>
            </div>
            <CardContent className="pt-4 space-y-2 pb-4">
              <Badge variant="outline" className="text-[8px] font-bold uppercase">{p.category}</Badge>
              <h3 className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">{p.name}</h3>
              <div className="flex items-center justify-between">
                <span className="text-lg font-black italic">{p.price}</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold">{p.rating}</span>
                  <span className="text-[10px] text-muted-foreground">({p.reviews})</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center justify-center gap-2 pt-4">
        <Button variant="outline" size="sm" mode="icon"><ChevronLeft size={14} /></Button>
        {[1,2,3].map(p => (
          <Button key={p} variant={p === 1 ? 'primary' : 'outline'} size="sm" className="w-8 h-8 text-xs font-bold">{p}</Button>
        ))}
        <Button variant="outline" size="sm" mode="icon"><ChevronRight size={14} /></Button>
      </div>
    </div>
  );
}
