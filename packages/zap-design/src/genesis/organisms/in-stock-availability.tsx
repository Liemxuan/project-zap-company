"use client";

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose, DialogTrigger } from '../molecules/dialog';
import { Button } from '../atoms/interactive/button';
import { Switch } from '../atoms/interactive/switch';
import { Text } from '../atoms/typography/text';

export const STOCK_LOCATIONS = [
    { id: '1', name: 'Sarimi' },
    { id: '2', name: 'Sarica' },
    { id: '3', name: 'Sala' },
];

export interface InStockAvailabilityProps {
    stockStatus: Record<string, boolean>; // map of location id to boolean (true = in stock, false = sold out)
    onStockStatusChange: (status: Record<string, boolean>) => void;
    trigger: React.ReactNode;
}

export function InStockAvailability({
    stockStatus,
    onStockStatusChange,
    trigger
}: InStockAvailabilityProps) {
    const handleToggle = (id: string, checked: boolean) => {
        onStockStatusChange({
            ...stockStatus,
            [id]: checked
        });
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-md px-0 pb-0 gap-0 overflow-hidden bg-background" closeButtonPosition="left">
                <DialogHeader className="px-6 py-4 border-b border-outline-variant flex-row items-center justify-center relative bg-white">
                    <DialogTitle className="text-xl">Availability</DialogTitle>
                </DialogHeader>
                <DialogBody className="p-6 space-y-4 max-h-[60vh] overflow-y-auto bg-white">
                    {STOCK_LOCATIONS.map((loc) => {
                        const inStock = stockStatus[loc.id] ?? true; // Default to true if not set
                        return (
                            <div key={loc.id} className="flex items-center justify-between px-5 py-4 border border-outline-variant rounded-xl shadow-sm">
                                <div className="flex items-center gap-4">
                                    <Switch 
                                        checked={inStock}
                                        onCheckedChange={(checked) => handleToggle(loc.id, checked)}
                                        className={!inStock ? "data-[state=unchecked]:bg-slate-300" : ""}
                                    />
                                    <div className="flex flex-col">
                                        <Text className="font-bold text-on-surface leading-tight text-[15px]">{loc.name}</Text>
                                        <Text size="body-small" className={`font-medium ${inStock ? 'text-muted-foreground' : 'text-error'}`}>
                                            {inStock ? 'In stock' : 'Sold out'}
                                        </Text>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </DialogBody>
                <DialogFooter className="px-6 py-4 border-t border-outline-variant bg-white flex justify-end">
                    <DialogClose asChild>
                        <Button variant="primary" className="px-8 rounded-lg shadow-sm">
                            Done
                        </Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
