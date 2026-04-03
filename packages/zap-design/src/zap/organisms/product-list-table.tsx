'use client';

import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Filter, MoreHorizontal, Edit, Trash2, Eye } from "lucide-react";
import { useMemo, useState } from "react";

import { Badge } from '../../genesis/atoms/interactive/badge';
import { Button } from '../../genesis/atoms/interactive/button';
import { Input } from '../../genesis/atoms/interactive/inputs';
import { Pill } from '../../genesis/atoms/status/pills';
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

export interface Product {
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

export const SAMPLE_PRODUCTS: Product[] = [
  {
    id: "uuid-1",
    media_url: "https://via.placeholder.com/40/000000/FFFFFF?text=IP15",
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
    media_url: "https://via.placeholder.com/40/000000/FFFFFF?text=S24",
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
    media_url: "https://via.placeholder.com/40/000000/FFFFFF?text=SUB",
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
    media_url: "https://via.placeholder.com/40/000000/FFFFFF?text=CONS",
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
    media_url: "https://via.placeholder.com/40/000000/FFFFFF?text=MAC",
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

const statusStyles: Record<string, string> = {
  "Active": "text-success",
  "Hidden": "text-warning",
  "Out of Stock": "text-destructive"
};

function ProductRow({
  product,
  expanded,
  onToggle,
}: {
  product: Product;
  expanded: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <TableRow
        className="group hover:bg-surface-variant/50 focus:bg-surface-variant/70 border-b border-border/50 group-last:border-0"
      >
        <TableCell className="px-7 w-12 py-4" onClick={onToggle}>
          <motion.div
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="flex-shrink-0 w-4 cursor-pointer"
          >
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </motion.div>
        </TableCell>

        {/* ID - Hidden on small screens to save space, but requested in fields */}
        <TableCell className="w-16 hidden lg:table-cell font-dev text-transform-tertiary text-muted-foreground text-left py-4 truncate">
          {product.id.split('-')[1] || product.id}
        </TableCell>

        <TableCell className="w-16 py-4 text-center">
          <img src={product.media_url} alt={product.variant_name} className="w-10 h-10 object-cover rounded-md border-[1.5px] border-border inline-block" />
        </TableCell>

        <TableCell className="w-64 py-4 text-left">
          <span className="font-semibold text-foreground text-sm truncate block">{product.variant_name}</span>
        </TableCell>
        
        <TableCell className="w-40 py-4 text-left">
          <span className="font-dev text-xs text-muted-foreground uppercase tracking-wide truncate block">{product.sku_code}</span>
        </TableCell>
        
        <TableCell className="w-32 hidden xl:table-cell truncate font-dev text-transform-tertiary text-muted-foreground text-left py-4">
          {product.barcode}
        </TableCell>

        <TableCell className="w-32 truncate text-muted-foreground text-left py-4">
          {product.category_id}
        </TableCell>

        <TableCell className="w-28 py-4">
          <Pill
            variant={product.product_type === 'PHYSICAL' ? 'info' : product.product_type === 'DIGITAL' ? 'warning' : 'neutral'}
            className="min-w-16 block text-[10px]"
          >
            {product.product_type}
          </Pill>
        </TableCell>

        <TableCell className="w-24 text-right font-medium py-4">
          ${product.sale_price.toFixed(2)}
        </TableCell>

        <TableCell className="w-20 text-right font-dev text-transform-tertiary text-muted-foreground py-4">
          {product.qty_on_hand}
        </TableCell>
        
        <TableCell className="w-20 hidden 2xl:table-cell text-right font-dev text-transform-tertiary text-muted-foreground py-4">
          {product.uom_id}
        </TableCell>
        
        <TableCell className="w-24 hidden lg:table-cell text-right truncate text-muted-foreground py-4">
          {product.warehouse_id}
        </TableCell>

        <TableCell
          className={`w-28 text-right font-semibold py-4 ${
            statusStyles[product.status_id] ?? "text-muted-foreground"
          }`}
        >
          {product.status_id}
        </TableCell>

        <TableCell className="w-24 pr-7 py-4 text-right">
          <div className="flex items-center justify-end gap-1 text-muted-foreground">
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
               <Eye className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
               <Edit className="h-4 w-4" />
             </Button>
             <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-destructive hover:text-destructive hover:bg-destructive/10">
               <Trash2 className="h-4 w-4" />
             </Button>
          </div>
        </TableCell>
      </TableRow>

      <AnimatePresence initial={false}>
        {expanded && (
          <TableRow className="hover:bg-transparent data-[state=selected]:bg-transparent border-0">
            <TableCell colSpan={14} className="p-0 border-b-0 h-0 border-t-0">
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden bg-layer-panel border-t border-border"
              >
                <div className="space-y-4 px-7 py-4 border-b border-border">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 font-dev text-transform-tertiary">
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        ID
                      </p>
                      <p className="text-foreground">{product.id}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        Barcode
                      </p>
                      <p className="text-foreground">{product.barcode}</p>
                    </div>
                    <div>
                      <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        Unit
                      </p>
                      <p className="text-foreground">{product.uom_id}</p>
                    </div>
                    <div>
                        <p className="mb-1 text-[length:var(--table-font-size,0.625rem)] font-display font-semibold text-transform-primary tracking-wide text-muted-foreground">
                        Location
                        </p>
                        <p className="text-foreground">{product.warehouse_id}</p>
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
  products,
}: {
  filters: Filters;
  onChange: (filters: Filters) => void;
  products: Product[];
}) {
  const categories = Array.from(new Set(products.map((p) => p.category_id)));
  const productTypes = Array.from(new Set(products.map((p) => p.product_type)));
  const statuses = Array.from(new Set(products.map((p) => p.status_id)));

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
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-body text-transform-secondary ${
                  selected
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
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-body text-transform-secondary ${
                  selected
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
                className={`flex w-full items-center justify-between gap-2 border border-[length:max(var(--button-border-width,1px),1px)] rounded-[length:var(--button-border-radius,var(--radius-btn,4px))] px-3 py-2 text-sm transition-colors font-dev text-transform-tertiary ${
                  selected
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

export function ProductListTable({ 
  initialProducts,
  filters: controlledFilters,
  onFilterChange,
  onToggleFilters,
  isFilterActive
}: { 
  initialProducts?: Product[];
  filters?: Filters;
  onFilterChange?: (filters: Filters) => void;
  onToggleFilters?: () => void;
  isFilterActive?: boolean;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [products] = useState<Product[]>(initialProducts ?? SAMPLE_PRODUCTS);
  
  // Keep internal state for fallback
  const [internalFilters, setInternalFilters] = useState<Filters>({
    category: [],
    productType: [],
    status: [],
  });
  const [internalShowFilters, setInternalShowFilters] = useState(false);

  const filters = controlledFilters ?? internalFilters;
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

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const lowerQuery = searchQuery.toLowerCase();

      const matchSearch =
        p.variant_name.toLowerCase().includes(lowerQuery) ||
        p.sku_code.toLowerCase().includes(lowerQuery);

      const matchCategory =
        filters.category.length === 0 || filters.category.includes(p.category_id);
      const matchType =
        filters.productType.length === 0 || filters.productType.includes(p.product_type);
      const matchStatus =
        filters.status.length === 0 || filters.status.includes(p.status_id);

      return matchSearch && matchCategory && matchType && matchStatus;
    });
  }, [filters, searchQuery, products]);

  const activeFilters =
    filters.category.length + filters.productType.length + filters.status.length;
  const hasActiveFilter = activeFilters > 0 || searchQuery.trim() !== "";

  return (
    <main className="w-full bg-layer-canvas border-outline-variant overflow-hidden border-[length:var(--table-border-width,var(--card-border-width,1px))] rounded-[length:var(--table-border-radius,var(--radius-card,8px))] flex flex-col min-h-[500px]">
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center w-full py-4 px-5 gap-4 border-b border-border bg-layer-panel min-h-[length:var(--table-toolbar-height,4.5rem)] flex-shrink-0">
        <div className="flex items-center h-8">
          {hasActiveFilter && (
            <span className="text-sm font-medium text-muted-foreground font-body text-transform-secondary">
              {filteredProducts.length} of {products.length} products matched criteria.
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="relative flex-1 md:w-80">
            <Input
              variant="filled"
              leadingIcon="search"
              placeholder="Search by name or SKU..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
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
            {activeFilters > 0 && (
              <Badge className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center p-0 text-xs rounded-full bg-error text-on-error border-none z-20">
                {activeFilters}
              </Badge>
            )}
          </Button>
          <Button variant="primary" size="sm" className="h-[var(--input-height,var(--button-height,48px))] px-6">
            <span className="font-display font-medium text-xs">Add Product</span>
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
                  <TableHead className="w-16 hidden lg:table-cell text-left bg-layer-panel">ID</TableHead>
                  <TableHead className="w-16 text-center bg-layer-panel">Image</TableHead>
                  <TableHead className="w-64 text-left bg-layer-panel">Item name</TableHead>
                  <TableHead className="w-40 text-left bg-layer-panel">SKU</TableHead>
                  <TableHead className="w-32 hidden xl:table-cell text-left bg-layer-panel">Barcode</TableHead>
                  <TableHead className="w-32 text-left bg-layer-panel">Category</TableHead>
                  <TableHead className="w-28 text-left bg-layer-panel">Type</TableHead>
                  <TableHead className="w-24 text-right bg-layer-panel">Price</TableHead>
                  <TableHead className="w-20 text-right bg-layer-panel">Stock</TableHead>
                  <TableHead className="w-20 hidden 2xl:table-cell text-right bg-layer-panel">Unit</TableHead>
                  <TableHead className="w-24 hidden lg:table-cell text-right bg-layer-panel">Location</TableHead>
                  <TableHead className="w-28 text-right bg-layer-panel">Status</TableHead>
                  <TableHead className="w-24 pr-7 text-right bg-layer-panel">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <AnimatePresence mode="popLayout">
                  {filteredProducts.length > 0 ? (
                    filteredProducts.map((p) => (
                      <ProductRow
                        key={p.id}
                        product={p}
                        expanded={expandedId === p.id}
                        onToggle={() =>
                          setExpandedId((current) =>
                            current === p.id ? null : p.id
                          )
                        }
                      />
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={14} className="h-48 text-center p-12">
                        <motion.div
                          key="empty-state"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <p className="font-body text-transform-secondary text-muted-foreground">
                            No products match your filters.
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
            <span className="text-transform-secondary">Show</span>
            <Select defaultValue="10">
              <SelectTrigger size="sm" className="w-20 font-medium font-body text-transform-secondary bg-layer-panel text-on-surface hover:bg-layer-dialog">
                <SelectValue placeholder="10" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
                <SelectItem value="all">All</SelectItem>
              </SelectContent>
            </Select>
            <span className="text-transform-secondary">products per page</span>
          </div>
          <Pagination className="mx-0 w-auto m-0">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious href="#" />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink href="#" isActive>1</PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
              <PaginationItem>
                <PaginationNext href="#" />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </main>
  );
}
