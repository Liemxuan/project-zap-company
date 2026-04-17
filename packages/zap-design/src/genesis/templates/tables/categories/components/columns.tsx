'use client';

import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { Text } from '@/genesis/atoms/typography/text';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Pill } from '@/genesis/atoms/status/pills';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2, Eye } from "lucide-react";

interface GetColumnsProps {
    t: any;
    handleAction: (type: string, item: any) => void;
}

export const getColumns = ({ t, handleAction }: GetColumnsProps): ColumnDef<any>[] => [
    {
        id: "select",
        header: ({ table }) => (
            <div className="w-12 px-7">
                <Checkbox
                    checked={
                        table.getIsAllPageRowsSelected() ||
                        (table.getIsSomePageRowsSelected() && "indeterminate")
                    }
                    onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
                    aria-label="Select all"
                    className="translate-y-0.5"
                />
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-12 px-7">
                <Checkbox
                    checked={row.getIsSelected()}
                    onCheckedChange={(value) => row.toggleSelected(!!value)}
                    aria-label="Select row"
                    className="translate-y-0.5"
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
                className="w-14 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <Text size='label-small' className="font-semibold text-foreground truncate uppercase">{t.column_id || 'ID'}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-14 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
                {row.original.id}
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "Name",
        accessorKey: "name",
        header: ({ column }) => (
            <div className="w-80 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
                <Text size='label-small' className='font-semibold'>{t.column_name || 'Name'}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-80 py-2.5 text-left">
                <div 
                    className="flex items-center gap-4 cursor-pointer group"
                    onClick={() => handleAction('view', row.original)}
                >
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden rounded-lg bg-surface-variant/30 group-hover:ring-2 group-hover:ring-primary/20 transition-all">
                        <Avatar
                            src={row.original.media_url}
                            initials={row.original.acronymn}
                            size="sm"
                            fallback={row.original.acronymn}
                            className="w-full h-full object-cover border-[1px] border-border"
                        />
                    </div>
                    <div className="flex flex-col min-w-0">
                        <Text size='label-small' className='font-semibold text-foreground truncate group-hover:text-primary transition-colors'>
                            {row.original.name}
                        </Text>
                    </div>
                </div>
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "Items",
        accessorKey: "item_count",
        header: ({ column }) => (
            <div
                className="w-32 text-right pr-4 tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <Text size='label-small' className='font-semibold'>{t.column_itemCount || 'Items'}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-32 text-right py-2.5 pr-4">
                <span className="font-bold text-foreground">{row.original.item_count}</span>
            </div>
        ),
    },
    {
        id: "Status",
        accessorKey: "is_active",
        header: ({ column }) => (
            <div
                className="w-20 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <Text size='label-small' className='font-semibold'>{t.column_status || 'Status'}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-20 text-left py-2.5">
                <Pill
                    variant={row.original.is_active ? 'success' : 'warning'}
                    className="whitespace-nowrap w-fit ml-auto"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                    {row.original.is_active ? (t.status_active || 'Active') : (t.status_inactive || 'Inactive')}
                </Pill>
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
    {
        id: "actions",
        header: () => <div className="w-24 pr-7" />,
        cell: ({ row }) => (
            <div className="w-24 pr-7 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-end">
                    <QuickActionsDropdown
                        actions={[
                            { label: t.action_view || 'View Detail', icon: Eye, onClick: () => handleAction('view', row.original) },
                            { label: t.action_edit || 'Edit', icon: Pencil, onClick: () => handleAction('edit', row.original) },
                            { label: t.action_duplicate || 'Duplicate', icon: Copy, onClick: () => handleAction('duplicate', row.original) },
                            { label: t.action_delete || 'Delete', icon: Trash2, onClick: () => handleAction('delete', row.original), variant: 'destructive' },
                        ]}
                    />
                </div>
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
];
