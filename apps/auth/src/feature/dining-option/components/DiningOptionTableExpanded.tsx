'use client';

import { useMemo, useState } from 'react';
import { ChevronDown, Filter, Check, Eye, Edit, Trash2 } from 'lucide-react';
import { cn } from 'zap-design/src/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { QuickActionsDropdown } from 'zap-design/src/genesis/molecules/quick-actions-dropdown';
import { Avatar, AvatarImage, AvatarFallback } from 'zap-design/src/genesis/atoms/interactive/avatar';

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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'zap-design/src/genesis/atoms/interactive/select';
import { Popover, PopoverContent, PopoverTrigger } from 'zap-design/src/genesis/molecules/popover';
import { DiningOption } from '../models/dining-option.model';

function DiningOptionRow({
  diningOption,
  expanded,
  onToggle,
  t,
}: {
  diningOption: DiningOption;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
}) {
  const createdDate = new Date(diningOption.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <TableRow onClick={onToggle} className="cursor-pointer">
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
          {diningOption.id}
        </TableCell>

        {/* image */}
        <TableCell className="w-20 py-4 flex justify-center">
          <Avatar size="sm">
            {diningOption.image && <AvatarImage src={diningOption.image} alt={diningOption.name} />}
            <AvatarFallback>{diningOption.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </TableCell>

        {/* name */}
        <TableCell className="min-w-[200px] whitespace-nowrap text-left py-4 font-medium text-[11px]">
          {diningOption.name}
        </TableCell>

        {/* type */}
        <TableCell className="w-28 whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[11px]">
          {diningOption.type}
        </TableCell>

        {/* hours */}
        <TableCell className="w-32 whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[11px]">
          {diningOption.availableHours}
        </TableCell>

        {/* status */}
        <TableCell className="w-28 whitespace-nowrap py-4">
          <Pill variant={diningOption.status === 'active' ? 'success' : diningOption.status === 'inactive' ? 'warning' : 'error'} className="min-w-16 block text-center text-[10px]">
            {diningOption.status}
          </Pill>
        </TableCell>

        {/* actions */}
        <TableCell className="w-16 whitespace-nowrap text-right py-4" onClick={(e) => e.stopPropagation()}>
          <QuickActionsDropdown
            actions={[
              {
                label: t('action_view', 'View'),
                icon: Eye,
                onClick: () => console.log('View', diningOption.id),
              },
              {
                label: t('action_edit', 'Edit'),
                icon: Edit,
                onClick: () => console.log('Edit', diningOption.id),
              },
              {
                label: t('action_delete', 'Delete'),
                icon: Trash2,
                variant: 'destructive',
                onClick: () => console.log('Delete', diningOption.id),
              },
            ]}
          />
        </TableCell>
      </TableRow>

      {expanded && (
        <TableRow>
            <TableCell colSpan={8} className="bg-layer-2/30 p-4 border-t border-outline/5 px-24 py-8">
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              <div>
                <p className="text-xs font-semibold text-on-surface-variant uppercase">
                  {t('description', 'Description')}
                </p>
                <p className="text-sm text-on-surface">{diningOption.description}</p>
              </div>
              {diningOption.minOrderValue !== undefined && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase">
                    {t('min_order', 'Min Order')}
                  </p>
                  <p className="text-sm text-on-surface">${diningOption.minOrderValue}</p>
                </div>
              )}
              {diningOption.maxCapacity !== undefined && (
                <div>
                  <p className="text-xs font-semibold text-on-surface-variant uppercase">
                    {t('max_capacity', 'Max Capacity')}
                  </p>
                  <p className="text-sm text-on-surface">{diningOption.maxCapacity} people</p>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

export type DiningOptionFilters = {
  status: string[];
};

function DiningOptionFilterPanel({
  filters,
  onChange,
  diningOptions,
  t,
}: {
  filters: DiningOptionFilters;
  onChange: (filters: DiningOptionFilters) => void;
  diningOptions: DiningOption[];
  t: (key: string, fallback?: string) => string;
}) {
  const statuses = Array.from(new Set(diningOptions.map((d) => d.status))).sort();

  const handleStatusChange = (value: string) => {
    onChange({
      status: value === 'all' ? [] : [value],
    });
  };

  const clearAll = () => {
    onChange({
      status: [],
    });
  };

  const hasActiveFilters = filters.status.length > 0;

  return (
    <div className="flex flex-col space-y-6 h-full p-1 w-full">
      <div className="flex items-center justify-between border-b border-border/50 pb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold text-foreground uppercase tracking-wider">{t('filter', 'Filters')}</h3>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-8 text-xs text-primary hover:bg-primary/5 px-2 font-medium"
          >
            {t('clear_all', 'Clear all')}
          </Button>
        )}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
            {t('status', 'Status')}
          </label>
          <Select 
            value={filters.status[0] || 'all'} 
            onValueChange={handleStatusChange}
          >
            <SelectTrigger className="w-full bg-layer-2/50 border-outline/10 h-11 px-3 text-sm rounded-lg transition-all hover:border-primary/30">
              <SelectValue placeholder={t('all_statuses', 'All Statuses')} />
            </SelectTrigger>
            <SelectContent className="bg-layer-panel border-outline/20">
              <SelectItem value="all">{t('all_statuses', 'All Statuses')}</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status} className="capitalize">
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div className="mt-auto pt-6 border-t border-border/10">
        <p className="text-[10px] text-muted-foreground/40 text-center italic leading-relaxed">
          Dining options will be filtered instantly based on your selection.
        </p>
      </div>
    </div>
  );
}

interface DiningOptionTableExpandedProps {
  diningOptions: DiningOption[];
  loading: boolean;
  totalRecords: number;
  currentPage: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  t: (key: string, fallback?: string) => string;
  lang: string;
  className?: string;
}

export function DiningOptionTableExpanded({
  diningOptions,
  loading,
  totalRecords,
  currentPage,
  pageSize,
  onPageChange,
  onPageSizeChange,
  t,
  className,
}: DiningOptionTableExpandedProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<DiningOptionFilters>({
    status: [],
  });

  const toggleExpanded = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };


  const filteredOptions = useMemo(() => {
    return diningOptions.filter((opt) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch =
        opt.name.toLowerCase().includes(lowerQuery) ||
        opt.type.toLowerCase().includes(lowerQuery);
      
      const matchStatus =
        filters.status.length === 0 || filters.status.includes(opt.status);
      
      return matchSearch && matchStatus;
    });
  }, [diningOptions, searchQuery, filters]);

  const activeFilters = filters.status.length;
  const hasActiveFilter = activeFilters > 0 || searchQuery.trim() !== '';

  const totalPages = Math.ceil(totalRecords / pageSize);

  const paginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      items.push(1);
      if (currentPage > 3) items.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) {
        items.push(i);
      }
      if (currentPage < totalPages - 2) items.push('...');
      items.push(totalPages);
    }

    return items;
  }, [currentPage, totalPages]);

  return (
    <div className={cn('flex flex-col h-full overflow-hidden', className)}>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-2 px-5 gap-3 border-b border-border bg-layer-panel min-h-[3rem] flex-shrink-0">
        <div className="flex items-center h-8">
          {hasActiveFilter && (
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {filteredOptions.length} {t('of', 'of')} {totalRecords} {t('options_matched', 'options matched.')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'Quick search...')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="text-sm"
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className={cn(
              "relative h-10 px-4",
              showFilters && "bg-primary/10 border-primary/30 text-primary"
            )}
          >
            <Filter className={cn("h-4 w-4 mr-2", showFilters && "text-primary")} />
            <span className="text-xs font-medium">{t('filter', 'Filter')}</span>
            {activeFilters > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground">
                {activeFilters}
              </Badge>
            )}
          </Button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 flex flex-col bg-layer-cover min-w-0">
          <div className="flex-1 overflow-y-auto">
        <Table>
              <TableHeader className="bg-layer-panel top-0 z-10 sticky border-b border-border shadow-sm h-12">
                <TableRow className="border-b-0 hover:bg-transparent">
                  <TableHead className="w-10 text-center bg-layer-panel h-12"></TableHead>
                  <TableHead className="w-20 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>id</TableHead>
                  <TableHead className="w-20 text-center bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>image</TableHead>
                  <TableHead className="text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>name</TableHead>
                  <TableHead className="w-28 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>type</TableHead>
                  <TableHead className="w-32 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>hours</TableHead>
                  <TableHead className="w-28 text-center bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>status</TableHead>
                  <TableHead className="w-16 text-right bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>actions</TableHead>
                </TableRow>
              </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-20">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-6 w-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    <p className="text-on-surface-variant/60 text-xs font-medium">{t('loading', 'Loading...')}</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredOptions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-64 text-center py-8">
                  <motion.div
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <p className="text-muted-foreground">{t('no_data', 'No options match your filters.')}</p>
                  </motion.div>
                </TableCell>
              </TableRow>
            ) : (
              filteredOptions.map((opt) => (
                <DiningOptionRow
                  key={opt.id}
                  diningOption={opt}
                  expanded={expandedRows.has(opt.id)}
                  onToggle={() => toggleExpanded(opt.id)}
                  t={t}
                />
              ))
            )}
          </TableBody>
        </Table>
          </div>
        </div>

        <AnimatePresence initial={false}>
          {showFilters && (
            <motion.div
              key="filters"
              initial={{ width: 0, opacity: 0 }}
              animate={{ width: 288, opacity: 1 }}
              exit={{ width: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-l border-border bg-layer-panel w-72 flex-shrink-0 flex pt-4 px-4"
            >
              <DiningOptionFilterPanel
                filters={filters}
                onChange={setFilters}
                diningOptions={diningOptions}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="border-t border-border bg-layer-panel px-7 py-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-on-surface/60 font-body">
              <span>{t('show')}</span>
              <Select value={pageSize.toString()} onValueChange={(v) => onPageSizeChange(parseInt(v, 10))}>
                <SelectTrigger size="sm" className="w-16 h-8 bg-transparent border-0 hover:bg-layer-canvas ring-0 focus:ring-0 px-2 font-medium text-on-surface">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent className="bg-layer-canvas border-outline">
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span>{t('records_per_table')}</span>
            </div>

            <div className="flex items-center">
              <Pagination>
                <PaginationContent className="bg-secondary/10 border border-outline-variant rounded-full px-1.5 h-10 gap-1 shadow-sm">
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                      className={cn(
                        'h-8 px-3 rounded-full hover:bg-layer-canvas text-on-surface/80 hover:text-on-surface lowercase font-body transition-colors',
                        currentPage === 1 && 'pointer-events-none opacity-40'
                      )}
                    >
                      {t('previous')}
                    </PaginationPrevious>
                  </PaginationItem>

                  {paginationItems.map((item, idx) =>
                    item === '...' ? (
                      <PaginationItem key={`ellipsis-${idx}`}>
                        <PaginationEllipsis className="h-8 w-8 text-on-surface/40" />
                      </PaginationItem>
                    ) : (
                      <PaginationItem key={item}>
                        <PaginationLink
                          isActive={currentPage === item}
                          onClick={() => onPageChange(item as number)}
                          className={cn(
                            'h-8 w-8 rounded-full font-body transition-all',
                            currentPage === item
                              ? 'bg-primary text-on-primary shadow-sm scale-105'
                              : 'text-on-surface/60 hover:bg-layer-canvas hover:text-on-surface'
                          )}
                        >
                          {item}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                      className={cn(
                        'h-8 px-3 rounded-full hover:bg-layer-canvas text-on-surface/80 hover:text-on-surface lowercase font-body transition-colors',
                        currentPage === totalPages && 'pointer-events-none opacity-40'
                      )}
                    >
                      {t('next')}
                    </PaginationNext>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
