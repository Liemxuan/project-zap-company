'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';

import { Shield } from 'lucide-react';

export function AccountPermissionsToggleContent() {
  const permissions = [
    { name: 'View Dashboard', desc: 'Access analytics and overview', enabled: true },
    { name: 'Manage Users', desc: 'Create, edit, delete user accounts', enabled: false },
    { name: 'Billing Access', desc: 'View and manage billing information', enabled: true },
    { name: 'API Management', desc: 'Generate and revoke API keys', enabled: false },
    { name: 'System Settings', desc: 'Modify core system configuration', enabled: false },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Permission Toggles</h1>
      <Card>
        <CardContent className="pt-6 space-y-1">
          {permissions.map((p, i) => (
            <div key={i} className="flex items-center justify-between py-4 border-b last:border-0">
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-muted/30"><Shield size={16} className="text-muted-foreground" /></div>
                <div><h3 className="text-sm font-bold">{p.name}</h3><p className="text-[10px] text-muted-foreground">{p.desc}</p></div>
              </div>
              <button className={`relative w-11 h-6 rounded-full transition-colors ${p.enabled ? 'bg-primary' : 'bg-muted'}`}>
                <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${p.enabled ? 'left-[22px]' : 'left-0.5'}`} />
              </button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
