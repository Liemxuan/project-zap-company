import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2, GripVertical, LayoutGrid } from "lucide-react";
import { Text } from '@/genesis/atoms/typography/text';

/**
 * Get columns definition for Collections table
 */
export const getColumns = (handlers: {
    t: any;
    onAction: (type: string, item: any) => void;
    onEdit: (item: any) => void;
    onView: (item: any) => void;
}): ColumnDef<any>[] => {
    const { t, onEdit, onView } = handlers;
    return [
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
                    className="w-14 text-right tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate uppercase">{t.column_id}</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-14 truncate font-dev text-transform-tertiary text-muted-foreground text-right py-2.5">
                    {row.original.serial_id || row.original.id}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "Name",
            accessorKey: "name",
            header: ({ column }) => (
                <div
                    className="w-80 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.column_name}</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div
                    className="flex items-center gap-3 py-2.5 cursor-pointer hover:opacity-80 transition-opacity"
                    onClick={() => onView(row.original)}
                >
                    <Avatar
                        src={row.original.image_url}
                        fallback={row.original.name?.substring(0, 2).toUpperCase()}
                        className="h-10 w-10 border border-outline-variant bg-surface overflow-hidden"
                    />
                    <div className="flex flex-col min-w-0">
                        <Text className="font-bold text-on-surface truncate tracking-tight">{row.original.name}</Text>
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "Items",
            accessorKey: "product_count",
            header: ({ column }) => (
                <div
                    className="w-32 text-right pr-4 tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.column_items}</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-right py-2.5 pr-4">
                    <span className="font-bold text-foreground">{row.original.product_count}</span>
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: "Location",
            accessorKey: "locations",
            header: ({ column }) => (
                <div
                    className="w-48 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.column_location}</Text>
                </div>
            ),
            cell: ({ row }) => {
                const locations = row.original.locations;
                const displayText = Array.isArray(locations)
                    ? locations.join(', ')
                    : (locations || 'Global');
                return (
                    <div className="w-48 py-2.5 text-left">
                        <span className="text-on-surface-variant text-sm truncate block">{displayText}</span>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: "Status",
            accessorKey: "is_active",
            header: ({ column }) => (
                <div
                    className="w-20 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>{t.column_status}</Text>
                </div>
            ),
            cell: ({ row }) => {
                const isActive = row.original.is_active ?? row.original.status_code === 'ACTIVE';
                const statusName = row.original.status_name || (isActive ? t.status_active : t.status_inactive);

                return (
                    <div className="w-20 text-left py-2.5">
                        <Pill
                            variant={isActive ? 'success' : 'warning'}
                            className="whitespace-nowrap w-fit ml-0"
                        >
                            <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                            {statusName}
                        </Pill>
                    </div>
                );
            },
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
                                { label: t.action_edit, icon: Pencil, onClick: () => onEdit(row.original) },
                                { label: t.action_assign, icon: LayoutGrid, onClick: () => handlers.onAction('assign', row.original) },
                                { label: t.action_sort, icon: GripVertical, onClick: () => handlers.onAction('sort', row.original) },
                                { label: t.action_duplicate, icon: Copy, onClick: () => handlers.onAction('duplicate', row.original) },
                                { label: t.action_delete, icon: Trash2, onClick: () => handlers.onAction('delete', row.original), variant: 'destructive' },
                            ]}
                        />
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];
};
