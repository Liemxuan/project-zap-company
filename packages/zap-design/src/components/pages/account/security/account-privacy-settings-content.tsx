'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { ToggleRight, Settings } from 'lucide-react';

export function AccountPrivacySettingsContent() {
  const resources = [
    {
      icon: ToggleRight,
      title: 'Fortifying Privacy Controls',
      summary: 'Enhance your privacy framework with customizable settings and expert guidelines.',
      path: '#'
    },
    {
      icon: Settings,
      title: 'Navigating Privacy Preferences',
      summary: 'Take command of your privacy settings with our secure configuration tools.',
      path: '#'
    }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <div className="col-span-1 xl:col-span-2 space-y-6 lg:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-bold">Privacy Controls</CardTitle>
            <p className="text-sm text-muted-foreground">Manage how your data is shared and who can see your profile information.</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Public Search Indexing</p>
                  <p className="text-xs text-muted-foreground">Allow search engines to index your public profile.</p>
                </div>
                <Button variant="outline" size="sm">Enabled</Button>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
                <div className="space-y-0.5">
                  <p className="text-sm font-bold">Data Sharing with Partners</p>
                  <p className="text-xs text-muted-foreground">Share anonymized usage data to improve partner services.</p>
                </div>
                <Button variant="outline" size="sm">Disabled</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Report Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">Configure the frequency of automated privacy reports sent to your email.</p>
              <Button variant="outline" size="sm" className="w-full">Configure Reports</Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Manage Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-xs text-muted-foreground mb-4">Export your account data or request permanent deletion of your information.</p>
              <Button variant="outline" size="sm" className="w-full text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">Export/Delete Data</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="col-span-1 space-y-6 lg:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Block List</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground mb-4">Users on the block list are unable to send chat requests or messages to you.</p>
            <Button variant="outline" size="sm" className="w-full uppercase tracking-wider font-bold text-[10px]">Manage Block List</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Privacy Resources</h3>
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
