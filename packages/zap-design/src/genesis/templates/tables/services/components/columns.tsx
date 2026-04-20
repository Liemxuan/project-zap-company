import React from 'react';
import { ColumnDef } from '@tanstack/react-table';
import { Pill } from '@/genesis/atoms/status/pills';
import { Checkbox } from '@/genesis/atoms/interactive/checkbox';
import { QuickActionsDropdown } from '@/genesis/molecules/quick-actions-dropdown';
import { Pencil, Copy, Trash2 } from "lucide-react";
import { Service } from '@/services/service/service.model';
import { Avatar } from '@/genesis/atoms/status/avatars';
import { Text } from '@/genesis/atoms/typography/text';

export const getServiceColumns = (
    handleEdit: (item: Service) => void,
    handleDelete: (item: Service) => void,
    handleView: (item: Service) => void,
    t: any
): ColumnDef<Service>[] => [
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
            accessorKey: "id",
            header: () => <div className="w-32 text-left tracking-widest transition-colors"><Text size='label-small' className='font-semibold'>{t.label_id}</Text></div>,
            cell: ({ row }) => (
                <div className="w-32 py-2.5 text-left font-dev font-bold text-on-surface/70">
                    {row.original.serial_id}
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            accessorKey: "name",
            header: () => <div className="w-80 text-left tracking-widest transition-colors">
                <Text size='label-small' className='font-semibold'>{t.label_name}</Text></div>,
            cell: ({ row }) => (
                <div className="w-80 py-2.5 text-left">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 flex items-center justify-center shrink-0 overflow-hidden">
                            <Avatar
                                initials={row.original.acronym || row.original.name.substring(0, 2)}
                                size="sm"
                                fallback={row.original.acronym || row.original.name.substring(0, 2)}
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
            accessorKey: "category",
            header: () => <div className="w-40 text-left tracking-widest transition-colors"><Text size='label-small' className='font-semibold'>{t.label_category}</Text></div>,
            cell: ({ row }) => (
                <div className="w-40 py-2.5 text-left text-on-surface/70">
                    {row.original.category}
                </div>
            ),
        },
        {
            accessorKey: "price",
            header: () => <div className="w-32 text-left tracking-widest transition-colors"><Text size='label-small' className='font-semibold'>{t.label_price}</Text></div>,
            cell: ({ row }) => (
                <div className="w-32 py-2.5 text-left font-dev text-on-surface/80">
                    {row.original.price.toLocaleString()} VND
                </div>
            ),
        },
        {
            accessorKey: "status_id",
            header: () => <div className="w-32 text-left tracking-widest transition-colors"><Text size='label-small' className='font-semibold'>{t.label_status}</Text></div>,
            cell: ({ row }) => (
                <div className="w-32 py-2.5 flex text-left">
                    <Pill variant={row.original.status_color as any || 'success'}>
                        {row.original.status_id === 'active' ? t.status_active : t.status_inactive}
                    </Pill>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
        {
            id: "actions",
            header: () => <div className="w-24 pr-7 text-right tracking-widest transition-colors"></div>,
            cell: ({ row }) => (
                <div className="w-24 pr-7 py-2.5 text-right" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-end">
                        <QuickActionsDropdown
                            actions={[
                                { label: t.btn_edit, icon: Pencil, onClick: () => handleEdit(row.original) },
                                { label: t.btn_duplicate, icon: Copy, onClick: () => console.log('Duplicate', row.original) },
                                { label: t.btn_delete, icon: Trash2, onClick: () => handleDelete(row.original), variant: 'destructive' },
                            ]}
                        />
                    </div>
                </div>
            ),
            enableSorting: false,
            enableHiding: false,
        },
    ];