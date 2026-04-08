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
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from 'zap-design/src/genesis/molecules/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'zap-design/src/genesis/atoms/interactive/select';
import { Avatar, AvatarImage, AvatarFallback } from 'zap-design/src/genesis/atoms/interactive/avatar';
import { Product } from '../models/product.model';

export interface ProductFilters {
  category: string[];
  productType?: string[];
  status: string[];
}

function FilterPanel({
  filters,
  onChange,
  data,
  t
}: {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  data: Product[];
  t: (key: string, fallback?: string) => string;
}) {
  const categories = Array.from(new Set(data.map((p) => p.cate_name).filter(Boolean)));
  const productTypes = Array.from(new Set(data.map((p) => p.productType).filter(Boolean)));
  const statuses = Array.from(new Set(data.map((p) => p.status.toString())));

  const toggleFilter = (filterKey: keyof ProductFilters, value: string) => {
    const current = filters[filterKey] || [];
    const updated = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value];

    onChange({
      ...filters,
      [filterKey]: updated,
    });
  };

  const clearAll = () => {
    onChange({
      category: [],
      productType: [],
      status: [],
    });
  };

  const hasActiveFilters = Object.values(filters).some(
    (group) => group && group.length > 0
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.05 }}
      className="flex h-full flex-col space-y-6 overflow-y-auto bg-layer-panel p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display text-transform-primary font-semibold text-foreground">Filters</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 text-xs text-primary"
          >
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
          {t('filter_category', 'Category')}
        </p>
        <div className="space-y-2">
          {categories.map((category) => {
            const selected = filters.category?.includes(category);
            return (
              <motion.button
                key={category}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => toggleFilter("category", category)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-body text-transform-secondary ${selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40"
                  }`}
              >
                <span>{category}</span>
                {selected && <Check className="h-3.5 w-3.5" />}
              </motion.button>
            );
          })}
        </div>
      </div>

      {productTypes.length > 0 && (
        <div className="space-y-3">
          <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
            Product Type
          </p>
          <div className="space-y-2">
            {productTypes.map((type) => {
              if (!type) return null;
              const selected = filters.productType?.includes(type);
              return (
                <motion.button
                  key={type}
                  type="button"
                  whileHover={{ x: 2 }}
                  onClick={() => toggleFilter("productType", type)}
                  aria-pressed={selected}
                  className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-body text-transform-secondary ${selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40"
                    }`}
                >
                  <span>{type}</span>
                  {selected && <Check className="h-3.5 w-3.5" />}
                </motion.button>
              );
            })}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
          {t('filter_status', 'Status')}
        </p>
        <div className="space-y-2">
          {statuses.map((status) => {
            const selected = filters.status?.includes(status);
            return (
              <motion.button
                key={status}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => toggleFilter("status", status)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-dev text-transform-tertiary ${selected
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

export interface ProductTableExpandedProps {
  products: Product[];
  loading?: boolean;
  filters?: ProductFilters;
  onFilterChange?: (filters: ProductFilters) => void;
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

export function ProductTableExpanded({
  products,
  filters: controlledFilters,
  onFilterChange,
  currentPage = 1,
  pageSize = 10,
  totalRecords,
  totalPages,
  onPageChange,
  onPageSizeChange,
  isFilterActive,
  onToggleFilters,
  className,
  t,
}: ProductTableExpandedProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    sku: true,
    cate_name: true,
    price: true,
    location: true,
    stock: false,
    unit: false,
    barcode: false,
    productType: false
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [searchQuery, setSearchQuery] = useState("");

  const L = useMemo(() => ({
    addItem: t('btn_add', "Add Item"),
    itemName: t('table_name', "Item Name"),
    itemCode: t('table_barcode', "Code"),
    sku: t('table_sku', "SKU"),
    category: t('table_category', "Category"),
    type: t('table_type', "Type"),
    inventory: t('table_stock', "Inventory"),
    price: t('table_price', "Price"),
    location: t('table_location', 'Location'),
    unit: t('table_unit', 'Unit'),
    status: t('table_status', 'Status'),
    searchPlaceholder: t('search_placeholder', 'Search...'),
    filter: t('filter', 'Filter'),
    show: t('show', 'Show'),
    itemsPerPage: t('records_per_table', 'items per page'),
    noItems: t('no_data', 'No items match your filters.'),
    page: t('page', 'Page'),
    of: t('of', 'of'),
    previous: t('previous', 'Previous'),
    next: t('next', 'Next'),
    columns: t('select_columns', 'Columns'),
  }), [t]);


  // Keep internal state for fallback
  const [internalFilters, setInternalFilters] = useState<ProductFilters>({
    category: [],
    productType: [],
    status: [],
  });
  const [internalShowFilters, setInternalShowFilters] = useState(false);

  const activeFilters = controlledFilters ?? internalFilters;
  const showFilters = isFilterActive ?? internalShowFilters;

  const handleFilterChange = (newFilters: ProductFilters) => {
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

  const columns = useMemo<ColumnDef<Product>[]>(() => {
    return [
      {
        id: "select",
        header: ({ table }) => (
          <div className="w-12 px-7">
            <Checkbox
              checked={
                table.getIsAllPageRowsSelected() ||
                (table.getIsSomePageRowsSelected() && "indeterminate")
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
            className="w-16 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {t('table_id', 'ID')}

          </div>
        ),
        cell: ({ row }) => (
          <div className="w-16 font-dev text-transform-tertiary text-muted-foreground text-left py-2.5 truncate">
            {row.original.id.toString().substring(0,6)}
          </div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "name",
        header: ({ column }) => (
          <div
            className="w-80 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {L.itemName}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-80 py-2.5 text-left">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                <Avatar 
                  size="sm"
                  className="w-full h-full object-cover border-[1.5px] border-border bg-surface-variant"
                >
                  <AvatarImage src={row.original.image} alt={row.original.name} />
                  <AvatarFallback>{row.original.name?.slice(0, 2).toUpperCase() || 'P'}</AvatarFallback>
                </Avatar>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="font-bold text-foreground text-sm truncate uppercase tracking-tight">{row.original.name}</span>
                <span className="font-dev font-normal text-xs text-muted-foreground uppercase tracking-wide truncate mt-0.5 opacity-70">SKU: {row.original.sku}</span>
              </div>
            </div>
          </div>
        ),
        enableHiding: false,
      },
      {
        accessorKey: "barcode",
        header: () => <div className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.itemCode}</div>,
        cell: ({ row }) => (
          <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
            {row.original.barcode || '—'}
          </div>
        ),
      },
      {
        accessorKey: "sku",
        header: () => <div className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.sku}</div>,
        cell: ({ row }) => (
          <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
            {row.original.sku}
          </div>
        ),
      },
      {
        accessorKey: "cate_name",
        header: ({ column }) => (
          <div
            className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {L.category}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-32 truncate text-muted-foreground text-left py-2.5">
            {row.original.cate_name || '—'}
          </div>
        ),
      },
      {
        accessorKey: "productType",
        header: () => <div className="w-28 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.type}</div>,
        cell: ({ row }) => (
          <div className="w-28 py-2.5">
            <Pill
              variant={row.original.productType === 'PHYSICAL' ? 'info' : row.original.productType === 'DIGITAL' ? 'warning' : 'neutral'}
              className="w-fit px-1.5 py-0.5"
            >
              {row.original.productType || '—'}
            </Pill>
          </div>
        ),
      },
      {
        accessorKey: "stock",
        header: ({ column }) => (
          <div
            className="w-32 text-right pr-4 font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {L.inventory}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-32 text-right py-2.5 pr-4">
            <div className="flex flex-col items-end">
              <div className="flex items-baseline gap-1">
                <span className={`font-bold ${row.original.stock === 0 ? 'text-destructive' : 'text-foreground'}`}>{row.original.stock || 0}</span>
                <span className="text-xs text-muted-foreground">{row.original.unit || ''}</span>
              </div>
              <span className="text-[10px] text-muted-foreground truncate max-w-full">{row.original.location || '—'}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "location",
        header: () => <div className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.location}</div>,
        cell: ({ row }) => (
          <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
            {row.original.location || '—'}
          </div>
        ),
      },
      {
        accessorKey: "unit",
        header: () => <div className="w-24 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.unit}</div>,
        cell: ({ row }) => (
          <div className="w-24 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
            {row.original.unit || '—'}
          </div>
        ),
      },
      {
        accessorKey: "price",
        header: ({ column }) => (
          <div
            className="w-24 text-right font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {L.price}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-24 text-right font-bold text-foreground py-2.5">
            ${(row.original.price || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: ({ column }) => (
          <div
            className="w-32 text-right font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {L.status}

          </div>
        ),
        cell: ({ row }) => (
          <div className="w-32 text-right py-2.5">
            <Pill
              variant={row.original.status >= 100 ? 'error' : row.original.status >= 50 ? 'success' : 'warning'}
              className="whitespace-nowrap w-fit ml-auto px-2 py-0.5 font-mono text-[9px] uppercase font-bold tracking-tight shadow-none"
            >
              <div className={cn("w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0", row.original.status >= 100 ? "bg-error" : row.original.status >= 50 ? "bg-success" : "bg-warning")} />
              {t(`status_${row.original.status}`, row.original.status.toString())}
            </Pill>
          </div>
        ),
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
    ];
  }, [L, t]);

  const filteredData = useMemo(() => {
    return products.filter((p) => {
      const matchCategory = !activeFilters.category || activeFilters.category.length === 0 || activeFilters.category.includes(p.cate_name);
      const matchType = !activeFilters.productType || activeFilters.productType.length === 0 || activeFilters.productType.includes(p.productType || '');
      const matchStatus = !activeFilters.status || activeFilters.status.length === 0 || activeFilters.status.includes(p.status.toString());
      return matchCategory && matchType && matchStatus;
    });
  }, [products, activeFilters]);

  // Adjust pagination remotely vs locally
  const isRemote = (totalRecords ?? 0) > products.length;
  
  const table = useReactTable({
    data: filteredData,
    columns,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      expanded,
      globalFilter: searchQuery,
      ...(isRemote ? { pagination: { pageIndex: Math.max(0, currentPage - 1), pageSize } } : {})
    },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getRowCanExpand: () => true,
    ...(isRemote 
      ? { manualPagination: true, pageCount: totalPages } 
      : { getPaginationRowModel: getPaginationRowModel() })
  });

  const totalFilteredCount = isRemote ? totalRecords : table.getFilteredRowModel().rows.length;
  const isSearchActive = searchQuery.trim() !== "" || Object.values(activeFilters).some(g => g && g.length > 0);

  return (
    <main className={cn("w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col flex-1", className)}>
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {isSearchActive && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {totalFilteredCount} of {isRemote ? totalRecords : products.length} items matched criteria.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={L.searchPlaceholder}

              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-body text-transform-secondary text-sm h-[var(--input-height,var(--button-height,48px))]"
            />
          </div>
          <Button
            variant={showFilters ? "primary" : "outline"}
            size="sm"
            onClick={handleToggleFilters}
            className="relative h-[var(--input-height,var(--button-height,48px))] px-6"
          >
            <Filter className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs text-transform-primary">{L.filter}</span>

            {(activeFilters.category?.length + (activeFilters.productType?.length || 0) + activeFilters.status?.length) > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20">
                {activeFilters.category?.length + (activeFilters.productType?.length || 0) + activeFilters.status?.length}
              </Badge>
            )}
          </Button>
          <Button variant="primary" size="sm" className="h-[var(--input-height,var(--button-height,48px))] px-6">
            <Plus className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs font-mono">{L.addItem}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* SIDE FILTERS */}
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
                filters={activeFilters}
                onChange={handleFilterChange}
                data={products}
                t={t}
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* DATA GRID */}
        <div className="flex-1 flex flex-col bg-layer-cover overflow-hidden min-w-0 relative">
          <div className="absolute inset-0 [&_[data-slot=table-wrapper]]:h-full [&_[data-slot=table-wrapper]]:overflow-auto [&_[data-slot=table-wrapper]]:scrollbar-thin [&_[data-slot=table-wrapper]]:scrollbar-thumb-outline-variant/30 [&_[data-slot=table-wrapper]]:scrollbar-track-transparent">
            <Table className="relative bg-transparent border-collapse w-full min-w-max">
              <TableHeader className="bg-layer-panel top-0 z-10 sticky border-b border-border shadow-sm h-12">
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
                                        sku: t('table_sku', 'Mã SKU'),
                                        cate_name: t('table_category', 'Danh mục'),
                                        price: t('table_price', 'Giá bán'),
                                        location: t('table_location', 'Vị trí'),
                                        stock: t('table_stock', 'Tồn Kho'),
                                        unit: t('table_unit', 'Đơn vị tính'),
                                        barcode: t('table_barcode', 'Mã vạch'),
                                        productType: t('table_type', 'Loại sản phẩm'),
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
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">ID</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.id}</p>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">Barcode</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.barcode || '—'}</p>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">Unit</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.unit || '—'}</p>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">Location</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.location || '—'}</p>
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
                      <p className="font-body text-transform-secondary text-muted-foreground">{L.noItems}</p>

                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
      
      {/* PAGINATION */}
      <div className="border-t border-border bg-layer-panel px-7 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground font-body text-transform-secondary">
          <div className="flex items-center gap-2">
            <span className="text-transform-secondary">{L.show}</span>

            <Select
              value={(isRemote ? pageSize : table.getState().pagination.pageSize).toString()}
              onValueChange={(val) => {
                if (isRemote) {
                  onPageSizeChange?.(Number(val));
                } else {
                  table.setPageSize(Number(val));
                }
              }}
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
            <span className="text-transform-secondary">{L.itemsPerPage}</span>

          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono tracking-widest uppercase opacity-60">
              {t('page', 'Page')} {isRemote ? currentPage : table.getState().pagination.pageIndex + 1} {t('of', 'of')} {isRemote ? totalPages : table.getPageCount()}
            </span>
            <Pagination className="mx-0 w-auto m-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className="font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (isRemote) {
                        onPageChange?.(Math.max(1, currentPage - 1));
                      } else {
                        table.previousPage(); 
                      }
                    }}
                  >
                    {t('previous', 'Previous')}
                  </PaginationPrevious>
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className="font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                    onClick={(e) => { 
                      e.preventDefault(); 
                      if (isRemote) {
                        onPageChange?.(Math.min(totalPages || 1, currentPage + 1));
                      } else {
                        table.nextPage(); 
                      }
                    }}
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
