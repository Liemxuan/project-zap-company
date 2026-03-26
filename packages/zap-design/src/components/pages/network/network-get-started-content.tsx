'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../genesis/molecules/card';

import { Rocket, ArrowRight, CheckCircle2, Zap, Users, Shield } from 'lucide-react';

export function NetworkGetStartedContent() {
  const steps = [
    { title: 'Build Your Profile', desc: 'Complete your entity identity and security clearance.', icon: Shield, done: true },
    { title: 'Connect Nodes', desc: 'Link your first 5 network nodes for fleet coordination.', icon: Zap, done: true },
    { title: 'Invite Your Team', desc: 'Bring in collaborators from Vietnam and beyond.', icon: Users, done: false },
    { title: 'Launch Operations', desc: 'Deploy your first automated workflow.', icon: Rocket, done: false },
  ];
  return (
    <div className="max-w-2xl mx-auto space-y-8 py-8">
      <div className="text-center space-y-3">
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Get Started</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">Complete these steps to unlock the full power of your network.</p>
      </div>
      <div className="space-y-4">
        {steps.map((step, i) => (
          <Card key={i} className={`group transition-all ${step.done ? 'border-green-500/30 bg-green-500/5' : 'hover:border-primary/30 cursor-pointer'}`}>
            <CardContent className="p-6 flex items-center gap-6">
              <div className={`size-12 rounded-2xl flex items-center justify-center shrink-0 ${step.done ? 'bg-green-500/10 text-green-500' : 'bg-muted/30 text-muted-foreground group-hover:text-primary group-hover:bg-primary/5'} transition-colors`}>
                {step.done ? <CheckCircle2 size={24} /> : <step.icon size={24} />}
              </div>
              <div className="flex-1">
                <h3 className={`text-sm font-bold tracking-tight ${step.done ? 'line-through opacity-60' : ''}`}>{step.title}</h3>
                <p className="text-xs text-muted-foreground">{step.desc}</p>
              </div>
              {!step.done && <ArrowRight size={16} className="text-muted-foreground group-hover:text-primary transition-colors" />}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
