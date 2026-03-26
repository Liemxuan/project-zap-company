'use client';

import * as React from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter
} from '../../../genesis/molecules/card';
import { Button } from '../../../genesis/atoms/interactive/button';
import { Badge } from '../../../genesis/atoms/interactive/badge';
import { Trash2, Minus, Plus, ShoppingCart, ArrowRight, Tag } from 'lucide-react';

export function CartContent() {
  const items = [
    { name: 'Sentinel Shield Pro', price: 299, qty: 1, category: 'Security' },
    { name: 'Agent Toolkit v3', price: 79, qty: 2, category: 'Development' },
  ];

  const subtotal = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Shopping Cart</h1>
          <Badge variant="secondary" className="text-[10px] font-black">{items.length} items</Badge>
        </div>

        <div className="space-y-4">
          {items.map((item, idx) => (
            <Card key={idx} className="overflow-hidden">
              <CardContent className="p-0">
                <div className="flex flex-col md:flex-row">
                  <div className="w-full md:w-32 aspect-square md:aspect-auto bg-muted/20 flex items-center justify-center shrink-0">
                    <ShoppingCart className="text-muted-foreground/10" size={32} />
                  </div>
                  <div className="flex-1 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-[8px] font-bold uppercase mb-1">{item.category}</Badge>
                      <h3 className="text-sm font-bold tracking-tight">{item.name}</h3>
                      <p className="text-lg font-black italic">${item.price}</p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border rounded-lg">
                        <Button variant="ghost" size="sm" mode="icon"><Minus size={14} /></Button>
                        <span className="w-10 text-center text-sm font-bold">{item.qty}</span>
                        <Button variant="ghost" size="sm" mode="icon"><Plus size={14} /></Button>
                      </div>
                      <span className="text-base font-black italic min-w-[80px] text-right">${item.price * item.qty}</span>
                      <Button variant="ghost" size="sm" mode="icon" className="text-muted-foreground hover:text-destructive"><Trash2 size={16} /></Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader>
            <CardTitle className="text-sm uppercase font-black tracking-widest text-muted-foreground">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-bold font-mono text-transform-tertiary">${subtotal}.00</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Shipping</span>
                <span className="font-bold text-green-600">FREE</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Tax</span>
                <span className="font-bold font-mono text-transform-tertiary">$0.00</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed bg-muted/5">
              <Tag size={14} className="text-muted-foreground" />
              <input className="flex-1 text-xs bg-transparent outline-none placeholder:text-muted-foreground" placeholder="Coupon code" />
              <Button variant="ghost" size="sm" className="text-[9px] font-black uppercase">Apply</Button>
            </div>

            <div className="pt-4 border-t flex justify-between items-center">
              <span className="font-black uppercase tracking-tighter italic">Total</span>
              <span className="text-2xl font-black italic">${subtotal}.00</span>
            </div>
          </CardContent>
          <CardFooter className="flex-col gap-3">
            <Button variant="primary" className="w-full h-14 font-black italic uppercase text-xs tracking-widest shadow-xl shadow-primary/20">
              Proceed to Checkout <ArrowRight size={16} className="ml-2" />
            </Button>
            <Button variant="ghost" className="w-full text-[10px] font-bold uppercase text-muted-foreground">Continue Shopping</Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
