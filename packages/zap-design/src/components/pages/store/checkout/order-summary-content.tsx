'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';

import { Package, ArrowRight, MoveLeft } from 'lucide-react';
import Link from 'next/link';

export function OrderSummaryContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Review Order</h1>
          <p className="text-sm text-muted-foreground">Confirm your items and shipping details before completing checkout.</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg">Items ({2})</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: 'Sentinel Shield Pro', qty: 1, price: '$299.00' },
              { name: 'Agent Toolkit v3', qty: 2, price: '$158.00' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border bg-muted/5">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-lg bg-muted/30 flex items-center justify-center"><Package size={20} className="text-muted-foreground" /></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">Qty: {item.qty}</span>
                  </div>
                </div>
                <span className="text-sm font-black italic">{item.price}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Shipping Address</CardTitle></CardHeader>
          <CardContent>
            <div className="p-4 rounded-xl border bg-muted/5 space-y-1">
              <p className="text-sm font-bold">ZAP Inc. HQ</p>
              <p className="text-xs text-muted-foreground">123 Security Blvd, Cyber City, Global 404</p>
              <p className="text-xs text-muted-foreground">+1 (800) ZAP-SHIP</p>
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" size="sm" className="uppercase text-xs font-bold" asChild>
            <Link href="/store-client/checkout/payment-method"><MoveLeft size={14} className="mr-2" /> Back</Link>
          </Button>
          <Button variant="primary" size="sm" className="uppercase text-xs font-black italic shadow-lg shadow-primary/20">
            Place Order <ArrowRight size={14} className="ml-2" />
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="bg-zinc-900 border-zinc-800 text-white sticky top-6">
          <CardHeader><CardTitle className="text-sm uppercase font-black tracking-widest text-zinc-400">Total</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Subtotal</span><span className="font-mono text-transform-tertiary font-bold">$457.00</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Shipping</span><span className="font-bold text-green-400">FREE</span></div>
              <div className="flex justify-between text-sm"><span className="text-zinc-400">Tax</span><span className="font-mono text-transform-tertiary font-bold">$0.00</span></div>
            </div>
            <div className="pt-4 border-t border-zinc-800 flex justify-between items-center">
              <span className="font-black uppercase tracking-tighter italic">Grand Total</span>
              <span className="text-3xl font-black italic">$457</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
