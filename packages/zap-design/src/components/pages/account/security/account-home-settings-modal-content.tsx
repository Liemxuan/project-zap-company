'use client';

import * as React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription
} from '../../../../genesis/molecules/dialog';
import { Button } from '../../../../genesis/atoms/interactive/button';
import { ScrollArea } from '../../../../genesis/molecules/scroll-area';
import { AccountSettingsSidebarContent } from './account-settings-sidebar-content';

interface AccountHomeSettingsModalContentProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AccountHomeSettingsModalContent({
  open,
  onOpenChange,
}: AccountHomeSettingsModalContentProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-8 py-6 border-b shrink-0 flex flex-row items-center justify-between space-y-0">
          <div className="space-y-1">
            <DialogTitle className="text-2xl font-black uppercase tracking-tighter">Account Settings</DialogTitle>
            <DialogDescription className="text-xs font-medium text-muted-foreground uppercase tracking-widest">
              Dynamic adjustment interface for security & preferences
            </DialogDescription>
          </div>
          <Button onClick={() => onOpenChange(false)} variant="outline" size="sm" className="uppercase font-bold text-[10px]">
            Close
          </Button>
        </DialogHeader>
        <ScrollArea className="flex-1 px-8 py-8">
          <AccountSettingsSidebarContent />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
