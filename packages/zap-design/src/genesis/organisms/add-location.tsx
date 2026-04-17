"use client";

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose, DialogTrigger } from '../molecules/dialog';
import { Button } from '../atoms/interactive/button';
import { Checkbox } from '../atoms/interactive/checkbox';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../molecules/pagination';

export const ALL_LOCATIONS = [
    { id: 1, name: 'Main Street Coffee' },
    { id: 2, name: 'Airport Kiosk' },
    { id: 3, name: 'Downtown Branch' },
    { id: 4, name: 'Westside Mall' },
    { id: 5, name: 'Campus Deli' },
    { id: 6, name: 'Riverside Cafe' },
    { id: 7, name: 'Central Station' },
    { id: 8, name: 'Plaza Food Court' },
];

export interface AddLocationProps {
    selectedLocations: any[];
    onSelectionChange: (locations: any[]) => void;
    trigger: React.ReactNode;
    title?: string;
}

export function AddLocation({
    selectedLocations,
    onSelectionChange,
    trigger,
    title = "Add Location"
}: AddLocationProps) {
    const [searchQuery, setSearchQuery] = useState('');

    const filteredLocations = ALL_LOCATIONS.filter(loc => 
        loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        loc.id.toString().includes(searchQuery)
    );

    const handleToggleLocation = (loc: typeof ALL_LOCATIONS[0]) => {
        onSelectionChange(
            selectedLocations.some(l => l.id === loc.id)
                ? selectedLocations.filter(l => l.id !== loc.id)
                : [...selectedLocations, loc]
        );
    };

    const handleToggleAll = () => {
        if (selectedLocations.length === filteredLocations.length && filteredLocations.length > 0) {
            onSelectionChange([]);
        } else {
            onSelectionChange(filteredLocations);
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
                            placeholder="Search Location Name, ID" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="rounded-xl overflow-hidden bg-white border border-outline-variant shadow-sm">
                        <div className="flex items-center gap-5 bg-[#f6f6f6] px-5 py-4 border-b border-outline-variant">
                            <Checkbox
                                id="select-all-locations"
                                checked={filteredLocations.length > 0 && selectedLocations.length === filteredLocations.length}
                                onCheckedChange={handleToggleAll}
                            />
                            <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 text-[13px] font-bold text-on-surface font-display text-muted-foreground text-transform-primary">
                                <span>ID</span>
                                <span>Name</span>
                            </div>
                            <div className="text-[13px] font-bold text-muted-foreground font-display text-right pr-2">{selectedLocations.length} Selected</div>
                        </div>
                        <div className="divide-y divide-outline-variant">
                            {filteredLocations.map((loc) => (
                                <label key={loc.id} className="flex items-center gap-5 px-5 py-[14px] hover:bg-slate-50 transition-colors cursor-pointer group-row">
                                    <Checkbox
                                        id={`location-${loc.id}`}
                                        checked={selectedLocations.some(sl => sl.id === loc.id)}
                                        onCheckedChange={() => handleToggleLocation(loc)}
                                    />
                                    <div className="flex-1 grid grid-cols-[60px_1fr] gap-4 items-center">
                                        <span className="text-[15px] font-bold text-on-surface font-display">{loc.id}</span>
                                        <div className="flex items-center gap-4">
                                            <div className="w-10 h-10 rounded-full bg-slate-200 text-white flex items-center justify-center text-sm font-bold shadow-sm">
                                                {loc.name.substring(0, 2).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-[15px] font-bold text-on-surface font-display leading-tight">{loc.name}</div>
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
