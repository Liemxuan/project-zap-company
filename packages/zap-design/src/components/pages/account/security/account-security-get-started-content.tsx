'use client';

import * as React from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { 
  LayoutDashboard, 
  MapPin, 
  Settings, 
  MonitorSmartphone, 
  CloudCog, 
  KeySquare, 
  ShieldOff,
  ChevronRight
} from 'lucide-react';


export function AccountSecurityGetStartedContent() {
  const items = [
    {
      icon: LayoutDashboard,
      title: 'Overview',
      desc: 'A Broad Perspective on Our Comprehensive Security Features.',
      path: '/account/security/overview',
    },
    {
      icon: MapPin,
      title: 'Allowed IP Addresses',
      desc: 'Restrict Access Through Authorized IP Address Filtering.',
      path: '/account/security/allowed-ip-addresses',
    },
    {
      icon: Settings,
      title: 'Privacy Settings',
      desc: 'Customize Your Privacy with User-Controlled Settings.',
      path: '/account/security/privacy-settings',
    },
    {
      icon: MonitorSmartphone,
      title: 'Trusted Devices',
      desc: 'Identify and Authorize Devices for Enhanced Security.',
      path: '/account/security/device-management',
    },
    {
      icon: CloudCog,
      title: 'Backup & Recovery',
      desc: 'Secure Backup Solutions with Reliable Recovery Options.',
      path: '/account/security/backup-and-recovery',
    },
    {
      icon: KeySquare,
      title: 'Login Sessions',
      desc: 'Track and Manage Active User Sessions.',
      path: '/account/security/current-sessions',
    },
    {
      icon: ShieldOff,
      title: 'Security Log',
      desc: 'Detailed Records of Security Events and Activities.',
      path: '/account/security/security-log',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {items.map((item, idx) => (
        <Link key={idx} href={item.path} className="group">
          <Card className="h-full hover:border-primary/50 transition-all hover:shadow-md cursor-pointer active:scale-[0.98]">
            <CardContent className="p-6 flex flex-col items-center text-center space-y-4">
              <div className="p-4 rounded-2xl bg-primary/5 group-hover:bg-primary/10 transition-colors text-primary">
                <item.icon className="w-8 h-8" />
              </div>
              <div className="space-y-2">
                <h3 className="font-bold group-hover:text-primary transition-colors">{item.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
              </div>
              <div className="pt-2 text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                <ChevronRight className="w-5 h-5 mx-auto" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
