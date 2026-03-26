'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';

import { Smartphone, Monitor, Tablet, ShieldCheck, HelpCircle } from 'lucide-react';

export function AccountDeviceManagementContent() {
  const trustedDevices = [
    {
      id: "DEV-001",
      name: "Zap's MacBook Pro",
      type: "mac",
      lastActive: "Active Now",
      location: "San Francisco, US",
      browser: "Chrome 122",
      icon: Monitor
    },
    {
      id: "DEV-002",
      name: "iPhone 15 Pro",
      type: "mobile",
      lastActive: "2 hours ago",
      location: "San Francisco, US",
      browser: "Safari iOS",
      icon: Smartphone
    },
    {
      id: "DEV-003",
      name: "iPad Air",
      type: "tablet",
      lastActive: "Yesterday",
      location: "San Francisco, US",
      browser: "Safari iOS",
      icon: Tablet
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Trusted Devices</CardTitle>
            <p className="text-sm text-muted-foreground">Manage the devices that are currently authorized to access your ZAP account.</p>
          </div>
          <ShieldCheck className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trustedDevices.map((device) => (
              <Card key={device.id} className="relative group overflow-hidden hover:border-primary/50 transition-colors">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 rounded-xl bg-muted group-hover:bg-primary/10 transition-colors">
                      <device.icon className="w-6 h-6 text-muted-foreground group-hover:text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate group-hover:text-primary transition-colors">{device.name}</h4>
                      <p className="text-xs text-muted-foreground">{device.location}</p>
                    </div>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div className="flex justify-between">
                      <span>Browser:</span>
                      <span className="font-medium text-foreground">{device.browser}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Last Active:</span>
                      <span className="font-medium text-foreground">{device.lastActive}</span>
                    </div>
                  </div>
                  <div className="pt-2 flex gap-2">
                    <button className="text-[10px] uppercase tracking-wider font-bold text-destructive hover:underline">Revoke Access</button>
                    <button className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground hover:text-primary transition-colors ml-auto">Details</button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-muted/30 border rounded-2xl p-6 flex gap-4 items-start">
          <HelpCircle className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="text-sm font-bold">About Trusted Devices</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Trusted devices can bypass two-factor authentication for 30 days. You can revoke this trust at any time by selecting "Revoke Access" on individual devices.
            </p>
          </div>
        </div>
        <div className="bg-muted/30 border rounded-2xl p-6 flex gap-4 items-start">
          <ShieldCheck className="w-5 h-5 text-primary shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="text-sm font-bold">Enable Auto-Revoke</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {/* eslint-disable-next-line react/no-unescaped-entities */}
              Automatically revoke access for devices that haven't been active for more than 90 days. Recommended for high-security environments.
            </p>
            <button className="text-xs font-bold text-primary hover:underline">Configure Auto-Revoke</button>
          </div>
        </div>
      </div>
    </div>
  );
}
