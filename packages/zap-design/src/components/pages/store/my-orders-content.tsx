'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';

import { Badge } from '../../../genesis/atoms/interactive/badge';
import { Package, Clock, ChevronRight } from 'lucide-react';

export function MyOrdersContent() {
  const orders = [
    { id: 'ORD-2026-001', date: 'Mar 10, 2026', items: 3, total: '$427.00', status: 'Shipped', color: 'primary' },
    { id: 'ORD-2026-002', date: 'Mar 05, 2026', items: 1, total: '$79.00', status: 'Delivered', color: 'success' },
    { id: 'ORD-2026-003', date: 'Feb 28, 2026', items: 2, total: '$328.00', status: 'Processing', color: 'secondary' },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="group hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-muted/30"><Package size={20} className="text-muted-foreground group-hover:text-primary transition-colors" /></div>
                  <div className="space-y-0.5">
                    <span className="text-sm font-bold font-mono text-transform-tertiary tracking-tight">{order.id}</span>
                    <div className="flex items-center gap-2 text-[10px] text-muted-foreground uppercase font-medium">
                      <Clock size={10} /> {order.date} • {order.items} items
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <Badge variant={order.color as any} className="text-[9px] font-black uppercase italic">{order.status}</Badge>
                  <span className="text-base font-black italic">{order.total}</span>
                  <ChevronRight size={16} className="text-muted-foreground" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
