'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Calendar, Trash2, Plus } from 'lucide-react';

export function AccountUserCalendarContent() {
  const accounts = [
    { name: 'Google Calendar', email: 'zap@zap.inc', color: 'text-blue-500' },
    { name: 'Monday.com', email: 'cso@zap.inc', color: 'text-rose-500' },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="space-y-1">
          <CardTitle className="text-lg">Calendar Integrations</CardTitle>
          <p className="text-xs text-muted-foreground">Connected accounts: {accounts.length}/5</p>
        </div>
        <Button variant="outline" size="sm">
          <Plus className="w-3 h-3 mr-1" /> Add New
        </Button>
      </CardHeader>
      <CardContent className="grid gap-3">
        {accounts.map((account, idx) => (
          <div key={idx} className="flex items-center justify-between p-3 rounded-xl border bg-muted/5">
            <div className="flex items-center gap-3">
               <div className="p-2 rounded-lg bg-layer-dialog border shadow-sm">
                  <Calendar className={account.color} size={18} />
               </div>
               <div className="flex flex-col">
                  <span className="text-sm font-bold">{account.name}</span>
                  <span className="text-[10px] text-muted-foreground">{account.email}</span>
               </div>
            </div>
            <Button variant="ghost" size="sm" mode="icon" className="text-muted-foreground hover:text-destructive transition-colors">
               <Trash2 size={14} />
            </Button>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
