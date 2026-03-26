'use client';

import * as React from 'react';
import { cn } from '../../../../lib/utils';
import { 
  User, 
  Mail, 
  Lock, 
  Share2, 
  ShieldCheck, 
  Settings2, 
  Palette, 
  Bell, 
  MapPin, 
  Key, 
  Unlink, 
  Trash2 
} from 'lucide-react';

export function AccountSettingsSidebarContent() {
  const sections = [
    { title: "Basic Settings", id: "basic", icon: User },
    { title: "Email Address", id: "email", icon: Mail },
    { title: "Password", id: "password", icon: Lock },
    { title: "Social Sign-In", id: "social", icon: Share2 },
    { title: "SSO Config", id: "sso", icon: Key },
    { title: "Two-Factor Auth", id: "2fa", icon: ShieldCheck },
    { title: "Preferences", id: "prefs", icon: Settings2 },
    { title: "Appearance", id: "appearance", icon: Palette },
    { title: "Notifications", id: "notifications", icon: Bell },
    { title: "Address", id: "address", icon: MapPin },
    { title: "Integrations", id: "integrations", icon: Unlink },
    { title: "Danger Zone", id: "danger", icon: Trash2, destructive: true },
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      {/* Scrollspy Sidebar Placeholder */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 space-y-1">
          {sections.map((section) => (
            <button
              key={section.id}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors text-left",
                section.destructive ? "text-destructive hover:bg-destructive/10" : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              <section.icon className="w-4 h-4" />
              {section.title}
            </button>
          ))}
        </div>
      </aside>

      {/* Content Area */}
      <div className="flex-1 space-y-12">
        {sections.map((section) => (
          <div key={section.id} id={section.id} className="scroll-mt-24 space-y-4">
            <h2 className={cn(
              "text-2xl font-bold tracking-tight pb-2 border-b",
              section.destructive ? "text-destructive border-destructive/20" : "border-muted"
            )}>
              {section.title}
            </h2>
            <div className="min-h-[200px] border-2 border-dashed border-muted/50 rounded-2xl flex items-center justify-center bg-muted/5">
               <p className="text-sm text-muted-foreground">Standardized Form / Detail Section for {section.title}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
