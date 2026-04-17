"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose, DialogTrigger } from '../molecules/dialog';
import { Button } from '../atoms/interactive/button';
import { Checkbox } from '../atoms/interactive/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../molecules/pagination';

export const ALL_ITEMS = [
    { id: 1, name: 'Tra sen vang', img: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?q=80&w=200&auto=format&fit=crop', description: "3 variants " },
    { id: 2, name: 'Tra thanh dao' },
    { id: 3, name: 'Tra thach dao' },
    { id: 4, name: 'Tra thach vai' },
    { id: 5, name: 'Tra dau do' },
    { id: 6, name: 'Freeze tra xanh' },
    { id: 7, name: 'Freeze socola' },
    { id: 8, name: 'Phin sua da' },
];

export interface AddItemsProps {
    selectedItems: any[];
    onSelectionChange: (items: any[]) => void;
    trigger: React.ReactNode;
    title?: string;
    items?: any[];
}

export function AddItems({
    selectedItems,
    onSelectionChange,
    trigger,
    title = "Add Item",
    items
}: AddItemsProps) {
    const dataSource = items || ALL_ITEMS;
    const [searchQuery, setSearchQuery] = useState('');

    const filteredItems = dataSource.filter(item =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.id.toString().includes(searchQuery)
    );

    const handleToggleItem = (item: typeof ALL_ITEMS[0]) => {
        onSelectionChange(
            selectedItems.some(i => i.id === item.id)
                ? selectedItems.filter(i => i.id !== item.id)
                : [...selectedItems, item]
        );
    };

    const handleToggleAll = () => {
        if (selectedItems.length === filteredItems.length && filteredItems.length > 0) {
            onSelectionChange([]);
        } else {
            onSelectionChange(filteredItems);
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-2xl px-0 pb-0 gap-0 overflow-hidden bg-background" closeButtonPosition="left">
                <DialogHeader className="px-6 py-4 border-b border-outline-variant flex-row items-center justify-center relative">
                    <DialogTitle className="text-xl">{title}</DialogTitle>
                </DialogHeader>
                <DialogBody className="p-6 space-y-6 max-h-[60vh] overflow-y-auto bg-[#fafafa]">
                    <div className="relative shadow-sm group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-muted-foreground" />
                        <input
                            className="w-full pl-11 pr-4 h-12 rounded-xl border border-outline-variant bg-white text-[15px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all font-body text-on-surface"
                            placeholder="Search Item Name, ID"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden bg-white border border-outline-variant shadow-sm">
                        <div className="flex items-center gap-5 bg-[#f6f6f6] px-5 py-4 border-b border-outline-variant">
                            <Checkbox
                                id="select-all-items"
                                checked={filteredItems.length > 0 && selectedItems.length === filteredItems.length}
                                onCheckedChange={handleToggleAll}
                            />
                            <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 text-[13px] font-bold text-on-surface font-display text-muted-foreground text-transform-primary">
                                <span>ID</span>
                                <span>Name</span>
                            </div>
                            <div className="text-[13px] font-bold text-muted-foreground font-display text-right pr-2">{selectedItems.length} Selected</div>
                        </div>
                        <div className="divide-y divide-outline-variant">
                            {filteredItems.map((item) => (
                                <label key={item.id} className="flex items-center gap-5 px-5 py-[14px] hover:bg-slate-50 transition-colors cursor-pointer group-row">
                                    <Checkbox
                                        id={`item-${item.id}`}
                                        checked={selectedItems.some(si => si.id === item.id)}
                                        onCheckedChange={() => handleToggleItem(item)}
                                    />
                                    <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 items-center">
                                        <span className="text-[15px] font-bold text-on-surface font-display">{item.id}</span>
                                        <div className="flex items-center gap-4">
                                            {'img' in item ? (
                                                <img src={item.img} alt={item.name} className="w-10 h-10 rounded-full object-cover border border-outline-variant" />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-slate-200 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                                    {item.name.substring(0, 2).toUpperCase()}
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-[15px] font-bold text-on-surface font-display leading-tight">{item.name}</div>
                                                <div className="text-[13px] text-muted-foreground mt-1 font-body text-left">
                                                    <span className="opacity-70 text-left">{item.description}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </label>
                            ))}
                        </div>
                    </div>
                    <Pagination className="pt-2 pb-4">
                        <PaginationContent>
                            <PaginationItem><PaginationPrevious href="#" /></PaginationItem>
                            <PaginationItem><PaginationLink href="#" isActive>1</PaginationLink></PaginationItem>
                            <PaginationItem><PaginationNext href="#" /></PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </DialogBody>
                <DialogFooter className="px-6 py-4 border-t border-outline-variant bg-white">
                    <div className="flex w-full justify-end">
                        <DialogClose asChild>
                            <Button variant="primary" className="px-10 bg-primary hover:bg-primary/90 text-on-primary tracking-wide border-none rounded-xl h-11 w-full sm:w-auto text-[15px] font-bold shadow-md">Done</Button>
                        </DialogClose>
                    </div>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
