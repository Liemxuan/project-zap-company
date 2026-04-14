import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2 } from "lucide-react";
import { ModifierGroup } from '@/services/modifier-group/modifier-group.model';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Text } from '@/genesis/atoms/typography/text';

export const MODIFIER_GROUP_LABELS = {
    id: "ID",
    name: "NAME",
    locations: "LOCATION",
    acronymn: "ACRONYMN",
    display_type: "DISPLAY TYPE",
    total_item: "TOTAL ITEMS",
    status: "STATUS",
    actions: "ACTION"
};

export const getModifierGroupColumns = (
    onEdit: (item: ModifierGroup) => void,
    onDelete: (item: ModifierGroup) => void
): ColumnDef<ModifierGroup>[] => [
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
                    /></div>
            ),
            cell: ({ row }) => (
                <div className="w-12 px-7">
                    <Checkbox
                        checked={row.getIsSelected()}
                        onCheckedChange={(value) => row.toggleSelected(!!value)}
                        aria-label="Select row"
                        className="translate-y-0.5"
                    /></div>
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
                    <Text size='label-small' className="font-semibold text-foreground truncate uppercase">ID</Text>
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
                            src={""}
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
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "Locations",
            header: () => (
                <div className="w-48 text-left tracking-widest cursor-pointer transition-colors">
                    <Text size='label-small' className='font-semibold'>Location</Text>
                </div>
            ),
            cell: ({ row }) => {
                const locations = row.original.locations || ['All branches'];
                return (
                    <div className="w-48 py-2.5 text-left">
                        <div className="flex flex-wrap gap-1">
                            {locations.map((loc, idx) => (
                                <span key={idx} className="px-1.5 py-0.5 rounded bg-surface-variant text-[10px] font-medium text-on-surface-variant border border-border/50">
                                    {loc}
                                </span>
                            ))}
                        </div>
                    </div>
                )
            },
        },
        {
            id: "Display Type",
            accessorKey: "display_type",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Display Type</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 text-left">
                    <Pill variant="neutral" className="text-[10px] font-mono tracking-wider">
                        {row.original.display_type?.toLowerCase()}
                    </Pill>
                </div>
            ),
        },
        {
            id: "Total Item",
            accessorKey: "total_item",
            header: ({ column }) => (
                <div
                    className="w-30 text-right pr-4 tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Total Items</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-30 text-right py-2.5 pr-4">
                    <span className="font-bold text-foreground">
                        {row.original.total_item ?? 0}
                    </span>
                </div>
            ),
        },
        {
            id: "Status",
            accessorKey: "status",
            header: ({ column }) => (
                <div
                    className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Status</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 text-left py-2.5">
                    <Pill
                        variant={row.original.status === 'Active' ? 'success' : 'warning'}
                        className="whitespace-nowrap w-fit ml-auto"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                        {row.original.status}
                    </Pill>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            header: () => <div className="w-24 pr-7 text-right tracking-widest transition-colors"><Text size='label-small' className='font-semibold'>Action</Text></div>,
            cell: ({ row }) => (
                <div className="w-24 pr-7 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end">
                        <QuickActionsDropdown
                            actions={[
                                { label: 'Edit', icon: Pencil, onClick: () => onEdit(row.original) },
                                { label: 'Duplicate', icon: Copy, onClick: () => { } },
                                { label: 'Delete', icon: Trash2, onClick: () => onDelete(row.original), variant: 'destructive' },
                            ]}
                        />
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];
