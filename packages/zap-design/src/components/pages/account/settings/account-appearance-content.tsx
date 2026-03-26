'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../../../../genesis/molecules/card';

import { Sun, Moon, Monitor, Palette, Check } from 'lucide-react';

export function AccountAppearanceContent() {
  const themes = [
    { name: 'Light', icon: Sun, active: false },
    { name: 'Dark', icon: Moon, active: true },
    { name: 'System', icon: Monitor, active: false },
  ];
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-black italic tracking-tighter uppercase">Appearance</h1>
      <Card>
        <CardHeader><CardTitle className="text-lg flex items-center gap-2"><Palette size={18} /> Theme</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {themes.map((t) => (
              <div key={t.name} className={`relative flex flex-col items-center gap-3 p-8 rounded-2xl border-2 cursor-pointer transition-all ${t.active ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/30'}`}>
                {t.active && <div className="absolute top-3 right-3"><Check size={16} className="text-primary" /></div>}
                <t.icon size={28} className={t.active ? 'text-primary' : 'text-muted-foreground'} />
                <span className="text-sm font-bold">{t.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader><CardTitle className="text-lg">Accent Color</CardTitle></CardHeader>
        <CardContent>
          <div className="flex gap-4">
            {['#6366f1', '#ec4899', '#14b8a6', '#f97316', '#8b5cf6', '#06b6d4'].map((c, i) => (
              <button key={c} className={`size-10 rounded-full shadow-md transition-all hover:scale-110 ${i === 0 ? 'ring-2 ring-offset-2 ring-primary' : ''}`} style={{ backgroundColor: c }} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
