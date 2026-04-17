import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Pencil, Copy, Trash2, Eye } from "lucide-react";
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { Text } from '@/genesis/atoms/typography/text';

interface GetColumnsProps {
    onAction: (type: string, item: any) => void;
    t: any;
}

export const getColumns = ({ onAction, t }: GetColumnsProps): ColumnDef<any>[] => [
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
        id: "BrandId",
        accessorKey: "id",
        header: ({ column }) => (
            <div
                className="w-24 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <Text size='label-small' className="font-semibold text-foreground truncate uppercase">{t.column_id}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-24 truncate font-dev text-transform-tertiary text-muted-foreground text-left py-2.5">
                {row.original.id}
            </div>
        ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: "Name",
        accessorKey: "name",
        header: ({ column }) => (
            <div
                className="w-80 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <Text size='label-small' className='font-semibold'>{t.column_name}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-80 py-2.5 text-left cursor-pointer group" onClick={() => onAction('view', row.original)}>
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                        <Avatar
                            src={row.original.media_url}
                            initials={row.original.acronymn}
                            size="sm"
                            fallback={row.original.acronymn}
                            className="w-full h-full object-cover border-[1px] border-border group-hover:border-primary transition-colors"
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
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: "ReferenceId",
        accessorKey: "reference_id",
        header: ({ column }) => (
            <div
                className="w-48 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <Text size='label-small' className='font-semibold'>{t.column_referenceId}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-48 py-2.5 text-left font-dev text-transform-tertiary text-muted-foreground truncate">
                {row.original.reference_id || '---'}
            </div>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "ApplyItem",
        accessorKey: "apply_item_count",
        header: ({ column }) => (
            <div
                className="w-32 text-right tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <Text size='label-small' className='font-semibold'>{t.column_applyItem}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-32 text-right py-2.5">
                <span className="font-bold text-foreground">
                    {row.original.apply_item_count ?? 0}
                </span>
            </div>
        ),
        enableSorting: true,
        enableHiding: true,
    },
    {
        id: "Status",
        accessorKey: "status_id",
        header: ({ column }) => (
            <div
                className="w-32 text-left tracking-widest cursor-pointer hover:text-foreground transition-colors"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
                <Text size='label-small' className='font-semibold'>{t.column_status}</Text>
            </div>
        ),
        cell: ({ row }) => (
            <div className="w-32 text-left py-2.5">
                <Pill
                    variant={row.original.status_id === 1 ? 'success' : 'warning'}
                    className="whitespace-nowrap w-fit ml-auto"
                >
                    <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                    {row.original.status_id === 1 ? t.status_active : t.status_inactive}
                </Pill>
            </div>
        ),
        enableSorting: true,
        enableHiding: false,
    },
    {
        id: "Action",
        header: () => <div className="w-24 pr-4 tracking-widest text-right transition-colors"><Text size='label-small' className='font-semibold'>{t.column_action}</Text></div>,
        cell: ({ row }) => (
            <div className="w-24 pr-4 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                <QuickActionsDropdown
                    actions={[
                        { label: t.action_view, icon: Eye, onClick: () => onAction('view', row.original) },
                        { label: t.action_edit, icon: Pencil, onClick: () => onAction('edit', row.original) },
                        { label: t.action_duplicate, icon: Copy, onClick: () => onAction('duplicate', row.original) },
                        { label: t.action_delete, icon: Trash2, onClick: () => onAction('delete', row.original), variant: 'destructive' },
                    ]}
                />
            </div>
        ),
        enableSorting: false,
        enableHiding: false,
    },
];
