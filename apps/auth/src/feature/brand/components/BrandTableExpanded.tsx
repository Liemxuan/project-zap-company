'use client';

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Filter, MoreHorizontal, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  ExpandedState,
} from "@tanstack/react-table";

import { cn } from 'zap-design/src/lib/utils';
import { Badge } from 'zap-design/src/genesis/atoms/interactive/badge';
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Input } from 'zap-design/src/genesis/atoms/interactive/inputs';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'zap-design/src/genesis/atoms/interactive/select';
import { ProductImage } from 'zap-design/src/genesis/atoms/data-display/ProductImage';

import type { Brand } from '../models/brand.model';

export type BrandFilters = {
  status: string[];
};

interface BrandTableExpandedProps {
  brands: Brand[];
  loading: boolean;
  filters?: BrandFilters;
  onFilterChange?: (filters: BrandFilters) => void;
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

export function BrandTableExpanded({
  brands,
  loading,
  filters: controlledFilters,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onToggleFilters,
  isFilterActive,
  currentPage = 1,
  pageSize = 10,
  totalRecords,
  totalPages,
  t,
  className,
}: BrandTableExpandedProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [searchQuery, setSearchQuery] = useState("");

  const [internalFilters, setInternalFilters] = useState<BrandFilters>({
    status: [],
  });
  const [internalShowFilters, setInternalShowFilters] = useState(false);

  const activeFilters = controlledFilters ?? internalFilters;
  const showFilters = isFilterActive ?? internalShowFilters;

  const handleFilterChange = (newFilters: BrandFilters) => {
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

  const columns = useMemo<ColumnDef<Brand>[]>(() => [
    {
      id: "expander",
      header: () => <div className="w-12 px-7" />,
      cell: ({ row }) => (
        <div className="px-7 w-12 py-2.5">
          <motion.div
            animate={{ rotate: row.getIsExpanded() ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-4 cursor-pointer"
            onClick={() => row.toggleExpanded()}
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <div
          className="w-24 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t('table_brand_id', 'Brand ID')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-24 font-dev text-transform-tertiary text-muted-foreground text-left py-2.5 truncate ml-1">
          {row.original.id.split('-').pop() || row.original.id}
        </div>
      ),
      enableHiding: false,
    },
    {
      accessorKey: "slug",
      header: ({ column }) => (
        <div
          className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t('table_reference_id', 'Reference ID')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate ml-1">
          {row.original.slug}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "logo_url",
      header: () => <div className="w-24 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase py-4">{t('table_brand_image', 'Brand Image')}</div>,
      cell: ({ row }) => (
        <div className="w-24 py-2.5 text-left flex justify-start pl-1">
          <ProductImage 
            src={row.original.logo_url || ''} 
            alt={row.original.name} 
            className="w-10 h-10 object-cover rounded-md border-[1.5px] border-border shrink-0 bg-surface-variant shadow-sm"
          />
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <div
          className="w-80 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t('table_brand_name', 'Brand Name')}
        </div>
      ),
      cell: ({ row }) => (
        <div className="w-80 py-2.5 text-left">
          <span className="font-semibold text-foreground text-sm truncate uppercase tracking-tight ml-1">{row.original.name}</span>
        </div>
      ),
      enableHiding: false,
    },
    {
      id: "apply_item",
      header: () => (
        <div className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase py-4">
          {t('table_apply_item', 'Apply Item')}
        </div>
      ),
      cell: () => (
        <div className="w-32 py-2.5 text-left font-dev text-on-surface-variant font-medium ml-1">
          0 {t('items', 'items')}
        </div>
      ),
      enableHiding: true,
    },
    {
      accessorKey: "status_id",
      header: ({ column }) => (
        <div
          className="w-32 text-right font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase py-4"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t('table_status', 'Status')}
        </div>
      ),
      cell: ({ row }) => {
        const isActive = row.original.status_id === 1;
        return (
          <div className="w-32 text-right py-2.5 flex justify-end">
            <Pill
              variant={isActive ? 'success' : 'error'}
              className="whitespace-nowrap w-fit ml-auto"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
              {isActive ? t('active', 'Active') : t('inactive', 'Inactive')}
            </Pill>
          </div>
        );
      },
      enableHiding: false,
    },
    {
      id: "actions",
      header: () => (
        <div className="w-20 text-center py-4 relative">
        </div>
      ),
      cell: () => (
        <div className="w-20 py-2.5 text-center flex justify-center">
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
      ),
      enableHiding: false,
    },
  ], [t]);

  const filteredData = useMemo(() => {
    return brands;
  }, [brands]);

  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      expanded,
      globalFilter: searchQuery,
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    manualPagination: true,
    pageCount: totalPages,
  });

  const isSearchActive = searchQuery.trim() !== "" || activeFilters.status.length > 0;

  if (loading) {
    return (
      <main className={cn("w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px] items-center justify-center", className)}>
        <p className="font-body text-transform-secondary text-muted-foreground animate-pulse">{t('loading', 'Loading...')}</p>
      </main>
    );
  }

  return (
    <main className={cn("w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px]", className)}>
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {isSearchActive && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {totalRecords} items matched criteria.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'Search...')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
            <span className="font-display font-medium text-xs text-transform-primary">{t('filter', 'Filter')}</span>
            {activeFilters.status.length > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20">
                {activeFilters.status.length}
              </Badge>
            )}
          </Button>
          <Button variant="primary" size="sm" className="h-[var(--input-height,var(--button-height,48px))] px-6">
            <Plus className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs font-mono">{t('btn_add', 'ADD BRAND')}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* DATA GRID */}
        <div className="flex-1 flex flex-col bg-layer-cover overflow-hidden min-w-0 relative">
          <div className="absolute inset-0 [&_[data-slot=table-wrapper]]:h-full [&_[data-slot=table-wrapper]]:overflow-auto [&_[data-slot=table-wrapper]]:scrollbar-thin [&_[data-slot=table-wrapper]]:scrollbar-thumb-outline-variant/30 [&_[data-slot=table-wrapper]]:scrollbar-track-transparent">
            <Table className="relative bg-transparent border-collapse w-full min-w-max">
              <TableHeader className="bg-layer-panel top-0 z-10 sticky border-b border-border shadow-sm h-12 uppercase">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b-0 hover:bg-transparent">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="p-0 bg-layer-panel relative">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}

                        {/* Column Picker in the last header */}
                        {header.column.id === 'actions' && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-surface hover:bg-surface-variant border border-border rounded-md shadow-sm active:scale-95 transition-all">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 p-0 bg-surface shadow-2xl border border-outline rounded-xl" align="end" sideOffset={8}>
                                <div className="p-3 border-b border-border bg-surface-variant/20">
                                  <p className="font-dev text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">{t('select_columns', 'Columns')}</p>
                                </div>
                                <div className="px-3 pb-3 flex flex-col gap-3">
                                  {table.getAllColumns()
                                    .filter(col => col.getCanHide())
                                    .map(col => {
                                      const columnLabels: Record<string, string> = {
                                        slug: t('table_reference_id', 'Reference ID'),
                                        logo_url: t('table_brand_image', 'Brand Image'),
                                        apply_item: t('table_apply_item', 'Apply Item'),
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
                        )}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                {table.getRowModel().rows.length > 0 ? (
                  table.getRowModel().rows.map((row) => (
                    <React.Fragment key={row.id}>
                      <TableRow className="group hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b border-border/50 transition-colors">
                        {row.getVisibleCells().map((cell) => (
                          <TableCell key={cell.id} className="p-0">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </TableCell>
                        ))}
                      </TableRow>

                      {/* Expanded Content */}
                      <AnimatePresence>
                        {row.getIsExpanded() && (
                          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0">
                            <TableCell colSpan={row.getVisibleCells().length} className="p-0 border-b-0 h-0 border-t-0">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden bg-layer-panel border-t border-border"
                              >
                                <div className="space-y-4 px-10 py-5 border-b border-border shadow-inner">
                                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 font-dev text-transform-tertiary">
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">{t('table_brand_id', 'Brand ID')}</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.id}</p>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">{t('table_slug', 'Slug')}</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.slug}</p>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">{t('table_type', 'Type')}</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.is_premium ? 'Premium' : 'Standard'}</p>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">{t('table_website', 'Website')}</p>
                                      <p className="text-foreground font-mono text-xs truncate max-w-[200px]">{row.original.website_url || 'N/A'}</p>
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            </TableCell>
                          </TableRow>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-48 text-center p-12">
                      <p className="font-body text-transform-secondary text-muted-foreground">{t('no_data', 'No items match your filters.')}</p>
                    </TableCell>
                  </TableRow>
                )}
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
              <SelectTrigger size="sm" className="w-20 font-medium font-body text-transform-secondary bg-layer-panel text-on-surface hover:bg-layer-dialog">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map(size => (
                  <SelectItem key={size} value={size.toString()}>{size}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-transform-secondary">{t('records_per_page', 'records per page')}</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono tracking-widest uppercase opacity-60">
              {t('page', 'Page')} {currentPage} {t('of', 'of')} {totalPages}
            </span>
            <Pagination className="mx-0 w-auto m-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    className={cn(
                      "font-mono text-[10px] tracking-widest uppercase cursor-pointer",
                      currentPage === 1 && "pointer-events-none opacity-40"
                    )}
                    onClick={(e) => { e.preventDefault(); onPageChange?.(Math.max(1, currentPage - 1)); }}
                  >
                    {t('previous', 'Previous')}
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationNext
                  className={cn(
                    "font-mono text-[10px] tracking-widest uppercase cursor-pointer",
                    currentPage === totalPages && "pointer-events-none opacity-40"
                  )}
                  onClick={(e) => { e.preventDefault(); onPageChange?.(Math.min(totalPages || 1, currentPage + 1)); }}
                >
                  {t('next', 'Next')}
                </PaginationNext>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
