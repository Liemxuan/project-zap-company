'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';

import { Check, X } from 'lucide-react';

export function AccountPermissionsCheckContent() {
  const perms = [
    { module: 'Dashboard', read: true, write: true, delete: false },
    { module: 'Users', read: true, write: false, delete: false },
    { module: 'Billing', read: true, write: true, delete: true },
    { module: 'Settings', read: true, write: true, delete: false },
    { module: 'API Keys', read: true, write: false, delete: false },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Permissions Check</h1>
      <Card>
        <CardContent className="p-0">
          <table className="w-full text-left">
            <thead><tr className="bg-muted/30 border-b">
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest">Module</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Read</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Write</th>
              <th className="px-6 py-3 text-[10px] uppercase font-black text-muted-foreground tracking-widest text-center">Delete</th>
            </tr></thead>
            <tbody className="divide-y divide-border/50">
              {perms.map((p, i) => (
                <tr key={i} className="hover:bg-muted/5">
                  <td className="px-6 py-4 text-sm font-bold">{p.module}</td>
                  {[p.read, p.write, p.delete].map((v, j) => (
                    <td key={j} className="px-6 py-4 text-center">{v ? <Check size={16} className="text-green-500 mx-auto" /> : <X size={16} className="text-muted-foreground/30 mx-auto" />}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
