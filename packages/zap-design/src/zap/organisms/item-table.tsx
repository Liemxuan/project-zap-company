'use client';

import * as React from 'react';
import { 
    Table, 
    TableBody, 
    TableCell, 
    TableHead, 
    TableHeader, 
    TableRow 
} from '../../genesis/molecules/table';
import { Checkbox } from '../../genesis/atoms/interactive/checkbox';
import { Button } from '../../genesis/atoms/interactive/button';
import { Icon } from '../../genesis/atoms/icons/Icon';
import { 
    DropdownMenu, 
    DropdownMenuContent, 
    DropdownMenuItem, 
    DropdownMenuTrigger 
} from '../../genesis/molecules/dropdown-menu';
import { Text } from '../../genesis/atoms/typography/text';
import { cn } from '../../lib/utils';

export interface Item {
    id: string;
    name: string;
    description: string;
    status: 'active' | 'inactive' | 'pending';
    price: string;
}

interface ItemTableProps {
    items: Item[];
    onEdit?: (item: Item) => void;
    onDelete?: (item: Item) => void;
    onDuplicate?: (item: Item) => void;
}

export function ItemTable({ items, onEdit, onDelete, onDuplicate }: ItemTableProps) {
    const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());

    const toggleAll = (checked: boolean) => {
        if (!checked) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(items.map(item => item.id)));
        }
    };

    const toggleOne = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) {
            newSelected.delete(id);
        } else {
            newSelected.add(id);
        }
        setSelectedIds(newSelected);
    };

    return (
        <div data-slot="item-table-wrapper" className="w-full bg-layer-panel border border-outline-variant rounded-lg overflow-hidden transition-all duration-300">
            <Table>
                <TableHeader>
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="w-[50px]" style={{ paddingLeft: 'var(--table-cell-padding, 1.5rem)', paddingRight: 'var(--table-cell-padding, 1.5rem)' }}>
                            <Checkbox 
                                checked={selectedIds.size === items.length && items.length > 0} 
                                onCheckedChange={(checked) => toggleAll(!!checked)}
                                aria-label="Select all"
                            />
                        </TableHead>
                        <TableHead className="w-[100px]" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1rem)' }}>ID</TableHead>
                        <TableHead style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1rem)' }}>NAME</TableHead>
                        <TableHead style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1rem)' }}>DESCRIPTION</TableHead>
                        <TableHead className="w-[120px]" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1rem)' }}>STATUS</TableHead>
                        <TableHead className="w-[100px] text-right" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1.5rem)' }}>PRICE</TableHead>
                        <TableHead className="w-[80px] text-right" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1.5rem)' }}></TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {items.map((item) => (
                        <TableRow 
                            key={item.id} 
                            data-state={selectedIds.has(item.id) ? "selected" : undefined}
                            className={cn(
                                "group transition-colors",
                                selectedIds.has(item.id) ? "bg-primary-fixed-dim/10" : "hover:bg-surface-variant/40"
                            )}
                        >
                            <TableCell style={{ paddingLeft: 'var(--table-cell-padding, 1.5rem)', paddingRight: 'var(--table-cell-padding, 1.5rem)' }}>
                                <Checkbox 
                                    checked={selectedIds.has(item.id)} 
                                    onCheckedChange={() => toggleOne(item.id)}
                                    aria-label={`Select ${item.name}`}
                                />
                            </TableCell>
                            <TableCell className="whitespace-nowrap" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1rem)' }}>
                                <Text size="dev-metric" className="text-muted-foreground">
                                    {item.id}
                                </Text>
                            </TableCell>
                            <TableCell className="whitespace-nowrap" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1rem)' }}>
                                <Text size="label-medium" weight="medium" className="text-transform-secondary">
                                    {item.name}
                                </Text>
                            </TableCell>
                            <TableCell className="max-w-[300px]" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1rem)' }}>
                                <Text size="label-medium" className="text-muted-foreground truncate">
                                    {item.description}
                                </Text>
                            </TableCell>
                            <TableCell style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1rem)' }}>
                                <div className={cn(
                                    "inline-flex items-center px-2.5 py-0.5 rounded-full",
                                    item.status === 'active' ? "bg-success-container/30 text-on-success-container" :
                                    item.status === 'inactive' ? "bg-error-container/30 text-on-error-container" :
                                    "bg-warning-container/30 text-on-warning-container"
                                )}>
                                    <Text size="label-small" weight="bold" className="text-transform-primary tracking-wider">
                                        {item.status}
                                    </Text>
                                </div>
                            </TableCell>
                            <TableCell className="text-right" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1.5rem)' }}>
                                <Text size="dev-metric" weight="bold">
                                    {item.price}
                                </Text>
                            </TableCell>
                            <TableCell className="text-right" style={{ paddingLeft: 'var(--table-cell-padding, 1rem)', paddingRight: 'var(--table-cell-padding, 1.5rem)' }}>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-surface-variant">
                                            <Icon name="more_vert" size={20} className="text-muted-foreground" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="w-[160px] bg-layer-dialog">
                                        <DropdownMenuItem onClick={() => onEdit?.(item)} className="cursor-pointer">
                                            <Icon name="edit" size={16} className="mr-2" />
                                            <Text as="span" size="label-medium" className="text-transform-tertiary">Edit</Text>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem onClick={() => onDuplicate?.(item)} className="cursor-pointer">
                                            <Icon name="content_copy" size={16} className="mr-2" />
                                            <Text as="span" size="label-medium" className="text-transform-tertiary">Duplicate</Text>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem 
                                            className="text-error focus:text-error focus:bg-error-container/20 cursor-pointer"
                                            onClick={() => onDelete?.(item)}
                                        >
                                            <Icon name="delete" size={16} className="mr-2" />
                                            <Text as="span" size="label-medium" className="text-transform-tertiary">Delete</Text>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
