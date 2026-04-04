'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Filter, Eye, Edit, Trash2, Plus } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from 'zap-design/src/lib/utils';

import { Badge } from 'zap-design/src/genesis/atoms/interactive/badge';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from 'zap-design/src/genesis/molecules/popover';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'zap-design/src/genesis/atoms/interactive/select';
import { QuickActionsDropdown } from 'zap-design/src/genesis/molecules/quick-actions-dropdown';
import type { Unit, UnitStatus } from '../models/unit.model';

export type UnitFilters = {
  status: UnitStatus[];
};

function UnitRow({
  unit,
  expanded,
  onToggle,
  t,
  visibleCols,
  lang,
}: {
  unit: Unit;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
  visibleCols: Record<string, boolean>;
  lang: string;
}) {
  const pillVariant = unit.status === 'active' ? 'success' : 'neutral';

  return (
    <>
      <TableRow
        className="group hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b border-border/50 group-last:border-0"
      >
        <TableCell className="px-7 w-12 py-2.5" onClick={onToggle}>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-4 cursor-pointer"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </TableCell>

        {/* 1. Name (Fixed) */}
        <TableCell className="min-w-40 py-2.5 text-left">
          <span className="font-display font-bold text-foreground text-sm truncate block">{unit.name}</span>
        </TableCell>

        {/* 2. Symbol (Default) */}
        {visibleCols.symbol && (
          <TableCell className="w-32 py-2.5 text-center font-body text-muted-foreground truncate text-sm">
            {unit.abbreviation || '—'}
          </TableCell>
        )}

        {/* 3. Precision (Default) */}
        {visibleCols.precision && (
          <TableCell className="w-32 py-2.5 text-center text-muted-foreground truncate font-body text-sm">
            0
          </TableCell>
        )}

        {/* 4. Status (Fixed) */}
        <TableCell className="w-32 text-center py-2.5">
          <Pill variant={pillVariant} className="whitespace-nowrap w-fit m-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
            {t(`status_${unit.status}`, unit.status)}
          </Pill>
        </TableCell>

        {/* 5. Actions (Fixed - Sticky) */}
        <TableCell className="w-24 pr-7 py-2.5 text-right sticky right-0 z-10 bg-layer-base group-hover:bg-surface-variant/50 transition-colors shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.12)] border-l border-border">
          <div className="flex items-center justify-end text-muted-foreground">
            <QuickActionsDropdown
              actions={[
                { label: t('action_view', 'view'), icon: Eye, onClick: () => console.log('view', unit.id) },
                { label: t('action_edit', 'edit'), icon: Edit, onClick: () => console.log('edit', unit.id) },
                { label: t('action_delete', 'delete'), icon: Trash2, variant: 'destructive', onClick: () => console.log('delete', unit.id) },
              ]}
            />
          </div>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0 overflow-hidden">
            <TableCell colSpan={10} className="p-0 border-b-0 h-0 border-t-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-layer-panel border-t border-border"
              >
                <div className="space-y-4 px-7 py-4 border-b border-border">
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-dev text-transform-tertiary">
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_id', 'id')}
                      </p>
                      <p className="text-foreground">{unit.id}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_symbol', 'symbol')}
                      </p>
                      <p className="text-foreground">{unit.abbreviation || '—'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_description', 'description')}
                      </p>
                      <p className="text-foreground truncate">{unit.description || '—'}</p>
                    </div>
                  </div>
                  {(unit.createdAt || unit.updatedAt) && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-dev text-transform-tertiary pt-2 border-t border-border/40">
                      <div>
                        <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                          {t('table_created', 'created')}
                        </p>
                        <p className="text-[10px] text-foreground">
                          {unit.createdAt ? new Date(unit.createdAt).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US') : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                          {t('table_updated', 'updated')}
                        </p>
                        <p className="text-[10px] text-foreground">
                          {unit.updatedAt ? new Date(unit.updatedAt).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US') : '—'}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </TableCell>
          </TableRow>
        )}
      </AnimatePresence>
    </>
  );
}

function FilterPanel({
  filters,
  onChange,
  t,
}: {
  filters: UnitFilters;
  onChange: (filters: UnitFilters) => void;
  t: (key: string, fallback?: string) => string;
}) {
  const toggleFilter = (filterKey: keyof UnitFilters, value: string) => {
    const current = filters[filterKey];
    const updated = current.includes(value as any)
      ? current.filter((entry) => entry !== value)
      : [...current, value as any];

    onChange({
      ...filters,
      [filterKey]: updated,
    });
  };

  const clearAll = () => {
    onChange({ status: [] });
  };

  const hasActiveFilters = filters.status.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.05 }}
      className="flex h-full flex-col space-y-6 overflow-y-auto bg-layer-panel p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display text-transform-primary font-semibold text-foreground">{t('filter', 'filters')}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 text-xs text-primary"
          >
            {t('clear', 'clear')}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
          {t('table_status', 'status')}
        </p>
        <div className="space-y-2">
          {['active', 'inactive'].map((status) => {
            const selected = filters.status.includes(status as UnitStatus);

            return (
              <motion.button
                key={status}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => toggleFilter("status", status)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-body text-transform-secondary ${selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40"
                  }`}
              >
                <span>{t(`status_${status}`, status)}</span>
                {selected && <Check className="h-3.5 w-3.5" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

interface UnitTableExpandedProps {
  units: Unit[];
  loading: boolean;
  filters?: UnitFilters;
  onFilterChange?: (filters: UnitFilters) => void;
  currentPage?: number;
  pageSize?: number;
  totalRecords?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  isFilterActive?: boolean;
  onToggleFilters?: () => void;
  className?: string;
  t: (key: string, fallback?: string) => string;
  lang: string;
}

export function UnitTableExpanded({
  units = [],
  loading,
  filters: filtersProp,
  onFilterChange,
  currentPage = 1,
  pageSize = 10,
  totalRecords = units.length,
  totalPages: totalPagesProp,
  onPageChange,
  onPageSizeChange,
  isFilterActive,
  onToggleFilters,
  className,
  t,
  lang,
}: UnitTableExpandedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [internalFilters, setInternalFilters] = useState<UnitFilters>({ status: [] });
  const [internalShowFilters, setInternalShowFilters] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    symbol: true,
    precision: true,
  });
  const [tempCols, setTempCols] = useState<Record<string, boolean>>({ ...visibleCols });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const filters = filtersProp ?? internalFilters;
  const showFilters = isFilterActive ?? internalShowFilters;

  const handleFilterChange = (newFilters: UnitFilters) => {
    if (onFilterChange) onFilterChange(newFilters);
    setInternalFilters(newFilters);
  };

  const handleToggleFilters = () => {
    if (onToggleFilters) {
      onToggleFilters();
    } else {
      setInternalShowFilters(current => !current);
    }
  };

  const filteredUnits = useMemo(() => {
    if (totalRecords > units.length) {
      return units;
    }

    return units.filter((u) => {
      const lowerQuery = searchQuery.toLowerCase();

      const matchSearch =
        u.name.toLowerCase().includes(lowerQuery) ||
        u.abbreviation.toLowerCase().includes(lowerQuery) ||
        u.id.toLowerCase().includes(lowerQuery);

      const matchStatus =
        filters.status.length === 0 || filters.status.includes(u.status);

      return matchSearch && matchStatus;
    });
  }, [units, searchQuery, filters.status, totalRecords]);

  const totalPages = Math.max(1, totalPagesProp ?? Math.ceil(totalRecords / pageSize));

  const paginatedUnits = useMemo(() => {
    if (totalRecords > units.length) {
      return units;
    }
    const start = (currentPage - 1) * pageSize;
    return filteredUnits.slice(start, start + pageSize);
  }, [filteredUnits, currentPage, pageSize, totalRecords, units]);

  const activeFilters = filters.status.length;
  const hasActiveFilter = activeFilters > 0 || searchQuery.trim() !== "";

  const pageNumbers: (number | string)[] = [];
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i);
  } else {
    pageNumbers.push(1);
    if (currentPage > 3) pageNumbers.push('...');
    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pageNumbers.push(i);
    if (currentPage < totalPages - 2) pageNumbers.push('...');
    pageNumbers.push(totalPages);
  }

  if (loading) {
    return (
      <main className={cn('w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:max(var(--table-border-width,var(--card-border-width,1px)),1px)] rounded-[length:max(var(--table-border-radius,var(--radius-card,8px)),8px)] flex flex-col min-h-[500px] items-center justify-center', className)}>
        <p className="font-body text-transform-secondary text-muted-foreground">{t('loading', 'loading units...')}</p>
      </main>
    );
  }

  return (
    <main className={cn("w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:max(var(--table-border-width,var(--card-border-width,1px)),1px)] rounded-[length:max(var(--table-border-radius,var(--radius-card,8px)),8px)] flex flex-col min-h-[500px]", className)}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:max(var(--table-toolbar-height,4.5rem),4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {hasActiveFilter && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {filteredUnits.length} {t('of', 'of')} {totalRecords} {t('units_matched', 'records matched criteria.')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'search units...')}
              value={searchQuery}
              onChange={(event) => {
                setSearchQuery(event.target.value);
                onPageChange?.(1);
              }}
              className="font-body text-transform-secondary text-sm"
            />
          </div>
          <Button
            variant={showFilters ? "primary" : "outline"}
            size="sm"
            onClick={handleToggleFilters}
            className="relative h-[var(--input-height,var(--button-height,48px))] px-6"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs text-transform-primary">{t('filter', 'filters')}</span>
            {activeFilters > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20">
                {activeFilters}
              </Badge>
            )}
          </Button>
          <Button variant="primary" size="sm" className="h-[var(--input-height,var(--button-height,48px))] px-6">
            <span className="font-display font-medium text-xs text-transform-primary">{t('btn_add', 'add unit')}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <AnimatePresence initial={false}>
          {showFilters && !isFilterActive && (
            <motion.div
              key="filters"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-r border-border bg-layer-panel w-72 flex-shrink-0 flex"
            >
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 flex flex-col bg-layer-cover overflow-auto min-w-0">
          <div className="flex-1 rounded-none border-0 block min-w-max">
            <Table className="w-full relative bg-transparent border-collapse min-w-max">
              <TableHeader className="bg-layer-panel top-0 z-10 sticky border-b border-border shadow-sm h-12">
                <TableRow className="border-b-0 hover:bg-transparent">
                  <TableHead className="w-12 px-7 bg-layer-panel"></TableHead>

                   {/* 1. Name (Fixed) */}
                  <TableHead className="min-w-40 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_name', 'name')}</TableHead>

                  {/* 2. Symbol (Default) */}
                  {visibleCols.symbol && <TableHead className="w-32 text-center bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_symbol', 'symbol')}</TableHead>}

                  {/* 3. Precision (Default) */}
                  {visibleCols.precision && <TableHead className="w-32 text-center bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_precision', 'precision')}</TableHead>}

                  {/* 4. Status (Fixed) */}
                  <TableHead className="w-32 text-center bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_status', 'status')}</TableHead>

                  {/* 5. Actions (Fixed) */}
                  <TableHead className="w-24 pr-7 text-right sticky right-0 z-20 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] border-l border-border bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">
                    <div className="flex items-center justify-end gap-2">
                      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button onClick={() => setTempCols(visibleCols)} variant="ghost" size="sm" className="h-6 w-6 p-0 bg-surface hover:bg-surface-variant border border-border">
                            <Plus className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-0 bg-surface shadow-2xl border border-outline rounded-xl" align="end" sideOffset={8}>
                          <div className="p-3 border-b border-border">
                            <p className="font-dev text-[10px] text-muted-foreground font-semibold tracking-wide">{t('select_columns', 'select columns')}</p>
                          </div>
                          <div className="px-3 py-3 flex flex-col gap-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="col-symbol" checked={tempCols.symbol} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, symbol: !!c }))} />
                              <label htmlFor="col-symbol" className="text-sm font-medium leading-none cursor-pointer text-transform-secondary font-body">{t('table_symbol', 'symbol')}</label>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Checkbox id="col-precision" checked={tempCols.precision} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, precision: !!c }))} />
                              <label htmlFor="col-precision" className="text-sm font-medium leading-none cursor-pointer text-transform-secondary font-body">{t('table_precision', 'precision')}</label>
                            </div>
                          </div>
                          <div className="p-2 border-t border-border flex justify-end gap-3 items-center">
                            <button onClick={() => setTempCols({ symbol: true, precision: true })} className="text-[10px] font-dev text-muted-foreground font-semibold tracking-wide hover:text-foreground">{t('btn_reset', 'reset')}</button>
                            <button onClick={() => { setVisibleCols(tempCols); setIsPopoverOpen(false); }} className="text-[10px] font-dev text-foreground font-semibold tracking-wide hover:opacity-80">{t('btn_apply', 'apply')}</button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {paginatedUnits.length > 0 ? (
                    paginatedUnits.map((u) => (
                      <UnitRow
                        key={u.id}
                        unit={u}
                        expanded={expandedId === u.id}
                        onToggle={() =>
                          setExpandedId((current) =>
                            current === u.id ? null : u.id
                          )
                        }
                        visibleCols={visibleCols}
                        t={t}
                        lang={lang}
                      />
                    ))
                  ) : (
                    <TableRow className="hover:bg-transparent border-0">
                      <TableCell colSpan={10} className="h-96 text-center p-12">
                        <motion.div
                          key="empty-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="font-body text-transform-secondary text-muted-foreground">
                            {t('no_data', 'zero units match your filters.')}
                          </p>
                        </motion.div>
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      <div className="border-t border-border bg-layer-panel px-7 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground font-body text-transform-secondary">
          <div className="flex items-center gap-2">
            <span className="text-transform-secondary">{t('show', 'show')}</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => onPageSizeChange?.(parseInt(val, 10))}
            >
              <SelectTrigger size="sm" className="w-20 font-medium font-body text-transform-secondary bg-layer-panel text-on-surface hover:bg-layer-dialog">
                <SelectValue placeholder={pageSize >= 9999 ? t('all', 'all') : pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="9999">{t('all', 'all')}</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-transform-secondary">{t('records_per_table', 'units per page')}</span>
          </div>
          <Pagination className="mx-0 w-auto m-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                  className={cn(
                    'h-8 px-3 font-body text-transform-secondary',
                    currentPage === 1 && 'pointer-events-none opacity-40'
                  )}
                />
              </PaginationItem>

              {pageNumbers.map((page, idx) => (
                <PaginationItem key={idx}>
                  {page === '...' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      isActive={currentPage === page}
                      onClick={() => onPageChange?.(page as number)}
                      className="h-8 w-8 font-body cursor-pointer"
                    >
                      {page}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() => onPageChange?.(Math.min(totalPages, currentPage + 1))}
                  className={cn(
                    'h-8 px-3 font-body text-transform-secondary',
                    currentPage === totalPages && 'pointer-events-none opacity-40'
                  )}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
