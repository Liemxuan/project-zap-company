'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';


import { Building2, CreditCard, Users, Globe, Shield, Settings } from 'lucide-react';

export function AccountSettingsEnterpriseContent() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Enterprise Settings</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { title: 'Organization', desc: 'Company profile and branding', icon: Building2 },
          { title: 'Billing & Plans', desc: 'Subscription and invoices', icon: CreditCard },
          { title: 'Team Management', desc: 'Roles, permissions, SSO', icon: Users },
          { title: 'Compliance', desc: 'Audit logs and security', icon: Shield },
          { title: 'Domains', desc: 'Custom domains and DNS', icon: Globe },
          { title: 'Advanced', desc: 'API limits and webhooks', icon: Settings },
        ].map((s, i) => (
          <Card key={i} className="group hover:border-primary/30 transition-all cursor-pointer">
            <CardContent className="p-6 flex items-center gap-4">
              <div className="p-3 rounded-xl bg-muted/30 group-hover:bg-primary/5 transition-colors"><s.icon size={24} className="text-muted-foreground group-hover:text-primary" /></div>
              <div><h3 className="text-sm font-bold group-hover:text-primary transition-colors">{s.title}</h3><p className="text-xs text-muted-foreground">{s.desc}</p></div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
