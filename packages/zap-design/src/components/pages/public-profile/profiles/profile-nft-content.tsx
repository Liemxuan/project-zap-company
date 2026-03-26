'use client';

import * as React from 'react';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  CardFooter
} from '../../../../genesis/molecules/card';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { Badge } from '../../../../genesis/atoms/interactive/badge';
import { 
  Box, 
  Coins, 
  Palette, 
  Image as  
   
  Heart, 
  
  Wallet,
  ArrowUpRight,
  ExternalLink
} from 'lucide-react';

export function ProfileNFTContent() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-1 space-y-6">
        <Card className="bg-zinc-950 text-white border-zinc-800">
          <CardHeader>
            <CardTitle className="text-sm font-black uppercase tracking-widest text-zinc-500">Inventory Assets</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
             {[
               { name: 'Ethereum Mainnet', bal: '14.28 ETH', icon: Coins },
               { name: 'Polygon', bal: '1,200 MATIC', icon: Coins }
             ].map((asset, idx) => (
               <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
                  <div className="flex items-center gap-3">
                     <div className="p-2 rounded bg-white/5 text-primary"><asset.icon size={16}/></div>
                     <span className="text-xs font-bold">{asset.name}</span>
                  </div>
                  <span className="text-[10px] font-black font-mono text-transform-tertiary">{asset.bal}</span>
               </div>
             ))}
             <Button variant="ghost" className="w-full text-white/50 hover:text-white border-white/10 italic text-[10px] uppercase font-black py-2 h-auto" mode="link">
                <Wallet className="w-3 h-3 mr-2" /> Connect New Wallet
             </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle className="text-lg">Network Activity</CardTitle></CardHeader>
          <CardContent className="flex flex-col gap-3">
             {[1,2,3].map(i => (
               <div key={i} className="flex items-center gap-3 p-2 rounded-lg border bg-muted/5 group cursor-pointer hover:border-primary/50 transition-all">
                  <div className="size-8 rounded bg-muted flex items-center justify-center"><ArrowUpRight size={14} className="text-muted-foreground group-hover:text-primary"/></div>
                  <div className="flex flex-col leading-tight">
                     <span className="text-[10px] font-black uppercase">Mint Event #{i}04</span>
                     <span className="text-[8px] text-muted-foreground uppercase opacity-60">Success • 2m ago</span>
                  </div>
               </div>
             ))}
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Tokens Created */}
           <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                 <CardTitle className="text-lg flex items-center gap-2"><Palette className="w-4 h-4 text-primary"/> Tokens Created</CardTitle>
                 <Badge variant="primary" className="text-[9px] font-black">240</Badge>
              </CardHeader>
              <CardContent className="grid grid-cols-3 gap-2">
                 {[1,2,3,4,5,6].map(i => (
                    <div key={i} className="aspect-square rounded-lg bg-muted/20 border-border/50 border overflow-hidden relative group">
                       <div className="absolute inset-0 bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <ExternalLink size={14} className="text-primary" />
                       </div>
                    </div>
                 ))}
              </CardContent>
           </Card>

           {/* 3D ART Section */}
           <Card className="bg-primary/5 border-primary/20">
              <CardHeader>
                 <CardTitle className="text-lg italic uppercase font-black italic tracking-tighter">Spatial Objects</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                 <div className="h-40 rounded-2xl bg-muted/40 border border-dashed border-primary/20 flex flex-col items-center justify-center gap-2 text-muted-foreground">
                    <Box className="opacity-20" size={32} />
                    <span className="text-[10px] font-black uppercase tracking-widest">3D Model Preview Engine</span>
                 </div>
                 <Button variant="ghost" className="w-full text-xs font-bold uppercase hover:bg-primary/10 transition-all">Launch Viewer</Button>
              </CardContent>
           </Card>
        </div>

        {/* Collection Grid */}
        <div className="space-y-4">
           <div className="flex items-center justify-between">
              <h2 className="text-sm uppercase font-black tracking-widest text-muted-foreground">Collected Tokens</h2>
              <Button mode="link" underlined="dashed" size="sm">Expand Vault</Button>
           </div>
           <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1,2,3,4].map(idx => (
                 <div key={idx} className="p-2 rounded-2xl border bg-layer-dialog group shadow-sm hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer">
                    <div className="aspect-square rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-3 overflow-hidden relative">
                       <div className="absolute top-2 right-2"><Heart size={14} className="text-white/20 hover:text-rose-500 transition-colors drop-shadow-md"/></div>
                    </div>
                    <div className="px-1 space-y-0.5 pb-1">
                       <h3 className="text-[10px] font-bold truncate">Genesis Void #{idx}04</h3>
                       <p className="text-[9px] text-primary font-black italic uppercase">0.45 ETH</p>
                    </div>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
