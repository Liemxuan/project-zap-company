'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Upload, ShieldX, Lock } from 'lucide-react';

export function AccountHomeSettingsPlainContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl font-bold">General Settings</CardTitle>
          <p className="text-sm text-muted-foreground">Manage your basic account configurations and identity.</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="p-8 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center text-center space-y-4 bg-muted/5 group hover:bg-muted/10 transition-colors cursor-pointer">
            <div className="p-4 rounded-full bg-primary/10 text-primary group-hover:scale-110 transition-transform">
              <Upload className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Upload Profile Assets</p>
              <p className="text-xs text-muted-foreground">Drag and drop or click to upload new profile imagery.</p>
            </div>
          </div>
          
          <div className="space-y-4 pt-4">
            <div className="flex flex-col space-y-2">
              <label className="text-[10px] uppercase font-black tracking-widest text-muted-foreground">Verification Status</label>
              <div className="flex items-center gap-2 p-3 rounded-lg border bg-green-500/5 text-green-500 border-green-500/20">
                <Lock className="w-4 h-4" />
                <span className="text-xs font-bold">Account Verified</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/20 bg-destructive/5 shrink-0">
        <CardHeader>
          <CardTitle className="text-lg text-destructive flex items-center gap-2">
            <ShieldX className="w-5 h-5" />
            Danger Zone
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-xs text-muted-foreground">
            Permanently delete your account and all associated data. This action cannot be undone.
          </p>
          <Button variant="destructive" size="sm" className="w-full font-bold uppercase text-[10px] tracking-widest">
            Delete Account
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
