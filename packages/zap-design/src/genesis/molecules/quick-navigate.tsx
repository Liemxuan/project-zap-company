'use client';

import React, { useState } from 'react';
import { cn } from '../../lib/utils';
import {
  Check,
  ChevronUp,
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
                  size="xs"
                  aria-expanded={open}
                  className={cn(
                    "w-fit flex items-center justify-between px-3 rounded-[var(--input-border-radius,8px)] bg-layer-dialog transition-colors border",
                    open 
                      ? "border-primary text-primary" 
                      : "border-outline-variant text-transform-secondary hover:bg-layer-dialog/90",
                    className
                  )}
                >
                  <div className="flex items-center gap-2.5 pr-3 min-w-[140px]">
                    {mounted && selectedItem ? (
                      <>
                        {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                        <Icon name={selectedItem.icon as any} size={15} className={"text-[\x235E6D21] opacity-90"} />
                        <span className={"text-[13px] font-normal font-display text-[\x235E6D21] leading-none mt-[1px]"}>{selectedItem.name}</span>
                      </>
                    ) : (
                      <span className="text-[13px] font-normal font-display leading-none mt-[1px] opacity-0 pointer-events-none">Select Workspace...</span>
                    )}
                  </div>
                  <ChevronUp className={cn("opacity-50 transition-transform", !open && "rotate-180")} size={14} />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[280px] p-1 rounded-[var(--container-radius,8px)] bg-layer-dialog border-outline-variant shadow-lg mt-2" align="start">
                <Command className="bg-transparent text-transform-primary">
                  <CommandList className="max-h-[400px] p-0 overflow-y-auto custom-scrollbar">
                    {domains.map((domain, index) => {
                      const workspaces = getWorkspacesByDomain(domain);
                      if (workspaces.length === 0) return null;
                      const meta = DOMAIN_META[domain];

                      return (
                        <React.Fragment key={domain}>
                          <CommandGroup heading={meta.label} className="text-transform-tertiary">
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
                                    "flex items-center gap-3 px-3 py-2 rounded-[var(--radius-none,0px)] mb-0.5 last:mb-0 cursor-pointer transition-colors text-[13px] font-normal font-display group",
                                    isSelected 
                                      ? "bg-[\x23E6E8DB] text-[\x235E6D21]" 
                                      : "text-slate-600 hover:bg-slate-100"
                                  )}
                                >
                                  <div className="flex items-center justify-center w-6 h-6 rounded-md bg-layer-panel group-hover:bg-white border text-transform-tertiary shrink-0">
                                     {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                                     <Icon name={ws.icon as any} size={14} className={isSelected ? "text-[\x235E6D21]" : "opacity-70"} />
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="font-semibold text-transform-primary leading-tight">{ws.name}</span>
                                    <span className="text-[11px] text-transform-tertiary">{ws.sub} • :{ws.port}</span>
                                  </div>
                                  {isSelected && (
                                    <Check className="ml-auto text-primary shrink-0" size={14} />
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
