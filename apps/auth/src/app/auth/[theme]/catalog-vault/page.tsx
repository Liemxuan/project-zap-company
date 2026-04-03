'use client';

import React, { useState, useMemo } from 'react';
import { ColumnDef } from 'zap-design/src/genesis/organisms/table-list';
import { MoreHorizontal, Edit, Copy, Trash2 } from 'lucide-react';
import { SideNav } from 'zap-design/src/genesis/molecules/navigation/SideNav';
import { ThemeHeader } from 'zap-design/src/genesis/molecules/layout/ThemeHeader';

// L1 — Atoms
import { Button } from 'zap-design/src/genesis/atoms/interactive/button';
import { Pill } from 'zap-design/src/genesis/atoms/status/pills';
import { Text } from 'zap-design/src/genesis/atoms/typography/text';
import { Checkbox } from 'zap-design/src/genesis/atoms/interactive/checkbox';

// L2 — Molecules
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'zap-design/src/genesis/molecules/dropdown-menu';

// L3 — Organism
import { TableList } from 'zap-design/src/genesis/organisms/table-list';

// ── Types ────────────────────────────────────────────────────────────────────

type CatalogItem = {
    id: string;
    name: string;
    type: string;
    category: string;
    taxRate: number;
    currency: string;
    status: string;
    region: string;
    updatedAt: Date;
};

type Filters = { type: string[]; status: string[]; region: string[] };

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CATALOG: CatalogItem[] = [
    { id: 'cat-001', name: 'Software Licensing Tier A', type: 'LICENSE', category: 'SOFTWARE', taxRate: 0, currency: 'USD', status: 'ACTIVE', region: 'GLOBAL', updatedAt: new Date('2026-03-01') },
    { id: 'cat-002', name: 'Hardware Node — Gen 4', type: 'HARDWARE', category: 'PHYSICAL', taxRate: 8.5, currency: 'USD', status: 'ACTIVE', region: 'US', updatedAt: new Date('2026-02-18') },
    { id: 'cat-003', name: 'EU VAT Rule Set', type: 'TAX_RULE', category: 'COMPLIANCE', taxRate: 20, currency: 'EUR', status: 'ACTIVE', region: 'EU', updatedAt: new Date('2026-02-10') },
    { id: 'cat-004', name: 'Add-On Biometric Pack', type: 'ADD_ON', category: 'SOFTWARE', taxRate: 0, currency: 'USD', status: 'DRAFT', region: 'GLOBAL', updatedAt: new Date('2026-03-15') },
    { id: 'cat-005', name: 'APAC Compliance Bundle', type: 'TAX_RULE', category: 'COMPLIANCE', taxRate: 10, currency: 'SGD', status: 'ACTIVE', region: 'APAC', updatedAt: new Date('2026-01-28') },
    { id: 'cat-006', name: 'Premium Support SLA', type: 'SERVICE', category: 'SERVICES', taxRate: 0, currency: 'USD', status: 'ACTIVE', region: 'GLOBAL', updatedAt: new Date('2026-03-20') },
    { id: 'cat-007', name: 'Legacy Protocol Bridge', type: 'SOFTWARE', category: 'SOFTWARE', taxRate: 0, currency: 'USD', status: 'DEPRECATED', region: 'US', updatedAt: new Date('2025-12-01') },
    { id: 'cat-008', name: 'UK VAT Override', type: 'TAX_RULE', category: 'COMPLIANCE', taxRate: 20, currency: 'GBP', status: 'ACTIVE', region: 'UK', updatedAt: new Date('2026-03-08') },
    { id: 'cat-009', name: 'Audit Trail Module', type: 'ADD_ON', category: 'SOFTWARE', taxRate: 0, currency: 'USD', status: 'DRAFT', region: 'GLOBAL', updatedAt: new Date('2026-03-22') },
    { id: 'cat-010', name: 'Kiosk Hardware Kit', type: 'HARDWARE', category: 'PHYSICAL', taxRate: 8.5, currency: 'USD', status: 'ACTIVE', region: 'US', updatedAt: new Date('2026-02-28') },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AuthCatalogVaultPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({ type: [], status: [], region: [] });

    const handleFilterChange = (groupId: string, optionId: string) => {
        const key = groupId as keyof Filters;
        setFilters((prev) => ({
            ...prev,
            [key]: prev[key].includes(optionId)
                ? prev[key].filter((v) => v !== optionId)
                : [...prev[key], optionId],
        }));
    };

    const filteredItems = useMemo(() =>
        MOCK_CATALOG.filter((item) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = item.name.toLowerCase().includes(q) || item.id.toLowerCase().includes(q);
            const matchType = filters.type.length === 0 || filters.type.includes(item.type);
            const matchStatus = filters.status.length === 0 || filters.status.includes(item.status);
            const matchRegion = filters.region.length === 0 || filters.region.includes(item.region);
            return matchSearch && matchType && matchStatus && matchRegion;
        }),
        [searchQuery, filters]
    );

    const filterGroups = useMemo(() => [
        {
            id: 'type',
            title: 'Type',
            options: Array.from(new Set(MOCK_CATALOG.map((c) => c.type))).map((t) => ({ id: t, label: t.replace(/_/g, ' ') })),
        },
        {
            id: 'status',
            title: 'Status',
            options: [
                { id: 'ACTIVE', label: 'ACTIVE' },
                { id: 'DRAFT', label: 'DRAFT' },
                { id: 'DEPRECATED', label: 'DEPRECATED' },
            ],
        },
        {
            id: 'region',
            title: 'Region',
            options: Array.from(new Set(MOCK_CATALOG.map((c) => c.region))).map((r) => ({ id: r, label: r })),
        },
    ], []);

    const columns = useMemo<ColumnDef<CatalogItem>[]>(() => [
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
            header: 'CATALOG ENTRY',
            cell: ({ row }) => (
                <div className="flex flex-col gap-0.5">
                    <span className="font-body font-medium text-foreground text-transform-secondary">
                        {row.getValue('name') as string}
                    </span>
                    <span className="font-dev text-[10px] text-on-surface-variant tracking-wider">
                        {row.original.id}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: 'type',
            header: 'TYPE',
            cell: ({ row }) => (
                <span className="font-dev text-xs text-on-surface-variant">
                    {(row.getValue('type') as string).replace(/_/g, ' ')}
                </span>
            ),
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const val = row.getValue('status') as string;
                return (
                    <Pill
                        variant={val === 'ACTIVE' ? 'success' : val === 'DRAFT' ? 'info' : 'neutral'}
                        className="min-w-20 shadow-none uppercase"
                    >
                        {val}
                    </Pill>
                );
            },
        },
        {
            accessorKey: 'region',
            header: 'REGION',
            cell: ({ row }) => (
                <span className="font-dev text-xs text-on-surface-variant">{row.getValue('region') as string}</span>
            ),
        },
        {
            accessorKey: 'taxRate',
            header: () => <div className="text-right">TAX RATE</div>,
            cell: ({ row }) => {
                const rate = row.getValue('taxRate') as number;
                return (
                    <div className="text-right font-dev text-sm text-on-surface-variant">
                        {rate > 0 ? `${rate}%` : <span className="opacity-40">—</span>}
                    </div>
                );
            },
        },
        {
            accessorKey: 'currency',
            header: 'CCY',
            cell: ({ row }) => (
                <span className="font-dev text-xs font-bold text-primary">{row.getValue('currency') as string}</span>
            ),
        },
        {
            accessorKey: 'updatedAt',
            header: 'LAST UPDATED',
            cell: ({ row }) => (
                <div className="font-dev text-xs text-muted-foreground">
                    {(row.getValue('updatedAt') as Date).toDateString()}
                </div>
            ),
        },
        {
            id: 'actions',
            cell: () => (
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
                                <Text as="span" size="label-medium" className="text-transform-tertiary">Edit Entry</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer">
                                <Copy className="mr-2 h-4 w-4" />
                                <Text as="span" size="label-medium" className="text-transform-tertiary">Duplicate</Text>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="cursor-pointer text-destructive focus:bg-destructive/10 focus:text-destructive">
                                <Trash2 className="mr-2 h-4 w-4" />
                                <Text as="span" size="label-medium" className="text-transform-tertiary">Delete</Text>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            ),
            size: 48,
        },
    ], []);

    return (
        <div className="flex h-screen w-full bg-layer-canvas overflow-hidden font-sans">

            {/* Sidebar */}
            <SideNav />

            {/* Main */}
            <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

                {/* Header */}
                <ThemeHeader
                    title="Catalog Vault"
                    breadcrumb="zap auth / catalog vault"
                    badge={null}
                    showBackground={false}
                />

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col px-4 lg:px-12 pt-8 pb-4">
                    <h2 className="text-2xl font-bold font-display text-on-surface mb-6 shrink-0">
                        Catalog Vault
                    </h2>
                    <div className="flex-1 overflow-hidden">
                        <TableList
                            columns={columns}
                            data={filteredItems}
                            filterGroups={filterGroups}
                            activeFilters={{ type: filters.type, status: filters.status, region: filters.region }}
                            onFilterChange={handleFilterChange}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            searchPlaceholder="Search catalog entries..."
                            emptyMessage="No catalog entries match your filters."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
