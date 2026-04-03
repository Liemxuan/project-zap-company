'use client';

import React, { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useTheme } from '../../../components/ThemeContext';
import { ComponentSandboxTemplate } from '../../../zap/layout/ComponentSandboxTemplate';
import { CanvasDesktop } from '../../../components/dev/CanvasDesktop';
import { SideNav } from '../../molecules/navigation/SideNav';
import { ThemeHeader } from '../../molecules/layout/ThemeHeader';
import { Icon } from '../../atoms/icons/Icon';
import { Text } from '../../atoms/typography/text';
import { Pill } from '../../atoms/status/pills';
import { Checkbox } from '../../atoms/interactive/checkbox';
import { Avatar, AvatarFallback, AvatarImage } from '../../atoms/interactive/avatar';
import { Button } from '../../atoms/interactive/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../molecules/dropdown-menu';
import { TableList, ColumnDef } from '../../organisms/table-list';
import { MoreHorizontal, Edit, Copy, Trash2, Archive, LayoutDashboard, Users } from 'lucide-react';

// ── Sample Data ──────────────────────────────────────────────────────────────

type Product = {
    id: string;
    name: string;
    price: number;
    sku: string;
    category: string;
    status: string;
    stock: number;
    imageUrl?: string;
    createdAt: Date;
};

const SAMPLE_PRODUCTS: Product[] = [
    { id: '1', name: 'ZAP Access License (Annual)', price: 12000, sku: 'ZAP-AUTH-ANNUAL', category: 'LICENSING', status: 'ACTIVE', stock: 999, imageUrl: 'https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=100&h=100&fit=crop', createdAt: new Date('2026-01-10') },
    { id: '2', name: 'ZAP Core Node Cluster', price: 45000, sku: 'ZAP-NODE-V1', category: 'HARDWARE', status: 'DRAFT', stock: 5, imageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=100&h=100&fit=crop', createdAt: new Date('2026-01-22') },
    { id: '3', name: 'Biometric Security Module', price: 2999, sku: 'ZAP-BIO-MOD', category: 'ADD-ONS', status: 'ACTIVE', stock: 12, imageUrl: 'https://images.unsplash.com/photo-1614064641913-6b7140f0eb85?w=100&h=100&fit=crop', createdAt: new Date('2026-02-05') },
    { id: '4', name: 'Legacy OIDC Bridge', price: 500, sku: 'ZAP-OIDC-LEGACY', category: 'SOFTWARE', status: 'OUT_OF_STOCK', stock: 0, imageUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=100&h=100&fit=crop', createdAt: new Date('2026-02-14') },
    { id: '5', name: 'ZAP Premium Support Block', price: 150000, sku: 'ZAP-P-SUPPORT', category: 'SERVICES', status: 'ACTIVE', stock: 3, imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop', createdAt: new Date('2026-03-01') },
    { id: '6', name: 'Audit Trail Exporter', price: 1200, sku: 'ZAP-AUDIT-EXP', category: 'SOFTWARE', status: 'ACTIVE', stock: 50, createdAt: new Date('2026-03-10') },
    { id: '7', name: 'Hardware Security Key Bundle', price: 8500, sku: 'ZAP-HSK-BUNDLE', category: 'HARDWARE', status: 'DRAFT', stock: 2, createdAt: new Date('2026-03-18') },
];

type Filters = { status: string[]; category: string[] };

// ── Columns ──────────────────────────────────────────────────────────────────

function useProductColumns(): ColumnDef<Product>[] {
    return useMemo(() => [
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
            header: () => <div className="text-right">PRICE</div>,
            cell: ({ row }) => (
                <div className="text-right font-body font-bold text-primary">
                    ${(row.getValue('price') as number).toFixed(2)}
                </div>
            ),
        },
        {
            accessorKey: 'stock',
            header: () => <div className="text-right">STOCK</div>,
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
                            <DropdownMenuItem className="cursor-pointer">
                                <Edit className="mr-2 h-4 w-4" />
                                <Text as="span" size="label-medium" className="text-transform-tertiary">Edit SKU</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Copy className="mr-2 h-4 w-4" />
                                <Text as="span" size="label-medium" className="text-transform-tertiary">Duplicate</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
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
}

// ── Template ─────────────────────────────────────────────────────────────────

/**
 * TableList Template — L5
 * Renders TableList organism inside the ComponentSandboxTemplate canvas.
 * Route: /design/[theme]/organisms/table-list
 */
export default function TableListTemplate() {
    const { theme: appTheme } = useTheme();
    const activeTheme = appTheme === 'core' ? 'core' : 'metro';
    const searchParams = useSearchParams();
    const isFullscreen = searchParams.get('fullscreen') === 'true';

    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({ status: [], category: [] });
    const columns = useProductColumns();

    const categories = useMemo(
        () => Array.from(new Set(SAMPLE_PRODUCTS.map((p) => p.category))),
        []
    );

    const filteredProducts = useMemo(() =>
        SAMPLE_PRODUCTS.filter((p) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
            const matchStatus = filters.status.length === 0 || filters.status.includes(p.status);
            const matchCategory = filters.category.length === 0 || filters.category.includes(p.category);
            return matchSearch && matchStatus && matchCategory;
        }),
        [searchQuery, filters]
    );

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
        {
            id: 'category',
            title: 'Category',
            options: categories.map((c) => ({ id: c, label: c })),
        },
    ], [categories]);

    const handleFilterChange = (groupId: string, optionId: string) => {
        const key = groupId as keyof Filters;
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key].includes(optionId)
                ? prev[key].filter((v) => v !== optionId)
                : [...prev[key], optionId],
        }));
    };

    // ── Shared layout content ────────────────────────────────────────────────
    const layoutContent = (
        <div className="flex h-full w-full bg-layer-base overflow-hidden font-sans border border-border">

            {/* Sidebar */}
            <div className="w-[240px] flex-shrink-0 border-r border-border bg-layer-panel hidden md:flex flex-col z-10 shadow-sm">
                <div className="h-14 border-b border-border flex items-center px-4 shrink-0 gap-2">
                    <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
                        <Icon name="bolt" size={14} className="text-primary-foreground" />
                    </div>
                    <span className="font-bold text-sm tracking-widest uppercase font-display text-on-surface">ZAP AUTH</span>
                </div>
                <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 text-sm text-on-surface cursor-pointer transition-colors">
                        <LayoutDashboard size={18} className="text-on-surface-variant shrink-0" />
                        <span className="font-medium">Overview</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md hover:bg-surface-variant/40 flex items-center gap-3 text-sm text-on-surface cursor-pointer transition-colors">
                        <Users size={18} className="text-on-surface-variant shrink-0" />
                        <span className="font-medium">Identities</span>
                    </div>
                    <div className="px-3 py-2.5 rounded-md bg-primary/10 text-primary flex items-center gap-3 text-sm cursor-pointer border border-primary/20 relative">
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1/2 bg-primary rounded-r-md" />
                        <Archive size={18} className="shrink-0" />
                        <span className="font-medium">Product Vault</span>
                    </div>
                </div>
                <div className="p-4 border-t border-border mt-auto bg-surface-variant/30">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity">
                        <div className="w-8 h-8 rounded-full bg-layer-base border border-border flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold">ZT</span>
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate text-on-surface">Zeus Tom</span>
                            <span className="text-[10px] text-on-surface-variant truncate tracking-wide">CSO</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
                <div className="h-14 border-b border-border bg-layer-base flex items-center px-4 lg:px-6 justify-between shrink-0 z-10">
                    <div className="flex items-center text-xs lg:text-sm">
                        <span className="text-on-surface-variant">Zap Auth</span>
                        <Icon name="chevron_right" size={16} className="text-on-surface-variant/50 mx-1 shrink-0" />
                        <span className="font-medium text-on-surface">Product Vault</span>
                    </div>
                    <button className="relative w-8 h-8 rounded-full hover:bg-surface-variant flex items-center justify-center transition-colors text-on-surface-variant">
                        <Icon name="notifications" size={18} />
                        <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-success rounded-full" />
                    </button>
                </div>

                <div className="flex-1 overflow-hidden flex flex-col px-4 lg:px-12 pt-8 pb-4">
                    <h2 className="text-2xl font-bold font-display text-on-surface mb-6 shrink-0">
                        Inventory & SKU Vault
                    </h2>
                    <div className="flex-1 overflow-hidden">
                        <TableList
                            columns={columns}
                            data={filteredProducts}
                            filterGroups={filterGroups}
                            activeFilters={{ status: filters.status, category: filters.category }}
                            onFilterChange={handleFilterChange}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            searchPlaceholder="Search by SKU or name..."
                            emptyMessage="No products match your filters."
                        />
                    </div>
                </div>
            </div>
        </div>
    );

    // ── Inspector sidebar controls ────────────────────────────────────────────
    const inspectorControls = (
        <div className="flex flex-col gap-4 px-4 pt-4 w-full">
            <div>
                <p className="text-[10px] font-display font-bold tracking-widest uppercase text-on-surface-variant mb-2">
                    Active Filters
                </p>
                <div className="font-dev text-xs text-on-surface-variant space-y-1">
                    <div>Status: {filters.status.length > 0 ? filters.status.join(', ') : '—'}</div>
                    <div>Category: {filters.category.length > 0 ? filters.category.join(', ') : '—'}</div>
                    <div>Query: {searchQuery || '—'}</div>
                    <div>Rows shown: {filteredProducts.length} / {SAMPLE_PRODUCTS.length}</div>
                </div>
            </div>
        </div>
    );

    // ── Fullscreen mode ──────────────────────────────────────────────────────
    if (isFullscreen) {
        return (
            <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">
                <SideNav />
                <div className="flex-1 flex flex-col min-w-0 bg-transparent relative overflow-hidden">
                    <ThemeHeader
                        title="TABLE LIST ASSEMBLY"
                        breadcrumb="zap design engine / tables / layout"
                        badge="component sandbox"
                        showBackground={false}
                    />
                    <div className="flex-1 overflow-hidden bg-layer-base">
                        {layoutContent}
                    </div>
                </div>
            </div>
        );
    }

    // ── Sandbox mode ─────────────────────────────────────────────────────────
    return (
        <ComponentSandboxTemplate
            componentName="table list"
            tier="L5 TEMPLATE"
            status="Verified"
            filePath="src/genesis/templates/tables/TableListTemplate.tsx"
            importPath="@/genesis/templates/tables/TableListTemplate"
            inspectorControls={inspectorControls}
            hideDataTerminal={true}
            fullWidth={true}
        >
            <div className="w-full flex-1 flex items-center justify-center pt-8">
                <CanvasDesktop
                    title="Table List // Filter Inspector"
                    fullScreenHref={`/design/${activeTheme}/organisms/table-list?fullscreen=true`}
                >
                    {layoutContent}
                </CanvasDesktop>
            </div>
        </ComponentSandboxTemplate>
    );
}
