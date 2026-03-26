'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { ManagementTable } from '../../../../components/management/management-table';
import { History, Info } from 'lucide-react';
import { Button } from '../../../../genesis/atoms/interactive/button';

export function AccountCurrentSessionsContent() {
  const sessions = [
    {
      id: "SESS-001",
      location: "San Francisco, US",
      status: "Active Now",
      device: "MacBook Pro - Chrome",
      ip: "192.168.1.1",
      lastActive: "Just now"
    },
    {
      id: "SESS-002",
      location: "London, UK",
      status: "Expired",
      device: "iPhone 15 - App",
      ip: "10.0.0.42",
      lastActive: "2 days ago"
    },
    {
      id: "SESS-003",
      location: "Tokyo, JP",
      status: "Active",
      device: "iPad Air - Safari",
      ip: "172.16.0.5",
      lastActive: "5 hours ago"
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Current Sessions</CardTitle>
            <p className="text-sm text-muted-foreground">Manage your active sessions across all devices and locations.</p>
          </div>
          <History className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent className="pt-6">
          <ManagementTable 
            data={sessions}
            columns={[
              { header: "Location", accessorKey: "location" },
              { header: "Device", accessorKey: "device" },
              { header: "IP Address", accessorKey: "ip" },
              { header: "Last Active", accessorKey: "lastActive" },
              { header: "Status", accessorKey: "status" }
            ]}
          />
          <div className="mt-6 flex justify-end">
            <Button variant="destructive" size="sm">Sign out from all other sessions</Button>
          </div>
        </CardContent>
      </Card>

      <div className="bg-muted/30 border rounded-2xl p-6 flex gap-4 items-start">
        <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
        <div className="space-y-2">
          <h4 className="text-sm font-bold">Session Security Tips</h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {/* eslint-disable-next-line react/no-unescaped-entities */}
            If you see a session you don't recognize, sign out immediately and change your password. We recommend signing out of unused sessions regularly to keep your account secure.
          </p>
        </div>
      </div>
    </div>
  );
}
