'use client';

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Columns3, Filter, MoreHorizontal, Plus } from "lucide-react";
import React, { useMemo, useState } from "react";
import { cn } from '../../lib/utils';
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
  Row,
} from "@tanstack/react-table";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical } from "lucide-react";

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
import tableEn from '../../locale/common/table/en';
import tableVi from '../../locale/common/table/vi';
//import { Avatar, AvatarFallback, AvatarImage } from '../../genesis/atoms/data-display/avatar';

export interface ListItem {
  id: string;
  media_url?: string;
  variant_name?: string;
  sku_code?: string;
  barcode?: string;
  category_id?: string;
  product_type?: string;
  sale_price?: number;
  qty_on_hand?: number;
  uom_id?: string;
  warehouse_id?: string;
  status_id?: string;
  name?: string;
  [key: string]: any;
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
    status_id: "Active",
    subRows: [
      {
        id: "uuid-1-1",
        media_url: "/products/iphone15.png",
        variant_name: "iPhone 15 - Black 128GB",
        sku_code: "APP-IP15-BLK-128",
        barcode: "194253456780",
        category_id: "Electronics",
        product_type: "PHYSICAL",
        sale_price: 999.00,
        qty_on_hand: 30,
        uom_id: "Piece",
        warehouse_id: "WH-East",
        status_id: "Active",
      },
      {
        id: "uuid-1-2",
        media_url: "/products/iphone15.png",
        variant_name: "iPhone 15 - Black 256GB",
        sku_code: "APP-IP15-BLK-256",
        barcode: "194253456781",
        category_id: "Electronics",
        product_type: "PHYSICAL",
        sale_price: 1099.00,
        qty_on_hand: 24,
        uom_id: "Piece",
        warehouse_id: "WH-East",
        status_id: "Active",
      },
    ],
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
  labels,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  data: ListItem[];
  labels: any;
}) {
  const L = labels || {};
  const categories = Array.from(new Set(data.map((p) => p.category_id).filter(Boolean))) as string[];
  const productTypes = Array.from(new Set(data.map((p) => p.product_type).filter(Boolean))) as string[];
  const statuses = Array.from(new Set(data.map((p) => p.status_id).filter(Boolean))) as string[];

  const toggleFilter = (filterKey: keyof Filters, value: string) => {
    const current = filters[filterKey] || [];
    const updated = Array.isArray(current) && current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...(Array.isArray(current) ? current : []), value];

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
        <h3 className="text-sm font-display text-transform-primary font-semibold text-foreground">{L.filtersTitle || "Filters"}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 text-xs text-primary"
          >
            {L.clearFilters || "Clear"}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
          Category
        </p>
        <div className="space-y-2">
          {categories.map((category) => {
            const categoryFilter = Array.isArray(filters.category) ? filters.category : [];
            const selected = categoryFilter.includes(category);
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
            const productTypeFilter = Array.isArray(filters.productType) ? filters.productType : [];
            const selected = productTypeFilter.includes(type);
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
            const statusFilter = Array.isArray(filters.status) ? filters.status : [];
            const selected = statusFilter.includes(status);
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
    status?: string;
    searchPlaceholder?: string;
    filterButton?: string;
    show?: string;
    itemsPerPage?: string;
    noResults?: string;
    pageOf?: string; // e.g. "Page {current} of {total}"
    matchCount?: string; // e.g. "{count} of {total} items matched criteria"
    filtersTitle?: string;
    clearFilters?: string;
    id?: string;
    actions?: string;
    columns?: string;
    loading?: string;
    search?: string;
  };
  columns?: ColumnDef<ListItem>[];
  onRowClick?: (item: ListItem) => void;
  defaultColumnVisibility?: VisibilityState;
  extraActions?: React.ReactNode;
  // External control props for server-side operations
  pageIndex?: number;
  pageSize?: number;
  pageCount?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  onSearch?: (query: string) => void;
  isLoading?: boolean;
  isDraggable?: boolean;
  onReorder?: (items: ListItem[]) => void;
  lang?: 'en' | 'vi';
}

export function ListTable({
  initialItems,
  filters: controlledFilters,
  onFilterChange,
  onToggleFilters,
  onAddClick,
  isFilterActive,
  labels = {},
  columns: externalColumns,
  onRowClick,
  defaultColumnVisibility,
  extraActions,
  pageIndex: controlledPageIndex,
  pageSize: controlledPageSize,
  pageCount: controlledPageCount,
  onPageChange,
  onPageSizeChange,
  onSearch,
  isLoading = false,
  isDraggable = false,
  onReorder,
  lang = 'en',
}: ListTableProps) {
  const tableLocale = (lang === 'vi' ? tableVi : tableEn) || tableEn || {};

  const L = {
    addItem: labels?.addItem || tableLocale.label_addItem,
    itemName: labels?.itemName || tableLocale.label_itemName,
    itemCode: labels?.itemCode || tableLocale.label_itemCode,
    category: labels?.category || tableLocale.label_category,
    type: labels?.type || tableLocale.label_type,
    inventory: labels?.inventory || tableLocale.label_inventory,
    price: labels?.price || tableLocale.label_price,
    status: labels?.status || tableLocale.label_status,
    searchPlaceholder: labels?.searchPlaceholder || tableLocale.label_searchPlaceholder,
    filterButton: labels?.filterButton || tableLocale.label_filterButton,
    show: labels?.show || tableLocale.label_show,
    itemsPerPage: labels?.itemsPerPage || tableLocale.label_itemsPerPage,
    noResults: labels?.noResults || tableLocale.label_noResults,
    pageOf: labels?.pageOf || tableLocale.label_pageOf,
    matchCount: labels?.matchCount || tableLocale.label_matchCount,
    filtersTitle: labels?.filtersTitle || tableLocale.label_filtersTitle,
    clearFilters: labels?.clearFilters || tableLocale.label_clearFilters,
    id: labels?.id || tableLocale.label_id,
    actions: labels?.actions || tableLocale.label_actions,
    columns: labels?.columns || tableLocale.label_columns,
    loading: labels?.loading || tableLocale.label_loading,
    search: labels?.search || tableLocale.label_search,
  };

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(
    defaultColumnVisibility ?? { barcode: false }
  );
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [internalPageIndex, setInternalPageIndex] = useState(0);
  const [internalPageSize, setInternalPageSize] = useState(10);
  const [internalSearchQuery, setInternalSearchQuery] = useState("");

  const pageIndex = controlledPageIndex ?? internalPageIndex;
  const pageSize = controlledPageSize ?? internalPageSize;
  const searchQuery = internalSearchQuery;

  const items = useMemo(() => initialItems ?? SAMPLE_DATA, [initialItems]);


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
        enableHiding: false,
        header: () => <div className="w-12 px-7" />,
        cell: ({ row }) => (
          <div className="w-12 py-2.5" style={{ paddingLeft: `${row.depth * 16 + 28}px`, paddingRight: 28 }}>
            {row.getCanExpand() ? (
              <motion.div
                animate={{ rotate: row.getIsExpanded() ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                className="flex-shrink-0 w-4 cursor-pointer"
                onClick={() => row.toggleExpanded()}
              >
                <ChevronDown className="h-4 w-4 text-muted-foreground" />
              </motion.div>
            ) : (
              <div className="w-4" />
            )}
          </div>
        ),
      },
      {
        accessorKey: "id",
        name: "ID",
        enableHiding: false,
        header: ({ column }) => (
          <div
            className="w-16 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {L.id}
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
        name: "Item Name",
        header: ({ column }) => (
          <div
            className="w-80 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            {L.itemName}
          </div>
        ),
        cell: ({ row }) => (
          <div className="w-80 py-2.5 text-left" style={{ paddingLeft: row.depth > 0 ? `${row.depth * 32}px` : undefined }}>
            <div className="flex items-center gap-4">
              <ProductImage src={row.original.media_url ?? ""} alt={row.original.variant_name || "Product Image"} className="w-10 h-10 object-cover rounded-md border-[1.5px] border-border shrink-0 bg-surface-variant" />
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
        name: "Item Code",
        header: () => <div className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.itemCode}</div>,
        cell: ({ row }) => (
          <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
            {row.original.barcode}
          </div>
        ),
      },
      {
        accessorKey: "category_id",
        name: "Category",
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
        name: "Type",
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
        name: "Inventory",
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
        name: "Price",
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
            ${Number(row.original.sale_price ?? 0).toFixed(2)}
          </div>
        ),
      },
      {
        accessorKey: "status_id",
        name: "Status",
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
        name: "Actions",
        header: () => <div className="w-24 pr-7 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{L.actions}</div>,
        cell: () => (
          <div className="w-24 pr-7 py-2.5 text-right">
            <div className="flex items-center justify-end text-muted-foreground">
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ),
      },
    ];
  }, [L, externalColumns]);

  const filteredData = useMemo(() => {
    return items.filter((p) => {
      const categoryFilter = Array.isArray(activeFilters.category) ? activeFilters.category : [];
      const productTypeFilter = Array.isArray(activeFilters.productType) ? activeFilters.productType : [];
      const statusFilter = Array.isArray(activeFilters.status) ? activeFilters.status : [];

      const matchCategory = categoryFilter.length === 0 || (p.category_id ? categoryFilter.includes(p.category_id) : false);
      const matchType = productTypeFilter.length === 0 || (p.product_type ? productTypeFilter.includes(p.product_type) : false);
      const matchStatus = statusFilter.length === 0 || (p.status_id ? statusFilter.includes(p.status_id) : false);
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
      pagination: {
        pageIndex,
        pageSize,
      },
    },
    manualPagination: controlledPageCount !== undefined,
    pageCount: controlledPageCount,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onExpandedChange: setExpanded,
    onGlobalFilterChange: setInternalSearchQuery,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: controlledPageCount !== undefined ? undefined : getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    getSubRows: (row) => row.subRows,
    getRowCanExpand: (row) => !!(row.original.subRows?.length),
  });

  const totalFilteredCount = table.getFilteredRowModel().rows.length;
  const totalFiltersCount = Object.values(activeFilters).reduce((acc, val) => {
    if (Array.isArray(val)) return acc + val.length;
    if (val !== null && val !== undefined && val !== '') return acc + 1;
    return acc;
  }, 0);

  const isSearchActive = searchQuery.trim() !== "" || totalFiltersCount > 0;

  const columnsWithData = useMemo(() => {
    const result = new Set<string>();
    for (const col of table.getAllColumns()) {
      const accessorKey = (col.columnDef as { accessorKey?: string }).accessorKey;
      if (!accessorKey) { result.add(col.id); continue; }
      const hasData = items.some(item => {
        const val = item[accessorKey as keyof ListItem];
        return val !== undefined && val !== null && val !== '';
      });
      if (hasData) result.add(col.id);
    }
    return result;
  }, [columns, items]);


  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      const newItems = arrayMove(items, oldIndex, newIndex);
      onReorder?.(newItems);
    }
  };

  return (
    <main className="w-full bg-layer-canvas border-outline-variant border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px] h-full">
      {/* TOOLBAR */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {isSearchActive && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {L.matchCount ? L.matchCount.replace('{count}', totalFilteredCount.toString()).replace('{total}', items.length.toString()) : `${totalFilteredCount} of ${items.length} items matched criteria.`}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={L.searchPlaceholder || "Search..."}
              value={searchQuery}
              onChange={(e) => setInternalSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && onSearch) {
                  onSearch(searchQuery);
                }
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
            <span className="font-display font-medium text-xs text-transform-primary">{L.filterButton || "Filter"}</span>
            {totalFiltersCount > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20">
                {totalFiltersCount}
              </Badge>
            )}
          </Button>
          {extraActions}
          <Button variant="primary"
            size="sm"
            onClick={onAddClick}
            className="h-[var(--input-height,var(--button-height,48px))] px-6">
            <Plus className="h-4 w-4 mr-2" />
            <span className="font-display font-medium text-xs text-transform-primary">{L.addItem}</span>
          </Button>
        </div>
      </div>

      <div className="flex flex-1 relative">
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
                labels={L}
              />
            </motion.div>
          )}
        </AnimatePresence>
        {table.getAllColumns().some(col => col.getCanHide()) && <div className="absolute -right-3 top-2 z-50">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="h-6 w-6 p-0 bg-surface hover:bg-surface-variant border border-border rounded-full" style={{ '--button-border-radius': '50%' } as React.CSSProperties}>
                <Plus size={16} />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-0 bg-surface shadow-2xl border border-outline rounded-xl" align="end" sideOffset={8}>
              <div className="p-3">
                <p className="font-dev text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">{L.columns || "Columns"}</p>
              </div>
              <div className="px-3 pb-3 flex flex-col gap-3">
                {table.getAllColumns()
                  .filter(col => col.getCanHide())
                  .map(col => (
                    <div key={col.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={`col-${col.id}`}
                        checked={col.getIsVisible()}
                        //disabled={!columnsWithData.has(col.id)}
                        disabled={(col.columnDef as { enableHiding?: boolean }).enableHiding === false}
                        onCheckedChange={(val) => col.toggleVisibility(!!val)}
                      />
                      <label htmlFor={`col-${col.id}`} className={`text-sm font-medium leading-none uppercase font-mono text-[11px] ${columnsWithData.has(col.id) ? 'cursor-pointer' : 'cursor-not-allowed opacity-40'}`}>
                        {(col.columnDef as { name?: string }).name ?? col.id}
                      </label>
                    </div>
                  ))}
              </div>
            </PopoverContent>
          </Popover>
        </div>}

        {/* DATA GRID */}
        <div className="flex-1 flex flex-col bg-layer-cover overflow-hidden min-w-0 relative">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <Table className="relative bg-transparent border-collapse w-full min-w-max">
              <TableHeader className="bg-layer-panel top-0 z-10 sticky border-b border-border shadow-sm h-12">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="border-b-0 hover:bg-transparent relative">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id} className="p-0 bg-layer-panel">
                        {header.isPlaceholder
                          ? null
                          : flexRender(header.column.columnDef.header, header.getContext())}
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>

              <TableBody>
                <SortableContext
                  items={table.getRowModel().rows.map(row => row.original.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {table.getRowModel().rows.length > 0 ? (
                    table.getRowModel().rows.map((row) => (
                      <SortableRow
                        key={row.id}
                        row={row}
                        onRowClick={onRowClick}
                        isDraggable={isDraggable}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={table.getVisibleFlatColumns().length} className="h-32 text-center bg-layer-base">
                        <p className="font-body text-transform-secondary text-muted-foreground">{L.noResults || "No items match your filters."}</p>
                      </TableCell>
                    </TableRow>
                  )}
                </SortableContext>
              </TableBody>
            </Table>
          </DndContext>
        </div>
      </div>

      {/* PAGINATION */}
      <div className="border-t border-border bg-layer-panel px-7 py-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground font-body text-transform-secondary">
          <div className="flex items-center gap-2">
            <span className="text-transform-secondary">{L.show || "Show"}</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => {
                const newSize = Number(val);
                if (onPageSizeChange) {
                  onPageSizeChange(newSize);
                } else {
                  table.setPageSize(newSize);
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
            <span className="text-transform-secondary">{L.itemsPerPage || "items per page"}</span>
          </div>
          {table.getPageCount() > 1 && (
            <div className="flex items-center gap-6">
              <span className="text-xs font-mono tracking-widest uppercase opacity-60">
                {L.pageOf ? L.pageOf.replace('{current}', (table.getState().pagination.pageIndex + 1).toString()).replace('{total}', table.getPageCount().toString()) : (
                  <>Page <span className="text-primary font-bold">{table.getState().pagination.pageIndex + 1}</span> of {table.getPageCount()}</>
                )}
              </span>
              <Pagination className="mx-0 w-auto m-0">
                <PaginationContent>
                  {table.getPageCount() > 1 && (
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        className={(onPageChange ? pageIndex === 0 : !table.getCanPreviousPage()) ? "font-mono text-[10px] tracking-widest uppercase opacity-50 pointer-events-none" : "font-mono text-[10px] tracking-widest uppercase cursor-pointer"}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onPageChange) {
                            onPageChange(Math.max(0, pageIndex - 1));
                          } else {
                            table.previousPage();
                          }
                        }}
                      />
                    </PaginationItem>
                  )}
                  {Array.from({ length: table.getPageCount() }).map((_, i) => (
                    <PaginationItem key={i}>
                      <PaginationLink
                        href="#"
                        isActive={table.getState().pagination.pageIndex === i}
                        className={cn(
                          "font-mono text-[10px] tracking-widest uppercase cursor-pointer transition-all duration-200",
                          table.getState().pagination.pageIndex === i 
                            ? "bg-primary text-primary-foreground shadow-md scale-110 border-primary" 
                            : "hover:bg-surface-variant"
                        )}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onPageChange) {
                            onPageChange(i);
                          } else {
                            table.setPageIndex(i);
                          }
                        }}
                      >
                        {i + 1}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  {table.getPageCount() > 1 && (
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        className={(onPageChange ? pageIndex >= (controlledPageCount ?? table.getPageCount()) - 1 : !table.getCanNextPage()) ? "font-mono text-[10px] tracking-widest uppercase opacity-50 pointer-events-none" : "font-mono text-[10px] tracking-widest uppercase cursor-pointer"}
                        onClick={(e) => {
                          e.preventDefault();
                          if (onPageChange) {
                            onPageChange(pageIndex + 1);
                          } else {
                            table.nextPage();
                          }
                        }}
                      />
                    </PaginationItem>
                  )}
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </div>
      </div>

      {/* LOADING OVERLAY */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-layer-canvas/60 backdrop-blur-[2px]"
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm font-medium text-foreground font-body">{L.loading || "Loading data..."}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main >
  );
}

function SortableRow({ row, onRowClick, isDraggable }: { row: Row<ListItem>, onRowClick: ((item: ListItem) => void) | undefined, isDraggable: boolean }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: row.original.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 0,
    opacity: isDragging ? 0.5 : 1,
    position: 'relative' as const,
  };

  return (
    <React.Fragment>
      <TableRow
        ref={setNodeRef}
        style={style}
        className={`group hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b transition-colors cursor-pointer ${row.depth > 0 ? 'bg-layer-panel/60' : ''} ${isDragging ? 'bg-surface-variant/30' : ''}`}
        onClick={() => onRowClick?.(row.original)}
      >
        {row.getVisibleCells().map((cell) => (
          <TableCell
            key={cell.id}
            className="p-0"
            {...(cell.column.id === 'drag' ? { ...attributes, ...listeners } : {})}
          >
            {flexRender(cell.column.columnDef.cell, cell.getContext())}
          </TableCell>
        ))}
      </TableRow>

      {/* Expanded Content — only for rows without subRows */}
      <AnimatePresence>
        {row.getIsExpanded() && !row.original.subRows?.length && (
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
  );
}
