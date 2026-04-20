import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Membership } from '@/services/membership/membership.model';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2, CreditCard, Calendar, Gift } from "lucide-react";
import { Text } from '@/genesis/atoms/typography/text';
import { Avatar } from '@/genesis/atoms/status/avatars';

/**
 * Get columns definition for Memberships table
 */
export const getColumns = ({
    onAction,
    t
}: {
    onAction: (type: string, item: Membership) => void;
    t: any;
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
            id: "id",
            header: ({ column }) => (
                <div
                    className="w-24 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate text-transform-tertiary">ID</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
                    {row.original.id}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "Name",
            accessorKey: "tier",
            header: ({ column }) => (
                <div
                    className="w-80 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.label_membershipName}</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar
                                initials={row.original.acronymn}
                                size="sm"
                                fallback={row.original.acronymn}
                                className="w-full h-full object-cover border-[1px] border-border"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Text size='label-small' className='font-semibold text-foreground truncate'>
                                {row.original.tier}
                            </Text>
                        </div>
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "tier_price",
            header: ({ column }) => (
                <div
                    className="w-32 text-right pr-4 tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.label_tierPrice}</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5 pr-4 flex items-center justify-end gap-1.5">
                    <Text size='label-small' className='font-dev font-bold text-foreground'>
                        {new Intl.NumberFormat('vi-VN').format(row.original.tier_price || 0)}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "billing_cycle",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.label_billingCycle}</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 flex items-center gap-2">
                    <Calendar size={14} className="text-muted-foreground" />
                    <Text size='label-small' className='text-muted-foreground font-body'>
                        {row.original.billing_cycle}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "benefit",
            header: ({ column }) => (
                <div
                    className="w-64 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.label_benefit}</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-64 py-2.5 flex items-start gap-2">
                    <Gift size={14} className="text-primary mt-0.5 shrink-0 opacity-70" />
                    <Text size='label-small' className='text-on-surface-variant font-body line-clamp-2'>
                        {row.original.benefit}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "is_active",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.label_status}</Text>
                </div>
            ),
            cell: ({ row }) => {
                const isActive = row.original.is_active;
                return (
                    <div className="w-32 py-2.5">
                        <div className={`px-2 py-0.5 rounded-full inline-flex items-center gap-1.5 border ${isActive
                            ? 'bg-success/10 border-success/20 text-success'
                            : 'bg-error/10 border-error/20 text-error'
                            }`}>
                            <div className={`w-1 h-1 rounded-full ${isActive ? 'bg-success' : 'bg-error'}`} />
                            <span className="text-[10px] font-bold text-transform-tertiary tracking-widest">
                                {isActive ? t.status_active : t.status_inactive}
                            </span>
                        </div>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            header: () => (
                <div className="w-20 text-right pr-6 tracking-widest transition-colors">
                    <Text size='label-small' className='font-semibold'>{t.label_action}</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-20 text-right pr-4 py-2.5">
                    <QuickActionsDropdown
                        actions={[
                            { label: t.btn_edit || 'Edit', icon: Pencil, onClick: () => onAction('edit', row.original) },
                            { label: t.btn_delete || 'Delete', icon: Trash2, onClick: () => onAction('delete', row.original), variant: 'destructive' },
                        ]}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];
