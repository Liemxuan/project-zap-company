import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Trash2, Copy } from "lucide-react";
import { Unit } from '@/services/unit/unit.model';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Text } from '@/genesis/atoms/typography/text';

export const UNIT_LABELS = {
    id: "ID",
    name: "Name",
    short_name: "Short name",
    acronymn: "ACRONYMN",
    precision: "Precision",
    status: "Status",
    actions: "Action"
};

export const getUnitColumns = (
    onEdit: (item: Unit) => void,
    onDelete: (item: Unit) => void
): ColumnDef<Unit>[] => [
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
                    className="w-24 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate uppercase">ID</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
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
                    className="w-64 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Name</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-64 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar
                                className="w-full h-full object-cover border-[1px] border-border"
                                initials={row.original.acronymn}
                                size="sm"
                                fallback={row.original.acronymn}
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Text size='label-small' className='font-semibold text-foreground truncate'>{row.original.name}</Text>
                        </div>
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "ShortName",
            accessorKey: "short_name",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {UNIT_LABELS.short_name}
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground">
                    {row.original.short_name}
                </div>
            ),
        },
        {
            id: "Precision",
            accessorKey: "precision",
            header: ({ column }) => (
                <div
                    className="w-24 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {UNIT_LABELS.precision}
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-24 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground">
                    {row.original.precision}
                </div>
            ),
        },
        {
            id: "Status",
            accessorKey: "status",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {UNIT_LABELS.status}
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
            header: () => <div className="w-24 pr-7 text-right font-mono text-[10px] tracking-widest text-muted-foreground uppercase">{UNIT_LABELS.actions}</div>,
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
