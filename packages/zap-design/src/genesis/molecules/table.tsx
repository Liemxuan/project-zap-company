'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';

function Table({ className, ...props }: React.HTMLAttributes<HTMLTableElement>) {
    return (
        <div data-slot="table-wrapper" className="relative w-full overflow-auto">
            <table data-slot="table" className={cn('w-full caption-bottom text-on-surface text-sm font-body text-transform-secondary', className)} {...props} />
        </div>
    );
}

function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <thead data-slot="table-header" className={cn('[&_tr]:border-b [&_tr]:border-outline-variant', className)} {...props} />;
}

function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn('border-t border-outline-variant bg-surface-variant font-medium last:[&>tr]:border-b-0', className)}
            {...props}
        />
    );
}

function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
    return (
        <tr
            data-slot="table-row"
            className={cn(
                'border-b border-outline-variant transition-colors [&:has(td):hover]:bg-surface-variant data-[state=selected]:bg-surface-variant',
                className,
            )}
            {...props}
        />
    );
}

function TableHead({ className, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                'h-12 px-4 text-left rtl:text-right align-middle text-on-surface-variant font-display text-transform-primary [&:has([role=checkbox])]:pe-0',
                className,
            )}
            {...props}
        />
    );
}

function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td data-slot="table-cell" className={cn('p-4 align-middle [&:has([role=checkbox])]:pe-0', className)} {...props} />
    );
}

function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
    return (
        <caption data-slot="table-caption" className={cn('mt-4 text-sm text-on-surface-variant font-body text-transform-secondary', className)} {...props} />
    );
}

export { Table, TableBody, TableCaption, TableCell, TableFooter, TableHead, TableHeader, TableRow };
