'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  CardFooter
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { Progress } from '../../../../genesis/atoms/interactive/progress';
import { CreditCard, Landmark, Wallet, SquarePlus, SquarePen, Download } from 'lucide-react';

export function AccountBillingBasicContent() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 space-y-6">
        {/* Active Plan Card */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h2 className="text-2xl font-black italic tracking-tighter uppercase">Pro Plan</h2>
                  <Badge variant="primary" className="text-[10px] font-bold">ANNUAL</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Advanced features for growing engineering teams.</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">Manage Plan</Button>
                <Button variant="primary" size="sm">Upgrade</Button>
              </div>
            </div>
            
            <div className="mt-8 space-y-2">
              <div className="flex justify-between text-[10px] uppercase font-bold text-muted-foreground tracking-widest">
                <span>Usage: 32 of 50 Seats</span>
                <span>64%</span>
              </div>
              <Progress value={64} className="h-1.5" />
            </div>
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Payment Methods</CardTitle>
            <Button variant="outline" size="sm">
              <SquarePlus className="w-3 h-3 mr-1" /> Add New
            </Button>
          </CardHeader>
          <CardContent className="grid gap-3">
            {[
              { type: 'Visa', last4: '4242', exp: '12/26', primary: true, icon: CreditCard },
              { type: 'PayPal', email: 'zap@zap.inc', primary: false, icon: Wallet }
            ].map((method, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 rounded-xl border bg-muted/5">
                <div className="flex items-center gap-4">
                  <div className="p-2 rounded-lg bg-layer-dialog border">
                    <method.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold">{method.type} {method.last4 ? `•••• ${method.last4}` : ''}</span>
                    <span className="text-[10px] text-muted-foreground uppercase font-medium">{method.exp || method.email}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  {method.primary && <Badge variant="secondary" className="text-[9px] font-black uppercase">Primary</Badge>}
                  <Button variant="ghost" size="sm" mode="icon"><SquarePen size={14} /></Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="xl:col-span-1 space-y-6">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Landmark className="w-5 h-5 text-primary" />
              Tax Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Entity Name</p>
              <p className="text-sm font-medium">ZAP INC.</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">VAT Number</p>
              <p className="text-sm font-medium">US812345678</p>
            </div>
            <div className="space-y-0.5">
              <p className="text-[10px] uppercase font-bold text-muted-foreground">Address</p>
              <p className="text-xs text-muted-foreground">123 Security Blvd, Cyber City, Global 404</p>
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" size="sm" className="w-full text-[10px] uppercase font-black hover:text-primary">Edit Billing Details</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase font-black tracking-tighter">Resources</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <Button variant="outline" className="w-full justify-between group h-12">
                <span className="text-xs font-bold uppercase">Download W-9</span>
                <Download className="w-4 h-4 group-hover:translate-y-0.5 transition-transform" />
             </Button>
             <Button variant="outline" className="w-full justify-between group h-12">
                <span className="text-xs font-bold uppercase">Tax Exemption</span>
                <SquarePen className="w-4 h-4" />
             </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
