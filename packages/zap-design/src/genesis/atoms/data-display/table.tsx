'use client';

import * as React from 'react';
import { cn } from '../../../lib/utils';

export function Table({ className, style, ...props }: React.HTMLAttributes<HTMLTableElement>) {
    return (
        <div data-slot="table-wrapper" className="relative w-full overflow-auto">
            <table 
                data-slot="table" 
                className={cn('w-full caption-bottom text-on-surface text-[11px] font-medium text-transform-none', className)} 
                style={Object.assign({}, {
                    fontSize: 'var(--table-font-size, 11px)',
                    lineHeight: 'var(--table-line-height, 1.45)',
                    letterSpacing: 'var(--table-letter-spacing, 0.5px)',
                    fontWeight: 'var(--table-font-weight, 500)',
                    textTransform: 'var(--table-text-casing, none)' as React.CSSProperties['textTransform'],
                }, style)}
                {...props} 
            />
        </div>
    );
}

export function TableHeader({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <thead data-slot="table-header" className={cn('[&_tr]:border-b [&_tr]:border-outline-variant', className)} {...props} />;
}

export function TableBody({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return <tbody data-slot="table-body" className={cn('[&_tr:last-child]:border-0', className)} {...props} />;
}

export function TableFooter({ className, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) {
    return (
        <tfoot
            data-slot="table-footer"
            className={cn('border-t border-outline-variant bg-surface-variant font-medium last:[&>tr]:border-b-0', className)}
            {...props}
        />
    );
}

export function TableRow({ className, ...props }: React.HTMLAttributes<HTMLTableRowElement>) {
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

export function TableHead({ className, style, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) {
    return (
        <th
            data-slot="table-head"
            className={cn(
                'h-12 px-4 text-left rtl:text-right align-middle text-muted-foreground text-xs font-bold text-transform-primary tracking-wider [&:has([role=checkbox])]:pe-0',
                className,
            )}
            style={Object.assign({}, {
                fontSize: 'var(--table-header-font-size, 12px)',
                lineHeight: 'var(--table-header-line-height, 1.33)',
                letterSpacing: 'var(--table-header-letter-spacing, 0.4px)',
                fontWeight: 'var(--table-header-font-weight, 700)',
                textTransform: 'var(--table-header-text-casing, var(--text-transform-primary, uppercase))' as React.CSSProperties['textTransform'],
            }, style)}
            {...props}
        />
    );
}

export function TableCell({ className, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) {
    return (
        <td data-slot="table-cell" className={cn('p-4 align-middle [&:has([role=checkbox])]:pe-0', className)} {...props} />
    );
}

export function TableCaption({ className, ...props }: React.HTMLAttributes<HTMLTableCaptionElement>) {
    return (
        <caption data-slot="table-caption" className={cn('mt-4 text-sm text-on-surface-variant font-body text-transform-secondary', className)} {...props} />
    );
}
