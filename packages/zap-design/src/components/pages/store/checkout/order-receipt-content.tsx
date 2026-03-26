'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import {  Download, Printer, Package } from 'lucide-react';

export function OrderReceiptContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-black italic tracking-tighter uppercase">Receipt</h1>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase"><Download size={12} className="mr-1" /> PDF</Button>
          <Button variant="outline" size="sm" className="text-[10px] font-bold uppercase"><Printer size={12} className="mr-1" /> Print</Button>
        </div>
      </div>

      <Card>
        <CardHeader className="border-b">
          <div className="flex justify-between items-start">
            <div className="space-y-0.5">
              <CardTitle className="text-lg font-black italic">ORD-2026-001</CardTitle>
              <p className="text-[10px] text-muted-foreground uppercase font-medium">Placed on Mar 10, 2026</p>
            </div>
            <Badge variant="success" className="text-[9px] font-black uppercase italic">Completed</Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="space-y-4">
            {[
              { name: 'Sentinel Shield Pro', qty: 1, price: '$299.00' },
              { name: 'Agent Toolkit v3', qty: 2, price: '$158.00' },
            ].map((item, idx) => (
              <div key={idx} className="flex items-center justify-between py-3 border-b border-dashed last:border-0">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-lg bg-muted/30 flex items-center justify-center"><Package size={16} className="text-muted-foreground" /></div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">Qty: {item.qty}</span>
                  </div>
                </div>
                <span className="text-sm font-black italic">{item.price}</span>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl bg-muted/10 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal</span><span className="font-bold">$457.00</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="font-bold text-green-600">FREE</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Tax</span><span className="font-bold">$0.00</span></div>
            <div className="pt-3 border-t flex justify-between"><span className="font-black uppercase italic">Total</span><span className="text-xl font-black italic">$457.00</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
