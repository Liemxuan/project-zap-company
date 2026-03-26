'use client';

import * as React from 'react';
import {
  Card,
  
  
  CardContent,
  CardFooter
} from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import {
  Store,
  Search,
  SlidersHorizontal,
  Heart,
  ShoppingCart,
  Star,
  
  LayoutGrid,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  List
} from 'lucide-react';

export function StoreClientContent() {
  const products = [
    { name: 'Sentinel Shield Pro', price: '$299', rating: 4.8, reviews: 124, category: 'Security', badge: 'Best Seller' },
    { name: 'Fleet Node X1', price: '$149', rating: 4.5, reviews: 87, category: 'Infrastructure' },
    { name: 'Agent Toolkit v3', price: '$79', rating: 4.9, reviews: 312, category: 'Development', badge: 'New' },
    { name: 'Olympus Gateway', price: '$499', rating: 4.7, reviews: 56, category: 'Enterprise' },
    { name: 'Claw Scanner Lite', price: '$49', rating: 4.3, reviews: 201, category: 'Security' },
    { name: 'M3 Token Pack', price: '$29', rating: 4.6, reviews: 445, category: 'Design', badge: 'Popular' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-[32px] font-display font-medium italic tracking-tighter text-transform-primary">Store</h1>
          <p className="text-sm text-muted-foreground">Browse premium tools and infrastructure packages.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
            <input className="w-full h-10 pl-10 pr-4 rounded-xl border bg-layer-dialog text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none" placeholder="Search products..." />
          </div>
          <Button variant="outline" size="sm" mode="icon"><SlidersHorizontal size={16} /></Button>
          <Button variant="outline" size="sm" mode="icon"><LayoutGrid size={16} /></Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product, idx) => (
          <Card key={idx} className="group overflow-hidden hover:shadow-lg hover:border-primary/30 transition-all cursor-pointer">
            <div className="aspect-[4/3] bg-muted/20 relative">
              <div className="absolute inset-0 flex items-center justify-center"><Store className="text-muted-foreground/10" size={60} /></div>
              {product.badge && (
                <Badge variant="primary" className="absolute top-3 left-3 text-labelSmall font-body text-transform-secondary italic text-transform-primary shadow-lg">{product.badge}</Badge>
              )}
              <Button variant="ghost" size="sm" mode="icon" className="absolute top-3 right-3 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-sm shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:text-rose-500">
                <Heart size={16} />
              </Button>
            </div>
            <CardContent className="pt-4 space-y-2">
              <Badge variant="outline" className="text-[10px] font-body text-transform-secondary text-transform-primary">{product.category}</Badge>
              <h3 className="text-sm font-bold tracking-tight group-hover:text-primary transition-colors">{product.name}</h3>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  <Star size={12} className="text-amber-400 fill-amber-400" />
                  <span className="text-xs font-bold">{product.rating}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">({product.reviews})</span>
              </div>
            </CardContent>
            <CardFooter className="flex items-center justify-between">
              <span className="text-lg font-black italic">{product.price}</span>
              <Button variant="primary" size="sm" className="text-[10px] font-body text-transform-secondary text-transform-primary italic">
                <ShoppingCart size={12} className="mr-1" /> Add
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
