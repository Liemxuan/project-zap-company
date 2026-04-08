'use client';

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getSortedRowModel,
  getPaginationRowModel,
  getFilteredRowModel,
  ColumnDef
} from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
import {
  X, Map, Search, Eye,
  ChevronDown, Pencil, Copy, Archive, Trash2,
  Phone, Globe, Clock, MoreHorizontal
} from 'lucide-react';
import { useMemo, useState, useCallback, ReactNode } from 'react';
import { cn } from 'zap-design/src/lib/utils';

import { Icon } from 'zap-design/src/genesis/atoms/icons/Icon';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import { Badge } from 'zap-design/src/genesis/atoms/status/badges';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from 'zap-design/src/genesis/molecules/popover';
import { QuickActionsDropdown } from 'zap-design/src/genesis/molecules/quick-actions-dropdown';
import { Avatar } from 'zap-design/src/genesis/atoms/status/avatars';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from 'zap-design/src/genesis/molecules/dropdown-menu';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from 'zap-design/src/genesis/atoms/data-display/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'zap-design/src/genesis/atoms/interactive/select';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from 'zap-design/src/genesis/molecules/pagination';

import type { Location, OperatingHours } from '../models/location.model';

/* ── Detail panel key-value row (matches LocationsTemplate) ── */
function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-outline-variant/30 last:border-b-0">
      <span className="font-display text-transform-primary text-sm font-medium text-foreground">{label}</span>
      <span className="font-body text-transform-secondary text-sm text-muted-foreground text-right">{value || '\u2014'}</span>
    </div>
  );
}

/* ── Business hours detail row (matches LocationsTemplate) ── */
function HoursDetailRow({ day, value }: { day: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-outline-variant/30 last:border-b-0">
      <span className="font-display text-transform-primary text-sm font-semibold text-foreground">{day}</span>
      <span className={`font-body text-transform-secondary text-sm ${value === 'Closed' ? 'text-muted-foreground' : 'text-foreground'}`}>{value}</span>
    </div>
  );
}

export type LocationFilters = {
  is_active: boolean[];
  location_type_id: string[];
};

interface ColumnPickerProps {
  table: any;
  t: (key: string, fallback?: string) => string;
}

function ColumnPicker({ table, t }: ColumnPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="h-6 w-6 p-0 rounded-full bg-surface border border-border hover:bg-surface-variant active:scale-95 transition-all shadow-none"
        >
          <Icon name="add" size={14} className="text-muted-foreground" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-4 bg-layer-panel shadow-2xl border border-outline rounded-xl overflow-hidden z-[100]" align="end" sideOffset={12}>
        <div className="flex flex-col gap-4">
          <p className="font-body text-[11px] text-on-surface-variant/60 font-bold tracking-widest uppercase">{t('select_columns', 'COLUMNS')}</p>
          <div className="flex flex-col gap-2.5 max-h-[300px] overflow-y-auto scrollbar-none">
            {table.getAllColumns()
              .filter((col: any) => col.getCanHide())
              .map((col: any) => {
                const labels: Record<string, string> = {
                  'address_line_1': t('table_address', 'Address'),
                  'type': t('table_location_type', 'Type'),
                  'phone_number': t('table_phone', 'Phone number'),
                  'email': t('email', 'Email'),
                  'status': t('table_status', 'Status'),
                };

                const label = labels[col.id] || col.id.charAt(0).toUpperCase() + col.id.slice(1).replace('_', ' ');

                return (
                  <div key={col.id} className="flex items-center gap-3 cursor-pointer group/item py-0.5" onClick={() => col.toggleVisibility(!col.getIsVisible())}>
                    <Checkbox
                      id={`col-${col.id}`}
                      checked={col.getIsVisible()}
                      onCheckedChange={(value) => col.toggleVisibility(!!value)}
                      className="h-4 w-4 border border-outline data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-300 shadow-none rounded-[4px]"
                    />
                    <label
                      htmlFor={`col-${col.id}`}
                      className="text-[11px] font-mono font-medium text-on-surface-variant/80 cursor-pointer select-none uppercase tracking-tight group-hover/item:text-primary transition-colors flex-1"
                    >
                      {label}
                    </label>
                  </div>
                );
              })}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

interface LocationTableExpandedProps {
  locations: Location[];
  loading: boolean;
  filters?: LocationFilters;
  onFilterChange?: (filters: LocationFilters) => void;
  currentPage?: number;
  pageSize?: number;
  totalRecords?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isFilterActive?: boolean;
  onToggleFilters?: () => void;
  onSearchChange?: (query: string) => void;
  onAddLocation?: () => void;
  onEditLocation?: (location: Location) => void;
  onDeleteLocation?: (id: string) => void;
  className?: string;
  t: (key: string, fallback?: string) => string;
  lang: string;
}

export function LocationTableExpanded({
  locations = [],
  loading,
  filters: filtersProp,
  onFilterChange,
  currentPage = 1,
  pageSize = 10,
  totalRecords = locations.length,
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  isFilterActive,
  onToggleFilters,
  onSearchChange,
  onAddLocation,
  onEditLocation,
  onDeleteLocation,
  className,
  t,
  lang
}: LocationTableExpandedProps) {
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [internalFilters, setInternalFilters] = useState<LocationFilters>({ is_active: [], location_type_id: [] });
  const [internalShowFilters, setInternalShowFilters] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const activeFilters = filtersProp ?? internalFilters;
  const showFilters = isFilterActive ?? internalShowFilters;
  const isSearchActive = searchQuery.trim().length > 0;

  const handleFilterChange = (newFilters: LocationFilters) => {
    if (onFilterChange) onFilterChange(newFilters);
    setInternalFilters(newFilters);
  };

  const handleToggleFilters = () => {
    if (onToggleFilters) {
      onToggleFilters();
    } else {
      setInternalShowFilters((current) => !current);
    }
  };

  const handleViewDetail = useCallback((location: Location) => {
    setSelectedLocation(location);
  }, []);

  const columns = useMemo<ColumnDef<Location>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="w-12 px-7">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && "indeterminate")
            }
            onCheckedChange={(value: any) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-12 px-7" onClick={e => e.stopPropagation()}>
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value: any) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'id',
      header: ({ column }) => (
        <div
          className="w-28 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {t('table_column_id', 'ID')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-28 font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
          {row.original.location_code || row.original.id}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => (
        <div
          className="w-80 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {t('table_column_location', 'Name')}
        </div>
      ),
      cell: ({ row }) => {
        const initials = row.original.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        return (
          <div className="w-80 py-2.5 text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                <Avatar
                  className="w-full h-full object-cover border-[1px] border-border"
                  fallback={initials}
                />
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-foreground text-sm truncate uppercase tracking-tight">
                  {row.original.name}
                </span>
                <span className="font-dev font-normal text-xs text-muted-foreground uppercase tracking-wide truncate mt-0.5 opacity-70">
                  {row.original.business_name || row.original.id?.substring(0, 8)}
                </span>
              </div>
            </div>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      accessorKey: 'address_line_1',
      header: () => <div className="w-48 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{t('table_column_address', 'Address')}</div>,
      cell: ({ row }) => (
        <div className="w-48 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
          {row.original.address_line_1 || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'location_type_text',
      id: 'type',
      header: () => <div className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{t('table_column_type', 'Type')}</div>,
      cell: ({ row }) => (
        <div className="w-32 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
          {row.original.location_type_text || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'phone_number',
      header: () => <div className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{t('table_column_phone', 'Phone number')}</div>,
      cell: ({ row }) => (
        <div className="w-32 text-left py-2.5 font-dev text-transform-tertiary">
          <span className="text-muted-foreground">{row.original.phone_number || '-'}</span>
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: () => <div className="w-48 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{t('table_column_email', 'Email')}</div>,
      cell: ({ row }) => (
        <div className="w-48 font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
          {row.original.email || '-'}
        </div>
      ),
    },
    {
      accessorKey: 'is_active',
      id: 'status',
      header: ({ column }) => (
        <div
          className="w-14 text-right font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          {t('table_column_status', 'Status')}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = row.original.is_active;
        const statusCode = row.original.status_code || (isActive ? 'ACTIVE' : 'INACTIVE');
        const variant = isActive ? "success" : "warning";

        return (
          <div className="w-14 text-right py-2.5">
            <Pill
              variant={variant}
              className="whitespace-nowrap w-fit ml-auto"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
              {statusCode}
            </Pill>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      id: "actions",
      header: ({ table }) => (
        <div className="w-18 pr-7 flex items-center justify-end">
          <ColumnPicker table={table} t={t} />
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-18 pr-7 py-2.5 text-right flex items-center justify-end" onClick={e => e.stopPropagation()}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 hover:bg-surface-variant transition-all rounded-lg opacity-60 hover:opacity-100"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 p-1.5 rounded-xl border border-outline-variant shadow-xl bg-layer-panel animate-in fade-in zoom-in-95 duration-200">
              <DropdownMenuItem
                onClick={() => handleViewDetail(row.original)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-display cursor-pointer hover:bg-surface-variant transition-colors rounded-lg"
              >
                <Eye className="h-3.5 w-3.5 text-primary" />
                <span>{t('view', 'View')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEditLocation?.(row.original)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-display cursor-pointer hover:bg-surface-variant transition-colors rounded-lg"
              >
                <Pencil className="h-3.5 w-3.5 text-primary" />
                <span>{t('edit', 'Edit')}</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDeleteLocation?.(row.original.id)}
                className="flex items-center gap-2 px-3 py-2 text-xs font-display cursor-pointer hover:bg-destructive/10 text-destructive transition-colors rounded-lg"
              >
                <Trash2 className="h-3.5 w-3.5" />
                <span>{t('delete', 'Delete')}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
    },
  ], [onEditLocation, onDeleteLocation, t, handleViewDetail]);

  const table = useReactTable({
    data: locations,
    columns,
    state: {
      globalFilter: searchQuery,
    },
    onGlobalFilterChange: setSearchQuery,
    initialState: {
      columnVisibility: {
        type: false, // Optional: Hidden by default
      },
    },
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });


  if (loading) {
    return (
      <main className={cn("w-full bg-layer-canvas overflow-hidden flex flex-col flex-1", className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
      </main>
    );
  }

  /* ── Parse operating hours helper ── */
  const getHoursDisplay = (loc: Location, day: keyof OperatingHours): string => {
    if (!loc.operating_hours || typeof loc.operating_hours === 'string') return 'Closed';
    const hours = loc.operating_hours as OperatingHours;
    const d = hours[day];
    if (!d || d.is_closed) return 'Closed';
    return `${d.open} - ${d.close}`;
  };

  return (
    <div className="flex h-full w-full relative overflow-hidden bg-layer-base/50">
      <main className={cn("flex-1 min-w-0 bg-transparent flex flex-col h-full", className)}>
        {/* ACTION BAR (matches LocationsTemplate toolbar) */}
        <div className="flex flex-col md:flex-row justify-between items-center w-full h-16 px-6 gap-4 border-b border-outline-variant bg-layer-base shrink-0">
          <div className="flex items-center gap-3 flex-1">
            {isSearchActive && (
              <Badge className="h-5 px-2 font-dev text-[10px] text-primary border-primary/20 bg-primary/5">
                {table.getFilteredRowModel().rows.length} {t('found', 'found')}
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto">
            {/* Search moved to right */}
            <div className="relative w-full md:w-80 group">
              <Icon name="search" size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-40 group-focus-within:text-primary group-focus-within:opacity-100 transition-all z-10" />
              <Input
                variant="filled"
                placeholder={t('search_placeholder', 'Search...')}
                value={inputValue}
                onChange={(e) => {
                  setInputValue(e.target.value);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchQuery(inputValue);
                    onSearchChange?.(inputValue);
                  }
                }}
                className="pl-10 h-10 bg-surface-variant/30 border-none text-sm font-body text-transform-secondary rounded-xl focus:ring-2 focus:ring-primary/20 transition-all w-full"
              />
            </div>

            {/* Filter Toggle */}
            <Button
              variant={isFilterActive ? "primary" : "outline"}
              size="sm"
              onClick={handleToggleFilters}
              className={cn(
                "h-10 px-5 gap-2 font-display text-xs text-transform-primary rounded-xl transition-all shadow-sm",
                isFilterActive ? "ring-2 ring-primary/20" : ""
              )}
            >
              <Icon name="filter_list" size={16} className={cn(isFilterActive ? "text-on-primary" : "text-primary")} />
              {t('filter', 'Filter')}
            </Button>

            {/* Add Location */}
            <Button
              variant="primary"
              size="sm"
              onClick={onAddLocation}
              className="h-10 px-5 gap-2 font-display text-xs text-transform-primary rounded-xl shadow-md active:scale-95 transition-all"
            >
              <Icon name="add" size={18} className="text-on-primary" />
              {t('add_location', 'Add Location')}
            </Button>
          </div>
        </div>

        <div className="flex flex-1 overflow-hidden">
          {/* DATA GRID */}
          <div className="flex-1 flex flex-col bg-layer-cover overflow-hidden min-w-0 relative">
            <div className="absolute inset-0 [&_[data-slot=table-wrapper]]:h-full [&_[data-slot=table-wrapper]]:overflow-auto [&_[data-slot=table-wrapper]]:scrollbar-thin [&_[data-slot=table-wrapper]]:scrollbar-thumb-outline-variant/30 [&_[data-slot=table-wrapper]]:scrollbar-track-transparent">
              <Table className="relative bg-transparent border-collapse w-full min-w-max">
                <TableHeader className="bg-layer-panel top-0 z-20 sticky border-b border-border shadow-sm h-12">
                  {table.getHeaderGroups().map((headerGroup: any) => (
                    <TableRow key={headerGroup.id} className="border-b-0 hover:bg-transparent transition-none">
                      {headerGroup.headers.map((header: any) => (
                        <TableHead key={header.id} className="h-12 p-0 bg-layer-panel relative">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </TableHead>
                      ))}
                    </TableRow>
                  ))}
                </TableHeader>
                <TableBody>
                  {table.getRowModel().rows.map((row: any) => (
                    <TableRow
                      key={row.id}
                      className="group border-b border-border/50 hover:bg-surface-variant/50 focus:bg-surface-variant/70 transition-colors cursor-pointer"
                      onClick={() => handleViewDetail(row.original)}
                    >
                      {row.getVisibleCells().map((cell: any) => (
                        <TableCell key={cell.id} className="p-0">
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="border-t border-border bg-layer-panel px-7 py-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground font-body text-transform-secondary">
            <div className="flex items-center gap-2">
              <span>{t('show', 'Show')}</span>
              <Select
                value={pageSize.toString()}
                onValueChange={(val) => onPageSizeChange?.(Number(val))}
              >
                <SelectTrigger size="sm" className="h-8 min-w-[70px] font-mono text-[11px] bg-layer-panel border-outline">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()}>
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>{t('records_per_table', 'items per page')}</span>
            </div>

            <div className="flex items-center gap-6">
              <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">
                {t('page', 'Page')} {currentPage} {t('of', 'of')} {totalPages}
              </span>

              <Pagination className="mx-0 w-auto m-0">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      className={cn(
                        "h-8 px-3 font-mono text-[10px] tracking-widest uppercase border-outline",
                        currentPage === 1 && "pointer-events-none opacity-40"
                      )}
                      onClick={() => onPageChange?.(currentPage - 1)}
                    >
                      {t('previous', 'Previous')}
                    </PaginationPrevious>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext
                      className={cn(
                        "h-8 px-3 font-mono text-[10px] tracking-widest uppercase border-outline",
                        currentPage === totalPages && "pointer-events-none opacity-40"
                      )}
                      onClick={() => onPageChange?.(currentPage + 1)}
                    >
                      {t('next', 'Next')}
                    </PaginationNext>
                  </PaginationItem>

                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      </main>

      {/* ── DETAIL PANEL (matches LocationsTemplate) ── */}
      <AnimatePresence>
        {selectedLocation && (
          <>
            <motion.div
              key="detail-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] hidden md:block"
              onClick={() => setSelectedLocation(null)}
            />
            {(() => {
              const loc = selectedLocation;
              return (
                <motion.div
                  key="detail-panel"
                  initial={{ x: '100%', opacity: 0.5 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 0.5 }}
                  transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                  className="fixed top-0 right-0 h-screen w-[420px] bg-layer-panel border-l border-border flex flex-col shrink-0 z-[100] shadow-2xl overflow-hidden"
                >
                  <div className="flex flex-col h-full w-full overflow-y-auto">
                    {/* Panel Header */}
                    <div className="flex items-center justify-between px-5 py-4 shrink-0">
                      <button
                        onClick={() => setSelectedLocation(null)}
                        className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-surface-variant/60 transition-colors text-foreground"
                      >
                        <X size={16} />
                      </button>
                      <Button variant="primary" size="sm" className="font-display text-transform-primary text-xs h-8 px-5 rounded-lg shadow-sm"
                        onClick={() => onEditLocation?.(loc)}
                      >
                        {t('edit_location', 'edit location')}
                      </Button>
                    </div>

                    {/* Location Name */}
                    <div className="px-6 pt-2 pb-4">
                      <h2 className="font-display text-transform-primary text-lg font-semibold text-foreground">{loc.name}</h2>
                      <p className="font-body text-transform-secondary text-sm text-muted-foreground mt-0.5">{loc.business_name || loc.name}</p>
                    </div>

                    {/* Mock Map Section */}
                    {/* <div className="px-6 pb-6">
                      <div className="aspect-[16/10] w-full rounded-2xl bg-surface-variant/40 border border-outline-variant/60 relative overflow-hidden flex items-center justify-center group shadow-sm">
                        <div className="absolute inset-0 bg-[url('https://api.mapbox.com/styles/v1/mapbox/light-v10/static/-74.0060,40.7128,12,0/420x240?access_token=mock')] bg-cover bg-center opacity-40 transition-all duration-700 group-hover:scale-105"
                          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526778548025-fa2f459cd5c1?auto=format&fit=crop&q=80&w=420&h=240')" }}
                        />
                        <div className="relative z-10 w-10 h-10 rounded-full bg-primary/20 border border-primary/30 backdrop-blur-md flex items-center justify-center shadow-lg active:scale-95 transition-all">
                          <Icon name="location_on" size={20} className="text-primary" />
                        </div>
                        <div className="absolute bottom-3 left-3 right-3 px-3 py-2 rounded-xl bg-surface/90 backdrop-blur-sm border border-outline-variant/50 shadow-sm flex items-center justify-between animate-in fade-in slide-in-from-bottom-2">
                          <span className="text-[10px] font-display font-bold text-on-surface tracking-wider uppercase opacity-80 cursor-default">View in Maps</span>
                          <Icon name="open_in_new" size={12} className="text-on-surface-variant opacity-60" />
                        </div>
                      </div>
                    </div> */}

                    {/* Location Details */}
                    <div className="px-6 pb-6 space-y-1">
                      <h3 className="font-display text-transform-primary text-sm font-semibold text-foreground mb-3">{t('location_details', 'location details')}</h3>
                      <DetailRow label={t('nickname', 'nickname')} value={loc.name} />
                      <DetailRow label={t('location_type', 'location type')} value={loc.location_type_text || '-'} />
                      <DetailRow label={t('address', 'address')} value={loc.address_line_1 || '-'} />
                      <DetailRow label={t('city', 'city')} value={loc.city || '-'} />
                      <DetailRow label={t('phone', 'phone')} value={loc.phone_number || '-'} />
                      <DetailRow label={t('email', 'email')} value={loc.email || '-'} />
                      <DetailRow label={t('preferred_language', 'preferred language')} value={loc.preferred_language || 'English'} />
                    </div>

                    {/* Separator */}
                    <div className="border-t border-outline-variant/40 mx-6" />

                    {/* Business Hours */}
                    <div className="px-6 py-6 space-y-1">
                      <h3 className="font-display text-transform-primary text-sm font-semibold text-foreground mb-3">{t('business_hours', 'business hours')}</h3>
                      <HoursDetailRow day={t('monday', 'monday')} value={getHoursDisplay(loc, 'mon')} />
                      <HoursDetailRow day={t('tuesday', 'tuesday')} value={getHoursDisplay(loc, 'tue')} />
                      <HoursDetailRow day={t('wednesday', 'wednesday')} value={getHoursDisplay(loc, 'wed')} />
                      <HoursDetailRow day={t('thursday', 'thursday')} value={getHoursDisplay(loc, 'thu')} />
                      <HoursDetailRow day={t('friday', 'friday')} value={getHoursDisplay(loc, 'fri')} />
                      <HoursDetailRow day={t('saturday', 'saturday')} value={getHoursDisplay(loc, 'sat')} />
                      <HoursDetailRow day={t('sunday', 'sunday')} value={getHoursDisplay(loc, 'sun')} />
                    </div>
                  </div>
                </motion.div>
              );
            })()}
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
