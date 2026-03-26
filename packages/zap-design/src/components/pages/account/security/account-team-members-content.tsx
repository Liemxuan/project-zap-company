'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { ManagementTable } from '../../../../components/management/management-table';
import { UserPlus, Link as LinkIcon } from 'lucide-react';

export function AccountTeamMembersContent() {
  const membersData = [
    { id: '1', name: 'Zap CSO', email: 'zap@zap.inc', role: 'Administrator', status: 'Active' },
    { id: '2', name: 'Tom Zeus', email: 'tom@zap.inc', role: 'Owner', status: 'Active' },
    { id: '3', name: 'Jerry Watchdog', email: 'jerry@zap.inc', role: 'Editor', status: 'Active' },
  ];

  const columns = [
    { header: 'Member', accessorKey: 'name' },
    { header: 'Email', accessorKey: 'email' },
    { header: 'Role', accessorKey: 'role' },
    { header: 'Status', accessorKey: 'status' },
  ];

  return (
    <div className="space-y-6 lg:space-y-8">
      <ManagementTable 
        title="Team Members"
        description="Manage your organization members and their access levels."
        data={membersData}
        columns={columns}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-primary" />
              Invite People
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">Send an email invitation to join your workspace.</p>
            <div className="flex gap-2">
              <input 
                type="email" 
                placeholder="email@example.com" 
                className="flex-1 h-9 rounded-md border bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
              <Button size="sm">Send</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <LinkIcon className="w-5 h-5 text-primary" />
              Invite with Link
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">Anyone with this link can join your team workspace.</p>
            <div className="flex gap-2">
              <input 
                readOnly
                value="https://zap.inc/invite/abc-123" 
                className="flex-1 h-9 rounded-md border bg-muted/50 px-3 py-1 text-sm shadow-sm focus-visible:outline-none cursor-default"
              />
              <Button variant="outline" size="sm">Copy</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
