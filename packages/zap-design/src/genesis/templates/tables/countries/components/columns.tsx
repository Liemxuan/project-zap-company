import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Country } from '@/services/country/country.model';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2, Globe, Phone, DollarSign } from "lucide-react";
import { Text } from '@/genesis/atoms/typography/text';
import { Avatar } from '@/genesis/atoms/status/avatars';

/**
 * Get columns definition for Countries table
 */
export const getColumns = ({
    onAction
}: {
    onAction: (type: string, item: Country) => void;
}): ColumnDef<Country>[] => [
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
            accessorKey: "code",
            header: ({ column }) => (
                <div
                    className="w-24 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate uppercase">Code</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
                    {row.original.code}
                </div>
            ),
        },
        {
            accessorKey: "name",
            header: ({ column }) => (
                <div
                    className="w-64 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Name</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-64 py-2.5 flex items-center gap-3">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                        <Avatar
                            initials={row.original.acronymn}
                            size="sm"
                            className="w-full h-full object-cover border-[1px] border-border"
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <Text size='label-small' className='font-semibold text-foreground truncate'>
                            {row.original.name}
                        </Text>
                    </div>
                </div>
            ),
        },
        {
            accessorKey: "phone_code",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Phone Code</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 flex items-center gap-2">
                    <Phone size={14} className="text-muted-foreground" />
                    <Text size='label-small' className='text-muted-foreground font-mono'>
                        {row.original.phone_code}
                    </Text>
                </div>
            ),
        },
        {
            accessorKey: "currency",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Currency</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 flex items-center gap-2">
                    <DollarSign size={14} className="text-emerald-500/70" />
                    <Text size='label-small' className='text-on-surface-variant font-mono'>
                        {row.original.currency}
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
                    <Text size='label-small' className='font-semibold'>Status</Text>
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
            cell: ({ row }) => (
                <div className="w-20 text-right pr-4 py-2.5 ml-auto">
                    <QuickActionsDropdown
                        actions={[
                            { label: 'Edit', icon: Pencil, onClick: () => onAction('edit', row.original) },
                            { label: 'Duplicate', icon: Copy, onClick: () => onAction('duplicate', row.original) },
                            { label: 'Delete', icon: Trash2, onClick: () => onAction('delete', row.original), variant: 'destructive' },
                        ]}
                    />
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];
