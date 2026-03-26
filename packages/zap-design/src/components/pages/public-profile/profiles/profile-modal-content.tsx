'use client';

import * as React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  DialogFooter
} from '../../../../genesis/molecules/dialog';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { ProfileDefaultContent } from './profile-default-content';
import { Maximize2, X } from 'lucide-react';

interface ProfileModalContentProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function ProfileModalContent({ open = true, onOpenChange }: ProfileModalContentProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-7xl h-[90vh] overflow-y-auto bg-muted/5 backdrop-blur-xl border-zinc-200 dark:border-zinc-800 p-0 shadow-2xl">
        <DialogHeader className="p-8 pb-0 flex flex-row items-center justify-between sticky top-0 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md z-50 border-b border-border/30">
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black italic tracking-tighter uppercase italic">Profile Intelligence</DialogTitle>
            <DialogDescription className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Real-time Entity Overview</DialogDescription>
          </div>
          <div className="flex gap-2 mb-4">
             <Button variant="outline" size="sm" mode="icon"><Maximize2 size={14}/></Button>
             <Button variant="ghost" size="sm" mode="icon" onClick={() => onOpenChange?.(false)}><X size={16}/></Button>
          </div>
        </DialogHeader>
        <div className="p-8">
           <ProfileDefaultContent />
        </div>
      </DialogContent>
    </Dialog>
  );
}
