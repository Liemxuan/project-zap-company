'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Building2, Compass, BookCopy, Users, UploadCloud } from 'lucide-react';

export function AccountCompanyProfileContent() {
  const resources = [
    {
      icon: BookCopy,
      title: 'User Guidelines',
      summary: 'Understand the importance of safety and respect in our work environment.',
    },
    {
      icon: Compass,
      title: 'Navigation Guide',
      summary: 'A detailed walkthrough to help you understand and use our digital platform.',
    }
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <div className="col-span-1 xl:col-span-2 space-y-6 lg:space-y-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-bold">General Information</CardTitle>
            <Building2 className="w-5 h-5 text-primary" />
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Company Name</p>
                <p className="text-sm font-bold">ZAP Inc.</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] uppercase font-bold text-muted-foreground">Industry</p>
                <p className="text-sm font-bold">Cybersecurity & Infrastructure</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border bg-muted/30">
              <p className="text-xs text-muted-foreground leading-relaxed">
                ZAP Inc. is leading the way in autonomous security infrastructure, providing state-of-the-art protection for global agent fleets.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
             <CardTitle className="text-lg">Company Branding</CardTitle>
             <UploadCloud className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-2xl bg-primary flex items-center justify-center text-white font-black text-2xl border-4 border-primary/20">
              Z
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold">Brand Identity</p>
              <p className="text-xs text-muted-foreground">Upload your company logo for use across the platform workspace.</p>
              <Button variant="outline" size="sm" className="mt-2">Upload Logo</Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="col-span-1 space-y-6 lg:space-y-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" />
              Organization Members
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-xs text-muted-foreground">You currently have <span className="text-foreground font-bold">12</span> active members in your organization.</p>
            <Button variant="primary" size="sm" className="w-full">Manage Members</Button>
          </CardContent>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Organization Resources</h3>
          <div className="space-y-3">
            {resources.map((res, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <res.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{res.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">{res.summary}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
