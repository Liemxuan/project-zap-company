'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import {   Briefcase, Link as LinkIcon, Upload } from 'lucide-react';

export function AccountUserProfileContent() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
      <div className="space-y-6 lg:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">First Name</p>
                <p className="text-sm font-medium">Zap</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Last Name</p>
                <p className="text-sm font-medium">CSO</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Email</p>
                <p className="text-sm font-medium">zap@zap.inc</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Phone</p>
                <p className="text-sm font-medium">+1 (555) 000-0000</p>
              </div>
            </div>
            <Button variant="outline" size="sm" className="w-full">Edit Profile</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Work & Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4 p-3 rounded-xl bg-muted/30">
              <Briefcase className="w-5 h-5 text-primary" />
              <div className="flex-1">
                <p className="text-sm font-bold">Chief Security Officer</p>
                <p className="text-xs text-muted-foreground">ZAP Inc. • 2024 - Present</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6 lg:space-y-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Connected Accounts</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
             <div className="flex items-center justify-between p-3 rounded-xl border">
               <div className="flex items-center gap-3">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">Google Workspace</span>
               </div>
               <span className="text-[10px] font-bold text-green-500 uppercase">Connected</span>
             </div>
             <div className="flex items-center justify-between p-3 rounded-xl border">
               <div className="flex items-center gap-3">
                <LinkIcon className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium">GitHub Enterprise</span>
               </div>
               <span className="text-[10px] font-bold text-muted-foreground uppercase">Not Linked</span>
             </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">Recent Documents</CardTitle>
            <Upload className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3 p-2 hover:bg-muted/30 rounded-lg cursor-pointer transition-colors">
                <div className="w-8 h-8 rounded bg-primary/5 flex items-center justify-center">
                  <span className="text-[10px] font-bold text-primary">PDF</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">Security_Protocol_v{i}.pdf</p>
                  <p className="text-[10px] text-muted-foreground">Modified 2 days ago</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
