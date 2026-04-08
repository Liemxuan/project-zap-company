'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Menu } from '../models/menu.model';
import { Badge } from 'zap-design/src/genesis/atoms/interactive/badge';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import { Avatar, AvatarFallback } from 'zap-design/src/genesis/atoms/interactive/avatar';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { MoreHorizontal, Plus } from 'lucide-react';
import { cn } from 'zap-design/src/lib/utils';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from 'zap-design/src/genesis/molecules/popover';

/**
 * Defining Menu Columns as per user-provided image specification.
 * 1. Menu (Name) - FIXED
 * 2. Location - DEFAULT (Toggleable)
 * 3. Channel - DEFAULT (Toggleable)
 * 4. Total Item - DEFAULT (Toggleable) - RIGHT ALIGNED
 * 5. Status - FIXED - LEFT ALIGNED
 * 6. Actions - FIXED - CENTER ALIGNED
 */
export const menuColumns = (
  t: (key: string, fallback?: string) => string
): ColumnDef<Menu>[] => [
  {
    accessorKey: "name",
    id: "name",
    header: ({ column }) => (
      <div 
        className="min-w-48 px-7 py-3 text-left font-mono text-[10px] font-bold tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t('menu_col_name', 'Tên thực đơn')}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-7 py-2.5 flex items-center gap-3">
        <Avatar size="sm">
          <AvatarFallback className="bg-primary/10 text-primary text-[10px] font-bold">
            {row.original.name.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-foreground text-sm truncate uppercase tracking-tight">
            {row.original.name}
          </span>
          <span className="font-dev text-[10px] text-muted-foreground opacity-60 uppercase tracking-widest mt-0.5">
            {row.original.id.split('-')[0]}
          </span>
        </div>
      </div>
    ),
    enableHiding: false, // FIXED
  },
  {
    accessorKey: "locations",
    id: "locations",
    header: ({ column }) => (
      <div 
        className="w-40 px-4 text-left font-mono text-[10px] font-bold tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t('menu_col_location', 'Chi nhánh')}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2.5 flex flex-wrap items-center gap-1">
        {row.original.locations.slice(0, 1).map(loc => (
          <Badge key={loc} variant="outline" className="text-[9px] px-1.5 py-0 font-mono tracking-tighter uppercase border-outline-variant text-muted-foreground">
            {loc}
          </Badge>
        ))}
        {row.original.locations.length > 1 && (
          <Badge variant="outline" className="text-[9px] px-1.5 py-0 font-mono text-muted-foreground border-outline-variant">
            +{row.original.locations.length - 1}
          </Badge>
        )}
      </div>
    ),
    enableHiding: true, // DEFAULT
  },
  {
    accessorKey: "channels",
    id: "channels",
    header: ({ column }) => (
      <div 
        className="w-40 px-4 text-left font-mono text-[10px] font-bold tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t('menu_col_channel', 'Kênh')}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2.5 flex items-center gap-1.5 overflow-hidden">
        {row.original.channels.slice(0, 2).map((ch, i) => (
          <span key={i} className="text-xs font-body text-muted-foreground truncate">{ch}{i < 1 && row.original.channels.length > 1 ? ',' : ''}</span>
        ))}
        {row.original.channels.length > 2 && <span className="text-[10px] text-muted-foreground opacity-60">...</span>}
      </div>
    ),
    enableHiding: true, // DEFAULT
  },
  {
    accessorKey: "total_item",
    id: "total_item",
    header: ({ column }) => (
      <div 
        className="w-32 px-4 text-right font-mono text-[10px] font-bold tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t('menu_col_total_item', 'Tổng số món')}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2.5 text-right font-mono text-sm font-bold text-on-surface-variant flex items-center justify-end h-full">
        {row.original.total_item}
      </div>
    ),
    enableHiding: true, // DEFAULT
  },
  {
    accessorKey: "is_active",
    id: "is_active",
    header: ({ column }) => (
      <div 
        className="w-32 px-4 text-left font-mono text-[10px] font-bold tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        {t('menu_col_status', 'Trạng thái')}
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-4 py-2.5 flex justify-start items-center">
        <Pill 
          variant={row.original.is_active ? 'success' : 'error'} 
          className="whitespace-nowrap px-2.5 py-0.5 font-mono text-[9px] uppercase font-bold tracking-tight shadow-none border-none h-5"
        >
          <div className={cn("w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80", row.original.is_active ? "bg-success" : "bg-error")} />
          {row.original.is_active ? t('status_active', 'Active') : t('status_inactive', 'Inactive')}
        </Pill>
      </div>
    ),
    enableHiding: false, // FIXED
  },
  {
    id: "actions",
    header: ({ table }) => (
      <div className="w-20 text-center py-4 relative group/header">
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-7 w-7 p-0 bg-surface-variant/20 hover:bg-surface-variant border border-outline-variant/30 rounded-md shadow-sm transition-all absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2"
            >
              <Plus className="h-3.5 w-3.5 text-muted-foreground group-hover/header:rotate-90 transition-transform duration-500" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56 p-0 bg-layer-panel shadow-2xl border border-outline rounded-xl overflow-hidden" align="end" sideOffset={8}>
            <div className="p-3 border-b border-border bg-surface-variant/30">
              <p className="font-mono text-[10px] text-muted-foreground font-bold tracking-widest uppercase">{t('select_columns', 'Bật / Tắt Cột')}</p>
            </div>
            <div className="px-3 py-3 flex flex-col gap-2">
              {table.getAllColumns()
                .filter(col => col.getCanHide())
                .map(col => {
                  const labels: Record<string, string> = {
                    locations: t('menu_col_location', 'Chi nhánh'),
                    channels: t('menu_col_channel', 'Kênh'),
                    total_item: t('menu_col_total_item', 'Tổng số món'),
                  };
                  return (
                    <div key={col.id} className="flex items-center gap-3 p-1.5 hover:bg-surface-variant/20 rounded-md transition-colors cursor-pointer group/item" onClick={() => col.toggleVisibility(!col.getIsVisible())}>
                      <Checkbox
                        checked={col.getIsVisible()}
                        onCheckedChange={(value) => col.toggleVisibility(!!value)}
                        className="h-4 w-4 border-outline pointer-events-none"
                      />
                      <span className="text-[11px] font-medium text-on-surface-variant/70 group-hover/item:text-on-surface transition-colors tracking-tight">
                        {labels[col.id] || col.id}
                      </span>
                    </div>
                  );
                })}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    ),
    cell: () => (
      <div className="w-20 py-2.5 text-center flex justify-center">
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-surface-variant/40 rounded-full">
          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
        </Button>
      </div>
    ),
    enableHiding: false, // FIXED
  },
];
