'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ColumnDef } from 'zap-design/src/genesis/organisms/table-list';
import { MoreHorizontal, Edit, Copy, Trash2, Zap, LayoutDashboard, Users, Archive, Menu, ChevronRight, Bell } from 'lucide-react';
import { getProductsAction } from '@olympus/zap-auth/src/actions';
import { SideNav } from 'zap-design/src/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';
// L1 — Atoms
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from 'zap-design/src/genesis/atoms/interactive/avatar';

// L2 — Molecules
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'zap-design/src/genesis/molecules/dropdown-menu';

// L3 — Organism
import { TableList } from 'zap-design/src/genesis/organisms/table-list';

// ── Types ────────────────────────────────────────────────────────────────────

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

type Filters = { status: string[]; category: string[] };

const MOCK_PRODUCTS: Product[] = [
    { id: '1', name: 'ZAP Access License (Annual)', description: 'Enterprise user authentication node.', price: 12000, sku: 'ZAP-AUTH-ANNUAL', category: 'LICENSING', status: 'ACTIVE', stock: 999, imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
    { id: '2', name: 'ZAP Core Node Cluster', description: 'Dedicated physical hardware token server.', price: 45000, sku: 'ZAP-NODE-V1', category: 'HARDWARE', status: 'DRAFT', stock: 5, imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
    { id: '3', name: 'Biometric Security Module', description: 'Retinal and fingerprint expansion interface.', price: 2999, sku: 'ZAP-BIO-MOD', category: 'ADD-ONS', status: 'ACTIVE', stock: 12, imageUrl: 'https://images.unsplash.com/photo-1614064641913-6b7140f0eb85?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
    { id: '4', name: 'Legacy OIDC Bridge', description: 'Translation layer for outdated protocols.', price: 500, sku: 'ZAP-OIDC-LEGACY', category: 'SOFTWARE', status: 'OUT_OF_STOCK', stock: 0, imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
    { id: '5', name: 'ZAP Premium Support Block', description: '100 hours of direct CSO-level architectural support.', price: 150000, sku: 'ZAP-P-SUPPORT', category: 'SERVICES', status: 'ACTIVE', stock: 3, imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop', createdAt: new Date(), updatedAt: new Date() },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AuthProductManagementPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({ status: [], category: [] });

    // ── Data fetch ──────────────────────────────────────────────────────────
    useEffect(() => {
        getProductsAction()
            .then((res: Product[]) => setProducts(res?.length > 0 ? res : MOCK_PRODUCTS))
            .catch(() => setProducts(MOCK_PRODUCTS))
            .finally(() => setLoading(false));
    }, []);

    // ── Filter handler ──────────────────────────────────────────────────────
    const handleFilterChange = (groupId: string, optionId: string) => {
        const key = groupId as keyof Filters;
        const current = filters[key];
        setFilters({
            ...filters,
            [key]: current.includes(optionId)
                ? current.filter((v) => v !== optionId)
                : [...current, optionId],
        });
    };

    // ── Derived data ────────────────────────────────────────────────────────
    const categories = useMemo(
        () => Array.from(new Set(products.map((p) => p.category).filter(Boolean) as string[])),
        [products]
    );

    const filteredProducts = useMemo(() =>
        products.filter((p) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
            const matchStatus = filters.status.length === 0 || filters.status.includes(p.status);
            const matchCategory = filters.category.length === 0 || filters.category.includes(p.category ?? '');
            return matchSearch && matchStatus && matchCategory;
        }),
        [products, searchQuery, filters]
    );

    // ── Filter groups ───────────────────────────────────────────────────────
    const filterGroups = useMemo(() => [
        {
            id: 'status',
            title: 'Product Status',
            options: [
                { id: 'ACTIVE', label: 'ACTIVE' },
                { id: 'DRAFT', label: 'DRAFT' },
                { id: 'OUT_OF_STOCK', label: 'OUT OF STOCK' },
            ],
        },
        ...(categories.length > 0 ? [{
            id: 'category',
            title: 'Category',
            options: categories.map((c) => ({ id: c, label: c })),
        }] : []),
    ], [categories]);

    // ── Columns ─────────────────────────────────────────────────────────────
    const columns = useMemo<ColumnDef<Product>[]>(() => [
        {
            id: 'select',
            header: ({ table }) => (
                <div className="flex ml-2 px-2">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="flex ml-2 px-2">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(v) => row.toggleSelected(!!v)}
                        aria-label="Select row"
                    />
                </div>
            ),
            size: 48,
        },
        {
            accessorKey: 'name',
            header: 'PRODUCT NAME',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="size-10">
                        {row.original.imageUrl
                            ? <AvatarImage src={row.original.imageUrl} alt={row.getValue('name')} />
                            : <AvatarFallback>{(row.getValue('name') as string).slice(0, 2)}</AvatarFallback>
                        }
                    </Avatar>
                    <span className="font-body text-transform-secondary font-medium text-foreground truncate max-w-[160px] block">
                        {row.getValue('name') as string}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'sku',
            header: 'SKU',
            cell: ({ row }) => (
                <span className="font-dev text-on-surface-variant text-xs">{row.getValue('sku') as string}</span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const val = row.getValue('status') as string;
                return (
                    <Pill variant={val === 'ACTIVE' ? 'success' : val === 'DRAFT' ? 'info' : 'warning'} className="min-w-16 shadow-none uppercase">
                        {val}
                    </Pill>
                );
            },
        },
        {
            accessorKey: 'price',
            header: () => <div className="text-right flex-1">PRICE</div>,
            cell: ({ row }) => (
                <div className="text-right font-body font-bold text-primary">
                    ${(row.getValue('price') as number).toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: 'stock',
            header: () => <div className="text-right flex-1">STOCK</div>,
            cell: ({ row }) => {
                const stock = row.getValue('stock') as number;
                return (
                    <div className={`text-right font-dev ${stock < 10 ? 'text-destructive font-bold' : 'text-muted-foreground'}`}>
                        {stock} UNIT
                    </div>
                );
            },
        },
        {
            accessorKey: 'createdAt',
            header: 'CREATED AT',
            cell: ({ row }) => (
                <div className="font-dev text-muted-foreground">
                    {(row.getValue('createdAt') as Date).toDateString()}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: ({ row }) => (
                <div className="flex justify-end pr-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="dim" shape="circle" size="sm" className="h-8 w-8 border-none outline-none" mode="link">
                                <MoreHorizontal className="h-4 w-4 text-on-surface-variant" />
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
        },
    ], []);

    // ── Render ───────────────────────────────────────────────────────────────
    return (
        <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">

            {/* Sidebar */}
            <SideNav />

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <ThemeHeader
                    title="Product Vault"
                    breadcrumb="zap auth / product vault"
                    badge={null}
                    showBackground={false}
                />
                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col px-4 lg:px-12 pt-8 pb-4">
                    <h2 className="text-2xl font-bold font-display text-on-surface mb-6 shrink-0">
                        Inventory & SKU Vault
                    </h2>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="flex flex-col items-center gap-4">
                                <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
                                <Text size="dev-wrapper" className="text-muted-foreground uppercase text-transform-tertiary">
                                    Inventory Sync...
                                </Text>
                            </div>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-hidden">
                            <TableList
                                columns={columns}
                                data={filteredProducts}
                                filterGroups={filterGroups}
                                activeFilters={{ status: filters.status, category: filters.category }}
                                onFilterChange={handleFilterChange}
                                searchQuery={searchQuery}
                                onSearchChange={setSearchQuery}
                                searchPlaceholder="Search products by SKU or name..."
                                emptyMessage="No products match your filters."
                            />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
