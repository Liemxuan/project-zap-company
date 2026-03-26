'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { ManagementTable } from '../../../../components/management/management-table';
import { Info } from 'lucide-react';

export function AccountSecurityLogContent() {
  const securityLogs = [
    {
      id: "LOG-001",
      event: "Password Change",
      location: "San Francisco, US",
      device: "MacBook Pro",
      ip: "192.168.1.1",
      date: "2024-03-11 08:30 AM",
      status: "Successful"
    },
    {
      id: "LOG-002",
      event: "Login Attempt",
      location: "London, UK",
      device: "iPhone 15",
      ip: "10.0.0.42",
      date: "2024-03-11 09:15 AM",
      status: "Failed"
    },
    {
      id: "LOG-003",
      event: "Two-Factor Enabled",
      location: "Tokyo, JP",
      device: "Chrome on Windows",
      ip: "172.16.0.5",
      date: "2024-03-11 10:00 AM",
      status: "Successful"
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xl font-bold">Security Activity Log</CardTitle>
          <Info className="w-4 h-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-6">
            Review the latest security events related to your account access and configuration changes.
          </p>
          <ManagementTable 
            data={securityLogs}
            columns={[
              { header: "Event", accessorKey: "event" },
              { header: "Location", accessorKey: "location" },
              { header: "Device", accessorKey: "device" },
              { header: "IP Address", accessorKey: "ip" },
              { header: "Date", accessorKey: "date" },
              { header: "Status", accessorKey: "status" }
            ]}
          />
        </CardContent>
      </Card>
      
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-6 flex gap-4 items-start">
        <div className="p-2 rounded-full bg-primary/10 text-primary">
          <Info className="w-5 h-5" />
        </div>
        <div className="space-y-1">
          <h4 className="text-sm font-bold">Need help with security?</h4>
          <p className="text-sm text-muted-foreground">
            If you notice any suspicious activity, please contact our security team immediately at 
            <span className="text-primary font-medium ml-1">security@zap.inc</span>
          </p>
        </div>
      </div>
    </div>
  );
}
