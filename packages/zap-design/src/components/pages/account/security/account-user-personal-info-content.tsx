'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { User, Mail, Phone, MapPin, Globe, SquarePen } from 'lucide-react';

export function AccountUserPersonalInfoContent() {
  const details = [
    { label: 'Full Name', value: 'Zap CSO', icon: User },
    { label: 'Email', value: 'zap@zap.inc', icon: Mail },
    { label: 'Phone', value: '+1 (555) 000-0000', icon: Phone },
    { label: 'Location', value: 'Global / Remote', icon: MapPin },
    { label: 'Website', value: 'https://zap.inc', icon: Globe },
  ];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-lg">Personal Information</CardTitle>
        <Button variant="ghost" size="sm" mode="icon">
          <SquarePen className="w-4 h-4 text-primary" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {details.map((detail, idx) => (
            <div key={idx} className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-muted/50">
                <detail.icon className="w-4 h-4 text-muted-foreground" />
              </div>
              <div className="space-y-0.5">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">{detail.label}</p>
                <p className="text-sm font-medium">{detail.value}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
