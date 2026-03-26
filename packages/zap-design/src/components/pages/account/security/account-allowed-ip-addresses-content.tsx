'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { ManagementTable } from '../../../../components/management/management-table';
import { ShieldAlert, Plus, Info } from 'lucide-react';
import { Button } from '../../../../genesis/atoms/interactive/button';

export function AccountAllowedIPAddressesContent() {
  const ipAddresses = [
    {
      id: "IP-001",
      address: "192.168.1.1",
      label: "Main Office (SF)",
      lastUsed: "Just now",
      addedBy: "Zap Admin",
      status: "Verified"
    },
    {
      id: "IP-002",
      address: "10.0.0.42",
      label: "Home Office",
      lastUsed: "2 hours ago",
      addedBy: "Zap Admin",
      status: "Verified"
    }
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="space-y-1">
            <CardTitle className="text-xl font-bold">Allowed IP Addresses</CardTitle>
            <p className="text-sm text-muted-foreground">Restrict account access to specific IP addresses for enhanced security.</p>
          </div>
          <ShieldAlert className="w-5 h-5 text-primary" />
        </CardHeader>
        <CardContent className="pt-6">
          <div className="mb-6 flex justify-between items-center bg-primary/5 p-4 rounded-xl border border-primary/10">
            <div className="text-xs font-medium text-muted-foreground">
              Current Session IP: <span className="text-foreground font-bold">192.168.1.1</span>
            </div>
            <Button size="sm" className="gap-2">
              <Plus className="w-4 h-4" /> Add Allowed IP
            </Button>
          </div>
          <ManagementTable 
            data={ipAddresses}
            columns={[
              { header: "IP Address", accessorKey: "address" },
              { header: "Label", accessorKey: "label" },
              { header: "Added By", accessorKey: "addedBy" },
              { header: "Last Used", accessorKey: "lastUsed" },
              { header: "Status", accessorKey: "status" }
            ]}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-muted/30 border rounded-2xl p-6 flex gap-4 items-start">
          <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-1" />
          <div className="space-y-2">
            <h4 className="text-sm font-bold">IP Whitelisting FAQ</h4>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Whitelisting restricts access exclusively to those IPs. If you try to log in from a different IP, you will be blocked unless you have secondary recovery overrides configured.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
