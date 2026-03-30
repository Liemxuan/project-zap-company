'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  Check,
  ChevronDown,
} from "lucide-react";
import { Button } from '../atoms/interactive/button';
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '../atoms/interactive/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './popover';
import { Wrapper } from '../../components/dev/Wrapper';
import { getDomains, DOMAIN_META, getWorkspacesByDomain, getWorkspaceUrl } from '../../config/workspace-registry';
import { useWorkspaceStore } from '../../store/workspace-store';
import { Icon } from '../atoms/icons/Icon';

export interface QuickNavigateProps {
    className?: string;
}

export function QuickNavigate({ className }: QuickNavigateProps) {
    const [open, setOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    
    // Global Context Switcher State
    const { activeWorkspaceId, setActiveWorkspace, getActiveWorkspace } = useWorkspaceStore();
    React.useEffect(() => setMounted(true), []);

    const selectedItem = getActiveWorkspace();
    const domains = getDomains();

    return (
        <Wrapper identity={{ displayName: "Quick Navigate", type: "Molecule", filePath: "genesis/molecules/quick-navigate.tsx" }}>
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  role="combobox"
                  aria-expanded={open}
                  className={cn(
                    "flex w-fit items-center justify-between gap-1.5 transition-[color,box-shadow]",
                    "rounded-[length:var(--select-border-radius,var(--radius-shape-small,8px))]",
                    "border border-[length:var(--select-border-width,var(--layer-border-width,1px))] border-outline-variant",
                    "bg-[color:var(--select-bg,var(--color-surface-container-highest))]",
                    "text-sm font-body text-transform-secondary text-on-surface h-[var(--select-height,32px)] py-2 pr-2 pl-2.5 outline-none focus-visible:border-[color:var(--input-focus-border,var(--m3-sys-light-primary))] focus-visible:ring-[color:var(--input-focus-ring,var(--color-primary-fixed-dim))] focus-visible:ring-[length:var(--input-focus-width,2px)]",
                    className
                  )}
                >
                  <div className="flex items-center gap-1.5 pr-3 min-w-[140px]">
                    {mounted && selectedItem ? (
                      <>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Icon name={selectedItem.icon as any} size={15} className="text-on-surface-variant/80 shrink-0 pointer-events-none" />
                        <span className="flex items-center gap-1.5 line-clamp-1 truncate">{selectedItem.name}</span>
                      </>
                    ) : (
                      <span className="text-muted-foreground flex items-center gap-1.5 line-clamp-1 truncate">Select Workspace...</span>
                    )}
                  </div>
                  <ChevronDown className="pointer-events-none size-4 text-muted-foreground shrink-0 opacity-50" aria-hidden="true" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-1 rounded-[length:var(--select-border-radius,var(--radius-shape-small,8px))] bg-[color:var(--select-bg,var(--color-surface-container-highest))] text-on-surface shadow-md border border-[length:var(--select-border-width,var(--layer-border-width,1px))] border-outline-variant mt-2 z-[200]" align="start">
                <Command className="bg-transparent text-transform-secondary">
                  <CommandList className="max-h-[400px] p-0 overflow-y-auto custom-scrollbar">
                    {domains.map((domain, index) => {
                      const workspaces = getWorkspacesByDomain(domain);
                      if (workspaces.length === 0) return null;
                      const meta = DOMAIN_META[domain];

                      return (
                        <React.Fragment key={domain}>
                          <CommandGroup heading={meta.label} className="px-1.5 py-1 text-xs text-muted-foreground bg-transparent">
                            {workspaces.map((ws) => {
                              const isSelected = activeWorkspaceId === ws.id;
                              return (
                                <CommandItem
                                  key={ws.id}
                                  value={ws.name + " " + ws.tags.join(" ")} // searchable by name and tags
                                  onSelect={() => {
                                    setOpen(false);
                                    
                                    const rawPort = window.location.port;
                                    const currentPort = parseInt(rawPort || '80', 10);
                                    
                                    if (currentPort !== ws.port) {
                                      window.location.assign(getWorkspaceUrl(ws));
                                    } else {
                                      setActiveWorkspace(ws.id);
                                    }
                                  }}
                                  className={cn(
                                    "relative flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm font-body text-transform-secondary text-on-surface outline-hidden select-none hover:bg-layer-panel focus:bg-layer-panel focus:text-on-surface mb-0.5 last:mb-0 transition-colors",
                                    isSelected ? "bg-layer-panel" : ""
                                  )}
                                >
                                  <div className="flex items-center justify-center shrink-0">
                                     {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                     <Icon name={ws.icon as any} size={14} className="opacity-70 pointer-events-none shrink-0" />
                                  </div>
                                  <div className="flex flex-col gap-0.5 ml-1">
                                    <span className="font-semibold text-transform-secondary leading-tight">{ws.name}</span>
                                    <span className="text-[11px] font-body text-muted-foreground leading-none">{ws.sub} • :{ws.port}</span>
                                  </div>
                                  {isSelected && (
                                    <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
                                      <Check className="pointer-events-none size-4 shrink-0" />
                                    </span>
                                  )}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                          {index < domains.length - 1 && <CommandSeparator className="my-1 border-outline-variant/30" />}
                        </React.Fragment>
                      );
                    })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
        </Wrapper>
    );
}
