'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Label } from '../../../../genesis/atoms/interactive/label';
import { User, Mail, Globe, Save } from 'lucide-react';

export function AccountSettingsPlainContent() {
  return (
    <div className="max-w-2xl space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">General Settings</h1>
      <Card>
        <CardHeader><CardTitle className="text-lg">Profile Information</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {[
            { label: 'Display Name', placeholder: 'Zeus Tom', icon: User },
            { label: 'Email', placeholder: 'zeus@zap.inc', icon: Mail },
            { label: 'Website', placeholder: 'https://zap.inc', icon: Globe },
          ].map(field => (
            <div key={field.label}>
              <Label className="text-[10px] uppercase font-black text-muted-foreground tracking-widest mb-2 block">{field.label}</Label>
              <div className="relative">
                <field.icon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input className="w-full h-10 pl-10 pr-4 rounded-xl border bg-layer-dialog text-sm outline-none focus:ring-2 focus:ring-primary/20" placeholder={field.placeholder} />
              </div>
            </div>
          ))}
          <div className="pt-4 flex justify-end"><Button variant="primary" size="sm" className="text-[10px] font-black uppercase italic"><Save size={14} className="mr-1" /> Save Changes</Button></div>
        </CardContent>
      </Card>
    </div>
  );
}
