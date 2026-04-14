import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Trash2, Copy } from "lucide-react";
import { format } from 'date-fns';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Text } from '@/genesis/atoms/typography/text';

export const POLICY_LABELS = {
    id: "ID",
    name: "NAME",
    acronymn: "ACRONYMN",
    type: "TYPE",
    applied_to: "APPLIED TO",
    updated_at: "LAST UPDATED",
    status: "STATUS",
    actions: "ACTIONS"
};

export const getPolicyColumns = (
    onEdit: (item: any) => void,
    onDelete: (item: any) => void
): ColumnDef<any>[] => [
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
                    className="w-20 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className="font-semibold text-foreground truncate uppercase">ID</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-20 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
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
                    className="w-80 text-left tracking-widest cursor-pointer transition-colors"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    <Text size='label-small' className='font-semibold'>Name</Text>
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar
                                src={""}
                                initials={row.original.acronymn}
                                size="sm"
                                fallback={row.original.acronymn}
                                className="w-full h-full object-cover border-[1px] border-border"
                            />
                        </div>
                        <div className="flex flex-col min-w-0">
                            <Text size='label-small' className='font-semibold text-foreground truncate'>
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
            id: "Type",
            accessorKey: "type",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {POLICY_LABELS.type}
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground">
                    {row.original.type}
                </div>
            ),
        },
        {
            id: "Applied To",
            accessorKey: "applied_to",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {POLICY_LABELS.applied_to}
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground">
                    {row.original.applied_to}
                </div>
            ),
        },
        {
            id: "Last Updated",
            accessorKey: "updated_at",
            header: ({ column }) => (
                <div
                    className="w-40 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    {POLICY_LABELS.updated_at}
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-40 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground">
                    {format(new Date(row.original.updated_at), 'dd/MM/yyyy HH:mm')}
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
                    {POLICY_LABELS.status}
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
            header: () => <div className="w-24 pr-7" />,
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
