'use client';

import * as React from 'react';

import { Button } from '../../../../genesis/atoms/interactive/button';
import { Rocket, ArrowRight } from 'lucide-react';

export function AccountTeamsStarterContent() {
  return (
    <div className="max-w-xl mx-auto text-center space-y-8 py-12">
      <div className="size-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center"><Rocket className="text-primary" size={36} /></div>
      <div className="space-y-3">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Create Your First Team</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">Teams let you organize members by department, project, or function.</p>
      </div>
      <Button variant="primary" className="h-14 px-10 font-black italic uppercase text-xs tracking-widest shadow-xl shadow-primary/20">Create Team <ArrowRight size={14} className="ml-2" /></Button>
    </div>
  );
}
