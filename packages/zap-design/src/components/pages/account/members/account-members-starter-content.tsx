'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Users, ArrowRight, Shield, Zap } from 'lucide-react';

export function AccountMembersStarterContent() {
  return (
    <div className="max-w-xl mx-auto text-center space-y-8 py-12">
      <div className="size-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center"><Users className="text-primary" size={36} /></div>
      <div className="space-y-3">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Build Your Team</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">Invite collaborators, assign roles, and manage permissions from one place.</p>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {[
          { icon: Users, label: 'Invite Members', desc: 'Add up to 50 members' },
          { icon: Shield, label: 'Set Permissions', desc: 'Granular access control' },
          { icon: Zap, label: 'Collaborate', desc: 'Real-time fleet ops' },
        ].map((f, i) => (
          <Card key={i} className="text-center"><CardContent className="pt-6 space-y-2"><f.icon size={24} className="mx-auto text-primary" /><h3 className="text-xs font-bold">{f.label}</h3><p className="text-[10px] text-muted-foreground">{f.desc}</p></CardContent></Card>
        ))}
      </div>
      <Button variant="primary" className="h-14 px-10 font-black italic uppercase text-xs tracking-widest shadow-xl shadow-primary/20">Get Started <ArrowRight size={14} className="ml-2" /></Button>
    </div>
  );
}
