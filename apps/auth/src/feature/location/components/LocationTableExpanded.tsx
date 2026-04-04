'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Eye, Edit, Trash2, Filter, Plus, Search } from 'lucide-react';
import { cn } from 'zap-design/src/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { QuickActionsDropdown } from 'zap-design/src/genesis/molecules/quick-actions-dropdown';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from 'zap-design/src/genesis/atoms/data-display/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from 'zap-design/src/genesis/molecules/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'zap-design/src/genesis/atoms/interactive/select';
import { Popover, PopoverContent, PopoverTrigger } from 'zap-design/src/genesis/molecules/popover';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Location } from '../models/location.model';

export type LocationFilters = {
  is_active?: boolean[];
  warehouse_type?: string[];
};

export interface ColumnDefinition {
  id: string;
  label: string;
  isFixed: boolean;
  isDefault: boolean;
  flexClass: string;
}

function LocationRow({
  location,
  expanded,
  onToggle,
  t,
  visibleColumns,
  columns,
}: {
  location: Location;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
  visibleColumns: string[];
  columns: ColumnDefinition[];
}) {
  return (
    <>
      <TableRow onClick={onToggle} className="cursor-pointer group hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b border-border/50 transition-all h-16">
        <TableCell className="px-7 w-12 py-2.5" onClick={onToggle}>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-4 cursor-pointer"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </TableCell>

        {columns.map(col => {
          if (!visibleColumns.includes(col.id)) return null;

          if (col.id === 'id') {
            return (
              <TableCell key={col.id} className={cn(col.flexClass, "whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[10px]")}>
                {location.id}
              </TableCell>
            );
          }
          if (col.id === 'name') {
            return (
              <TableCell key={col.id} className={cn(col.flexClass, "whitespace-nowrap text-left py-4 px-4 font-display font-bold text-sm text-foreground")}>
                {location.name}
              </TableCell>
            );
          }
          if (col.id === 'warehouse_type') {
            return (
              <TableCell key={col.id} className={cn(col.flexClass, "whitespace-nowrap text-center py-4 font-dev text-muted-foreground text-[11px] uppercase tracking-wide")}>
                {location.warehouse_type}
              </TableCell>
            );
          }
          if (col.id === 'phone_number') {
            return (
              <TableCell key={col.id} className={cn(col.flexClass, "whitespace-nowrap text-left py-4 font-body text-muted-foreground text-sm")}>
                {location.phone_number || '—'}
              </TableCell>
            );
          }
          if (col.id === 'address_json') {
            return (
              <TableCell key={col.id} className={cn(col.flexClass, "whitespace-nowrap text-left py-4 px-4 font-body text-muted-foreground text-sm min-w-[250px]")}>
                {location.address_json}
              </TableCell>
            );
          }
          if (col.id === 'city') {
            return (
              <TableCell key={col.id} className={cn(col.flexClass, "whitespace-nowrap text-center py-4 font-body text-muted-foreground text-[11px]")}>
                {location.city || '—'}
              </TableCell>
            );
          }
          if (col.id === 'is_active') {
            return (
              <TableCell key={col.id} className={cn(col.flexClass, "whitespace-nowrap py-4")}>
                <div className="flex justify-center">
                  <Pill variant={location.is_active ? 'success' : 'error'} className="min-w-[70px] uppercase block text-center text-[10px] font-bold tracking-wider">
                    {location.is_active ? t('status_active', 'ACTIVE') : t('status_inactive', 'INACTIVE')}
                  </Pill>
                </div>
              </TableCell>
            );
          }
          if (col.id === 'actions') {
            return (
              <TableCell key={col.id} className="w-16 whitespace-nowrap text-right py-4 sticky right-0 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.12)] border-l border-border bg-layer-cover group-hover:bg-surface-variant/50 transition-colors" onClick={(e) => e.stopPropagation()}>
                <QuickActionsDropdown
                  actions={[
                    { label: t('action_view', 'View'), icon: Eye, onClick: () => console.log('View', location.id) },
                    { label: t('action_edit', 'Edit'), icon: Edit, onClick: () => console.log('Edit', location.id) },
                    { label: t('action_delete', 'Delete'), icon: Trash2, variant: 'destructive', onClick: () => console.log('Delete', location.id) },
                  ]}
                />
              </TableCell>
            );
          }
          return null;
        })}
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="bg-layer-panel/20 border-0">
            <TableCell colSpan={visibleColumns.length + 1} className="p-0 border-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: "circOut" }}
                className="overflow-hidden bg-layer-panel border-t border-border"
              >
                <div className="grid grid-cols-4 gap-8 px-12 py-8 border-b border-border">
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('legacy_id', 'Legacy ID')}</p>
                    <p className="text-xs font-dev text-foreground">{location.legacy_id}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('updated_at', 'Updated At')}</p>
                    <p className="text-xs font-dev text-foreground">{new Date(location.updated_at).toLocaleString()}</p>
                  </div>
                  <div className="space-y-1 col-span-2">
                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">{t('internal_meta', 'Internal Metadata')}</p>
                    <div className="flex gap-2">
                      <Pill variant="neutral" className="text-[9px] lowercase font-mono">{t('tenant_id_short', 'tid')}: {location.tenant_id.slice(0, 6)}</Pill>
                      <Pill variant="neutral" className="text-[9px] lowercase font-mono">{t('manager_id_short', 'mid')}: {location.manager_id.slice(0, 6)}</Pill>
                    </div>
                  </div>
                </div>
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}

interface LocationTableExpandedProps {
  locations: Location[];
  loading: boolean;
  totalRecords: number;
  totalPages: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSearchChange: (query: string) => void;
  onToggleFilters: () => void;
  isFilterActive: boolean;
  t: (key: string, fallback?: string) => string;
  lang: string;
  className?: string;
}

export function LocationTableExpanded({
  locations = [],
  loading,
  totalRecords,
  totalPages: totalPagesProp,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  onSearchChange,
  onToggleFilters,
  isFilterActive,
  t,
  className,
}: LocationTableExpandedProps) {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // Column config matching Excel specification
  const columns: ColumnDefinition[] = [
    { id: 'id', label: t('table_id', 'id'), flexClass: 'w-16', isFixed: false, isDefault: true },
    { id: 'name', label: t('table_name', 'location name'), flexClass: 'min-w-40', isFixed: true, isDefault: true },
    { id: 'warehouse_type', label: t('table_location_type', 'location type'), flexClass: 'w-32', isFixed: false, isDefault: false },
    { id: 'phone_number', label: t('table_phone', 'phone'), flexClass: 'w-32', isFixed: false, isDefault: true },
    { id: 'address_json', label: t('table_address', 'address'), flexClass: 'min-w-[250px]', isFixed: false, isDefault: true },
    { id: 'city', label: t('table_city', 'city'), flexClass: 'w-32', isFixed: false, isDefault: false },
    { id: 'is_active', label: t('table_status', 'status'), flexClass: 'w-28', isFixed: true, isDefault: true },
    { id: 'actions', label: t('table_actions', 'actions'), flexClass: 'w-16', isFixed: true, isDefault: true },
  ];

  const [visibleColumns, setVisibleColumns] = useState<string[]>(
    columns.filter(c => c.isDefault || c.isFixed).map(c => c.id)
  );
  const [tempCols, setTempCols] = useState<string[]>([...visibleColumns]);

  const hasActiveFilter = isFilterActive || searchQuery.trim() !== '';
  const totalPages = totalPagesProp || Math.ceil(totalRecords / pageSize);

  const pageNumbers: (number | string)[] = useMemo(() => {
    const items: (number | string)[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) items.push(i);
    } else {
      items.push(1);
      if (currentPage > 3) items.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) items.push(i);
      if (currentPage < totalPages - 2) items.push('...');
      items.push(totalPages);
    }
    return items;
  }, [currentPage, totalPages]);

  return (
    <main className={cn('w-full bg-layer-canvas border border-outline-variant rounded-lg flex flex-col min-h-[500px]', className)}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[4.5rem] flex-shrink-0">
        <div className="flex items-center h-8">

        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'search locations...')}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                onSearchChange(e.target.value);
                onPageChange(1);
              }}
              className="font-body text-transform-secondary text-sm h-[48px]"
            />
          </div>

          <Button
            variant={isFilterActive ? 'primary' : 'outline'}
            size="sm"
            onClick={onToggleFilters}
            className="relative h-[48px] px-6"
          >
            <Filter size={16} className="mr-2" />
            <span className="font-display font-medium text-xs text-transform-primary uppercase">{t('filter', 'filters')}</span>
          </Button>

          <Button variant="primary" size="sm" className="h-[48px] px-6">
            <span className="font-display font-medium text-xs text-transform-primary uppercase">{t('add_location', 'add location')}</span>
          </Button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-layer-cover overflow-hidden min-w-0">
        <div className="flex-1 overflow-auto rounded-none border-0 overflow-y-visible">
          <Table className="relative bg-transparent h-full">
            <TableHeader className="bg-layer-panel top-0 z-20 sticky border-b border-border shadow-sm h-12">
              <TableRow className="border-b-0 hover:bg-transparent h-12">
                <TableHead className="w-10 text-center h-12 px-5"></TableHead>
                {columns.map(col => {
                  if (!visibleColumns.includes(col.id)) return null;

                  // Sticky styles for actions column
                  const isActions = col.id === 'actions';
                  const stickyClass = isActions ? "sticky right-0 z-30 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] border-l border-border bg-layer-panel" : "";

                  return (
                    <TableHead
                      key={col.id}
                      className={cn(
                        col.flexClass,
                        "text-left bg-layer-panel font-display font-black text-[10px] h-12 text-transform-primary uppercase tracking-[0.1em] px-4",
                        (col.id === 'warehouse_type' || col.id === 'is_active' || col.id === 'city') && "text-center",
                        stickyClass
                      )}
                    >
                      <div className={cn(
                        "flex items-center gap-2 overflow-visible", 
                        isActions ? "justify-end" : (col.id === 'warehouse_type' || col.id === 'is_active' || col.id === 'city') ? "justify-center" : "justify-start"
                      )}>
                        {!isActions && <span>{col.label}</span>}
                        {isActions && (
                          <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-6 w-6 p-0 bg-surface hover:bg-surface-variant border border-border rounded-md"
                                onClick={() => setTempCols([...visibleColumns])}
                              >
                                <Plus size={12} />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-56 p-0 bg-surface shadow-2xl border border-outline rounded-xl overflow-hidden" align="end" sideOffset={8}>
                              <div className="p-3 bg-layer-panel/50 border-b border-border">
                                <p className="font-dev text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">{t('select_columns', 'Select Columns')}</p>
                              </div>
                              <div className="p-3 flex flex-col gap-3">
                                {columns.map(c => {
                                  if (c.isFixed) return null;
                                  return (
                                    <div key={c.id} className="flex items-center space-x-2">
                                      <Checkbox
                                        id={`col-${c.id}`}
                                        checked={tempCols.includes(c.id)}
                                        onCheckedChange={(checked) => {
                                          setTempCols(prev => checked ? [...prev, c.id] : prev.filter(id => id !== c.id));
                                        }}
                                      />
                                      <label htmlFor={`col-${c.id}`} className="text-sm font-medium leading-none cursor-pointer capitalize">{c.label}</label>
                                    </div>
                                  );
                                })}
                              </div>
                              <div className="p-2 bg-layer-panel/30 border-t border-border flex justify-end gap-3 items-center">
                                <button
                                  onClick={() => setTempCols(columns.filter(c => c.isDefault || c.isFixed).map(c => c.id))}
                                  className="text-[10px] font-dev text-muted-foreground font-semibold uppercase tracking-wide hover:text-foreground"
                                >
                                  {t('btn_reset', 'Reset')}
                                </button>
                                <button
                                  onClick={() => { setVisibleColumns(tempCols); setIsPopoverOpen(false); }}
                                  className="text-[10px] font-dev text-foreground font-semibold uppercase tracking-wide hover:opacity-80"
                                >
                                  {t('btn_apply', 'Apply')}
                                </button>
                              </div>
                            </PopoverContent>
                          </Popover>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow className="border-none">
                  <TableCell colSpan={visibleColumns.length + 1} className="text-center py-32 h-full">
                    <div className="flex flex-col items-center gap-4">
                      <div className="h-8 w-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
                    </div>
                  </TableCell>
                </TableRow>
              ) : locations.length === 0 ? (
                <TableRow className="border-none">
                  <TableCell colSpan={visibleColumns.length + 1} className="h-80 text-center py-8">
                    <p className="text-[10px] font-mono font-bold tracking-widest uppercase opacity-40">{t('no_data', 'No locations found')}</p>
                  </TableCell>
                </TableRow>
              ) : (
                locations.map((location) => (
                  <LocationRow
                    key={location.id}
                    location={location}
                    expanded={expandedId === location.id}
                    onToggle={() => setExpandedId(current => current === location.id ? null : location.id)}
                    t={t}
                    visibleColumns={visibleColumns}
                    columns={columns}
                  />
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="border-t border-border bg-layer-panel px-7 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground font-body text-transform-secondary">
          <div className="flex items-center gap-3">
            <span className="text-transform-secondary">{t('show', 'Show')}</span>
            <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(parseInt(v, 10))}>
              <SelectTrigger size="sm" className="w-20 font-medium font-body bg-layer-panel text-on-surface hover:bg-layer-dialog">
                <SelectValue placeholder={pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-transform-secondary">{t('records_per_table', 'records per table')}</span>
          </div>

          <Pagination className="mx-0 w-auto m-0">
            <PaginationContent className="gap-1">
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                  className={cn('h-8 px-3 font-body cursor-pointer', currentPage === 1 && 'pointer-events-none opacity-40')}
                />
              </PaginationItem>
              {pageNumbers.map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === '...' ? <PaginationEllipsis className="h-8 w-8 opacity-30" /> : (
                    <PaginationLink isActive={currentPage === page} onClick={() => onPageChange(page as number)} className="h-8 w-8 font-body cursor-pointer">
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                  className={cn('h-8 px-3 font-body cursor-pointer', currentPage === totalPages && 'pointer-events-none opacity-40')}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
