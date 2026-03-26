'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Book, Database, CloudUpload, History } from 'lucide-react';

export function AccountBackupAndRecoveryContent() {
  const resources = [
    {
      icon: Book,
      title: 'Securing Data Integrity',
      summary: 'Safeguard your data with our resilient backup recovery solutions and expert strategies.',
      path: '#'
    },
    {
      icon: Database,
      title: 'Restoration Assurance',
      summary: 'Prepare for the unexpected with proactive backup plans and establish a reliable recovery protocol.',
      path: '#'
    }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <div className="col-span-1 xl:col-span-2 space-y-6 lg:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Backup Settings</CardTitle>
            <p className="text-sm text-muted-foreground">Configure your automated backup frequency and storage destination.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                <div className="flex items-center gap-3">
                  <CloudUpload className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold">Cloud Storage</span>
                </div>
                <p className="text-xs text-muted-foreground">Backup to encrypted ZAP Cloud storage (Recommended).</p>
                <Button variant="outline" size="sm" className="w-full">Configure</Button>
              </div>
              <div className="p-4 rounded-xl border bg-muted/30 space-y-3">
                <div className="flex items-center gap-3">
                  <History className="w-5 h-5 text-primary" />
                  <span className="text-sm font-bold">Auto-Backup</span>
                </div>
                <p className="text-xs text-muted-foreground">Every 24 hours at 3:00 AM UTC.</p>
                <Button variant="outline" size="sm" className="w-full">Change Schedule</Button>
              </div>
            </div>
            <div className="pt-4 border-t flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-bold">Last backup</p>
                <p className="text-xs text-muted-foreground">Today at 3:05 AM UTC (Size: 256MB)</p>
              </div>
              <Button variant="primary" size="sm">Backup Now</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bold">Recovery FAQ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm font-semibold">How do I restore my account from a backup?</p>
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              <p className="text-sm text-muted-foreground">You can restore your account by navigating to the "Recovery" tab during the onboarding process or by contacting support if you are locked out.</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 space-y-6 lg:space-y-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg">Recovery Protocol</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">Ensure your recovery phase is stored in a safe place. Loss of this phase may result in permanent data loss.</p>
            <Button variant="outline" className="w-full text-xs font-bold uppercase tracking-wider">Download Recovery Kit</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Resources</h3>
          <div className="space-y-3">
            {resources.map((res, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <res.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{res.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">{res.summary}</p>
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
