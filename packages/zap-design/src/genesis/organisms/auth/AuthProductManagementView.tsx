'use client';

import { AnimatePresence, motion } from "framer-motion";
import { ShoppingBag, MoreHorizontal, Edit, Copy, Trash2 } from "lucide-react";
import { useMemo, useState, useEffect, useCallback } from "react";
import { getProductsAction } from '@olympus/zap-auth/src/actions';

import { Button } from '@/genesis/atoms/interactive/button';
import { Icon } from '@/genesis/atoms/icons/Icon';
import { Pill } from '@/genesis/atoms/status/pills';
import { Text } from '@/genesis/atoms/typography/text';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/genesis/molecules/dropdown-menu';
import { TableList } from '@/genesis/organisms/table-list';
import { ColumnDef } from "@tanstack/react-table";
import { Avatar, AvatarImage, AvatarFallback } from '@/genesis/atoms/interactive/avatar';


type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  sku: string;
  category: string | null;
  status: string;
  stock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
};

type Filters = {
  status: string[];
  category: string[];
};

export function AuthProductManagementView({
  searchQuery,
  setSearchQuery,
  filters,
  onFilterChange,
  onCategoriesLoaded,
}: {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Filters;
  onFilterChange?: (groupId: string, optionId: string) => void;
  onCategoriesLoaded?: (categories: string[]) => void;
}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const MOCK_PRODUCTS: Product[] = [
      { id: '1', name: 'ZAP Access License (Annual)', description: 'Enterprise user authentication node.', price: 12000, sku: 'ZAP-AUTH-ANNUAL', category: 'LICENSING', status: 'ACTIVE', stock: 999, imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
      { id: '2', name: 'ZAP Core Node Cluster', description: 'Dedicated physical hardware token server.', price: 45000, sku: 'ZAP-NODE-V1', category: 'HARDWARE', status: 'DRAFT', stock: 5, imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
      { id: '3', name: 'Biometric Security Module', description: 'Retinal and fingerprint expansion interface.', price: 2999, sku: 'ZAP-BIO-MOD', category: 'ADD-ONS', status: 'ACTIVE', stock: 12, imageUrl: 'https://images.unsplash.com/photo-1614064641913-6b7140f0eb85?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
      { id: '4', name: 'Legacy OIDC Bridge', description: 'Translation layer for outdated protocols.', price: 500, sku: 'ZAP-OIDC-LEGACY', category: 'SOFTWARE', status: 'OUT_OF_STOCK', stock: 0, imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
      { id: '5', name: 'ZAP Premium Support Block', description: '100 hours of direct CSO-level architectural support.', price: 150000, sku: 'ZAP-P-SUPPORT', category: 'SERVICES', status: 'ACTIVE', stock: 3, imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
    ];

    getProductsAction().then((res: Product[]) => {
      const data = res && res.length > 0 ? res : MOCK_PRODUCTS;
      setProducts(data);
      if (onCategoriesLoaded) {
        onCategoriesLoaded(Array.from(new Set(data.map(p => p.category).filter(Boolean) as string[])));
      }
      setLoading(false);
    }).catch(err => {
      console.error('Failed to fetch products:', err);
      // Fallback to mock data if database is not ready
      setProducts(MOCK_PRODUCTS);
      if (onCategoriesLoaded) {
        onCategoriesLoaded(Array.from(new Set(MOCK_PRODUCTS.map(p => p.category).filter(Boolean) as string[])));
      }
      setLoading(false);
    });
  }, [onCategoriesLoaded]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const lowerQuery = searchQuery.toLowerCase();
      const matchSearch =
        (p.name || "").toLowerCase().includes(lowerQuery) ||
        (p.sku || "").toLowerCase().includes(lowerQuery);

      const matchStatus =
        filters.status.length === 0 || filters.status.includes(p.status);

      return matchSearch && matchStatus;
    });
  }, [filters, searchQuery, products]);

  const columns = useMemo<ColumnDef<Product>[]>(() => [
    {
      id: "select",
      header: ({ table }) => (
        <div className="flex justify-center ml-2 px-2">
          <Checkbox
            checked={table.getIsAllPageRowsSelected()}
            onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
            aria-label="Select all"
          />
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex justify-center ml-2 px-2">
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label="Select row"
          />
        </div>
      ),
      size: 48,
    },

    {
      accessorKey: "name",
      header: "PRODUCT NAME",
      cell: ({ row }) => (
        <div className="flex items-center gap-3">
          <Avatar className="size-12">
            {row.original.imageUrl ? (
              <AvatarImage src={row.original.imageUrl} alt={row.getValue("name")} />
            ) : (
              <AvatarFallback>{row.getValue("name")}</AvatarFallback>
            )}
          </Avatar>
          <span className="font-body text-transform-secondary font-medium text-foreground truncate max-w-[150px] block">
            {row.getValue("name") as string}
          </span>
        </div>
      )
    },
    {
      accessorKey: "sku",
      header: "SKU",
      cell: ({ row }) => <span className="font-dev text-on-surface-variant text-xs">{row.getValue("sku") as string}</span>
    },
    {
      accessorKey: "status",
      header: "STATUS",
      cell: ({ row }) => {
        const val = row.getValue("status") as string;
        return (
          <Pill variant={val === 'ACTIVE' ? 'success' : val === 'DRAFT' ? 'info' : 'warning'} className="min-w-16 shadow-none uppercase">
            {val}
          </Pill>
        );
      }
    },

    {
      accessorKey: "price",
      header: () => <div className="text-right">PRICE</div>,
      cell: ({ row }) => (
        <div className="text-right font-body font-bold text-primary">
          ${(row.getValue("price") as number).toFixed(2)}
        </div>
      )
    },
    {
      accessorKey: "stock",
      header: () => <div className="text-right">STOCK</div>,
      cell: ({ row }) => {
        const stock = row.getValue("stock") as number;
        return (
          <div className={`text-right font-dev ${stock < 10 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
            {stock} UNIT
          </div>
        );
      }
    },
    {
      accessorKey: "createdAt",
      header: "CREATED AT",
      cell: ({ row }) => {
        const createdAt = row.getValue("createdAt") as Date;
        return (
          <div className={`font-dev text-muted-foreground`}>
            {createdAt.toDateString()}
          </div>
        );
      }
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <div className="flex justify-end pr-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="dim" shape="circle" size="sm" className="h-8 w-8 border-none outline-none" mode="link">
                <MoreHorizontal className="h-4 w-4 text-on-surface-variant group-hover:text-primary transition-colors" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-[160px] bg-layer-dialog">
              <DropdownMenuItem onClick={() => console.log('Edit', row.original)} className="cursor-pointer">
                <Edit className="mr-2 h-4 w-4" />
                <Text as="span" size="label-medium" className="text-transform-tertiary">Edit SKU</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Duplicate', row.original)} className="cursor-pointer">
                <Copy className="mr-2 h-4 w-4" />
                <Text as="span" size="label-medium" className="text-transform-tertiary">Duplicate</Text>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => console.log('Delete', row.original)} className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                <Trash2 className="mr-2 h-4 w-4" />
                <Text as="span" size="label-medium" className="text-transform-tertiary">Delete Record</Text>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ),
      size: 48,
    }
  ], [expandedId]);

  const activeFilters: Record<string, string[]> = {
    status: filters.status,
    category: filters.category,
  };

  const filterGroups = [
    {
      id: 'status',
      title: 'status',
      options: [
        { id: 'ACTIVE', label: 'ACTIVE' },
        { id: 'DRAFT', label: 'DRAFT' },
        { id: 'OUT_OF_STOCK', label: 'OUT OF STOCK' },
      ],
    },
  ];

  if (loading) {
    return (
      <main className="w-full flex items-center justify-center min-h-[300px] bg-transparent">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
          <Text size="dev-wrapper" className="text-muted-foreground uppercase text-transform-tertiary">Inventory Sync...</Text>
        </div>
      </main>
    );
  }

  return (
    <main className="w-full h-full flex flex-col bg-transparent overflow-hidden transition-all duration-300">
      <div className="flex h-full flex-col">
        <TableList
          columns={columns}
          data={filteredProducts}
          filterGroups={filterGroups}
          activeFilters={activeFilters}
          onFilterChange={onFilterChange}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Search products by SKU or name..."
          emptyMessage="No products found."
        />
      </div>

      <AnimatePresence>
        {expandedId && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-full max-w-2xl z-50 px-4 pointer-events-none"
          >
            <div className="bg-layer-panel border border-border shadow-2xl rounded-2xl p-6 pointer-events-auto">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <ShoppingBag className="h-4 w-4 text-primary" />
                  <Text weight="bold" className="text-transform-primary tracking-widest text-xs">SKU VAULT: {products.find(p => p.id === expandedId)?.sku}</Text>
                </div>
                <Button variant="ghost" size="sm" onClick={() => setExpandedId(null)}>
                  <Icon name="close" size={16} />
                </Button>
              </div>
              {(() => {
                const product = products.find(p => p.id === expandedId);
                if (!product) return null;
                return (
                  <div className="space-y-4">
                    <div className="bg-layer-cover rounded-xl p-4 border border-outline-variant/30">
                      <Text size="xs" className="mb-2 font-display uppercase tracking-widest text-[9px] font-bold text-muted-foreground">Product Narrative</Text>
                      <Text className="font-body text-sm leading-relaxed">{product.description || "No description provided for this SKU."}</Text>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-layer-base rounded-lg p-3 border border-border/50">
                        <Text size="xs" className="mb-1 font-display uppercase tracking-widest text-[9px] font-bold text-muted-foreground">Category</Text>
                        <Text className="font-dev text-sm">{product.category || 'UNASSIGNED'}</Text>
                      </div>
                      <div className="bg-layer-base rounded-lg p-3 border border-border/50">
                        <Text size="xs" className="mb-1 font-display uppercase tracking-widest text-[9px] font-bold text-muted-foreground">Last Valuation</Text>
                        <Text className="font-dev text-sm">${product.price.toFixed(2)}</Text>
                      </div>
                      <div className="bg-layer-base rounded-lg p-3 border border-border/50">
                        <Text size="xs" className="mb-1 font-display uppercase tracking-widest text-[9px] font-bold text-muted-foreground">Vault Sync</Text>
                        <Text className="font-dev text-sm">{new Date(product.updatedAt).toLocaleTimeString()}</Text>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
