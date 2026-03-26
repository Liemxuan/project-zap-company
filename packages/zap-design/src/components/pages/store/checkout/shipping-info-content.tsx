'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Label } from '../../../../genesis/atoms/interactive/label';
import { ArrowRight, MoveLeft, MapPin, Truck } from 'lucide-react';
import Link from 'next/link';

export function ShippingInfoContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black italic tracking-tighter uppercase">Shipping Info</h1>
          <p className="text-sm text-muted-foreground">Enter your delivery address and preferred shipping method.</p>
        </div>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><MapPin size={18} /> Delivery Address</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'First Name', placeholder: 'Zeus' },
                { label: 'Last Name', placeholder: 'Tom' },
                { label: 'Street Address', placeholder: '123 Security Blvd', full: true },
                { label: 'City', placeholder: 'Cyber City' },
                { label: 'Postal Code', placeholder: '404' },
                { label: 'Country', placeholder: 'Global Federation' },
                { label: 'Phone', placeholder: '+1 (800) ZAP-SHIP' },
              ].map(field => (
                <div key={field.label} className={field.full ? 'md:col-span-2' : ''}>
                  <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2 block">{field.label}</Label>
                  <input className="w-full h-10 px-4 rounded-xl border bg-layer-dialog text-sm placeholder:text-muted-foreground focus:ring-2 focus:ring-primary/20 outline-none" placeholder={field.placeholder} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Truck size={18} /> Shipping Method</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            {[
              { name: 'Standard Shipping', time: '5-7 business days', price: 'FREE', active: true },
              { name: 'Express Shipping', time: '2-3 business days', price: '$14.99', active: false },
              { name: 'Overnight Shipping', time: 'Next business day', price: '$29.99', active: false },
            ].map(method => (
              <div key={method.name} className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${method.active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                <div className="flex items-center gap-4">
                  <div className={`size-4 rounded-full border-2 ${method.active ? 'border-primary bg-primary' : 'border-muted-foreground'}`}>
                    {method.active && <div className="size-1.5 rounded-full bg-white m-auto mt-[3px]" />}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{method.name}</span>
                    <span className="text-[10px] text-muted-foreground uppercase">{method.time}</span>
                  </div>
                </div>
                <span className={`text-sm font-black italic ${method.price === 'FREE' ? 'text-green-600' : ''}`}>{method.price}</span>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between pt-6 border-t">
          <Button variant="outline" size="sm" className="uppercase text-xs font-bold" asChild>
            <Link href="/store-client/cart"><MoveLeft size={14} className="mr-2" /> Back to Cart</Link>
          </Button>
          <Button variant="primary" size="sm" className="uppercase text-xs font-black italic shadow-lg shadow-primary/20" asChild>
            <Link href="/store-client/checkout/payment-method">Continue <ArrowRight size={14} className="ml-2" /></Link>
          </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="sticky top-6">
          <CardHeader><CardTitle className="text-sm uppercase font-black tracking-widest text-muted-foreground">Order Summary</CardTitle></CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Subtotal (3 items)</span><span className="font-bold font-mono text-transform-tertiary">$457.00</span></div>
            <div className="flex justify-between text-sm"><span className="text-muted-foreground">Shipping</span><span className="font-bold text-green-600">FREE</span></div>
            <div className="pt-3 border-t flex justify-between"><span className="font-black uppercase italic">Total</span><span className="text-xl font-black italic">$457.00</span></div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
