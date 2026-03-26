'use client';

import * as React from 'react';
import { Card, CardContent } from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Gift, Copy, Share2 } from 'lucide-react';

export function AccountInviteAFriendContent() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="text-center space-y-3">
        <div className="size-20 rounded-full bg-primary/10 mx-auto flex items-center justify-center"><Gift className="text-primary" size={36} /></div>
        <h1 className="text-3xl font-black italic tracking-tighter uppercase">Invite a Friend</h1>
        <p className="text-sm text-muted-foreground max-w-md mx-auto">Share your referral link and earn rewards for every friend who joins.</p>
      </div>
      <Card>
        <CardContent className="pt-6 space-y-4">
          <div className="flex gap-2">
            <input className="flex-1 h-12 px-4 rounded-xl border bg-muted/5 text-sm font-mono text-transform-tertiary" defaultValue="https://zap.inc/join?ref=CSO-2026" readOnly />
            <Button variant="primary" className="h-12 px-6 font-black italic uppercase text-xs"><Copy size={14} className="mr-2" /> Copy</Button>
          </div>
          <div className="flex gap-3">
            {['Twitter', 'LinkedIn', 'Email'].map(s => (
              <Button key={s} variant="outline" className="flex-1 text-[10px] font-bold uppercase"><Share2 size={12} className="mr-1" /> {s}</Button>
            ))}
          </div>
        </CardContent>
      </Card>
      <Card className="bg-muted/10">
        <CardContent className="pt-6">
          <div className="grid grid-cols-3 text-center gap-4">
            <div><p className="text-2xl font-black italic">12</p><p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Invites Sent</p></div>
            <div><p className="text-2xl font-black italic">8</p><p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Accepted</p></div>
            <div><p className="text-2xl font-black italic">$240</p><p className="text-[10px] text-muted-foreground uppercase font-black tracking-widest">Earned</p></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
