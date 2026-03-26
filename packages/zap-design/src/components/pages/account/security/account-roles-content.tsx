'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Shield, ShieldCheck, ShieldAlert, Users, Settings } from 'lucide-react';

export function AccountRolesContent() {
  const roles = [
    { 
      title: 'Administrator', 
      desc: 'Full access to all settings, billing, and member management.', 
      count: 2,
      icon: ShieldCheck,
      color: 'text-blue-500'
    },
    { 
      title: 'Manager', 
      desc: 'Can manage members and team settings but cannot access billing.', 
      count: 4,
      icon: Shield,
      color: 'text-purple-500'
    },
    { 
      title: 'Editor', 
      desc: 'Can create and edit content but cannot manage access levels.', 
      count: 12,
      icon: Settings,
      color: 'text-green-500'
    },
    { 
      title: 'Viewer', 
      desc: 'Read-only access to the workspace and reports.', 
      count: 25,
      icon: Users,
      color: 'text-muted-foreground'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {roles.map((role, idx) => (
        <Card key={idx} className="group hover:border-primary/50 transition-all cursor-pointer active:scale-[0.98]">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">{role.title}</CardTitle>
            <role.icon className={role.color} size={18} />
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground leading-relaxed">{role.desc}</p>
            </div>
            <div className="flex items-center justify-between pt-2">
              <span className="text-[10px] font-black uppercase text-primary bg-primary/5 px-2 py-1 rounded">{role.count} Members</span>
              <Button variant="ghost" size="sm" className="h-7 px-2 font-bold uppercase text-[10px]">Edit Role</Button>
            </div>
          </CardContent>
        </Card>
      ))}
      
      <Card className="border-dashed flex flex-col items-center justify-center p-6 text-center space-y-2 group hover:border-primary transition-colors cursor-pointer active:scale-[0.98]">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
          <ShieldAlert className="text-muted-foreground group-hover:text-primary" size={20} />
        </div>
        <div className="space-y-1">
          <p className="text-sm font-bold">New Custom Role</p>
          <p className="text-[10px] text-muted-foreground uppercase font-black">Create a role with granular permissions</p>
        </div>
      </Card>
    </div>
  );
}
