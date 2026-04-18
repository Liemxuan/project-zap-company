"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogBody, DialogFooter, DialogClose, DialogTrigger } from '../molecules/dialog';
import { Button } from '../atoms/interactive/button';
import { Input } from '../atoms/interactive/inputs';
import { SelectField, SelectItem } from '../atoms/interactive/select';
import { Text } from '../atoms/typography/text';
import { X, Info } from 'lucide-react';
import { Heading } from '../atoms/typography/headings';
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '../molecules/pagination';
import { Label } from '../atoms/interactive/label';

export interface ExceptionRow {
    id: string;
    locationGroup: string;
    price: string;
}

export interface EditPerLocationProps {
    trigger: React.ReactNode;
}

export function EditPerLocation({ trigger }: EditPerLocationProps) {
    const lp = "floating";

    const [exceptions, setExceptions] = useState<ExceptionRow[]>([
        { id: '1', locationGroup: 'Group Mien Nam', price: '20000' },
        { id: '2', locationGroup: '', price: '' }
    ]);

    const addException = () => {
        setExceptions([...exceptions, { id: Math.random().toString(), locationGroup: '', price: '' }]);
    };

    const removeException = (id: string) => {
        setExceptions(exceptions.filter(ex => ex.id !== id));
    };

    const updateException = (id: string, field: keyof ExceptionRow, value: string) => {
        setExceptions(exceptions.map(ex => ex.id === id ? { ...ex, [field]: value } : ex));
    };
    const [isCreating, setIsCreating] = useState(false);

    return (
        <Dialog open={isCreating} onOpenChange={setIsCreating}>
            <DialogTrigger asChild>
                {trigger}
            </DialogTrigger>
            <DialogContent className="max-w-none w-screen h-screen p-0 border-none rounded-none bg-white gap-0" closeButtonPosition="header-left">
                <DialogHeader
                    className='relative border-b border-outline-variant'
                    closeButtonPosition="header-left"
                    closeButtonClassName='border-none bg-surface hover:bg-surface-variant/60'>
                    <div className='max-w-lg mx-auto text-center'>
                        <Heading level={2} className='text-transform-primary text-on-surface py-4'>Edit per location</Heading>
                    </div>
                    <div className='absolute right-4 top-2 flex gap-2'>
                        <Button variant="primary" size="md" className="text-transform-primary px-5 rounded-lg shadow-sm border border" onClick={() => setIsCreating(false)}>
                            Save
                        </Button>
                    </div>
                </DialogHeader>
                <DialogBody className="p-8 pb-32 space-y-10 flex-1 overflow-y-auto bg-white">
                    <div className='flex-1 overflow-auto bg-layer-canvas bg-white'>
                        <div className="w-full max-w-5xl mx-auto space-y-8 py-10 px-6">
                            {/* Top Row */}
                            <div className="grid grid-cols-2 gap-6 mx-auto">
                                <Input
                                    label="39,000"
                                    placeholder="Option 1"
                                    value="Option 1"
                                    variant="outlined"
                                    position={lp}
                                    readOnly
                                    suffix={<Info className="w-4 h-4 text-muted-foreground/50" />}
                                    className="bg-white"
                                />
                                <SelectField
                                    label="Location"
                                    value="all"
                                    position={lp}
                                    triggerClassName="bg-white"
                                >
                                    <SelectItem value="all">All Locations</SelectItem>
                                </SelectField>
                            </div>
                            {/* Excluding Section */}
                            <div className="w-full mx-auto space-y-4">
                                <div className="flex items-center justify-between">
                                    <Heading level={4} className="text-on-surface">Excluding</Heading>
                                    <Button mode="link" onClick={addException} className="text-primary font-bold hover:underline border-none capitalize">
                                        Add
                                    </Button>
                                </div>

                                <div className="rounded-xl border border-outline-variant overflow-hidden">
                                    <div className="grid grid-cols-[1fr_120px_50px] gap-4 px-4 py-3 bg-surface-container/5 border-b border-outline-variant text-on-surface tracking-wide items-center">
                                        <div>
                                            <Text size="body-small" className='font-semibold'>Location Group</Text>
                                        </div>
                                        <div className="flex items-center justify-end gap-4">
                                            <Text size="body-small" className='font-semibold'>Price</Text>
                                        </div>
                                        <div className='flex items-center justify-end gap-2'>
                                            <Button variant="primary" size="sm" className="px-1.5 ml-auto text-transform-primary">Apply</Button>
                                        </div>
                                    </div>
                                    <div className="divide-y divide-outline-variant">
                                        {exceptions.map((ex) => (
                                            <div key={ex.id} className="grid grid-cols-[1fr_120px_50px] gap-4 px-4 py-3 items-center">
                                                <SelectField
                                                    value={ex.locationGroup}
                                                    onValueChange={(val) => updateException(ex.id, 'locationGroup', val)}
                                                    placeholder="Select Location Group"
                                                    triggerClassName="h-10 border-outline-variant rounded-md"
                                                >
                                                    <SelectItem value="Group Mien Nam">Group Mien Nam</SelectItem>
                                                    <SelectItem value="Group Mien Bac">Group Mien Bac</SelectItem>
                                                </SelectField>

                                                <Input
                                                    placeholder="Enter Price"
                                                    value={ex.price}
                                                    onChange={(e) => updateException(ex.id, 'price', e.target.value)}
                                                    className="h-10 rounded-md text-right"
                                                />

                                                <button onClick={() => removeException(ex.id)} className="flex items-center justify-center w-6 h-6 rounded-full bg-slate-200 text-slate-500 hover:bg-error hover:text-white transition-colors mx-auto">
                                                    <X size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                            </div>
                            {/* Applicable Location Section */}
                            <div className="w-full mx-auto pt-8 border-t border-outline-variant space-y-6">
                                <Heading level={4} className="text-on-surface">Applicable Location</Heading>
                                <div className="rounded-xl border border-outline-variant overflow-hidden">
                                    <div className="grid grid-cols-[80px_1fr_180px] gap-4 px-4 py-3 bg-surface-container/5 border-b border-outline-variant text-on-surface tracking-wide">
                                        <div><Text size="body-small" className='font-semibold'>ID</Text></div>
                                        <div><Text size="body-small" className='font-semibold'>Location Name</Text></div>
                                        <div><Text size="body-small" className='font-semibold'>Price</Text></div>
                                    </div>
                                    <div className="divide-y divide-outline-variant">
                                        {[
                                            { id: '760', name: 'The Light Phu Yen', price: '20,000' },
                                            { id: '192', name: 'Thiso Mall Thu Thiem', price: '20,000' },
                                            { id: '192', name: 'Thiso Mall Thu Thiem', price: '20,000' },
                                            { id: '192', name: 'Thiso Mall Thu Thiem', price: '20,000' },
                                            { id: '760', name: 'The Light Phu Yen', price: '20,000' },
                                            { id: '192', name: 'Thiso Mall Thu Thiem', price: '20,000' },
                                            { id: '192', name: 'Thiso Mall Thu Thiem', price: '20,000' },
                                        ].map((loc, i) => (
                                            <div key={i} className="grid grid-cols-[80px_1fr_180px] gap-4 px-4 py-2 items-center hover:bg-slate-50 transition-colors">
                                                <div className="text-muted-foreground"><Text size="body-small"> {loc.id}</Text></div>
                                                <div className="text-on-surface"><Text size="body-small">{loc.name}</Text></div>
                                                <div className="flex items-center gap-3">
                                                    <Input
                                                        value={loc.price}
                                                        className="h-9 rounded-md bg-white border-outline-variant text-right pr-3"
                                                        readOnly
                                                    />
                                                    <Button mode="link" className="text-muted-foreground/40 hover:text-primary transition-colors border-none"><Text size="label-small">Update</Text></Button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Pagination */}
                                <div className="flex justify-center pt-2 pb-4">
                                    <Pagination>
                                        <PaginationContent>
                                            <PaginationItem>
                                                <PaginationPrevious href="#" className="opacity-50 pointer-events-none" />
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#" isActive>1</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#">2</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#">3</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationLink href="#">4</PaginationLink>
                                            </PaginationItem>
                                            <PaginationItem>
                                                <PaginationNext href="#" />
                                            </PaginationItem>
                                        </PaginationContent>
                                    </Pagination>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogBody>
            </DialogContent>
        </Dialog>
    );
}
