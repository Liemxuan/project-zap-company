'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent 
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { ShieldCheck, ShieldOff, ShieldQuestion, ArrowRight } from 'lucide-react';


export function AccountOverviewContent() {
  const securityTips = [
    {
      icon: ShieldOff,
      title: 'Enhancing Security Knowledge',
      summary: 'Explore comprehensive resources to strengthen security understanding through detailed guides.',
      status: 'review'
    },
    {
      icon: ShieldCheck,
      title: 'Mastering Security Protocols',
      summary: 'Delve into the realm of security with specialized learning materials and expert guidance.',
      status: 'verified'
    },
    {
      icon: ShieldQuestion,
      title: 'Navigating Digital Security',
      summary: 'Embark on a journey of digital security enlightenment with our educational guides.',
      status: 'pending'
    },
  ];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
      <div className="col-span-1 xl:col-span-2 space-y-6 lg:space-y-8">
        {/* Security Hero / FeaturesHighlight Equivalent */}
        <Card className="overflow-hidden border-none bg-gradient-to-br from-primary/10 via-primary/5 to-transparent shadow-md">
          <CardContent className="p-8 lg:p-10">
            <div className="flex flex-col lg:flex-row gap-8 items-center text-center lg:text-left">
              <div className="flex-1 space-y-4">
                <h1 className="text-2xl lg:text-3xl font-bold tracking-tight">
                  Essential Personal Security Tips for Enhanced Safety
                </h1>
                <p className="text-muted-foreground text-balanced">
                  Transform your security posture with our tailored guidance and industry-standard best practices.
                </p>
                <div className="flex flex-wrap gap-3 pt-2 justify-center lg:justify-start">
                  <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary border border-primary/30">
                    Strong Passwords
                  </span>
                  <span className="inline-flex items-center rounded-full bg-primary/20 px-3 py-1 text-xs font-medium text-primary border border-primary/30">
                    Two-Factor Auth
                  </span>
                </div>
                <div className="pt-4">
                  <Button variant="primary" size="lg" className="gap-2">
                    Review Security Tips <ArrowRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
              <div className="shrink-0 w-48 h-48 lg:w-64 lg:h-64 bg-primary/5 rounded-full flex items-center justify-center border border-primary/10">
                <ShieldCheck className="w-24 h-24 text-primary animate-pulse" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Placeholder Sections for General, Auth, Quick Settings */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Manage your core account security preferences and baseline configurations.</p>
              <Button variant="outline" size="sm" className="w-full">Configure</Button>
            </CardContent>
          </Card>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader>
              <CardTitle className="text-lg">Authentication Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Setup 2FA, hardware keys, and manage password rotation policies.</p>
              <Button variant="outline" size="sm" className="w-full">Manage Auth</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="col-span-1 space-y-6 lg:space-y-8">
        {/* Device Stats / ProductInsight Equivalent */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Session Insights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
              <div className="space-y-1">
                <p className="text-sm font-semibold">iOS Devices</p>
                <p className="text-xs text-muted-foreground">24 Active Sessions</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">24</span>
              </div>
            </div>
            <div className="flex items-center justify-between p-4 rounded-xl bg-muted/30 border">
              <div className="space-y-1">
                <p className="text-sm font-semibold">Android Devices</p>
                <p className="text-xs text-muted-foreground">35 Active Sessions</p>
              </div>
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="text-primary font-bold">35</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Tips Feed / HighlightedPosts Equivalent */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground px-1">Security Knowledge Base</h3>
          <div className="space-y-3">
            {securityTips.map((tip, idx) => (
              <Card key={idx} className="group hover:border-primary/50 transition-colors cursor-pointer active:scale-[0.98]">
                <CardContent className="p-4 flex gap-4 items-start">
                  <div className="p-2 rounded-lg bg-muted group-hover:bg-primary/10 transition-colors">
                    <tip.icon className="w-5 h-5 text-muted-foreground group-hover:text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm font-semibold leading-none group-hover:text-primary transition-colors">{tip.title}</h4>
                    <p className="text-xs text-muted-foreground leading-snug">{tip.summary}</p>
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
