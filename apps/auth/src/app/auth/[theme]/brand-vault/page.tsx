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
import { Avatar, AvatarFallback } from 'zap-design/src/genesis/atoms/interactive/avatar';

// L2 — Molecules
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from 'zap-design/src/genesis/molecules/dropdown-menu';

// L3 — Organism
import { TableList } from 'zap-design/src/genesis/organisms/table-list';

// ── Types ────────────────────────────────────────────────────────────────────

type BrandEntry = {
    id: string;
    name: string;
    slug: string;
    tier: string;
    industry: string;
    region: string;
    status: string;
    locations: number;
    owner: string;
    createdAt: Date;
};

type Filters = { tier: string[]; status: string[]; industry: string[] };

// ── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_BRANDS: BrandEntry[] = [
    { id: 'brd-001', name: 'Acme Corp', slug: 'acme-corp', tier: 'ENTERPRISE', industry: 'RETAIL', region: 'US', status: 'ACTIVE', locations: 48, owner: 'Zeus Tom', createdAt: new Date('2025-06-01') },
    { id: 'brd-002', name: 'Nova Foods', slug: 'nova-foods', tier: 'GROWTH', industry: 'F&B', region: 'APAC', status: 'ACTIVE', locations: 12, owner: 'Jane Doe', createdAt: new Date('2025-08-15') },
    { id: 'brd-003', name: 'Volt Retail', slug: 'volt-retail', tier: 'ENTERPRISE', industry: 'RETAIL', region: 'EU', status: 'ACTIVE', locations: 31, owner: 'Zeus Tom', createdAt: new Date('2025-09-10') },
    { id: 'brd-004', name: 'Sparq Labs', slug: 'sparq-labs', tier: 'STARTUP', industry: 'TECH', region: 'US', status: 'DRAFT', locations: 1, owner: 'John Smith', createdAt: new Date('2026-01-20') },
    { id: 'brd-005', name: 'Meridian Health', slug: 'meridian-health', tier: 'GROWTH', industry: 'HEALTHCARE', region: 'UK', status: 'ACTIVE', locations: 8, owner: 'Jane Doe', createdAt: new Date('2025-11-03') },
    { id: 'brd-006', name: 'Dusk Hospitality', slug: 'dusk-hospitality', tier: 'ENTERPRISE', industry: 'HOSPITALITY', region: 'APAC', status: 'ACTIVE', locations: 22, owner: 'Zeus Tom', createdAt: new Date('2025-07-19') },
    { id: 'brd-007', name: 'Iron Gate Finance', slug: 'iron-gate-finance', tier: 'GROWTH', industry: 'FINANCE', region: 'US', status: 'SUSPENDED', locations: 5, owner: 'John Smith', createdAt: new Date('2025-10-01') },
    { id: 'brd-008', name: 'Bloom Wellness', slug: 'bloom-wellness', tier: 'STARTUP', industry: 'HEALTHCARE', region: 'EU', status: 'DRAFT', locations: 2, owner: 'Jane Doe', createdAt: new Date('2026-02-14') },
    { id: 'brd-009', name: 'Apex Logistics', slug: 'apex-logistics', tier: 'ENTERPRISE', industry: 'LOGISTICS', region: 'GLOBAL', status: 'ACTIVE', locations: 67, owner: 'Zeus Tom', createdAt: new Date('2025-05-22') },
    { id: 'brd-010', name: 'Crest Auto', slug: 'crest-auto', tier: 'GROWTH', industry: 'AUTOMOTIVE', region: 'US', status: 'ACTIVE', locations: 14, owner: 'John Smith', createdAt: new Date('2025-12-08') },
];

// ── Page ─────────────────────────────────────────────────────────────────────

export default function AuthBrandVaultPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState<Filters>({ tier: [], status: [], industry: [] });

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
        MOCK_BRANDS.filter((item) => {
            const q = searchQuery.toLowerCase();
            const matchSearch = item.name.toLowerCase().includes(q) || item.slug.toLowerCase().includes(q);
            const matchTier = filters.tier.length === 0 || filters.tier.includes(item.tier);
            const matchStatus = filters.status.length === 0 || filters.status.includes(item.status);
            const matchIndustry = filters.industry.length === 0 || filters.industry.includes(item.industry);
            return matchSearch && matchTier && matchStatus && matchIndustry;
        }),
        [searchQuery, filters]
    );

    const filterGroups = useMemo(() => [
        {
            id: 'tier',
            title: 'Tier',
            options: [
                { id: 'ENTERPRISE', label: 'ENTERPRISE' },
                { id: 'GROWTH', label: 'GROWTH' },
                { id: 'STARTUP', label: 'STARTUP' },
            ],
        },
        {
            id: 'status',
            title: 'Status',
            options: [
                { id: 'ACTIVE', label: 'ACTIVE' },
                { id: 'DRAFT', label: 'DRAFT' },
                { id: 'SUSPENDED', label: 'SUSPENDED' },
            ],
        },
        {
            id: 'industry',
            title: 'Industry',
            options: Array.from(new Set(MOCK_BRANDS.map((b) => b.industry))).map((i) => ({ id: i, label: i })),
        },
    ], []);

    const columns = useMemo<ColumnDef<BrandEntry>[]>(() => [
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
            header: 'BRAND',
            cell: ({ row }) => (
                <div className="flex items-center gap-3">
                    <Avatar className="size-9">
                        <AvatarFallback className="text-[11px] font-bold bg-primary/10 text-primary">
                            {(row.getValue('name') as string).slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col gap-0.5">
                        <span className="font-body font-medium text-foreground text-transform-secondary">
                            {row.getValue('name') as string}
                        </span>
                        <span className="font-dev text-[10px] text-on-surface-variant tracking-wider">
                            {row.original.slug}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: 'tier',
            header: 'TIER',
            cell: ({ row }) => {
                const val = row.getValue('tier') as string;
                return (
                    <Pill
                        variant={val === 'ENTERPRISE' ? 'primary' : val === 'GROWTH' ? 'info' : 'neutral'}
                        className="min-w-20 shadow-none uppercase"
                    >
                        {val}
                    </Pill>
                );
            },
        },
        {
            accessorKey: 'status',
            header: 'STATUS',
            cell: ({ row }) => {
                const val = row.getValue('status') as string;
                return (
                    <Pill
                        variant={val === 'ACTIVE' ? 'success' : val === 'DRAFT' ? 'info' : 'error'}
                        className="min-w-20 shadow-none uppercase"
                    >
                        {val}
                    </Pill>
                );
            },
        },
        {
            accessorKey: 'industry',
            header: 'INDUSTRY',
            cell: ({ row }) => (
                <span className="font-dev text-xs text-on-surface-variant">{row.getValue('industry') as string}</span>
            ),
        },
        {
            accessorKey: 'region',
            header: 'REGION',
            cell: ({ row }) => (
                <span className="font-dev text-xs text-on-surface-variant">{row.getValue('region') as string}</span>
            ),
        },
        {
            accessorKey: 'locations',
            header: () => <div className="text-right flex-1">LOCATIONS</div>,
            cell: ({ row }) => (
                <div className="text-right font-dev text-sm font-bold text-primary">
                    {row.getValue('locations') as number}
                </div>
            ),
        },
        {
            accessorKey: 'owner',
            header: 'OWNER',
            cell: ({ row }) => (
                <span className="font-body text-xs text-on-surface-variant">{row.getValue('owner') as string}</span>
            ),
        },
        {
            accessorKey: 'createdAt',
            header: 'CREATED',
            cell: ({ row }) => (
                <div className="font-dev text-xs text-muted-foreground">
                    {(row.getValue('createdAt') as Date).toDateString()}
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
                                <Text as="span" size="label-medium" className="text-transform-tertiary">Edit Brand</Text>
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
                    title="Brand Vault"
                    breadcrumb="zap auth / brand vault"
                    badge={null}
                    showBackground={false}
                />

                {/* Content */}
                <div className="flex-1 overflow-hidden flex flex-col px-4 lg:px-12 pt-8 pb-4">
                    <h2 className="text-2xl font-bold font-display text-on-surface mb-6 shrink-0">
                        Brand Vault
                    </h2>
                    <div className="flex-1 overflow-hidden">
                        <TableList
                            columns={columns}
                            data={filteredItems}
                            filterGroups={filterGroups}
                            activeFilters={{ tier: filters.tier, status: filters.status, industry: filters.industry }}
                            onFilterChange={handleFilterChange}
                            searchQuery={searchQuery}
                            onSearchChange={setSearchQuery}
                            searchPlaceholder="Search brands by name or slug..."
                            emptyMessage="No brands match your filters."
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
