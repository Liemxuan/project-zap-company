'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import {  ShoppingCart, Trash2, Star, Package } from 'lucide-react';

export function WishlistContent() {
  const wishlistItems = [
    { name: 'Fleet Node X1', price: '$149', category: 'Infrastructure', rating: 4.5 },
    { name: 'Olympus Gateway', price: '$499', category: 'Enterprise', rating: 4.7 },
    { name: 'M3 Token Pack', price: '$29', category: 'Design', rating: 4.6 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Wishlist</h1>
          <p className="text-sm text-muted-foreground">{wishlistItems.length} items saved for later.</p>
        </div>
        <Button variant="outline" size="sm" className="text-[10px] font-black uppercase">Clear All</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlistItems.map((item, idx) => (
          <Card key={idx} className="group overflow-hidden hover:shadow-md transition-all">
            <div className="aspect-[4/3] bg-muted/15 relative flex items-center justify-center">
              <Package className="text-muted-foreground/10" size={48} />
              <div className="absolute top-3 right-3 flex gap-1.5">
                <Button variant="ghost" size="sm" mode="icon" className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm hover:text-destructive"><Trash2 size={14} /></Button>
              </div>
            </div>
            <CardContent className="pt-4 space-y-3 pb-4">
              <Badge variant="outline" className="text-[8px] font-bold uppercase">{item.category}</Badge>
              <h3 className="text-sm font-bold tracking-tight">{item.name}</h3>
              <div className="flex items-center gap-2">
                <Star size={12} className="text-amber-400 fill-amber-400" />
                <span className="text-xs font-bold">{item.rating}</span>
              </div>
              <div className="flex items-center justify-between pt-2">
                <span className="text-lg font-black italic">{item.price}</span>
                <Button variant="primary" size="sm" className="text-[9px] font-black uppercase italic">
                  <ShoppingCart size={12} className="mr-1" /> Add to Cart
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
