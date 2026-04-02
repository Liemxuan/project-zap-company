'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Filter, Eye, Edit, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from 'zap-design/src/lib/utils';
import { QuickActionsDropdown } from 'zap-design/src/genesis/molecules/quick-actions-dropdown';

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
import { Category } from '../models/category.model';

export type CategoryFilters = {
  status: string[];
};

function CategoryRow({
  category,
  expanded,
  onToggle,
  t,
}: {
  category: Category;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
}) {
  const createdDate = new Date(category.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <>
      <TableRow
        onClick={onToggle}
        className="cursor-pointer group hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b border-border/50 group-last:border-0"
      >
        <TableCell className="px-7 w-12 py-4 whitespace-nowrap">
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-4"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </TableCell>

        <TableCell className="truncate max-w-[200px] whitespace-nowrap font-medium text-foreground text-left py-4">
          {category.name}
        </TableCell>

        <TableCell className="w-48 whitespace-nowrap font-dev text-muted-foreground text-left py-4">
          /{category.slug}
        </TableCell>

        <TableCell className="w-32 whitespace-nowrap text-center py-4">
          <span className="font-medium text-primary">
            {category.productCount}
          </span>
        </TableCell>

        <TableCell className="w-28 whitespace-nowrap py-4 text-center">
          <Pill
            variant={category.status === 'active' ? 'success' : 'error'}
            className="min-w-20 block text-center"
          >
            {t(`status_${category.status}`)}
          </Pill>
        </TableCell>

        <TableCell className="w-20 whitespace-nowrap py-4 text-center">
          <QuickActionsDropdown
            actions={[
              {
                label: t('action_view', 'View'),
                icon: Eye,
                onClick: () => console.log('View', category.id),
              },
              {
                label: t('action_edit', 'Edit'),
                icon: Edit,
                onClick: () => console.log('Edit', category.id),
              },
              {
                label: t('action_delete', 'Delete'),
                icon: Trash2,
                variant: 'destructive',
                onClick: () => console.log('Delete', category.id),
              },
            ]}
          />
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0">
            <TableCell colSpan={6} className="p-0 border-b-0 h-0 border-t-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-layer-panel border-t border-border"
              >
                <div className="space-y-4 px-7 py-4 border-b border-border">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                      Description
                    </p>
                    <p className="rounded-lg bg-layer-cover p-3 text-foreground border border-outline-variant/30">
                      {category.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Created
                      </p>
                      <p className="text-foreground">{createdDate}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                        Updated
                      </p>
                      <p className="text-foreground">
                        {new Date(category.updatedAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </p>
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
  const statuses = Array.from(new Set(categories.map((c) => c.status))).sort();

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

  const hasActiveFilters = Object.values(filters).some((group) => group.length > 0);

  return (
    <div className="flex flex-col space-y-6 h-full p-1">
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
            className="h-8 text-xs text-primary hover:bg-primary/5"
          >
            Clear All
          </Button>
        )}
      </div>

      <div className="space-y-5">
        <div className="space-y-2">
          <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/60 px-1">
            {t('table_status', 'Status')}
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
          Categories will be filtered instantly based on your selection.
        </p>
      </div>
    </div>
  );
}

interface CategoryTableProps {
  categories: Category[];
  loading: boolean;
  onFilterChange?: (filters: CategoryFilters) => void;
  currentPage?: number;
  pageSize?: number;
  totalRecords?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  className?: string;
  t: (key: string, fallback?: string) => string;
  lang: string;
}

export function CategoryTable({
  categories,
  loading,
  onFilterChange,
  currentPage = 1,
  pageSize = 10,
  totalRecords = categories.length,
  onPageChange,
  onPageSizeChange,
  className,
  t,
  lang,
}: CategoryTableProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [internalFilters, setInternalFilters] = useState<CategoryFilters>({
    status: [],
  });

  const filters = internalFilters;

  const handleFilterChange = (newFilters: CategoryFilters) => {
    if (onFilterChange) onFilterChange(newFilters);
    setInternalFilters(newFilters);
  };

  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const lowerQuery = searchQuery.toLowerCase();

      const matchSearch =
        cat.name.toLowerCase().includes(lowerQuery) ||
        cat.description.toLowerCase().includes(lowerQuery) ||
        cat.slug.toLowerCase().includes(lowerQuery);

      const matchStatus =
        filters.status.length === 0 || filters.status.includes(cat.status);

      return matchSearch && matchStatus;
    });
  }, [filters, searchQuery, categories]);

  const totalPages = Math.ceil(totalRecords / pageSize);
  const activeFilters = filters.status.length;
  const hasActiveFilter = activeFilters > 0 || searchQuery.trim() !== '';

  if (loading) {
    return (
      <main className="w-full bg-layer-canvas border border-outline rounded-lg flex flex-col min-h-[500px] items-center justify-center">
        <p className="text-muted-foreground">Loading categories...</p>
      </main>
    );
  }

  return (
    <main className={cn("w-full bg-layer-canvas border border-outline rounded-lg flex flex-col h-full", className)}>
      <div className={cn("hidden", lang)}></div>
      {/* Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-2 px-5 gap-3 border-b border-border bg-layer-panel min-h-[3rem] flex-shrink-0">
        <div className="flex items-center h-8">
          {hasActiveFilter && (
            <span className="text-sm font-medium text-muted-foreground whitespace-nowrap">
              {filteredCategories.length} {t('of')} {categories.length} {t('categories_matched')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'Search categories...')}
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="text-sm"
            />
          </div>
          <Button
            variant={showFilters ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="relative h-10 px-4"
          >
            <Filter className={cn("h-4 w-4 mr-2", showFilters && "text-primary")} />
            <span className="text-xs font-medium">{t('filter', 'Filters')}</span>
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
          <div className="flex-1 overflow-y-auto rounded-none border-0">
            <Table className="w-full relative bg-transparent">
              <TableHeader className="bg-layer-panel top-0 z-10 sticky border-b border-border shadow-sm h-12">
                <TableRow className="border-b-0 hover:bg-transparent">
                  <TableHead className="w-12 px-7 whitespace-nowrap"></TableHead>
                  <TableHead className="text-left whitespace-nowrap">{t('table_name', 'Name')}</TableHead>
                  <TableHead className="w-48 text-left whitespace-nowrap">{t('table_slug', 'Slug')}</TableHead>
                  <TableHead className="w-32 text-center whitespace-nowrap">{t('table_products', 'Products')}</TableHead>
                  <TableHead className="w-28 text-center whitespace-nowrap">{t('table_status', 'Status')}</TableHead>
                  <TableHead className="w-20 text-center whitespace-nowrap">{t('table_actions', 'Actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredCategories.length > 0 ? (
                    filteredCategories.map((cat) => (
                      <CategoryRow
                        key={cat.id}
                        category={cat}
                        expanded={expandedId === cat.id}
                        onToggle={() =>
                          setExpandedId((current) =>
                            current === cat.id ? null : cat.id
                          )
                        }
                        t={t}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-48 text-center p-12">
                        <motion.div
                          key="empty-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="text-muted-foreground">
                            No categories match your filters.
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
              <FilterPanel
                filters={filters}
                onChange={handleFilterChange}
                categories={categories}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Footer - Pagination + Records Per Table */}
      {totalPages > 1 && (
        <div className="border-t border-border bg-layer-panel px-7 py-4 flex-shrink-0">
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <div className="flex items-center gap-2 text-on-surface/60 font-body">
              <span>{t('show', 'Show')}</span>
              <Select value={pageSize.toString()} onValueChange={(val) => onPageSizeChange?.(parseInt(val, 10))}>
                <SelectTrigger size="sm" className="w-[4.5rem] h-8 bg-transparent border-0 hover:bg-layer-canvas ring-0 focus:ring-0 px-2 font-medium text-on-surface">
                  <SelectValue placeholder={pageSize.toString()} />
                </SelectTrigger>
                <SelectContent className="bg-layer-canvas border-outline">
                  {[10, 20, 50, 100].map((size) => (
                    <SelectItem key={size} value={size.toString()} className="hover:bg-layer-panel focus:bg-layer-panel">
                      {size}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>{t('records_per_table', 'records per table')}</span>
            </div>

            {(() => {
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
                <Pagination className="mx-0 w-auto m-0">
                  <PaginationContent className="bg-secondary/10 border border-outline-variant rounded-full px-1.5 h-10 gap-1 shadow-sm">
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => onPageChange?.(Math.max(1, currentPage - 1))}
                        className={cn(
                          "h-8 px-3 rounded-full hover:bg-layer-canvas text-on-surface/80 hover:text-on-surface lowercase font-body transition-colors",
                          currentPage === 1 && "pointer-events-none opacity-40"
                        )}
                      >
                        {t('previous', 'previous')}
                      </PaginationPrevious>
                    </PaginationItem>
                    
                    {pageNumbers.map((page, idx) => (
                      <PaginationItem key={idx}>
                        {page === '...' ? (
                          <PaginationEllipsis className="h-8 w-8 text-on-surface/40" />
                        ) : (
                          <PaginationLink
                            isActive={currentPage === page}
                            onClick={() => onPageChange?.(page as number)}
                            className={cn(
                              "h-8 w-8 rounded-full font-body transition-all",
                              currentPage === page 
                                ? "bg-primary text-on-primary shadow-sm scale-105" 
                                : "text-on-surface/60 hover:bg-layer-canvas hover:text-on-surface"
                            )}
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
                          "h-8 px-3 rounded-full hover:bg-layer-canvas text-on-surface/80 hover:text-on-surface lowercase font-body transition-colors",
                          currentPage === totalPages && "pointer-events-none opacity-40"
                        )}
                      >
                        {t('next', 'next')}
                      </PaginationNext>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              );
            })()}
          </div>
        </div>
      )}
    </main>
  );
}
