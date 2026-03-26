'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { 
  IdCard, 
  ShieldCheck, 
  FileText, 
  Bell, 
  Boxes, 
  Users, 
  KeySquare, 
  MousePointerSquareDashed, 
   
   
  LineChart,
  ChevronRight
} from 'lucide-react';

export function AccountHomeGetStartedContent() {
  const items = [
    {
      icon: IdCard,
      title: 'Personal Info',
      desc: "Manage your personal profile and visibility settings.",
      path: '/account/members/team-info',
    },
    {
      icon: ShieldCheck,
      title: 'Login & Security',
      desc: 'Authentication measures and security monitoring.',
      path: '/account/security/security-log',
    },
    {
      icon: FileText,
      title: 'Billing & Payments',
      desc: 'Simplify payments with secure transaction processes.',
      path: '/account/billing/basic',
    },
    {
      icon: Bell,
      title: 'Notifications',
      desc: 'Important notices and event reminders.',
      path: '/account/notifications',
    },
    {
      icon: Boxes,
      title: 'Integrations',
      desc: 'Enhance workflows with advanced connections.',
      path: '/account/integrations',
    },
    {
      icon: Users,
      title: 'Management',
      desc: 'Manage members, teams, and access roles.',
      path: '/account/members/roles',
    },
    {
      icon: KeySquare,
      title: 'API Keys',
      desc: 'Manage your API Keys effectively.',
      path: '/account/api-keys',
    },
    {
      icon: MousePointerSquareDashed,
      title: 'Appearance',
      desc: 'Transform your platform look and feel.',
      path: '/account/appearance',
    },
    {
      icon: LineChart,
      title: 'Activity',
      desc: 'Track your personal platform usage.',
      path: '/account/activity',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((item, idx) => (
          <Link key={idx} href={item.path} className="group">
            <Card className="h-full hover:border-primary/50 transition-all hover:shadow-sm cursor-pointer active:scale-[0.98]">
              <CardContent className="p-5 flex items-start gap-4">
                <div className="p-3 rounded-xl bg-primary/5 group-hover:bg-primary/10 transition-colors text-primary">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="flex-1 space-y-1">
                  <h3 className="text-sm font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-snug">{item.desc}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity self-center" />
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      <div className="flex justify-center">
        <Button variant="ghost" className="text-xs uppercase tracking-widest font-black" asChild>
          <Link href="/account/members/team-info">More Account Options</Link>
        </Button>
      </div>
    </div>
  );
}
