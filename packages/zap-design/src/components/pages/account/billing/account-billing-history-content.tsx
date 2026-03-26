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

import { FileText, Download, CloudDownload } from 'lucide-react';

export function AccountBillingHistoryContent() {
  const invoices = [
    { id: 'INV-2024-001', date: 'Mar 11, 2026', amount: '$499.00', status: 'Paid', color: 'success' },
    { id: 'INV-2024-002', date: 'Feb 11, 2026', amount: '$499.00', status: 'Paid', color: 'success' },
    { id: 'INV-2024-003', date: 'Jan 11, 2026', amount: '$499.00', status: 'Overdue', color: 'destructive' },
    { id: 'INV-2023-098', date: 'Dec 11, 2025', amount: '$150.00', status: 'Paid', color: 'success' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Payment History</CardTitle>
          <p className="text-xs text-muted-foreground">Manage and download your platform invoices.</p>
        </div>
        <Button variant="outline" size="sm">
          <CloudDownload className="w-3 h-3 mr-1" /> Export All
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-muted/30 border-y border-border/50">
                <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Invoice</th>
                <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Status</th>
                <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Date</th>
                <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-right">Amount</th>
                <th className="px-6 py-3 w-12 text-center"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/50">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-muted/5 transition-colors group">
                  <td className="px-6 py-4 flex items-center gap-3">
                    <div className="p-2 rounded bg-muted/50 text-muted-foreground group-hover:text-primary transition-colors">
                      <FileText size={16} />
                    </div>
                    <span className="text-sm font-bold tracking-tight italic">{inv.id}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    <Badge variant={inv.color as any} className="text-[9px] font-black uppercase tracking-tight">
                      {inv.status}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-xs font-medium text-muted-foreground">{inv.date}</td>
                  <td className="px-6 py-4 text-sm font-black text-right">{inv.amount}</td>
                  <td className="px-6 py-4 text-center">
                    <Button variant="ghost" size="sm" mode="icon" className="hover:text-primary">
                      <Download size={14} />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
      <CardFooter className="py-4 justify-center">
        <Button variant="ghost" size="sm" className="text-[10px] uppercase font-black text-muted-foreground hover:text-primary tracking-tighter">
          Load Full Transaction History
        </Button>
      </CardFooter>
    </Card>
  );
}
