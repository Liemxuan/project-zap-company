'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { CheckCircle2, Printer, ArrowRight } from 'lucide-react';

export function OrderPlacedContent() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <Card className="max-w-lg w-full text-center border-0 shadow-none bg-transparent">
        <CardContent className="pt-10 space-y-8">
          <div className="size-24 rounded-full bg-green-500/10 mx-auto flex items-center justify-center animate-in zoom-in duration-500">
            <CheckCircle2 className="text-green-500" size={48} />
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-black italic tracking-tighter uppercase">Order Placed!</h1>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">Your order <span className="font-bold font-mono text-transform-tertiary">ORD-2026-001</span> has been confirmed and is being processed.</p>
          </div>
          <div className="p-6 rounded-2xl bg-muted/20 border space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Order Total</span><span className="font-black italic">$427.00</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Estimated Delivery</span><span className="font-bold">Mar 14, 2026</span></div>
          </div>
          <div className="flex flex-col gap-3">
            <Button variant="primary" className="w-full h-12 font-black italic uppercase text-xs tracking-widest">Track Order <ArrowRight size={14} className="ml-2" /></Button>
            <Button variant="outline" className="w-full text-xs font-bold uppercase"><Printer size={14} className="mr-2" /> Print Receipt</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
