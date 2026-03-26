'use client';

import * as React from 'react';
import {
  
  
  
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CardFooter
} from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import {
  Star,
  Heart,
  ShoppingCart,
  Share2,
  
  Check,
  Package,
  Shield,
  Truck,
  RotateCcw,
  Minus,
  Plus
} from 'lucide-react';

export function ProductDetailsContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-4">
        <div className="aspect-square rounded-3xl bg-muted/20 border overflow-hidden relative group">
          <div className="absolute inset-0 flex items-center justify-center">
            <Package className="text-muted-foreground/10" size={120} />
          </div>
          <Badge variant="primary" className="absolute top-4 left-4 text-[9px] font-black italic uppercase shadow-lg">Best Seller</Badge>
        </div>
        <div className="grid grid-cols-4 gap-3">
          {[1,2,3,4].map(i => (
            <div key={i} className={`aspect-square rounded-xl border-2 bg-muted/10 cursor-pointer transition-all ${i === 1 ? 'border-primary' : 'border-transparent hover:border-primary/30'}`} />
          ))}
        </div>
      </div>

      <div className="space-y-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[8px] font-bold uppercase">Security</Badge>
            <Badge variant="success" className="text-[8px] font-black uppercase"><Check size={10} className="mr-0.5" /> In Stock</Badge>
          </div>
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">Sentinel Shield Pro</h1>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={16} className={i <= 4 ? 'text-amber-400 fill-amber-400' : 'text-muted-foreground/30'} />)}
            </div>
            <span className="text-sm font-bold">4.8</span>
            <span className="text-xs text-muted-foreground">(124 reviews)</span>
          </div>
        </div>

        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-black italic">$299</span>
          <span className="text-lg text-muted-foreground line-through">$399</span>
          <Badge variant="destructive" className="text-[9px] font-black uppercase italic">-25%</Badge>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Enterprise-grade security monitoring and threat detection system, designed for modern agentic infrastructure. Real-time alerts, automated responses, and zero-trust architecture.
        </p>

        <div className="flex items-center gap-3 p-4 rounded-xl border bg-muted/5">
          <span className="text-[10px] uppercase font-black text-muted-foreground tracking-widest">Qty</span>
          <div className="flex items-center border rounded-lg">
            <Button variant="ghost" size="sm" mode="icon"><Minus size={14} /></Button>
            <span className="w-12 text-center text-sm font-bold">1</span>
            <Button variant="ghost" size="sm" mode="icon"><Plus size={14} /></Button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="primary" className="flex-1 h-14 font-black italic uppercase text-xs tracking-widest shadow-xl shadow-primary/20">
            <ShoppingCart size={16} className="mr-2" /> Add to Cart
          </Button>
          <Button variant="outline" className="h-14" mode="icon"><Heart size={20} /></Button>
          <Button variant="outline" className="h-14" mode="icon"><Share2 size={20} /></Button>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t">
          {[
            { icon: Truck, label: 'Free Shipping', sub: 'Orders $100+' },
            { icon: Shield, label: 'Secure Payment', sub: 'SSL Encrypted' },
            { icon: RotateCcw, label: '30-Day Return', sub: 'No Questions' },
          ].map((feat, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5 text-center p-3">
              <feat.icon size={20} className="text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest">{feat.label}</span>
              <span className="text-[9px] text-muted-foreground">{feat.sub}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
