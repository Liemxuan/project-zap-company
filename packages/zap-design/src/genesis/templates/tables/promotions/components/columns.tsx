import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2 } from "lucide-react";

/**
 * Get columns definition for Promotions table
 */
export const getColumns = (handlers: {
    onAction: (type: string, item: any) => void;
}): ColumnDef<any>[] => [
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
            id: "PromotionName",
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
                <div className="w-64 py-2.5 text-left">
                    <span className="font-semibold text-foreground text-sm truncate">{row.original.name}</span>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        // {
        //     id: "DiscountValue",
        //     accessorKey: "discount_value",
        //     header: ({ column }) => (
        //         <div
        //             className="w-32 text-right pr-4 font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
        //             onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        //         >
        //             Discount value
        //         </div>
        //     ),
        //     cell: ({ row }) => {
        //         const isPercentage = row.original.discount_type === 'Percentage';
        //         const formatted = isPercentage
        //             ? `${row.original.discount_value}%`
        //             : new Intl.NumberFormat('vi-VN').format(row.original.discount_value || 0);

        //         return (
        //             <div className="w-32 text-right py-2.5 pr-4">
        //                 <span className="font-bold text-foreground">
        //                     {formatted} {!isPercentage && '₫'}
        //                 </span>
        //             </div>
        //         );
        //     },
        //     enableSorting: false,
        //     enableHiding: true,
        // },
        {
            id: "DiscountType",
            accessorKey: "discount_type",
            header: ({ column }) => (
                <div
                    className="w-32 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Type
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-32 py-2.5 text-left capitalize">
                    <span className="text-on-surface-variant text-sm">{row.original.discount_type}</span>
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: "ApplyTo",
            accessorKey: "apply_to",
            header: ({ column }) => (
                <div
                    className="w-48 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Apply to
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-48 py-2.5 text-left">
                    <span className="text-on-surface-variant text-sm truncate">{row.original.apply_to}</span>
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
                    className="w-48 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Location
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-48 py-2.5 text-left overflow-hidden">
                    <div className="flex flex-wrap gap-1">
                        {(row.original.locations || []).map((loc: string) => (
                            <span key={loc} className="text-[10px] bg-surface-variant px-1.5 py-0.5 rounded text-on-surface-variant font-medium">
                                {loc}
                            </span>
                        ))}
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: "Schedule",
            accessorKey: "schedule",
            header: ({ column }) => (
                <div
                    className="w-48 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Schedule
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-48 py-2.5 text-left">
                    <span className="text-on-surface-variant text-sm truncate">{row.original.schedule || 'No schedule'}</span>
                </div>
            ),
            enableSorting: false,
            enableHiding: true,
        },
        {
            id: "Status",
            accessorKey: "is_active",
            header: ({ column }) => (
                <div
                    className="w-20 text-left font-mono text-[10px] tracking-widest text-muted-foreground cursor-pointer hover:text-foreground transition-colors uppercase"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Status
                </div>
            ),
            cell: ({ row }) => (
                <div className="w-20 text-left py-2.5">
                    <Pill
                        variant={row.original.is_active ? 'success' : 'warning'}
                        className="whitespace-nowrap w-fit ml-auto"
                    >
                        <div className="w-1.5 h-1.5 rounded-full bg-current mr-1.5 opacity-80 shrink-0" />
                        {row.original.is_active ? 'Active' : 'Inactive'}
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
                                { label: 'Edit', icon: Pencil, onClick: () => handlers.onAction('edit', row.original) },
                                { label: 'Duplicate', icon: Copy, onClick: () => handlers.onAction('duplicate', row.original) },
                                { label: 'Delete', icon: Trash2, onClick: () => handlers.onAction('delete', row.original), variant: 'destructive' },
                            ]}
                        />
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];
