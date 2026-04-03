'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Eye, Edit, Trash2, Check, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from 'zap-design/src/lib/utils';

import { Badge } from 'zap-design/src/genesis/atoms/interactive/badge';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from 'zap-design/src/genesis/atoms/interactive/select';
import { QuickActionsDropdown } from 'zap-design/src/genesis/molecules/quick-actions-dropdown';
import type { ModifierGroup, ModifierGroupStatus } from '../models/modifier-group.model';

export type ModifierGroupFilters = {
  status: ModifierGroupStatus[];
};

// ─── ModifierGroupRow ─────────────────────────────────────────────────────────────

function ModifierGroupRow({
  group,
  expanded,
  onToggle,
  t,
}: {
  group: ModifierGroup;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
}) {
  const pillVariant = group.status === 'active' ? 'success' : 'error';

  return (
    <>
      <TableRow
        onClick={onToggle}
        className="cursor-pointer group hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b border-border/50 group-last:border-0"
      >
        {/* expand icon */}
        <TableCell className="w-10 text-center py-4">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="inline-flex"
          >
            <ChevronDown className="h-3 w-3 text-muted-foreground" />
          </motion.div>
        </TableCell>

        {/* id */}
        <TableCell className="w-20 whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[11px]">
          {group.id}
        </TableCell>

        {/* name */}
        <TableCell className="w-full min-w-[200px] whitespace-nowrap text-left py-4 font-medium text-[11px]">
          {group.name}
        </TableCell>

        {/* min/max select */}
        <TableCell className="w-48 whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[11px]">
          {group.minSelect} - {group.maxSelect} {t('selection', 'selection')}
        </TableCell>

        {/* options count */}
        <TableCell className="w-32 whitespace-nowrap text-center py-4 font-dev text-muted-foreground text-[11px]">
          {group.options?.length || 0} {t('options', 'options')}
        </TableCell>

        {/* status */}
        <TableCell className="w-28 whitespace-nowrap py-4">
          <Pill variant={pillVariant} className="min-w-16 block text-center text-[10px]">
            {group.status === 'active' ? 'Active' : 'Inactive'}
          </Pill>
        </TableCell>

        {/* actions */}
        <TableCell className="w-16 whitespace-nowrap text-right py-4 sticky right-0 bg-layer-canvas group-hover:bg-surface-variant/50 transition-colors z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]" onClick={(e) => e.stopPropagation()}>
          <QuickActionsDropdown
            actions={[
              { label: t('action_view', 'View'), icon: Eye, onClick: () => console.log('View', group.id) },
              { label: t('action_edit', 'Edit'), icon: Edit, onClick: () => console.log('Edit', group.id) },
              { label: t('action_delete', 'Delete'), icon: Trash2, variant: 'destructive', onClick: () => console.log('Delete', group.id) },
            ]}
          />
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0">
            <TableCell colSpan={8} className="p-0 border-b-0 h-0 border-t-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-layer-panel border-t border-border"
              >
                <div className="space-y-4 px-7 py-4 border-b border-border">
                  {group.description && (
                    <div>
                      <p className="mb-2 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        Description
                      </p>
                      <p className="rounded-[length:var(--table-border-radius,var(--radius-card,8px))] bg-layer-cover p-3 font-dev text-foreground border border-[length:var(--table-border-width,var(--card-border-width,1px))] border-outline-variant/30">
                        {group.description}
                      </p>
                    </div>
                  )}
                  <div className="font-dev">
                    <p className="mb-2 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                      Modifier Options ({group.options?.length || 0})
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                       {group.options?.map((opt) => (
                         <div key={opt.id} className="flex items-center justify-between p-2 rounded-md bg-layer-cover border border-outline-variant/30 text-[10px]">
                            <span className="font-medium text-foreground">{opt.name}</span>
                            <span className="text-muted-foreground">${opt.price}</span>
                         </div>
                       ))}
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

// ─── FilterPanel ─────────────────────────────────────────────────────────────

function FilterPanel({
  filters,
  onChange,
  t,
}: {
  filters: ModifierGroupFilters;
  onChange: (filters: ModifierGroupFilters) => void;
  t: (key: string, fallback?: string) => string;
}) {

  const toggleFilter = (value: ModifierGroupStatus) => {
    const updated = filters.status.includes(value)
      ? filters.status.filter((entry) => entry !== value)
      : [...filters.status, value];
    onChange({ status: updated });
  };

  const clearAll = () => onChange({ status: [] });
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
        <h3 className="text-sm font-display text-transform-primary font-semibold text-foreground">
          {t('filter', 'Filters')}
        </h3>
        {hasActiveFilters && (
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 text-xs text-primary font-display font-medium text-transform-primary">
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
          {t('table_status', 'Status')}
        </p>
        <div className="space-y-2">
          {(['active', 'inactive'] as ModifierGroupStatus[]).map((status) => {
            const selected = filters.status.includes(status);
            return (
              <motion.button
                key={status}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => toggleFilter(status)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-dev text-transform-tertiary ${
                  selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40'
                }`}
              >
                <span className="capitalize">{status}</span>
                {selected && <Check className="h-3.5 w-3.5" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── ModifierGroupTableExpanded ────────────────────────────────────────────────────

interface ModifierGroupTableExpandedProps {
  modifierGroups: ModifierGroup[];
  loading: boolean;
  filters?: ModifierGroupFilters;
  onFilterChange?: (filters: ModifierGroupFilters) => void;
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

export function ModifierGroupTableExpanded({
  modifierGroups = [],
  loading,
  filters: filtersProp,
  onFilterChange,
  currentPage = 1,
  pageSize = 10,
  totalRecords = modifierGroups.length,
  totalPages: totalPagesProp,
  onPageChange,
  onPageSizeChange,
  isFilterActive,
  onToggleFilters,
  className,
  t,
  lang,
}: ModifierGroupTableExpandedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [internalFilters, setInternalFilters] = useState<ModifierGroupFilters>({ status: [] });
  const [internalShowFilters, setInternalShowFilters] = useState(false);

  const filters = filtersProp ?? internalFilters;
  const showFilters = isFilterActive ?? internalShowFilters;

  const handleFilterChange = (newFilters: ModifierGroupFilters) => {
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

  const filteredGroups = useMemo(() => {
    return modifierGroups.filter((group) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch = group.name.toLowerCase().includes(lowerQuery);
      const matchStatus = filters.status.length === 0 || filters.status.includes(group.status);
      return matchSearch && matchStatus;
    });
  }, [filters, searchQuery, modifierGroups]);

  const totalPages = totalPagesProp ?? Math.ceil(filteredGroups.length / pageSize);
  const displayGroups = totalPagesProp ? modifierGroups : filteredGroups.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeFilters = filters.status.length;
  const hasActiveFilter = activeFilters > 0 || searchQuery.trim() !== '';

  if (loading) {
    return (
      <main className={cn('w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px] items-center justify-center', className)}>
        <p className="font-body text-transform-secondary text-muted-foreground">Loading modifier groups...</p>
      </main>
    );
  }

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

  return (
    <main className={cn('w-full bg-layer-canvas flex flex-col border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] border-outline-variant overflow-visible', className)}>
      <div className={cn('hidden', lang)} />

      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {hasActiveFilter && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {filteredGroups.length} of {modifierGroups.length} records matched criteria.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'Search modifier groups...')}
              value={searchQuery}
              onChange={(event) => {
                const query = event.target.value;
                setSearchQuery(query);
                onPageChange?.(1);
              }}
              className="font-body text-transform-secondary text-sm"
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="sm"
            onClick={handleToggleFilters}
            className="relative h-[var(--input-height,var(--button-height,48px))] px-6"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs text-transform-primary">
              {t('filter', 'Filter')}
            </span>
            {activeFilters > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground z-20">
                {activeFilters}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex overflow-visible">
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

        <div className="flex-1 flex flex-col bg-layer-cover overflow-hidden min-w-0">
          <div className="flex-1 overflow-auto rounded-none border-0 overflow-y-visible">
            <Table className="w-full relative bg-transparent">
              <TableHeader className="bg-layer-panel top-0 z-10 sticky border-b border-border shadow-sm h-12">
                <TableRow className="border-b-0 hover:bg-transparent">
                  <TableHead className="w-10 text-center bg-layer-panel h-12"></TableHead>
                  <TableHead className="w-20 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>id</TableHead>
                  <TableHead className="text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>modifier_group_name</TableHead>
                  <TableHead className="w-48 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>selection</TableHead>
                  <TableHead className="w-32 text-center bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>options</TableHead>
                  <TableHead className="w-28 text-center bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>status</TableHead>
                  <TableHead className="w-16 text-right bg-layer-panel font-display font-semibold text-[10px] h-12 sticky right-0 z-30 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)]" style={{ textTransform: 'lowercase' }}>actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {displayGroups.length > 0 ? (
                    displayGroups.map((group) => (
                      <ModifierGroupRow
                        key={group.id}
                        group={group}
                        expanded={expandedId === group.id}
                        onToggle={() =>
                          setExpandedId((current) =>
                            current === group.id ? null : group.id
                          )
                        }
                        t={t}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="h-48 text-center p-12">
                        <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <p className="font-body text-transform-secondary text-muted-foreground">
                            {t('no_data', 'No modifier groups match your filters.')}
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

      {/* Footer */}
      <div className="border-t border-border bg-layer-panel px-7 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground font-body text-transform-secondary">
          <div className="flex items-center gap-2">
            <span className="text-transform-secondary">{t('show', 'Show')}</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => onPageSizeChange?.(parseInt(val, 10))}
            >
              <SelectTrigger size="sm" className="w-20 font-medium font-body bg-layer-panel text-on-surface hover:bg-layer-dialog">
                <SelectValue placeholder={pageSize >= 9999 ? t('all', 'All') : pageSize.toString()}>
                  {pageSize >= 9999 ? t('all', 'All') : pageSize.toString()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="9999">{t('all', 'All')}</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-transform-secondary">{t('records_per_table', 'records per table')}</span>
          </div>

          <Pagination className="mx-0 w-auto m-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                  className={cn(
                    'h-8 px-3 font-body text-transform-secondary lowercase',
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
                      className="h-8 w-8 font-body"
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
                    'h-8 px-3 font-body text-transform-secondary lowercase',
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
