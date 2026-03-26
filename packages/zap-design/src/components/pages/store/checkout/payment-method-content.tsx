'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';

import { CreditCard, Wallet, MoveLeft, Rocket, Check } from 'lucide-react';

export function PaymentMethodContent() {
  const paymentMethods = [
    { type: 'Visa', last4: '4242', exp: '12/26', primary: true, icon: CreditCard },
    { type: 'PayPal', email: 'zap@zap.inc', primary: false, icon: Wallet }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-black tracking-tighter uppercase italic">Secure Checkout</h1>
          <p className="text-sm text-muted-foreground">Select your preferred payment method to complete the upgrade.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {paymentMethods.map((method, idx) => (
            <div 
              key={idx} 
              className={`p-6 rounded-2xl border-2 transition-all cursor-pointer relative group ${method.primary ? 'border-primary bg-primary/5' : 'border-border bg-white hover:border-primary/50'}`}
            >
              {method.primary && (
                 <div className="absolute top-4 right-4 bg-primary rounded-full p-1 shadow-lg">
                    <Check className="text-white w-3 h-3" />
                 </div>
              )}
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-muted/50 w-fit">
                   <method.icon className="w-6 h-6 text-foreground" />
                </div>
                <div className="space-y-1">
                   <p className="text-sm font-bold uppercase tracking-tight">{method.type} {method.last4 ? `•••• ${method.last4}` : ''}</p>
                   <p className="text-[10px] text-muted-foreground font-medium uppercase">{method.exp || method.email}</p>
                </div>
              </div>
              <div className="mt-6 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-muted-foreground hover:text-primary">Edit</Button>
                {!method.primary && <Button variant="ghost" size="sm" className="text-[10px] font-black uppercase text-muted-foreground hover:text-destructive">Remove</Button>}
              </div>
            </div>
          ))}
          <div className="p-6 rounded-2xl border-2 border-dashed border-border flex flex-col items-center justify-center gap-2 hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer">
             <div className="p-2 rounded-full bg-muted/50"><Rocket size={20} className="text-muted-foreground" /></div>
             <span className="text-[10px] font-black uppercase text-muted-foreground">Add New Method</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-6 border-t">
           <Button variant="outline" size="sm" className="uppercase text-xs font-bold" asChild>
              <Link href="/store-client/checkout/shipping-info">
                 <MoveLeft size={14} className="mr-2" /> Back
              </Link>
           </Button>
           <Button variant="primary" size="sm" className="uppercase text-xs font-black italic shadow-lg shadow-primary/20">
              Complete Payment
           </Button>
        </div>
      </div>

      <div className="lg:col-span-1">
        <Card className="bg-zinc-900 border-zinc-800 text-white sticky top-6">
          <CardHeader>
            <CardTitle className="text-sm uppercase font-black tracking-widest text-zinc-400">Order Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">Pro Subscription (Annual)</span>
                <span className="font-bold font-mono text-transform-tertiary">$499.00</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-zinc-400">VAT (0%)</span>
                <span className="font-bold font-mono text-transform-tertiary">$0.00</span>
              </div>
            </div>
            
            <div className="pt-6 border-t border-zinc-800 flex justify-between items-center">
              <span className="font-black uppercase tracking-tighter italic">Total Amount</span>
              <span className="text-2xl font-black italic">$499.00</span>
            </div>
          </CardContent>
          <CardFooter className="bg-zinc-800/50 py-4 italic text-[10px] text-zinc-500 text-center">
             Billed annually. Cancel anytime. Secure SSL encryption verified.
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
