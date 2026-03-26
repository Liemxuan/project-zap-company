'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { BellRing, MessageSquareText, BellDot, Phone } from 'lucide-react';

export function AccountNotificationsContent() {
  const items = [
    {
      icon: BellRing,
      title: 'Streamlined Alerts Setup',
      summary: 'Tailor your alert preferences with our streamlined setup. Stay informed with notifications.',
    },
    {
      icon: MessageSquareText,
      title: 'Effective Communication',
      summary: 'Ensure timely communication with our instant notification tools and real-time alerts.',
    },
    {
      icon: BellDot,
      title: 'Personalized Updates',
      summary: 'Control how you receive updates with our smart alert system and efficient workflow.',
    }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <div className="col-span-1 xl:col-span-2 space-y-6 lg:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Notification Channels</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
              <div className="space-y-0.5">
                <p className="text-sm font-bold">Email Notifications</p>
                <p className="text-xs text-muted-foreground">Receive security and activity alerts via your primary email.</p>
              </div>
              <Button variant="outline" size="sm">Enabled</Button>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
              <div className="space-y-0.5">
                <p className="text-sm font-bold">SMS Mobile Alerts</p>
                <p className="text-xs text-muted-foreground">Critical alerts sent directly to your verified mobile device.</p>
              </div>
              <Button variant="outline" size="sm">Enable</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-8 flex flex-col md:flex-row items-center gap-8">
            <div className="space-y-4 text-center md:text-left">
              <h2 className="text-2xl font-bold tracking-tight">Need Support?</h2>
              <p className="text-sm text-muted-foreground max-w-sm">
                Get assistance with your account preferences or contact our 24/7 support team for personalized help.
              </p>
              <Button variant="primary" className="gap-2">
                <Phone className="w-4 h-4" /> Contact Support
              </Button>
            </div>
            <div className="shrink-0 w-32 h-32 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
               <BellRing className="w-16 h-16 text-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 space-y-6 lg:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Do Not Disturb</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">Silence all non-critical notifications during specific hours to avoid interruptions.</p>
            <Button variant="outline" size="sm" className="w-full">Configure Schedule</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Knowledge Feed</h3>
          <div className="space-y-3">
            {items.map((item, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <item.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{item.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">{item.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
