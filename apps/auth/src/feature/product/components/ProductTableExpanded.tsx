'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Filter, Eye, Edit, Trash2, Plus, MoreHorizontal } from 'lucide-react';
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
import type { Product } from '../models/product.model';

export type ProductFilters = {
  category: string[];
  status: string[];
};

function ProductRow({
  product,
  expanded,
  onToggle,
  t,
  visibleCols,
  lang,
}: {
  product: Product;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
  visibleCols: Record<string, boolean>;
  lang: string;
}) {
  const stockColor =
    (product.stock ?? 0) > 20
      ? 'text-success'
      : (product.stock ?? 0) > 0
        ? 'text-warning'
        : 'text-destructive';

  const pillVariant =
    (product.status >= 50 && product.status < 100)
      ? 'success'
      : (product.status >= 100 && product.status < 150)
        ? 'warning'
        : 'error';

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

        {/* 1. ID (Fixed) */}
        <TableCell className="w-16 font-dev text-transform-tertiary text-muted-foreground text-left py-2.5 truncate text-[10px]">
          {product.id}
        </TableCell>

        {/* 2. Image (Fixed) */}
        <TableCell className="w-16 py-2.5">
          <Avatar size="sm" className="rounded-md border-[1.5px] border-border shrink-0">
            {product.image && <AvatarImage src={product.image} alt={product.name} />}
            <AvatarFallback>{product.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>
        </TableCell>

        {/* 3. Item Name (Fixed) */}
        <TableCell className="min-w-40 py-2.5 text-left">
          <span className="font-display font-bold text-foreground text-sm truncate block">{product.name}</span>
        </TableCell>

        {/* 4. SKU (Default) */}
        {visibleCols.sku && (
          <TableCell className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
            {product.sku || '—'}
          </TableCell>
        )}

        {/* 5. Category (Default) */}
        {visibleCols.category && (
          <TableCell className="w-32 truncate text-muted-foreground text-left py-2.5">
            {product.cate_name || '—'}
          </TableCell>
        )}

        {/* 6. Price (Default) */}
        {visibleCols.price && (
          <TableCell className="w-24 text-right font-bold text-foreground py-2.5">
            ${product.price.toFixed(2)}
          </TableCell>
        )}

        {/* 7. Location (Default) */}
        {visibleCols.location && (
          <TableCell className="w-32 py-2.5 text-left text-muted-foreground truncate">
            {product.location || '—'}
          </TableCell>
        )}

        {/* 8. Stock (Optional) */}
        {visibleCols.stock && (
          <TableCell className="w-24 text-right py-2.5 font-bold">
            <span className={stockColor}>{product.stock ?? 0}</span>
          </TableCell>
        )}

        {/* 9. Unit (Optional) */}
        {visibleCols.unit && (
          <TableCell className="w-24 py-2.5 text-left text-muted-foreground">
            {product.unit || '—'}
          </TableCell>
        )}

        {/* 10. Barcode (Optional) */}
        {visibleCols.barcode && (
          <TableCell className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
            {product.barcode || '—'}
          </TableCell>
        )}

        {/* 11. Product Type (Optional) */}
        {visibleCols.type && (
          <TableCell className="w-28 py-2.5">
            <Pill variant="neutral" className="w-fit px-1.5 py-0.5">{product.productType || '—'}</Pill>
          </TableCell>
        )}

        {/* 12. Status (Fixed) */}
        <TableCell className="w-32 text-right py-2.5 pr-4">
          <Pill variant={pillVariant} className="whitespace-nowrap w-fit ml-auto">
            <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
            {t(`status_${product.status}`, product.status.toString())}
          </Pill>
        </TableCell>

        {/* 13. Actions (Fixed - Sticky) */}
        <TableCell className="w-24 pr-7 py-2.5 text-right sticky right-0 z-10 bg-layer-base group-hover:bg-surface-variant/50 transition-colors shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.12)] border-l border-border">
          <div className="flex items-center justify-end text-muted-foreground">
            <QuickActionsDropdown
              actions={[
                { label: t('action_view', 'View'), icon: Eye, onClick: () => console.log('View', product.id) },
                { label: t('action_edit', 'Edit'), icon: Edit, onClick: () => console.log('Edit', product.id) },
                { label: t('action_delete', 'Delete'), icon: Trash2, variant: 'destructive', onClick: () => console.log('Delete', product.id) },
              ]}
            />
          </div>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0">
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
                        {t('table_id', 'ID')}
                      </p>
                      <p className="text-foreground">{product.id}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_barcode', 'Barcode')}
                      </p>
                      <p className="text-foreground">{product.barcode || '—'}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_sku', 'SKU')}
                      </p>
                      <p className="text-foreground">{product.sku}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_description', 'Description')}
                      </p>
                      <p className="text-foreground truncate">{product.description || '—'}</p>
                    </div>
                  </div>
                  {(product.createdAt || product.updatedAt) && (
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 font-dev text-transform-tertiary pt-2 border-t border-border/40">
                      <div>
                        <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                          {t('table_created', 'Created')}
                        </p>
                        <p className="text-[10px] text-foreground">
                          {product.createdAt ? new Date(product.createdAt).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US') : '—'}
                        </p>
                      </div>
                      <div>
                        <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                          {t('table_updated', 'Updated')}
                        </p>
                        <p className="text-[10px] text-foreground">
                          {product.updatedAt ? new Date(product.updatedAt).toLocaleString(lang === 'vi' ? 'vi-VN' : 'en-US') : '—'}
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
  products,
  t,
}: {
  filters: ProductFilters;
  onChange: (filters: ProductFilters) => void;
  products: Product[];
  t: (key: string, fallback?: string) => string;
}) {
  const categories = Array.from(new Set(products.map((p) => p.cate_name).filter(Boolean))).sort();
  const statuses = Array.from(new Set(products.map((p) => p.status))).sort();

  const toggleFilter = (filterKey: keyof ProductFilters, value: string) => {
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
    onChange({ category: [], status: [] });
  };

  const hasActiveFilters = Object.values(filters).some((group) => group.length > 0);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ delay: 0.05 }}
      className="flex h-full flex-col space-y-6 overflow-y-auto bg-layer-panel p-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-display text-transform-primary font-semibold text-foreground">{t('filter', 'Filters')}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-6 text-xs text-primary"
          >
            {t('clear', 'Clear')}
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground uppercase tracking-widest">
          {t('table_category', 'Category')}
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
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground uppercase tracking-widest">
          {t('table_status', 'Status')}
        </p>
        <div className="space-y-2">
          {statuses.map((status) => {
            const statusKey = status.toString();
            const selected = filters.status.includes(statusKey);

            return (
              <motion.button
                key={statusKey}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => toggleFilter("status", statusKey)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-dev text-transform-tertiary ${selected
                  ? "border-primary bg-primary/10 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40"
                  }`}
              >
                <span>{t(`status_${status}`, status.toString())}</span>
                {selected && <Check className="h-3.5 w-3.5" />}
              </motion.button>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}

interface ProductTableExpandedProps {
  products: Product[];
  loading: boolean;
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
  loading,
  filters: filtersProp,
  onFilterChange,
  currentPage = 1,
  pageSize = 10,
  totalRecords = products.length,
  totalPages: totalPagesProp,
  onPageChange,
  onPageSizeChange,
  isFilterActive,
  onToggleFilters,
  className,
  t,
  lang,
}: ProductTableExpandedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [internalFilters, setInternalFilters] = useState<ProductFilters>({ category: [], status: [] });
  const [internalShowFilters, setInternalShowFilters] = useState(false);
  const [visibleCols, setVisibleCols] = useState<Record<string, boolean>>({
    sku: true,
    category: true,
    price: true,
    location: true,
    stock: false,
    unit: false,
    barcode: false,
    type: false
  });
  const [tempCols, setTempCols] = useState<Record<string, boolean>>({ ...visibleCols });
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const filters = filtersProp ?? internalFilters;
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

  const filteredProducts = useMemo(() => {
    if (totalRecords > products.length) {
      return products;
    }

    return products.filter((p) => {
      const lowerQuery = searchQuery.toLowerCase();

      const matchSearch =
        p.name.toLowerCase().includes(lowerQuery) ||
        p.sku.toLowerCase().includes(lowerQuery);

      const matchCategory =
        filters.category.length === 0 || filters.category.includes(p.cate_name);
      const matchStatus =
        filters.status.length === 0 || filters.status.includes(p.status.toString());

      return matchSearch && matchCategory && matchStatus;
    });
  }, [filters, searchQuery, products, totalRecords]);

  const totalPages = Math.max(1, totalPagesProp ?? Math.ceil(totalRecords / pageSize));

  const paginatedProducts = useMemo(() => {
    if (totalRecords > products.length) {
      return products;
    }
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize, totalRecords, products]);

  const activeFilters = filters.category.length + filters.status.length;
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
      <main className={cn('w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[400px] items-center justify-center', className)}>
        <p className="font-body text-transform-secondary text-muted-foreground">{t('loading', 'Loading items...')}</p>
      </main>
    );
  }

  return (
    <main className={cn("w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px]", className)}>
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {hasActiveFilter && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {filteredProducts.length} {t('of', 'of')} {totalRecords} {t('products_matched', 'records matched criteria.')}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'Search products...')}
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
            <span className="font-display font-medium text-xs text-transform-primary">{t('btn_add', 'add product')}</span>
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
                products={products}
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

                  {/* 1. ID (Fixed) */}
                  <TableHead className="w-16 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_id', 'ID')}</TableHead>

                  {/* 2. Image (Fixed) */}
                  <TableHead className="w-16 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_image', 'Image')}</TableHead>

                  {/* 3. Item name (Fixed) */}
                  <TableHead className="min-w-40 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_name', 'Item name')}</TableHead>

                  {/* 4. SKU (Default) */}
                  {visibleCols.sku && <TableHead className="w-32 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_sku', 'SKU')}</TableHead>}

                  {/* 5. Category (Default) */}
                  {visibleCols.category && <TableHead className="w-32 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_category', 'Category')}</TableHead>}

                  {/* 6. Price (Default) */}
                  {visibleCols.price && <TableHead className="w-24 text-right bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_price', 'Price')}</TableHead>}

                  {/* 7. Location (Default) */}
                  {visibleCols.location && <TableHead className="w-32 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_location', 'Location')}</TableHead>}

                  {/* 8. Stock (Optional) */}
                  {visibleCols.stock && <TableHead className="w-24 text-right bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_stock', 'Stock')}</TableHead>}

                  {/* 9. Unit (Optional) */}
                  {visibleCols.unit && <TableHead className="w-24 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_unit', 'Unit')}</TableHead>}

                  {/* 10. Barcode (Optional) */}
                  {visibleCols.barcode && <TableHead className="w-32 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_barcode', 'Barcode')}</TableHead>}

                  {/* 11. Product Type (Optional) */}
                  {visibleCols.type && <TableHead className="w-28 text-left bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_type', 'Product Type')}</TableHead>}

                  {/* 12. Status (Fixed) */}
                  <TableHead className="w-32 text-right bg-layer-panel pr-4 font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">{t('table_status', 'Status')}</TableHead>

                  {/* 13. Actions (Fixed) */}
                  <TableHead className="w-24 pr-7 text-right bg-layer-panel sticky right-0 z-20 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] border-l border-border bg-layer-panel font-display font-black text-[10px] text-transform-primary uppercase tracking-[0.1em]">
                    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                      <PopoverTrigger asChild>
                        <Button onClick={() => setTempCols(visibleCols)} variant="ghost" size="sm" className="h-6 w-6 p-0 ml-auto bg-surface hover:bg-surface-variant border border-border">
                          <Plus className="h-3 w-3" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-56 p-0 bg-surface shadow-2xl border border-outline rounded-xl" align="end" sideOffset={8}>
                        <div className="p-3">
                          <p className="font-dev text-[10px] text-muted-foreground font-semibold tracking-wide uppercase">{t('select_columns', 'Select Columns')}</p>
                        </div>
                        <div className="px-3 pb-3 flex flex-col gap-3">
                          {/* Default Group */}
                          <div className="flex items-center space-x-2">
                            <Checkbox id="col-sku" checked={tempCols.sku} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, sku: !!c }))} />
                            <label htmlFor="col-sku" className="text-sm font-medium leading-none cursor-pointer">{t('table_sku', 'SKU')}</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="col-category" checked={tempCols.category} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, category: !!c }))} />
                            <label htmlFor="col-category" className="text-sm font-medium leading-none cursor-pointer">{t('table_category', 'Category')}</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="col-price" checked={tempCols.price} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, price: !!c }))} />
                            <label htmlFor="col-price" className="text-sm font-medium leading-none cursor-pointer">{t('table_price', 'Price')}</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="col-location" checked={tempCols.location} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, location: !!c }))} />
                            <label htmlFor="col-location" className="text-sm font-medium leading-none cursor-pointer">{t('table_location', 'Location')}</label>
                          </div>

                          <div className="h-px bg-border my-1" />

                          {/* Optional Group */}
                          <div className="flex items-center space-x-2">
                            <Checkbox id="col-stock" checked={tempCols.stock} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, stock: !!c }))} />
                            <label htmlFor="col-stock" className="text-sm font-medium leading-none cursor-pointer">{t('table_stock', 'Stock')}</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="col-unit" checked={tempCols.unit} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, unit: !!c }))} />
                            <label htmlFor="col-unit" className="text-sm font-medium leading-none cursor-pointer">{t('table_unit', 'Unit')}</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="col-barcode" checked={tempCols.barcode} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, barcode: !!c }))} />
                            <label htmlFor="col-barcode" className="text-sm font-medium leading-none cursor-pointer">{t('table_barcode', 'Barcode')}</label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Checkbox id="col-type" checked={tempCols.type} onCheckedChange={(c) => setTempCols(prev => ({ ...prev, type: !!c }))} />
                            <label htmlFor="col-type" className="text-sm font-medium leading-none cursor-pointer">{t('table_type', 'Product Type')}</label>
                          </div>
                        </div>
                        <div className="p-2 border-t border-border flex justify-end gap-3 items-center">
                          <button onClick={() => setTempCols({ sku: true, category: true, price: true, location: true, stock: false, unit: false, barcode: false, type: false })} className="text-[10px] font-dev text-muted-foreground font-semibold uppercase tracking-wide hover:text-foreground">{t('btn_reset', 'Reset')}</button>
                          <button onClick={() => { setVisibleCols(tempCols); setIsPopoverOpen(false); }} className="text-[10px] font-dev text-foreground font-semibold uppercase tracking-wide hover:opacity-80">{t('btn_apply', 'Apply')}</button>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((p) => (
                      <ProductRow
                        key={p.id}
                        product={p}
                        expanded={expandedId === p.id}
                        onToggle={() =>
                          setExpandedId((current) =>
                            current === p.id ? null : p.id
                          )
                        }
                        visibleCols={visibleCols}
                        t={t}
                        lang={lang}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={10} className="h-48 text-center p-12">
                        <motion.div
                          key="empty-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="font-body text-transform-secondary text-muted-foreground">
                            {t('no_data', 'No products match your filters.')}
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
            <span className="text-transform-secondary">{t('show', 'Show')}</span>
            <Select
              value={pageSize.toString()}
              onValueChange={(val) => onPageSizeChange?.(parseInt(val, 10))}
            >
              <SelectTrigger size="sm" className="w-20 font-medium font-body text-transform-secondary bg-layer-panel text-on-surface hover:bg-layer-dialog">
                <SelectValue placeholder={pageSize >= 9999 ? t('all', 'All') : pageSize.toString()} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="9999">{t('all', 'All')}</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-transform-secondary">{t('records_per_table', 'products per page')}</span>
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
