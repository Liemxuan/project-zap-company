'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from 'zap-design/src/lib/utils';

import { Badge } from 'zap-design/src/genesis/atoms/interactive/badge';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import { Avatar, AvatarImage, AvatarFallback } from 'zap-design/src/genesis/atoms/interactive/avatar';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from 'zap-design/src/genesis/molecules/popover';
import { Plus } from 'lucide-react';
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
import type { Category } from '../models/category.model';

export type CategoryFilters = {
  status: string[];
};

// ─── CategoryRow ─────────────────────────────────────────────────────────────

function CategoryRow({
  category,
  expanded,
  onToggle,
  t,
  visibleCols,
}: {
  category: Category;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
  visibleCols: Record<string, boolean>;
}) {
  const pillVariant = category.is_active ? 'success' : 'error';

  return (
    <>
      <TableRow
        onClick={onToggle}
        className="cursor-pointer group hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b border-border/50 group-last:border-0"
      >
        {/* expand icon */}
        <TableCell className="px-7 w-12 py-2.5">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-4 cursor-pointer"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </TableCell>

        {/* id */}
        <TableCell className="w-16 whitespace-nowrap text-left py-2.5 font-dev text-muted-foreground text-[10px]">
          {category.id}
        </TableCell>

        {/* image */}
        <TableCell className="w-20 py-4 flex justify-center">
          <Avatar size="sm">
            {category.icon_url && <AvatarImage src={category.icon_url} alt={category.name} />}
            <AvatarFallback>{category.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </TableCell>

        {/* category_name (3) */}
        <TableCell className="min-w-40 whitespace-nowrap text-left py-2.5 px-4">
          <span className="font-display font-bold text-foreground text-sm block">{category.name}</span>
        </TableCell>

        {/* item (4) */}
        {visibleCols.item && (
          <TableCell className="w-32 whitespace-nowrap text-center py-4 text-muted-foreground text-sm font-body">
            {category.item_count}
          </TableCell>
        )}

        {/* status (5) */}
        <TableCell className="w-28 whitespace-nowrap py-4">
          <Pill variant={pillVariant} className="min-w-16 block text-center text-[10px]">
            {category.is_active ? t('status_active', 'Active') : t('status_inactive', 'Inactive')}
          </Pill>
        </TableCell>

        {/* actions (6) */}
        <TableCell className="w-16 whitespace-nowrap text-right py-4 sticky right-0 z-10 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.12)] border-l border-border bg-layer-cover group-hover:bg-surface-variant/50 transition-colors" onClick={(e) => e.stopPropagation()}>
          <QuickActionsDropdown
            actions={[
              { label: t('action_view', 'View'), icon: Eye, onClick: () => console.log('View', category.id) },
              { label: t('action_edit', 'Edit'), icon: Edit, onClick: () => console.log('Edit', category.id) },
              { label: t('action_delete', 'Delete'), icon: Trash2, variant: 'destructive', onClick: () => console.log('Delete', category.id) },
            ]}
          />
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0">
            <TableCell colSpan={5 + (visibleCols.item ? 1 : 0)} className="p-0 border-b-0 h-0 border-t-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-layer-panel border-t border-border"
              >
                <div className="space-y-4 px-7 py-4 border-b border-border">
                  {category.materialized_path && (
                    <div>
                      <p className="mb-2 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        Path
                      </p>
                      <p className="rounded-[length:var(--table-border-radius,var(--radius-card,8px))] bg-layer-cover p-3 font-dev text-foreground border border-[length:var(--table-border-width,var(--card-border-width,1px))] border-outline-variant/30">
                        {category.materialized_path}
                      </p>
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-4 font-dev">
                    {category.parent_id && (
                      <div>
                        <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                          {t('table_parent_id', 'Parent ID')}
                        </p>
                        <p className="text-foreground text-xs font-mono">{category.parent_id}</p>
                      </div>
                    )}
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_item', 'Items')}
                      </p>
                      <p className="text-foreground">{category.item_count}</p>
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
  categories,
  t,
}: {
  filters: CategoryFilters;
  onChange: (filters: CategoryFilters) => void;
  categories: Category[];
  t: (key: string, fallback?: string) => string;
}) {

  const toggleFilter = (value: string) => {
    const updated = filters.status.includes(value)
      ? filters.status.filter((entry) => entry !== value)
      : [...filters.status, value];
    onChange({ status: updated });
  };

  const clearAll = () => onChange({ status: [] });
  const hasActiveFilters = Object.values(filters).some((g) => g.length > 0);

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
          <Button variant="ghost" size="sm" onClick={clearAll} className="h-6 text-xs text-primary">
            {t('clear', 'Clear')}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
          {t('table_status', 'Status')}
        </p>
        <div className="space-y-2">
          {['Active', 'Inactive'].map((status) => {
            const selected = filters.status.includes(status);
            return (
              <motion.button
                key={status}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => toggleFilter(status)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-dev text-transform-tertiary ${selected
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40'
                  }`}
              >
                <span className="capitalize">{t(`status_${status.toLowerCase()}`, status)}</span>
                {selected && <Check className="h-3.5 w-3.5" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

// ─── CategoryTableExpanded ────────────────────────────────────────────────────

interface CategoryTableExpandedProps {
  categories: Category[];
  loading: boolean;
  filters?: CategoryFilters;
  onFilterChange?: (filters: CategoryFilters) => void;
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

export function CategoryTableExpanded({
  categories = [],
  loading,
  filters: filtersProp,
  onFilterChange,
  currentPage = 1,
  pageSize = 10,
  totalRecords = categories.length,
  totalPages: totalPagesProp,
  onPageChange,
  onPageSizeChange,
  isFilterActive,
  onToggleFilters,
  className,
  t,
  lang,
}: CategoryTableExpandedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [internalFilters, setInternalFilters] = useState<CategoryFilters>({ status: [] });
  const [internalShowFilters, setInternalShowFilters] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    item: true,
  });
  const [tempCols, setTempCols] = useState<Record<string, boolean>>({ ...visibleCols });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const filters = filtersProp ?? internalFilters;
  const showFilters = isFilterActive ?? internalShowFilters;

  const handleFilterChange = (newFilters: CategoryFilters) => {
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

  const filteredCategories = useMemo(() => {
    return categories.filter((category) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch = category.name.toLowerCase().includes(lowerQuery);
      const categoryStatus = category.is_active ? 'Active' : 'Inactive';
      const matchStatus =
        filters.status.length === 0 || filters.status.includes(categoryStatus);
      return matchSearch && matchStatus;
    });
  }, [filters, searchQuery, categories]);

  const totalPages = Math.max(1, totalPagesProp ?? Math.ceil(filteredCategories.length / pageSize));

  // For client-side fallback if no totalPages is provided, we still slice
  // But if totalPages is provided, we assume the server already paginated
  const displayCategories = totalPagesProp ? categories : filteredCategories.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const activeFilters = filters.status.length;
  const hasActiveFilter = activeFilters > 0 || searchQuery.trim() !== '';

  if (loading) {
    return (
      <main className={cn('w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px] items-center justify-center', className)}>
        <p className="font-body text-transform-secondary text-muted-foreground">Loading categories...</p>
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
              {filteredCategories.length} {t('of', 'of')} {totalRecords} {t('categories_matched', 'records matched criteria.')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'Search categories by name...')}
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
              {t('filter', 'filter')}
            </span>
            {activeFilters > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs bg-destructive text-destructive-foreground z-20">
                {activeFilters}
              </Badge>
            )}
          </Button>

          <Button variant="primary" size="sm" className="h-[var(--input-height,var(--button-height,48px))] px-6">
            <span className="font-display font-medium text-xs text-transform-primary">
              {t('btn_add', 'add category')}
            </span>
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
                categories={categories}
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
                  <TableHead className="w-12 px-7 bg-layer-panel h-12"></TableHead>
                  <TableHead className="w-16 text-left bg-layer-panel font-display font-black text-[10px] h-12 text-transform-primary uppercase tracking-[0.1em]">{t('table_id', 'id')}</TableHead>
                  <TableHead className="w-16 text-center bg-layer-panel font-display font-black text-[10px] h-12 text-transform-primary uppercase tracking-[0.1em]">{t('table_image', 'image')}</TableHead>
                  <TableHead className="min-w-40 px-4 text-left bg-layer-panel font-display font-black text-[10px] h-12 text-transform-primary uppercase tracking-[0.1em]">{t('table_name', 'category name')}</TableHead>

                  {visibleCols.item && (
                    <TableHead className="w-32 text-center bg-layer-panel font-display font-black text-[10px] h-12 text-transform-primary uppercase tracking-[0.1em]">{t('table_item', 'item')}</TableHead>
                  )}

                  <TableHead className="w-28 text-center bg-layer-panel font-display font-black text-[10px] h-12 text-transform-primary uppercase tracking-[0.1em]">{t('table_status', 'status')}</TableHead>
                  <TableHead className="w-16 text-right bg-layer-panel font-display font-black text-[10px] h-12 sticky right-0 z-30 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] border-l border-border bg-layer-panel text-transform-primary group uppercase tracking-[0.1em]">
                    <div className="flex items-center justify-end w-full">
                      <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 bg-surface hover:bg-surface-variant border border-border"
                            onClick={() => setTempCols(visibleCols)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-56 p-0 bg-surface shadow-2xl border border-outline rounded-xl" align="end" sideOffset={8}>
                          <div className="p-3">
                            <p className="font-dev text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">{t('select_columns', 'Select Columns')}</p>
                          </div>
                          <div className="px-3 pb-3 flex flex-col gap-3">
                            <div className="flex items-center space-x-2">
                              <Checkbox id="col-item" checked={tempCols.item} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, item: !!c }))} />
                              <label htmlFor="col-item" className="text-sm font-medium leading-none cursor-pointer">{t('table_item', 'Item Count')}</label>
                            </div>
                          </div>
                          <div className="p-2 border-t border-border flex justify-end gap-3 items-center">
                            <button
                              onClick={() => setTempCols({ item: true })}
                              className="text-[10px] font-dev text-muted-foreground font-semibold uppercase tracking-wide hover:text-foreground"
                            >
                              {t('btn_reset', 'Reset')}
                            </button>
                            <button
                              onClick={() => { setVisibleCols(tempCols); setIsPopoverOpen(false); }}
                              className="text-[10px] font-dev text-foreground font-semibold uppercase tracking-wide hover:opacity-80"
                            >
                              {t('btn_apply', 'Apply')}
                            </button>
                          </div>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {displayCategories.length > 0 ? (
                    displayCategories.map((category) => (
                      <CategoryRow
                        key={category.id}
                        category={category}
                        expanded={expandedId === category.id}
                        onToggle={() =>
                          setExpandedId((current) =>
                            current === category.id ? null : category.id
                          )
                        }
                        t={t}
                        visibleCols={visibleCols}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5 + (visibleCols.item ? 1 : 0)} className="h-48 text-center p-12">
                        <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                          <p className="font-body text-transform-secondary text-muted-foreground">
                            {t('no_data', 'No categories match your filters.')}
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
