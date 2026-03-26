'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Switch } from '../../../../genesis/atoms/interactive/switch';
import { Label } from '../../../../genesis/atoms/interactive/label';
import { Copy, SquarePen } from 'lucide-react';

export function AccountUserBasicSettingsContent() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Basic Settings</CardTitle>
        <Button variant="ghost" size="sm" mode="icon">
          <SquarePen className="w-4 h-4 text-primary" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Public Profile</Label>
              <p className="text-xs text-muted-foreground">Make your profile visible to external search engines.</p>
            </div>
            <Switch defaultChecked />
          </div>
          
          <div className="flex items-center justify-between p-4 rounded-xl border bg-muted/30">
            <div className="space-y-0.5">
              <Label className="text-sm font-bold">Referral Program</Label>
              <p className="text-xs text-muted-foreground">Share your unique link and earn platform credits.</p>
              <div className="flex items-center gap-2 mt-2">
                 <code className="text-[10px] bg-muted px-2 py-0.5 rounded border">zap.inc/ref/zap_cso</code>
                 <Button variant="ghost" size="sm" mode="icon">
                    <Copy className="w-3 h-3" />
                 </Button>
              </div>
            </div>
            <Button variant="outline" size="sm">Re-generate</Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
