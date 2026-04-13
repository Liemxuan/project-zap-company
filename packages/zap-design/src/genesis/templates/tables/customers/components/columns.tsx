import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Customer } from '@/services/customer/customer.model';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2, Phone, CreditCard, Award, TrendingUp } from "lucide-react";
import { Text } from '@/genesis/atoms/typography/text';
import { Icon } from '@/genesis/atoms/icons/Icon';

/**
 * Get columns definition for Customers table
 */
export const getColumns = ({
    onAction
}: {
    onAction: (type: string, item: Customer) => void;
}): ColumnDef<Customer>[] => [
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
            accessorKey: "name",
            header: ({ column }) => (
                <div
                    className="w-64 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Name
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-64 py-2.5">
                    <Text size='label-small' className='font-bold text-foreground truncate'>
                        {row.original.name}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "phone",
            header: ({ column }) => (
                <div
                    className="w-40 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Phone
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-40 py-2.5 flex items-center gap-2">
                    <Icon name="phone" size={14} className="text-muted-foreground" />
                    <Text size='label-small' className='text-muted-foreground'>
                        {row.original.phone}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "money",
            header: ({ column }) => (
                <div
                    className="w-32 text-right pr-4 font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Money
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5 pr-4 flex items-center justify-end gap-1.5">
                    <Text size='label-small' className='font-mono font-medium'>
                        {new Intl.NumberFormat('vi-VN').format(row.original.money || 0)}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "point",
            header: ({ column }) => (
                <div
                    className="w-24 text-right pr-4 font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Point
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 text-right py-2.5 pr-4 flex items-center justify-end gap-1">
                    <Award size={14} className="text-yellow-500/70" />
                    <span className="text-[12px] font-bold text-foreground">
                        {row.original.point.toLocaleString()}
                    </span>
                </div>
            ),
        },
        {
            accessorKey: "membership",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Membership
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5">
                    <div className="px-2 py-0.5 rounded-full bg-surface-variant border border-border inline-flex items-center gap-1">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                        <span className="text-[10px] font-bold uppercase tracking-wider text-on-surface">
                            {row.original.membership}
                        </span>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "total_spend",
            header: ({ column }) => (
                <div
                    className="w-32 text-right pr-4 font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Total spend
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5 pr-4 flex items-center justify-end gap-1.5">
                    <TrendingUp size={14} className="text-teal-500/70" />
                    <Text size='label-small' className='font-bold text-foreground'>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(row.original.total_spend)}
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
                            { label: 'Duplicate', icon: Copy, onClick: () => onAction('duplicate', row.original) },
                            { label: 'Delete', icon: Trash2, onClick: () => onAction('delete', row.original), variant: 'destructive' },
                        ]}
                    />
                </div>
            ),
        },
    ];
