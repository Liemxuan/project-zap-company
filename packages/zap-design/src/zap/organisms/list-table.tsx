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

import { Badge } from '../../genesis/atoms/interactive/badge';
import { Button } from '../../genesis/atoms/interactive/button';
import { Input } from '../../genesis/atoms/interactive/inputs';
import { Checkbox } from '../../genesis/atoms/interactive/checkbox';
import { Pill } from '../../genesis/atoms/status/pills';
import { Popover, PopoverContent, PopoverTrigger } from '../../genesis/molecules/popover';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../genesis/atoms/data-display/table';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '../../genesis/molecules/pagination';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../genesis/atoms/interactive/select';
import { ProductImage } from '../../genesis/atoms/data-display/ProductImage';
//import { Avatar, AvatarFallback, AvatarImage } from '../../genesis/atoms/data-display/avatar';

export interface ListItem {
  id: string; // ID
  media_url: string; // Image
  variant_name: string; // Item Name
  sku_code: string; // SKU
  barcode: string; // Barcode
  category_id: string; // Category
  product_type: string; // Product Type
  sale_price: number; // Price
  qty_on_hand: number; // Stock
  uom_id: string; // Unit
  warehouse_id: string; // Location
  status_id: string; // Status
}

export type Filters = {
  category: string[];
  productType: string[];
  status: string[];
};

export const SAMPLE_DATA: ListItem[] = [
  {
    id: "uuid-1",
    media_url: "/products/iphone15.png",
    variant_name: "iPhone 15 - Black",
    sku_code: "APP-IP15-BLK",
    barcode: "194253456789",
    category_id: "Electronics",
    product_type: "PHYSICAL",
    sale_price: 999.00,
    qty_on_hand: 54,
    uom_id: "Piece",
    warehouse_id: "WH-East",
    status_id: "Active"
  },
  {
    id: "uuid-2",
    media_url: "/products/s24.png",
    variant_name: "Samsung Galaxy S24",
    sku_code: "SAM-S24-WHT",
    barcode: "8806090123456",
    category_id: "Electronics",
    product_type: "PHYSICAL",
    sale_price: 899.00,
    qty_on_hand: 12,
    uom_id: "Piece",
    warehouse_id: "WH-West",
    status_id: "Active"
  },
  {
    id: "uuid-3",
    media_url: "/products/premium_sub.png",
    variant_name: "Premium Subscription",
    sku_code: "SUB-PRM-1YR",
    barcode: "N/A",
    category_id: "Software",
    product_type: "DIGITAL",
    sale_price: 120.00,
    qty_on_hand: 9999,
    uom_id: "Year",
    warehouse_id: "Cloud",
    status_id: "Active"
  },
  {
    id: "uuid-4",
    media_url: "/products/it_consulting.png",
    variant_name: "IT Consulting Hour",
    sku_code: "SRV-IT-1HR",
    barcode: "N/A",
    category_id: "Services",
    product_type: "SERVICE",
    sale_price: 150.00,
    qty_on_hand: 100,
    uom_id: "Hour",
    warehouse_id: "HQ",
    status_id: "Hidden"
  },
  {
    id: "uuid-5",
    media_url: "/products/macbook.png",
    variant_name: "MacBook Pro 16",
    sku_code: "APP-MBP16-SLV",
    barcode: "194253987654",
    category_id: "Computers",
    product_type: "PHYSICAL",
    sale_price: 2499.00,
    qty_on_hand: 0,
    uom_id: "Piece",
    warehouse_id: "WH-North",
    status_id: "Out of Stock"
  }
];

function FilterPanel({
  filters,
  onChange,
  data,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  data: ListItem[];
}) {
  const categories = Array.from(new Set(data.map((p) => p.category_id)));
  const productTypes = Array.from(new Set(data.map((p) => p.product_type)));
  const statuses = Array.from(new Set(data.map((p) => p.status_id)));

  const toggleFilter = (filterKey: keyof Filters, value: string) => {
    const current = filters[filterKey];
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
    (group) => group.length > 0
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
          Category
        </p>
        <div className="space-y-2">
          {categories.map((category) => {
            const selected = filters.category.includes(category);
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

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
          Product Type
        </p>
        <div className="space-y-2">
          {productTypes.map((type) => {
            const selected = filters.productType.includes(type);
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

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
          Status
        </p>
        <div className="space-y-2">
          {statuses.map((status) => {
            const selected = filters.status.includes(status);
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
                <span>{status}</span>
                {selected && <Check className="h-3.5 w-3.5" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

export interface ListTableProps {
  initialItems?: ListItem[];
  filters?: Filters;
  onFilterChange?: (filters: Filters) => void;
  onToggleFilters?: () => void;
  onAddClick?: () => void;
  isFilterActive?: boolean;
  labels?: {
    addItem?: string;
    itemName?: string;
    itemCode?: string;
    category?: string;
    type?: string;
    inventory?: string;
    price?: string;
  };
  columns?: ColumnDef<ListItem>[];
}

export function ListTable({
  initialItems,
  filters: controlledFilters,
  onFilterChange,
  onToggleFilters,
  onAddClick,
  isFilterActive,
  labels = {},
  columns: externalColumns
}: ListTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({
    barcode: false,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [searchQuery, setSearchQuery] = useState("");

  const items = useMemo(() => initialItems ?? SAMPLE_DATA, [initialItems]);

  const L = useMemo(() => ({
    addItem: "Add Item",
    itemName: "Item Name",
    itemCode: "Code",
    category: "Category",
    type: "Type",
    inventory: "Inventory",
    price: "Price",
    ...labels
  }), [labels]);

  // Keep internal state for fallback
  const [internalFilters, setInternalFilters] = useState<Filters>({
    category: [],
    productType: [],
    status: [],
  });
  const [internalShowFilters, setInternalShowFilters] = useState(false);

  const activeFilters = controlledFilters ?? internalFilters;
  const showFilters = isFilterActive ?? internalShowFilters;

  const handleFilterChange = (newFilters: Filters) => {
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

  const columns = useMemo<ColumnDef<ListItem>[]>(() => {
    if (externalColumns) return externalColumns;

    return [
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
      },
      {
        accessorKey: "id",
        header: ({ column }) => (
          <div
            className="w-16 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            ID
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-16 font-dev text-transform-tertiary text-muted-foreground text-left py-2.5 truncate">
            {row.original.id.split('-')[1] || row.original.id}
          </div>
        ),
      },
      {
        accessorKey: "variant_name",
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
              <ProductImage src={row.original.media_url} alt={row.original.variant_name} className="w-10 h-10 object-cover rounded-md border-[1.5px] border-border shrink-0 bg-surface-variant" />
              <div className="flex flex-col min-w-0">
                <span className="font-semibold text-foreground text-sm truncate uppercase tracking-tight">{row.original.variant_name}</span>
                <span className="font-dev font-normal text-xs text-muted-foreground uppercase tracking-wide truncate mt-0.5 opacity-70">SKU: {row.original.sku_code}</span>
              </div>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "barcode",
        header: () => <div className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.itemCode}</div>,
        cell: ({ row }) => (
          <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
            {row.original.barcode}
          </div>
        ),
      },
      {
        accessorKey: "category_id",
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
            {row.original.category_id}
          </div>
        ),
      },
      {
        accessorKey: "product_type",
        header: () => <div className="w-28 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.type}</div>,
        cell: ({ row }) => (
          <div className="w-28 py-2.5">
            <Pill
              variant={row.original.product_type === 'PHYSICAL' ? 'info' : row.original.product_type === 'DIGITAL' ? 'warning' : 'neutral'}
              className="w-fit px-1.5 py-0.5"
            >
              {row.original.product_type}
            </Pill>
          </div>
        ),
      },
      {
        accessorKey: "qty_on_hand",
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
                <span className={`font-bold ${row.original.qty_on_hand === 0 ? 'text-destructive' : 'text-foreground'}`}>{row.original.qty_on_hand}</span>
                <span className="text-xs text-muted-foreground">{row.original.uom_id}</span>
              </div>
              <span className="text-[10px] text-muted-foreground truncate max-w-full">{row.original.warehouse_id}</span>
            </div>
          </div>
        ),
      },
      {
        accessorKey: "sale_price",
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
            ${row.original.sale_price.toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "status_id",
        header: ({ column }) => (
          <div
            className="w-32 text-right font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Status
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-32 text-right py-2.5">
            <Pill
              variant={row.original.status_id === 'Active' ? 'success' : row.original.status_id === 'Hidden' ? 'warning' : 'error'}
              className="whitespace-nowrap w-fit ml-auto"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
              {row.original.status_id}
            </Pill>
          </div>
        ),
      },
      {
        id: "actions",
        header: () => <div className="w-24 pr-7" />,
        cell: () => (
          <div className="w-24 pr-7 py-2.5 text-right">
            <div className="flex items-center justify-end text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                < MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ),
      },
    ];
  }, [L, externalColumns]);

  const filteredData = useMemo(() => {
    return items.filter((p) => {
      const matchCategory = activeFilters.category.length === 0 || activeFilters.category.includes(p.category_id);
      const matchType = activeFilters.productType.length === 0 || activeFilters.productType.includes(p.product_type);
      const matchStatus = activeFilters.status.length === 0 || activeFilters.status.includes(p.status_id);
      return matchCategory && matchType && matchStatus;
    });
  }, [items, activeFilters]);

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
  });

  const totalFilteredCount = table.getFilteredRowModel().rows.length;
  const isSearchActive = searchQuery.trim() !== "" || Object.values(activeFilters).some(g => g.length > 0);

  return (
    <main className="w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px]">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {isSearchActive && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {totalFilteredCount} of {items.length} items matched criteria.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder="Search..."
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
            <span className="font-display font-medium text-xs text-transform-primary">Filter</span>
            {(activeFilters.category.length + activeFilters.productType.length + activeFilters.status.length) > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20">
                {activeFilters.category.length + activeFilters.productType.length + activeFilters.status.length}
              </Badge>
            )}
          </Button>
          <Button variant="primary" size="sm" onClick={onAddClick} className="h-[var(--input-height,var(--button-height,48px))] px-6">
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
                data={items}
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
                      <TableHead key={header.id} className="p-0 bg-layer-panel">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}

                        {/* Column Picker in the last header */}
                        {header.column.id === 'actions' && (
                          <div className="absolute right-7 top-1/2 -translate-y-1/2">
                            <Popover>
                              <PopoverTrigger asChild>
                                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 bg-surface hover:bg-surface-variant border border-border">
                                  <Plus className="h-3 w-3" />
                                </Button>
                              </PopoverTrigger>
                              <PopoverContent className="w-56 p-0 bg-surface shadow-2xl border border-outline rounded-xl" align="end" sideOffset={8}>
                                <div className="p-3">
                                  <p className="font-dev text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">Columns</p>
                                </div>
                                <div className="px-3 pb-3 flex flex-col gap-3">
                                  {table.getAllColumns()
                                    .filter(col => col.getCanHide())
                                    .map(col => (
                                      <div key={col.id} className="flex items-center space-x-2">
                                        <Checkbox
                                          id={`col-${col.id}`}
                                          checked={col.getIsVisible()}
                                          onCheckedChange={(val) => col.toggleVisibility(!!val)}
                                        />
                                        <label htmlFor={`col-${col.id}`} className="text-sm font-medium leading-none cursor-pointer uppercase font-mono text-[11px]">
                                          {col.id}
                                        </label>
                                      </div>
                                    ))}
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
                                      <p className="text-foreground font-mono text-xs">{row.original.barcode}</p>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">Unit</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.uom_id}</p>
                                    </div>
                                    <div>
                                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-widest text-muted-foreground uppercase">Location</p>
                                      <p className="text-foreground font-mono text-xs">{row.original.warehouse_id}</p>
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
                      <p className="font-body text-transform-secondary text-muted-foreground">No items match your filters.</p>
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
            <span className="text-transform-secondary">Show</span>
            <Select
              value={table.getState().pagination.pageSize.toString()}
              onValueChange={(val) => table.setPageSize(Number(val))}
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
            <span className="text-transform-secondary">items per page</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="text-xs font-mono tracking-widest uppercase opacity-60">
              Page {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </span>
            <Pagination className="mx-0 w-auto m-0">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    className="font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                    onClick={(e) => { e.preventDefault(); table.previousPage(); }}
                  />
                </PaginationItem>
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    className="font-mono text-[10px] tracking-widest uppercase cursor-pointer"
                    onClick={(e) => { e.preventDefault(); table.nextPage(); }}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        </div>
      </div>
    </main>
  );
}
