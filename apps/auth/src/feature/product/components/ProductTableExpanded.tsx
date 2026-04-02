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

// ─── ProductRow ──────────────────────────────────────────────────────────────

function ProductRow({
  product,
  expanded,
  onToggle,
  t,
}: {
  product: Product;
  expanded: boolean;
  onToggle: () => void;
  t: (key: string, fallback?: string) => string;
}) {
  const stockColor =
    (product.stock ?? 0) > 20
      ? 'text-success'
      : (product.stock ?? 0) > 0
        ? 'text-warning'
        : 'text-destructive';

  // Map numeric status to variant (status codes from API)
  const pillVariant =
    (product.status >= 50 && product.status < 100)
      ? 'success'
      : (product.status >= 100 && product.status < 150)
        ? 'warning'
        : 'error';

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

        {/* id (1) */}
        <TableCell className="w-20 whitespace-nowrap text-left py-4 font-dev text-muted-foreground text-[11px]">
          {product.id}
        </TableCell>

        {/* image (2) */}
        <TableCell className="w-20 text-center py-4">
          <div className="flex justify-center items-center">
            <Avatar size="sm">
              {product.image && <AvatarImage src={product.image} alt={product.name} />}
              <AvatarFallback>{product.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </TableCell>

        {/* item_name (3) */}
        <TableCell className="min-w-[200px] whitespace-nowrap text-left py-4 font-medium text-[11px] px-4">
          {product.name}
        </TableCell>

        {/* sku (4) */}
        <TableCell className="w-32 whitespace-nowrap font-dev text-muted-foreground text-left py-4 text-[11px]">
          {product.sku}
        </TableCell>

        {/* barcode (5) */}
        <TableCell className="w-32 whitespace-nowrap text-left py-4 font-dev text-[11px] hidden md:table-cell">
          {product.barcode || '—'}
        </TableCell>

        {/* category (6) */}
        <TableCell className="w-32 whitespace-nowrap text-left py-4 font-medium text-[11px]">
          {product.cate_name || '—'}
        </TableCell>

        {/* product_type (7) */}
        <TableCell className="w-32 whitespace-nowrap text-left py-4 text-muted-foreground text-[11px]">
          {product.productType || '—'}
        </TableCell>

        {/* price (8) */}
        <TableCell className="w-24 whitespace-nowrap text-right font-dev font-semibold text-primary py-4 text-[11px]">
          ${product.price.toFixed(2)}
        </TableCell>

        {/* stock (9) */}
        <TableCell className={cn("w-24 whitespace-nowrap text-right font-dev font-semibold py-4 text-[11px]", stockColor)}>
          {product.stock}
        </TableCell>

        {/* unit (10) */}
        <TableCell className="w-24 whitespace-nowrap text-left py-4 text-muted-foreground text-[11px]">
          {product.unit || '—'}
        </TableCell>

        {/* location (11) */}
        <TableCell className="w-32 whitespace-nowrap text-left py-4 text-muted-foreground text-[11px] hidden lg:table-cell">
          {product.location || '—'}
        </TableCell>

        {/* status (12) */}
        <TableCell className="w-28 whitespace-nowrap py-4">
          <Pill variant={pillVariant} className="min-w-16 block text-center text-[10px]">
            {t(`status_${product.status}`, product.status.toString())}
          </Pill>
        </TableCell>

        {/* actions (13) */}
        <TableCell className="w-16 whitespace-nowrap text-right py-4 sticky right-0 z-20 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] border-l border-border bg-layer-cover" onClick={(e) => e.stopPropagation()}>
          <QuickActionsDropdown
            actions={[
              { label: t('action_view', 'View'), icon: Eye, onClick: () => console.log('View', product.id) },
              { label: t('action_edit', 'Edit'), icon: Edit, onClick: () => console.log('Edit', product.id) },
              { label: t('action_delete', 'Delete'), icon: Trash2, variant: 'destructive', onClick: () => console.log('Delete', product.id) },
            ]}
          />
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0">
            <TableCell colSpan={14} className="p-0 border-b-0 h-0 border-t-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="bg-layer-panel border-t border-border"
              >
                <div className="space-y-4 px-7 py-4 border-b border-border">
                  <div>
                    <p className="mb-2 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                      {t('table_description', 'Description')}
                    </p>
                    <p className="rounded-[length:var(--table-border-radius,var(--radius-card,8px))] bg-layer-cover p-3 font-dev text-foreground border border-[length:var(--table-border-width,var(--card-border-width,1px))] border-outline-variant/30">
                      {product.description}
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 font-dev">
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_sku', 'SKU')}
                      </p>
                      <p className="text-foreground">{product.sku}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_created', 'Created')}
                      </p>
                      <p className="text-foreground">
                        {product.createdAt ? new Date(product.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        {t('table_updated', 'Updated')}
                      </p>
                      <p className="text-foreground">
                        {product.updatedAt ? new Date(product.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '—'}
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

// ─── FilterPanel ─────────────────────────────────────────────────────────────

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

  const toggleFilter = (group: keyof ProductFilters, value: string) => {
    const current = filters[group];
    const updated = current.includes(value)
      ? current.filter((entry) => entry !== value)
      : [...current, value];
    onChange({ ...filters, [group]: updated });
  };

  const clearAll = () => onChange({ category: [], status: [] });
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
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-3">
        <p className="text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
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
                onClick={() => toggleFilter('category', category)}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-body text-transform-secondary ${selected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40'
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
          {t('table_status', 'Status')}
        </p>
        <div className="space-y-2">
          {statuses.map((status) => {
            const selected = filters.status.includes(status.toString());
            return (
              <motion.button
                key={status}
                type="button"
                whileHover={{ x: 2 }}
                onClick={() => toggleFilter('status', status.toString())}
                aria-pressed={selected}
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-dev text-transform-tertiary ${selected
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/40 hover:bg-surface-variant/40'
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

// ─── ProductTableExpanded ─────────────────────────────────────────────────────

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
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [internalFilters, setInternalFilters] = useState<ProductFilters>({ category: [], status: [] });
  const [internalShowFilters, setInternalShowFilters] = useState(false);

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
      setInternalShowFilters((current) => !current);
    }
  };

  const filteredProducts = useMemo(() => {
    // If we're using a real API, the 'products' prop is already filtered/sorted by the backend
    // Only apply client-side search/filters if the data is not fully controlled by backend
    if (totalRecords > products.length) {
      return products;
    }

    return products.filter((product) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch =
        product.name.toLowerCase().includes(lowerQuery) ||
        product.sku.toLowerCase().includes(lowerQuery);
      const matchCategory =
        filters.category.length === 0 || filters.category.includes(product.cate_name);
      const matchStatus =
        filters.status.length === 0 || filters.status.includes(product.status.toString());
      return matchSearch && matchCategory && matchStatus;
    });
  }, [filters, searchQuery, products, totalRecords]);

  // Use server-provided totalPages or calculate from totalRecords
  const totalPages = totalPagesProp ?? Math.ceil(totalRecords / pageSize);

  const paginatedProducts = useMemo(() => {
    // If backend handles pagination, just return products
    if (totalRecords > products.length) {
      return products;
    }
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage, pageSize, totalRecords, products]);

  const activeFilters = filters.category.length + filters.status.length;
  const hasActiveFilter = activeFilters > 0 || searchQuery.trim() !== '';

  if (loading) {
    return (
      <main className={cn('w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[400px] items-center justify-center', className)}>
        <p className="font-body text-transform-secondary text-muted-foreground">Loading products...</p>
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
              {filteredProducts.length} of {products.length} records matched criteria.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder={t('search_placeholder', 'Search products by name or SKU...')}
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
                products={products}
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
                  <TableHead className="w-20 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_id', 'id')}</TableHead>
                  <TableHead className="w-20 text-center bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_image', 'image')}</TableHead>
                  <TableHead className="min-w-[200px] text-left bg-layer-panel font-display font-semibold text-[10px] h-12 px-4" style={{ textTransform: 'lowercase' }}>{t('table_name', 'item name')}</TableHead>
                  <TableHead className="w-32 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_sku', 'sku')}</TableHead>
                  <TableHead className="w-32 text-left bg-layer-panel font-display font-semibold text-[10px] h-12 hidden md:table-cell" style={{ textTransform: 'lowercase' }}>{t('table_barcode', 'barcode')}</TableHead>
                  <TableHead className="w-32 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_category', 'category')}</TableHead>
                  <TableHead className="w-32 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_type', 'product type')}</TableHead>
                  <TableHead className="w-24 text-right bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_price', 'price')}</TableHead>
                  <TableHead className="w-24 text-right bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_stock', 'stock')}</TableHead>
                  <TableHead className="w-24 text-left bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_unit', 'unit')}</TableHead>
                  <TableHead className="w-32 text-left bg-layer-panel font-display font-semibold text-[10px] h-12 hidden lg:table-cell" style={{ textTransform: 'lowercase' }}>{t('table_location', 'location')}</TableHead>
                  <TableHead className="w-28 text-center bg-layer-panel font-display font-semibold text-[10px] h-12" style={{ textTransform: 'lowercase' }}>{t('table_status', 'status')}</TableHead>
                  <TableHead className="w-16 text-right bg-layer-panel font-display font-semibold text-[10px] h-12 sticky right-0 z-30 shadow-[-4px_0_8px_-4px_rgba(0,0,0,0.1)] border-l border-border bg-layer-panel" style={{ textTransform: 'lowercase' }}>{t('table_actions', 'actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.length > 0 ? (
                    paginatedProducts.map((product) => (
                      <ProductRow
                        key={product.id}
                        product={product}
                        expanded={expandedId === product.id}
                        onToggle={() =>
                          setExpandedId((current) =>
                            current === product.id ? null : product.id
                          )
                        }
                        t={t}
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} className="h-48 text-center p-12">
                        <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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
