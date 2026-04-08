'use client';

import { 
  flexRender, 
  getCoreRowModel, 
  useReactTable, 
  getSortedRowModel, 
  getPaginationRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  ColumnDef,
  VisibilityState
} from '@tanstack/react-table';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  ChevronDown, 
  Filter, 
  MoreHorizontal, 
  Plus, 
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { cn } from 'zap-design/src/lib/utils';

import { Badge } from 'zap-design/src/genesis/atoms/interactive/badge';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import { Avatar, AvatarImage, AvatarFallback } from 'zap-design/src/genesis/atoms/interactive/avatar';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from 'zap-design/src/genesis/molecules/popover';
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from 'zap-design/src/genesis/molecules/pagination';

import type { Category } from '../models/category.model';

export type CategoryFilters = {
  status: string[];
};

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
  onSearchChange?: (query: string) => void;
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
  totalPages = 1,
  onPageChange,
  onPageSizeChange,
  isFilterActive,
  onToggleFilters,
  onSearchChange,
  className,
  t,
}: CategoryTableExpandedProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [internalFilters, setInternalFilters] = useState<CategoryFilters>({ status: [] });
  const [internalShowFilters, setInternalShowFilters] = useState(false);

  const activeFilters = filtersProp ?? internalFilters;
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

  const columns = useMemo<ColumnDef<Category>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <div className="w-12 px-7">
            <Checkbox
               checked={
                table.getIsAllPageRowsSelected()
                  ? true
                  : table.getIsSomePageRowsSelected()
                  ? "indeterminate"
                  : false
              }
              onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
              aria-label="Select all"
              className="translate-y-0.5"
            />
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-12 px-7 py-2.5">
            <Checkbox
              checked={row.getIsSelected()}
              onCheckedChange={(value) => row.toggleSelected(!!value)}
              aria-label="Select row"
              className="translate-y-0.5"
            />
          </div>
        ),
        enableSorting: false,
        enableHiding: false,
      },
      {
        id: "expander",
        header: () => <div className="w-12 px-7" />,
        cell: ({ row }) => (
          <div className="w-12 px-7 py-2.5">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 hover:bg-surface-variant/50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                row.toggleExpanded();
              }}
            >
              <motion.div
                animate={{ rotate: row.getIsExpanded() ? 180 : 0 }}
                transition={{ duration: 0.2 }}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            </Button>
          </div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <div 
            className="w-16 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('table_id', 'ID')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-16 text-left py-2.5 font-dev text-muted-foreground text-[10px] tracking-widest opacity-60">
            {row.original.id.split('-')[0]}
          </div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div 
            className="min-w-40 px-4 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('table_name', 'Category Name')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="min-w-40 px-4 py-2.5 flex items-center gap-3">
            <div className="shrink-0">
              <Avatar size="sm">
                {row.original.icon_url && <AvatarImage src={row.original.icon_url} alt={row.original.name} />}
                <AvatarFallback>{row.original.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-foreground text-sm truncate uppercase tracking-tight">{row.original.name}</span>
              {row.original.materialized_path && (
                <span className="font-dev font-normal text-xs text-muted-foreground uppercase tracking-wide truncate mt-0.5 opacity-70">{row.original.materialized_path}</span>
              )}
            </div>
          </div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "item_count",
        header: ({ column }) => (
          <div 
            className="w-32 text-center font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('table_item', 'Items')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-32 text-center font-body text-muted-foreground text-sm py-2.5">
            {row.original.item_count}
          </div>
        ),
        enableHiding: true,
      },
      {
        accessorKey: "is_active",
        header: ({ column }) => (
          <div 
            className="w-28 text-right font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
                        {t('table_status', 'Status')}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-28 text-right py-2.5">
            <Pill 
              variant={row.original.is_active ? 'success' : 'error'} 
              className="whitespace-nowrap w-fit ml-auto px-2 py-0.5 font-mono text-[9px] uppercase font-bold tracking-tight shadow-none"
            >
              <div className={cn("w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0", row.original.is_active ? "bg-success" : "bg-error")} />
              {row.original.is_active ? t('status_active', 'Active') : t('status_inactive', 'Inactive')}
            </Pill>
          </div>
        ),
        enableHiding: false,
      },
      {
        id: "actions",
        header: () => (
          <div className="w-20 text-center py-4 relative">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-surface hover:bg-surface-variant border border-border rounded-md shadow-sm active:scale-95 transition-all opacity-100 absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2">
                  <Plus className="h-3 w-3" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-56 p-0 bg-surface shadow-2xl border border-outline rounded-xl" align="end" sideOffset={8}>
                <div className="p-3 border-b border-border bg-surface-variant/20">
                  <p className="font-dev text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">{t('select_columns', 'Columns')}</p>
                </div>
                <div className="px-3 py-3 flex flex-col gap-3">
                  {table.getAllColumns()
                    .filter(col => col.getCanHide())
                    .map(col => {
                      const columnLabels: Record<string, string> = {
                        item_count: t('table_item', 'Số lượng sản phẩm'),
                      };
                      
                      return (
                        <div key={col.id} className="flex items-center gap-3 p-1">
                          <Checkbox
                            id={`col-${col.id}`}
                            checked={col.getIsVisible()}
                            onCheckedChange={(value) => col.toggleVisibility(!!value)}
                            className="h-4 w-4 border-[1.5px] border-outline data-[state=checked]:bg-primary data-[state=checked]:border-primary transition-all duration-200"
                          />
                          <label
                            htmlFor={`col-${col.id}`}
                            className="text-xs font-dev font-medium text-on-surface-variant/80 cursor-pointer select-none tracking-tight"
                          >
                            {columnLabels[col.id] || col.id}
                          </label>
                        </div>
                      );
                    })}
                </div>
              </PopoverContent>
            </Popover>
          </div>
        ),
        cell: ({ row }) => {
          const isActive = row.original.is_active;
          return (
            <div className="w-20 py-2.5 text-center flex justify-center">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          )
        },
        enableHiding: false,
      }
    ];
  }, [t]);

  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    item_count: true,
  });

  const table = useReactTable({
    data: categories,
    columns,
    state: {
      globalFilter: searchQuery,
      columnVisibility,
    },
    onGlobalFilterChange: setSearchQuery,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
  });

  const isSearchActive = searchQuery.trim() !== "" || (activeFilters.status?.length || 0) > 0;

  if (loading) {
    return (
      <main className={cn("w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px]", className)}>
        <div className="flex-1 flex items-center justify-center">
          <div className="h-8 w-8 border-[3px] border-primary/20 border-t-primary rounded-full animate-spin" />
        </div>
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
    <main className={cn("w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col flex-1", className)}>
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {isSearchActive && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {table.getFilteredRowModel().rows.length} {t('of', 'of')} {categories.length} {t('records_matched', 'records matched.')}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              variant="filled"
              placeholder={t('search_placeholder', 'Search categories...')}
              value={searchQuery}
              onChange={(e) => {
                const query = e.target.value;
                setSearchQuery(query);
                onSearchChange?.(query);
              }}
              className="font-body text-transform-secondary text-sm h-[var(--input-height,var(--button-height,48px))] pl-10"
            />
          </div>
          <Button
            variant={showFilters ? "primary" : "outline"}
            size="sm"
            onClick={handleToggleFilters}
            className="relative h-[var(--input-height,var(--button-height,48px))] px-6"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs text-transform-primary">{t('filter', 'Filter')}</span>
            {(activeFilters.status?.length || 0) > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20">
                {activeFilters.status?.length}
              </Badge>
            )}
          </Button>
          <Button variant="primary" size="sm" className="h-[var(--input-height,var(--button-height,48px))] px-6">
            <Plus className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs font-mono uppercase tracking-widest">{t('btn_add', 'Add Category')}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* DATA GRID */}
        <div className="flex-1 flex flex-col bg-layer-cover overflow-hidden min-w-0 relative">
          <div className="absolute inset-0 [&_[data-slot=table-wrapper]]:h-full [&_[data-slot=table-wrapper]]:overflow-auto [&_[data-slot=table-wrapper]]:scrollbar-thin [&_[data-slot=table-wrapper]]:scrollbar-thumb-outline-variant/30 [&_[data-slot=table-wrapper]]:scrollbar-track-transparent">
            <Table className="relative bg-transparent border-collapse w-full min-w-max">
              <TableHeader className="bg-layer-panel top-0 z-20 sticky border-b border-border shadow-sm h-12 uppercase">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b-0 hover:bg-transparent transition-none">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="h-12 p-0 bg-layer-panel relative">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="group hover:bg-surface-variant/40 transition-colors border-b border-border/50 h-16"
                  >
                    {row.getVisibleCells().map((cell) => (
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
            <span className="text-transform-secondary">{t('show', 'Show')}</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => onPageSizeChange?.(Number(val))}
            >
              <SelectTrigger size="sm" className="h-8 min-w-[70px] font-mono text-[11px] bg-layer-panel text-on-surface hover:bg-layer-dialog border-outline">
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
            <span className="text-transform-secondary">{t('records_per_table', 'items per page')}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-[10px] font-mono tracking-widest uppercase opacity-60">
              {t('page', 'Page')} {currentPage} {t('of', 'of')} {totalPages}
            </span>
            <Pagination className="mx-0 w-auto m-0">
              <PaginationContent className="gap-1">
                <PaginationItem>
                  <PaginationPrevious
                    className={cn(
                      "h-8 px-3 font-mono text-[10px] tracking-widest uppercase cursor-pointer hover:bg-surface-variant transition-colors border-outline",
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
                      "h-8 px-3 font-mono text-[10px] tracking-widest uppercase cursor-pointer hover:bg-surface-variant transition-colors border-outline",
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
  );
}
