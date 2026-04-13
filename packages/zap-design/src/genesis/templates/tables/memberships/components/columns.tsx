import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Membership } from '@/services/membership/membership.model';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2, CreditCard, Calendar, Gift } from "lucide-react";
import { Text } from '@/genesis/atoms/typography/text';

/**
 * Get columns definition for Memberships table
 */
export const getColumns = ({
    onAction
}: {
    onAction: (type: string, item: Membership) => void;
}): ColumnDef<Membership>[] => [
        {
            id: "select",
            header: ({ table }) => (
                <div className="w-10 flex justify-center">
                    <Checkbox
                        checked={table.getIsAllPageRowsSelected()}
                        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                        aria-label="Select all"
                    />
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-10 flex justify-center">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "tier",
            header: ({ column }) => (
                <div
                    className="w-48 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tier
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-48 py-2.5">
                    <Text size='label-small' className='font-bold text-foreground'>
                        {row.original.tier}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "tier_price",
            header: ({ column }) => (
                <div
                    className="w-32 text-right pr-4 font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Tier price
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5 pr-4 flex items-center justify-end gap-1.5">
                    <CreditCard size={14} className="text-primary/70" />
                    <Text size='label-small' className='font-mono font-medium text-foreground'>
                        {new Intl.NumberFormat('vi-VN').format(row.original.tier_price || 0)}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "billing_cycle",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Billing cycle
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    <Text size='label-small' className='text-muted-foreground'>
                        {row.original.billing_cycle}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "benefit",
            header: ({ column }) => (
                <div
                    className="w-64 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Benefit                </div>
            ),
            cell: ({ row }) => (
                <div className="w-64 py-2.5 flex items-start gap-2">
                    <Gift size={14} className="text-teal-500/70 mt-0.5 shrink-0" />
                    <Text size='label-small' className='text-on-surface-variant line-clamp-2'>
                        {row.original.benefit}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "is_active",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                </div>
            ),
            cell: ({ row }) => {
                const isActive = row.original.is_active;
                return (
                    <div className="w-32 py-2.5">
                        <div className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 border ${isActive
                            ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600'
                            : 'bg-rose-500/10 border-rose-500/20 text-rose-600'
                            }`}>
                            <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                            <span className="text-[10px] font-bold uppercase tracking-widest">
                                {isActive ? 'Active' : 'Inactive'}
                            </span>
                        </div>
                    </div>
                );
            },
        },
        {
            id: "actions",
            header: () => (
                <div className="w-20 text-right pr-6 font-mono text-[10px] tracking-widest text-muted-foreground uppercase">

                </div>
            ),
            cell: ({ row }) => (
                <div className="w-20 text-right pr-4 py-2.5">
                    <QuickActionsDropdown
                        actions={[
                            { label: 'Edit', icon: Pencil, onClick: () => onAction('edit', row.original) },
                            { label: 'Delete', icon: Trash2, onClick: () => onAction('delete', row.original), variant: 'destructive' },
                        ]}
                    />
                </div>
            ),
        },
    ];
